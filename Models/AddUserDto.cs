using System.ComponentModel.DataAnnotations;

namespace FilmVault.Models
{
    public class AddUserDto
    {
        public required string Username { get; set; }
        [EmailAddress]
        public required string Email { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters.")]
        public required string Password { get; set; }

    }
}