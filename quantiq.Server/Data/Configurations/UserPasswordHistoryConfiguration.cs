using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using quantiq.Server.Models.Entities;

namespace quantiq.Server.Data.Configurations
{
    public class UserPasswordHistoryConfiguration : IEntityTypeConfiguration<UserPasswordHistory>
    {
        public void Configure(EntityTypeBuilder<UserPasswordHistory> builder)
        {
            // Tablo ve Anahtar Ayarları
            builder.ToTable("UserPasswordHistories");
            builder.HasKey(uph => uph.Id);
            builder.Property(uph => uph.Id)
                   .ValueGeneratedOnAdd();

            // Alan Konfigürasyonları
            builder.Property(uph => uph.PasswordHash)
                   .IsRequired();

            builder.Property(uph => uph.ChangedAt)
                   .IsRequired()
                   .HasDefaultValueUtcNow();

            // İlişkiler
            builder.HasOne(uph => uph.User)
                   .WithMany(u => u.PasswordHistories)
                   .HasForeignKey(uph => uph.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Benzersiz İndeksler
            builder.HasIndex(uph => new { uph.UserId, uph.PasswordHash })
                   .IsUnique();
        }
    }

    // Extension method to set default value to UTC NOW
    public static class DateTimeExtensions
    {
        public static PropertyBuilder<DateTime> HasDefaultValueUtcNow(this PropertyBuilder<DateTime> builder)
        {
            return builder.HasDefaultValueSql("NOW()");
        }
    }
}