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

namespace mmria.server
{



	
	[Route("api/[controller]")]
	public class ije_messageController: ControllerBase 
	{ 
        IConfiguration configuration;
        mmria.common.couchdb.ConfigurationSet ConfigDB;
        public ije_messageController(IConfiguration p_configuration, mmria.common.couchdb.ConfigurationSet p_config_db)
        {
            configuration = p_configuration;
            ConfigDB = p_config_db;
        }
		
        [Authorize(Roles  = "cdc_analyst")]
		[HttpGet]
		public async Task<mmria.common.model.couchdb.alldocs_response<mmria.common.ije.Batch>> Get(string case_id) 
		{ 
            mmria.common.model.couchdb.alldocs_response<mmria.common.ije.Batch> result = null;

            try
			{
                //var localUrl = "https://localhost:44331/api/Message/IJESet";
                //var message_curl = new mmria.server.cURL("POST", null, localUrl, message);
                //var messge_curl_result = await message_curl.executeAsync();

				//string user_db_url = configuration["mmria_settings:vitals_url"].Replace("Message/IJESet", "VitalNotification");
                var config = ConfigDB.detail_list["vital_import"];
                
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

        [Authorize(Roles  = "cdc_analyst")]
		[HttpDelete]
		public async Task<bool> Delete() 
		{ 
            bool result = false;
            try
			{
                //var localUrl = "https://localhost:44331/api/Message/IJESet";
                //var message_curl = new mmria.server.cURL("POST", null, localUrl, message);
                //var messge_curl_result = await message_curl.executeAsync();

				string user_db_url = configuration["mmria_settings:vitals_url"].Replace("Message/IJESet", "VitalNotification");

				var user_curl = new cURL("DELETE", null, user_db_url, null);
				var responseFromServer = await user_curl.executeAsync();
				result = Newtonsoft.Json.JsonConvert.DeserializeObject<bool>(responseFromServer);

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}

			return result;
		}

		[Authorize(Roles  = "cdc_analyst")]
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

				string user_db_url = configuration["mmria_settings:vitals_url"];

				var user_curl = new cURL("PUT", null, user_db_url, object_string);
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
}

