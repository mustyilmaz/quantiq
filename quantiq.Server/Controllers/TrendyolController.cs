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


        public TrendyolController(TrendyolService trendyolService, AppDbContext context,   AuthService authService)
        {
            _trendyolService = trendyolService;
            _context = context;
            _authService = authService;
        }

        [HttpGet("get-categories/{userId}")]
        public async Task<IActionResult> GetCategories(int userId)
        {
            try
            {
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
    }
} 