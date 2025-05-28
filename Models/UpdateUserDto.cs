using System.ComponentModel.DataAnnotations;

namespace FilmVault.Models
{
    public class UpdateUserDto
    {
        public required string Username { get; set; }
        [EmailAddress]
        public required string Email { get; set; }
        public string? PasswordHash { get; set; }
        [StringLength(100, MinimumLength = 3)]
        public required string Password { get; set; }
    }
}