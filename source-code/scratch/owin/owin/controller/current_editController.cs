using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace mmria.server
{
	public class current_editController: ApiController 
	{ 
		public static System.Collections.Generic.Dictionary<string, Current_Edit> current_edit_list = null;

		//http://blog.scottlogic.com/2010/09/20/js-lint-in-visual-studio-part-1.html
		//https://javascriptdotnet.codeplex.com/

		static current_editController()
		{
			current_edit_list = new System.Collections.Generic.Dictionary<string, Current_Edit>(System.StringComparer.OrdinalIgnoreCase);

			Current_Edit current = new Current_Edit();
			current.id = "";
			current.edit_type = "json";

			current_edit_list.Add ("metadata", current);
		}

		// GET api/values 
		public IEnumerable<Current_Edit>  Get() 
		{ 
			return current_edit_list.Select(kvp => kvp.Value).AsEnumerable(); 
		} 

		// POST api/values 
		public void Post() 
		{ 
			bool valid_login = false;
			mmria.common.metadata.app metadata = null;

			try
			{

				System.IO.Stream dataStream0 = this.Request.Content.ReadAsStreamAsync().Result;
				// Open the stream using a StreamReader for easy access.
				//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
				System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
				// Read the content.
				string temp = reader0.ReadToEnd ();

				metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.app>(temp);

				//string metadata = DecodeUrlString(temp);
			}
			catch(Exception ex)
			{

			}


			try
			{
				string request_string = this.get_couch_db_url() + "/_session";
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
				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				string object_string = Newtonsoft.Json.JsonConvert.SerializeObject(metadata, settings);
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

		private  string GetHash(string metadata)
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

