using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quantiq.Server.Data;
using quantiq.Server.Services;

namespace quantiq.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;

        public UserController(AppDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpGet("details")]
        public async Task<IActionResult> GetUserDetails()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "Token bulunamadı" });
            }

            var token = authHeader.Substring("Bearer ".Length);
            if (!_authService.ValidateToken(token))
            {
                return Unauthorized(new { message = "Geçersiz token" });
            }

            var userId = _authService.GetUserIdFromToken(token);
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "Token'dan kullanıcı bilgisi alınamadı" });
            }

            var user = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Surname,
                    u.Email,
                    u.PhoneNumber,
                    u.LastLoginAt,
                    u.Package,
                    u.IsEmailVerified,
                    u.IsPhoneNumberVerified,
                    u.IsProfileRestricted
                })
                .FirstOrDefaultAsync(u => u.Id == userId.Value);

            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı" });
            }

            return Ok(new { success = true, user });
        }
    }
} 