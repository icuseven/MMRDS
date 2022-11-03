using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace mmria.services.populate_cdc_instance;

public sealed class PopulateCDCInstance : ReceiveActor
{

    public record class Status(string Name, string Description);


    IConfiguration configuration;
    ILogger logger;

    protected override void PreStart() => Console.WriteLine("Process_Message started");
    protected override void PostStop() => Console.WriteLine("Process_Message stopped");
    public PopulateCDCInstance()
    {
        Become(Waiting);
    }

    void Processing()
    {
        Receive<mmria.common.metadata.Populate_CDC_Instance>(message =>
        {
            // discard message;
        });
    }

    void Waiting()
    {
        Receive<mmria.common.metadata.Populate_CDC_Instance>(message =>
        {
            Become(Processing);
            Process_Message(message);
        });
    }


    private async Task Process_Message(mmria.common.metadata.Populate_CDC_Instance message)
    {
        try
        {

             mmria.common.couchdb.ConfigurationSet db_config_set = mmria.services.vitalsimport.Program.DbConfigSet;

             if(!db_config_set.detail_list.ContainsKey("cdc"))
             {
                throw new Exception(@"Exception: db_config_set.detail_list.key missing for cdc");
             }

             if(!db_config_set.name_value.ContainsKey("metadata_version"))
             {
                throw new Exception(@"Exception: db_config_set.name_value_key missing for metadata_version");
             }

             string metadata_release_version_name = db_config_set.name_value["metadata_version"];

             var cdc_connection = db_config_set.detail_list["cdc"];

             var cdc_db_url = $"{cdc_connection.url}/mmrds";

            
            var delete_mmrds_curl = new mmria.getset.cURL ("DELETE", null, cdc_db_url, null, cdc_connection.user_name, cdc_connection.user_value);
            await delete_mmrds_curl.executeAsync();

            string current_directory = AppContext.BaseDirectory;

            var mmrds_curl = new mmria.getset.cURL ("PUT", null, cdc_db_url, null, cdc_connection.user_name, cdc_connection.user_value);
            System.Console.WriteLine("mmrds_curl\n{0}", mmrds_curl.executeAsync ().GetAwaiter().GetResult());

            await new mmria.getset.cURL ("PUT", null, $"{cdc_db_url}/{cdc_connection.prefix}mmrds/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\",\"data_analyst\",\"timer\"]}}", cdc_connection.user_name, cdc_connection.user_value).executeAsync ();
            System.Console.WriteLine("mmrds/_security completed successfully");

            try 
            {
                using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/case_design_sortable.json")))
                {

                    string case_design_sortable = sr.ReadToEnd ();
                    var case_design_sortable_curl = new mmria.getset.cURL ("PUT", null, $"{cdc_connection.url}/{cdc_connection.prefix}mmrds/_design/sortable", case_design_sortable, cdc_connection.user_name, cdc_connection.user_value);
                    case_design_sortable_curl.executeAsync ().GetAwaiter().GetResult();
                }

                using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/case_store_design_auth.json")))
                {
                    string case_store_design_auth = sr.ReadToEndAsync ().GetAwaiter().GetResult();
                    var case_store_design_auth_curl = new mmria.getset.cURL ("PUT", null, $"{cdc_connection.url}/{cdc_connection.prefix}mmrds/_design/auth", case_store_design_auth, cdc_connection.user_name, cdc_connection.user_value);
                    case_store_design_auth_curl.executeAsync ().GetAwaiter().GetResult();    
                }
                                                
            }
            catch (Exception ex) 
            {
                System.Console.WriteLine($"unable to configure mmrds database:\n{ex}");
            }

            try
            {

                var delete_de_id_curl = new mmria.getset.cURL ("DELETE", null, $"{cdc_connection.url}/{cdc_connection.prefix}de_id", null, cdc_connection.user_name, cdc_connection.user_value);
                delete_de_id_curl.execute();
            }
            catch (Exception)
            {
            
            }
            

            try
            {
                var delete_report_curl = new mmria.getset.cURL ("DELETE", null, $"{cdc_connection.url}/{cdc_connection.prefix}report", null, cdc_connection.user_name, cdc_connection.user_value);
                delete_report_curl.execute();
            }
            catch (Exception)
            {
            
            }


            try
            {
                var create_de_id_curl = new mmria.getset.cURL ("PUT", null, $"{cdc_connection.url}/{cdc_connection.prefix}de_id", null, cdc_connection.user_name, cdc_connection.user_value);
                create_de_id_curl.execute();
            }
            catch (Exception)
            {
            
            }

            try 
            {
                
                //string current_directory = AppContext.BaseDirectory;
                if(!System.IO.Directory.Exists(System.IO.Path.Combine(current_directory, "database-scripts")))
                {
                    current_directory = System.IO.Directory.GetCurrentDirectory();
                }

                using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine( current_directory,  "database-scripts/case_design_sortable.json")))
                {
                    string result = sr.ReadToEnd();
                    var create_de_id_curl = new mmria.getset.cURL ("PUT", null, $"{cdc_connection.url}/{cdc_connection.prefix}de_id/_design/sortable", result, cdc_connection.user_name, cdc_connection.user_value);
                    create_de_id_curl.execute();					
                }


            } 
            catch (Exception) 
            {

            }



