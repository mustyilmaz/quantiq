using System.ComponentModel.DataAnnotations;
namespace quantiq.Server.DTOs.Auth
{
    public class UserLoginDto
    {
        [Required]
        [StringLength(255)]
        public string EmailOrPhone {get; set;}
        [Required]
        [StringLength(255)]
        public string Password {get; set;}
        [Required]
        public string TurnstileToken {get; set;}
    }
}