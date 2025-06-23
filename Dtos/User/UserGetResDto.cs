namespace file_share.Dtos.User;

public class UserGetResDto
{
    public required int UserID { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string EmpFName { get; set; }
    public required string EmpSName { get; set; }
    public required string EmpThName { get; set; }
    public required string EmpFmName { get; set; }
    public required string IDNo { get; set; }
    public required DateTime IDDate { get; set; }
    public string? RolesCsv { get; set; }
}
