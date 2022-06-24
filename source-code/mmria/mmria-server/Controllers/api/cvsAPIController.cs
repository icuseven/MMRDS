using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

using System.Text.Json;
using System.Text.Json.Serialization;
using System.IO;

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


	public class tract
    {
        public tract(){}

		public string GEOID { get;set;}
		public int YEAR { get;set;}
		public string state { get;set;}
		public string stfips { get;set;}
		public string NAME { get;set;}
		public double pctNOIns_Fem { get;set;}
		public double pctNoVehicle { get;set;}
		public double pctMOVE { get;set;}
		public double pctSPHH { get;set;}
		public double pctOVERCROWDHH { get;set;}
		public double pctOWNER_OCC { get;set;}
		public double pct_less_well { get;set;}
		public double NDI_raw { get;set;}
		public double pctPOV { get;set;}
		public double ICE_INCOME_all { get;set;}
		public double MEDHHINC { get;set;}
	}
    public class county
    {
        public county(){}

		public string GEOID { get;set;}
		public int YEAR { get;set;}
		public string state { get;set;}
		public string NAME { get;set;}
		public double pctNOIns_Fem { get;set;}
		public double pctNoVehicle { get;set;}
		public double pctMOVE { get;set;}
		public double pctSPHH { get;set;}
		public double pctOVERCROWDHH { get;set;}
		public double pctOWNER_OCC { get;set;}
		public double pct_less_well { get;set;}
		public double NDI_raw { get;set;}
		public double pctPOV { get;set;}
		public double ICE_INCOME_all { get;set;}
		public double MEDHHINC { get;set;}
		public double MDrate { get;set;}
		public double pctOBESE { get;set;}
		public double FI { get;set;}
		public double CNMrate { get;set;}
		public double OBGYNrate { get;set;}
		public double rtTEENBIRTH { get;set;}
		public double rtSTD { get;set;}
		public double rtMHPRACT { get;set;}
		public double rtDRUGODMORTALITY { get;set;}
		public double rtOPIOIDPRESCRIPT { get;set;}
		public double SocCap { get;set;}
		public double rtSocASSOC { get;set;}
		public double pctHOUSE_DISTRESS { get;set;}
		public double rtVIOLENTCR_ICPSR { get;set;}
		public double isolation { get;set;}
	}

    public class tract_county_result
    {
        public tract_county_result()
        {

        }

        public tract tract { get;set;}

        public county county { get;set;}
    }

    mmria.common.couchdb.ConfigurationSet ConfigDB;
    private readonly IAuthorizationService _authorizationService;
    public cvsAPIController(mmria.common.couchdb.ConfigurationSet p_config_db, IAuthorizationService authorizationService)
    {

        ConfigDB = p_config_db;
        _authorizationService = authorizationService;
    }
    
    [Authorize(Roles  = "abstractor,data_analyst,committee_member")]
    [HttpPost]
    public async Task<IActionResult> Post
    (
        [FromBody] post_payload post_payload
    ) 
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
  

        IActionResult result = null;
        var response_string = string.Empty;
        System.Collections.Generic.IDictionary<string,object> responseDictionary = null;

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

                    response_string = await server_statu_curl.executeAsync();
                    System.Console.WriteLine(response_string);

    
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
                                
                                c_geoid = post_payload.c_geoid,
                                t_geoid = post_payload.t_geoid,
                                year = post_payload.year
                                /*
                                c_geoid = "13089",
                                t_geoid = "13089021204",
                                year = "2012"*/
                            }
                        };

                        body_text = JsonSerializer.Serialize(get_all_data_body);
                        var get_all_data_curl = new mmria.server.cURL("POST", null, base_url, body_text);

                        response_string = await get_all_data_curl.executeAsync();
                        System.Console.WriteLine(response_string);

                        var tc = JsonSerializer.Deserialize<tract_county_result>(response_string);

                        result =  Ok(tc);

        
                    }

                    break;

                case "dashboard":
                    var get_dashboard_body = new get_dashboard_post_body()
                    {
                        id = ConfigDB.name_value["cvs_api_id"],
                        secret = ConfigDB.name_value["cvs_api_key"],
                        payload = new()
                        {
                            lat = post_payload.lat,
                            lon = post_payload.lon, 
                            year= post_payload.year,
                            id = post_payload.id
                        }
                    };

                    body_text = JsonSerializer.Serialize(get_dashboard_body);
                    var get_dashboard_curl = new mmria.server.cURL("POST", null, base_url, body_text);

                    response_string = await get_dashboard_curl.executeAsync();
                    System.Console.WriteLine(response_string);

                    responseDictionary = JsonSerializer.Deserialize<System.Dynamic.ExpandoObject>(response_string) as IDictionary<string,object>;


/*
"body": "\"PDF creation has been initiated and should be ready shortly. Please retry API call\""
"body": "\"PDF is being created!\""
"body": "JVBERi0xLjQKJazcIKu6CjEgMCBvYmoKPDwgL1BhZ2VzIDIgMCBSIC9UeXBlIC9DYXRhbG9nID4YXRlRGVjb2RlIC9MZW5 [TRUNCATED]",
"isBase64Encoded": true
*/

                    if
                    (
                        responseDictionary != null &&
                        (bool) responseDictionary["isBase64Encoded"] == true
                    )
                    {
                        var bytes = Convert.FromBase64String(responseDictionary["body"].ToString());
                        var contents = new System.Net.Http.StreamContent(new MemoryStream(bytes));

                        result = Ok(contents);
                    }



                    break;
            }
        }
        catch(System.Net.WebException ex)
        {
            System.Console.WriteLine($"cvsAPIController  POST\n{ex}");
            
            return Problem(
                type: "/docs/errors/forbidden",
                title: "CVS API Error",
                detail: ex.Message,
                statusCode: (int) ex.Status,
                instance: HttpContext.Request.Path
            );
        }


        if(result == null)
        {
            //return JsonSerializer.Deserialize<System.Dynamic.ExpandoObject>(response_string);
            return Ok(JsonSerializer.Deserialize<System.Dynamic.ExpandoObject>(response_string));
        }
        else
        {
            //return null;
            return result;
        }

        return result;
    }



} 


