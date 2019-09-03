using System;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;

namespace mmria.server.model.actor.quartz
{
    public class Check_DB_Install : UntypedActor
    {
        protected override void PreStart() => Console.WriteLine("Check_DB_Install started");
        protected override void PostStop() => Console.WriteLine("Check_DB_Install stopped");

        protected override void OnReceive(object message)
        {
            switch(message)
            {
                case ScheduleInfoMessage scheduleInfoMessage:

				Console.WriteLine($"Starup/Install Check - start {System.DateTime.Now}");
				if 
				(
					url_endpoint_exists (Program.config_couchdb_url, null, null, "GET") &&
					!Program.config_timer_user_name.Equals("couchdb_admin_user_name", StringComparison.OrdinalIgnoreCase) &&
					!Program.config_timer_value.Equals ("couchdb_admin_password", StringComparison.OrdinalIgnoreCase) &&
					!url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_value, "GET")
				)
				{

					try
					{
							new cURL ("PUT", null, Program.config_couchdb_url + $"/_node/nonode@nohost/_config/admins/{Program.config_timer_user_name}", $"\"{Program.config_timer_value}\"", null, null).execute();

						//await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/mmria_section/app_version", $"\"{Program.config_app_version}\"", Program.config_timer_user_name, Program.config_timer_password).executeAsync();


							new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/couch_httpd_auth/allow_persistent_cookies", $"\"true\"", Program.config_timer_user_name, Program.config_timer_value).execute();


							new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/chttpd/bind_address", $"\"0.0.0.0\"", Program.config_timer_user_name, Program.config_timer_value).execute();
							new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/chttpd/port", $"\"5984\"", Program.config_timer_user_name, Program.config_timer_value).execute();


							new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/httpd/enable_cors", $"\"true\"", Program.config_timer_user_name, Program.config_timer_value).execute();


							new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/origins", $"\"*\"", Program.config_timer_user_name, Program.config_timer_value).execute();

							new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/credentials", $"\"true\"", Program.config_timer_user_name, Program.config_timer_value).execute();

							new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/headers", $"\"accept, authorization, content-type, origin, referer, cache-control, x-requested-with\"", Program.config_timer_user_name, Program.config_timer_value).execute();

							new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/methods", $"\"GET, PUT, POST, HEAD, DELETE\"", Program.config_timer_user_name, Program.config_timer_value).execute();

							new cURL ("PUT", null, Program.config_couchdb_url + "/_users", null, Program.config_timer_user_name, Program.config_timer_value).execute();
							new cURL ("PUT", null, Program.config_couchdb_url + "/_replicator", null, Program.config_timer_user_name, Program.config_timer_value).execute();
							new cURL ("PUT", null, Program.config_couchdb_url + "/_global_changes", null, Program.config_timer_user_name, Program.config_timer_value).execute();
					}
					catch(Exception ex)
					{
						Console.WriteLine($"Failed configuration \n{ex}");
					}
				}
				Console.WriteLine($"Starup/Install Check - end {System.DateTime.Now}");
                break;
            }
        }


		bool url_endpoint_exists (string p_target_server, string p_user_name, string p_password, string p_method = "HEAD")
        {
            System.Net.HttpStatusCode response_result;

            try
            {
                //Creating the HttpWebRequest
                System.Net.HttpWebRequest request = System.Net.WebRequest.Create(p_target_server) as System.Net.HttpWebRequest;
                //Setting the Request method HEAD, you can also use GET too.

                if(request == null)
                {
                    return false;
                }
                
                request.Method = p_method;

                if (!string.IsNullOrWhiteSpace(p_user_name) && !string.IsNullOrWhiteSpace(p_password))
                {
                    string encoded = System.Convert.ToBase64String(System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(p_user_name + ":" + p_password));
                    request.Headers.Add("Authorization", "Basic " + encoded);
                }

                //Getting the Web Response.
                System.Net.HttpWebResponse response = request.GetResponse() as System.Net.HttpWebResponse;
                //Returns TRUE if the Status code == 200
                if(response != null)
                {
                    response_result = response.StatusCode;
                    response.Close();
                    return (response_result == System.Net.HttpStatusCode.OK);
                }
                else
                {
                    return false;
                }
                
            }
            catch (Exception ex) 
            {
                //Log.Information ($"failed end_point exists check: {p_target_server}\n{ex}");
                Console.WriteLine($"failed end_point exists check: {p_target_server}");
                return false;
            }            
		}

    }
}