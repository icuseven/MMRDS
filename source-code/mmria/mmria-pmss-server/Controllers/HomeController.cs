using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using System;
using System.IO;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using System.Net;

namespace mmria_pmss_server.Controllers;

//[Authorize]
//[Route("api/[controller]/[action]")]

public sealed class HomeController : Controller
{
    readonly IConfiguration _configuration;
    readonly IWebHostEnvironment _webHostEnvironment;

    public HomeController
    (
        IConfiguration configuration,
        IWebHostEnvironment webHostEnvironment
    )
    {
        _configuration = configuration;
        _webHostEnvironment= webHostEnvironment;
    }

    [HttpGet]
    //[Authorize(AuthenticationSchemes = "BasicAuthentication")]
    public async Task<IActionResult> Index()
    {
        //string webRootPath = _webHostEnvironment.ContentRootPath;
        string path = Path.Combine("/opt/app-root/app/wwwroot" , "index.html");
        return File(await System.IO.File.ReadAllTextAsync(path), "text/html");

        return View();
    }

}
