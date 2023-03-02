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
    IConfiguration _configuration;

    public HomeController
    (
        IConfiguration configuration
    )
    {
        _configuration = configuration;
    }

    [HttpGet]
    //[Authorize(AuthenticationSchemes = "BasicAuthentication")]
    public async Task<IActionResult> Index()
    {
        return View();
    }

}
