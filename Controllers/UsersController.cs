using FilmVault.Data;
using FilmVault.Models;
using FilmVault.Models.Entities;
using FilmVault.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FilmVault.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly AuthService _authService;

        public UsersController(ApplicationDbContext dbContext, AuthService authService)
        {
            _dbContext = dbContext;
            _authService = authService;
        }

        [HttpGet("profile")]
        [Authorize]
        public IActionResult GetProfile()
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { message = "User either not found or unauthorized." });
            }
            var user = _dbContext.Users.FirstOrDefault(u => u.Email == userEmail);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email,
            });
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            var allUsers = _dbContext.Users.ToList();
            return Ok(allUsers);
        }
        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetUserById(Guid id)
        {
            var user = _dbContext.Users.Find(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }
            return Ok(user);
        }
        [HttpPost]
        public IActionResult AddUser(AddUserDto addUserDto)
        {
            if (string.IsNullOrWhiteSpace(addUserDto.Username))
            {
                return BadRequest("Username is required.");
            }

            var hashedPassword = _authService.HashPassword(addUserDto.Password);

            var userEntity = new User()
            {
                Username = addUserDto.Username,
                Email = addUserDto.Email,
                PasswordHash = hashedPassword,
            };
            _dbContext.Users.Add(userEntity);
            _dbContext.SaveChanges();
            return CreatedAtAction(nameof(GetUserById), new { id = userEntity.Id }, userEntity);
        }
        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateUser(Guid id, UpdateUserDto updateUserDto)
        {
            var user = _dbContext.Users.Find(id);

            if (user == null) { return NotFound(); }

            user.Username = updateUserDto.Username;
            user.Email = updateUserDto.Email;
            user.PasswordHash = updateUserDto.PasswordHash;
            user.Password = updateUserDto.Password;

            _dbContext.SaveChanges();
            return Ok(updateUserDto);
        }
        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteUser(Guid id)
        {
            var user = _dbContext.Users.Find(id);

            if (user == null) { return NotFound(); };

            _dbContext.Users.Remove(user);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}