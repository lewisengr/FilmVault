using FilmVault.Models.Entities;
using FilmVault.Models;
using FilmVault.Services;
using Microsoft.AspNetCore.Mvc;

namespace FilmVault.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(AuthService authService) : ControllerBase
    {
        private readonly AuthService _authService = authService;

        [HttpPost("register")]
        public IActionResult Register([FromBody] AddUserDto request)
        {
            var response = _authService.Register(request);
            return Ok(response);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthRequest request)
        {
            var response = _authService.Login(request);
            if (response == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            return Ok(response);
        }
    }
}