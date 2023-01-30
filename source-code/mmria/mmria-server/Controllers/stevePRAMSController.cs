
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.IO;


namespace mmria.server.Controllers;

[Authorize(Roles = "cdc_admin,steve_prams")]
public sealed class stevePRAMSController : Controller
{
    IConfiguration Configuration;
    private readonly ILogger<stevePRAMSController> _logger;

    public stevePRAMSController
    (
        ILogger<stevePRAMSController> logger,
        IConfiguration configuration
    )
    {
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

        using(FileStream fs = new FileStream (s, FileMode.Open, FileAccess.Read))
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

