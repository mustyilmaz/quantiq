using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using quantiq.Server.Data;
using quantiq.Server.DTOs.Auth;
using quantiq.Server.DTOs;
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
            try
            {
                if (!await VerifyTurnstile(registerDto.TurnstileToken))
                {
                    return BadRequest("Invalid Turnstile");
                }

                // Email ve telefon numarası kontrolü
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == registerDto.Email || u.PhoneNumber == registerDto.PhoneNumber);

                if (existingUser != null)
                {
                    if (existingUser.Email == registerDto.Email)
                        return BadRequest("Bu email adresi zaten kullanımda");
                    else
                        return BadRequest("Bu telefon numarası zaten kullanımda");
                }

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                var user = new User
                {
                    Name = registerDto.Name,
                    Surname = registerDto.Surname,
                    Email = registerDto.Email,
                    PhoneNumber = registerDto.PhoneNumber,
                    PasswordHash = hashedPassword,
                    CreatedAt = DateTime.UtcNow,
                    HasConsentedKVKK = registerDto.HasConsentedKVKK,
                    ConsentDateKVKK = DateTime.UtcNow,
                    HasAcceptedPrivacyPolicy = registerDto.HasAcceptedPrivacyPolicy,
                    AcceptanceDatePrivacyPolicy = DateTime.UtcNow,
                    HasAcceptedUserAgreement = registerDto.HasAcceptedUserAgreement,
                    AcceptanceDateUserAgreement = DateTime.UtcNow
                };

                // Transaction kullanarak işlemleri tek seferde yapıyoruz
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    // Önce user'ı kaydedelim
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();

                    Console.WriteLine("user kaydedildi ve user.Id: " + user.Id);

                    // Şifre geçmişini kaydedelim
                    var passwordHistory = new UserPasswordHistory
                    {
                        UserId = user.Id,
                        PasswordHash = hashedPassword,
                        ChangedAt = DateTime.UtcNow
                    };
                    Console.WriteLine("passwordHistory oluşturuldu ve passwordHistory.UserId: " + passwordHistory.UserId);
                    _context.UserPasswordHistories.Add(passwordHistory);
                    await _context.SaveChangesAsync();

                    Console.WriteLine("passwordHistory kaydedildi ve passwordHistory.UserId: " + passwordHistory.UserId);

                    await transaction.CommitAsync();

                    return Ok(new { message = "Kayıt başarıyla tamamlandı" });
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Kayıt işlemi sırasında bir hata oluştu");
            }
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

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO changePasswordDto)
        {
            Console.WriteLine("api tarafında change-password çağrıldı");
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return Unauthorized(new { message = "Token bulunamadı" });
                }
                var token = authHeader.Substring("Bearer ".Length);
                var userId = _authService.GetUserIdFromToken(token);
                if (!userId.HasValue)
                {
                    return Unauthorized("Geçersiz token");
                }
                Console.WriteLine("api tarafında change-password çağrıldı ve userId: " + userId.Value);
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId.Value);

                if (user == null)
                    return NotFound("Kullanıcı bulunamadı");

                if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
                    return BadRequest("Mevcut şifre yanlış");

                // Son 3 şifreyi kontrol et
                var recentPasswords = await _context.UserPasswordHistories
                    .Where(ph => ph.UserId == userId.Value)
                    .OrderByDescending(ph => ph.ChangedAt)
                    .Take(3)
                    .ToListAsync();

                foreach (var oldPassword in recentPasswords)
                {
                    if (BCrypt.Net.BCrypt.Verify(changePasswordDto.NewPassword, oldPassword.PasswordHash))
                        return BadRequest(new { message = "Yeni şifreniz son 3 şifrenizden biri ile aynı olamaz." });
                }

                var newHashedPassword = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);

                // Kullanıcının şifresini güncelle
                user.PasswordHash = newHashedPassword;
                user.LastPasswordChange = DateTime.UtcNow;
                _context.Users.Update(user);

                // Şifre geçmişini yönet - maksimum 3 şifre tut
                var allUserPasswords = await _context.UserPasswordHistories
                    .Where(ph => ph.UserId == userId.Value)
                    .OrderByDescending(ph => ph.ChangedAt)
                    .ToListAsync();

                if (allUserPasswords.Count >= 3)
                {
                    // En eski şifreyi bul ve sil
                    var oldestPassword = allUserPasswords
                        .OrderBy(ph => ph.ChangedAt)
                        .First();

                    _context.UserPasswordHistories.Remove(oldestPassword);
                }

                // Yeni şifreyi history'ye ekle
                var passwordHistory = new UserPasswordHistory
                {
                    UserId = userId.Value,
                    PasswordHash = newHashedPassword,
                    ChangedAt = DateTime.UtcNow
                };

                _context.UserPasswordHistories.Add(passwordHistory);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Şifre başarıyla değiştirildi" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Şifre değiştirme işlemi sırasında bir hata oluştu: " + ex.Message);
            }
        }

    }
}