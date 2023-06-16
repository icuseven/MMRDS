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

[Authorize(Roles  = "cdc_admin")]
[Route("broadcast-message/{action=Index}")]
public sealed class broadcast_messageController : Controller
{
    private readonly IAuthorizationService _authorizationService;

    public broadcast_messageController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
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


    [HttpPost]
    public async Task<JsonResult> SetBroadcastMessageList
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

        return Json(result);
    }
    
}