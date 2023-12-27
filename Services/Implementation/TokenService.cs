using System.IdentityModel.Tokens.Jwt;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Context;
using Microsoft.IdentityModel.Tokens;
using ProductCatalog.Services.Abstraction;

namespace ProductCatalog.Services.Implementation;

public class TokenService: ITokenService
{
    
    private readonly IConfiguration _configuration; 
    private readonly ProductCatalogDbContext _dbContext;
    private readonly JwtSecurityTokenHandler _tokenHandler = new JwtSecurityTokenHandler();
    private SecurityTokenDescriptor _tokenDescriptor = new SecurityTokenDescriptor();
    
    public TokenService(IConfiguration configuration, ProductCatalogDbContext dbContext)
    {
        _configuration = configuration;
        _dbContext = dbContext;
    }
    
    public string GenerateToken([Optional] User user, [Optional] ClaimsPrincipal claimsPrincipal)
    {
        var key = Encoding.ASCII.GetBytes(_configuration["SecretKey"]!);
        
        //generate token body for the first time
        if (user != null)
        {

            var claimsList = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
            };

            var identity = new ClaimsIdentity(claimsList);

            _tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(identity),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
        }
        //Update the token body with a new Identity which it contains Claims 
        else
        {
            _tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claimsPrincipal.Claims),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
        }
        
        //generating the token
        var token = _tokenHandler.CreateToken(_tokenDescriptor);

        // Encrypts the token and then it is returned
        return _tokenHandler.WriteToken(token);
    }

    
    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["SecretKey"]!)), //    private key/ secret key
            ValidateLifetime = false,
        };

        var principal = _tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
        if (securityToken is not JwtSecurityToken jwtSecurityToken ||
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenException("Invalid token");
        }

        return principal;
    }
}