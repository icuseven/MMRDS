using System;
using System.Collections.Generic;
using Microsoft.CSharp;
using System.Web.Http;
using System.Net;
using System.Linq;

namespace owin
{
	public class sessionController: ApiController 
	{
		private static string geocode_api_key = System.Configuration.ConfigurationManager.AppSettings["geocode_api_key"];
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
				string request_string = "http://127.0.0.1:5984/_session/";
				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

				request.PreAuthenticate = false;


				if(this.Request.Headers.Contains("AuthSession"))
				{
					string[] auth_session_token = this.Request.Headers.GetValues("AuthSession").ToArray();
					request.Headers.Add("AuthSession", auth_session_token[1]);
				}


 				System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				string responseFromServer = reader.ReadToEnd ();
				session_response json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<session_response>(responseFromServer);


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
				string request_string = "http://127.0.0.1:5984/_session/";
				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

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


				/*
		< HTTP/1.1 200 OK
		< Set-Cookie: AuthSession=YW5uYTo0QUIzOTdFQjrC4ipN-D-53hw1sJepVzcVxnriEw;
		< Version=1; Path=/; HttpOnly
		> ...
		<
		{"ok":true}
	*/
				/*
				bool is_logged_in = false;

				session_response[] result;

				if (bool.TryParse (json_result ["ok"], out is_logged_in)) 
				{

				}
				else 
				{

				}*/
				/*
				{
					"ok":true,
					"userCtx":
					{
						"name":"mmrds",
						"roles":["_admin"]
					},
					"info":
					{
						"authentication_db":"_users",
						"authentication_handlers":
						[
							"oauth",
							"cookie",
							"default"
						],
						"authenticated":"cookie"
					}
				}
				*/



				login_response[] result =  new login_response[] 
				{ 
					json_result
				}; 

				string auth_session_token = response.Headers["Set-Cookie"];
				result[0].auth_session = auth_session_token;


				this.ActionContext.Response.Headers.Add("Set-Cookie", auth_session_token);

				return result;

			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return null;
		}

		// GET api/values/5 
		public master_record Get(int id) 
		{ 
			return default(master_record); 
		} 
		/*
		// POST api/values 
		public void Post([FromBody]master_record value) 
		{ 
		} 

		// PUT api/values/5 
		public void Put(int id, [FromBody]master_record value) 
		{ 
		} */

		// DELETE api/values/5 
		public void Delete(System.Guid  id) 
		{ 
		} 


	}
}

