using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Text.Json;
using BCrypt.Net;
using quantiq.Server.Data;
using quantiq.Server.DTOs.Auth;
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
                    return false;
                }

                var content = await response.Content.ReadAsStringAsync();
                var turnstileResponse = JsonSerializer.Deserialize<TurnstileResponse>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return turnstileResponse?.Success ?? false;
            }
            catch (Exception)
            {
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
                return BadRequest("Invalid Turnstile");
            }

            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email || u.PhoneNumber == registerDto.PhoneNumber))
            {
                return BadRequest("Email or Phone Number already exists");
            }

            var user = new User
            {
                Name = registerDto.Name,
                Surname = registerDto.Surname,
                Email = registerDto.Email,
                PhoneNumber = registerDto.PhoneNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                CreatedAt = DateTime.UtcNow,
                HasConsentedKVKK = registerDto.HasConsentedKVKK,
                ConsentDateKVKK = DateTime.UtcNow,
                HasAcceptedPrivacyPolicy = registerDto.HasAcceptedPrivacyPolicy,
                AcceptanceDatePrivacyPolicy = DateTime.UtcNow,
                HasAcceptedUserAgreement = registerDto.HasAcceptedUserAgreement,
                AcceptanceDateUserAgreement = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            Console.WriteLine("api tarafında login çağrıldı");
            if (!await VerifyTurnstile(userLoginDto.TurnstileToken))
            {
                return BadRequest("Invalid Turnstile");
            }

            var user = await _context.Users.SingleOrDefaultAsync(u =>
                u.Email == userLoginDto.EmailOrPhone ||
                u.PhoneNumber == userLoginDto.EmailOrPhone);

            if (user == null)
            {
                return NotFound("User not found!");
            }

            if (!BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid password");
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = _authService.GenerateJwtToken(user.Id);
            return Ok(new { token });
        }

        [HttpPost("verify-token")]
        public IActionResult VerifyToken()
        {
            Console.WriteLine("api tarafında verify-token çağrıldı");
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "Token bulunamadı" });
            }

            var token = authHeader.Substring("Bearer ".Length);
            var isValid = _authService.ValidateToken(token);
            Console.WriteLine("api tarafında verify-token çağrıldı ve isValid: " + isValid);
            return Ok(new { isValid });
        }
    }
}