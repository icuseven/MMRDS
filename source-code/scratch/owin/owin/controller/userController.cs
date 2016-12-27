using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using mmria.common.model;

namespace mmria.server
{
	public class userController: ApiController 
	{ 
		// GET api/values 
		//public IEnumerable<mmria.common.model.couchdb.user_alldocs_response> Get() 
		public System.Dynamic.ExpandoObject Get() 
		{ 
			try
			{
				string request_string = this.get_couch_db_url() + "/_users/_all_docs?include_docs=true&skip=1";

				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
				request.PreAuthenticate = false;

				if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
				{
					string[] auth_session_token = this.Request.Headers.GetValues("Cookie").First().Split('=');
					request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
					//request.Headers.Add(this.Request.Headers.GetValues("Cookie").First(), "");
					request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
				}

				System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
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
		public mmria.common.model.couchdb.user Get(string id) 
		{ 
			mmria.common.model.couchdb.user result = null;
			try
			{
				string request_string = this.get_couch_db_url() + "/_users/" + id;
				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

				request.PreAuthenticate = false;


				if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
				{
					string[] auth_session_token = this.Request.Headers.GetValues("Cookie").First().Split('=');
					request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
					//request.Headers.Add(this.Request.Headers.GetValues("Cookie").First(), "");
					request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
				}

				System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
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
		public mmria.common.model.couchdb.document_put_response Post() 
		{ 
			//bool valid_login = false;
			mmria.common.model.couchdb.user user = null;
			string object_string = null;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{

				System.IO.Stream dataStream0 = this.Request.Content.ReadAsStreamAsync().Result;
				// Open the stream using a StreamReader for easy access.
				//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
				System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
				// Read the content.
				string temp = reader0.ReadToEnd ();

				user = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user>(temp);
				//System.Dynamic.ExpandoObject json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(result, new  Newtonsoft.Json.Converters.ExpandoObjectConverter());



				//string metadata = DecodeUrlString(temp);
			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);
			}
			try
			{
				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				object_string = Newtonsoft.Json.JsonConvert.SerializeObject(user, settings);

				string metadata_url = this.get_couch_db_url() + "/_users/"  + user._id;

				System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(metadata_url));
				request.Method = "PUT";
				request.ContentType = "application/json";
				request.ContentLength = object_string.Length;
				request.PreAuthenticate = false;

				if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
				{
					string[] auth_session_token = this.Request.Headers.GetValues("Cookie").First().Split('=');
					request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
					//request.Headers.Add(this.Request.Headers.GetValues("Cookie").First(), "");
					request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
				}

				using (System.IO.StreamWriter streamWriter = new System.IO.StreamWriter(request.GetRequestStream()))
				{
					try
					{
						streamWriter.Write(object_string);
						streamWriter.Flush();
						streamWriter.Close();


						System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
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

		// PUT api/values/5 
		public void Put(string id, [FromBody]mmria.common.model.couchdb.user value) 
		{ 
		} 

		// DELETE api/values/5 
		public void Delete(string id) 
		{ 
		} 

		private string get_couch_db_url()
		{
			string result = null;

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"])) 
			{
				result = System.Environment.GetEnvironmentVariable ("couchdb_url");
			} 
			else
			{
				result = System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"];
			}

			return result;
		}

	} 
}

