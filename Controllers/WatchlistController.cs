using FilmVault.Data;
using FilmVault.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WatchlistController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<int>>> GetWatchlist()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var guid = Guid.Parse(userId);
        var ids = await dbContext.Watchlist
            .Where(w => w.UserId == guid)
            .Select(w => w.MovieId)
            .ToListAsync();

        return Ok(ids);
    }

    [HttpPost("{movieId}")]
    public async Task<IActionResult> AddToWatchlist(int movieId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var guid = Guid.Parse(userId);

        var exists = await dbContext.Watchlist.AnyAsync(w => w.UserId == guid && w.MovieId == movieId);
        if (!exists)
        {
            dbContext.Watchlist.Add(new Watchlist { MovieId = movieId, UserId = guid });
            await dbContext.SaveChangesAsync();
        }

        return Ok();
    }

    [HttpDelete("{movieId}")]
    public async Task<IActionResult> RemoveFromWatchlist(int movieId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var guid = Guid.Parse(userId);
        var item = await dbContext.Watchlist.FirstOrDefaultAsync(w => w.UserId == guid && w.MovieId == movieId);
        if (item == null) return NotFound();

        dbContext.Watchlist.Remove(item);
        await dbContext.SaveChangesAsync();
        return NoContent();
    }
}