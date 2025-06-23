using file_share.Dtos.User;

namespace file_share.Services.UserServices;

public interface IUserService
{
    Task<ServiceResponse<string>> Create(UserCreateReqDto UserData);
    Task<ServiceResponse<string>> Delete(int UserID);
    Task<ServiceResponse<IEnumerable<UserGetResDto>>> Get(int UserID);
}
