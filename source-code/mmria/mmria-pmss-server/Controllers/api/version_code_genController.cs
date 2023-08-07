using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using mmria.common.model;
using System.Net.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

using  mmria.pmss.server.extension;
namespace mmria.pmss.server;

[Route("api/[controller]")]
public sealed class version_code_genController: ControllerBase
{ 
    mmria.common.couchdb.OverridableConfiguration configuration;
    common.couchdb.DBConfigurationDetail db_config;
    string host_prefix = null;

    public version_code_genController
	(
        IHttpContextAccessor httpContextAccessor, 
        mmria.common.couchdb.OverridableConfiguration _configuration
    )
    {
        configuration = _configuration;
        host_prefix = httpContextAccessor.HttpContext.Request.Host.GetPrefix();
        db_config = configuration.GetDBConfig(host_prefix);
    }

    [AllowAnonymous] 
    [HttpGet]
    public async Task<string> Get()
    {
        string result = null;

        try
        {

            string request_string = db_config.url + $"/metadata/2016-06-12T13:49:24.759Z/validator.js";

            System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
            request.Method = "GET";
            request.PreAuthenticate = false;

            System.Net.WebResponse response = (System.Net.HttpWebResponse) await request.GetResponseAsync();
            System.IO.Stream dataStream = response.GetResponseStream();
            System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
            result = await reader.ReadToEndAsync ();

        }
        catch(Exception ex) 
        {
            Console.WriteLine (ex);
        }

        return result;
    } 

} 


