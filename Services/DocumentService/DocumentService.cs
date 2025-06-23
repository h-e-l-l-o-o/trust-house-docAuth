using System.Data;
using System.Security.Cryptography;
using System.Text;
using Dapper;
using file_share.DataContext;
using file_share.Dtos.Document;
using file_share.Services.FileServices;
using Microsoft.Data.SqlClient;

namespace file_share.Services.DocumentService;

public class DocumentService(IDapperContext Data, IHttpContextAccessor Context, IFileService File) : IDocumentService
{
    private readonly IDapperContext _db = Data;
    private readonly IHttpContextAccessor _HttpContext = Context;
    private readonly IFileService _File = File;

    public async Task<ServiceResponse<string>> Delete(int DocID)
    {
        var res = new ServiceResponse<string>();

        try
        {
            using var con = _db.CreateConnection();
            con.Open();
            var Parameters = new DynamicParameters();
            Parameters.Add("@DocID", DocID);


            await con.ExecuteAsync("SP_Delete_Doc", Parameters, commandType: CommandType.StoredProcedure);

            res.Data = "deleted";
            return res;

        }
        catch (SqlException ex)
        {

            if (ex.Number == 50001)
            {
                res.StatusCode = 404;
                res.ErrorMessage = "not found";
                return res;
            }

            Console.WriteLine(ex);
            res.StatusCode = 500;
            res.ErrorMessage = "Something Went Wrong";
            return res;
        }
    }

    public async Task<ServiceResponse<string>> Create(DocumentCreateReqDto DocumentData)
    {
        var res = new ServiceResponse<string>();
        var UserID = _HttpContext.HttpContext?.Request.Cookies["userID"];

        if (UserID is null)
        {
            res.StatusCode = 401;
            res.ErrorMessage = "Login";
            return res;
        }

        string FilePath = _File.SaveFiles(DocumentData.File, "Files/Temp");
        string? Domain = Context.HttpContext?.Request.Host.Value;
        string EncryptedToken = GenerateEncryptedToken();
        string Link = $"{Domain}/QRCode?QRCode=%{EncryptedToken}";
        string FinalFilePath = _File.MakeQRCode($"Files/Temp/{FilePath}", Link, "Files/Final", DocumentData.File.FileName);

        try
        {
            using var con = _db.CreateConnection();
            con.Open();
            var Parameters = new DynamicParameters();
            Parameters.Add("@DocTypeID", DocumentData.DocTypeID);
            Parameters.Add("@DocStatusID", DocumentData.DocStatusID);
            Parameters.Add("@CreatedByUserID", Int32.Parse(UserID));
            Parameters.Add("@DocNumber", DocumentData.DocNumber);
            Parameters.Add("@DocDate", DocumentData.DocDate);
            Parameters.Add("@DocDesc", DocumentData.DocDesc);
            Parameters.Add("@ExpiryDate", DocumentData.ExpiryDate);
            Parameters.Add("@FilePath", FilePath);
            Parameters.Add("@FinalFilePath", FinalFilePath);
            Parameters.Add("@EncryptedToken", EncryptedToken);

            await con.ExecuteAsync("SP_Create_Document", Parameters, commandType: CommandType.StoredProcedure);
            _File.DeleteFile($"Files/Temp/{FilePath}");

            res.Data = "Worked";
            return res;

        }
        catch (SqlException ex)
        {
            _File.DeleteFile(FinalFilePath);

            if (ex.Number == 50001)
            {
                res.StatusCode = 404;
                res.ErrorMessage = "Invalid DocType";
                return res;
            }

            if (ex.Number == 547)
            {
                Console.WriteLine(ex);
                res.StatusCode = 404;
                res.ErrorMessage = "Invalid StatusID";
                return res;
            }

            Console.WriteLine(ex);
            res.StatusCode = 500;
            res.ErrorMessage = "Something Went Wrong";
            return res;
        }

    }

