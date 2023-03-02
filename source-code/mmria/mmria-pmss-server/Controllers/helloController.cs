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

public sealed class helloController : Controller
{
    IConfiguration _configuration;

    public helloController
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
        return Ok(new mmria_pmss_server.Message() {  Text = "Hello World!" });
    }

}
