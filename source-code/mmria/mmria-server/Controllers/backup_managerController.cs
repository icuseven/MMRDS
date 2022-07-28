
﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers;

[Authorize(Roles = "installation_admin")]

public class backupManagerController : Controller
{

    private readonly IConfiguration _configuration;

    mmria.common.couchdb.ConfigurationSet ConfigDB;
    private readonly ILogger<backupManagerController> _logger;

    public backupManagerController
    (
        ILogger<backupManagerController> logger, 
        IConfiguration configuration, 
        mmria.common.couchdb.ConfigurationSet p_config_db
    )
	{
        _logger = logger;
		_configuration = configuration;
        ConfigDB = p_config_db;
    }

    //[Route("backupManager")]    
    public async Task<IActionResult> Index()
    {

        var config_url = _configuration["mmria_settings:vitals_url"].Replace("/api/Message/IJESet","");

        var base_url = $"{config_url}/api/backup/GetFileList";


        var server_statu_curl = new mmria.server.cURL("GET", null, base_url, null);
        server_statu_curl.AddHeader("vital-service-key", ConfigDB.name_value["vital_service_key"]);

        var responseContent = await server_statu_curl.executeAsync();

        List<string> file_list = System.Text.Json.JsonSerializer.Deserialize<List<string>>(responseContent);

        return View(file_list);
    }

    //[Route("backup-manager/PerformHotBackup")]
    public async Task<IActionResult>  PerformHotBackup()
    {
        var config_url = _configuration["mmria_settings:vitals_url"].Replace("/api/Message/IJESet","");

        var base_url = $"{config_url}/api/backup/PerformHotBackup";


        var server_statu_curl = new mmria.server.cURL("GET", null, base_url, null);
        server_statu_curl.AddHeader("vital-service-key", ConfigDB.name_value["vital_service_key"]);

        var responseContent = await server_statu_curl.executeAsync();
        //System.Console.WriteLine(responseContent);

        return Ok(responseContent);
    }

    //[Route("backup-manager/PerformColdBackup")]
    public async Task<IActionResult>  PerformColdBackup()
    {

        var config_url = _configuration["mmria_settings:vitals_url"].Replace("/api/Message/IJESet","");
        var base_url = $"{config_url}/api/backup/PerformColdBackup";

        var server_statu_curl = new mmria.server.cURL("GET", null, base_url, null);
        server_statu_curl.AddHeader("vital-service-key",  ConfigDB.name_value["vital_service_key"]);

        var responseContent = await server_statu_curl.executeAsync();
        //System.Console.WriteLine(responseContent);

        return Ok(responseContent);
    }

    [Route("backupManager/GetFile/{id}")]
    public async Task<IActionResult>  GetFile(string id)
    {

        var config_url = _configuration["mmria_settings:vitals_url"].Replace("/api/Message/IJESet","");
        var base_url = $"{config_url}/api/backup/GetFile/{id}";

        var server_statu_curl = new mmria.server.cURL("GET", null, base_url, null);
        server_statu_curl.AddHeader("vital-service-key",  ConfigDB.name_value["vital_service_key"]);

        var responseContent = await server_statu_curl.executeAsync();
        //System.Console.WriteLine(responseContent);
       
        var bytes = Convert.FromBase64String(responseContent);
        var contents = new System.Net.Http.StreamContent(new MemoryStream(bytes));

        var file_path = System.IO.Path.Combine(Program.config_export_directory, id);

        System.IO.File.WriteAllBytes(file_path, bytes);
                 


        if(System.IO.File.Exists(file_path))
        {
            byte[] fileBytes = await ReadFile(file_path);

            System.IO.File.Delete(file_path);
            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, id);
        }
        else
        {
            return NotFound();
        }
    }

    async Task<byte[]> ReadFile(string s)
    {
        byte[] data;
        int br;
        int fs_length;

        using(FileStream fs = new FileStream (s, FileMode.Open, FileAccess.Read))
        {
            fs_length = (int) fs.Length;
            data = new byte[fs.Length];
            br = await fs.ReadAsync(data, 0, data.Length);
        }
        if (br != (int) fs_length)
            throw new System.IO.IOException(s);
        return data;
    }

}

