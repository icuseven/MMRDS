using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Quartz;
using Quartz.Impl;

namespace mmria.server.model
{
	public class check_for_changes : IJob
    {
        void IJob.Execute(IJobExecutionContext context)
        {
            //Common.Logging.ILog log = Common.Logging.LogManager.GetCurrentClassLogger();
            //log.Debug("IJob.Execute");

            JobKey jobKey = context.JobDetail.Key;
            //log.DebugFormat("iCIMS_Data_Call_Job says: Starting {0} executing at {1}", jobKey, DateTime.Now.ToString("r"));

            Program.JobInfoList = GetJobInfo();

            if (Program.NumberOfJobInfoList_Call_Count < int.MaxValue)
            {
                Program.NumberOfJobInfoList_Call_Count++;
            }

            if (Program.DateOfLastJobInfoList_Call.Count >10)
            {
                Program.DateOfLastJobInfoList_Call.Clear();
            }

            Program.DateOfLastJobInfoList_Call.Add(DateTime.Now);

            //log.DebugFormat("iCIMS_Data_Call_Job says: finishing {0} executing at {1}", jobKey, DateTime.Now.ToString("r"));
        }



        public IList<string> GetJobInfo()
        {
            List<string> result = new List<string>();
			/*
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