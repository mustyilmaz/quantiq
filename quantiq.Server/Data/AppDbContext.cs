using Microsoft.EntityFrameworkCore;
using quantiq.Server.Models.Entities;
using quantiq.Server.Data.Configurations;
using System.Linq;

namespace quantiq.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<UserPasswordHistory> UserPasswordHistories { get; set; } = null!;
        public DbSet<UserSession> UserSessions { get; set; }
        public DbSet<TrendyolConf> TrendyolConfs { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfigürasyon Sınıflarını Uygulama
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}