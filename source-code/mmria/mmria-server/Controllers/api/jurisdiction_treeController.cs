using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Serilog;
using Serilog.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace mmria.server
{
	[Route("api/[controller]")]
    public class jurisdiction_treeController: ControllerBase 
	{ 
		public jurisdiction_treeController()
		{
		}

		[HttpGet]
		public async System.Threading.Tasks.Task<mmria.common.model.couchdb.jurisdiction_tree> Get()
		{
			Log.Information  ("Recieved message.");
			mmria.common.model.couchdb.jurisdiction_tree result = null;

			try
			{
                string jurisdiction_tree_url = Program.config_couchdb_url + $"/jurisdiction/jurisdiction_tree";

				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(jurisdiction_tree_url));
				request.Method = "GET";
				request.PreAuthenticate = false;
                if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                {
                    string auth_session_value = this.Request.Cookies["AuthSession"];
                    request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
                    request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
                }

				System.Net.WebResponse response = (System.Net.HttpWebResponse) await request.GetResponseAsync();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				//result = await reader.ReadToEndAsync ();


				string response_from_server = await reader.ReadToEndAsync ();
				result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.jurisdiction_tree>(response_from_server);

			}
			catch(Exception ex) 
			{
				Log.Information ($"{ex}");
			}

			return result;
		}


		// POST api/values 
		[Authorize(Roles  = "jurisdiction_admin,installation_admin")]
		[HttpPost]
		public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post
        (
            [FromBody] mmria.common.model.couchdb.jurisdiction_tree jurisdiction_tree
        ) 
		{ 
			string jurisdiction_json;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{


				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				jurisdiction_json = Newtonsoft.Json.JsonConvert.SerializeObject(jurisdiction_tree, settings);

				/*
				System.IO.Stream dataStream0 = this.Request.Body;
				// Open the stream using a StreamReader for easy access.
				//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
				System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
				// Read the content.
				jurisdiction_json = await reader0.ReadToEndAsync ();
				

				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				jurisdiction_json = Newtonsoft.Json.JsonConvert.SerializeObject(jurisdiction_request, settings);

				var byName = (IDictionary<string,object>)jurisdiction_request;
				var temp_id = byName["_id"]; 
				string id_val = null;

				if(temp_id is DateTime)
				{
					id_val = string.Concat(((DateTime)temp_id).ToString("s"), "Z");
				}
				else
				{
					id_val = temp_id.ToString();
				}
				*/

				string jurisdiction_tree_url = Program.config_couchdb_url + "/jurisdiction/jurisdiction_tree";

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

