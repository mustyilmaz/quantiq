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

        private async Task<bool> VerifyTurnstile(string token)
        {
            try
            {
                var secretKey = _configuration["Turnstile:SecretKey"];
                
                if (string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(token))
                {
                    return false;
                }

                var client = _clientFactory.CreateClient();
                var response = await client.PostAsync(
                    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                    new FormUrlEncodedContent(new[]
                    {
                        new KeyValuePair<string, string>("secret", secretKey),
                        new KeyValuePair<string, string>("response", token)
                    })
                );

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"HTTP request failed with status code: {response.StatusCode}");
                    return false;
                }

                var content = await response.Content.ReadAsStringAsync();
    

                var turnstileResponse = JsonSerializer.Deserialize<TurnstileResponse>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                var responseJson = JsonSerializer.Serialize(turnstileResponse, new JsonSerializerOptions { WriteIndented = true });


                if (turnstileResponse == null)
                {
                    Console.WriteLine("Failed to deserialize Turnstile response.");
                    return false;
                }

                if (!turnstileResponse.Success)
                {
                    Console.WriteLine("Turnstile verification failed.");
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception during Turnstile verification: {ex.Message}");
                return false;
            }
        }

        public class TurnstileResponse
        {
            public bool Success { get; set; }
            public string[] ErrorCodes { get; set; } = Array.Empty<string>();
            public string ChallengeTs { get; set; } = "";
            public string Hostname { get; set; } = "";
            public string Action { get; set; } = "";
            public string Cdata { get; set; } = "";
            public Metadata Metadata { get; set; } = new Metadata();
        }

        public class Metadata
        {
            public bool Interactive { get; set; }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!await VerifyTurnstile(registerDto.TurnstileToken))
            {
                Console.WriteLine("Turnstile verification failed");
                return BadRequest("Invalid Turnstile");
            }

            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email || u.PhoneNumber == registerDto.PhoneNumber))
            {
                return BadRequest("Email or Phone Number already exists");
            }

            // Create new user
            var user = new User
            {
                Name = registerDto.Name,
                Surname = registerDto.Surname,
                Email = registerDto.Email,
                PhoneNumber = registerDto.PhoneNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("user-login")]
        public async Task<IActionResult> UserLogin([FromBody] UserLoginDto userLoginDto)
        {
            if (!await VerifyTurnstile(userLoginDto.TurnstileToken))
            {
                Console.WriteLine("Turnstile verification failed");
                return BadRequest("Invalid Turnstile");
            }
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

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            var authToken = Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authToken) || !authToken.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "Token bulunamadı" });
            }
            var token = authToken.Substring("Bearer ".Length);
            var userId = _authService.ValidateJwtToken(token);
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "Geçersiz token" });
            }
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == userId.Value);
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı. Destek ile iletişime geçiniz." });
            }

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
            {
                return Unauthorized(new { message = "Mevcut şifre yanlış. Lütfen tekrar deneyiniz." });
            }

            if (changePasswordDto.NewPassword == changePasswordDto.CurrentPassword)
            {
                return BadRequest(new { message = "Yeni şifre mevcut şifre ile aynı olamaz. Lütfen farklı bir şifre giriniz." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Geçersiz şifre formatı! Şifre en az 8 karakter uzunluğunda olmalıdır ve en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir." });
            }

            // Şifre karmaşıklığını kontrol et
            if (changePasswordDto.NewPassword.Length < 8)
            {
                return BadRequest(new { message = "Yeni şifre en az 8 karakter olmalıdır. Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir." });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Şifreniz başarıyla değiştirildi." }); 
        }

        [HttpGet("verify-token")]
        public async Task<IActionResult> VerifyToken()
        {
            Console.WriteLine("VerifyToken method called");
            try
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return Unauthorized(new { message = "Token bulunamadı" });
                }
                Console.WriteLine("Token found");

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
}