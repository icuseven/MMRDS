using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Dynamic;
using mmria.common.model;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server
{
	[Authorize(Roles  = "committee_member")]
	[Route("api/[controller]")]
    public class de_idController: ControllerBase 
	{ 


		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public async Task<System.Dynamic.ExpandoObject> Get(string case_id = null) 
		{ 
			try
			{
                string request_string = Program.config_couchdb_url + "/de_id/_all_docs?include_docs=true";

                if (!string.IsNullOrWhiteSpace (case_id)) 
                {
                    request_string = Program.config_couchdb_url + "/de_id/" + case_id;
                } 


				var request_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
				string responseFromServer = await request_curl.executeAsync();

                var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

                return result;



				/*
		< HTTP/1.1 200 OK
		< Set-Cookie: AuthSession=YW5uYTo0QUIzOTdFQjrC4ipN-D-53hw1sJepVzcVxnriEw;
		< Version=1; Path=/; HttpOnly
		> ...
		<
		{"ok":true}*/



			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return null;
		} 

	} 
}

