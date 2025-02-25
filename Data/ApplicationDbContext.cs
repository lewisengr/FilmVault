using FilmVault.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FilmVault.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }

    }
}
