using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace ProductCatalog.Extensions;

public static class ServicesExtensions
{
    public static void ConfigureAuthorization(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthorization(opts =>
        {
            opts.AddPolicy("Admin", opt => opt.RequireRole("Admin"));
            opts.AddPolicy("User", opt => opt.RequireRole("User"));
        });
    }
}