using System;
using System.Collections.Generic;
using System.Linq;

using Microsoft.AspNetCore.Mvc;

using mmria.common.model;

namespace mmria.server
{
	[Route("api/[controller]")]
	public class userController: ControllerBase 
	{ 
		// GET api/values 
		//public IEnumerable<mmria.common.model.couchdb.user_alldocs_response> Get() 
		[HttpGet]
        public async System.Threading.Tasks.Task<System.Dynamic.ExpandoObject> Get() 
		{ 
			try
			{
				string request_string = this.get_couch_db_url() + "/_users/_all_docs?include_docs=true&skip=1";

				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
				request.PreAuthenticate = false;
				//request.Method = "GET";

				if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                {
                    string auth_session_value = this.Request.Cookies["AuthSession"];
                    request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
                    request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
                }

				System.Net.WebResponse response = await request.GetResponseAsync();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				string responseFromServer = reader.ReadToEnd ();
				/*mmria.common.model.couchdb.user_alldocs_response json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user_alldocs_response>(responseFromServer);
				mmria.common.model.couchdb.user_alldocs_response[] result =  new mmria.common.model.couchdb.user_alldocs_response[] 
				{ 
					json_result
				}; 
				
				return result;
				*/

				System.Dynamic.ExpandoObject json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(responseFromServer);
			
				return json_result;


			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return null;
			//return new mmria.common.model.couchdb.user[] { default(mmria.common.model.couchdb.user), default(mmria.common.model.couchdb.user) }; 
		} 

		// GET api/values/5 
        public async System.Threading.Tasks.Task<mmria.common.model.couchdb.user> Get(string id) 
		{ 
			mmria.common.model.couchdb.user result = null;
			try
			{
				string request_string = this.get_couch_db_url() + "/_users/" + id;
				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

				request.PreAuthenticate = false;


				if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
				{
					string auth_session_value = this.Request.Cookies["AuthSession"];
					request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
					request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
				}

				System.Net.WebResponse response = await request.GetResponseAsync();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				string responseFromServer = reader.ReadToEnd ();
				result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user>(responseFromServer);
			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return result; 
		} 

		[HttpPost]
        public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post([FromBody] mmria.common.model.couchdb.user user) 
		{ 
			//bool valid_login = false;

			string object_string = null;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{
				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				object_string = Newtonsoft.Json.JsonConvert.SerializeObject(user, settings);

				string user_db_url = this.get_couch_db_url() + "/_users/"  + user._id;

				System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(user_db_url));
				request.Method = "PUT";
				request.ContentType = "application/json";
				request.ContentLength = object_string.Length;
				request.PreAuthenticate = false;

				if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                {
                    string auth_session_value = this.Request.Cookies["AuthSession"];
                    request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
                    request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
                }

				using (System.IO.StreamWriter streamWriter = new System.IO.StreamWriter(request.GetRequestStream()))
				{
					try
					{
						streamWriter.Write(object_string);
						streamWriter.Flush();
						streamWriter.Close();


						System.Net.WebResponse response = await request.GetResponseAsync();
						System.IO.Stream dataStream = response.GetResponseStream ();
						System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
						string responseFromServer = reader.ReadToEnd ();

						result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
					
					}
					catch(Exception ex)
					{
						Console.WriteLine (ex);
					}
				}

				if (!result.ok) 
				{

				}

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}

			return result;
		} 


		private string get_couch_db_url()
		{
            string result = Program.config_couchdb_url;

			return result;
		}

	} 
}

