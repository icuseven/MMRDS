using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace owin
{
	public class current_editController: ApiController 
	{ 
		public static System.Collections.Generic.Dictionary<string, Current_Edit> current_edit_list = null;

		private static string couchdb_url = null;
		//http://blog.scottlogic.com/2010/09/20/js-lint-in-visual-studio-part-1.html
		//https://javascriptdotnet.codeplex.com/

		static current_editController()
		{
			current_edit_list = new System.Collections.Generic.Dictionary<string, Current_Edit>(System.StringComparer.OrdinalIgnoreCase);

			Current_Edit current = new Current_Edit();
			current.id = "";
			current.edit_type = "json";

			current_edit_list.Add ("metadata", current);

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_container_based"])) 
			{
				couchdb_url = System.Environment.GetEnvironmentVariable ("couchdb_url");
			} 
			else
			{
				couchdb_url = System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"];
			}

		}

		// GET api/values 
		public IEnumerable<Current_Edit>  Get() 
		{ 
			return current_edit_list.Select(kvp => kvp.Value).AsEnumerable(); 
		} 

		// GET api/values/5 
		public string Get(int id) 
		{ 
			return "value"; 
		} 

		// POST api/values 
		public void Post() 
		{ 
			bool valid_login = false;
			owin.metadata.app metadata = null;

			try
			{

				System.IO.Stream dataStream0 = this.Request.Content.ReadAsStreamAsync().Result;
				// Open the stream using a StreamReader for easy access.
				//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
				System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
				// Read the content.
				string temp = reader0.ReadToEnd ();

				metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<owin.metadata.app>(temp);

				//string metadata = DecodeUrlString(temp);
			}
			catch(Exception ex)
			{

			}


			try
			{
				string request_string = couchdb_url + "/_session";
				System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(request_string));

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
				session_response json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<session_response>(responseFromServer);

				valid_login = json_result.userCTX.name != null;
			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);
			} 

			if (valid_login) 
			{

				string object_string = Newtonsoft.Json.JsonConvert.SerializeObject(metadata);
				string hash = GetHash (object_string);
				if (current_edit_list ["metadata"].id != hash) {
					Current_Edit current = new Current_Edit ();
					current.id = hash;
					current.metadata = object_string;
					current.edit_type = "json";

					current_edit_list ["metadata"] = current;
				}
			}
		} 

		public  string GetHash(string metadata)
		{
			string result;
			byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(metadata);
			System.IO.MemoryStream stream = new System.IO.MemoryStream(byteArray);

			System.Text.StringBuilder sb = new System.Text.StringBuilder();
			System.Security.Cryptography.MD5 md5Hasher = System.Security.Cryptography.MD5.Create();

			foreach (byte b in md5Hasher.ComputeHash(stream))
					sb.Append(b.ToString("X2").ToLowerInvariant());

			result = sb.ToString();

			return result;
		}

		private static string DecodeUrlString(string url) {
			string newUrl;
			while ((newUrl = System.Uri.UnescapeDataString(url)) != url)
				url = newUrl;
			return newUrl;
		}
	} 
}

