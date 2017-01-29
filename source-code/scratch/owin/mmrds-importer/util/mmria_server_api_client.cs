using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;

namespace mmria.console
{
	public class mmria_server_api_client
	{
		private string database_path;
		private string database_url;
		private string mmria_url;
		private string auth_token;
		private List<string> roles;
		private string user_name;
		private string password;


		public mmria_server_api_client(string p_mmria_url)
		{
			this.mmria_url = p_mmria_url;
			this.roles = new List<string>();
		}


		public string Database_Path
		{
			get { return this.database_path; }
			set { this.database_path = value; }
		}


		public string Database_Url
		{
			get { return this.database_url; }
			set { this.database_url = value; }
		}

		public mmria_server_api_client(string p_database_path,  string p_mmria_url)
		{
			this.database_path = p_database_path;
			this.mmria_url =p_mmria_url;
		}

		public mmria.common.metadata.app get_metadata()
		{
			mmria.common.metadata.app result = null;

			string URL = this.mmria_url + "/api/metadata";
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
				result = response.Content.ReadAsAsync<mmria.common.metadata.app>().Result;
			}
			else
			{
				Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
			}

			return result;
		}

		public mmria.common.model.couchdb.session_response get_session()
		{
			mmria.common.model.couchdb.session_response result = null;

			string URL = this.mmria_url + "/api/session";
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
				result = response.Content.ReadAsAsync<mmria.common.model.couchdb.session_response>().Result;
			}
			else
			{
				Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
			}

			return result;
		}

		public IEnumerable<mmria.common.model.couchdb.login_response> login(string p_user_id, string p_password)
		{
			this.user_name = p_user_id;
			this.password = p_password;

			IEnumerable < mmria.common.model.couchdb.login_response> result = null;
			dynamic json_response = null;
			 
			string URL = this.mmria_url + "/api/session";
			//string userid,
			//string password

			string urlParameters = string.Format("?userid={0}&password={1}", p_user_id, p_password);
			//string urlParameters = "";

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
				json_response = response.Content.ReadAsAsync<IEnumerable<mmria.common.model.couchdb.login_response>>().Result;
			}
			else
			{
				Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
			}

			//System.Console.WriteLine(response);

			//{"ok":true,"userCtx":{"name":null,"roles":[]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"]}}

			if (json_response[0].ok == true)
			{
				if (json_response[0].name != null)
				{
					this.roles.AddRange(json_response[0].roles as IList<string>);
					this.auth_token = json_response[0].auth_session;
				}
			}
			else
			{

			}

			return json_response;
		}

		public mmria.common.model.couchdb.document_put_response set_case(string case_json)
		{
			mmria.common.model.couchdb.document_put_response result = null;

			string URL = this.mmria_url + "/api/case";
			dynamic json_response = null;


			System.Net.CookieContainer cookieContainer = new System.Net.CookieContainer();
			cookieContainer.Add(new System.Uri("http://localhost:12345"), new System.Net.Cookie("AuthSession", this.auth_token));

			var handler = new HttpClientHandler() { CookieContainer = cookieContainer };

			HttpClient client = new HttpClient(handler);
			client.BaseAddress = new Uri(URL);

			// Add an Accept header for JSON format.
			client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

			//client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Cookie", "AuthSession=" + this.auth_token);
			var content = new StringContent(case_json, System.Text.Encoding.UTF8, "application/json");

			// List data response.
			HttpResponseMessage response = client.PostAsync(URL, content).Result;  // Blocking call!
			if (response.IsSuccessStatusCode)
			{
				// Parse the response body. Blocking!
				json_response = response.Content.ReadAsAsync<mmria.common.model.couchdb.document_put_response>().Result;
			}
			else
			{
				Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
			}

			if (json_response.ok == true)
			{
				this.auth_token = json_response.auth_session;
			}
			else
			{

			}

			return json_response;
		}

		public mmria.common.model.couchdb.document_put_response set_case2(string case_json)
		{
			mmria.common.model.couchdb.document_put_response result = null;

			string URL = this.mmria_url + "/api/metadata";
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
				result = response.Content.ReadAsAsync<mmria.common.model.couchdb.document_put_response>().Result;
			}
			else
			{
				Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
			}

			return result;
		}

		public dynamic get_all_cases(string p_database_url)
		{
			this.database_url = p_database_url;
			/*
			var credential = new System.Net.NetworkCredential
			{
				UserName = "user1",
				Password = "password"
			};

			var httpClientHandler = new System.Net.Http.HttpClientHandler
			{
				Credentials = credential,
				PreAuthenticate = false,
				Proxy = new WebProxy("http://127.0.0.1:8888"),
                UseProxy = true,
			};

			HttpClient client = new HttpClient(httpClientHandler);
			*/

			System.Dynamic.ExpandoObject result = null;
			string URL = this.database_url + "/mmrds/_all_docs";
			string urlParameters = "?include_docs=true";

			HttpClient client = new HttpClient();
			client.BaseAddress = new Uri(URL);

			var byteArray = System.Text.Encoding.ASCII.GetBytes(string.Format("{0}:{1}", this.user_name, this.password));
			client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));


			// Add an Accept header for JSON format.
			client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

			// List data response.
			HttpResponseMessage response = client.GetAsync(urlParameters).Result;  // Blocking call!
			if (response.IsSuccessStatusCode)
			{
				// Parse the response body. Blocking!
				result = response.Content.ReadAsAsync<System.Dynamic.ExpandoObject>().Result;
			}
			else
			{
				Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
			}

			return result;
		}

	}
}
