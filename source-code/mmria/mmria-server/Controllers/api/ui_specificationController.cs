using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Serilog;
using Serilog.Configuration;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server
{
	[Authorize(Policy = "form_designer")]
	[Route("api/[controller]")]
    public class ui_specificationController: ControllerBase 
	{ 
		public ui_specificationController()
		{
		}

		[HttpGet]
		public async System.Threading.Tasks.Task<IList<mmria.common.metadata.UI_Specification>> Get(string p_urj_id = "default-ui-specification")
		{
			Log.Information  ("Recieved message.");
			var result = new List<mmria.common.metadata.UI_Specification>();

			try
			{
				string ui_specification_url = Program.config_couchdb_url + $"/metadata/" + p_urj_id;
				if(string.IsNullOrWhiteSpace(p_urj_id))
				{
					ui_specification_url = Program.config_couchdb_url + $"/metadata/_all_docs?include_docs=true";

					var case_curl = new cURL("GET", null, ui_specification_url, null, Program.config_timer_user_name, Program.config_timer_password);
					string responseFromServer = await case_curl.executeAsync();


					var ui_specification_list = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<mmria.common.metadata.UI_Specification>> (responseFromServer);



					foreach(var row in ui_specification_list.rows)
					{
						result.Add(row.doc);
					}
					 
				}
				else
				{
					ui_specification_url = Program.config_couchdb_url + $"/metadata/" + p_urj_id;	
					var case_curl = new cURL("GET", null, ui_specification_url, null, Program.config_timer_user_name, Program.config_timer_password);
					string responseFromServer = await case_curl.executeAsync();

					var ui_specification = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.UI_Specification> (responseFromServer);
					result.Add(ui_specification);
				}
                

			}
			catch(Exception ex) 
			{
				Log.Information ($"{ex}");
			}

			return result;
		}


		// POST api/values 
		//[Route("api/metadata")]
		[HttpPost]
		public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post
        (
            [FromBody] mmria.common.metadata.UI_Specification ui_specification
        ) 
		{ 
			string ui_specification_json;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{


				if(ui_specification._id != "default-ui-specification")
				{
					return null;
				}

				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				ui_specification_json = Newtonsoft.Json.JsonConvert.SerializeObject(ui_specification, settings);

				string ui_specification_url = Program.config_couchdb_url + "/metadata/" + ui_specification._id;


				cURL document_curl = new cURL ("PUT", null, ui_specification_url, ui_specification_json, Program.config_timer_user_name, Program.config_timer_password);


                try
                {
                    string responseFromServer = await document_curl.executeAsync();
                    result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
                }
                catch(Exception ex)
                {
                    Log.Information ($"jurisdiction_treeController:{ex}");
                }


				if (!result.ok) 
				{

				}

			}
			catch(Exception ex) 
			{
				Log.Information ($"{ex}");
			}
				
			return result;
		} 


		[HttpDelete]
        public async System.Threading.Tasks.Task<System.Dynamic.ExpandoObject> Delete(string _id = null, string rev = null) 
        { 
            try
            {
                string request_string = null;

                if (
						!string.IsNullOrWhiteSpace (_id) &&
						!string.IsNullOrWhiteSpace (rev)
						&& _id == "default-ui-specification"
				) 
                {
                    request_string = Program.config_couchdb_url + "/metadata/" + _id + "?rev=" + rev;
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


	} 


}

