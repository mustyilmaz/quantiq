using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quantiq.Server.Models.Entities
{
    [Table("TrendyolConf")]
    public class TrendyolConf
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("User")]
        [Required]
        public int UserId { get; set; }

        [Required]
        public User User { get; set; }

        [MaxLength(100)]
        public string Description { get; set; }

        [MaxLength(256)]
        [Required]
        public string Apikey { get; set; }

        [MaxLength(256)]
        [Required]
        public string SuppleirId { get; set; }

        [MaxLength(256)]
        [Required]
        public string SecretApikey { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? DeletedBy { get; set; }

        public DateTime? DeletedAt { get; set; }
    }
}