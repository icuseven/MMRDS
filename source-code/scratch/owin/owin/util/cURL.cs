using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace mmria
{

	//http://stackoverflow.com/questions/21255725/webrequest-equivalent-to-curl-command
	public class cURL
	{
		string method;
		System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<string,string>> headers;
		string url;
		string pay_load;

		public cURL (string p_method, string p_headers, string p_url, string p_pay_load)
		{
			this.headers = new System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<string,string>> ();

			switch (p_method.ToUpper ()) 
			{
				case "PUT":
					this.method = "PUT";
					break;
				case "POST":
					this.method = "POST";
					break;
				case "DELETE":
					this.method = "DELETE";
					break;
				case "GET":
				default:
					this.method = "GET";
					break;
			}

			url = p_url;
			pay_load = p_pay_load;
			if (p_headers != null) 
			{
				string[] name_value_list = p_headers.Split ('|');

				foreach (string name_value in name_value_list) 
				{
					string[] n_v = name_value.Split (' ');
					this.headers.Add (new System.Collections.Generic.KeyValuePair<string,string> (n_v [0], n_v [1]));
				}

			}
		}


		public cURL AddHeader(string p_name, string p_value)
		{
			this.headers.Add(new System.Collections.Generic.KeyValuePair<string,string>(p_name, p_value));
			return this;
		}

		public string execute ()
		{
			string result = null;

			var httpWebRequest = (HttpWebRequest)WebRequest.Create(this.url);
			httpWebRequest.ReadWriteTimeout = 100000; //this can cause issues which is why we are manually setting this
			httpWebRequest.ContentType = "application/json";
			httpWebRequest.Accept = "*/*";
			httpWebRequest.Method = this.method;
			foreach (System.Collections.Generic.KeyValuePair<string,string> kvp in this.headers) 
			{
				httpWebRequest.Headers.Add (kvp.Key, kvp.Value);
			}

			if (this.pay_load != null) 
			{
				using (var streamWriter = new StreamWriter (httpWebRequest.GetRequestStream ())) 
				{
					streamWriter.Write (this.pay_load);
					streamWriter.Flush ();
					streamWriter.Close ();
				}
			}

			try
			{
				HttpWebResponse resp = (HttpWebResponse)httpWebRequest.GetResponse();
				result = new StreamReader(resp.GetResponseStream()).ReadToEnd();
				//Console.WriteLine("Response : " + respStr); // if you want see the output
			}
			catch(Exception ex)
			{
				//process exception here   
				result = ex.ToString();
			}

			return result;
		}

		public string get_metadata()
		{
			string result = null;

			//string URL = this.mmria_url + "/api/metadata";
			//string urlParameters = "?api_key=123";
			string urlParameters = "";

			HttpClient client = new HttpClient();
			client.BaseAddress = new Uri(this.url);

			// Add an Accept header for JSON format.
			client.DefaultRequestHeaders.Accept.Add(
				new MediaTypeWithQualityHeaderValue("application/json"));

			// List data response.
			HttpResponseMessage response = client.GetAsync(urlParameters).Result;  // Blocking call!
			if (response.IsSuccessStatusCode)
			{
				// Parse the response body. Blocking!
				result = response.Content.ReadAsAsync<string>().Result;
			}
			else
			{
				Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
			}

			return result;
		}


		public System.Dynamic.ExpandoObject Get()
		{
			System.Console.WriteLine ("Recieved message.");
			string result = null;
			System.Dynamic.ExpandoObject json_result = null;
			try
			{

				//"2016-06-12T13:49:24.759Z"
				string request_string = "this.get_couch_db_url()" + "/metadata/2016-06-12T13:49:24.759Z";

				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

				request.PreAuthenticate = false;

				/*
				if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
				{
					string[] cookie_set = this.Request.Headers.GetValues("Cookie").First().Split(';');
					for(int i = 0; i < cookie_set.Length; i++)
					{
						string[] auth_session_token = cookie_set[i].Split('=');
						if(auth_session_token[0].Trim() == "AuthSession" && auth_session_token[1] != "null")
						{
							request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
							request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
							break;
						}
					}
				}*/


				System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				result = reader.ReadToEnd ();

				json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(result, new  Newtonsoft.Json.Converters.ExpandoObjectConverter());

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}


			//return result;
			return json_result;
		}

		public mmria.common.model.couchdb.document_put_response set_case(string URL, string case_json)
		{
			mmria.common.model.couchdb.document_put_response result = null;

			//string URL = this.mmria_url + "/api/case";
			dynamic json_response = null;


			System.Net.CookieContainer cookieContainer = new System.Net.CookieContainer();
			//cookieContainer.Add(new System.Uri("http://localhost:12345"), new System.Net.Cookie("AuthSession", this.auth_token));

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
				if (json_response.auth_session != null && !string.IsNullOrWhiteSpace(json_response.auth_session))
				{
					//this.auth_token = json_response.auth_session;
				}
			}
			else
			{

			}

			return json_response;
		}

		//http://stackoverflow.com/questions/7929013/making-a-curl-call-in-c-sharp
		public async Task<string> nubian()
		{
			var client = new HttpClient();

			// Create the HttpContent for the form to be posted.
			var requestContent = new FormUrlEncodedContent(new [] {
				new System.Collections.Generic.KeyValuePair<string, string>("text", "This is a block of text"),
			});

			// Get the response.
			HttpResponseMessage response = await client.PostAsync(
				"http://api.repustate.com/v2/demokey/score.json",
				requestContent);

			// Get the response content.
			HttpContent responseContent = response.Content;

			// Get the stream of the content.
			using (var reader = new System.IO.StreamReader(await responseContent.ReadAsStreamAsync()))
			{
				// Write the output.
				return await reader.ReadToEndAsync();
			}
		}
	}
}

