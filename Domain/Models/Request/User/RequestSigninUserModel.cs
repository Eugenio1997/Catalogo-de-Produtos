using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Request.User;

public sealed class RequestSigninUserModel
{
    [EmailAddress]
    public required string Email { get; set; }
    public required string Password { get; set; }
    public bool RememberMe { get; set; }
}