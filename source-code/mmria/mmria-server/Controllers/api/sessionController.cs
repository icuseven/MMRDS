using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using mmria.common.model.couchdb;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

//https://wiki.apache.org/couchdb/Session_API

namespace mmria.server
{

    [Route("api/[controller]")]
    public class sessionController: ControllerBase
	{


        [Route("list")]
        [HttpGet]
        public async System.Threading.Tasks.Task<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.session>> Get
        (
            int skip = 0,
            int take = 25,
            string sort = "by_date_created",
            string search_key = null,
            bool descending = false
        ) 
		{
            /*
             * 
             * http://localhost:5984/de_id/_design/sortable/_view/conflicts
             * 

by_date_created
by_created_by
by_date_last_updated
by_last_updated_by
by_role_name
by_user_id
by_parent_id
by_jurisdiction_id
by_is_active
by_effective_start_date
by_effective_end_date


date_created
created_by
date_last_updated
last_updated_by
role_name
user_id
parent_id
jurisdiction_id
is_active
effective_start_date
effective_end_date

*/

            string sort_view = sort.ToLower ();
            switch (sort_view)
            {
                    case "by_date_created":
                    case "by_date_created_user_id":
                    case "by_session_event_id":
                    case "by_user_id":
					case "by_ip":
                    break;

                default:
                    sort_view = "by_date_created";
                break;
            }



			try
			{
                System.Text.StringBuilder request_builder = new System.Text.StringBuilder ();
                request_builder.Append (Program.config_couchdb_url);
                request_builder.Append ($"/jurisdiction/_design/sortable/_view/{sort_view}?");


                if (string.IsNullOrWhiteSpace (search_key))
                {
                    if (skip > -1) 
                    {
                        request_builder.Append ($"skip={skip}");
                    } 
                    else 
                    {

                        request_builder.Append ("skip=0");
                    }


                    if (take > -1) 
                    {
                        request_builder.Append ($"&limit={take}");
                    }

                    if (descending) 
                    {
                        request_builder.Append ("&descending=true");
                    }
                } 
                else 
                {
                    request_builder.Append ("skip=0");

                    if (descending) 
                    {
                        request_builder.Append ("&descending=true");
                    }
                }

				var user_role_jurisdiction_curl = new cURL("GET", null, request_builder.ToString(), null, Program.config_timer_user_name, Program.config_timer_password);
				string response_from_server = await user_role_jurisdiction_curl.executeAsync ();

                var session_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.session>>(response_from_server);

                if (string.IsNullOrWhiteSpace (search_key)) 
                {
                    return session_view_response;
                } 
                else 
                {
                    string key_compare = search_key.ToLower ().Trim (new char [] { '"' });

                    var result = new mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.session>();
                    result.offset = session_view_response.offset;
                    result.total_rows = session_view_response.total_rows;

                    //foreach(mmria.common.model.couchdb.user_role_jurisdiction cvi in case_view_response.rows)
                    foreach(mmria.common.model.couchdb.get_sortable_view_response_item<mmria.common.model.couchdb.session> cvi in session_view_response.rows)
                    {
/*
date_created
created_by
date_last_updated
last_updated_by
role_name
user_id
parent_id
jurisdiction_id
is_active
effective_start_date
effective_end_date
 */ 

                        bool add_item = false;
                        if (cvi.value.ip != null && cvi.value.ip.Equals(key_compare, StringComparison.OrdinalIgnoreCase))
                        {
                            add_item = true;
                        }

						if(bool.TryParse(key_compare, out bool is_active))
						{
							if(cvi.value.is_active == is_active)
							{
								add_item = true;
							}
						}


                        if(cvi.value.user_id != null && cvi.value.user_id.Equals (key_compare, StringComparison.OrdinalIgnoreCase))
                        {
                            add_item = true;
                        }

						DateTime is_date;
						if(DateTime.TryParse(key_compare, out is_date))
						{
							if(cvi.value.date_created == is_date)
							{
								add_item = true;
							}
						}
					

						if(DateTime.TryParse(key_compare, out is_date))
						{
							if(cvi.value.date_last_updated == is_date)
							{
								add_item = true;
							}
						}
                        

                        if(cvi.value.session_event_id != null && cvi.value.session_event_id.Equals (key_compare, StringComparison.OrdinalIgnoreCase))
                        {
                            add_item = true;
                        }

                        if(add_item) result.rows.Add (cvi);
                       
                    }

                    result.total_rows = result.rows.Count;
                    result.rows =  result.rows.Skip (skip).Take (take).ToList ();

                    return result;
                }


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


		//{"ok":true,"userCtx":{"name":null,"roles":[]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"]}}
		//{"ok":true,"userCtx":{"name":"mmrds","roles":["_admin"]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"],"authenticated":"cookie"}}

		// GET api/values 
		//public IEnumerable<master_record> Get() 
        [HttpGet]
		public  async System.Threading.Tasks.Task<IEnumerable<session_response>> Get() 
		{ 
			try
			{
				string request_string = Program.config_couchdb_url + "/_session";
				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

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

				if(response.Headers["Set-Cookie"] != null)
				{
					this.Response.Headers.Add("Set-Cookie", response.Headers["Set-Cookie"]);
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
		[AllowAnonymous] 
		[HttpPut]
        [HttpPost]
		public async System.Threading.Tasks.Task<IEnumerable<login_response>> Post
		(
            [FromBody] Post_Request_Struct Post_Request

		) 
		{ 

            //Post_Request_Struct Post_Request = new Post_Request_Struct();

			/*
	HOST="http://127.0.0.1:5984"
	> curl -vX POST $HOST/_session -H 'Content-Type: application/x-www-form-urlencoded' -d 'name=anna&password=secret'
*/
			try
			{
                string post_data = string.Format ("name={0}&password={1}", Post_Request.userid, Post_Request.password);
				byte[] post_byte_array = System.Text.Encoding.ASCII.GetBytes(post_data);


				//string request_string = "http://mmrds:mmrds@localhost:5984/_session";
				string request_string = Program.config_couchdb_url + "/_session";
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






				this.Response.Headers.Add("Set-Cookie", response.Headers["Set-Cookie"]);

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

				//{"ok":true,"userCtx":{"name":null,"roles":[]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"]}}
				if (json_result.ok && !string.IsNullOrWhiteSpace(json_result.name)) 
				{
					const string Issuer = "https://contoso.com";

					var claims = new List<Claim>();
					claims.Add(new Claim(ClaimTypes.Name, json_result.name, ClaimValueTypes.String, Issuer));
					foreach(string role in json_result.roles)
					{
						claims.Add(new Claim(ClaimTypes.Role, role, ClaimValueTypes.String, Issuer));
					}
					
					//claims.Add(new Claim("EmployeeId", string.Empty, ClaimValueTypes.String, Issuer));
					//claims.Add(new Claim("EmployeeId", "123", ClaimValueTypes.String, Issuer));
					//claims.Add(new Claim(ClaimTypes.DateOfBirth, "1970-06-08", ClaimValueTypes.Date));

					//var userIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
					var userIdentity = new ClaimsIdentity("SuperSecureLogin");
                    userIdentity.AddClaims(claims);
					var userPrincipal = new ClaimsPrincipal(userIdentity);

					await HttpContext.SignInAsync(
						CookieAuthenticationDefaults.AuthenticationScheme,
						userPrincipal,
						new AuthenticationProperties
						{
							ExpiresUtc = DateTime.UtcNow.AddMinutes(30),
							IsPersistent = false,
							AllowRefresh = false
						});
				}

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
				string request_string = Program.config_couchdb_url + "/_session";


				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
				request.Method = "DELETE";
				request.PreAuthenticate = false;

                if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                {
                    string auth_session_value = this.Request.Cookies["AuthSession"];
                    request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
                    request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
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

	}

    public struct Post_Request_Struct
    {
        public string userid;
        public string password;
    }
}

