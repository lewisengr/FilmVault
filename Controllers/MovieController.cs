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
    }
}
