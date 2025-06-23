using file_share.Dtos.DocType;

namespace file_share.Services.DocTypeService;

public interface IDocTypeService
{
    Task<ServiceResponse<string>> Create(DocTypeCreateReqDto DocTypeData);
    Task<ServiceResponse<string>> Update(DocTypeUpdateReqDto DocTypeData);
    Task<ServiceResponse<string>> Delete(int DocTypeID);
    Task<ServiceResponse<IEnumerable<DocTypeGetResDto>>> Get();
}
