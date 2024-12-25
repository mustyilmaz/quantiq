using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quantiq.Server.Models.Entities
{
    [Table("Users")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Surname { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Phone]
        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        public int? CreatedBy { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? DeletedBy { get; set; }

        public DateTime? DeletedAt { get; set; }

        // Doğrulama alanları
        public bool IsEmailVerified { get; set; } = false;
        public bool IsPhoneNumberVerified { get; set; } = false;

        // Profil Kısıtlaması
        [NotMapped]
        public bool IsProfileRestricted => !IsEmailVerified || !IsPhoneNumberVerified;

        // Kullanıcı Rolü
        [Required]
        public UserRole Role { get; set; } = UserRole.User;

        // Üyelik Paketi
        [Required]
        public MembershipPackage Package { get; set; } = MembershipPackage.Free;

        public bool IsActive { get; set; } = true;

        // Profil fotoğrafı URL'si
        [StringLength(255)]
        public string? ProfilePictureUrl { get; set; }

        // Kullanıcıya özel ayarlar için JSON alanı
        public string? SettingsJson { get; set; }

        // KVKK ve Gizlilik Alanları
        public bool HasConsentedKVKK { get; set; } = false;
        public DateTime? ConsentDateKVKK { get; set; }

        public bool HasAcceptedPrivacyPolicy { get; set; } = false;
        public DateTime? AcceptanceDatePrivacyPolicy { get; set; }

        public bool HasAcceptedUserAgreement { get; set; } = false;
        public DateTime? AcceptanceDateUserAgreement { get; set; }

        // İki Faktörlü Kimlik Doğrulama
        public bool TwoFactorEnabled { get; set; } = false;
        public string? TwoFactorSecret { get; set; }

        // Şifre Sıfırlama
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpiry { get; set; }
        public DateTime? LastPasswordChange { get; set; }

        // Güvenlik Özellikleri
        public int AccessFailedCount { get; set; } = 0;
        public bool LockoutEnabled { get; set; } = true;
        public DateTime? LockoutEnd { get; set; }

        // Şifre Geçmişi
        public ICollection<UserPasswordHistory> PasswordHistories { get; set; } = new List<UserPasswordHistory>();
    }

    public enum UserRole
    {
        User = 0,
        Admin = 1
    }

    public enum MembershipPackage
    {
        Free = 0,
        Packet1 = 1,
        Packet2 = 2
    }
}