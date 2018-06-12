using System;
using System.Collections.Generic;
using Serilog;
using Serilog.Configuration;

namespace mmria.server.util
{
    public class c_db_setup
    {
        public static async void Setup()
        {
            string current_directory = AppContext.BaseDirectory;
            if(!System.IO.Directory.Exists(System.IO.Path.Combine(current_directory, "database-scripts")))
            {
                current_directory = System.IO.Directory.GetCurrentDirectory();
            }

            bool is_able_to_connect = false;
            try 
            {
                if (url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET"))
                {
                    is_able_to_connect = true;
                }
            } 
            catch (Exception ex) 
            {

            }

            if(!is_able_to_connect)
            {
                Log.Information("Starup pausing for 1 minute to give database a chance to start");
                int milliseconds_in_second = 1000;
                int number_of_seconds = 60;
                int total_milliseconds = number_of_seconds * milliseconds_in_second;

                System.Threading.Thread.Sleep(total_milliseconds);/**/
            }

            Log.Information("Starup/Install Check - start");
            if 
            (
                url_endpoint_exists (Program.config_couchdb_url, null, null, "GET") &&
                    !Program.config_timer_user_name.Equals("couchdb_admin_user_name", StringComparison.OrdinalIgnoreCase) &&
                    !Program.config_timer_password.Equals ("couchdb_admin_password", StringComparison.OrdinalIgnoreCase) &&
                !url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET")
            )
            {

                try
                {
                        new cURL ("PUT", null, Program.config_couchdb_url + $"/_node/nonode@nohost/_config/admins/{Program.config_timer_user_name}", $"\"{Program.config_timer_password}\"", null, null).execute();

                    //new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/mmria_section/app_version", $"\"{Program.config_app_version}\"", Program.config_timer_user_name, Program.config_timer_password).execute();


                        new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/couch_httpd_auth/allow_persistent_cookies", $"\"true\"", Program.config_timer_user_name, Program.config_timer_password).execute();


                        new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/chttpd/bind_address", $"\"0.0.0.0\"", Program.config_timer_user_name, Program.config_timer_password).execute();
                        new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/chttpd/port", $"\"5984\"", Program.config_timer_user_name, Program.config_timer_password).execute();


                        new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/httpd/enable_cors", $"\"true\"", Program.config_timer_user_name, Program.config_timer_password).execute();


                        new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/origins", $"\"*\"", Program.config_timer_user_name, Program.config_timer_password).execute();

