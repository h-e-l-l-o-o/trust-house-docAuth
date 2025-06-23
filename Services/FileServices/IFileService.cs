namespace file_share.Services.FileServices;

public interface IFileService
{
    public string SaveFiles(IFormFile File, string SaveDirectory);
    public string DeleteFile(string? Path);
    public string MakeQRCode(string InpuPDF, string Link, string OutputDir, string FileName);
}
