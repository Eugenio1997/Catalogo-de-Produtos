using Domain.Entities;

namespace ProductCatalog.Services.Abstraction;

public interface IRefreshTokenService
{
    public Guid GenerateRefreshToken();

    public void DeleteRefreshTokenAsync(string email, CancellationToken cancellationToken);

    public Task<bool> SaveRefreshTokenAsync(string email, Guid newRefreshToken, CancellationToken cancellationToken);
    
    public Task<bool> IsRefreshTokenExpiredAsync(string email, CancellationToken cancellationToken);

    public Task<string> GetRefreshTokenAsync(string email, CancellationToken cancellationToken);

}