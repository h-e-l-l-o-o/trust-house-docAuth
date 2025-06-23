using System.ComponentModel.DataAnnotations;

namespace file_share.Dtos.AuthDtos;

public class LoginReqDto
{
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public required string Email { get; set; }
    [Required]
    [MaxLength(255)]
    public required string DeviceID { get; set; }
    [Required]
    [MaxLength(255)]
    public required string Password { get; set; }

}
