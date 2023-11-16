using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

using mmria.common.model;
using Microsoft.AspNetCore.Http;

using  mmria.server.extension;  
namespace mmria.server;

[Authorize]
[Route("api/[controller]")]
public sealed class ije_messageController: ControllerBase 
{ 
    mmria.common.couchdb.OverridableConfiguration configuration;
    mmria.common.couchdb.DBConfigurationDetail db_config;

    mmria.common.couchdb.ConfigurationSet config_id_configuration;
    string host_prefix = null;

    public ije_messageController
    (
        IHttpContextAccessor httpContextAccessor, 
        mmria.common.couchdb.OverridableConfiguration _configuration,
        mmria.common.couchdb.ConfigurationSet _config_id_configuration
    )
    {
        configuration = _configuration;
        host_prefix = httpContextAccessor.HttpContext.Request.Host.GetPrefix();
        db_config = configuration.GetDBConfig(host_prefix);

        config_id_configuration =  _config_id_configuration;
    }
    
    [Authorize(Roles  = "abstractor,jurisdiction_admin,data_analyst,vital_importer,vital_importer_state")]
    [HttpGet]
    public async Task<mmria.common.model.couchdb.alldocs_response<mmria.common.ije.Batch>> Get(string case_id) 
    { 
        mmria.common.model.couchdb.alldocs_response<mmria.common.ije.Batch> result = null;

        try
        {
            //mmria.common.couchdb.DBConfigurationDetail config = configuration.GetDBConfig("vital_import");

            mmria.common.couchdb.DBConfigurationDetail config =  config_id_configuration.detail_list["vital_import"];
            
            string url = $"{config.url}/vital_import/_all_docs?include_docs=true";


            var user_curl = new cURL("GET", null, url, null, config.user_name, config.user_value);

            var responseFromServer = await user_curl.executeAsync();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.alldocs_response<mmria.common.ije.Batch>>(responseFromServer);

        }
        catch(Exception ex) 
        {
            Console.WriteLine (ex);
        }


        return result;
    }

    [Authorize(Roles  = "vital_importer")]
    [HttpDelete]
    public async Task<bool> Delete() 
    { 
        bool result = false;
        try
        {

            string user_db_url = configuration.GetString("vitals_url",host_prefix).Replace("Message/IJESet", "VitalNotification");

            var user_curl = new cURL("DELETE", null, user_db_url, null);
            user_curl.AddHeader("vital-service-key", configuration.GetString("vital_service_key",host_prefix));
            var responseFromServer = await user_curl.executeAsync();

        }
        catch(Exception ex) 
        {
            Console.WriteLine (ex);
        }

        return result;
    }

    [Authorize(Roles  = "vital_importer")]
    [HttpPost]
    public async System.Threading.Tasks.Task<mmria.server.model.NewIJESet_MessageResponse> Post([FromBody] mmria.server.model.NewIJESet_Message ijeset) 
    { 
        string object_string = null;
        mmria.server.model.NewIJESet_MessageResponse result = new ();

        try
        {
            Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
            settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            object_string = Newtonsoft.Json.JsonConvert.SerializeObject(ijeset, settings);

                //var localUrl = "https://localhost:44331/api/Message/IJESet";
                //var message_curl = new mmria.server.cURL("POST", null, localUrl, message);
                //var messge_curl_result = await message_curl.executeAsync();

            string user_db_url = configuration.GetString("vitals_url",host_prefix);

            var user_curl = new cURL("PUT", null, user_db_url, object_string);
            user_curl.AddHeader("vital-service-key", configuration.GetString("vital_service_key",host_prefix));
            var responseFromServer = await user_curl.executeAsync();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.NewIJESet_MessageResponse>(responseFromServer);

            if (!result.ok) 
            {

            }

        }
        catch(Exception ex) 
        {
            Console.WriteLine (ex);
            result.detail = ex.Message;
            
        }

        return result;
    } 

} 