            try
            {
                var create_report_curl = new mmria.getset.cURL ("PUT", null, $"{cdc_connection.url}/{cdc_connection.prefix}report", null, cdc_connection.user_name, cdc_connection.user_value);
                create_report_curl.execute();	
            }
            catch (Exception)
            {
            
            }


            try
            {
                var Report_Opioid_Index = new mmria.server.utils.c_document_sync_all.Report_Opioid_Index_Struct();
                string index_json = Newtonsoft.Json.JsonConvert.SerializeObject (Report_Opioid_Index);
                var create_report_index_curl = new mmria.getset.cURL ("POST", null, $"{cdc_connection.url}/{cdc_connection.prefix}report/_index", index_json, cdc_connection.user_name, cdc_connection.user_value);
                create_report_index_curl.execute();
            }
            catch (Exception)
            {
            
            }


                        
            for (var i = 0; i < message.state_list.Count; i++)
            {

                if(message.state_list[i].is_included == false) continue;
                var instance_name = message.state_list[i].prefix;
                try
                {
                    if(db_config_set.detail_list.ContainsKey(instance_name))
                    {
                        var db_info = db_config_set.detail_list[instance_name];

                        string url = $"{db_info.url}/{db_info.prefix}mmrds/_all_docs?include_docs=true";
                        var case_curl = new mmria.getset.cURL("GET", null, url, null, db_info.user_name, db_info.user_value);
                        string responseFromServer = case_curl.execute();
                        var case_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<System.Dynamic.ExpandoObject>>(responseFromServer);

                        Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
                        settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;

                        foreach(var case_response_item in case_response.rows)
                        {
                            var case_item = case_response_item.doc as IDictionary<string,object>;

                            string _id = "";

                            if(case_item == null)
                            {
                                continue;
                            }
                            else if (case_item.ContainsKey ("_id")) 
                            {
                                _id = case_item ["_id"].ToString();
                            }
                            else
                            {
                                continue;
                            }

                            if (_id.IndexOf ("_design/") > -1)
                            {
                                continue;
                            }

                            var  target_url = $"{cdc_connection.url}/{cdc_connection.prefix}mmrds/{_id}";

                            var document_json = Newtonsoft.Json.JsonConvert.SerializeObject(case_item);
                            var de_identified_json = new mmria.server.utils.c_cdc_de_identifier(document_json, instance_name, cdc_connection, metadata_release_version_name).executeAsync().GetAwaiter().GetResult();
                            
                            var de_identified_case = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(de_identified_json);

                            var de_identified_dictionary = de_identified_case as IDictionary<string,object>;

                            if(de_identified_dictionary == null)
                            {
                                continue;
                            }
                            
                            var revision = await get_revision(target_url, cdc_connection);
                            if(!string.IsNullOrWhiteSpace(revision))
                            {
                                de_identified_dictionary["_rev"] = revision;
                            }                                    
                            
                            var save_json = document_json = Newtonsoft.Json.JsonConvert.SerializeObject(de_identified_dictionary);

                            var put_result_string = Put_Document(save_json, _id, target_url, cdc_connection.user_name, cdc_connection.user_value).GetAwaiter().GetResult();

                            var result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(put_result_string);

                            if(result.ok)
                            {
                                var Sync_Document_Message = new mmria.server.model.actor.Sync_Document_Message
                                (
                                    _id,
                                    de_identified_json,
                                    cdc_connection,
                                    metadata_release_version_name
                                );

                                Context.ActorOf(Props.Create<mmria.server.model.actor.Synchronize_Case>()).Tell(Sync_Document_Message);
                            }

                        }
                    }
                }
                catch(Exception ex)
                {
                    Console.WriteLine($"Problem pulling instance:{instance_name}");
                    Console.WriteLine(ex);
                }
                
            }


