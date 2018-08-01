using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Serilog;
using Serilog.Configuration;

namespace mmria.server
{
	[Route("api/[controller]")]
    public class user_role_jurisdictionController: ControllerBase 
	{ 
		public user_role_jurisdictionController()
		{
		}

		[HttpGet]
		public async System.Threading.Tasks.Task<IList<mmria.common.model.couchdb.user_role_jurisdiction>> Get(string p_urj_id)
		{
			Log.Information  ("Recieved message.");
			var result = new List<mmria.common.model.couchdb.user_role_jurisdiction>();

			try
			{
				string jurisdiction_url = Program.config_couchdb_url + $"/jurisdiction/" + p_urj_id;
				if(string.IsNullOrWhiteSpace(p_urj_id))
				{
					jurisdiction_url = Program.config_couchdb_url + $"/jurisdiction/_all_docs?include_docs=true";

					var case_curl = new cURL("GET", null, jurisdiction_url, null, Program.config_timer_user_name, Program.config_timer_password);
					string responseFromServer = await case_curl.executeAsync();

					//var user_role_list = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user_role_jurisdiction[]> (responseFromServer);

					//var user_role_list_expando_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

					var user_role_list = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user_role_jurisdiction>> (responseFromServer);



					foreach(var row in user_role_list.rows)
					{
						var user_role_jurisdiction = row.doc;

						if
						(
							user_role_jurisdiction.data_type != null &&
							user_role_jurisdiction.data_type == mmria.common.model.couchdb.user_role_jurisdiction.user_role_jursidiction_const &&
							mmria.server.util.case_authorization.is_authorized_to_handle_jurisdiction_id(User, user_role_jurisdiction))
						{
							result.Add(user_role_jurisdiction);
						}						
					}
					 
				}
				else
				{
					jurisdiction_url = Program.config_couchdb_url + $"/jurisdiction/" + p_urj_id;	
					var case_curl = new cURL("GET", null, jurisdiction_url, null, Program.config_timer_user_name, Program.config_timer_password);
					string responseFromServer = await case_curl.executeAsync();

					var user_role_jurisdiction = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user_role_jurisdiction> (responseFromServer);


					if
					(
						user_role_jurisdiction.data_type != null &&
						user_role_jurisdiction.data_type == mmria.common.model.couchdb.user_role_jurisdiction.user_role_jursidiction_const &&
						mmria.server.util.case_authorization.is_authorized_to_handle_jurisdiction_id(User, user_role_jurisdiction)
					)
					{
						result.Add(user_role_jurisdiction);
					}
					

				}
                

			}
			catch(Exception ex) 
			{
				Log.Information ($"{ex}");
			}

			return result;
		}


		// POST api/values 
		//[Route("api/metadata")]
		[HttpPost]
		public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post
        (
            [FromBody] mmria.common.model.couchdb.user_role_jurisdiction user_role_jurisdiction
        ) 
		{ 
			string user_role_jurisdiction_json;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{


				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				user_role_jurisdiction_json = Newtonsoft.Json.JsonConvert.SerializeObject(user_role_jurisdiction, settings);

				string jurisdiction_tree_url = Program.config_couchdb_url + "/jurisdiction/" + user_role_jurisdiction._id;


				cURL document_curl = new cURL ("PUT", null, jurisdiction_tree_url, user_role_jurisdiction_json, Program.config_timer_user_name, Program.config_timer_password);

/*
                if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                {
                    string auth_session_value = this.Request.Cookies["AuthSession"];
                    document_curl.AddHeader("Cookie", "AuthSession=" + auth_session_value);
                    document_curl.AddHeader("X-CouchDB-WWW-Authenticate", auth_session_value);
                }
 */
                try
                {
                    string responseFromServer = await document_curl.executeAsync();
                    result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
                }
                catch(Exception ex)
                {
                    Log.Information ($"jurisdiction_treeController:{ex}");
                }


				if (!result.ok) 
				{

				}

			}
			catch(Exception ex) 
			{
				Log.Information ($"{ex}");
			}
				
			return result;
		} 

	} 
}

