using FilmVault.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FilmVault.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<SavedMovie> SavedMovies { get; set; }

        // Optional - fluent API override
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SavedMovie>().HasOne(sm => sm.User)
                .WithMany()
                .HasForeignKey(sm => sm.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}