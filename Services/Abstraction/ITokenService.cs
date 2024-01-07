using System.Runtime.InteropServices;
using System.Security.Claims;
using Domain.Entities;

namespace ProductCatalog.Services.Abstraction;

public interface ITokenService
{
    public string GenerateTokenOnSignin(User user);
    public string GenerateNewTokenBasedOnClaimsPrincipal(ClaimsPrincipal claimsPrincipal);
    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}