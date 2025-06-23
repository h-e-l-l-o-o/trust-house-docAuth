using System.ComponentModel.DataAnnotations;

namespace file_share.Dtos.DocType;

public class DocTypeCreateReqDto
{
    [Required]
    [MaxLength(50)]
    public required string DocTypeDesc { get; set; }
}
