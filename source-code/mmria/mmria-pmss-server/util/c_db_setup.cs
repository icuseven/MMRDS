using System;
using System.Collections.Generic;
using Serilog;
using Serilog.Configuration;
using System.Threading.Tasks;
using Akka.Actor;

namespace mmria.pmss.server.utils;

public sealed class c_db_setup
{
    private ActorSystem _actorSystem;

    public c_db_setup(ActorSystem actorSystem)
    {
        _actorSystem = actorSystem;
    }


    public async Task Setup()
    {
        string current_directory = AppContext.BaseDirectory;
        if(!System.IO.Directory.Exists(System.IO.Path.Combine(current_directory, "database-scripts")))
        {
            current_directory = System.IO.Directory.GetCurrentDirectory();
        }

        bool is_able_to_connect = false;
        try 
        {
            if (await url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_value, "GET"))
            {
                is_able_to_connect = true;
            }
        } 
        catch (Exception) 
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
            !Program.config_timer_value.Equals ("couchdb_admin_password", StringComparison.OrdinalIgnoreCase) &&
            !await url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_value, "GET")
        )
        {

            try
            {
                    await new cURL ("PUT", null, Program.config_couchdb_url + $"/_node/nonode@nohost/_config/admins/{Program.config_timer_user_name}", $"\"{Program.config_timer_value}\"", null, null).executeAsync();

                //await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/mmria_section/app_version", $"\"{Program.config_app_version}\"", Program.config_timer_user_name, Program.config_timer_password).executeAsync();


                    await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/couch_httpd_auth/allow_persistent_cookies", $"\"true\"", Program.config_timer_user_name, Program.config_timer_value).executeAsync();


                    await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/chttpd/bind_address", $"\"0.0.0.0\"", Program.config_timer_user_name, Program.config_timer_value).executeAsync();
                    await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/chttpd/port", $"\"5984\"", Program.config_timer_user_name, Program.config_timer_value).executeAsync();


                    await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/httpd/enable_cors", $"\"true\"", Program.config_timer_user_name, Program.config_timer_value).executeAsync();


                    await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/origins", $"\"*\"", Program.config_timer_user_name, Program.config_timer_value).executeAsync();

                    await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/credentials", $"\"true\"", Program.config_timer_user_name, Program.config_timer_value).executeAsync();

                    await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/headers", $"\"accept, authorization, content-type, origin, referer, cache-control, x-requested-with\"", Program.config_timer_user_name, Program.config_timer_value).executeAsync();

                    await new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/methods", $"\"GET, PUT, POST, HEAD, DELETE\"", Program.config_timer_user_name, Program.config_timer_value).executeAsync();

                    await new cURL ("PUT", null, Program.config_couchdb_url + "/_users", null, Program.config_timer_user_name, Program.config_timer_value).executeAsync();
                    await new cURL ("PUT", null, Program.config_couchdb_url + "/_replicator", null, Program.config_timer_user_name, Program.config_timer_value).executeAsync();
                    await new cURL ("PUT", null, Program.config_couchdb_url + "/_global_changes", null, Program.config_timer_user_name, Program.config_timer_value).executeAsync();
            }
            catch(Exception ex)
            {
                Log.Information($"Failed configuration \n{ex}");
            }
        }
        Log.Information("Starup/Install Check - end");


        if (

            await url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_value, "GET") //&&
            //Verify_Password (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password)
        ) 
        {
            Log.Information("DB Repair Check - start");

            await c_db_setup.UpdateMetadata(current_directory);
            await c_db_setup.UpdateJurisdiction(current_directory);

            if (!await url_endpoint_exists (Program.config_couchdb_url + $"/{Program.db_prefix}mmrds", Program.config_timer_user_name, Program.config_timer_value)) 
            {
                var mmrds_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}mmrds", null, Program.config_timer_user_name, Program.config_timer_value);
                Log.Information ("mmrds_curl\n{0}", await mmrds_curl.executeAsync ());

                await new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}mmrds/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\",\"data_analyst\",\"timer\"]}}", Program.config_timer_user_name, Program.config_timer_value).executeAsync ();
                Log.Information ("mmrds/_security completed successfully");


                try 
                {
                    using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/case_design_sortable.json")))
                    {

                        string case_design_sortable = sr.ReadToEnd ();
                        var case_design_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}mmrds/_design/sortable", case_design_sortable, Program.config_timer_user_name, Program.config_timer_value);
                        await case_design_sortable_curl.executeAsync ();
                    }


                    

                    using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/case_store_design_auth.json")))
                    {
                        string case_store_design_auth = await sr.ReadToEndAsync ();
                        var case_store_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}mmrds/_design/auth", case_store_design_auth, Program.config_timer_user_name, Program.config_timer_value);
                        await case_store_design_auth_curl.executeAsync ();    
                    }
                    

                    

                }
                catch (Exception ex) 
                {
                    Log.Information ($"unable to configure mmrds database:\n{ex}");
                }
            

            }

            if (!await url_endpoint_exists ($"{Program.config_couchdb_url}/{Program.db_prefix}audit", Program.config_timer_user_name, Program.config_timer_value)) 
            {
                var audit_curl = new cURL ("PUT", null, $"{Program.config_couchdb_url}/{Program.db_prefix}audit", null, Program.config_timer_user_name, Program.config_timer_value);
                Log.Information($"audit_curl\n{ await audit_curl.executeAsync ()}");

                await new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}audit/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\",\"data_analyst\",\"timer\"]}}", Program.config_timer_user_name, Program.config_timer_value).executeAsync ();
                Log.Information($"audit/_security completed successfully");
            }

            if (!await url_endpoint_exists ($"{Program.config_couchdb_url}/{Program.db_prefix}audit/_design/sortable", Program.config_timer_user_name, Program.config_timer_value)) 
            try 
            {
                using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/audit_design_sortable.json")))
                {

                    string audit_design_sortable = sr.ReadToEnd ();
                    var audit_design_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}audit/_design/sortable", audit_design_sortable, Program.config_timer_user_name, Program.config_timer_value);
                    await audit_design_sortable_curl.executeAsync ();
                }
            }               
            catch (Exception ex) 
            {
                Log.Information ($"unable to configure audit_design_sortable in database:\n{ex}");
            }


            if (!await url_endpoint_exists (Program.config_couchdb_url + $"/{Program.db_prefix}session", Program.config_timer_user_name, Program.config_timer_value)) 
            {
                var session_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}session", null, Program.config_timer_user_name, Program.config_timer_value);
                Log.Information ("session_curl\n{0}", await session_curl.executeAsync ());

                await new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}session/_security", "{\"admins\":{\"names\":[],\"roles\":[\"_admin\"]},\"members\":{\"names\":[],\"roles\":[\"_admin\"]}}", Program.config_timer_user_name, Program.config_timer_value).executeAsync ();
                Log.Information ("session/_security completed successfully");


                try 
                {
                    

                    using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/session_design_session_event_sortable.json")))
                    {
                        string session_design_session_event_sortable = await sr.ReadToEndAsync ();
                        var session_design_session_event_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}session/_design/session_event_sortable", session_design_session_event_sortable, Program.config_timer_user_name, Program.config_timer_value);
                        await session_design_session_event_sortable_curl.executeAsync ();                            
                    }
                    

                    using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/session_design_session_sortable.json")))
                    {
                        string session_design_session_sortable = await sr.ReadToEndAsync ();
                        var session_design_session_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}session/_design/session_sortable", session_design_session_sortable, Program.config_timer_user_name, Program.config_timer_value);
                        await session_design_session_sortable_curl.executeAsync ();    
                    }
                    

                }
                catch (Exception ex) 
                {
                    Log.Information ($"unable to configure mmrds database:\n{ex}");
                }
            

            }




            if 
            (
                await url_endpoint_exists (Program.config_couchdb_url + $"/{Program.db_prefix}export_queue", Program.config_timer_user_name, Program.config_timer_value)
            ) 
            {
                var delete_queue_curl = new cURL ("DELETE", null, Program.config_couchdb_url + $"/{Program.db_prefix}export_queue", null, Program.config_timer_user_name, Program.config_timer_value);
                Log.Information (await delete_queue_curl.executeAsync ());
            }

            try 
            {
                string export_directory =  CleanPath.execute(Program.config_export_directory);

                if (System.IO.Directory.Exists (export_directory)) 
                {
                    RecursiveDirectoryDelete (new System.IO.DirectoryInfo (export_directory));
                }

                System.IO.Directory.CreateDirectory (export_directory);


            } 
            catch (Exception) 
            {
                // do nothing for now
            }

            Log.Information ("Creating export_queue db.");
            var export_queue_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}export_queue", null, Program.config_timer_user_name, Program.config_timer_value);
            Log.Information (await export_queue_curl.executeAsync ());
            await new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}export_queue/_security", "{\"admins\":{\"names\":[],\"roles\":[\"abstractor\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\"]}}", Program.config_timer_user_name, Program.config_timer_value).executeAsync ();


            if
            (
                await url_endpoint_exists (Program.config_couchdb_url + "/metadata", Program.config_timer_user_name, Program.config_timer_value) &&
                await url_endpoint_exists (Program.config_couchdb_url + $"/{Program.db_prefix}mmrds", Program.config_timer_user_name, Program.config_timer_value)
            ) 
            {
                var sync_curl = new cURL ("GET", null, Program.config_couchdb_url + $"/{Program.db_prefix}mmrds/_changes", null, Program.config_timer_user_name, Program.config_timer_value);
                string res = await sync_curl.executeAsync ();
                mmria.pmss.server.model.couchdb.c_change_result latest_change_set = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.pmss.server.model.couchdb.c_change_result> (res);

                Program.Last_Change_Sequence = latest_change_set.last_seq;



                var Sync_All_Documents_Message = new mmria.pmss.server.model.actor.Sync_All_Documents_Message
                (
                    DateTime.Now
                );

                _actorSystem.ActorOf(Props.Create<mmria.pmss.server.model.actor.Synchronize_Case>()).Tell(Sync_All_Documents_Message);


                //new System.Threading.Thread(() => 
                //{

                    //System.Threading.Thread.CurrentThread.IsBackground = true;
                    /*
                    var Process_All_Migrations_Message = new mmria.pmss.server.model.actor.quartz.Process_Initial_Migrations_Message
                    (
                        DateTime.Now
                    );

                    _actorSystem.ActorOf(Props.Create<mmria.pmss.server.model.actor.quartz.Process_Migrate_Data>()).Tell(Process_All_Migrations_Message);
                    */
                    //_actorSystem.ActorSelection("akka://mmria-actor-system/user/Process_Migrate_Data").Tell(Process_All_Migrations_Message);
                //});

            }
    
            Log.Information("DB Repair Check - end");
        }
    }


    public static async Task<IDictionary<string, string>> UpdateJurisdiction(string current_directory)
    {
        IDictionary<string, string>  result = new Dictionary<string,string>();

        if (!await url_endpoint_exists (Program.config_couchdb_url + $"/{Program.db_prefix}jurisdiction", Program.config_timer_user_name, Program.config_timer_value)) 
        {
            try 
            {
                var jurisdiction_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}jurisdiction", null, Program.config_timer_user_name, Program.config_timer_value);
                Log.Information ("jurisdiction_curl\n{0}", await jurisdiction_curl.executeAsync ());

                await new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}jurisdiction/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\",\"data_analyst\",\"timer\"]}}", Program.config_timer_user_name, Program.config_timer_value).executeAsync ();
                Log.Information ("jurisdiction/_security completed successfully");

                using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/jurisdiction_sortable.json")))
                {
                    string jurisdiction_design_sortable = await sr.ReadToEndAsync ();
                    var jurisdiction_design_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}jurisdiction/_design/sortable", jurisdiction_design_sortable, Program.config_timer_user_name, Program.config_timer_value);
                    await jurisdiction_design_sortable_curl.executeAsync ();
                    Log.Information ("jurisdiction_design_sortable_curl completed successfully");
                }
                
                using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/jurisdiction_design_auth.json")))
                {
                    string jurisdiction_store_design_auth = await sr.ReadToEndAsync ();
                    var jurisdiction_store_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}jurisdiction/_design/auth", jurisdiction_store_design_auth, Program.config_timer_user_name, Program.config_timer_value);
                    await jurisdiction_store_design_auth_curl.executeAsync ();
                }

                Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
                settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                string jurisdiction_tree_json = Newtonsoft.Json.JsonConvert.SerializeObject(new mmria.common.model.couchdb.jurisdiction_tree(), settings);

                var jurisdiction_tree_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}jurisdiction/jurisdiction_tree", jurisdiction_tree_json, Program.config_timer_user_name, Program.config_timer_value);
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
            !await url_endpoint_exists (Program.config_couchdb_url + "/metadata", Program.config_timer_user_name, Program.config_timer_value)
        ) 
        {
            Log.Information ("metadata check start");
            try 
            {

                var metadata_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata", null, Program.config_timer_user_name, Program.config_timer_value);
                Log.Information ("metadata_curl\n{0}", await metadata_curl.executeAsync ());

                await new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[]}}", Program.config_timer_user_name, Program.config_timer_value).executeAsync ();
                Log.Information ("metadata/_security completed successfully");

                using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine(current_directory, "database-scripts/metadata_design_auth.json")))
                {
                    string metadata_design_auth = await sr.ReadToEndAsync ();
                    var metadata_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_design/auth", metadata_design_auth, Program.config_timer_user_name, Program.config_timer_value);
                    await metadata_design_auth_curl.executeAsync ();                        
                }


                using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/metadata.json")))
                {
                    string metadata_json = await sr.ReadToEndAsync (); ;
                    var metadata_json_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z", metadata_json, Program.config_timer_user_name, Program.config_timer_value);
                    
                    var metadata_result_string = await metadata_json_curl.executeAsync ();
                    var metadata_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(metadata_result_string);    
                
                

                    using (var  sr1 = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/MMRIA_calculations.js")))
                    {
                        string metadata_attachment = await sr1.ReadToEndAsync (); ;
                        var metadata_attachement_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z/mmria-check-code.js", metadata_attachment, Program.config_timer_user_name, Program.config_timer_value);
                        metadata_attachement_curl.AddHeader("If-Match",  metadata_result.rev);

                        metadata_result_string = await metadata_attachement_curl.executeAsync ();
                        metadata_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(metadata_result_string);
    
                    }

                    using (var  sr1 = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/validator.js")))
                    {
                        var metadata_attachment = await sr1.ReadToEndAsync (); 
                        var mmria_check_code_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z/validator.js", metadata_attachment, Program.config_timer_user_name, Program.config_timer_value);
                        mmria_check_code_curl.AddHeader("If-Match",  metadata_result.rev);
                        Log.Information($"{await mmria_check_code_curl.executeAsync ()}");

                    }
                }
                
                using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/migration_plan_sortable.json")))
                {
                    string migration_plan_sortable = await sr.ReadToEndAsync ();
                    var migration_plan_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_design/sortable", migration_plan_sortable, Program.config_timer_user_name, Program.config_timer_value);
                }

                using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/default-ui-specification.json")))
                {
                    string default_ui_specification_json = await sr.ReadToEndAsync ();
                    var default_ui_specification_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/default_ui_specification", default_ui_specification_json, Program.config_timer_user_name, Program.config_timer_value);
                    //var default_ui_specification_result_string = 
                    string default_ui_specification_curl_result = await default_ui_specification_curl.executeAsync ();
                    default_ui_specification_curl_result = null;
                }
            



            }
            catch (Exception ex) 
            {
                Log.Information ($"unable to configure metadata:\n{ex}");
                result.Add("metadata",ex.ToString());
            }

            Log.Information ("metadata check End");

        }
            
        var migration_plan_directory_files =  System.IO.Directory.GetFiles(System.IO.Path.Combine (current_directory, "database-scripts/migration-plan-set"));
        foreach(var file_path in migration_plan_directory_files)
        {
            var file_info = new System.IO.FileInfo(file_path);

            var id = file_info.Name.Replace(".json","");
            Log.Information ("migration plan check: " + id);
            if
            (
                !await url_endpoint_exists (Program.config_couchdb_url + "/metadata/" + id, Program.config_timer_user_name, Program.config_timer_value)
            ) 
            {
                
                try 
                {


                    using (var  sr = new System.IO.StreamReader(file_path))
                    {
                        string migration_plan = await sr.ReadToEndAsync (); ;
                        var migration_plan_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/" + file_info.Name.Replace(".json",""), migration_plan, Program.config_timer_user_name, Program.config_timer_value);
                        string migration_plan_curl_result = await migration_plan_curl.executeAsync ();
                        migration_plan_curl_result = null;
                        
                    }
                    

                }
                catch (Exception ex) 
                {
                    Log.Information ($"unable to configure migration plan:\n{ex}");
                    result.Add("migration plan",ex.ToString());
                }
            }
        }

        if
        (
            !await url_endpoint_exists (Program.config_couchdb_url + "/metadata/de-identified-list", Program.config_timer_user_name, Program.config_timer_value)
        ) 
        {
            try 
            {
                using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/de-identified-list.json")))
                {
                    string de_identified_list_json = await sr.ReadToEndAsync ();
                    var de_identified_list_json_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/de-identified-list", de_identified_list_json, Program.config_timer_user_name, Program.config_timer_value);
                    string de_identified_list_json_curl_result = await de_identified_list_json_curl.executeAsync ();
                    Log.Information($"PUT /metadata/de-identified-list\n{de_identified_list_json_curl_result}");
                    de_identified_list_json_curl_result = null;    
                }
                

            }
            catch (Exception ex) 
            {
                Log.Information ($"unable to configure metadata/de-identified-list:\n{ex}");
                result.Add("metadata",ex.ToString());
            }


        }


        return result;
    }


    static async Task<bool> url_endpoint_exists (string p_target_server, string p_user_name, string p_value, string p_method = "HEAD")
    {
        System.Net.HttpStatusCode response_result;

        try
        {
            //Creating the HttpWebRequest
            System.Net.HttpWebRequest request = System.Net.WebRequest.Create(p_target_server) as System.Net.HttpWebRequest;
            //Setting the Request method HEAD, you can also use GET too.

            if(request != null)
            {
                request.Method = p_method;

                if (!string.IsNullOrWhiteSpace(p_user_name) && !string.IsNullOrWhiteSpace(p_value))
                {
                    string encoded = System.Convert.ToBase64String(System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(p_user_name + ":" + p_value));
                    request.Headers.Add("Authorization", "Basic " + encoded);
                }

                //Getting the Web Response.
                System.Net.HttpWebResponse response = await request.GetResponseAsync() as System.Net.HttpWebResponse;
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
            return  false;
        }
        catch (Exception) 
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
            var check_document_curl = new cURL ("GET", null, p_couchdb_url, null, Program.config_timer_user_name, Program.config_timer_value);
            string check_document_json = await check_document_curl.executeAsync ();
            var check_document_expando_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (check_document_json);
            IDictionary<string, object> result_dictionary = check_document_expando_object as IDictionary<string, object>;

            if (result_dictionary!= null && result_dictionary.ContainsKey ("_rev")) 
            {
                if(pay_load__dictionary != null)
                {
                    if(pay_load__dictionary.ContainsKey("_rev"))
                    {
                        pay_load__dictionary["_rev"] = result_dictionary ["_rev"];
                    }
                    /*
                    else
                    {
                        pay_load__dictionary["_rev"] = result_dictionary ["_rev"];
                    }
                        */
                    //System.Console.WriteLine ("json\n{0}", object_string);
                }
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

        cURL document_curl = new cURL ("PUT", null, p_couchdb_url, object_string, Program.config_timer_user_name, Program.config_timer_value);

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

