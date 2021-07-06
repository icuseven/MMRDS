using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace mmria.server.Controllers
{
    public record JurisdictionSummaryItem
    (
        string host_name,
        string rpt_date,
        string num_recs,
        string num_users_unq,
        string num_users_ja,
        string num_users_abs,
        string num_user_anl,
        string num_user_cm
    );

    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    [Authorize(Roles = "installation_admin,cdc_admin")]
    public class jurisdictionSummaryController : Controller
    {
        IConfiguration configuration;

        mmria.common.couchdb.ConfigurationSet ConfigDB;

        public jurisdictionSummaryController(IConfiguration p_configuration, mmria.common.couchdb.ConfigurationSet p_config_db)
        {
            configuration = p_configuration;
            ConfigDB = p_config_db;
        }
        readonly HashSet<string> production_list = new()
        {
            "afd",
            "al",
            "ak",
            "ca",
            "co",
            "dc",
            "de",
            "ga",
            "hi",
            "ia",
            "id",
            "ky",
            "me",
            "md",
            "ms",
            "mt",
            "nd",
            "ne",
            "nh",
            "nm",
            "nv",
            "or",
            "oh",
            "ok",
            "pr",
            "ri",
            "sd",
            "va",
            "vt",
            "wv",
            "wy",
// non central
            "ar",
            "az",
            "cdc",
            "ct",
            "demo",
            "fl",
            "in",
            "il",
            "ks",
            "la",
            "ma",
            "mi",
            "mn",
            "mo",
            "nc",
            "nj",
            "ny",
            "pa",
            "sc",
            "tn",
            "tx",
            "ut",
            "wa",
            "wi",
        };

        public async Task<IActionResult> Index()
        {


            var tasks = new List<Task<string>>();
            using(var client = new System.Net.Http.HttpClient()) 
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
/*
                //create the search tasks to be executed
                var tasks = new []
                {
                    GetModel("**URL 1**", client),
                    GetModel("**URL 2**", client),
                    GetModel("**URL N**", client),
                };
                */
            }

            // Await the completion of all the running tasks. 
            var responses = await Task.WhenAll(tasks); // returns IEmumerable<WalmartModel>

            var results = responses.Where(r => !string.IsNullOrWhiteSpace(r)); //filter out any null values
            
/*
MMRIA Jurisdiction Summary Report

#
Jurisdiction Abbreviation
Report Date
# of Records
# of Unique MMRIA Users
MMRIA User Role Assignment
	Jurisdiction Admin
	Abstractor
	Analyst
	Committee Member
	
	
Total

host_name
rpt_date
num_recs
num_users_unq
num_users_ja
num_users_abs
num_user_anl
num_user_cm
*/

            return View();
        }

        public async Task<string> GetModel(string url, System.Net.Http.HttpClient client) 
        {
            using(var response = await client.GetAsync(url)) 
            {
                if (response.IsSuccessStatusCode) 
                {
                    return await response.Content.ReadAsStringAsync();
                } 
                else 
                {
                    System.Console.WriteLine("Internal server Error");
                }
            }            
            return null;       
        }

        public async System.Threading.Tasks.Task<int> Get() 
		{ 
            int result = -1;
			try
			{
 				var jurisdiction_hashset = mmria.server.util.authorization.get_current_jurisdiction_id_set_for(User);

				var jurisdiction_username_hashset = mmria.server.util.authorization_case.get_user_jurisdiction_set();



				string request_string = Program.config_couchdb_url + "/_users/_all_docs?include_docs=true&skip=1";

				var user_curl = new cURL("GET",null,request_string,null, Program.config_timer_user_name, Program.config_timer_value);
				string responseFromServer = await user_curl.executeAsync();

				var user_alldocs_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user>>(responseFromServer);
			
/*
				mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user> result = new mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user>();
				result.offset = user_alldocs_response.offset;
				result.total_rows = user_alldocs_response.total_rows;
                */

                result = user_alldocs_response.total_rows;
/*
                List<mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.user>> temp_list = new List<mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.user>>();
				foreach(mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.user> uai in user_alldocs_response.rows)
				{
                }
*/
                return result;
            }
            catch(System.Exception)
            {

            }

            return result;
        }

        public async Task<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.user_role_jurisdiction>> GetJurisdictions() 
		{
            string sort = "by_date_created";
            string search_key = null;
            bool descending = false;
            int skip = 0;
            int take = 25;
			search_key = "";
            string sort_view = "by_date_created";





			try
			{
                System.Text.StringBuilder request_builder = new System.Text.StringBuilder ();
                request_builder.Append (Program.config_couchdb_url);
                request_builder.Append ($"/{Program.db_prefix}jurisdiction/_design/sortable/_view/{sort_view}?");


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

				var user_role_jurisdiction_curl = new cURL("GET", null, request_builder.ToString(), null, Program.config_timer_user_name, Program.config_timer_value);
				string response_from_server = await user_role_jurisdiction_curl.executeAsync ();

                var case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.user_role_jurisdiction>>(response_from_server);

                var result = new mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.user_role_jurisdiction>();
                result.offset = case_view_response.offset;
                result.total_rows = case_view_response.total_rows;

                foreach(mmria.common.model.couchdb.get_sortable_view_response_item<mmria.common.model.couchdb.user_role_jurisdiction> cvi in case_view_response.rows)
                {

                }
                result.total_rows = result.rows.Count;
                return result;
            


				/*
		< HTTP/1.1 200 OK
		< Set-Cookie: AuthSession=YW5uYTo0QUIzOTdFQjrC4ipN-D-53hw1sJepVzcVxnriEw;
		< Version=1; Path=/; HttpOnly
		> ...
		<
		{"ok":true}*/



			}
			catch(System.Exception ex)
			{
				System.Console.WriteLine (ex);

			} 

			return null;
		}

    }
}