using System;
using System.Collections.Generic;
using Microsoft.CSharp;
using System.Web.Http;
using System.Net;
using System.Linq;

//https://wiki.apache.org/couchdb/Session_API

namespace mmria.server
{
	public class sessionController: ApiController 
	{

		//{"ok":true,"userCtx":{"name":null,"roles":[]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"]}}
		//{"ok":true,"userCtx":{"name":"mmrds","roles":["_admin"]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"],"authenticated":"cookie"}}

		public sessionController ()
		{

		}


		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public IEnumerable<session_response> Get() 
		{ 
			try
			{
				string request_string = this.get_couch_db_url() + "/_session";
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
				session_response json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<session_response>(responseFromServer);

				if(response.Headers["Set-Cookie"] != null)
				{
					string[] set_cookie = response.Headers["Set-Cookie"].Split(';');
					string[] auth_array = set_cookie[0].Split('=');
					if(auth_array.Length > 1)
					{
						string auth_session_token = auth_array[1];
						json_result.auth_session = auth_session_token;
					}
					else
					{
						json_result.auth_session = "";
					}
				}

				/*
		< HTTP/1.1 200 OK
		< Set-Cookie: AuthSession=YW5uYTo0QUIzOTdFQjrC4ipN-D-53hw1sJepVzcVxnriEw;
		< Version=1; Path=/; HttpOnly
		> ...
		<
		{"ok":true}*/
	
				session_response[] result =  new session_response[] 
				{ 
					json_result
				}; 

				return result;

			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return null;
		}


		// GET api/values 
		//public IEnumerable<master_record> Get() 
		//public System.Net.Http.HttpResponseMessage Get
		public IEnumerable<login_response> Get
		(
			string userid,
			string password
		) 
		{ 

			/*
	HOST="http://127.0.0.1:5984"
	> curl -vX POST $HOST/_session -H 'Content-Type: application/x-www-form-urlencoded' -d 'name=anna&password=secret'
*/
			try
			{
				string post_data = string.Format ("name={0}&password={1}", userid, password);
				byte[] post_byte_array = System.Text.Encoding.ASCII.GetBytes(post_data);


				//string request_string = "http://mmrds:mmrds@localhost:5984/_session";
				string request_string = this.get_couch_db_url() + "/_session";
				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
				//request.UseDefaultCredentials = true;

				request.PreAuthenticate = false;
				//request.Credentials = new System.Net.NetworkCredential("mmrds", "mmrds");
				request.Method = "POST";
				request.ContentType = "application/x-www-form-urlencoded";
				request.ContentLength = post_byte_array.Length;

				using (System.IO.Stream stream = request.GetRequestStream())
				{
					stream.Write(post_byte_array, 0, post_byte_array.Length);
				}/**/

				System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();

				System.IO.Stream dataStream = response.GetResponseStream ();

				// Open the stream using a StreamReader for easy access.
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				// Read the content.
				string responseFromServer = reader.ReadToEnd ();

				login_response json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<login_response>(responseFromServer);

				login_response[] result =  new login_response[] 
				{ 
					json_result
				}; 


				string[] set_cookie = response.Headers["Set-Cookie"].Split(';');
				string[] auth_array = set_cookie[0].Split('=');
				if(auth_array.Length > 1)
				{
					string auth_session_token = auth_array[1];
					result[0].auth_session = auth_session_token;
				}
				else
				{
					result[0].auth_session = "";
				}

				//this.ActionContext.Response.Headers.Add("Set-Cookie", auth_session_token);

				return result;

			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return null;
		}

		//https://wiki.apache.org/couchdb/Session_API
		// DELETE api/_sevalues/5 
		public logout_response Delete() 
		{ 
			try
			{
				string request_string = this.get_couch_db_url() + "/_session";
				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
				request.Method = "DELETE";
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
				logout_response json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<logout_response>(responseFromServer);

				return json_result;
			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return null;
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

