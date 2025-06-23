
using System.ComponentModel.DataAnnotations;
using file_share.CustomAttributes;

namespace file_share.Dtos.Document;

public class DocumentCreateReqDto
{
    [Required]
    public required int DocTypeID { get; set; }
    [Required]
    public required int DocStatusID { get; set; }
    [Required]
    [MaxLength(50)]
    public required string DocNumber { get; set; }
    [Required]
    public required DateTime DocDate { get; set; }
    [Required]
    [MaxLength(50)]
    public required string DocDesc { get; set; }
    [Required]
    public required DateTime ExpiryDate { get; set; }
    [Required]
    [CleanedFile(100, "application/pdf")]
    public required IFormFile File { get; set; }
}
