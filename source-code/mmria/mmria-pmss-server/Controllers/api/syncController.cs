using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

using  mmria.pmss.server.extension; 

namespace mmria.pmss.server;

[Authorize(Roles  = "installation_admin")]
[Route("api/[controller]")]
public sealed class syncController: ControllerBase 
{ 
    mmria.common.couchdb.OverridableConfiguration configuration;
    common.couchdb.DBConfigurationDetail db_config;
    string host_prefix = null;
    public syncController
    (
        IHttpContextAccessor httpContextAccessor, 
        mmria.common.couchdb.OverridableConfiguration _configuration
    )
    {
        configuration = _configuration;
        host_prefix = httpContextAccessor.HttpContext.Request.Host.GetPrefix();
        db_config = configuration.GetDBConfig(host_prefix);
    }

    [HttpGet]
    public string Get()
    {
        string result = null;

        System.Threading.Tasks.Task.Run
        (
            new Action (() =>
            {

                try 
                {
                    
                    mmria.pmss.server.utils.c_document_sync_all sync_all = new mmria.pmss.server.utils.c_document_sync_all 
                    (
                        db_config.url,
                        db_config.user_name,
                        db_config.user_value,
                        configuration.GetString("metadata_version", host_prefix),
                        db_config
                    );

                    sync_all.executeAsync (); 
                }
                catch (Exception ex) 
                {
                    System.Console.WriteLine ($"syncController. error sync_all.execute\n{ex}");
                }
            })
        );
        

        return result;

    } 

} 


