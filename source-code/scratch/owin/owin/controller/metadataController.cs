using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace owin
{
	public class metadataController: ApiController 
	{ 
		private static string couchdb_url = null;

		static metadataController()
		{
			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_container_based"])) 
			{
				couchdb_url = System.Environment.GetEnvironmentVariable ("couchdb_url");
			} 
			else
			{
				couchdb_url = System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"];
			}

		}


		public System.Dynamic.ExpandoObject  Get() 
		{ 
			System.Console.WriteLine ("Recieved message.");
			string result = null;

			//"2016-06-12T13:49:24.759Z"
			string request_string = this.get_couch_db_url() + "/metadata/2016-06-12T13:49:24.759Z";

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
			result = reader.ReadToEnd ();

			System.Dynamic.ExpandoObject json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(result, new  Newtonsoft.Json.Converters.ExpandoObjectConverter());



			//return result;
			return json_result;
		} 
		/*
		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public System.Dynamic.ExpandoObject Get(string value) 
		{ 
			//System.Console.WriteLine ("Recieved message.");
			string result = null;

			//"2016-06-12T13:49:24.759Z"
			string request_string = this.get_couch_db_url() + "/metadata/" + value;

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
			result = reader.ReadToEnd ();

			System.Dynamic.ExpandoObject json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(result, new  Newtonsoft.Json.Converters.ExpandoObjectConverter());

			return json_result;
		} */


		// POST api/values 
		//[Route("api/metadata")]
		[HttpPost]
		public owin.couchdb.document_put_response Post() 
		{ 
			//bool valid_login = false;
			owin.metadata.app metadata = null;

			owin.couchdb.document_put_response result = new owin.couchdb.document_put_response ();

			try
			{

				System.IO.Stream dataStream0 = this.Request.Content.ReadAsStreamAsync().Result;
				// Open the stream using a StreamReader for easy access.
				//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
				System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
				// Read the content.
				string temp = reader0.ReadToEnd ();

				metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<owin.metadata.app>(temp);
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
					string object_string = Newtonsoft.Json.JsonConvert.SerializeObject(metadata, settings);

					string metadata_url = this.get_couch_db_url() + "/metadata/"  + metadata._id;

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

							result = Newtonsoft.Json.JsonConvert.DeserializeObject<owin.couchdb.document_put_response>(responseFromServer);
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
			string result = null;

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_container_based"])) 
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

