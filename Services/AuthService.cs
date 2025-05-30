using FilmVault.Models.Entities;
using FilmVault.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using FilmVault.Data;

namespace FilmVault.Services
{
    public class AuthService(ApplicationDbContext dbContext, IConfiguration configuration)
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly ApplicationDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        // Register a new user
        public AuthResponse Register(AddUserDto request)
        {
            // Check if user already exists
            if (_dbContext.Users.Any(u => u.Email == request.Email))
                throw new Exception("User with this email already exists");

            if (string.IsNullOrEmpty(request.Password))
                throw new Exception("Password cannot be empty.");

            // Create a new User object
            var user = new User
            {
                Id = Guid.NewGuid(), // Ensure GUID is generated
                Username = request.Username,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password) // Hash password before storing
            };

            _dbContext.Users.Add(user);
            _dbContext.SaveChanges(); // Save to DB

            var token = GenerateJwtToken(user);
            return new AuthResponse { Token = token };
        }

        // Login and generate JWT
        public AuthResponse? Login(AuthRequest request)
        {
            try
            {
                var user = _dbContext.Users.FirstOrDefault(u => u.Email == request.Email);
                if (string.IsNullOrEmpty(request.Password) || user == null || string.IsNullOrEmpty(user.PasswordHash) || !VerifyPassword(request.Password, user.PasswordHash))
                    return null;

                var token = GenerateJwtToken(user);
                return new AuthResponse { Token = token };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
                throw; // to still surface error to frontend
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
            if (string.IsNullOrEmpty(secretKey))
                throw new ArgumentNullException("JWT_SECRET_KEY is not set.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtConfig:Issuer"],
                audience: _configuration["JwtConfig:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(int.Parse(_configuration["JwtConfig:TokenValidityMins"] ?? "30")),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return tokenString;

            //return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Hash password
        public string HashPassword(string password)
        {
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            byte[] hash = KeyDerivation.Pbkdf2(
                password: password!,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 32
            );
            // Store salt and hash together (Base64 encoded)
            return Convert.ToBase64String(salt.Concat(hash).ToArray());
        }

        // Verify hashed password
        public bool VerifyPassword(string enteredPassword, string storedHash)
        {
            if (string.IsNullOrEmpty(enteredPassword)) return false;

            byte[] storedBytes = Convert.FromBase64String(storedHash);
            byte[] salt = storedBytes.Take(16).ToArray();
            byte[] storedPasswordHash = storedBytes.Skip(16).ToArray();
            byte[] hash = KeyDerivation.Pbkdf2(
                password: enteredPassword!,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 32
            );
            return hash.SequenceEqual(storedPasswordHash);
        }
    }
}