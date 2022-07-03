
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
    public IActionResult Index()
    {
        return View();
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

}

