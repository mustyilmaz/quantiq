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
            user.LastLogin = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            var token = _authService.GenerateJwtToken(user);
            return Ok(new { token });
        }

        [HttpPost("verify-token")]
        public async Task<IActionResult> VerifyToken([FromBody] string token)
        {
            try
            {
                var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized("Token is required");
                }
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound("User not found");
                }
                Console.WriteLine("ne geldi abi şimdi data", user.Id);
                return Ok(new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    phoneNumber = user.PhoneNumber
                });
            }
            catch (Exception ex)
            {
                return Unauthorized("Invalid token");
            }
        }
    }

    public class RecaptchaResponse
    {
        public bool Success { get; set; }
    }
}