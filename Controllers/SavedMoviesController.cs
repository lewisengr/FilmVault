using FilmVault.Data;
using FilmVault.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SavedMoviesController(ApplicationDbContext dbContext) : ControllerBase
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    [HttpPost("{movieId}")]
    public async Task<IActionResult> SaveMovie(int movieId)
    {
        try
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdString == null) return Unauthorized("User ID not found in token.");

            if (!Guid.TryParse(userIdString, out var userId)) return BadRequest("Invalid user ID format.");

            var exists = await _dbContext.SavedMovies.AnyAsync(m => m.UserId == userId && m.MovieId == movieId);

            if (!exists)
            {
                _dbContext.SavedMovies.Add(new SavedMovie
                {
                    MovieId = movieId,
                    UserId = userId
                });
                await _dbContext.SaveChangesAsync();
                Console.WriteLine($"[SaveMovie] Movie {movieId} saved for user {userId}.");
            }
            else Console.WriteLine($"[SaveMovie] Movie {movieId} already saved.");

            return Ok();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[SaveMovie] ERROR: {ex.Message}");
            return StatusCode(500, $"Internal Server Error: {ex.Message}");
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<int>>> GetSavedMovies()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null) return Unauthorized();

        if (!Guid.TryParse(userIdString, out var userId)) return BadRequest("Invalid user ID format.");

        var movieIds = await _dbContext.SavedMovies
            .Where(m => m.UserId == userId)
            .Select(m => m.MovieId)
            .ToListAsync();

        return Ok(movieIds);
    }

    [HttpDelete("{movieId}")]
    public async Task<IActionResult> DeleteSavedMovie(int movieId)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var savedMovie = await _dbContext.SavedMovies
            .FirstOrDefaultAsync(m => m.MovieId == movieId && m.UserId == userId);

        if (savedMovie == null)
            return NotFound("Movie not found in your saved list.");

        _dbContext.SavedMovies.Remove(savedMovie);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}