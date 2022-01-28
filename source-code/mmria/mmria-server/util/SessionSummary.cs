using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace mmria.server.utils
{


    public class SessionSummaryItem
    {
        public SessionSummaryItem()
        {
            rpt_date = new List<int>();
        }
        public string host_name {get; set; }
        public List<int> rpt_date{get; set; }
        public int total {get; set; }
    }

    class SSIComparer : IComparer<SessionSummaryItem>
    {
        public int Compare(SessionSummaryItem x, SessionSummaryItem y)
        {
            
            if (x == null || y == null)
            {
                return 0;
            }

            if (x.host_name == null || y.host_name == null)
            {
                return 0;
            }
            
            // "CompareTo()" method
            return x.host_name.CompareTo(y.host_name);
            
        }
    }

    public class SessionSummary
    {

/*
{
  "_id": "fb1f966d-6698-48d5-8b5f-c60a32c356db",
  "_rev": "1-06dc81301472612eae9e95912c7e1053",
  "data_type": "session-event",
  "date_created": "2021-02-24T08:24:55.6396941-05:00",
  "user_id": "user1",
  "ip": "::1",
  "action_result": 1
}
*/
        public class SessionItem
        {
            public string _id {get;set;}
            public string _rev {get;set;}
            public string data_type {get;set;}
            public DateTime date_created {get;set;}
            public string user_id {get;set;}
            public string ip {get;set;}
            public int? action_result {get;set;}
        }

        IConfiguration configuration;

        mmria.common.couchdb.ConfigurationSet ConfigDB;

        public SessionSummary(IConfiguration p_configuration, mmria.common.couchdb.ConfigurationSet p_config_db)
        {
            configuration = p_configuration;
            ConfigDB = p_config_db;
        }

        public async Task<List<SessionSummaryItem>> execute(System.Threading.CancellationToken cancellationToken)
        {

            var result = new List<SessionSummaryItem>();
            
            var record_count_result = new Dictionary<string, SessionSummaryItem>(System.StringComparer.OrdinalIgnoreCase);
            var record_count_task_list = new List<Task>();
            //var jurisdiction_count_task_list = new List<Task>();

           var current_date = System.DateTime.Now;

            foreach(var config in ConfigDB.detail_list)
            {

                cancellationToken.ThrowIfCancellationRequested();

                var prefix = config.Key.ToUpper();

                if(prefix == "VITAL_IMPORT") continue;

                var sessionSummaryItem = new SessionSummaryItem();
                sessionSummaryItem.host_name = prefix;
                record_count_result.Add(prefix, sessionSummaryItem);
               
                record_count_task_list.Add(GetSessionCount(cancellationToken, prefix, config.Value, sessionSummaryItem));
                
            }


            await Task.WhenAll(record_count_task_list);
            cancellationToken.ThrowIfCancellationRequested();
            //var user_count_call_results = user_count_responses.Where(r => !string.IsNullOrWhiteSpace(r)); //filter out any null values


            //await Task.WhenAll(jurisdiction_count_task_list);
            //cancellationToken.ThrowIfCancellationRequested();
            //var jurisdiction_count_call_results = jurisdiction_count_responses.Where(r => !string.IsNullOrWhiteSpace(r)); //filter out any null values


            foreach(var kvp in record_count_result)
            {
                result.Add(kvp.Value);
            }

            result.Sort(new SSIComparer());

            return result;
        }

        public async System.Threading.Tasks.Task GetSessionCount(System.Threading.CancellationToken cancellationToken, string p_id, mmria.common.couchdb.DBConfigurationDetail p_config_detail, SessionSummaryItem p_result) 
		{ 
			try
			{
				string request_string = $"{p_config_detail.url}/{p_config_detail.prefix}session/_all_docs?include_docs=true";


                cancellationToken.ThrowIfCancellationRequested();
				var user_curl = new cURL("GET",null,request_string,null, p_config_detail.user_name, p_config_detail.user_value);
				string responseFromServer = await user_curl.executeAsync();

                cancellationToken.ThrowIfCancellationRequested();

				var case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.view_response<SessionItem>>>(responseFromServer);
	
                var current_day = System.DateTime.Now.Day;
                
                foreach(var row in case_view_response.rows)
                {

                }

            }
            catch(System.Exception)
            {
                p_result.total = -1;
            }
        }
      

    }
}