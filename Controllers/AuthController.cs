using System.Text.RegularExpressions;
using Domain.Entities;
using Domain.Enums;
using Domain.Models.Request;
using Domain.Models.Request.User;
using Domain.Models.Response;
using Domain.Models.Response.User;
using Infrastructure.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProductCatalog.Services.Abstraction;
using ProductCatalog.Services.Implementation;

namespace ProductCatalog.Controllers;

[ApiController]
[Route("[Controller]")]
public class AuthController: ControllerBase
{
    
    private readonly ProductCatalogDbContext _context;
    private readonly IConfiguration _config;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenService _refreshTokenService;
    
    public AuthController(ProductCatalogDbContext context, IConfiguration config, ITokenService tokenService, IRefreshTokenService refreshTokenService)
    {
        _context = context;
        _config = config;
        _tokenService = tokenService;
        _refreshTokenService = refreshTokenService;
    }

    [NonAction]
    private bool ValidatePassword(string? password)
    {
        if (password == null)
        {
            return false;
        }
            
        /* The minimum amount of characters is 8

            At least:
                - 1 special character,
                - 1 numeric character,
                - 1 uppercase character,
                - 1 lowercase character
        */
        Regex regExpPassword = new(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$");

        var isValid = regExpPassword.IsMatch(password);

        return isValid;
    }
    
    /// <summary>
    /// Realiza o cadastro do usuário
    /// </summary>
    /// <param name="requestSignupUserModel">Um userModel o qual contém as seguintes propriedades: Email, Password, RememberMe, Firstname, Lastname; Todos são obrigatórios</param>
    /// <param name="cancellationToken">Usado para cancelar a requisão quando necessário</param>
    /// <returns>CreatedAtAction(nameof(Signup), new { id = newUser.Id }, newUser)</returns>
    //POST: auth/signup
    [HttpPost("signup")]
    [AllowAnonymous]
    public async Task<IActionResult> Signup(RequestSignupUserModel requestSignupUserModel, CancellationToken cancellationToken)
    {

        var query = _context.Users!;

        bool isPasswordValid = ValidatePassword(requestSignupUserModel.Password);

        if (!isPasswordValid)
            return BadRequest($"Password must contain at least 1 special character, 1 numeric character, 1 uppercase character and 1 lowercase character");
            
        if (query.AnyAsync(u => u.Email == requestSignupUserModel.Email.ToLower().Trim(), cancellationToken).Result)
        {
            return UnprocessableEntity("Email already exists");
        }
        
        
        var newUser = new User()
        {
            Email = requestSignupUserModel.Email.ToLower().Trim(),
            Password = requestSignupUserModel.Password,
            RememberMe = requestSignupUserModel.RememberMe,
            Firstname = requestSignupUserModel.FirstName,
            Lastname = requestSignupUserModel.LastName,
            CreatedAt = DateTime.Now.ToUniversalTime(),
            UpdatedAt = DateTime.Now.ToUniversalTime(),
            RoleId = _context.Roles!
                .Where(r => r.Name == Enum.GetName(RolesEnum.User)).Select(r => r.Id)
                .FirstOrDefault(),
        };


        await _context.Users!.AddAsync(newUser, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(Signup), new { id = newUser.Id }, newUser);

    }

    /// <summary>
    /// Realiza a autenticação do usuário no sistema
    /// </summary>
    /// <param name="requestSigninUserModel">Um requestSigninUserModel o qual contém as seguintes propriedades: Email, Password, RememberMe; Exceto o RememberMe que não é obrigatório</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    //POST: auth/signin
    [HttpPost("signin")]
    [AllowAnonymous]
    public async Task<IActionResult> Signin(RequestSigninUserModel requestSigninUserModel ,CancellationToken cancellationToken)
    {
        var query = _context.Users!;
        //verificar se há algum usuario na tabela Users cujo email bate com o email vindo do front
        
        if (!query
            .AnyAsync(u => u.Email == requestSigninUserModel.Email.ToLower().Trim(), cancellationToken).Result)
        {
            return NotFound("Email not registered, please insert a valid email");
        }

        var dbUser = query
            .SingleOrDefaultAsync(u => u.Email == requestSigninUserModel.Email, cancellationToken)
            .Result;

        //verificar se há algum usuario na tabela Users cujo password bata com o password vindo do front

        if(!dbUser!.VerifyPassword(requestSigninUserModel.Password))
        {
            return NotFound("Password incorrect , please insert a valid password");
        }
        
        //Verificar o campo RememberMe e a depender do caso, ao gerar o Token, atribuir uma duração de expiração diferente

        dbUser.RememberMe = requestSigninUserModel.RememberMe;
        
        _context.Update(dbUser);
        await _context.SaveChangesAsync(cancellationToken);
        
        //Gerar Token

        var access_token = _tokenService.GenerateToken(dbUser);
        
        //Gerar RefreshToken
        
        var refresh_token = _refreshTokenService.GenerateRefreshToken();

        _refreshTokenService.SaveRefreshTokenAsync(dbUser.Email, refresh_token, cancellationToken);

        var userCredentials = new ResponseSigninUserModel()
        {
            Id = dbUser.Id,
            AccessToken = access_token,
            RefreshToken = dbUser.RefreshToken
        };
        
        return Ok(userCredentials);
    }
    
    
        /// <summary>
        /// Gerar um novo AccessToken, por padrão, e gerar um novo RefreshToken se estiver expirado.
        /// </summary>
        /// <param name="requestRefreshModel">O objeto advindo do front contendo o AccessToken(expirado) e RefreshToken</param>
        /// <param name="cancellationToken">Um token para o caso do solicitante cancelar a requisição</param>
        /// <returns></returns>
        /// <exception cref="SecurityTokenException"></exception>
        //POST: auth/refresh
        [HttpPost]
        [Route("refresh")]
        [AllowAnonymous]
        private async Task<IActionResult> Refresh(RequestRefreshModel requestRefreshModel, CancellationToken cancellationToken)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(requestRefreshModel.Token);
            var email = principal.Identity!.Name;

            var dbUser = await _context.Users!.AsNoTracking()
                    .SingleOrDefaultAsync(u => u.Email == email, cancellationToken);

            var savedRefreshToken = await _refreshTokenService.GetRefreshTokenAsync(email, cancellationToken);

            if (savedRefreshToken == null)
                return NotFound();

            if (Guid.Parse(savedRefreshToken) != requestRefreshModel.RefreshToken)
                throw new SecurityTokenException("Invalid RefreshToken");

            if (await _refreshTokenService.IsRefreshTokenExpiredAsync(email, cancellationToken))
            {
                var newAccessToken = _tokenService.GenerateToken(null, principal);

                var newRefreshToken = _refreshTokenService.GenerateRefreshToken();

                await _refreshTokenService.DeleteRefreshTokenAsync(email, cancellationToken);

                _refreshTokenService.SaveRefreshTokenAsync(email, newRefreshToken, cancellationToken);

                if (dbUser == null)
                    return NotFound();

                return Ok(new ResponseRefreshModel(dbUser.Email, dbUser.RefreshToken, newAccessToken)
                );

            }

            var _newAccessToken = _tokenService.GenerateToken(null, principal);

            var response = new ResponseRefreshModel(dbUser!.Email, dbUser.RefreshToken, _newAccessToken);
            return Ok(response);
        }
    
}