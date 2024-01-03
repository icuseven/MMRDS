using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using mmria.server.model;
using System;


namespace VitalsImport_FileUpload.Controllers;

[Authorize(Roles = "vital_importer")]
public sealed class vitalsController : Controller
{
    private readonly ILogger<vitalsController> _logger;

    mmria.common.couchdb.ConfigurationSet configuration;

    public vitalsController
    (
        ILogger<vitalsController> logger,
        mmria.common.couchdb.ConfigurationSet _configuration
    )
    {
        _logger = logger;
        configuration = _configuration;
    }

    
    public IActionResult Index()
    {
        var model = new FileUploadModel();
        return View(model);
    }

    [HttpGet]
    public IActionResult FileUpload()
    {
        var model = new FileUploadModel();
        return View(model);
    }

    [HttpGet]
    public async Task<JsonResult> GetFolderList(string h)
    {
        mmria.common.model.couchdb.jurisdiction_tree result = null;

        try
        {
            var detail = configuration.detail_list[h];
            string jurisdiction_tree_url = $"{detail.url}/jurisdiction/jurisdiction_tree";
            if(!string.IsNullOrWhiteSpace(detail.prefix))
            {
                jurisdiction_tree_url = $"{detail.url}/{detail.prefix}jurisdiction/jurisdiction_tree";
            }

            var jurisdiction_curl = new mmria.server.cURL("GET", null, jurisdiction_tree_url, null, detail.user_name, detail.user_value);
            string response_from_server = await jurisdiction_curl.executeAsync ();

            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.jurisdiction_tree>(response_from_server);

        }
        catch(Exception ex) 
        {
            System.Console.WriteLine($"{ex}");
        }


        return Json(result);
    }

}

