using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Text.Json;
using BCrypt.Net;
using quantiq.Server.Data;
using quantiq.Server.Dtos;
using quantiq.Server.Models.Entities;

namespace quantiq.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _clientFactory;

        public AuthController(
            AppDbContext context,
            IConfiguration configuration,
            IHttpClientFactory clientFactory)
        {
            _context = context;
            _configuration = configuration;
            _clientFactory = clientFactory;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // Verify reCAPTCHA
            // if (!await VerifyRecaptcha(registerDto.RecaptchaToken))
            // {
            //     return BadRequest("Invalid reCAPTCHA");
            // }

            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest("Email already exists");
            }

            // Create new user
            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful" });
        }

        private async Task<bool> VerifyRecaptcha(string token)
        {
            try
            {
                var client = _clientFactory.CreateClient();
                var response = await client.PostAsync(
                    "https://www.google.com/recaptcha/api/siteverify",
                    new FormUrlEncodedContent(new[]
                    {
                        new KeyValuePair<string, string>("secret", _configuration["Recaptcha:SecretKey"]),
                        new KeyValuePair<string, string>("response", token)
                    })
                );

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine("istek basarisiz amuagoyum");
                    return false;
                }

                var content = await response.Content.ReadAsStringAsync();
                var recaptchaResponse = JsonSerializer.Deserialize<RecaptchaResponse>(content);

                return recaptchaResponse?.Success ?? false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during reCAPTCHA verification: {ex.Message}");
                return false;
            }
        }
    }

    public class RecaptchaResponse
    {
        public bool Success { get; set; }
    }
}