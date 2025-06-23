using file_share.Dtos.Document;

namespace file_share.Services.DocumentService;

public interface IDocumentService
{
    Task<ServiceResponse<string>> Create(DocumentCreateReqDto DocumentData);
    Task<ServiceResponse<string>> Update(DocumentUpdateReqDto DocumentData);
    Task<ServiceResponse<DocumentGetResDto>> Get(int DocID);
    Task<ServiceResponse<string>> Delete(int DocID);
    Task<ServiceResponse<VerifyDocumentResDto>> VerifyDocument(string encryptedToken);
}
