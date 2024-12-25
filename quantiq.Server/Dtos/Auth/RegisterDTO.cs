using System.ComponentModel.DataAnnotations;

namespace quantiq.Server.DTOs.Auth
{
    public class RegisterDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Surname { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
            ErrorMessage = "Password does not meet requirements")]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Compare(nameof(Password), ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required]
        public string TurnstileToken { get; set; } = string.Empty;

        [Required]
        public bool HasConsentedKVKK { get; set; }

        [Required]
        public bool HasAcceptedPrivacyPolicy { get; set; }

        [Required]
        public bool HasAcceptedUserAgreement { get; set; }
    }
}