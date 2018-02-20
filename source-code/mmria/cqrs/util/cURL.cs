using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace mmria.server
{
	public class cURL
	{
		string method;
		System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<string,string>> headers;
		string url;
		string pay_load;
		string user_id;
		string password;

		public cURL (string p_method, string p_headers, string p_url, string p_pay_load, string p_username = null,
		string p_password = null)
		{
			this.headers = new System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<string,string>> ();

			this.user_id = p_username;
			this.password = p_password;
			this.AllowRedirect = true;

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
				case "HEAD":
					this.method = "HEAD";
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


		public bool AllowRedirect { get; set; }

		public cURL AddHeader(string p_name, string p_value)
		{
			this.headers.Add(new System.Collections.Generic.KeyValuePair<string,string>(p_name, p_value));
			return this;
		}

        public async System.Threading.Tasks.Task<string> execute ()
		{
            System.Net.Http.HttpResponseMessage result = null;

            var HttpClient = new System.Net.Http.HttpClient() 
            { 
                //BaseAddress = new System.Uri(this.url),
                Timeout = TimeSpan.FromMilliseconds(100000) //this can cause issues which is why we are manually setting this
            };
            //HttpClient.PreAuthenticate = false;
            //HttpClient.Accept = "*/*";
            HttpClient.DefaultRequestHeaders.Add("Accept", "*/*");
            //HttpClient.Method = this.method;
            //HttpClient.AllowAutoRedirect = this.AllowRedirect;

            HttpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));


			if (!string.IsNullOrWhiteSpace(this.user_id) && !string.IsNullOrWhiteSpace(this.password))
			{
				string encoded = System.Convert.ToBase64String(System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(this.user_id + ":" + this.password));
                HttpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + encoded);
			}


			foreach (System.Collections.Generic.KeyValuePair<string,string> kvp in this.headers) 
			{
                HttpClient.DefaultRequestHeaders.Add (kvp.Key, kvp.Value);
			}


            System.Net.Http.HttpRequestMessage request_message;

            switch (method)
            {
                case "POST":
                    // Totally lost here.
                    result = await HttpClient.PostAsync(this.url, new System.Net.Http.StringContent(this.pay_load, System.Text.Encoding.UTF8, "application/json"));
                    break;

                case "PUT":
                    // Totally lost here.
                    result = await HttpClient.PutAsync(this.url, new System.Net.Http.StringContent(this.pay_load, System.Text.Encoding.UTF8, "application/json"));

                    break;
                case "DELETE":
                    result = await HttpClient.DeleteAsync(this.url);
                    break;
                case "GET":
                    // need to capture client data
                    //result = await client.GetAsync(path);
                    request_message = new System.Net.Http.HttpRequestMessage
                    (
                        System.Net.Http.HttpMethod.Get,
                        this.url
                    );
                    result = await HttpClient.SendAsync(request_message);
                    break;
                case "HEAD":
                    request_message = new System.Net.Http.HttpRequestMessage
                    (
                        System.Net.Http.HttpMethod.Head,
                        this.url
                    );
                    result = await HttpClient.SendAsync(request_message);
                    break;
                default:
                    //System.Console.WriteLine($"\nmethod:{method} Path: {this.url} new_path:{path} - missing manual.");
                    result = await HttpClient.GetAsync(this.url);
                    break;
            }


            return result.Content.ToString();
		}


		public cURL add_authentication_header(string p_username,
		string p_password)
		{

			this.user_id = p_username;
			this.password = p_password;

			return this;
		}
	}
}

