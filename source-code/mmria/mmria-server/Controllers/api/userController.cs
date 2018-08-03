using System;
using System.Collections.Generic;
using System.Linq;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

using mmria.common.model;

namespace mmria.server
{
	[Authorize(Roles  = "jurisdiction_admin,installation_admin")]
	[Route("api/[controller]")]
	public class userController: ControllerBase 
	{ 
		// GET api/values 
		//public IEnumerable<mmria.common.model.couchdb.user_alldocs_response> Get() 
		[HttpGet]
        public async System.Threading.Tasks.Task<mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user>> Get() 
		{ 
			try
			{
 				var jurisdiction_hashset = mmria.server.util.authorization_case.get_current_jurisdiction_id_set_for(User);

				var jurisdiction_username_hashset = mmria.server.util.authorization_case.get_user_jurisdiction_set();



				string request_string = this.get_couch_db_url() + "/_users/_all_docs?include_docs=true&skip=1";

				var user_curl = new cURL("GET",null,request_string,null, Program.config_timer_user_name, Program.config_timer_password);
				string responseFromServer = await user_curl.executeAsync();
/*
				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
				request.PreAuthenticate = false;
				//request.Method = "GET";

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
				*/
/*


{
	"total_rows":4,
	"offset":1,
	"rows":
	[
		{
			"id":"org.couchdb.user:install",
			"key":"org.couchdb.user:install",
			"value":
			{
				"rev":"1-ecd8ce6efa88cc72576ac17e2e7eb990"},
				"doc":
				{
					"_id":"org.couchdb.user:install",
					"_rev":"1-ecd8ce6efa88cc72576ac17e2e7eb990",
					"password_scheme":"pbkdf2",
					"iterations":10,
					"name":"install",
					"roles":
					[
						"installation_admin"
					],
					"type":"user",
					"derived_key":"ab55b8c441eefb32c8fd40d228e3a91193ed9135",
					"salt":"969c09275126e3cc60481536dc6d985f"
				}
			}
		},

		{"id":"org.couchdb.user:juris","key":"org.couchdb.user:juris","value":{"rev":"1-604c52cf2637a4e59c3ad07f60774a95"},"doc":{"_id":"org.couchdb.user:juris","_rev":"1-604c52cf2637a4e59c3ad07f60774a95","password_scheme":"pbkdf2","iterations":10,"name":"juris","roles":["jurisdiction_admin"],"type":"user","derived_key":"ab55b8c441eefb32c8fd40d228e3a91193ed9135","salt":"969c09275126e3cc60481536dc6d985f"}},
		{"id":"org.couchdb.user:user1","key":"org.couchdb.user:user1","value":{"rev":"1-94774b3d9ba9ce4d297f3db3727e9cbb"},"doc":{"_id":"org.couchdb.user:user1","_rev":"1-94774b3d9ba9ce4d297f3db3727e9cbb","password_scheme":"pbkdf2","iterations":10,"name":"user1","roles":["abstractor","form_designer"],"type":"user","derived_key":"ab55b8c441eefb32c8fd40d228e3a91193ed9135","salt":"969c09275126e3cc60481536dc6d985f"}}
	]
}


*/



				/*mmria.common.model.couchdb.user_alldocs_response json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user_alldocs_response>(responseFromServer);
				mmria.common.model.couchdb.user_alldocs_response[] result =  new mmria.common.model.couchdb.user_alldocs_response[] 
				{ 
					json_result
				}; 
				
				return result;
				*/

				var user_alldocs_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user>>(responseFromServer);
			

				mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user> result = new mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user>();
				result.offset = user_alldocs_response.offset;
				result.total_rows = user_alldocs_response.total_rows;

				

				List<mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.user>> temp_list = new List<mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.user>>();
				foreach(mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.user> uai in user_alldocs_response.rows)
				{
					bool is_jurisdiction_ok = false;
					foreach(string jurisdiction_item in jurisdiction_hashset)
					{

						if(jurisdiction_item == "/")
						{
							is_jurisdiction_ok = true;
							break;
						}
						var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item);

						foreach(string jurisdiction_username in jurisdiction_username_hashset)
						{
							var jurisdiction_username_array = jurisdiction_username.Split(",");
							if
							(
								regex.IsMatch(jurisdiction_username_array[0]) && 
								uai.doc.name == jurisdiction_username_array[1]
							)
							{
								is_jurisdiction_ok = true;
								break;
							}
						}

						if(is_jurisdiction_ok)
						{
							break;
						}
					}

					if(is_jurisdiction_ok) temp_list.Add (uai);
				}


				result.rows = temp_list;

				return result;

			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return null;
			//return new mmria.common.model.couchdb.user[] { default(mmria.common.model.couchdb.user), default(mmria.common.model.couchdb.user) }; 
		} 

