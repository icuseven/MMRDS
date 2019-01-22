using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace mmria.server.util
{
    public class TokenClient
    {
        private IConfiguration _configuration;
            string sams_endpoint_authorization;
            string sams_endpoint_token;
            string sams_endpoint_user_info;
            string sams_endpoint_token_validation;
            string sams_endpoint_user_info_sys;
            string sams_client_id;
            string sams_callback_url;  

            string sams_client_secret;

        public TokenClient(IConfiguration configuration)
        {
            _configuration = configuration;

            sams_endpoint_authorization = _configuration["sams:endpoint_authorization"];
            sams_endpoint_token = _configuration["sams:endpoint_token"];
            sams_endpoint_user_info = _configuration["sams:endpoint_user_info"];
            sams_endpoint_token_validation = _configuration["sams:token_validation"];
            sams_endpoint_user_info_sys = _configuration["sams:user_info_sys"];
            sams_client_id = _configuration["sams:client_id"];
            sams_callback_url = _configuration["sams:callback_url"];   
            sams_client_secret = _configuration["sams:client_secret"];
        }
        public async Task<(string id_token, string access_token)> Get_Id_And_Access_Token
        (
            string code,
            string state
        )
        {

            System.Diagnostics.Debug.WriteLine($"code: {code}");
            System.Diagnostics.Debug.WriteLine($"state: {state}");

            HttpClient client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, sams_endpoint_token);

            /*
            request.Content = new FormUrlEncodedContent(new Dictionary<string, string> {
                { "client_id", sams_client_id },
                { "client_secret", sams_client_secret },
                { "grant_type", "client_credentials" },
                { "code", code },
            });
             */

            request.Content = new FormUrlEncodedContent(new Dictionary<string, string> {
                { "client_id", sams_client_id },
                { "client_secret", sams_client_secret },
                { "grant_type", "authorization_code" },
                { "code", code },
                { "scope", "openid profile email"},
                {"redirect_uri", sams_callback_url }
            });


            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var payload = JObject.Parse(await response.Content.ReadAsStringAsync());
            var access_token = payload.Value<string>("access_token");
            var scope = payload.Value<string>("scope");



            var id_token = payload.Value<string>("id_token");

            return (id_token, access_token);

/*
            var id_array = id_token.Split('.');


            var replaced_value = id_array[1].Replace('-', '+').Replace('_', '/');
            var base64 = replaced_value.PadRight(replaced_value.Length + (4 - replaced_value.Length % 4) % 4, '=');


            var id_0 = DecodeToken(id_array[0]);
            var id_1 = DecodeToken(id_array[1]);

            var id_body = Base64Decode(base64);

            var user_info_sys_request = new HttpRequestMessage(HttpMethod.Post, sams_endpoint_user_info + "?token=" + id_token);


            user_info_sys_request.Headers.Add("Authorization","Bearer " + access_token); 
            user_info_sys_request.Headers.Add("client_id", sams_client_id); 
            user_info_sys_request.Headers.Add("client_secret", sams_client_secret); 
 */
            /* 
            user_info_sys_request.Content = new FormUrlEncodedContent(new Dictionary<string, string> {
                { "client_id", sams_client_id },
                { "client_secret", sams_client_secret },
                { "grant_type", "client_credentials" },
                { "scope", scope },
            });
            */


/*
            response = await client.SendAsync(user_info_sys_request);

            return response;
            
            response.EnsureSuccessStatusCode();

            var temp_string = await response.Content.ReadAsStringAsync();
            payload = JObject.Parse(temp_string);

            
            var email = payload.Value<string>("email");
             */

/*
            //check if user exists
            var config_couchdb_url = _configuration["mmria_settings:couchdb_url"];
            var config_timer_user_name = _configuration["mmria_settings:timer_user_name"];
            var config_timer_password = _configuration["mmria_settings:timer_password"];

            mmria.common.model.couchdb.user user = null;
			try
			{
				string request_string = config_couchdb_url + "/_users/" + System.Web.HttpUtility.HtmlEncode("org.couchdb.user:" + email.ToLower());
				var user_curl = new mmria.server.cURL("GET", null, request_string, null, config_timer_user_name, config_timer_password);
				var responseFromServer = await user_curl.executeAsync();

				user = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user>(responseFromServer);
			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

            mmria.common.model.couchdb.document_put_response user_save_result = null;

            if(user == null)// if user does NOT exists create user with email
            {
                user = add_new_user(email.ToLower(), Guid.NewGuid().ToString());

                try
                {
                    Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
                    settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                    var object_string = Newtonsoft.Json.JsonConvert.SerializeObject(user, settings);

                    string user_db_url = config_couchdb_url + "/_users/"  + user._id;

                    var user_curl = new mmria.server.cURL("PUT", null, user_db_url, object_string, config_timer_user_name, config_timer_password);
                    var responseFromServer = await user_curl.executeAsync();
                    user_save_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);

                }
                catch(Exception ex) 
                {
                    Console.WriteLine (ex);
                }
            }
             */
        }

        public async Task<string> get_user_info_sys_request
        (
            string id_token,
            string access_token
        )
        {
            HttpClient client = new HttpClient();
            var user_info_sys_request = new HttpRequestMessage(HttpMethod.Post, sams_endpoint_user_info + "?token=" + id_token);


            user_info_sys_request.Headers.Add("Authorization","Bearer " + access_token); 
            user_info_sys_request.Headers.Add("client_id", sams_client_id); 
            user_info_sys_request.Headers.Add("client_secret", sams_client_secret); 

            /* 
            user_info_sys_request.Content = new FormUrlEncodedContent(new Dictionary<string, string> {
                { "client_id", sams_client_id },
                { "client_secret", sams_client_secret },
                { "grant_type", "client_credentials" },
                { "scope", scope },
            });
            */



            var response = await client.SendAsync(user_info_sys_request);

            //return response;

            response.EnsureSuccessStatusCode();

            var temp_string = await response.Content.ReadAsStringAsync();

            return temp_string;
        }

        private string DecodeToken(string p_value)
        {
            var replaced_value = p_value.Replace('-', '+').Replace('_', '/');
            var base64 = replaced_value.PadRight(replaced_value.Length + (4 - replaced_value.Length % 4) % 4, '=');
            return Base64Decode(base64);
        }

        private string Base64Decode(string base64EncodedData) 
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

    }
}