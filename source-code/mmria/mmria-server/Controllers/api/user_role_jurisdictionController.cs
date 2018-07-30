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
            [FromBody] mmria.common.model.couchdb.user_role_jurisdiction jurisdiction_tree
        ) 
		{ 
			string jurisdiction_json;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{


				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				jurisdiction_json = Newtonsoft.Json.JsonConvert.SerializeObject(jurisdiction_tree, settings);

				string jurisdiction_tree_url = Program.config_couchdb_url + "/jurisdiction";

				System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(jurisdiction_tree_url));
				request.Method = "PUT";
				request.ContentType = "text/*";
				request.ContentLength = jurisdiction_json.Length;
				request.PreAuthenticate = false;

				if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
				{
					string auth_session_value = this.Request.Cookies["AuthSession"];
					request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
					request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
					request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
				}


				using (System.IO.StreamWriter streamWriter = new System.IO.StreamWriter(request.GetRequestStream()))
				{
					try
					{
						streamWriter.Write(jurisdiction_json);
						streamWriter.Flush();
						streamWriter.Close();


						System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
						System.IO.Stream dataStream = response.GetResponseStream ();
						System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
						string responseFromServer = reader.ReadToEnd ();

						result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);

						if(response.Headers["Set-Cookie"] != null)
						{
							this.Response.Headers.Add("Set-Cookie", response.Headers["Set-Cookie"]);
						}


					//System.Threading.Tasks.Task.Run( new Action(()=> { var f = new GenerateSwaggerFile(); System.IO.File.WriteAllText(Program.config_file_root_folder + "/api-docs/api.json", f.generate(metadata)); }));
						
					}
					catch(Exception ex)
					{
						Log.Information ($"{ex}");
					}
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

