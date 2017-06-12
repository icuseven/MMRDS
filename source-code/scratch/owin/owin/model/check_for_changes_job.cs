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
			mmria.server.model.couchdb.c_change_result latest_change_set = GetJobInfo (Program.Last_Change_Sequence);

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

			/*
{"total_rows":11,"offset":0,"rows":[
{"id":"02279162-6be3-49e4-930f-42eed7cd4706","key":"02279162-6be3-49e4-930f-42eed7cd4706","value":{"rev":"1-1e8c9c42f75d1582c7d2261230268f0a"}},
{"id":"140836d7-abed-07ff-5b84-72a9ca30b9c4","key":"140836d7-abed-07ff-5b84-72a9ca30b9c4","value":{"rev":"1-7d713a250c1dd52843724df2e909841f"}},
{"id":"2243372a-9801-155c-4098-9540daabe76c","key":"2243372a-9801-155c-4098-9540daabe76c","value":{"rev":"1-d7b3cb2bbddfa7dab44161b745ba3f2c"}},
{"id":"244da20f-41cc-4300-ad94-618004a51917","key":"244da20f-41cc-4300-ad94-618004a51917","value":{"rev":"1-3930c68b758258af365bda35aee22731"}},
{"id":"999907aa-8b73-3cfa-f13b-657beb325428","key":"999907aa-8b73-3cfa-f13b-657beb325428","value":{"rev":"1-1e3bac81a24f00755613f0f7d2604fcb"}},
{"id":"acbf75d5-9c7a-57bc-9bef-59624bac7847","key":"acbf75d5-9c7a-57bc-9bef-59624bac7847","value":{"rev":"1-6f758041b4fb6954ec5ff4a52cc57eda"}},
{"id":"b5003bc5-1ab3-4ba2-8aea-9f3717c9682a","key":"b5003bc5-1ab3-4ba2-8aea-9f3717c9682a","value":{"rev":"1-ab8dc8c5852d0e053683d64ee7c5e9ba"}},
{"id":"d0e08da8-d306-4a9a-a5ff-9f1d54702091","key":"d0e08da8-d306-4a9a-a5ff-9f1d54702091","value":{"rev":"1-bbddad634887348768fa8badc4db5ded"}},
{"id":"e28af3a7-b512-d1b4-d257-19f2fabeb14d","key":"e28af3a7-b512-d1b4-d257-19f2fabeb14d","value":{"rev":"1-a9ce1f6a0be2416e2ff06ef9adb1bd0e"}},
{"id":"e98ce2be-4446-439a-bb63-d9b4e690e3c3","key":"e98ce2be-4446-439a-bb63-d9b4e690e3c3","value":{"rev":"1-297a418df441f52109714fdc3b21bd07"}},
{"id":"f6660468-ec54-a569-9903-a6682c5881d6","key":"f6660468-ec54-a569-9903-a6682c5881d6","value":{"rev":"1-113fa14b491002aa951616627cb35562"}}
]}



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
			foreach (mmria.server.model.couchdb.c_all_docs_row all_doc_row in all_docs)
			{
				mmrds_id_set.Add(all_doc_row.id);
			}
			
			
			// get all non deleted cases in de_id
			curl = new cURL ("GET", null, Program.config_couchdb_url + "/de_id/_all_docs", null, Program.config_timer_user_name, Program.config_timer_password);
			json = curl.execute ();
			all_docs = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_all_docs> (json);
			foreach (mmria.server.model.couchdb.c_all_docs_row all_doc_row in all_docs)
			{
				de_id_set.Add(all_doc_row.id);
			}

			deleted_id_set = de_id_set.Except(mmrds_id_set);
			foreach(string id in deleted_id_set)
			{
				curl = new cURL ("DELETE", null, Program.config_couchdb_url + "/de_id/" + id + "?rev=", null, Program.config_timer_user_name, Program.config_timer_password);
				json = curl.execute ();
			}

			// get all non deleted cases in report
			curl = new cURL ("GET", null, Program.config_couchdb_url + "/report/_all_docs", null, Program.config_timer_user_name, Program.config_timer_password);
			json = curl.execute ();
			all_docs = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_all_docs> (json);
			foreach (mmria.server.model.couchdb.c_all_docs_row all_doc_row in all_docs)
			{
				report_id_set.Add(all_doc_row.id);
			}
			deleted_id_set = report_id_set.Except(mmrds_id_set);
			foreach(string id in deleted_id_set)
			{
				curl = new cURL ("DELETE", null, Program.config_couchdb_url + "/report/" + id + "?rev=", null, Program.config_timer_user_name, Program.config_timer_password);
				json = curl.execute ();
			}
*/

            //Program.JobInfoList = GetJobInfo();

			/*
            if (Program.NumberOfJobInfoList_Call_Count < int.MaxValue)
            {
                Program.NumberOfJobInfoList_Call_Count++;
            }

            if (Program.DateOfLastJobInfoList_Call.Count >10)
            {
                Program.DateOfLastJobInfoList_Call.Clear();
            }

            Program.DateOfLastJobInfoList_Call.Add(DateTime.Now);
			*/

            //log.DebugFormat("iCIMS_Data_Call_Job says: finishing {0} executing at {1}", jobKey, DateTime.Now.ToString("r"));
        }



		public mmria.server.model.couchdb.c_change_result GetJobInfo(string p_last_sequence)
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


        private string Get_Change_Set()
        {
            string result = null;

			/*
            var url = System.Configuration.ConfigurationManager.AppSettings["icims_base_url"];
            var parms = System.Web.HttpUtility.UrlEncode(System.Configuration.ConfigurationManager.AppSettings["icims_job_summary_params"]);

            var whole_url = url + parms;
            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(whole_url);

            request.Credentials = new System.Net.NetworkCredential(System.Configuration.ConfigurationManager.AppSettings["icims_user_id"], System.Configuration.ConfigurationManager.AppSettings["icims_password"]);
            request.PreAuthenticate = false;

            try
            {
                using (System.Net.HttpWebResponse response = (System.Net.HttpWebResponse)request.GetResponse())
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        System.Text.Encoding enc = System.Text.Encoding.GetEncoding(1252);
                        System.IO.StreamReader loResponseStream = new
                          System.IO.StreamReader(response.GetResponseStream(), enc);

                        string Response = loResponseStream.ReadToEnd();

                        loResponseStream.Close();
                        response.Close();
                        System.Console.Write(Response);
                        result = Response;
                    }
                    else
                    {
                        return result;
                    }
                }
            }
            catch (System.Net.WebException ex)
            {
                return result;
            }
            catch
            {
                return result;
            }
            */

            return result;
        }

        private string Get_Job(string Job_Id)
        {

            string result = null;

            var url = string.Format(System.Configuration.ConfigurationManager.AppSettings["icims_job_detail_url"], Job_Id);
            
            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);
            request.Credentials = new System.Net.NetworkCredential(System.Configuration.ConfigurationManager.AppSettings["icims_user_id"], System.Configuration.ConfigurationManager.AppSettings["icims_password"]);
            request.PreAuthenticate = false;

            try
            {
                using (System.Net.HttpWebResponse response = (System.Net.HttpWebResponse)request.GetResponse())
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        System.Text.Encoding enc = System.Text.Encoding.GetEncoding(1252);
                        System.IO.StreamReader loResponseStream = new
                          System.IO.StreamReader(response.GetResponseStream(), enc);

                        string Response = loResponseStream.ReadToEnd();

                        loResponseStream.Close();
                        response.Close();
                        System.Console.Write(Response);
                        result = Response;
                        return result;
                    }
                    else
                    {
                        return result;
                    }
                }
            }
            catch (System.Net.WebException ex)
            {
                return result;
            }
            catch
            {
                return result;
            }
        }
    }

}