		// GET api/values/5 
        public async System.Threading.Tasks.Task<mmria.common.model.couchdb.user> Get(string id) 
		{ 
			mmria.common.model.couchdb.user result = null;
			try
			{
				string request_string = this.get_couch_db_url() + "/_users/" + id;

				var user_curl = new cURL("PUT", null, request_string, null, Program.config_timer_user_name, Program.config_timer_password);
				var responseFromServer = await user_curl.executeAsync();

/*
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
*/
				result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user>(responseFromServer);
			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return result; 
		} 

		[HttpPost]
        public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post([FromBody] mmria.common.model.couchdb.user user) 
		{ 
			//bool valid_login = false;

			string object_string = null;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{
				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				object_string = Newtonsoft.Json.JsonConvert.SerializeObject(user, settings);

				

				string user_db_url = this.get_couch_db_url() + "/_users/"  + user._id;

				var user_curl = new cURL("PUT", null, user_db_url, object_string, Program.config_timer_user_name, Program.config_timer_password);
				var responseFromServer = await user_curl.executeAsync();
				result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);

/*
				System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(user_db_url));
				request.Method = "PUT";
				request.ContentType = "application/json";
				request.ContentLength = object_string.Length;
				request.PreAuthenticate = false;

				if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                {
                    string auth_session_value = this.Request.Cookies["AuthSession"];
                    request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
                    request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
                }

				using (System.IO.StreamWriter streamWriter = new System.IO.StreamWriter(request.GetRequestStream()))
				{
					try
					{
						streamWriter.Write(object_string);
						streamWriter.Flush();
						streamWriter.Close();


						System.Net.WebResponse response = await request.GetResponseAsync();
						System.IO.Stream dataStream = response.GetResponseStream ();
						System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
						string responseFromServer = reader.ReadToEnd ();

						result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
					
					}
					catch(Exception ex)
					{
						Console.WriteLine (ex);
					}
				}
 */
				if (!result.ok) 
				{

				}

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}

			return result;
		} 

		[HttpDelete]
        public async System.Threading.Tasks.Task<System.Dynamic.ExpandoObject> Delete(string user_id = null, string rev = null) 
        { 
            try
            {
                string request_string = null;

                if (!string.IsNullOrWhiteSpace (user_id) && !string.IsNullOrWhiteSpace (rev)) 
                {
                    request_string = Program.config_couchdb_url + "/_users/" + user_id + "?rev=" + rev;
                }
                else 
                {
                    return null;
                }

                var delete_report_curl = new cURL ("DELETE", null, request_string, null, Program.config_timer_user_name, Program.config_timer_password);
				var check_document_curl = new cURL ("GET", null, Program.config_couchdb_url + "/_users/" + user_id, null, Program.config_timer_user_name, Program.config_timer_password);
					// check if doc exists

				try 
				{
					string document_json = null;
					document_json = await check_document_curl.executeAsync ();
					var check_document_curl_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user> (document_json);
					IDictionary<string, object> result_dictionary = check_document_curl_result as IDictionary<string, object>;

					if(!mmria.server.util.authorization_user.is_authorized_to_handle_jurisdiction_id(User, check_document_curl_result))
					{
						return null;
					}

					if (result_dictionary.ContainsKey ("_rev")) 
					{
						request_string = Program.config_couchdb_url + "/_users/" + user_id + "?rev=" + result_dictionary ["_rev"];
						//System.Console.WriteLine ("json\n{0}", object_string);
					}

				} 
				catch (Exception ex) 
				{
					// do nothing for now document doesn't exsist.
                    System.Console.WriteLine ($"err caseController.Delete\n{ex}");
				}

                string responseFromServer = await delete_report_curl.executeAsync ();;
                var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

                return result;

            }
            catch(Exception ex)
            {
                Console.WriteLine (ex);
            } 

            return null;
        }

		private string get_couch_db_url()
		{
            string result = Program.config_couchdb_url;

			return result;
		}

	} 
}

