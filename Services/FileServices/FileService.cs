using PdfSharpCore.Pdf.IO;
using PdfSharpCore.Drawing;
using SkiaSharp;
using SkiaSharp.QrCode.Image;

namespace file_share.Services.FileServices;

public class FileService : IFileService
{

    public string SaveFiles(IFormFile File, string SaveDirectory)
    {
        int Duplicates = Directory.GetFiles(SaveDirectory, "*.pdf")
                                        .Count(file => Path.GetFileName(file)
                                                           .StartsWith(File.FileName, StringComparison.OrdinalIgnoreCase));


        string FileName = $"{Path.GetFileNameWithoutExtension(File.FileName)}-{Duplicates}.pdf";
        string FilePath = Path.Combine(SaveDirectory, FileName);

        using var Stream = new FileStream(FilePath, FileMode.Create);
        File.CopyTo(Stream);
        return FileName;
    }
    public string DeleteFile(string? FilePath)
    {
        if (string.IsNullOrWhiteSpace(FilePath))
        {
            return "Invalid Path";
        }

        try
        {
            var SafeFileName = Path.GetFileName(FilePath);

            if (string.IsNullOrEmpty(SafeFileName))
            {
                return "Invalid Path";
            }

            var Ext = Path.GetExtension(SafeFileName);
            if (!string.Equals(Ext, ".pdf", StringComparison.OrdinalIgnoreCase))
            {
                return "Invalid Path";
            }


            File.Delete(FilePath);
            return FilePath;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return "Failed";
        }
    }
    public string MakeQRCode(string InputPDF, string Link, string OutputDir, string FileName)
    {
        using var InputStream = File.OpenRead(InputPDF);
        using var Document = PdfReader.Open(InputStream, PdfDocumentOpenMode.Modify);

        FileName = Path.GetFileNameWithoutExtension(FileName);
        Console.WriteLine(FileName);
        int Duplicates = Directory.GetFiles(OutputDir, "*.pdf")
                                        .Count(file => Path.GetFileName(file)
                                                           .StartsWith(FileName, StringComparison.OrdinalIgnoreCase));


        var QRCode = new QrCode(Link, new Vector2Slim(456, 456), SKEncodedImageFormat.Png);

        using var MS = new MemoryStream();
        QRCode.GenerateImage(MS);
        MS.Position = 0;

        XImage QRImage = XImage.FromStream(() => MS);

        var Page = Document.Pages[0];
        using var gfx = XGraphics.FromPdfPage(Page);

        double QRSize = 100;
        double x = Page.Width - QRSize - 20;
        double y = Page.Height - QRSize - 20;
        gfx.DrawImage(QRImage, x, y, QRSize, QRSize);

        string OutPutPath = OutputDir + "/" + $"{FileName}-{Duplicates}.pdf";
        Document.Save(OutPutPath);

        return OutPutPath;
    }
}
