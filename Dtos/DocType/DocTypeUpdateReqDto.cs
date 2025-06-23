using System.ComponentModel.DataAnnotations;

namespace file_share.Dtos.DocType;

public class DocTypeUpdateReqDto
{
    [Required]
    public required int DocTypeID { get; set; }
    [Required]
    [MaxLength(50)]
    public required string NewDocTypeDesc { get; set; }

}
