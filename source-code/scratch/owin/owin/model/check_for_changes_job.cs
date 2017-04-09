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

        void IJob.Execute(IJobExecutionContext context)
        {
            //Common.Logging.ILog log = Common.Logging.LogManager.GetCurrentClassLogger();
            //log.Debug("IJob.Execute");

            JobKey jobKey = context.JobDetail.Key;
            //log.DebugFormat("iCIMS_Data_Call_Job says: Starting {0} executing at {1}", jobKey, DateTime.Now.ToString("r"));
			mmria.server.model.couchdb.c_change_result latest_change_set = GetJobInfo(Program.Last_Change_Sequence);

			Dictionary<string, string> response_results = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
			
			if (Program.Last_Change_Sequence != latest_change_set.last_seq)
			{
				foreach (mmria.server.model.couchdb.c_seq seq in latest_change_set.results)
				{
					if (response_results.ContainsKey(seq.id))
					{
						if
						(
							seq.changes.Count > 0 &&
							response_results[seq.id] != seq.changes[0].rev
						)
						{
							response_results[seq.id] = seq.changes[0].rev;
						}
					}
					else
					{
						response_results.Add(seq.id, seq.changes[0].rev);
					}
				}
			}

			if (Program.Change_Sequence_Call_Count < int.MaxValue)
			{
				Program.Change_Sequence_Call_Count++;
			}

			if (Program.DateOfLastChange_Sequence_Call.Count > 10)
			{
				Program.DateOfLastChange_Sequence_Call.Clear();
			}

			Program.DateOfLastChange_Sequence_Call.Add(DateTime.Now);

			Program.Last_Change_Sequence = latest_change_set.last_seq;

			foreach (KeyValuePair<string, string> kvp in response_results)
			{
				System.Threading.Tasks.Task.Run
				(
					new Action(() =>
						{
							string document_url = Program.config_couchdb_url + "/mmrds/" + kvp.Key;
							var document_curl = new cURL("GET", null, document_url, null, this.user_name, this.password);
							string document_json = null;
							try
							{
								document_json = document_curl.execute();
							}
							catch (Exception ex)
							{
								System.Console.WriteLine("Get case");
								System.Console.WriteLine(ex);
							}

							if (!string.IsNullOrEmpty(document_json) && document_json.IndexOf("\"_id\":\"_design/") < 0)
							{
								//System.Console.WriteLine("Get case");
								//System.Console.WriteLine(document_json);

								//<database>/_design/<design>/_update/<function>/<docid>
								//de_id/_design/auth/_update/in-place/<docid> 

						/*
								string de_identfied_url = Program.config_couchdb_url + "/de_id/" + kvp.Key + "?new_edits=false";

								string de_identified_json = new mmria.server.util.c_de_identifier(document_json).execute();

								var de_identfied_curl = new cURL("PUT", null, de_identfied_url, de_identified_json, this.user_name, this.password);
								try
								{
									string de_id_result = de_identfied_curl.execute();
									System.Console.WriteLine("sync de_id");
									System.Console.WriteLine(de_id_result);

								}
								catch (Exception ex)
								{
									System.Console.WriteLine("sync de_id");
									System.Console.WriteLine(ex);
								}

						*/


								string aggregate_url = Program.config_couchdb_url + "/report/" + kvp.Key + "?new_edits=false";

								try
								{
									string aggregate_json = new mmria.server.util.c_aggregator(document_json).execute();

									var aggregate_curl = new cURL("PUT", null, aggregate_url, aggregate_json, this.user_name, this.password);

									string aggregate_result = aggregate_curl.execute();
									System.Console.WriteLine("sync aggregate_id");
									System.Console.WriteLine(aggregate_result);

								}
								catch (Exception ex)
								{
									System.Console.WriteLine("sync aggregate_id");
									System.Console.WriteLine(ex);
								}


							}
						})
				);
			}



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