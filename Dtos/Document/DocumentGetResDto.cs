namespace file_share.Dtos.Document;


public class DocumentGetResDto
{
    public IEnumerable<DocumentDto> Documents { get; set; } = [];
    public int ExpiredDocs { get; set; }
    public int ActiveDocs { get; set; }

}

public class DocumentDto
{
    public required int DocID { get; set; }
    public required int DocTypeID { get; set; }
    public required int DocStatusID { get; set; }
    public required int CreatedByUserID { get; set; }
    public required string DocNumber { get; set; }
    public required DateTime DocDate { get; set; }
    public required string DocDesc { get; set; }
    public required DateTime ExpiryDate { get; set; }
    public required DateTime CreationDate { get; set; }
    public required bool IsActive { get; set; }
    public required int VersionID { get; set; }
    public required string FilePath { get; set; }
    public required DateTime UploadedAt { get; set; }
    public required string CreatedByEmail { get; set; }
    public required string DocType { get; set; }
}