                        new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/credentials", $"\"true\"", Program.config_timer_user_name, Program.config_timer_password).execute();

                        new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/headers", $"\"accept, authorization, content-type, origin, referer, cache-control, x-requested-with\"", Program.config_timer_user_name, Program.config_timer_password).execute();

                        new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/methods", $"\"GET, PUT, POST, HEAD, DELETE\"", Program.config_timer_user_name, Program.config_timer_password).execute();

                        new cURL ("PUT", null, Program.config_couchdb_url + "/_users", null, Program.config_timer_user_name, Program.config_timer_password).execute();
                        new cURL ("PUT", null, Program.config_couchdb_url + "/_replicator", null, Program.config_timer_user_name, Program.config_timer_password).execute();
                        new cURL ("PUT", null, Program.config_couchdb_url + "/_global_changes", null, Program.config_timer_user_name, Program.config_timer_password).execute();
                }
                catch(Exception ex)
                {
                    Log.Information($"Failed configuration \n{ex}");
                }
            }
            Log.Information("Starup/Install Check - end");


            if (

                url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET") //&&
                //Verify_Password (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password)
            ) 
            {
                Log.Information("DB Repair Check - start");

                c_db_setup.UpdateMetadata(current_directory);
                c_db_setup.UpdateJurisdiction(current_directory);

                if (!url_endpoint_exists (Program.config_couchdb_url + "/mmrds", Program.config_timer_user_name, Program.config_timer_password)) 
                {
                    var mmrds_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds", null, Program.config_timer_user_name, Program.config_timer_password);
                    Log.Information ("mmrds_curl\n{0}", mmrds_curl.execute ());

                    new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\",\"data_analyst\",\"timer\"]}}", Program.config_timer_user_name, Program.config_timer_password).execute ();
                    Log.Information ("mmrds/_security completed successfully");

                    try 
                    {
                        string case_design_sortable = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/case_design_sortable.json")).ReadToEnd ();
                        var case_design_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_design/sortable", case_design_sortable, Program.config_timer_user_name, Program.config_timer_password);
                        case_design_sortable_curl.execute ();

                        string case_store_design_auth = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/case_store_design_auth.json")).ReadToEnd ();
                        var case_store_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_design/auth", case_store_design_auth, Program.config_timer_user_name, Program.config_timer_password);
                        case_store_design_auth_curl.execute ();

                    }
                    catch (Exception ex) 
                    {
                        Log.Information ($"unable to configure mmrds database:\n{ex}");
                    }
                }




                if 
                (
                    url_endpoint_exists (Program.config_couchdb_url + "/export_queue", Program.config_timer_user_name, Program.config_timer_password)
                ) 
                {
                    var delete_queue_curl = new cURL ("DELETE", null, Program.config_couchdb_url + "/export_queue", null, Program.config_timer_user_name, Program.config_timer_password);
                    Log.Information (delete_queue_curl.execute ());
                }

                try 
                {
                    string export_directory = Program.config_export_directory;

                    if (System.IO.Directory.Exists (export_directory)) 
                    {
                        RecursiveDirectoryDelete (new System.IO.DirectoryInfo (export_directory));
                    }

                    System.IO.Directory.CreateDirectory (export_directory);


                } 
                catch (Exception ex) 
                {
                    // do nothing for now
                }

                Log.Information ("Creating export_queue db.");
                var export_queue_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue", null, Program.config_timer_user_name, Program.config_timer_password);
                Log.Information (export_queue_curl.execute ());
                new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue/_security", "{\"admins\":{\"names\":[],\"roles\":[\"abstractor\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\"]}}", Program.config_timer_user_name, Program.config_timer_password).execute ();


                if
                (
                    url_endpoint_exists (Program.config_couchdb_url + "/metadata", Program.config_timer_user_name, Program.config_timer_password) &&
                    url_endpoint_exists (Program.config_couchdb_url + "/mmrds", Program.config_timer_user_name, Program.config_timer_password)
                ) 
                {
                    var sync_curl = new cURL ("GET", null, Program.config_couchdb_url + "/mmrds/_changes", null, Program.config_timer_user_name, Program.config_timer_password);
                    string res = sync_curl.execute ();
                    mmria.server.model.couchdb.c_change_result latest_change_set = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_change_result> (res);

                    Program.Last_Change_Sequence = latest_change_set.last_seq;

                    
                    await System.Threading.Tasks.Task.Run
                    (
                        new Action (async () => {
                            mmria.server.util.c_document_sync_all sync_all = new mmria.server.util.c_document_sync_all (
                                                                                    Program.config_couchdb_url,
                                                                                    Program.config_timer_user_name,
                                                                                    Program.config_timer_password
                                                                                );

                            sync_all.execute ();
                            //Program.StartSchedule ();
                        })
                    );
                }
        
                Log.Information("DB Repair Check - end");
            }
        }


        public static IDictionary<string, string> UpdateJurisdiction(string current_directory)
        {
            IDictionary<string, string>  result = new Dictionary<string,string>();

            if (!url_endpoint_exists (Program.config_couchdb_url + "/jurisdiction", Program.config_timer_user_name, Program.config_timer_password)) 
            {

                try 
                {
                    var jurisdiction_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/jurisdiction", null, Program.config_timer_user_name, Program.config_timer_password);
                    Log.Information ("jurisdiction_curl\n{0}", jurisdiction_curl.execute ());

                    new cURL ("PUT", null, Program.config_couchdb_url + "/jurisdiction/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\",\"data_analyst\",\"timer\"]}}", Program.config_timer_user_name, Program.config_timer_password).execute ();
                    Log.Information ("jurisdiction/_security completed successfully");

                    string jurisdiction_design_sortable = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/jurisdiction_sortable.json")).ReadToEnd ();
                    var jurisdiction_design_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/jurisdiction/_design/sortable", jurisdiction_design_sortable, Program.config_timer_user_name, Program.config_timer_password);
                    jurisdiction_design_sortable_curl.execute ();
                    Log.Information ("jurisdiction_design_sortable_curl completed successfully");

                    string jurisdiction_store_design_auth = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/jurisdiction_design_auth.json")).ReadToEnd ();
                    var jurisdiction_store_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/jurisdiction/_design/auth", jurisdiction_store_design_auth, Program.config_timer_user_name, Program.config_timer_password);
                    jurisdiction_store_design_auth_curl.execute ();
                    Log.Information ("jurisdiction_store_design_auth completed successfully");

                }
                catch (Exception ex) 
                {
                    result.Add("jurisdiction",ex.ToString());
                    Log.Information ($"unable to configure jurisdiction database:\n{ex}");
                }
            }

            return result;

        }


        public static IDictionary<string, string> UpdateMetadata(string current_directory)
        {
            IDictionary<string, string>  result = new Dictionary<string,string>();

            if
            (
                !url_endpoint_exists (Program.config_couchdb_url + "/metadata", Program.config_timer_user_name, Program.config_timer_password)
            ) 
            {
                Log.Information ("metadata check start");
                try 
                {

                    var metadata_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata", null, Program.config_timer_user_name, Program.config_timer_password);
                    Log.Information ("metadata_curl\n{0}", metadata_curl.execute ());

                    new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[]}}", Program.config_timer_user_name, Program.config_timer_password).execute ();
                    Log.Information ("metadata/_security completed successfully");


                    string metadata_design_auth = System.IO.File.OpenText (System.IO.Path.Combine(current_directory, "database-scripts/metadata_design_auth.json")).ReadToEnd ();
                    var metadata_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_design/auth", metadata_design_auth, Program.config_timer_user_name, Program.config_timer_password);
                    metadata_design_auth_curl.execute ();

                    string metadata_json = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/metadata.json")).ReadToEnd (); ;
                    var metadata_json_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z", metadata_json, Program.config_timer_user_name, Program.config_timer_password);
                    
                    var metadata_result_string = metadata_json_curl.execute ();
                    var metadata_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(metadata_result_string);

                    string metadata_attachment = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/MMRIA_calculations.js")).ReadToEnd (); ;
                    var metadata_attachement_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z/mmria-check-code.js", metadata_attachment, Program.config_timer_user_name, Program.config_timer_password);
                    metadata_attachement_curl.AddHeader("If-Match",  metadata_result.rev);

                    metadata_result_string = metadata_attachement_curl.execute ();
                    metadata_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(metadata_result_string);

                    metadata_attachment = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/mmria-check-code.js")).ReadToEnd (); ;
                    var mmria_check_code_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z/validator.js", metadata_attachment, Program.config_timer_user_name, Program.config_timer_password);
                    mmria_check_code_curl.AddHeader("If-Match",  metadata_result.rev);
                    Log.Information($"{mmria_check_code_curl.execute ()}");

                }
                catch (Exception ex) 
                {
                    Log.Information ($"unable to configure metadata:\n{ex}");
                    result.Add("metadata",ex.ToString());
                }

                Log.Information ("metadata check End");

            }



            if
            (
                !url_endpoint_exists (Program.config_couchdb_url + "/metadata/de-identified-list", Program.config_timer_user_name, Program.config_timer_password)
            ) 
            {
                try 
                {
                    string de_identified_list_json = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/de-identified-list.json")).ReadToEnd (); ;
                    var de_identified_list_json_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/de-identified-list", de_identified_list_json, Program.config_timer_user_name, Program.config_timer_password);
                    Log.Information($"PUT /metadata/de-identified-list\n{de_identified_list_json_curl.execute ()}");

                }
                catch (Exception ex) 
                {
                    Log.Information ($"unable to configure metadata/de-identified-list:\n{ex}");
                    result.Add("metadata",ex.ToString());
                }


            }


            return result;
        }


        static bool url_endpoint_exists (string p_target_server, string p_user_name, string p_password, string p_method = "HEAD")
        {
            //bool result = false;


            try
            {
                //Creating the HttpWebRequest
                System.Net.HttpWebRequest request = System.Net.WebRequest.Create(p_target_server) as System.Net.HttpWebRequest;
                //Setting the Request method HEAD, you can also use GET too.
                request.Method = "HEAD";

                if (!string.IsNullOrWhiteSpace(p_user_name) && !string.IsNullOrWhiteSpace(p_password))
                {
                    string encoded = System.Convert.ToBase64String(System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(p_user_name + ":" + p_password));
                    request.Headers.Add("Authorization", "Basic " + encoded);
                }

                //Getting the Web Response.
                System.Net.HttpWebResponse response = request.GetResponse() as System.Net.HttpWebResponse;
                //Returns TRUE if the Status code == 200
                response.Close();
                return (response.StatusCode ==System.Net.HttpStatusCode.OK);
            }
            catch (Exception ex) 
            {
                //Log.Information ($"failed end_point exists check: {p_target_server}\n{ex}");
                Log.Information ($"failed end_point exists check: {p_target_server}");
                return false;
            }            
/*
            var curl = new cURL (p_method, null, p_target_server, null, p_user_name, p_password);
            try 
            {
                curl.execute ();
                /*
				HTTP/1.1 200 OK
				Cache-Control: must-revalidate
				Content-Type: application/json
				Date: Mon, 12 Aug 2013 01:27:41 GMT
				Server: CouchDB (Erlang/OTP)* /
                result = true;
            } 
            catch (Exception ex) 
            {
               //Log.Information ($"failed end_point exists check: {p_target_server}\n{ex}");
               Log.Information ($"failed end_point exists check: {p_target_server}");
            }
 */

            //return result;
        }

        static void RecursiveDirectoryDelete(System.IO.DirectoryInfo baseDir)
        {
            if (!baseDir.Exists)
                return;

            foreach (var dir in baseDir.EnumerateDirectories())
            {
                RecursiveDirectoryDelete(dir);
            }
            baseDir.Delete(true);
        }
    }
}

