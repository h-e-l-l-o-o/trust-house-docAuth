using file_share.Dtos.AuthDtos;
using file_share.Services.AuthServices;
using file_share.Services.UtilitiesServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace file_share.Controllers;

[ApiController]
[Route("api/[controller]")]
public class Auth(IAuthService Service, IUtilitiesService Utils) : ControllerBase
{
    private readonly IAuthService _Service = Service;
    private readonly IUtilitiesService _Utils = Utils;


    [HttpPost("Login")]
    public async Task<IActionResult> Login(LoginReqDto req)
    {
        var res = await _Service.Login(req);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var res = await _Service.GetToken();
        return StatusCode(res.StatusCode, res);
    }

    [Authorize]
    [HttpPost("SetUserRole")]
    public async Task<IActionResult> SetUserRole(UserRoleReqDto req)
    {
        var UserClaims = HttpContext.User;
        string? Roles = UserClaims.FindFirst("Roles")?.Value;

        // if (!_Utils.HasRole(Roles, "Admin"))
        // {
        //     return StatusCode(403);
        // }

        var res = await _Service.SetUserRole(req);
        return StatusCode(res.StatusCode, res);
    }

}