            Sender.Tell(new Status("Finished", ""));
        }
        catch(Exception ex)
        {
            Sender.Tell(new Status("Error", ex.Message));
        }
        


         Context.Stop(this.Self);

    }




    private static bool url_endpoint_exists (string p_target_server, string p_user_name, string p_value, string p_method = "HEAD")
    {
        bool result = false;

        var curl = new mmria.getset.cURL (p_method, null, p_target_server, null, p_user_name, p_value);
        try 
        {
            curl.execute ();
            /*
            HTTP/1.1 200 OK
            Cache-Control: must-revalidate
            Content-Type: application/json
            Date: Mon, 12 Aug 2013 01:27:41 GMT
            Server: CouchDB (Erlang/OTP)*/
            result = true;
        } 
        catch (Exception) 
        {
            // do nothing for now
        }


        return result;
    }

    private async System.Threading.Tasks.Task<string> PostCommand (string p_database_url, string p_user_name, string p_user_value)
    {
        string result = null;
        var document_curl = new mmria.getset.cURL ("POST", null, p_database_url, null, p_user_name, p_user_value);
        try
        {
            result = await document_curl.executeAsync();
        }
        catch (Exception ex)
        {
            result = ex.ToString ();
        }
        return result;
    }

    private async System.Threading.Tasks.Task<string> Put_Document (string p_document_json, string p_id, string p_database_url, string p_user_name, string p_user_value)
    {
        string result = null;
        var document_curl = new mmria.getset.cURL ("PUT", null, p_database_url, p_document_json, p_user_name, p_user_value);
        try
        {
            result = await document_curl.executeAsync();
        }
        catch (Exception ex)
        {
            result = ex.ToString ();
        }
        return result;
    }

    private async System.Threading.Tasks.Task<string> get_revision(string p_document_url, common.couchdb.DBConfigurationDetail p_connection)
    {

        string result = null;

        var document_curl = new mmria.getset.cURL("GET", null, p_document_url, null, p_connection.user_name, p_connection.user_value);
        string temp_document_json = null;

        try
        {
            
            temp_document_json = await document_curl.executeAsync();
            var request_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(temp_document_json);
            IDictionary<string, object> updater = request_result as IDictionary<string, object>;
            if(updater != null && updater.ContainsKey("_rev"))
            {
                result = updater ["_rev"].ToString ();
            }
        }
        catch(Exception ex) 
        {
            if (!(ex.Message.IndexOf ("(404) Object Not Found") > -1)) 
            {
                //System.Console.WriteLine ("c_sync_document.get_revision");
                //System.Console.WriteLine (ex);
            }
        }

        return result;
    }

}


