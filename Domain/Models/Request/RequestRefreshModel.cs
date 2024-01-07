namespace Domain.Models.Request;

public class RequestRefreshModel
{
    public RequestRefreshModel(string refreshToken, string token)
    {
        RefreshToken = refreshToken;
        Token = token;
    }

    public string RefreshToken { get; set; }
    public string Token { get; set; }
}