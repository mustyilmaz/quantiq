using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using quantiq.Server.Models.Entities;

namespace quantiq.Server.Data.Configurations
{
    public class TrendyolConfiguration : IEntityTypeConfiguration<TrendyolConf>
    {
        public void Configure(EntityTypeBuilder<TrendyolConf> builder)
        {
            // Tablo ve Anahtar Ayarları
            builder.ToTable("TrendyolConf");
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Id)
                   .ValueGeneratedOnAdd();

            // Alan Konfigürasyonları
            builder.Property(t => t.Description)
                   .HasMaxLength(100);

            builder.Property(t => t.Apikey)
                   .IsRequired()
                   .HasMaxLength(256);

            builder.Property(t => t.SuppleirId)
                   .IsRequired()
                   .HasMaxLength(256);

            builder.Property(t => t.SecretApikey)
                   .IsRequired()
                   .HasMaxLength(256);

            // Benzersiz İndeksler
            builder.HasIndex(t => t.Apikey)
                   .IsUnique();

            builder.HasIndex(t => t.SuppleirId)
                   .IsUnique();

            // İlişkiler
            builder.HasOne(t => t.User)
                   .WithMany()
                   .HasForeignKey(t => t.UserId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}