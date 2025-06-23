using file_share.Dtos.User;
using file_share.Services.UserServices;
using file_share.Services.UtilitiesServices;
using Microsoft.AspNetCore.Mvc;

namespace file_share.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService Service, IUtilitiesService Utils) : ControllerBase
{
    private readonly IUserService _Service = Service;
    private readonly IUtilitiesService _Utils = Utils;

    [HttpPost]
    public async Task<IActionResult> Create(UserCreateReqDto req)
    {
        var res = await _Service.Create(req);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet]
    public async Task<IActionResult> Get(int UserID)
    {
        var res = await _Service.Get(UserID);
        return StatusCode(res.StatusCode, res);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int UserID)
    {
        var res = await _Service.Delete(UserID);
        return StatusCode(res.StatusCode, res);
    }

}
