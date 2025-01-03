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

        public async Task<UserSession> CreateSession(int userId, string ipAddress, string userAgent)
        {
            // Mevcut aktif oturumları sonlandır
            var activeSessions = await _context.UserSessions
                .Where(s => s.UserId == userId && s.IsActive)
                .ToListAsync();

            foreach (var histSession in activeSessions)
            {
                histSession.IsActive = false;
            }

            await _context.SaveChangesAsync();

            // Yeni oturum oluştur
            var session = new UserSession
            {
                UserId = userId,
                SessionId = Guid.NewGuid().ToString(),
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                CreatedAt = DateTime.UtcNow,
                LastAccessedAt = DateTime.UtcNow,
                IPAddress = ipAddress,
                UserAgent = userAgent,
                IsActive = true
            };

            _context.UserSessions.Add(session);
            await _context.SaveChangesAsync();

            return session;
        }

        public async Task<bool> ValidateSession(string sessionId, string ipAddress, string userAgent)
        {
            var session = await _context.UserSessions
                .FirstOrDefaultAsync(s =>
                    s.SessionId == sessionId &&
                    s.ExpiresAt > DateTime.UtcNow &&
                    s.IsActive &&
                    s.IPAddress == ipAddress &&
                    s.UserAgent == userAgent
                );

            if (session != null)
            {
                session.LastAccessedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task InvalidateSession(string sessionId)
        {
            var session = await _context.UserSessions
                .FirstOrDefaultAsync(s => s.SessionId == sessionId);

            if (session != null)
            {
                session.IsActive = false;
                _context.UserSessions.Update(session);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<UserSession?> GetSession(string sessionId)
        {
            return await _context.UserSessions
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.SessionId == sessionId && s.ExpiresAt > DateTime.UtcNow && s.IsActive);
        }

        public async Task CleanUpOldSessions()
        {
            var expirationDate = DateTime.UtcNow.AddDays(-30);
            var oldSessions = await _context.UserSessions
                .Where(s => s.CreatedAt < expirationDate)
                .ToListAsync();

            _context.UserSessions.RemoveRange(oldSessions);
            await _context.SaveChangesAsync();
        }
    }
}