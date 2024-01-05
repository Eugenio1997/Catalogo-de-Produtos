using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Response.User;

public class ResponseSigninUserModel
{
    
    public required int Id { get; set; }
    public string AccessToken { get; set; }
    public Guid RefreshToken { get; set; }
    
}