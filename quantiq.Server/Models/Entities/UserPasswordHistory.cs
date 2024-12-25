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
        public User User { get; set; } = new User();

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    }
}