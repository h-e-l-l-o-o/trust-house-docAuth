using System.ComponentModel.DataAnnotations;
using file_share.CustomAttributes;

namespace file_share.Dtos.Document;

public class DocumentUpdateReqDto
{
    [Required]
    public required int DocID { get; set; }
    [Required]
    [CleanedFile(100, "application/pdf")]
    public required IFormFile File { get; set; }
}
