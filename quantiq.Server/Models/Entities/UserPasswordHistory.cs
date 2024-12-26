using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quantiq.Server.Models.Entities
{
    [Table("UserPasswordHistories")]
    public class UserPasswordHistory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        // Son 3 Şifre
        [Required]
        public string Password1 { get; set; } = string.Empty;

        public DateTime Password1ChangedAt { get; set; } = DateTime.UtcNow;

        public string? Password2 { get; set; }

        public DateTime? Password2ChangedAt { get; set; }

        public string? Password3 { get; set; }

        public DateTime? Password3ChangedAt { get; set; }
    }
}