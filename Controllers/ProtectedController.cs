using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FilmVault.Controllers
{
    [Route("api/protected")]
    [ApiController]
    [Authorize] // This will require authentication to access these routes
    public class ProtectedController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetProtectedData()
        {
            return Ok(new { Message = "This is protected data!" });
        }
    }
}