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
    [Route("api/[controller]")]
	public class case_viewController: ControllerBase 
	{  

        IConfiguration configuration;

        public case_viewController(IConfiguration p_configuration)
        {
            configuration = p_configuration;
        }

        [HttpGet]
        public async Task<mmria.common.model.couchdb.case_view_response> Get
        (
            System.Threading.CancellationToken cancellationToken,
            int skip = 0,
            int take = 25,
            string sort = "by_date_created",
            string search_key = null,
            bool descending = false,
            string case_status = "all",
            string field_selection = "all",
            string pregnancy_relatedness ="all"
        ) 
		{

            var is_identefied_case = true;
            var cvs = new mmria.server.utils.CaseViewSearch
            (
                configuration, 
                User,
                is_identefied_case
            );

            var result = await cvs.execute
            (
                cancellationToken,
                skip,
                take,
                sort,
                search_key,
                descending,
                case_status,
                field_selection,
                pregnancy_relatedness
            );


            return result;
        }



        [HttpGet("record-id-list")]
        public async Task<HashSet<string>> GetExistingRecordIds()
        {
            var result = new HashSet<string>(StringComparer.OrdinalIgnoreCase);


            try
            {
                string request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/_design/sortable/_view/by_date_created?skip=0&take=250000";

                var case_view_curl = new mmria.server.cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                string responseFromServer = await case_view_curl.executeAsync();

                mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

                foreach (mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
                {
                    result.Add(cvi.value.record_id);

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return result;
        }

	} 
}

