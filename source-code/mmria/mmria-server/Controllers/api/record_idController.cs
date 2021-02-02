using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using mmria.common.model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace mmria.server
{
	[Route("api/[controller]")]
	public class record_idController: ControllerBase
	{ 
        public record Record_Id_Response
        {
            public bool ok { get; init;}
            public bool is_unique { get; init;}
        }
		public IConfiguration Configuration { get; }
		public record_idController(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		[HttpGet]
		public async Task<Record_Id_Response> Get(string record_id)
		{
            var result = new Record_Id_Response(){ ok = true, is_unique = false };
            try
            {        
				//"2016-06-12T13:49:24.759Z"
                //string request_string = Program.config_couchdb_url + $"/metadata/version_specification-{Configuration["mmria_settings:metadata_version"]}/validator";
				string request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/_design/sortable/_view/by_date_created?skip=0&take=25000";

                var case_view_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                string responseFromServer = await case_view_curl.executeAsync();

                mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

                var temp = new List<mmria.common.model.couchdb.case_view_item>();

                var is_found = false;
                foreach(mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
                {
                    if(!string.IsNullOrWhiteSpace(cvi.value.record_id))
                    {
                        if(cvi.value.record_id.Trim().Equals(record_id.Trim(), StringComparison.OrdinalIgnoreCase))
                        {
                            is_found = true;
                            break;
                        }
                    }
                }

                result = new Record_Id_Response(){ ok = true, is_unique = !is_found };

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}

    		return result;
		} 
		
	} 
}

