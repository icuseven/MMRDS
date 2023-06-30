using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.IO;
using Akka.Actor;

namespace mmria.server.Controllers;


[Route("broadcast-message/{action=Index}")]
public sealed class broadcast_messageController : Controller
{

    private readonly IConfiguration _configuration;
    mmria.common.couchdb.ConfigurationSet ConfigDB;
    private readonly IAuthorizationService _authorizationService;

    public broadcast_messageController
    (
        IAuthorizationService authorizationService,
        IConfiguration configuration,
        mmria.common.couchdb.ConfigurationSet p_config_db
    )
    {
        _authorizationService = authorizationService;
        _configuration = configuration;
        ConfigDB = p_config_db;
    }
    public IActionResult Index()
    {
        return View();
    }



    [HttpGet]
    public async Task<JsonResult> GetBroadcastMessageList()
    {
        var result = new mmria.common.metadata.BroadcastMessageList();


        string url = $"{Program.config_couchdb_url}/metadata/broadcast-message-list";
        
        cURL curl = new cURL("GET", null, url, null, null, null);
        try
        {
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.BroadcastMessageList>(await curl.executeAsync());
        }
        catch(System.Net.WebException ex)
        {
            if(ex.Message.IndexOf("404") > -1)
            {
                // do nothing
                result.created_by = "system";
                result.date_created = DateTime.UtcNow;

                result.last_updated_by = "system";
                result.date_last_updated = DateTime.UtcNow;
            }
            else
            {
             Console.WriteLine(ex);
            }
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex);
        }

        return Json(result);
    }

    [Authorize(Roles  = "cdc_admin")]
    [HttpPost]
    public async Task<JsonResult> SaveBroadcastMessageDraft
    (
        [FromBody] mmria.common.metadata.BroadcastMessageList request
    )
    {
        var result = new mmria.common.model.couchdb.document_put_response();

        var userName = "";
        if (User.Identities.Any(u => u.IsAuthenticated))
        {
            userName = User.Identities.First(
                u => u.IsAuthenticated && 
                u.HasClaim(c => c.Type == System.Security.Claims.ClaimTypes.Name)).FindFirst(System.Security.Claims.ClaimTypes.Name).Value;
        }

        request.last_updated_by = userName;
        request.date_last_updated = DateTime.UtcNow;

        result = await save_request(request);

        return Json(result);
    }

    [Authorize(Roles  = "cdc_admin")]
    [HttpPost]
    public async Task<JsonResult> UnpublishBroadcastMessage
    (
        [FromBody] mmria.common.metadata.BroadcastMessageList request
    )
    {
        var result = new mmria.common.model.couchdb.document_put_response();

        var userName = "";
        if (User.Identities.Any(u => u.IsAuthenticated))
        {
            userName = User.Identities.First(
                u => u.IsAuthenticated && 
                u.HasClaim(c => c.Type == System.Security.Claims.ClaimTypes.Name)).FindFirst(System.Security.Claims.ClaimTypes.Name).Value;
        }

        request.last_updated_by = userName;
        request.date_last_updated = DateTime.UtcNow;

        result = await save_request(request, true);

        return Json(result);
    }

    [Authorize(Roles  = "cdc_admin")]
    [HttpPost]
    public async Task<JsonResult> PublishBroadcastMessage
    (
        [FromBody] mmria.common.metadata.BroadcastMessageList request
    )
    {
        var result = new mmria.common.model.couchdb.document_put_response();

        var userName = "";
        if (User.Identities.Any(u => u.IsAuthenticated))
        {
            userName = User.Identities.First(
                u => u.IsAuthenticated && 
                u.HasClaim(c => c.Type == System.Security.Claims.ClaimTypes.Name)).FindFirst(System.Security.Claims.ClaimTypes.Name).Value;
        }

        request.last_updated_by = userName;
        request.date_last_updated = DateTime.UtcNow;

        result = await save_request(request, true);



        return Json(result);
    }

    async Task<mmria.common.model.couchdb.document_put_response> save_request(mmria.common.metadata.BroadcastMessageList request, bool send_replication = false)
    {
        var result = new mmria.common.model.couchdb.document_put_response();

        string url = $"{Program.config_couchdb_url}/metadata/broadcast-message-list";
        
        Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
        settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
        var object_string = Newtonsoft.Json.JsonConvert.SerializeObject(request, settings);


        cURL curl = new cURL("PUT", null, url, object_string, null, null);
       

        try
        {
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(await curl.executeAsync());
        }
        catch(Exception ex)
        {

            Console.WriteLine(ex);
        }

        if(send_replication)         
        await replicate(object_string);

        return result;
    }

    async Task replicate(string object_json)
    {
        var config_url = _configuration["mmria_settings:vitals_url"].Replace("/api/Message/IJESet","");

        var base_url = $"{config_url}/api/broadcastMessage/ReplicateMessage";


        var curl = new mmria.server.cURL("PUT", null, base_url, object_json);
        curl.AddHeader("vital-service-key", ConfigDB.name_value["vital_service_key"]);

        try
        {
            var responseContent = await curl.executeAsync();

            List<string> file_list = System.Text.Json.JsonSerializer.Deserialize<List<string>>(responseContent);
        }
        catch(Exception ex)
        {
            System.Console.WriteLine(ex);
        }
    }
    
}