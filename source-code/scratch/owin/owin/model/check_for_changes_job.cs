using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Quartz;
using Quartz.Impl;

namespace mmria.server.model
{
	public class check_for_changes_job : IJob
    {
		string couch_db_url = null;
		string user_name = null;
		string password = null;

		public check_for_changes_job()
		{
				this.couch_db_url = Program.config_couchdb_url;
				this.user_name = Program.config_timer_user_name;
				this.password = Program.config_timer_password;
		}

        void IJob.Execute (IJobExecutionContext context)
        {
			//Common.Logging.ILog log = Common.Logging.LogManager.GetCurrentClassLogger();
			//log.Debug("IJob.Execute");

			JobKey jobKey = context.JobDetail.Key;
			//log.DebugFormat("iCIMS_Data_Call_Job says: Starting {0} executing at {1}", jobKey, DateTime.Now.ToString("r"));
			mmria.server.model.couchdb.c_change_result latest_change_set = get_changes (Program.Last_Change_Sequence);

			Dictionary<string, KeyValuePair<string,bool>> response_results = new Dictionary<string, KeyValuePair<string,bool>> (StringComparer.OrdinalIgnoreCase);
			
			if (Program.Last_Change_Sequence != latest_change_set.last_seq)
			{
				foreach (mmria.server.model.couchdb.c_seq seq in latest_change_set.results)
				{
					if (response_results.ContainsKey (seq.id)) 
					{
						if (
							seq.changes.Count > 0 &&
							response_results [seq.id].Key != seq.changes [0].rev)
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
				Program.DateOfLastChange_Sequence_Call.Clear ();
			}

			Program.DateOfLastChange_Sequence_Call.Add (DateTime.Now);

			Program.Last_Change_Sequence = latest_change_set.last_seq;

			List<System.Threading.Tasks.Task> TaskList = new List<System.Threading.Tasks.Task>();

			foreach (KeyValuePair<string, KeyValuePair<string, bool>> kvp in response_results)
			{
				System.Threading.Tasks.Task.Run
				(
					new Action (() => 
					{
						if (kvp.Value.Value)
						{
							try
							{
								mmria.server.util.c_sync_document sync_document = new mmria.server.util.c_sync_document (kvp.Key, null, "DELETE");
								sync_document.execute ();
								
			
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
							var document_curl = new cURL ("GET", null, document_url, null, Program.config_timer_user_name, Program.config_timer_password);
							string document_json = null;
		
							try
							{
								document_json = document_curl.execute ();
								if (!string.IsNullOrEmpty (document_json) && document_json.IndexOf ("\"_id\":\"_design/") < 0)
								{
									mmria.server.util.c_sync_document sync_document = new mmria.server.util.c_sync_document (kvp.Key, document_json);
									sync_document.execute ();
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
			System.Threading.Tasks.Task.WhenAll(TaskList);

			try
			{
	
				HashSet<string> mmrds_id_set = new HashSet<string> (StringComparer.OrdinalIgnoreCase);
				HashSet<string> de_id_set = new HashSet<string> (StringComparer.OrdinalIgnoreCase);
				HashSet<string> report_id_set = new HashSet<string> (StringComparer.OrdinalIgnoreCase);
				HashSet<string> deleted_id_set = null;
	
				string json = null;
				mmria.server.model.couchdb.c_all_docs all_docs = null;
				cURL curl = null;
	
				// get all non deleted cases in mmrds
				curl = new cURL ("GET", null, Program.config_couchdb_url + "/mmrds/_all_docs", null, Program.config_timer_user_name, Program.config_timer_password);
				json = curl.execute ();
				all_docs = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_all_docs> (json);
				foreach (mmria.server.model.couchdb.c_all_docs_row all_doc_row in all_docs.rows)
				{
					mmrds_id_set.Add(all_doc_row.id);
				}
				
				
				// get all non deleted cases in de_id
				curl = new cURL ("GET", null, Program.config_couchdb_url + "/de_id/_all_docs", null, Program.config_timer_user_name, Program.config_timer_password);
				json = curl.execute ();
				all_docs = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_all_docs> (json);
				foreach (mmria.server.model.couchdb.c_all_docs_row all_doc_row in all_docs.rows)
				{
					de_id_set.Add(all_doc_row.id);
				}
	
				deleted_id_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
				deleted_id_set.Union(de_id_set.Except(mmrds_id_set));
				foreach(string id in deleted_id_set)
				{
					string rev = all_docs.rows.Where( r=> r.id == id).FirstOrDefault().rev.rev;
					curl = new cURL ("DELETE", null, Program.config_couchdb_url + "/de_id/" + id + "?rev=" + rev, null, Program.config_timer_user_name, Program.config_timer_password);
					json = curl.execute ();
				}
	
				// get all non deleted cases in report
				curl = new cURL ("GET", null, Program.config_couchdb_url + "/report/_all_docs", null, Program.config_timer_user_name, Program.config_timer_password);
				json = curl.execute ();
				all_docs = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_all_docs> (json);
				foreach (mmria.server.model.couchdb.c_all_docs_row all_doc_row in all_docs.rows)
				{
					report_id_set.Add(all_doc_row.id);
				}
				deleted_id_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
				deleted_id_set.Union(report_id_set.Except(mmrds_id_set));
				foreach(string id in deleted_id_set)
				{
					string rev = all_docs.rows.Where( r=> r.id == id).FirstOrDefault().rev.rev;
					curl = new cURL ("DELETE", null, Program.config_couchdb_url + "/report/" + id + "?rev=" + rev, null, Program.config_timer_user_name, Program.config_timer_password);
					json = curl.execute ();
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine("Delete sync error:\n{0}", ex);
			}

		}




		public mmria.server.model.couchdb.c_change_result get_changes(string p_last_sequence)
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
			var curl = new cURL ("GET", null, url, null, this.user_name, this.password);
			string res = curl.execute();
			
			result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_change_result>(res);
			//System.Console.WriteLine("get_job_info.last_seq");
			//System.Console.WriteLine(result.last_seq);


			/*
			 curl -X GET $HOST/db/_changes 
			 curl -X GET $HOST/db/_changes?since=1

				http://db1.mmria.org/mmrds/_changes?since=3235-g1AAAAIseJyV0UEKwjAQBdDRKorgGSqeIEntNK7sTTSxhVJqIuheb1L3HkJPIN5Ab1LTpCtFaDcTGIZH-L8AgHHmJTBVWukkjZXO9OFYmHVfgPSrqsozTwJ4_s7sRilyzgj5vv8jyJmZcuUQ8bACCZdbTMO2QlwL60bYWwEjwmUg2gqbWjg1wtMKQiAiW7QU1MBMOJvHIKWLYzhxcRAZIOWdoIuDbvV3rlaRgiaUR52Uu1NetVJahTOT6hY7KW-nNB335q6hCDllPw3lHw3Uqkc

			{
				"seq":12, // update_seq created when document changed
				"id":"foo", // document id
				"changes":  /// one or more changes
					[
						{"rev":"1-23202479633c2b380f79507a776743d5"}
					]
			}

            string get_job_search_result_json = Get_Job_Set();

            DGJobAPI.Models.GetJobSearchResult get_job_search_result = Newtonsoft.Json.JsonConvert.DeserializeObject<DGJobAPI.Models.GetJobSearchResult>(get_job_search_result_json);

            // remove duplicates
            IEnumerable<DGJobAPI.Models.JsonSummary> de_deplicated_list = get_job_search_result.searchResults
                      .GroupBy(summary => summary.id)
                      .Select(group => group.First());


            foreach (DGJobAPI.Models.JsonSummary json_summary in de_deplicated_list)
            {

                string get_job_detail_result_json = Get_Job(json_summary.id.ToString());
                DGJobAPI.Models.GetJobDetailResult get_job_detail_result = Newtonsoft.Json.JsonConvert.DeserializeObject<DGJobAPI.Models.GetJobDetailResult>(get_job_detail_result_json);
                result.Add(new DGJobAPI.Models.JobInfo(json_summary.id.ToString(), get_job_detail_result));
            }

            return result.OrderByDescending(j => j.date_last_updated).Take(100).ToList();
			*/ 
			return result;
        }


        public void Process_Export_Queue_Item ()
        {
			List<export_queue_item> result = new List<export_queue_item> ();
			
			var curl = new cURL ("GET", null, Program.config_couchdb_url + "/export_queue/_all_docs?include_docs=true", null, this.user_name, this.password);

			string responseFromServer = curl.execute ();

			IDictionary<string,object> response_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer) as IDictionary<string,object>; 
			IList<object> enumerable_rows = response_result ["rows"] as IList<object>;

			foreach (IDictionary<string,object> enumerable_item in enumerable_rows)
			{
				IDictionary<string,object> doc_item = enumerable_item ["doc"] as IDictionary<string,object>;
		
				if (
					doc_item ["status"] != null &&
					doc_item ["status"].ToString ().Equals ("new", StringComparison.OrdinalIgnoreCase))
				{
					export_queue_item item = new export_queue_item ();
	
					item.date_created = doc_item ["date_created"] as DateTime?;
					item.created_by = doc_item ["created_by"] != null ? doc_item ["created_by"].ToString () : null;
					item.date_last_updated = doc_item ["date_last_updated"] as DateTime?;
					item.last_updated_by = doc_item ["last_updated_by"] != null ? doc_item ["last_updated_by"].ToString () : null;
					item.file_name = doc_item ["file_name"] != null ? doc_item ["file_name"].ToString () : null;
					item.export_type = doc_item ["export_type"] != null ? doc_item ["export_type"].ToString () : null;
					item.status = doc_item ["status"] != null ? doc_item ["status"].ToString () : null;
	
					result.Add (item);
				}
			}

		
			if (result.Count > 0)
			{
				if (result.Count > 1)
				{
					var comparer = Comparer<export_queue_item>.Create
					(
						               (x, y) => x.date_created.Value.CompareTo (y.date_created.Value) 
					               );
	
					result.Sort (comparer);
				}

				export_queue_item item_to_process = result [0];


				List<string> args = new List<string>();
				
				args.Add("user_name:" + this.user_name);
				args.Add("password:" + this.password);
				args.Add("url:" + this.couch_db_url);

				if (item_to_process.export_type.Equals ("core csv", StringComparison.OrdinalIgnoreCase))
				{
					//export-core user_name:user1 password:password url:http://localhost:12345
					mmria.server.util.core_element_exporter core_element_exporter = new mmria.server.util.core_element_exporter();
					core_element_exporter.Execute(args.ToArray());
				
				}
				else if(item_to_process.export_type.Equals ("core csv", StringComparison.OrdinalIgnoreCase))
				{
						
					//export user_name:user1 password:password url:http://localhost:12345
					mmria.server.util.mmrds_exporter mmrds_exporter = new mmria.server.util.mmrds_exporter();
					mmrds_exporter.Execute(args.ToArray());
				}

			}

        }
    }

}