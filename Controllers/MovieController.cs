using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using FilmVault.Services;
using FilmVault.Models;

namespace FilmVault.Controllers
{
    [Route("api/movies")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly TMDBService _tmdbService;

        public MovieController(TMDBService tmdbService)
        {
            _tmdbService = tmdbService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovieById(int id)
        {
            var movie = await _tmdbService.GetMovieByIdAsync(id);
            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }
            return Ok(movie);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Movie>>> SearchMovies([FromQuery] string query)
        {
            var movies = await _tmdbService.SearchMoviesAsync(query);
            if (movies == null || movies.Count == 0)
            {
                return NotFound(new { message = "No movies found" });
            }
            return Ok(movies);
        }

        [HttpGet("popular")]
        public async Task<ActionResult<IEnumerable<Movie>>> GetPopularMovies()
        {
            var movies = await _tmdbService.GetPopularMoviesAsync();
            return Ok(movies);
        }
    }
}