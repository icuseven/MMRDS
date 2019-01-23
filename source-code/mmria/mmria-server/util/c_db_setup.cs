using System;
using System.Collections.Generic;
using Serilog;
using Serilog.Configuration;
using System.Threading.Tasks;

namespace mmria.server.util
{
    public class c_db_setup
    {
        public static async Task Setup()
        {
            string current_directory = AppContext.BaseDirectory;
            if(!System.IO.Directory.Exists(System.IO.Path.Combine(current_directory, "database-scripts")))
            {
                current_directory = System.IO.Directory.GetCurrentDirectory();
            }

            bool is_able_to_connect = false;
            try 
            {
                if (await url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET"))
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
                await url_endpoint_exists (Program.config_couchdb_url, null, null, "GET") &&
                !Program.config_timer_user_name.Equals("couchdb_admin_user_name", StringComparison.OrdinalIgnoreCase) &&
                !Program.config_timer_password.Equals ("couchdb_admin_password", StringComparison.OrdinalIgnoreCase) &&
                !await url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET")
            )
            {

                try
                {
                        await new cURL ("PUT", null, Program.config_couchdb_url + $"/_node/nonode@nohost/_config/admins/{Program.config_timer_user_name}", $"\"{Program.config_timer_password}\"", null, null).executeAsync();

                    //await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/mmria_section/app_version", $"\"{Program.config_app_version}\"", Program.config_timer_user_name, Program.config_timer_password).executeAsync();


                        await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/couch_httpd_auth/allow_persistent_cookies", $"\"true\"", Program.config_timer_user_name, Program.config_timer_password).executeAsync();


                        await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/chttpd/bind_address", $"\"0.0.0.0\"", Program.config_timer_user_name, Program.config_timer_password).executeAsync();
                        await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/chttpd/port", $"\"5984\"", Program.config_timer_user_name, Program.config_timer_password).executeAsync();


                        await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/httpd/enable_cors", $"\"true\"", Program.config_timer_user_name, Program.config_timer_password).executeAsync();


                        await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/origins", $"\"*\"", Program.config_timer_user_name, Program.config_timer_password).executeAsync();

