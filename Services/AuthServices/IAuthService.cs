using file_share.Dtos.AuthDtos;

namespace file_share.Services.AuthServices;

public interface IAuthService
{
    Task<ServiceResponse<int>> Login(LoginReqDto LoginInfo);
    Task<ServiceResponse<string>> GetToken();
    Task<ServiceResponse<string>> SetUserRole(UserRoleReqDto UserData);
}
