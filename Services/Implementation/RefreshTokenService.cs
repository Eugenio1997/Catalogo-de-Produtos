using Domain.Entities;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using ProductCatalog.Services.Abstraction;

namespace ProductCatalog.Services.Implementation;

public class RefreshTokenService: IRefreshTokenService
{
    private ProductCatalogDbContext _context;
    
    public RefreshTokenService(ProductCatalogDbContext context)
    {
        _context = context;
    }
    
    public Guid GenerateRefreshToken()
    {
        return Guid.NewGuid();
    }

    public async Task<bool> DeleteRefreshTokenAsync(string email, CancellationToken cancellationToken)
    {
        var dbUser = await _context.Users!
            .SingleOrDefaultAsync(u => u.Email == email, cancellationToken);

        if (dbUser == null)
            return false;
                
        dbUser.RefreshToken = Guid.Empty;

        await _context.SaveChangesAsync(cancellationToken);

        return Task.FromResult(true).Result;
    }

    public async void SaveRefreshTokenAsync(string email, Guid newRefreshToken, CancellationToken cancellationToken)
    {
        var dbUser = await _context.Users!
            .SingleOrDefaultAsync(u => u.Email == email, cancellationToken);

        dbUser!.ExpiryTime = DateTime.Now.AddDays(dbUser.RememberMe ? 30 : 1);

        dbUser!.RefreshToken = newRefreshToken;
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> IsRefreshTokenExpiredAsync(string email, CancellationToken cancellationToken)
    {
        var dbUser = await _context.Users!
            .SingleOrDefaultAsync(u => u.Email == email, cancellationToken);
        
        if (dbUser == null)
            return false;

        var isExpiredRefreshToken = DateTime.Now >= dbUser.ExpiryTime;

        return isExpiredRefreshToken ? true : false;
    }
    
    public async Task<string> GetRefreshTokenAsync(string email, CancellationToken cancellationToken)
    {
        var dbUser = await _context.Users!.SingleOrDefaultAsync(u => u.Email == email, cancellationToken);
        if (dbUser == null)
            return null;
        else
            return dbUser.RefreshToken.ToString();
    }

}