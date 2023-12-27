using System.Runtime.InteropServices;
using System.Security.Claims;
using Domain.Entities;

namespace ProductCatalog.Services.Abstraction;

public interface ITokenService
{
    public string GenerateToken([Optional] User user, [Optional] ClaimsPrincipal claimsPrincipal);
    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}