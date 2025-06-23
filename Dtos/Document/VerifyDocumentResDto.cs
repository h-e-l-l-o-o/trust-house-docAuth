namespace file_share.Dtos.Document;

public class VerifyDocumentResDto
{
    public required DateTime ExpiryDate { get; set; }
    public bool IsExpired => ExpiryDate < DateTime.Today;
    public required string FilePath { get; set; }
}
