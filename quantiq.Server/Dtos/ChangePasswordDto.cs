using System.ComponentModel.DataAnnotations;
public class ChangePasswordDTO
{
    [Required(ErrorMessage = "Mevcut şifre gereklidir")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Yeni şifre gereklidir")]
    [MinLength(8, ErrorMessage = "Şifre en az 8 karakter olmalıdır")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
        ErrorMessage = "Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir")]
    public string NewPassword { get; set; } = string.Empty;
}