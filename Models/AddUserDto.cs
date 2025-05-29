using System.ComponentModel.DataAnnotations;

namespace FilmVault.Models
{
    public class AddUserDto
    {
        public required string Username { get; set; } = string.Empty;
        [EmailAddress]
        public required string Email { get; set; } = string.Empty;
        [Required]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Password must be at least 3 characters.")]
        public required string Password { get; set; } = string.Empty;
    }
}