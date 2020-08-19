using System;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using mmria.server.model.actor;

namespace mmria.server.model.actor.quartz
{
   
    public class Process_Central_Pull_list : UntypedActor
    {
        private static bool Test_has_run = false;
        //protected override void PreStart() => Console.WriteLine("Rebuild_Export_Queue started");
        //protected override void PostStop() => Console.WriteLine("Rebuild_Export_Queue stopped");

        protected override void OnReceive(object message)
        {
             

             Console.WriteLine($"Rebuild_Export_Queue Baby {System.DateTime.Now}");

            
            switch (message)
            {
                case ScheduleInfoMessage scheduleInfo:

/*  */  

                    var midnight_timespan = new TimeSpan(0, 0, 0);
                    var difference = DateTime.Now - midnight_timespan;
                    if(difference.Hour != 0 && difference.Minute != 0)
                    {
                        break;
                    }
                

                    if 
                    (
                        //!Test_has_run &&
                        !string.IsNullOrWhiteSpace(Program.config_cdc_instance_pull_db_url) &&
                        !string.IsNullOrWhiteSpace(Program.config_cdc_instance_pull_list)
                    )
                    {
                        Test_has_run = true;

                        var pre_db_server_url = Program.config_cdc_instance_pull_db_url;
                        var config_cdc_instance_pull_list = Program.config_cdc_instance_pull_list;

                        var cdc_instance_pull = config_cdc_instance_pull_list.Split(",");

                        for (var i = 0; i < cdc_instance_pull.Length; i++)
                        {
                            var db_name_split = cdc_instance_pull[i].Split("/");
                            if(db_name_split.Length > 1)
                            {

                                var instance_name = db_name_split[0];
                                var db_name = db_name_split[1];
                                var db_server_url = pre_db_server_url.Replace("{prefix}", instance_name);

                                string url = $"{db_server_url}/{db_name}/_all_docs?include_docs=true";
                                var case_curl = new cURL("GET", null, url, null, Program.config_timer_user_name, Program.config_timer_value);
                                string responseFromServer = case_curl.execute();
                                var case_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<System.Dynamic.ExpandoObject>>(responseFromServer);

                                Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
                                settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;

                                foreach(var case_response_item in case_response.rows)
                                {
                                    var case_item = case_response_item.doc as IDictionary<string,object>;

                                    string _id = "";

                                    if (case_item.ContainsKey ("_id")) 
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

                                    var  target_url = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/{_id}";

                                    var document_json = Newtonsoft.Json.JsonConvert.SerializeObject(case_item);
                                    var de_identified_json = new mmria.server.util.c_cdc_de_identifier(document_json).executeAsync().GetAwaiter().GetResult();
                                    
                                    var de_identified_case = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(de_identified_json);

                                    var de_identified_dictionary = de_identified_case as IDictionary<string,object>;

                                    var revision = get_revision(target_url).GetAwaiter().GetResult();
                                    if(!string.IsNullOrWhiteSpace(revision))
                                    {
                                        de_identified_dictionary["_rev"] = revision;
                                    }                                    
                                    
                                    var save_json = document_json = Newtonsoft.Json.JsonConvert.SerializeObject(de_identified_dictionary);

                                    var put_result_string = Put_Document(save_json, _id, target_url, Program.config_timer_user_name, Program.config_timer_value).GetAwaiter().GetResult();

                                    var result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(put_result_string);

                                    if(result.ok)
                                    {
                                        var Sync_Document_Message = new mmria.server.model.actor.Sync_Document_Message
                                        (
                                            _id,
                                            de_identified_json
                                        );

                                        Context.ActorOf(Props.Create<mmria.server.model.actor.Synchronize_Case>()).Tell(Sync_Document_Message);
                                    }

                                }
                            }
                        }
                    }



/*

                    try 
                    {
                        Program.ResumeSchedule (); 
                    }
                    catch (Exception ex) 
                    {
                        System.Console.WriteLine ($"rebuild_queue_job. error resuming schedule\n{ex}");
                    }
 */

                    
                    break;
            }

            Context.Stop(this.Self);
        }

        private static bool url_endpoint_exists (string p_target_server, string p_user_name, string p_value, string p_method = "HEAD")
        {
            bool result = false;

            var curl = new cURL (p_method, null, p_target_server, null, p_user_name, p_value);
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
            catch (Exception ex) 
            {
                // do nothing for now
            }


            return result;
        }

        private async System.Threading.Tasks.Task<string> Put_Document (string p_document_json, string p_id, string p_database_url, string p_user_name, string p_user_value)
		{
			string result = null;
			cURL document_curl = new cURL ("PUT", null, p_database_url, p_document_json, p_user_name, p_user_value);
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

		private async System.Threading.Tasks.Task<string> get_revision(string p_document_url)
		{

			string result = null;

			var document_curl = new cURL("GET", null, p_document_url, null, Program.config_timer_user_name, Program.config_timer_value);
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
}