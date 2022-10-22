
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Microsoft.AspNetCore.Authorization;


namespace mmria.server.Controllers;

[Authorize(Roles = "cdc_admin,steve_prams")]
public sealed class stevePRAMSController : Controller
{
    private readonly ILogger<stevePRAMSController> _logger;

    public stevePRAMSController(ILogger<stevePRAMSController> logger)
    {
        _logger = logger;
    }

    
    public IActionResult Index()
    {
        //var model = new FileUploadModel();
        //return View(model);

        return View();
    }
/*
    [HttpGet]
    public IActionResult FileUpload()
    {
        var model = new FileUploadModel();
        return View(model);
    }
*/
}

