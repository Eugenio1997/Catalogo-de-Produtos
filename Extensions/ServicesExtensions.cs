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
    
    public static void ConfigureAuthentication(this IServiceCollection services,
        IConfiguration configuration)
    {

        var key = Encoding.ASCII.GetBytes(configuration.GetValue<string>("SecretKey")!);

        services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(opt =>
            {
                opt.RequireHttpsMetadata = false;
                opt.SaveToken = true;
                opt.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                };
            });
        
    }
}