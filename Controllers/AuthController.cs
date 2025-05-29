using FilmVault.Models.Entities;
using FilmVault.Models;
using FilmVault.Services;
using Microsoft.AspNetCore.Mvc;

namespace FilmVault.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    /// <summary>
    /// The AuthController is responsible for handling authentication-related requests which include user registration and login.
    /// </summary>
    public class AuthController(AuthService authService) : ControllerBase
    {
        // DI of the AuthService
        private readonly AuthService _authService = authService;

        /// <summary>
        /// Handles user registration requests.
        /// </summary>
        /// <param name="request">The user registration data.</param>
        /// <returns>An IActionResult containing the registration response.</returns>
        [HttpPost("register")]
        public IActionResult Register([FromBody] AddUserDto request)
        {
            try
            {
                var response = _authService.Register(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Registration error: {ex.Message}");
                return StatusCode(500, "Server error during registration.");
            }
        }

        /// <summary>
        /// Handles user login requests.
        /// </summary>
        /// <param name="request">The login credentials (email and password).</param>
        /// <returns>An IActionResult containing the login response or an unauthorized error.</returns>
        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthRequest request)
        {
            // Call the AuthService to authenticate the user
            var response = _authService.Login(request);

            if (response == null) return Unauthorized(new { message = "Invalid email or password" });

            return Ok(response);
        }
    }
}