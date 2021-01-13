using System;
using System.Collections.Generic;
using System.Linq;

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

				string user_db_url = "http://localhost:44331/api/Message/IJESet";

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

