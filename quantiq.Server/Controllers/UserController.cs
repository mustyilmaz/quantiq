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
        private readonly SessionService _sessionService;

        public UserController(AppDbContext context, AuthService authService, SessionService sessionService)
        {
            _context = context;
            _authService = authService;
            _sessionService = sessionService;
        }

        [HttpGet("details")]
        public async Task<IActionResult> GetUserDetails()
        {
            var sessionId = Request.Cookies["session_id"];
            if (string.IsNullOrEmpty(sessionId))
            {
                return Unauthorized(new { message = "Oturum bulunamadı" });
            }

            var session = await _sessionService.ValidateSession(sessionId, HttpContext.Connection.RemoteIpAddress?.ToString() ?? "", Request.Headers["User-Agent"].ToString());
            if (!session)
            {
                return Unauthorized(new { message = "Geçersiz oturum" });
            }

            var sessionInfo = await _sessionService.GetSession(sessionId);
            
            if (sessionInfo == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı" });
            }  

            var user = await _context.Users.FindAsync(sessionInfo.UserId);
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı" });
            }

            return Ok(new { success = true, user });
        }
    }
} 