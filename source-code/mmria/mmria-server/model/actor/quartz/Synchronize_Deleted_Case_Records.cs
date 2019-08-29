using System;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using mmria.server.model.actor;

namespace mmria.server.model.actor.quartz
{
    public class Synchronize_Deleted_Case_Records : UntypedActor
    {
        protected override void PreStart() => Console.WriteLine("Synchronize_Deleted_Case_Records started");
        protected override void PostStop() => Console.WriteLine("Synchronize_Deleted_Case_Records stopped");

        protected override void OnReceive(object message)
        {
            Console.WriteLine($"Synchronize_Deleted_Case_Records Baby {System.DateTime.Now}");

            
            switch (message)
            {
                case ScheduleInfoMessage scheduleInfo:
                mmria.server.model.couchdb.c_change_result latest_change_set = GetJobInfo(Program.Last_Change_Sequence, scheduleInfo);

                Dictionary<string, KeyValuePair<string,bool>> response_results = new Dictionary<string, KeyValuePair<string,bool>> (StringComparer.OrdinalIgnoreCase);
                
                if (Program.Last_Change_Sequence != latest_change_set.last_seq)
                {
                    foreach (mmria.server.model.couchdb.c_seq seq in latest_change_set.results)
                    {
                        if (response_results.ContainsKey (seq.id)) 
                        {
                            if 
                            (
                                seq.changes.Count > 0 &&
                                response_results [seq.id].Key != seq.changes [0].rev
                            )
                            {
                                if (seq.deleted == null)
                                {
                                    response_results [seq.id] = new KeyValuePair<string, bool> (seq.changes [0].rev, false);
                                }
                                else
                                {
                                    response_results [seq.id] = new KeyValuePair<string, bool> (seq.changes [0].rev, true);
                                }
                                
                            }
                        }
                        else 
                        {
                            if (seq.deleted == null)
                            {
                                response_results.Add (seq.id, new KeyValuePair<string, bool> (seq.changes [0].rev, false));
                            }
                            else
                            {
                                response_results.Add (seq.id, new KeyValuePair<string, bool> (seq.changes [0].rev, true));
                            }
                        }
                    }
                }

                
                if (Program.Change_Sequence_Call_Count < int.MaxValue)
                {
                    Program.Change_Sequence_Call_Count++;
                }

                if (Program.DateOfLastChange_Sequence_Call.Count > 9)
                {
                    Program.DateOfLastChange_Sequence_Call.Clear();
                }

                Program.DateOfLastChange_Sequence_Call.Add(DateTime.Now);

                Program.Last_Change_Sequence = latest_change_set.last_seq;

                foreach (KeyValuePair<string, KeyValuePair<string, bool>> kvp in response_results)
                {
                    System.Threading.Tasks.Task.Run
                    (
                        new Action(async () => 
                        {
                            if (kvp.Value.Value)
                            {
                                try
                                {
                                    mmria.server.util.c_sync_document sync_document = new mmria.server.util.c_sync_document (kvp.Key, null, "DELETE");
                                    await sync_document.executeAsync ();
                                    
                
                                }
                                catch (Exception ex)
                                {
                                        System.Console.WriteLine ("Sync Delete case");
                                        System.Console.WriteLine (ex);
                                }
                            }
                            else
                            {
            
                                string document_url = Program.config_couchdb_url + "/mmrds/" + kvp.Key;
                                var document_curl = new cURL ("GET", null, document_url, null, Program.config_timer_user_name, Program.config_timer_value);
                                string document_json = null;
            
                                try
                                {
                                    document_json = document_curl.execute ();
                                    if (!string.IsNullOrEmpty (document_json) && document_json.IndexOf ("\"_id\":\"_design/") < 0)
                                    {
                                        mmria.server.util.c_sync_document sync_document = new mmria.server.util.c_sync_document (kvp.Key, document_json);
                                        await sync_document.executeAsync ();
                                    }
                
                                }
                                catch (Exception ex)
                                {
                                        System.Console.WriteLine ("Sync PUT case");
                                        System.Console.WriteLine (ex);
                                }
                            }
                        })
                    );
                }

                        break;
            }

        }

        public mmria.server.model.couchdb.c_change_result GetJobInfo(string p_last_sequence, ScheduleInfoMessage p_scheduleInfo)
        {

			mmria.server.model.couchdb.c_change_result result = new mmria.server.model.couchdb.c_change_result();
			string url = null;

			if (string.IsNullOrWhiteSpace(p_last_sequence))
			{
				url = Program.config_couchdb_url + "/mmrds/_changes";
			}
			else
			{
				url = Program.config_couchdb_url + "/mmrds/_changes?since=" + p_last_sequence;
			}
			var curl = new cURL ("GET", null, url, null, p_scheduleInfo.user_name, p_scheduleInfo.password);
			string res = curl.execute();
			
			result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_change_result>(res);

			return result;
        }


    }
}