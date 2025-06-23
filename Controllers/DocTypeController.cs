using file_share.Dtos.DocType;
using file_share.Services.DocTypeService;
using file_share.Services.UtilitiesServices;
using Microsoft.AspNetCore.Mvc;

namespace file_share.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocTypeController(IDocTypeService Service, IUtilitiesService Utils) : ControllerBase
{
    private readonly IDocTypeService _Service = Service;
    private readonly IUtilitiesService _Utils = Utils;


    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var res = await _Service.Get();
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost]
    public async Task<IActionResult> Create(DocTypeCreateReqDto req)
    {
        var res = await _Service.Create(req);
        return StatusCode(res.StatusCode, res);
    }


    [HttpPut]
    public async Task<IActionResult> Update(DocTypeUpdateReqDto req)
    {
        var res = await _Service.Update(req);
        return StatusCode(res.StatusCode, res);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int DocTypeID)
    {
        var res = await _Service.Delete(DocTypeID);
        return StatusCode(res.StatusCode, res);
    }

}