                        await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/credentials", $"\"true\"", Program.config_timer_user_name, Program.config_timer_password).executeAsync();

                        await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/headers", $"\"accept, authorization, content-type, origin, referer, cache-control, x-requested-with\"", Program.config_timer_user_name, Program.config_timer_password).executeAsync();

                        await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/methods", $"\"GET, PUT, POST, HEAD, DELETE\"", Program.config_timer_user_name, Program.config_timer_password).executeAsync();

                        await new cURL ("PUT", null, Program.config_couchdb_url + "/_users", null, Program.config_timer_user_name, Program.config_timer_password).executeAsync();
                        await new cURL ("PUT", null, Program.config_couchdb_url + "/_replicator", null, Program.config_timer_user_name, Program.config_timer_password).executeAsync();
                        await new cURL ("PUT", null, Program.config_couchdb_url + "/_global_changes", null, Program.config_timer_user_name, Program.config_timer_password).executeAsync();
                }
                catch(Exception ex)
                {
                    Log.Information($"Failed configuration \n{ex}");
                }
            }
            Log.Information("Starup/Install Check - end");


            if (

                await url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET") //&&
                //Verify_Password (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password)
            ) 
            {
                Log.Information("DB Repair Check - start");

                await c_db_setup.UpdateMetadata(current_directory);
                await c_db_setup.UpdateJurisdiction(current_directory);

                if (!await url_endpoint_exists (Program.config_couchdb_url + "/mmrds", Program.config_timer_user_name, Program.config_timer_password)) 
                {
                    var mmrds_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds", null, Program.config_timer_user_name, Program.config_timer_password);
                    Log.Information ("mmrds_curl\n{0}", await mmrds_curl.executeAsync ());

                    await new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\",\"data_analyst\",\"timer\"]}}", Program.config_timer_user_name, Program.config_timer_password).executeAsync ();
                    Log.Information ("mmrds/_security completed successfully");


                    try 
                    {
                        string case_design_sortable = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/case_design_sortable.json")).ReadToEnd ();
                        var case_design_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_design/sortable", case_design_sortable, Program.config_timer_user_name, Program.config_timer_password);
                        await case_design_sortable_curl.executeAsync ();

                        //await EnsureUpdate(case_design_sortable, Program.config_couchdb_url + "/mmrds/_design/sortable");

                        string case_store_design_auth = await System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/case_store_design_auth.json")).ReadToEndAsync ();
                        var case_store_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_design/auth", case_store_design_auth, Program.config_timer_user_name, Program.config_timer_password);
                        await case_store_design_auth_curl.executeAsync ();

                        //await EnsureUpdate(case_store_design_auth, Program.config_couchdb_url + "/mmrds/_design/auth");

                    }
                    catch (Exception ex) 
                    {
                        Log.Information ($"unable to configure mmrds database:\n{ex}");
                    }
                

                }



                if (!await url_endpoint_exists (Program.config_couchdb_url + "/session", Program.config_timer_user_name, Program.config_timer_password)) 
                {
                    var session_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/session", null, Program.config_timer_user_name, Program.config_timer_password);
                    Log.Information ("session_curl\n{0}", await session_curl.executeAsync ());

                    await new cURL ("PUT", null, Program.config_couchdb_url + "/session/_security", "{\"admins\":{\"names\":[],\"roles\":[\"_admin\"]},\"members\":{\"names\":[],\"roles\":[\"_admin\"]}}", Program.config_timer_user_name, Program.config_timer_password).executeAsync ();
                    Log.Information ("session/_security completed successfully");


                    try 
                    {
                        
                        /*
                        string session_design_profile_sortable = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/session_design_profile_sortable.json")).ReadToEnd ();
                        var session_design_profile_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/session/_design/profile_sortable", session_design_profile_sortable, Program.config_timer_user_name, Program.config_timer_password);
                        await session_design_profile_sortable_curl.executeAsync ();
                        */
                        //await EnsureUpdate(case_design_sortable, Program.config_couchdb_url + "/mmrds/_design/sortable");

                        string session_design_session_event_sortable = await System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/session_design_session_event_sortable.json")).ReadToEndAsync ();
                        var session_design_session_event_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/session/_design/session_event_sortable", session_design_session_event_sortable, Program.config_timer_user_name, Program.config_timer_password);
                        await session_design_session_event_sortable_curl.executeAsync ();

                        //await EnsureUpdate(case_store_design_auth, Program.config_couchdb_url + "/mmrds/_design/auth");

                    }
                    catch (Exception ex) 
                    {
                        Log.Information ($"unable to configure mmrds database:\n{ex}");
                    }
                

                }




                if 
                (
                    await url_endpoint_exists (Program.config_couchdb_url + "/export_queue", Program.config_timer_user_name, Program.config_timer_password)
                ) 
                {
                    var delete_queue_curl = new cURL ("DELETE", null, Program.config_couchdb_url + "/export_queue", null, Program.config_timer_user_name, Program.config_timer_password);
                    Log.Information (await delete_queue_curl.executeAsync ());
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
                Log.Information (await export_queue_curl.executeAsync ());
                await new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue/_security", "{\"admins\":{\"names\":[],\"roles\":[\"abstractor\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\"]}}", Program.config_timer_user_name, Program.config_timer_password).executeAsync ();


                if
                (
                    await url_endpoint_exists (Program.config_couchdb_url + "/metadata", Program.config_timer_user_name, Program.config_timer_password) &&
                    await url_endpoint_exists (Program.config_couchdb_url + "/mmrds", Program.config_timer_user_name, Program.config_timer_password)
                ) 
                {
                    var sync_curl = new cURL ("GET", null, Program.config_couchdb_url + "/mmrds/_changes", null, Program.config_timer_user_name, Program.config_timer_password);
                    string res = await sync_curl.executeAsync ();
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

                            await sync_all.executeAsync ();
                            //Program.StartSchedule ();
                        })
                    );
                }
        
                Log.Information("DB Repair Check - end");
            }
        }


        public static async Task<IDictionary<string, string>> UpdateJurisdiction(string current_directory)
        {
            IDictionary<string, string>  result = new Dictionary<string,string>();

            if (!await url_endpoint_exists (Program.config_couchdb_url + "/jurisdiction", Program.config_timer_user_name, Program.config_timer_password)) 
            {
                try 
                {
                    var jurisdiction_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/jurisdiction", null, Program.config_timer_user_name, Program.config_timer_password);
                    Log.Information ("jurisdiction_curl\n{0}", await jurisdiction_curl.executeAsync ());

                    await new cURL ("PUT", null, Program.config_couchdb_url + "/jurisdiction/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\",\"data_analyst\",\"timer\"]}}", Program.config_timer_user_name, Program.config_timer_password).executeAsync ();
                    Log.Information ("jurisdiction/_security completed successfully");

                    string jurisdiction_design_sortable = await System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/jurisdiction_sortable.json")).ReadToEndAsync ();
                    var jurisdiction_design_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/jurisdiction/_design/sortable", jurisdiction_design_sortable, Program.config_timer_user_name, Program.config_timer_password);
                    await jurisdiction_design_sortable_curl.executeAsync ();
                    Log.Information ("jurisdiction_design_sortable_curl completed successfully");

                    string jurisdiction_store_design_auth = await System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/jurisdiction_design_auth.json")).ReadToEndAsync ();
                    var jurisdiction_store_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/jurisdiction/_design/auth", jurisdiction_store_design_auth, Program.config_timer_user_name, Program.config_timer_password);
                    await jurisdiction_store_design_auth_curl.executeAsync ();
                    
                    Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
                    settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                    string jurisdiction_tree_json = Newtonsoft.Json.JsonConvert.SerializeObject(new mmria.common.model.couchdb.jurisdiction_tree(), settings);

                    var jurisdiction_tree_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/jurisdiction/jurisdiction_tree", jurisdiction_tree_json, Program.config_timer_user_name, Program.config_timer_password);
                    await jurisdiction_tree_curl.executeAsync ();

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


        public static async Task<IDictionary<string, string>> UpdateMetadata(string current_directory)
        {
            IDictionary<string, string>  result = new Dictionary<string,string>();

            if
            (
                !await url_endpoint_exists (Program.config_couchdb_url + "/metadata", Program.config_timer_user_name, Program.config_timer_password)
            ) 
            {
                Log.Information ("metadata check start");
                try 
                {

                    var metadata_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata", null, Program.config_timer_user_name, Program.config_timer_password);
                    Log.Information ("metadata_curl\n{0}", await metadata_curl.executeAsync ());

                    await new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[]}}", Program.config_timer_user_name, Program.config_timer_password).executeAsync ();
                    Log.Information ("metadata/_security completed successfully");


                    string metadata_design_auth = await System.IO.File.OpenText (System.IO.Path.Combine(current_directory, "database-scripts/metadata_design_auth.json")).ReadToEndAsync ();
                    var metadata_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_design/auth", metadata_design_auth, Program.config_timer_user_name, Program.config_timer_password);
                    await metadata_design_auth_curl.executeAsync ();

                    string metadata_json = await System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/metadata.json")).ReadToEndAsync (); ;
                    var metadata_json_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z", metadata_json, Program.config_timer_user_name, Program.config_timer_password);
                    
                    var metadata_result_string = await metadata_json_curl.executeAsync ();
                    var metadata_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(metadata_result_string);

                    string metadata_attachment = await System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/MMRIA_calculations.js")).ReadToEndAsync (); ;
                    var metadata_attachement_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z/mmria-check-code.js", metadata_attachment, Program.config_timer_user_name, Program.config_timer_password);
                    metadata_attachement_curl.AddHeader("If-Match",  metadata_result.rev);

                    metadata_result_string = await metadata_attachement_curl.executeAsync ();
                    metadata_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(metadata_result_string);

                    metadata_attachment = await System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/validator.js")).ReadToEndAsync (); ;
                    var mmria_check_code_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z/validator.js", metadata_attachment, Program.config_timer_user_name, Program.config_timer_password);
                    mmria_check_code_curl.AddHeader("If-Match",  metadata_result.rev);
                    Log.Information($"{await mmria_check_code_curl.executeAsync ()}");


                    var migration_plan_sortable = await System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/migration_plan_sortable.json")).ReadToEndAsync (); ;
                    var migration_plan_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_design/sortable", migration_plan_sortable, Program.config_timer_user_name, Program.config_timer_password);


                    var migration_plan_directory_files =  System.IO.Directory.GetFiles(System.IO.Path.Combine (current_directory, "database-scripts/migration-plan-set"));
                    foreach(var file_path in migration_plan_directory_files)
                    {
                        var file_info = new System.IO.FileInfo(file_path);
                        var migration_plan = await System.IO.File.OpenText (file_path).ReadToEndAsync (); ;
                        var migration_plan_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/" + file_info.Name.Replace(".json",""), migration_plan, Program.config_timer_user_name, Program.config_timer_password);
                        var migration_plan_result_string = await migration_plan_curl.executeAsync ();
                    }
                    
                    

                    


                    var default_ui_specification_json = await System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/default-ui-specification.json")).ReadToEndAsync (); ;
                    var default_ui_specification_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/default_ui_specification", default_ui_specification_json, Program.config_timer_user_name, Program.config_timer_password);
                    var default_ui_specification_result_string = await default_ui_specification_curl.executeAsync ();





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
                !await url_endpoint_exists (Program.config_couchdb_url + "/metadata/de-identified-list", Program.config_timer_user_name, Program.config_timer_password)
            ) 
            {
                try 
                {
                    string de_identified_list_json = await System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/de-identified-list.json")).ReadToEndAsync (); ;
                    var de_identified_list_json_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/de-identified-list", de_identified_list_json, Program.config_timer_user_name, Program.config_timer_password);
                    Log.Information($"PUT /metadata/de-identified-list\n{await de_identified_list_json_curl.executeAsync ()}");

                }
                catch (Exception ex) 
                {
                    Log.Information ($"unable to configure metadata/de-identified-list:\n{ex}");
                    result.Add("metadata",ex.ToString());
                }


            }


            return result;
        }


        static async Task<bool> url_endpoint_exists (string p_target_server, string p_user_name, string p_password, string p_method = "HEAD")
        {
            System.Net.HttpStatusCode response_result;

            try
            {
                //Creating the HttpWebRequest
                System.Net.HttpWebRequest request = System.Net.WebRequest.Create(p_target_server) as System.Net.HttpWebRequest;
                //Setting the Request method HEAD, you can also use GET too.
                request.Method = p_method;

                if (!string.IsNullOrWhiteSpace(p_user_name) && !string.IsNullOrWhiteSpace(p_password))
                {
                    string encoded = System.Convert.ToBase64String(System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(p_user_name + ":" + p_password));
                    request.Headers.Add("Authorization", "Basic " + encoded);
                }

                //Getting the Web Response.
                System.Net.HttpWebResponse response = await request.GetResponseAsync() as System.Net.HttpWebResponse;
                //Returns TRUE if the Status code == 200
                response_result = response.StatusCode;
                response.Close();
                return (response_result == System.Net.HttpStatusCode.OK);
            }
            catch (Exception ex) 
            {
                //Log.Information ($"failed end_point exists check: {p_target_server}\n{ex}");
                Log.Information ($"failed end_point exists check: {p_target_server}");
                return false;
            }            
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


        static async Task<mmria.common.model.couchdb.document_put_response> EnsureUpdate(string p_pay_load_json, string p_couchdb_url)
        {
            mmria.common.model.couchdb.document_put_response result = null;

            var pay_load_expando_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (p_pay_load_json);
            var pay_load__dictionary = pay_load_expando_object as IDictionary<string, object>;

            // begin - check if doc exists
            try 
            {
                var check_document_curl = new cURL ("GET", null, p_couchdb_url, null, Program.config_timer_user_name, Program.config_timer_password);
                string check_document_json = await check_document_curl.executeAsync ();
                var check_document_expando_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (check_document_json);
                IDictionary<string, object> result_dictionary = check_document_expando_object as IDictionary<string, object>;

                if (result_dictionary.ContainsKey ("_rev")) 
                {
                    pay_load__dictionary["_rev"] = result_dictionary ["_rev"];
                    //System.Console.WriteLine ("json\n{0}", object_string);
                }


            } 
            catch (Exception ex) 
            {
                // do nothing for now document doesn't exsist.
                System.Console.WriteLine ($"err caseController.Post\n{ex}");
            }

            // end - check if doc exists
            Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
            settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            string object_string = Newtonsoft.Json.JsonConvert.SerializeObject(pay_load_expando_object, settings);

            cURL document_curl = new cURL ("PUT", null, p_couchdb_url, object_string, Program.config_timer_user_name, Program.config_timer_password);

            try
            {
                string responseFromServer = await document_curl.executeAsync();
                result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }

            return result;
        }

    }
}

