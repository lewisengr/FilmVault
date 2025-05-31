using System.ComponentModel.DataAnnotations;

namespace FilmVault.Models.Entities
{
    public class Watchlist
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public int MovieId { get; set; }
    }
}