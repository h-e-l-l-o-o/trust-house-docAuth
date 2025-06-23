using System.ComponentModel.DataAnnotations;

namespace file_share.Dtos.DocType;

public class DocTypeGetResDto
{
    public required int DocTypeID { get; set; }

    public required string DocTypeDesc { get; set; }
}
