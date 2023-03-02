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

public sealed class metadataController : Controller
{
    IConfiguration _configuration;
    IHttpClientFactory _clientFactory;

    public metadataController
    (
        IConfiguration configuration,
        IHttpClientFactory clientFactory
    )
    {
        _configuration = configuration;
        _clientFactory = clientFactory;
    }

    [HttpGet]
    //[Authorize(AuthenticationSchemes = "BasicAuthentication")]
    public async Task<IActionResult> Index()
    {
        return View();
    }



    [HttpGet]
    //[Authorize(AuthenticationSchemes = "BasicAuthentication")]
    public async Task<IActionResult> mmria_pmss_builder()
    {
            var client = _clientFactory.CreateClient("database_client");

        //var metadata_path = "metadata/mmria-pmss-builder";
        var metadata_path = "metadata/2016-06-12T13:49:24.759Z";

        var result = await client.GetFromJsonAsync<mmria.common.metadata.app>(metadata_path);

        return Json(result);
    }



    [HttpGet]
    //[Authorize(AuthenticationSchemes = "BasicAuthentication")]
    public async Task<IActionResult> ui_specification()
    {
        var client = _clientFactory.CreateClient("database_client");

        //var metadata_path = "metadata/mmria-pmss-builder";
        var metadata_path = "metadata/default_ui_specification";

        var result = await client.GetFromJsonAsync<mmria.common.metadata.UI_Specification>(metadata_path);

        return Json(result);
    }
    

}
