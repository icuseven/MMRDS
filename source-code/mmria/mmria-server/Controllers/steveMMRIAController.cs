using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Microsoft.AspNetCore.Authorization;


namespace mmria.server.Controllers;

[Authorize(Roles = "cdc_admin,steve_mmria")]
public sealed class steveMMRIAController : Controller
{
    private readonly ILogger<steveMMRIAController> _logger;

    public steveMMRIAController(ILogger<steveMMRIAController> logger)
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

