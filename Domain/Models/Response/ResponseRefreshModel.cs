namespace Domain.Models.Response;

public class ResponseRefreshModel
{
    public ResponseRefreshModel(string email, Guid refreshToken, string token)
    {
        Email = email;
        RefreshToken = refreshToken;
        Token = token;
    }

    public string Email { get; set; }
    public Guid RefreshToken { get; set; }
    public string Token { get; set; }
}