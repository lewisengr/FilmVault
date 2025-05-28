using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FilmVault.Models.Entities
{
    public class SavedMovie
    {
        [Key]
        public int Id { get; set; }
        public int MovieId { get; set; }
        public Guid UserId { get; set; } // foreign key to the User table
        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}