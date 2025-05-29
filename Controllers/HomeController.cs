using Microsoft.AspNetCore.Mvc;

namespace FilmVault.Controllers
{
    [ApiController]
    [Route("/")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok("FilmVault API is live!");
        }
    }
}