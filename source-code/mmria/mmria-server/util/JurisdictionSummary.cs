using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace mmria.server.utils
{

    public class UserCount
    {
        public UserCount(){}

        public string host_name {get; set; }
        public int num_recs{get; set; }
    }
    public class JurisdictionSummaryItem
    {
        public JurisdictionSummaryItem(){}
        public string host_name {get; set; }
        public string rpt_date{get; set; }
        public int num_recs{get; set; }
        public int num_users_unq{get; set; }
        public int num_users_ja{get; set; }
        public int num_users_abs{get; set; }
        public int num_user_anl{get; set; }
        public int num_user_cm{get; set; }
    }

    class JSIComparer : IComparer<JurisdictionSummaryItem>
    {
        public int Compare(JurisdictionSummaryItem x, JurisdictionSummaryItem y)
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

    public class JurisdictionSummary
    {
        IConfiguration configuration;

        mmria.common.couchdb.ConfigurationSet ConfigDB;

        public JurisdictionSummary(IConfiguration p_configuration, mmria.common.couchdb.ConfigurationSet p_config_db)
        {
            configuration = p_configuration;
            ConfigDB = p_config_db;
        }

        public async Task<List<JurisdictionSummaryItem>> execute()
        {

            var result = new Dictionary<string, JurisdictionSummaryItem>(System.StringComparer.OrdinalIgnoreCase);
            var user_count_result = new Dictionary<string, UserCount>(System.StringComparer.OrdinalIgnoreCase);
            var user_count_task_list = new List<Task>();
            var jurisdiction_count_task_list = new List<Task>();

           var current_date = System.DateTime.Now;

            foreach(var config in ConfigDB.detail_list)
            {


                var prefix = config.Key.ToUpper();

                if(prefix == "VITAL_IMPORT") continue;

                var jsi = new JurisdictionSummaryItem();
                jsi.rpt_date = $"{current_date.Month}/{current_date.Day}/{current_date.Year}";
                jsi.host_name = prefix;

                result.Add(prefix, jsi);

                var usr = new UserCount();
                usr.host_name = prefix;

                user_count_result.Add(prefix, usr);

                user_count_task_list.Add(GetUserCount(prefix, config.Value, usr));
                jurisdiction_count_task_list.Add(GetJurisdictions(prefix, config.Value, jsi));
            }


            await Task.WhenAll(user_count_task_list);

            //var user_count_call_results = user_count_responses.Where(r => !string.IsNullOrWhiteSpace(r)); //filter out any null values


            await Task.WhenAll(jurisdiction_count_task_list);

            //var jurisdiction_count_call_results = jurisdiction_count_responses.Where(r => !string.IsNullOrWhiteSpace(r)); //filter out any null values
            foreach(var usr in user_count_result)
            {
                result[usr.Key].num_recs = usr.Value.num_recs;
            }

            List<JurisdictionSummaryItem> view_data = new();

            foreach(var item in result)
            {
                view_data.Add(item.Value);
            }

            view_data.Sort(new JSIComparer());

            return view_data;
        }

        public async System.Threading.Tasks.Task GetUserCount(string p_id, mmria.common.couchdb.DBConfigurationDetail p_config_detail, UserCount p_result) 
		{ 
			try
			{
				string request_string = $"{p_config_detail.url}/_users/_all_docs?include_docs=true&skip=1";

				var user_curl = new cURL("GET",null,request_string,null, p_config_detail.user_name, p_config_detail.user_value);
				string responseFromServer = await user_curl.executeAsync();

				var user_alldocs_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user>>(responseFromServer);
			
/*
				mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user> result = new mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user>();
				result.offset = user_alldocs_response.offset;
				result.total_rows = user_alldocs_response.total_rows;
                */

                p_result.num_recs = user_alldocs_response.total_rows;
/*
                List<mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.user>> temp_list = new List<mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.user>>();
				foreach(mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.user> uai in user_alldocs_response.rows)
				{
                }
*/

            }
            catch(System.Exception)
            {

            }


        }

        public async Task GetJurisdictions(string p_id, mmria.common.couchdb.DBConfigurationDetail p_config_detail, JurisdictionSummaryItem p_result) 
		{
            string sort = "by_date_created";
            string search_key = null;
            bool descending = false;
            int skip = 0;
            int take = 20000;
			search_key = "";
            string sort_view = "by_date_created";


 
			try
			{
                System.Text.StringBuilder request_builder = new System.Text.StringBuilder ();
                request_builder.Append (p_config_detail.url);
                request_builder.Append ($"/{p_config_detail.prefix}jurisdiction/_design/sortable/_view/{sort_view}?");


                if (string.IsNullOrWhiteSpace (search_key))
                {
                    if (skip > -1) 
                    {
                        request_builder.Append ($"skip={skip}");
                    } 
                    else 
                    {

                        request_builder.Append ("skip=0");
                    }


                    if (take > -1) 
                    {
                        request_builder.Append ($"&limit={take}");
                    }

                    if (descending) 
                    {
                        request_builder.Append ("&descending=true");
                    }
                } 
                else 
                {
                    request_builder.Append ("skip=0");

                    if (descending) 
                    {
                        request_builder.Append ("&descending=true");
                    }
                }

				var user_role_jurisdiction_curl = new cURL("GET", null, request_builder.ToString(), null, p_config_detail.user_name, p_config_detail.user_value);
				string response_from_server = await user_role_jurisdiction_curl.executeAsync ();

                var case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.user_role_jurisdiction>>(response_from_server);

                foreach(mmria.common.model.couchdb.get_sortable_view_response_item<mmria.common.model.couchdb.user_role_jurisdiction> cvi in case_view_response.rows)
                {
                    switch(cvi.value.role_name?.ToLower())
                    {
                        case "jurisdiction_admin":
                            p_result.num_users_ja++;
                        break;
                        case "abstractor":
                            p_result.num_users_abs++;
                        break;
                        case "analyst":
                            p_result.num_user_anl++;
                        break;
                        case "committee_member":
                            p_result.num_user_cm++;
                        break;
                    }
                }
               
			}
			catch(System.Exception ex)
			{
				System.Console.WriteLine (ex);

			} 


		}

    }
}