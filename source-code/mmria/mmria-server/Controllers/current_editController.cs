using System;
using System.Collections.Generic;
using System.Linq;

using Microsoft.AspNetCore.Mvc;


using mmria.common.model;
using mmria.common.model.couchdb;

namespace mmria.server
{
	public class current_editController: ControllerBase 
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
        public async System.Threading.Tasks.Task Post([FromBody] mmria.common.metadata.app metadata) 
		{ 
			bool valid_login = false;

			try
			{
				string request_string = Program.config_couchdb_url + "/_session";
				System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(request_string));

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

	} 
}

