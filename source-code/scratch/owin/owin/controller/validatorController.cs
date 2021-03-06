using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Dynamic;
using mmria.common.model;

namespace mmria.server
{
	public class validatorController: ApiController 
	{ 
		// GET api/values 
		//public IEnumerable<master_record> Get() 

		public System.Dynamic.ExpandoObject Get()
		{
			try
			{
				string request_string = Program.config_couchdb_url + "/mmrds/_all_docs?include_docs=true";
				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

				request.PreAuthenticate = false;


				if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
				{
					string[] cookie_set = this.Request.Headers.GetValues("Cookie").First().Split(';');
					for(int i = 0; i < cookie_set.Length; i++)
					{
						string[] auth_session_token = cookie_set[i].Split('=');
						if(auth_session_token[0].Trim() == "AuthSession")
						{
							request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
							request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
							break;
						}
					}
				}

				System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				string responseFromServer = reader.ReadToEnd ();

				var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(responseFromServer);

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

		private void PutDocument(string postUrl, string document)
		{
			byte[] data = new System.Text.ASCIIEncoding().GetBytes(document);

			System.Net.WebRequest request = System.Net.WebRequest.Create("request_string");
			request.UseDefaultCredentials = true;
			request.Credentials = new System.Net.NetworkCredential("_username", "_password");
			request.Method = "PUT";
			request.ContentType = "text/json";
			request.ContentLength = data.Length;

			using (System.IO.StreamWriter streamWriter = new System.IO.StreamWriter(request.GetRequestStream()))
			{
				try
				{
					streamWriter.Write(document);
					streamWriter.Flush();
					streamWriter.Close();

					System.Net.HttpWebResponse httpResponse = (System.Net.HttpWebResponse)request.GetResponse();
					using (System.IO.StreamReader streamReader = new System.IO.StreamReader(httpResponse.GetResponseStream()))
					{
						string result = streamReader.ReadToEnd();
						streamReader.Close();
					}
				}
				catch (System.Exception e)
				{
					//_logger.Error("Exception thrown when contacting service.", e);
					//_logger.ErrorFormat("Error posting document to {0}", postUrl);
				}
			}
		}


		[Route]
		public bool Post()
		{
			return this.Post(null);
		}


		// POST api/values 
		[Route]
		public bool Post(string p_uid) 
		{ 
			//bool valid_login = false;
			//mmria.common.data.api.Set_Queue_Request queue_request = null;
			string object_string = null;
			bool result = false;

			try
			{

				System.IO.Stream dataStream0 = this.Request.Content.ReadAsStreamAsync().Result;
				// Open the stream using a StreamReader for easy access.
				//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
				System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
				// Read the content.
				string temp = reader0.ReadToEnd ();

				string file_root_folder = null;
				if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"])) 
				{
					file_root_folder = System.Environment.GetEnvironmentVariable ("file_root_folder");
				} 
				else
				{
					file_root_folder = System.Configuration.ConfigurationManager.AppSettings ["file_root_folder"];
				}

				System.IO.File.WriteAllText(file_root_folder + "/scripts/validator.js", temp);

				result = true;

			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);
			}

			return result;
		} 
	} 
}

