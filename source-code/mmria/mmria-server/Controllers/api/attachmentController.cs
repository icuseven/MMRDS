using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.IO;
using System;
using System.Linq;

using Microsoft.AspNetCore.Authorization;
using mmria.server.model;
using Microsoft.AspNetCore.Http;

using  mmria.server.extension; 
using System;
using System.Collections.Generic;
using Microsoft.Extensions.FileProviders;


namespace mmria.server.Controllers;

[Authorize(Roles = "abstractor")]

public sealed class attachmentController : Controller
{


    private readonly ILogger<attachmentController> _logger;

    mmria.common.couchdb.OverridableConfiguration configuration;
    mmria.common.couchdb.DBConfigurationDetail db_config;
    string host_prefix = null;

    string _userName = null;
    string _download_directory = null;

    public attachmentController
    (
        ILogger<attachmentController> logger,
        IHttpContextAccessor httpContextAccessor, 
        mmria.common.couchdb.OverridableConfiguration _configuration
    )
    {
        _logger = logger;
        configuration = _configuration;
        host_prefix = httpContextAccessor.HttpContext.Request.Host.GetPrefix();
        db_config = configuration.GetDBConfig(host_prefix);
    }

    string userName
    {
        get
        {
            if (_userName == null)
            {
                if (User.Identities.Any(u => u.IsAuthenticated))
                {
                    _userName = User.Identities.First
                    (
                        u => u.IsAuthenticated && 
                        u.HasClaim(c => c.Type == System.Security.Claims.ClaimTypes.Name)
                    )
                    .FindFirst(System.Security.Claims.ClaimTypes.Name)
                    .Value.Replace("@","-").Replace("'","-");
                }
            }
            return _userName;
        }
    }

    string download_directory
    {
        get
        {
            if (_download_directory == null)
            {

                _download_directory = System.IO.Path.Combine(configuration.GetString("export_directory", host_prefix), userName);
            }
            return _download_directory;
        }
    }


    public class PostFileRequest
    {
        public string case_id { set;get; }
        public string[] file_name_list { set;get; }
        public string[] file_data_list { set; get; }
    }

    public class PostFileResponse
    {
        public bool ok { set;get; }
        public string error_message  { set; get; }
    }

    public class DirectoryListResponseItem
    {

        public string case_id { set;get; }
        public string name { set;get; }
        public string path  { set; get; }
    }

    public IActionResult Index()
    {
        var model = new FileUploadModel();
        return View(model);
    } 

    [HttpPost]
    public async Task<JsonResult> FileUpload([FromBody] PostFileRequest model)
    {
        var result = new PostFileResponse();

        try
        {
            for(var i = 0; i < model.file_name_list.Length; i++)
            {
                var file_name = model.file_name_list[i];
                var file_data = model.file_data_list[i];
                if (file_data != null)
                {
                    var directory_path = Path.Combine("/document-set", model.case_id);
                    System.IO.Directory.CreateDirectory(directory_path);
                
                    var filePath = Path.Combine(directory_path, file_name);
                    if(System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                    await System.IO.File.WriteAllBytesAsync(filePath, Convert.FromBase64String(file_data.Substring(28))); 

                    
                } 
            } 
            result.ok = true;           
        }
        catch(Exception ex)
        {
            result.error_message = ex.ToString();
        }

        
        return Json(result);
    }

    

    [HttpGet]
    public async Task<JsonResult> GetDocumentList(string id)
    {
        List<DirectoryListResponseItem> result = new ();

        try
        {
            var path = System.IO.Path.Combine("/document-set", id);
            if(System.IO.Directory.Exists(path))
            {
                var di = new DirectoryInfo(path);
                foreach(var fileInfo in di.GetFiles())
                {
                    
                    var item = new DirectoryListResponseItem()
                    {
                        case_id = id,
                        name = fileInfo.Name,
                        path = fileInfo.FullName
                    };

                    result.Add(item);
                }
                
            }
        }
        catch(Exception ex) 
        {
            System.Console.WriteLine($"{ex}");
        }


        return Json(result);
    }

    [HttpGet]
    public async Task<JsonResult> GetJurisdictionTree(string j)
    {

        mmria.common.model.couchdb.jurisdiction_tree result = null;

        try
        {
            var detail = configuration.GetDBConfig(j);
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
            var message = $"{ex}";
             
             
            System.Console.WriteLine($"{ex}");
        }


        return Json(result);
    }

        [HttpGet]
    public  async Task<FileResult> GetFileResult(string FileName)
    {
        var queue_Result = new mmria.common.steve.QueueResult();
        var path = System.IO.Path.Combine (download_directory, FileName);

        byte[] fileBytes = GetFile(path);
        return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, FileName);

    }
/*
    [HttpGet]
    public  async Task<JsonResult> DeleteFileResult(string FileName)
    {
        var path = System.IO.Path.Combine (download_directory, FileName);

        if(System.IO.File.Exists(path))
        {
            System.IO.File.Delete(path);
        }

        return await GetQueueResult();
    }
*/

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

    string GetFileName(string p_file_name)
    {
        DateTime value = DateTime.Now;

        var year = value.Year.ToString();
        var month = value.Month.ToString().PadLeft(2,'0');
        var day = value.Day.ToString().PadLeft(2,'0');
        var hour = value.Hour.ToString().PadLeft(2,'0');
        var minute = value.Minute.ToString().PadLeft(2,'0');
        var second = value.Second.ToString().PadLeft(2,'0');
        var milli_second = value.Millisecond.ToString().PadLeft(4,'0');

        return $"steveMMRIA-{p_file_name}-{year}-{month}-{day}T{hour}-{minute}-{second}-{milli_second}";
    }


}

