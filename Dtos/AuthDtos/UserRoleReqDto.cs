using System.ComponentModel.DataAnnotations;
using file_share.CustomAttributes;

namespace file_share.Dtos.AuthDtos;

public class UserRoleReqDto
{
    [Required]
    [MaxLength(500)]
    [AllowedRoles]
    public required string RolesCSV { get; set; }
    [Required]
    public required int UserID { get; set; }

}
