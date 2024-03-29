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

        var key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("SECRETY_KEY")!);


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
                    ClockSkew = new TimeSpan(0),
                    ValidateLifetime = true,
                };
            });
    }

    public static void ConfigureCors(this IServiceCollection service, IConfiguration configuration)
    {
        
        var hosts = configuration.GetSection("AllowedOrigins").Get<List<string>>();

        service.AddCors(opt =>
        {
            opt.AddPolicy("MyPolicy", corsPolicybuilder =>
            {
                corsPolicybuilder
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithOrigins(hosts.ToArray());
            });
        });

    }
}