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
            builder.Property(uph => uph.Password1)
                   .IsRequired()
                   .HasMaxLength(255);

            builder.Property(uph => uph.Password1ChangedAt)
                   .IsRequired()
                   .HasDefaultValueUtcNow();

            builder.Property(uph => uph.Password2)
                   .HasMaxLength(255);

            builder.Property(uph => uph.Password2ChangedAt)
                   .HasDefaultValue(null);

            builder.Property(uph => uph.Password3)
                   .HasMaxLength(255);

            builder.Property(uph => uph.Password3ChangedAt)
                   .HasDefaultValue(null);

            // İlişkiler
            builder.HasOne(uph => uph.User)
                   .WithMany(u => u.PasswordHistories)
                   .HasForeignKey(uph => uph.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
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