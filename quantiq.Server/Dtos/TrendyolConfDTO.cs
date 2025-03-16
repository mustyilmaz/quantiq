using System.ComponentModel.DataAnnotations;

namespace quantiq.Server.DTOs
{
    public class TrendyolConfDTO
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(256)]
        public string Apikey { get; set; } = string.Empty;

        [Required]
        [MaxLength(256)]
        public string SuppleirId { get; set; } = string.Empty;

        [Required]
        [MaxLength(256)]
        public string SecretApikey { get; set; } = string.Empty;
    }
} 