using System;
using System.Collections.Generic;
using System.Linq;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

using mmria.common.model;

namespace mmria.server
{
	[Authorize(Roles  = "form_designer")]
	[Route("api/[controller]")]
	public class migration_planController: ControllerBase 
	{ 

		[HttpGet]
        public async System.Threading.Tasks.Task<mmria.common.model.couchdb.migration_plan> Get(string id) 
		{ 
			mmria.common.model.couchdb.migration_plan result = null;
			try
			{
				string request_string = this.get_couch_db_url() + "/metadata/" + id;

				var migration_plan_curl = new cURL("PUT", null, request_string, null, Program.config_timer_user_name, Program.config_timer_password);
				var responseFromServer = await migration_plan_curl.executeAsync();

				result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.migration_plan>(responseFromServer);
			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return result; 
		} 

		[HttpPost]
        public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post([FromBody] mmria.common.model.couchdb.migration_plan migration_plan) 
		{ 

			//bool valid_login = false;

			string object_string = null;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{
				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				object_string = Newtonsoft.Json.JsonConvert.SerializeObject(migration_plan, settings);

				if(migration_plan._id == "2016-06-12T13:49:24.759Z") return null;

				string migration_plan_db_url = this.get_couch_db_url() + "/metadata/"  + migration_plan._id;

				var migration_plan_curl = new cURL("PUT", null, migration_plan_db_url, object_string, Program.config_timer_user_name, Program.config_timer_password);
				var responseFromServer = await migration_plan_curl.executeAsync();
				result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);

				if (!result.ok) 
				{

				}

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}

			return result;
		} 

		[HttpDelete]
        public async System.Threading.Tasks.Task<System.Dynamic.ExpandoObject> Delete(string migration_plan_id = null, string rev = null) 
        { 
			if(migration_plan_id == "2016-06-12T13:49:24.759Z") return null;

            try
            {
                string request_string = null;

                if (!string.IsNullOrWhiteSpace (migration_plan_id) && !string.IsNullOrWhiteSpace (rev)) 
                {
                    request_string = Program.config_couchdb_url + "/metadata/" + migration_plan_id + "?rev=" + rev;
                }
                else 
                {
                    return null;
                }

                var delete_report_curl = new cURL ("DELETE", null, request_string, null, Program.config_timer_user_name, Program.config_timer_password);

                string responseFromServer = await delete_report_curl.executeAsync ();;
                var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

                return result;

            }
            catch(Exception ex)
            {
                Console.WriteLine (ex);
            } 

            return null;
        }

		private string get_couch_db_url()
		{
            string result = Program.config_couchdb_url;

			return result;
		}

	} 
}

