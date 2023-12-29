using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Request.User;

public sealed class RequestSignupUserModel
{
    [EmailAddress]
    public required string Email { get; set; }
    public required string Password { get; set; }
    [MinLength(3,ErrorMessage = "The Firstname must contain at least 3 characters")]
    [MaxLength(12,ErrorMessage = "The Firstname must contain a maximum of 12 characters")]
    public required string FirstName { get; set; }
    [MinLength(3,ErrorMessage = "The LastName must contain at least 3 characters")]
    [MaxLength(12,ErrorMessage = "The LastName must contain a maximum of 12 characters")]
    public required string LastName { get; set; }
}