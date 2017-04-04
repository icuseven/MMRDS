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
			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"])) 
			{
				this.couch_db_url = System.Environment.GetEnvironmentVariable ("couchdb_url");
				this.user_name = System.Environment.GetEnvironmentVariable("timer_user_name");
				this.password = System.Environment.GetEnvironmentVariable("timer_password");
			} 
			else
			{
				this.couch_db_url = System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"];
				this.user_name = System.Configuration.ConfigurationManager.AppSettings["timer_user_name"];
				this.password = System.Configuration.ConfigurationManager.AppSettings["timer_password"];
			}
		}

        void IJob.Execute(IJobExecutionContext context)
        {
            //Common.Logging.ILog log = Common.Logging.LogManager.GetCurrentClassLogger();
            //log.Debug("IJob.Execute");

            JobKey jobKey = context.JobDetail.Key;
            //log.DebugFormat("iCIMS_Data_Call_Job says: Starting {0} executing at {1}", jobKey, DateTime.Now.ToString("r"));
			mmria.server.model.couchdb.c_change_result latest_change_set = GetJobInfo(Program.Last_Change_Sequence);




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

			/*
			System.Threading.Tasks.Task.Run
			( 
				new Action(()=> 
					{
						var curl = new cURL ("GET", null, "http://mmrds:mmrds@db1.mmria.org/mmrds/_changes", null);
						string res = curl.execute ();
						System.Console.WriteLine ("get_job_info");
						System.Console.WriteLine (res);
					})
			);*/




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
				url = get_couch_db_url() + "/mmrds/_changes";
			}
			else
			{
				url = get_couch_db_url() + "/mmrds/_changes?since=" + p_last_sequence;
			}
			var curl = new cURL ("GET", null, url, null, this.user_name, this.password);
			string res = curl.execute ();


			result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_change_result>(res);
			System.Console.WriteLine("get_job_info.last_seq");
			System.Console.WriteLine(result.last_seq);
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

		private string get_couch_db_url()
		{
			string result = null;

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"])) 
			{
				result = System.Environment.GetEnvironmentVariable ("couchdb_url");
			} 
			else
			{
				result = System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"];
			}

			return result;
		}
    }

}