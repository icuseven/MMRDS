using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.IO;
using Akka.Actor;


namespace mmria.server.Controllers;

[Authorize(Roles = "cdc_admin,steve_prams")]
public sealed class stevePRAMSController : Controller
{
    IConfiguration Configuration;

    ActorSystem _actorSystem;
    readonly ILogger<stevePRAMSController> _logger;

    Dictionary<string,string> mailbox_map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        { "PRAMS","PRAMS"}
    };



    public stevePRAMSController
    (
        ActorSystem actorSystem,
        ILogger<stevePRAMSController> logger,
        IConfiguration configuration
    )
    {
        _actorSystem  = actorSystem;
        _logger = logger;
        Configuration = configuration;
    }

    
    public IActionResult Index()
    {

        return View();
    }

    [HttpGet]
    public JsonResult GetQueueResult()
    {
        var queue_Result = new mmria.common.steve.QueueResult();
        return Json(queue_Result);
    }

    [HttpPost]
    public async Task<JsonResult> SetDownloadRequest
    (
        [FromBody] DownloadRequest request
    )
    {


        var queue_Result = new mmria.common.steve.QueueResult();
        if(mailbox_map.ContainsKey(request.Mailbox))
        {
            System.DateTime? result = null; 

            var processor = _actorSystem.ActorSelection("user/steve-api-supervisor");

            request.seaBucketKMSKey = Configuration["steve_api:sea_bucket_kms_key"];
            request.clientName = Configuration["steve_api:client_name"];
            request.clientSecretKey = Configuration["steve_api:client_secreat_key"];
            request.base_url = Configuration["steve_api:base_url"];

            request.download_directory = Configuration["mmria_settings:export_directory"];

            result = (System.DateTime) await processor.Ask(request);
            
            System.Console.WriteLine("here");

        }
        return Json(queue_Result);
    }
    

    [HttpGet]
    public  async Task<FileResult> GetFileResult(string FileName)
    {
        var queue_Result = new mmria.common.steve.QueueResult();
        var path = System.IO.Path.Combine (Configuration["mmria_settings:export_directory"], FileName);


        byte[] fileBytes = GetFile(path);
        return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, FileName);

    }


    byte[] GetFile(string s)
    {
        byte[] data;
        int br;
        int fs_length;

        using
        (
            FileStream fs = new FileStream (s, FileMode.Open, FileAccess.Read)
        )
        {
            fs_length = (int) fs.Length;
            data = new byte[fs.Length];
            br = fs.Read(data, 0, data.Length);
        }
        if (br != (int) fs_length)
            throw new System.IO.IOException(s);
        return data;
    }
}

