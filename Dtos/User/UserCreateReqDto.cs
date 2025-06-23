using System.ComponentModel.DataAnnotations;
using file_share.CustomAttributes;

namespace file_share.Dtos.User;

public class UserCreateReqDto
{
    [Required]
    [MaxLength(50)]
    public required string UserName { get; set; }
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public required string Email { get; set; }
    [Required]
    [MaxLength(50)]
    public required string EmployeeFirstName { get; set; }
    [Required]
    [MaxLength(50)]
    public required string EmployeeSecondName { get; set; }
    [Required]
    [MaxLength(50)]
    public required string EmployeeThirdName { get; set; }
    [Required]
    [MaxLength(50)]
    public required string EmployeeFourthName { get; set; }
    [Required]
    [MaxLength(50)]
    public required string IDNumber { get; set; }
    [Required]
    public required DateTime IDDate { get; set; }
    [Required]
    [MaxLength(50)]
    [AllowedPassword]
    public required string Password { get; set; }

}
