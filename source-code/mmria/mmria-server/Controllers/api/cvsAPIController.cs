using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

using System.Text.Json;
using System.Text.Json.Serialization;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

using mmria.common.cvs;

namespace mmria.server;

[Authorize]
[Route("api/[controller]")]
public class cvsAPIController: ControllerBase 
{ 
    mmria.common.couchdb.ConfigurationSet ConfigDB;
    private readonly IAuthorizationService _authorizationService;
    public cvsAPIController(mmria.common.couchdb.ConfigurationSet p_config_db, IAuthorizationService authorizationService)
    {

        ConfigDB = p_config_db;
        _authorizationService = authorizationService;
    }
    
    [Authorize(Roles  = "abstractor,data_analyst,committee_member")]
    [HttpPost]
    public async Task<System.Dynamic.ExpandoObject> Post(post_payload post_payload) 
    { 
        var is_abstractor = false;
        var is_data_analyst = false;
        var is_committee_member = false;

        foreach(var role in User.Identities.First(u => u.IsAuthenticated &&  u.HasClaim(c => c.Type == ClaimTypes.Name)).Claims.Where(c=> c.Type == ClaimTypes.Role))
        {
            switch(role.Value)
            {
                case "abstractor":
                    is_abstractor = true;
                break;
                case "data_analyst":
                    is_data_analyst = true;
                break;
                case "committee_member":
                    is_committee_member = true;
                break;
            }
        }
  

        var result = string.Empty;

        var base_url = ConfigDB.name_value["cvs_api_url"];

        try
        {
            switch(post_payload.action)
            {
                case "server":
                    var sever_status_body = new server_status_post_body()
                    {
                        id = ConfigDB.name_value["cvs_api_id"],
                        secret = ConfigDB.name_value["cvs_api_key"],

                    };

                    var body_text = JsonSerializer.Serialize(sever_status_body);
                    var server_statu_curl = new mmria.server.cURL("POST", null, base_url, body_text);

                    result = await server_statu_curl.executeAsync();
                    System.Console.WriteLine(result);
                break;
                case "data":
                    if(is_abstractor)
                    {
                        var get_all_data_body = new get_all_data_post_body()
                        {
                            id = ConfigDB.name_value["cvs_api_id"],
                            secret = ConfigDB.name_value["cvs_api_key"],
                            payload = new()
                            {
                                c_geoid = "13089",
                                t_geoid = "13089021204",
                                year = "2012"
                            }
                        };

                        body_text = JsonSerializer.Serialize(get_all_data_body);
                        var get_all_data_curl = new mmria.server.cURL("POST", null, base_url, body_text);

                        result = await get_all_data_curl.executeAsync();
                        System.Console.WriteLine(result);
                    }

                    break;

                case "dashboard":
                    var get_dashboard_body = new get_dashboard_post_body()
                    {
                        id = ConfigDB.name_value["cvs_api_id"],
                        secret = ConfigDB.name_value["cvs_api_key"],
                        payload = new()
                        {
                            lat = "33.880577",
                            lon = "-84.29106", 
                            year= "2012",
                            id = "GA-2012-1234"
                        }
                    };

                    body_text = JsonSerializer.Serialize(get_dashboard_body);
                    var get_dashboard_curl = new mmria.server.cURL("POST", null, base_url, body_text);

                    result = await get_dashboard_curl.executeAsync();
                    System.Console.WriteLine(result);

                    break;
            }
        }
        catch(Exception ex)
        {
            System.Console.WriteLine($"cvsAPIController  POST\n{ex}");
        }


        return JsonSerializer.Deserialize<System.Dynamic.ExpandoObject>(result);
    }



} 


