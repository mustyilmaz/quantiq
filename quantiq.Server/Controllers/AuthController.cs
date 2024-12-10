using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Text.Json;
using BCrypt.Net;
using quantiq.Server.Data;
using quantiq.Server.Dtos;
using quantiq.Server.Models.Entities;
using quantiq.Server.Services;
namespace quantiq.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _clientFactory;
        private readonly AuthService _authService;

        public AuthController(
            AppDbContext context,
            IConfiguration configuration,
            IHttpClientFactory clientFactory,
            AuthService authService)
        {
            _context = context;
            _configuration = configuration;
            _clientFactory = clientFactory;
            _authService = authService;
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
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email || u.PhoneNumber == registerDto.PhoneNumber))
            {
                return BadRequest("Email or Phone Number already exists");
            }

            // Create new user
            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PhoneNumber = registerDto.PhoneNumber,
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
                // ReCAPTCHA Secret Key'i almak
                
                var secretKey = _configuration["Recaptcha:SecretKey"];
                if (string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(token))
                {
                    Console.WriteLine("Secret key or token is missing.");
                    return false;  // Secret key ya da token yoksa başarısız.
                }

                // HTTP client oluşturma
                var client = _clientFactory.CreateClient();

                // POST isteği gönderme
                var response = await client.PostAsync(
                    "https://www.google.com/recaptcha/api/siteverify",
                    new FormUrlEncodedContent(new[]
                    {
                new KeyValuePair<string, string>("secret", secretKey),
                new KeyValuePair<string, string>("response", token)
                    })
                );

                // Eğer istek başarısızsa
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine("ReCAPTCHA verification failed.");
                    return false;
                }

                // Yanıtı okuma
                var content = await response.Content.ReadAsStringAsync();
                var recaptchaResponse = JsonSerializer.Deserialize<RecaptchaResponse>(content);

                // reCAPTCHA doğrulama sonucu
                return recaptchaResponse?.Success ?? false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during reCAPTCHA verification: {ex.Message}");
                return false;  // Hata durumunda başarısız.
            }
        }


        [HttpPost("user-login")]
        public async Task<IActionResult> UserLogin([FromBody] UserLoginDto userLoginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u =>
            u.Email == userLoginDto.EmailOrPhone ||
            u.PhoneNumber == userLoginDto.EmailOrPhone);

            if (user == null)
            {
                return NotFound("user not found!");
            }
            if (!BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid password");
            }
            //last login update
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            var token = _authService.GenerateJwtToken(user);
            return Ok(new { token });
        }

        [HttpGet("verify-token")]
        public async Task<IActionResult> VerifyToken()
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return Unauthorized(new { message = "Token bulunamadı" });
                }

                var token = authHeader.Substring("Bearer ".Length);
                var userId = _authService.ValidateJwtToken(token);

                if (!userId.HasValue)
                {
                    return Unauthorized(new { message = "Geçersiz token" });
                }

                var user = await _context.Users
                    .Select(u => new
                    {
                        u.Id,
                        u.Name,
                        u.Email,
                        u.PhoneNumber,
                        u.CreatedAt,
                        u.LastLoginAt
                    })
                    .FirstOrDefaultAsync(u => u.Id == userId.Value);

                if (user == null)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı" });
                }

                return Ok(new
                {
                    success = true,
                    user = new
                    {
                        id = user.Id,
                        name = user.Name,
                        email = user.Email,
                        phoneNumber = user.PhoneNumber,
                        createdAt = user.CreatedAt,
                        lastLoginAt = user.LastLoginAt
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Sunucu hatası", error = ex.Message });
            }
        }

    }

    public class RecaptchaResponse
    {
        public bool Success { get; set; }
    }
}