using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using System.Dynamic;
using mmria.common.functional;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

namespace mmria.server
{
    [Authorize(Roles  = "abstractor, data_analyst")]
    [Route("api/dqr-detail/{quarter_string}")]
	public class dqrReportController: ControllerBase 
	{  

        public struct Result_Struct
        {
            public mmria.server.model.dqr.DQRDetail[] docs;
        }

        struct Selector_Struc
        {
            //public System.Dynamic.ExpandoObject selector;
            public System.Collections.Generic.Dictionary<string,System.Collections.Generic.Dictionary<string,string>> selector;
            public string[] fields;

            public string use_index;

            public int limit;
        }

        IConfiguration configuration;

        public dqrReportController(IConfiguration p_configuration)
        {
            configuration = p_configuration;
        }
		public async Task<Result_Struct> Get(string quarter_string)
		{
			var result = new Result_Struct();
            
            
            var config_couchdb_url = configuration["mmria_settings:couchdb_url"];
            var config_timer_user_name = configuration["mmria_settings:timer_user_name"];
            var config_timer_value = configuration["mmria_settings:timer_password"];
            var config_db_prefix = "";
            
            if(!string.IsNullOrWhiteSpace(configuration["mmria_settings:db_prefix"]))
            {
                config_db_prefix = configuration["mmria_settings:db_prefix"];
            }

			try
			{


                var selector_struc = new Selector_Struc();
				selector_struc.selector = new System.Collections.Generic.Dictionary<string,System.Collections.Generic.Dictionary<string,string>>(StringComparer.OrdinalIgnoreCase);
				selector_struc.limit = 10000;
				selector_struc.selector.Add("data_type", new System.Collections.Generic.Dictionary<string,string>(StringComparer.OrdinalIgnoreCase));
				selector_struc.selector["data_type"].Add("$eq", "dqr-detail");
				
                /*
                selector_struc.selector = new System.Collections.Generic.Dictionary<string,System.Collections.Generic.Dictionary<string,string>>(StringComparer.OrdinalIgnoreCase);
				selector_struc.limit = 10000;
				selector_struc.selector.Add("committee_review.pregnancy_relatedness", new System.Collections.Generic.Dictionary<string,string>(StringComparer.OrdinalIgnoreCase));
				selector_struc.selector["committee_review.pregnancy_relatedness"].Add("$eq", p_find_value);
                */


                Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				string selector_struc_string = Newtonsoft.Json.JsonConvert.SerializeObject (selector_struc, settings);



                string find_url = $"{config_couchdb_url}/{config_db_prefix}report/_find";
				var case_curl = new cURL("POST", null, find_url, selector_struc_string, config_timer_user_name, config_timer_value);
				string responseFromServer = await case_curl.executeAsync();

                result = Newtonsoft.Json.JsonConvert.DeserializeObject<Result_Struct>(responseFromServer);
				
			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}

    		return result;
		}




	} 
}

