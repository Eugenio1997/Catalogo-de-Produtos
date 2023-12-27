namespace Domain.Models.Request;

public class RequestRefreshModel
{
    public RequestRefreshModel(Guid refreshToken, string token)
    {
        RefreshToken = refreshToken;
        Token = token;
    }

    public Guid RefreshToken { get; set; }
    public string Token { get; set; }
}