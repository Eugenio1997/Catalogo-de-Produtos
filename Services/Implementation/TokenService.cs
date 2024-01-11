using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Entities;
using Infrastructure.Context;
using Microsoft.IdentityModel.Tokens;
using ProductCatalog.Services.Abstraction;

namespace ProductCatalog.Services.Implementation;

public class TokenService: ITokenService
{
    private Byte[] Key;
    private readonly IConfiguration _configuration; 
    private readonly ProductCatalogDbContext _dbContext;
    private readonly JwtSecurityTokenHandler _tokenHandler = new JwtSecurityTokenHandler();
    private SecurityTokenDescriptor _tokenDescriptor = new SecurityTokenDescriptor();
    
    public TokenService(IConfiguration configuration, ProductCatalogDbContext dbContext)
    {
        _configuration = configuration;
        _dbContext = dbContext;
        Key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("SECRETY_KEY")!);
    }
    public string GenerateTokenOnSignin( User user)
    {
        
        //generate token body for the first time
        if (user != null)
        {

            var claimsList = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.Name),
            };

            var identity = new ClaimsIdentity(claimsList);

            _tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(identity),
                Expires = DateTime.UtcNow.AddMinutes(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Key), 
                    SecurityAlgorithms.HmacSha256Signature)
            };
        }
       
        
        //generating the token
        var token = _tokenHandler.CreateToken(_tokenDescriptor);

        // Encrypts the token and then it is returned
        return _tokenHandler.WriteToken(token);
    }

    public string GenerateNewTokenBasedOnClaimsPrincipal(ClaimsPrincipal claimsPrincipal)
    {
        //Update the token body with a new Identity which it contains Claims 

        _tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claimsPrincipal.Claims),
            Expires = DateTime.UtcNow.AddMinutes(30),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Key),
                SecurityAlgorithms.HmacSha256Signature)
        };
        
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
            IssuerSigningKey = new SymmetricSecurityKey(Key), //    private key/ secret key
            ClockSkew = new TimeSpan(0),
            ValidateLifetime = false
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