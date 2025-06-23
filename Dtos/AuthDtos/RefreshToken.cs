namespace file_share.Dtos.AuthDtos;

public class RefreshToken
{

    public required int UserId { get; set; }
    public required string Token { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required DateTime ExpiresAt { get; set; }
}
