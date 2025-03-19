using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using quantiq.Server.Data;
using quantiq.Server.DTOs.Auth;
using quantiq.Server.DTOs;
using quantiq.Server.Models.Entities;
using quantiq.Server.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrendyolController : ControllerBase
    {
        private readonly TrendyolService _trendyolService;
        private readonly AppDbContext _context;
        private readonly AuthService _authService;
        private readonly SessionService _sessionService;

        public TrendyolController(
            TrendyolService trendyolService, 
            AppDbContext context, 
            AuthService authService,
            SessionService sessionService)
        {
            _trendyolService = trendyolService;
            _context = context;
            _authService = authService;
            _sessionService = sessionService;
        }

        [HttpGet("get-categories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                // Session kimliğini çerezden al
                var sessionId = Request.Cookies["session_id"];
                if (string.IsNullOrEmpty(sessionId))
                {
                    return Unauthorized("Oturum bulunamadı");
                }

                // SessionService kullanarak oturum bilgilerini al
                var session = await _sessionService.GetSession(sessionId);
                if (session == null || session.User == null)
                {
                    return Unauthorized("Geçersiz oturum");
                }

                int userId = session.UserId;
                
                // API bilgilerini veritabanından al
                var apiInfo = await _context.TrendyolConfs.FirstOrDefaultAsync(t => t.UserId == userId);
                
                if (apiInfo == null)
                {
                    return NotFound("API bilgileri bulunamadı");
                }

                var apikey = _authService.DecryptData(apiInfo.Apikey);
                var secretkey = _authService.DecryptData(apiInfo.SecretApikey);

                var categories = await _trendyolService.GetCategories(apikey, secretkey, apiInfo.SuppleirId);
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Kategoriler alınırken bir hata oluştu");
            }
        }

        [HttpGet("brands")]
        public async Task<IActionResult> GetBrands([FromQuery] int page = 1, [FromQuery] int size = 1000)
        {
            try
            {
                // Session kimliğini çerezden al
                var sessionId = Request.Cookies["session_id"];
                if (string.IsNullOrEmpty(sessionId))
                {
                    return Unauthorized("Oturum bulunamadı");
                }

                // SessionService kullanarak oturum bilgilerini al
                var session = await _sessionService.GetSession(sessionId);
                if (session == null || session.User == null)
                {
                    return Unauthorized("Geçersiz oturum");
                }

                int userId = session.UserId;
                
                var apiInfo = await _context.TrendyolConfs.FirstOrDefaultAsync(t => t.UserId == userId);
                if (apiInfo == null)
                {
                    return NotFound("API bilgileri bulunamadı");
                }

                var apikey = _authService.DecryptData(apiInfo.Apikey);
                var secretkey = _authService.DecryptData(apiInfo.SecretApikey);

                var response = await _trendyolService.GetBrands(apikey, secretkey, page, size);
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetBrands: {ex.Message}");
                return StatusCode(500, "Markalar alınırken bir hata oluştu");
            }
        }

        [HttpGet("brands-by-name")]
        public async Task<IActionResult> GetBrandsByName([FromQuery] string name)
        {
            try
            {
                // Session kimliğini çerezden al
                var sessionId = Request.Cookies["session_id"];
                if (string.IsNullOrEmpty(sessionId))
                {
                    return Unauthorized("Oturum bulunamadı");
                }

                // SessionService kullanarak oturum bilgilerini al
                var session = await _sessionService.GetSession(sessionId);
                if (session == null || session.User == null)
                {
                    return Unauthorized("Geçersiz oturum");
                }

                int userId = session.UserId;
                
                var apiInfo = await _context.TrendyolConfs.FirstOrDefaultAsync(t => t.UserId == userId);
                if (apiInfo == null)
                {
                    return NotFound("API bilgileri bulunamadı");
                }

                var apikey = _authService.DecryptData(apiInfo.Apikey);
                var secretkey = _authService.DecryptData(apiInfo.SecretApikey);

                var brands = await _trendyolService.GetBrandsByName(apikey, secretkey, name);
                
                // Eğer hiç marka bulunamadıysa, özel bir durum bilgisi ile boş liste döndür
                if (!brands.Any())
                {
                    return Ok(new 
                    { 
                        brands = Array.Empty<TrendyolBrand>(),
                        message = $"'{name}' araması için hiçbir marka bulunamadı." 
                    });
                }
                
                return Ok(brands);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetBrandsByName: {ex.Message}");
                return StatusCode(500, "Markalar isimle aranırken bir hata oluştu");
            }
        }
    }
}