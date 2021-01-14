using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

using mmria.common.model;

namespace mmria.server.vitals
{
    public class BatchItem
    {
        public enum StatusEnum
        {
            Init,
            InProcess,
            NewCaseAdded,
            ExistingCaseSkipped,
            ImportFailed
        }
        public StatusEnum Status { get; init;}

        public string CDCUniqueID { get; init;}
        public DateTime? ImportDate { get; init;}
        public string ImportFileName { get; init;}
        public string ReportingState { get; init;}
        public string StateOfDeathRecord { get; init;}
        public string DateOfDeath { get; init;}
        public string DateOfBirth { get; init;}
        public string LastName { get; init;}
        public string FirstName { get; init;}
        public string MMRIARecordID { get; init;}

        
        public string StatusDetail { get; init;}

    }
    public class Batch
    {

        public enum StatusEnum
        {
            Init,
            InProcess,
            Finished
        }
        public StatusEnum Status { get; init;}
        public string id { get; init;}

        public string reporting_state { get; init;}
        public string mor_file_name { get; init;}
        public string fet_file_name { get; init;}
        public string nat_file_name { get; init;}
        public DateTime? ImportDate { get; init;}
        public List<BatchItem> record_result { get; init;}

        public string StatusInfo { get; init; }
    }

}


namespace mmria.server
{



	
	[Route("api/[controller]")]
	public class ije_messageController: ControllerBase 
	{ 
        IConfiguration configuration;
        public ije_messageController(IConfiguration p_configuration)
        {
            configuration = p_configuration;
        }
		
        [Authorize(Roles  = "cdc_analyst")]
		[HttpGet]
		public async Task<IList<mmria.server.vitals.Batch>> Get(string case_id) 
		{ 
            IList<mmria.server.vitals.Batch> result = null;

            /*
			try
			{
                string request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/_all_docs?include_docs=true";

                if (!string.IsNullOrWhiteSpace (case_id)) 
                {
                    request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/{case_id}";
					var case_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
					string responseFromServer = await case_curl.executeAsync();

					var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

					if(mmria.server.util.authorization_case.is_authorized_to_handle_jurisdiction_id(User, mmria.server.util.ResourceRightEnum.ReadCase, result))
					{
						return result;
					}
					else
					{
						return null;
					}

                } 

			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);
			} */

            try
			{
                //var localUrl = "https://localhost:44331/api/Message/IJESet";
                //var message_curl = new mmria.server.cURL("POST", null, localUrl, message);
                //var messge_curl_result = await message_curl.executeAsync();

				string user_db_url = configuration["mmria_settings:vitals_url"].Replace("Message/IJESet", "VitalNotification");

				var user_curl = new cURL("GET", null, user_db_url, null);
				var responseFromServer = await user_curl.executeAsync();
				result = Newtonsoft.Json.JsonConvert.DeserializeObject<IList<mmria.server.vitals.Batch>>(responseFromServer);

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
                
			}


			return result;
		}

		[Authorize(Roles  = "cdc_analyst")]
		[HttpPost]
        public async System.Threading.Tasks.Task<mmria.server.model.NewIJESet_MessageResponse> Post([FromBody] mmria.server.model.NewIJESet_Message ijeset) 
		{ 
			string object_string = null;
			mmria.server.model.NewIJESet_MessageResponse result = new ();

			try
			{
				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				object_string = Newtonsoft.Json.JsonConvert.SerializeObject(ijeset, settings);

				    //var localUrl = "https://localhost:44331/api/Message/IJESet";
                    //var message_curl = new mmria.server.cURL("POST", null, localUrl, message);
                    //var messge_curl_result = await message_curl.executeAsync();

				string user_db_url = configuration["mmria_settings:vitals_url"];

				var user_curl = new cURL("PUT", null, user_db_url, object_string);
				var responseFromServer = await user_curl.executeAsync();
				result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.NewIJESet_MessageResponse>(responseFromServer);

				if (!result.ok) 
				{

				}

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
                result.detail = ex.Message;
                
			}

			return result;
		} 

	} 
}

