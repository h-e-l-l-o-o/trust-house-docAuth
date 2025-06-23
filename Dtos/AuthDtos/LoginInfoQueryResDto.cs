using System.ComponentModel.DataAnnotations;

namespace file_share.Dtos.AuthDtos;

public class LoginInfoQueryResDto
{
    [Required]
    public required int UserID { get; set; }
    [Required]
    public required string Hash { get; set; }

}
