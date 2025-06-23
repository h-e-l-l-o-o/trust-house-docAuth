using file_share.Dtos.Document;
using file_share.Services.DocumentService;
using file_share.Services.FileServices;
using file_share.Services.UtilitiesServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace file_share.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentController(IDocumentService Service, IUtilitiesService Utils, IFileService File) : ControllerBase
{
    private readonly IDocumentService _Service = Service;
    private readonly IUtilitiesService _Utils = Utils;
    private readonly IFileService _File = File;


    [HttpPost]
    public async Task<IActionResult> Create([FromForm] DocumentCreateReqDto req)
    {
        var res = await _Service.Create(req);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut]
    public async Task<IActionResult> PUT([FromForm] DocumentUpdateReqDto req)
    {
        var res = await _Service.Update(req);
        return StatusCode(res.StatusCode, res);
    }


    [HttpGet]
    public async Task<IActionResult> Get(int DocID)
    {
        var res = await _Service.Get(DocID);
        return StatusCode(res.StatusCode, res);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int DocID)
    {
        var res = await _Service.Delete(DocID);
        return StatusCode(res.StatusCode, res);
    }


    [HttpGet("Download")]
    [Authorize]
    public IActionResult Download(string FileName)
    {
        var UserClaims = HttpContext.User;
        string? Roles = UserClaims.FindFirst("Roles")?.Value;

        if (!_Utils.HasRole(Roles, "CanRead"))
        {
            return StatusCode(403);
        }

        if (!System.IO.File.Exists($"Files/Final/{FileName}"))
            return NotFound($"File ${FileName} not found.");

        return PhysicalFile($"/home/xau/Desktop/work/file-share/Files/Final/{FileName}", "application/pdf", FileName);

    }


    [HttpGet("verify")]
    public async Task<IActionResult> Verify(string encryptedToken)
    {
        static string HtmlWrapper(string title, string body, string color = "#333") =>
            $@"<!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>{title}</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }}
                .container {{
                    background-color: white;
                    padding: 30px 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    color: {color};
                    max-width: 500px;
                    width: 100%;
                }}
                h1 {{
                    margin-bottom: 20px;
                    font-size: 28px;
                }}
                p {{
                    font-size: 18px;
                }}
            </style>
        </head>
        <body>
            <div class='container'>
                <h1>{title}</h1>
                <p>{body}</p>
            </div>
        </body>
        </html>";

        if (string.IsNullOrWhiteSpace(encryptedToken))
        {
            return Content(HtmlWrapper("Invalid Request", "No token provided.", "#c0392b"), "text/html");
        }

        var serviceRes = await _Service.VerifyDocument(encryptedToken);

        if (serviceRes.StatusCode == 404)
        {
            return Content(HtmlWrapper("Invalid QR Token", "The provided token was not recognized.", "#e74c3c"), "text/html");
        }

        if (serviceRes.StatusCode != 200)
        {
            return Content(HtmlWrapper("Error", "Unable to verify your token at this time.", "#e67e22"), "text/html");
        }

        var dto = serviceRes.Data!;
        var expiry = dto.ExpiryDate.ToString("yyyy-MM-dd");

        if (dto.IsExpired)
        {
            return Content(HtmlWrapper("QR Code Expired", $"Your token expired on <strong>{expiry}</strong>.", "#e74c3c"), "text/html");
        }
        else
        {
            return PhysicalFile($"/home/xau/Desktop/work/file-share/Files/Final/{dto.FilePath}", "application/pdf", dto.FilePath);
        }
    }

}
