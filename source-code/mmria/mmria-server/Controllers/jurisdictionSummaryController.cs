using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace mmria.server.Controllers
{
    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    [Authorize(Roles = "installation_admin,cdc_admin")]
    public class jurisdictionSummaryController : Controller
    {
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

    }
}