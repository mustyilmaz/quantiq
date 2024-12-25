using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using quantiq.Server.Models.Entities;

namespace quantiq.Server.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            // Tablo ve Anahtar Ayarları
            builder.ToTable("Users");
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Id)
                   .ValueGeneratedOnAdd();

            // Alan Konfigürasyonları
            builder.Property(u => u.Name)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(u => u.Surname)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(u => u.Email)
                   .IsRequired()
                   .HasMaxLength(255);

            builder.Property(u => u.PhoneNumber)
                   .IsRequired()
                   .HasMaxLength(20);

            builder.Property(u => u.PasswordHash)
                   .IsRequired();

            builder.Property(u => u.ProfilePictureUrl)
                   .HasMaxLength(255);

            builder.Property(u => u.Role)
                   .IsRequired();

            builder.Property(u => u.Package)
                   .IsRequired();

            // KVKK ve Gizlilik Alanları
            builder.Property(u => u.HasConsentedKVKK)
                   .HasDefaultValue(false);

            builder.Property(u => u.HasAcceptedPrivacyPolicy)
                   .HasDefaultValue(false);

            builder.Property(u => u.HasAcceptedUserAgreement)
                   .HasDefaultValue(false);

            builder.Property(u => u.TwoFactorEnabled)
                   .HasDefaultValue(false);

            builder.Property(u => u.IsActive)
                   .HasDefaultValue(true);

            // Şifre Geçmişi İlişkisi
            builder.HasMany(u => u.PasswordHistories)
                   .WithOne(uph => uph.User)
                   .HasForeignKey(uph => uph.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Benzersiz İndeksler
            builder.HasIndex(u => u.Email)
                   .IsUnique();

            builder.HasIndex(u => u.PhoneNumber)
                   .IsUnique();
        }
    }
}