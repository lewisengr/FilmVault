using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using FilmVault.Services;
using FilmVault.Models;

namespace FilmVault.Controllers
{
    [Route("api/movies")]
    [ApiController]
    public class MovieController(TMDBService tmdbService) : ControllerBase
    {
        private readonly TMDBService _tmdbService = tmdbService;

        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovieById(int id)
        {
            var movie = await _tmdbService.GetMovieByIdAsync(id);
            if (movie == null) return NotFound(new { message = "Movie not found" });
            return Ok(movie);
        }
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Movie>>> SearchMovies([FromQuery] string query, [FromQuery] int page = 1)
        {
            var movies = await _tmdbService.SearchMoviesAsync(query, page);
            return Ok(movies ?? []);
        }
        [HttpGet("popular")]
        public async Task<ActionResult<IEnumerable<Movie>>> GetPopularMovies()
        {
            var movies = await _tmdbService.GetPopularMoviesAsync();
            return Ok(movies);
        }
    }
}