    public async Task<ServiceResponse<DocumentGetResDto>> Get(int DocID)
    {
        var res = new ServiceResponse<DocumentGetResDto>();

        try
        {
            using var con = _db.CreateConnection();
            con.Open();
            var Parameters = new DynamicParameters();
            Parameters.Add("@DocID", DocID == 0 ? null : DocID);
            var DocumentResponseObj = new DocumentGetResDto
            {
                Documents = await con.QueryAsync<DocumentDto>("SP_Get_Document", Parameters, commandType: CommandType.StoredProcedure)
            };

            foreach (var Doc in DocumentResponseObj.Documents)
            {
                Doc.FilePath = Path.GetFileName(Doc.FilePath);
                if (Doc.ExpiryDate >= DateTime.Today)
                {
                    DocumentResponseObj.ActiveDocs += 1;
                    continue;
                }

                DocumentResponseObj.ExpiredDocs += 1;
            }


            res.Data = DocumentResponseObj;
            return res;

        }
        catch (SqlException ex)
        {

            Console.WriteLine(ex);
            res.StatusCode = 500;
            res.ErrorMessage = "Something Went Wrong";
            return res;
        }
    }

    public async Task<ServiceResponse<string>> Update(DocumentUpdateReqDto DocumentData)
    {
        var res = new ServiceResponse<string>();
        var UserID = _HttpContext.HttpContext?.Request.Cookies["userID"];

        if (UserID is null)
        {
            res.StatusCode = 401;
            res.ErrorMessage = "Login";
            return res;
        }

        string FilePath = _File.SaveFiles(DocumentData.File, "Files/Final");

        try
        {
            using var con = _db.CreateConnection();
            con.Open();
            var Parameters = new DynamicParameters();


            Parameters.Add("@DocID", DocumentData.DocID);
            Parameters.Add("@FilePath", FilePath);
            Parameters.Add("@DocStatusID", 3);
            Parameters.Add("@OldFilePath", dbType: DbType.String, size: 255, direction: ParameterDirection.Output);

            await con.ExecuteAsync("SP_Create_DocVersion", Parameters, commandType: CommandType.StoredProcedure);

            var OldPath = $"Files/Final/{Parameters.Get<string>("@OldFilePath")}";
            string isDeleted = _File.DeleteFile(OldPath);
            Console.WriteLine(isDeleted);

            res.Data = "Worked";
            return res;
        }
        catch (SqlException ex)
        {
            _File.DeleteFile(FilePath);

            if (ex.Number == 50001)
            {
                res.StatusCode = 404;
                res.ErrorMessage = "Invalid DocIDe";
                return res;
            }

            Console.WriteLine(ex);
            res.StatusCode = 500;
            res.ErrorMessage = "Something Went Wrong";
            return res;
        }
    }

    public async Task<ServiceResponse<VerifyDocumentResDto>> VerifyDocument(string encryptedToken)
    {
        var res = new ServiceResponse<VerifyDocumentResDto>();
        try
        {
            using var con = _db.CreateConnection();
            con.Open();

            var Parameters = new DynamicParameters();
            Parameters.Add("@EncryptedToken", encryptedToken, DbType.String, ParameterDirection.Input);
            Parameters.Add("@ExpiryDate", dbType: DbType.Date, direction: ParameterDirection.Output);
            Parameters.Add("@FilePath", dbType: DbType.String, size: 255, direction: ParameterDirection.Output);

            await con.ExecuteAsync("SP_Verify_Document", Parameters, commandType: CommandType.StoredProcedure);

            res.Data = new VerifyDocumentResDto { ExpiryDate = Parameters.Get<DateTime>("@ExpiryDate"), FilePath = Path.GetFileName(Parameters.Get<string>("@FilePath")) };
            return res;
        }
        catch (SqlException)
        {
            res.StatusCode = 404;
            res.ErrorMessage = "Invalid QR token.";
            return res;
        }
    }

    private static string GenerateEncryptedToken()
    {
        string Salt = "pepepopoencryptian";

        string TimeStamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff");
        string RawInput = $"{Salt}|{TimeStamp}";
        byte[] HashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(RawInput));

        var StringBytes = new StringBuilder(HashBytes.Length * 2);
        foreach (byte b in HashBytes)
            StringBytes.Append(b.ToString("x2"));

        return StringBytes.ToString();
    }
}
