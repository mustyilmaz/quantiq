using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using quantiq.Server.Data;
using quantiq.Server.DTOs.Auth;
using quantiq.Server.DTOs;
using quantiq.Server.Models.Entities;
using quantiq.Server.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

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
        private readonly SessionService _sessionService;

        public AuthController(
            AppDbContext context,
            IConfiguration configuration,
            IHttpClientFactory clientFactory,
            AuthService authService,
            SessionService sessionService)
        {
            _context = context;
            _configuration = configuration;
            _clientFactory = clientFactory;
            _authService = authService;
            _sessionService = sessionService;
        }

        private async Task<bool> VerifyTurnstile(string token)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Post, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("secret", _configuration["Turnstile:SecretKey"]!),
                    new KeyValuePair<string, string>("response", token),
                    new KeyValuePair<string, string>("remoteip", HttpContext.Connection.RemoteIpAddress?.ToString() ?? "")
                });
                request.Content = content;

                var client = _clientFactory.CreateClient();
                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var turnstileResponse = JsonSerializer.Deserialize<TurnstileResponse>(responseContent, options);

                if (turnstileResponse == null)
                {
                    Console.WriteLine("Deserializasyon sonucu null.");
                    return false;
                }


                return turnstileResponse.Success;
            }
            catch (JsonException jsonEx)
            {
                Console.WriteLine("JSON Deserializasyon hatası: " + jsonEx.Message);
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Turnstile doğrulama hatası: " + ex.Message);
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
                        Password1 = hashedPassword,
                        Password1ChangedAt = DateTime.UtcNow
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
            if (!await VerifyTurnstile(userLoginDto.TurnstileToken))
            {
                return Ok(new { success = false, message = "Robot doğrulama hatası" });
            }

            var user = await _context.Users.SingleOrDefaultAsync(u =>
                u.Email == userLoginDto.EmailOrPhone ||
                u.PhoneNumber == userLoginDto.EmailOrPhone);

            if (user == null)
            {
                return Ok(new { success = false, message = "Böyle bir kullanıcı bulunamadı. Lütfen tekrar deneyiniz." });
            }

            if (!BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))
            {
                return Ok(new { success = false, message = "Geçersiz şifre. Lütfen tekrar deneyiniz." });
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Oturum oluşturma
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "";
            var userAgent = Request.Headers["User-Agent"].ToString();
            var session = await _sessionService.CreateSession(user.Id, ipAddress, userAgent);

            // HttpOnly ve Secure özelliklerine sahip çerez oluşturma
            Response.Cookies.Append("session_id", session.SessionId, new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // http durumu için false yapıyoruz
                Expires = session.ExpiresAt,
                SameSite = SameSiteMode.Strict
            });

            return Ok(new { success = true, message = "Giriş başarılı" });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var sessionId = Request.Cookies["session_id"];
            if (!string.IsNullOrEmpty(sessionId))
            {
                await _sessionService.InvalidateSession(sessionId);
                Response.Cookies.Delete("session_id");
            }

            return Ok(new { message = "Çıkış başarılı" });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO changePasswordDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var sessionId = Request.Cookies["session_id"];
                if (string.IsNullOrEmpty(sessionId))
                {
                    return Unauthorized(new { message = "Oturum bulunamadı" });
                }

                var isValid = await _sessionService.ValidateSession(sessionId, HttpContext.Connection.RemoteIpAddress?.ToString() ?? "", Request.Headers["User-Agent"].ToString());
                if (!isValid)
                {
                    return Unauthorized(new { message = "Geçersiz oturum" });
                }

                var session = await _sessionService.GetSession(sessionId);
                if (session == null)
                {
                    return Unauthorized(new { message = "Oturum bulunamadı" });
                }

                var user = await _context.Users
                    .Include(u => u.PasswordHistories)
                    .FirstOrDefaultAsync(u => u.Id == session.UserId);

                if (user == null)
                    return NotFound("Kullanıcı bulunamadı");

                if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
                    return BadRequest("Mevcut şifre yanlış");

                // Son 3 şifreyi kontrol et
                var passwordHistory = user.PasswordHistories.OrderByDescending(uph => uph.Password1ChangedAt).FirstOrDefault();
                var oldPasswords = new[] { passwordHistory?.Password1, passwordHistory?.Password2, passwordHistory?.Password3 };

                foreach (var oldPasswordHash in oldPasswords)
                {
                    if (!string.IsNullOrEmpty(oldPasswordHash) && BCrypt.Net.BCrypt.Verify(changePasswordDto.NewPassword, oldPasswordHash))
                        return BadRequest(new { message = "Yeni şifreniz son 3 şifrenizden biri ile aynı olamaz." });
                }

                var newHashedPassword = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);

                // Kullanıcının şifresini güncelle
                user.PasswordHash = newHashedPassword;
                user.LastPasswordChange = DateTime.UtcNow;
                _context.Users.Update(user);

                // Şifre geçmişini güncelle
                if (passwordHistory == null)
                {
                    passwordHistory = new UserPasswordHistory
                    {
                        UserId = user.Id
                    };
                    _context.UserPasswordHistories.Add(passwordHistory);
                }

                // En eski şifreyi güncelle
                if (string.IsNullOrEmpty(passwordHistory.Password1))
                {
                    passwordHistory.Password1 = newHashedPassword;
                    passwordHistory.Password1ChangedAt = DateTime.UtcNow;
                }
                else if (string.IsNullOrEmpty(passwordHistory.Password2))
                {
                    passwordHistory.Password2 = newHashedPassword;
                    passwordHistory.Password2ChangedAt = DateTime.UtcNow;
                }
                else if (string.IsNullOrEmpty(passwordHistory.Password3))
                {
                    passwordHistory.Password3 = newHashedPassword;
                    passwordHistory.Password3ChangedAt = DateTime.UtcNow;
                }
                else
                {
                    // En eski şifreyi sil ve yeni şifreyi ekle
                    passwordHistory.Password1 = passwordHistory.Password2;
                    passwordHistory.Password1ChangedAt = passwordHistory.Password2ChangedAt ?? DateTime.UtcNow;

                    passwordHistory.Password2 = passwordHistory.Password3;
                    passwordHistory.Password2ChangedAt = passwordHistory.Password3ChangedAt ?? DateTime.UtcNow;

                    passwordHistory.Password3 = newHashedPassword;
                    passwordHistory.Password3ChangedAt = DateTime.UtcNow;
                }

                _context.UserPasswordHistories.Update(passwordHistory);
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

        [HttpPost("save-api-info")]
        public async Task<IActionResult> SaveApiInfo([FromBody] TrendyolConfDTO trendyolConfDto)
        {
            try
            {
                if (trendyolConfDto == null)
                {
                    return BadRequest("Request body cannot be null");
                }

                if (string.IsNullOrEmpty(trendyolConfDto.Apikey) || 
                    string.IsNullOrEmpty(trendyolConfDto.SecretApikey))
                {
                    return BadRequest("API Key and Secret Key are required");
                }

                // Şifreleme için güvenli bir yöntem kullanın (örnek: AES)
                var encryptedApiKey = _authService.EncryptData(trendyolConfDto.Apikey);
                var encryptedSecretKey = _authService.EncryptData(trendyolConfDto.SecretApikey);

                var trendyolConf = new TrendyolConf
                {
                    UserId = trendyolConfDto.UserId,
                    Apikey = encryptedApiKey,
                    SuppleirId = trendyolConfDto.SuppleirId,
                    SecretApikey = encryptedSecretKey,
                    CreatedAt = DateTime.UtcNow
                };
                _context.TrendyolConfs.Add(trendyolConf);
                await _context.SaveChangesAsync();

                return Ok(new { message = "API information saved successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "An error occurred while saving API information", 
                    error = ex.Message 
                });
            }
        }
        
        [HttpPost("update-api-info")]
        public async Task<IActionResult> UpdateApiInfo([FromBody] TrendyolConfDTO trendyolConfDto)
        {
            try
            {
                var trendyolConf = await _context.TrendyolConfs.FirstOrDefaultAsync(t => t.UserId == trendyolConfDto.UserId);
                Console.WriteLine($"TrendyolConf: {trendyolConf?.UserId}, {trendyolConf?.Apikey}, {trendyolConf?.SecretApikey}, {trendyolConf?.SuppleirId}");
                if (trendyolConf == null)
                {
                    return NotFound("API information not found");
                }

                // Update the API keys using 
                trendyolConf.Apikey = _authService.EncryptData(trendyolConfDto.Apikey);
                trendyolConf.SecretApikey = _authService.EncryptData(trendyolConfDto.SecretApikey);
                trendyolConf.SuppleirId = trendyolConfDto.SuppleirId;
                trendyolConf.UpdatedAt = DateTime.UtcNow;

                _context.TrendyolConfs.Update(trendyolConf);
                await _context.SaveChangesAsync();

                return Ok(new { message = "API information updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while updating API information");
            }
        }

        [HttpGet("get-api-info/{userId}")]
        public async Task<IActionResult> GetApiInfo(int userId)
        {
            try
            {
                var trendyolConf = await _context.TrendyolConfs
                    .FirstOrDefaultAsync(t => t.UserId == userId);

                if (trendyolConf == null)
                {
                    return NotFound("API information not found");
                }

                // Şifrelenmiş verileri çöz
                var decryptedApiKey = _authService.DecryptData(trendyolConf.Apikey);
                var decryptedSecretKey = _authService.DecryptData(trendyolConf.SecretApikey);

                return Ok(new
                {
                    apikey = decryptedApiKey,
                    secretApikey = decryptedSecretKey,
                    suppleirId = trendyolConf.SuppleirId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching API information");
            }
        }

    }
}