using System;
using System.Threading.Tasks;
using quantiq.Server.Data;
using quantiq.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace quantiq.Server.Services
{
    public class SessionService
    {
        private readonly AppDbContext _context;

        public SessionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserSession> CreateSession(int userId)
        {
            var session = new UserSession
            {
                UserId = userId,
                SessionId = Guid.NewGuid().ToString(),
                ExpiresAt = DateTime.UtcNow.AddHours(1) // 1 saatlik oturum süresi
            };

            _context.UserSessions.Add(session);
            await _context.SaveChangesAsync();

            return session;
        }

        public async Task<bool> ValidateSession(string sessionId)
        {
            var session = await _context.UserSessions
                .FirstOrDefaultAsync(s => s.SessionId == sessionId && s.ExpiresAt > DateTime.UtcNow);

            return session != null;
        }

        public async Task InvalidateSession(string sessionId)
        {
            var session = await _context.UserSessions
                .FirstOrDefaultAsync(s => s.SessionId == sessionId);

            if (session != null)
            {
                _context.UserSessions.Remove(session);
                await _context.SaveChangesAsync();
            }
        }
    }
} 