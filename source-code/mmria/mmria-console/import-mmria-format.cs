using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.IO;

namespace mmria.console
{
	public class import_mmria_format
	{
		private string auth_token = null;
		private string user_name = null;
		private string password = null;
		private string source_file_path = null;
		private string mmria_url = null;

		//import user_name:user1 password:password database_file_path:mapping-file-set/Maternal_Mortality.mdb url:http://localhost:12345

		public import_mmria_format()
		{
			

		}
		public async void Execute(string[] args)
		{

			if (args.Length > 1)
			{
				for (var i = 1; i < args.Length; i++)
				{
					string arg = args[i];
					int index = arg.IndexOf(':');
					string val = arg.Substring(index + 1, arg.Length - (index + 1)).Trim(new char[] { '\"' });

					if (arg.ToLower().StartsWith("auth_token"))
					{
						this.auth_token = val;
					}
					else if (arg.ToLower().StartsWith("user_name"))
					{
						this.user_name = val;
					}
					else if (arg.ToLower().StartsWith("password"))
					{
						this.password = val;
					}
					else if (arg.ToLower().StartsWith("source_file_path"))
					{
						
						this.source_file_path = val;
					}
					else if (arg.ToLower().StartsWith("url"))
					{
						this.mmria_url = val;
					}
				}
			}

			if (string.IsNullOrWhiteSpace(this.source_file_path))
			{
				System.Console.WriteLine("missing source_file_path");
				System.Console.WriteLine(" form database:[file path]");
				System.Console.WriteLine(" example 1 database_file_path:c:\\temp\\maternal_mortality.mdb");
				System.Console.WriteLine(" example 2 database_file_path:\"c:\\temp folder\\maternal_mortality.mdb\"");
				System.Console.WriteLine(" example 3 database_file_path:mapping-file-set\\maternal_mortality.mdb\"");
				System.Console.WriteLine(" mmria.exe import user_name:user1 password:secret url:http://localhost:12345 database_file_path:\"c:\\temp folder\\maternal_mortality.mdb\"");

				return;
			}

			if (string.IsNullOrWhiteSpace(this.mmria_url))
			{
				System.Console.WriteLine("missing url");
				System.Console.WriteLine(" form url:[website_url]");
				System.Console.WriteLine(" example url:http://localhost:12345");

				return;
			}

			if (string.IsNullOrWhiteSpace(this.user_name))
			{
				System.Console.WriteLine("missing user_name");
				System.Console.WriteLine(" form user_name:[user_name]");
				System.Console.WriteLine(" example user_name:user1");
				return;
			}

			if (string.IsNullOrWhiteSpace(this.password))
			{
				System.Console.WriteLine("missing password");
				System.Console.WriteLine(" form password:[password]");
				System.Console.WriteLine(" example password:secret");
				return;
			}



			if (!Directory.Exists(this.source_file_path))
			{
				System.Console.WriteLine($"source_file_path does NOT exist: {this.source_file_path}");
				return;
			}


			string login_url = this.mmria_url + "/api/session/";
			var login_curl = new cURL("PUT", null, login_url, Newtonsoft.Json.JsonConvert.SerializeObject((user_name:this.user_name, password: this.password)));
			string login_result_string = await login_curl.executeAsync();
			var login_result_data = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(login_result_string);
			IDictionary<string, object> login_result_dictionary = login_result_data as IDictionary<string, object>;

			string auth_session = null;

			//{"ok":true,"userCtx":{"name":null,"roles":[]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"]}}
			if (!login_result_dictionary.ContainsKey ("ok") && login_result_dictionary["ok"].ToString().ToLower() != "true") 
			{
				System.Console.WriteLine($"Unable to login to {this.mmria_url}:\n{login_result_dictionary}");
				return;
			}


			auth_session = login_result_dictionary ["auth_session"].ToString();



			foreach (var file_name in System.IO.Directory.GetFiles(this.source_file_path))
			{
				string json_string = null;

				string global_record_id = null;

				var case_data = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(System.IO.File.ReadAllText(file_name));
				IDictionary<string, object> case_data_dictionary = case_data as IDictionary<string, object>;

				if (case_data_dictionary.ContainsKey ("_id")) 
				{
					global_record_id = case_data_dictionary ["_id"].ToString();
				}


				try
				{
					// check if doc exists
					string document_url = this.mmria_url + "/api/case/" + global_record_id;
					var document_curl = new cURL("GET", null, document_url, null, this.user_name, this.password);
					document_curl.AddCookie("AuthSession", auth_session);
					string document_json = null;

					document_json = document_curl.execute();
					var result_expando = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(document_json);
					var result = result_expando as IDictionary<string, object>;
					if (result.ContainsKey ("_rev")) 
					{
						case_data_dictionary ["_rev"] = result ["_rev"];


						json_string = Newtonsoft.Json.JsonConvert.SerializeObject (case_data, new Newtonsoft.Json.JsonSerializerSettings () {
							Formatting = Newtonsoft.Json.Formatting.Indented,
							DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat,
							DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc
						});
						System.Console.WriteLine ("json\n{0}", json_string);
					}

					var update_curl = new cURL ("PUT", null, document_url, json_string, this.user_name, this.password);
					try 
					{
						string de_id_result = update_curl.execute ();
						System.Console.WriteLine ("update id");
						System.Console.WriteLine (de_id_result);

					}
					catch (Exception ex) 
					{
						System.Console.WriteLine ("sync de_id");
						System.Console.WriteLine (ex);
					}

				}
				catch (Exception ex)
				{
					System.Console.WriteLine("Get case");
					System.Console.WriteLine(ex);

					json_string = Newtonsoft.Json.JsonConvert.SerializeObject(case_data, new Newtonsoft.Json.JsonSerializerSettings () {
						Formatting = Newtonsoft.Json.Formatting.Indented,
						DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat,
						DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc
					});

					string document_url = this.mmria_url + "/api/case/" + global_record_id;
					var update_curl = new cURL("PUT", null, document_url, json_string, this.user_name, this.password);
					try
					{
						string de_id_result = update_curl.execute();
						System.Console.WriteLine("update id");
						System.Console.WriteLine(de_id_result);

					}
					catch (Exception ex2)
					{
						System.Console.WriteLine("sync de_id");
						System.Console.WriteLine(ex2);
					}
					System.Console.WriteLine("json\n{0}", json_string);

				}



				//return;
				//System.IO.File.WriteAllText(import_directory + "/" + global_record_id + ".json", json_string);

				//break;

			}


			Console.WriteLine("Import Finished");



		}


		public mmria.common.metadata.app get_metadata()
		{
			mmria.common.metadata.app result = null;

			string URL = "http://test.mmria.org/api/metadata";
			//string urlParameters = "?api_key=123";
			string urlParameters = "";

			HttpClient client = new HttpClient();
			client.BaseAddress = new Uri(URL);

			// Add an Accept header for JSON format.
			client.DefaultRequestHeaders.Accept.Add(
			new MediaTypeWithQualityHeaderValue("application/json"));

			// List data response.
			HttpResponseMessage response = client.GetAsync(urlParameters).Result;  // Blocking call!
			if (response.IsSuccessStatusCode)
			{
				// Parse the response body. Blocking!
				//result = response.Content.ReadAsAsync<mmria.common.metadata.app>().Result;
			}
			else
			{
				Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
			}

			return result;
		}


	}
}
