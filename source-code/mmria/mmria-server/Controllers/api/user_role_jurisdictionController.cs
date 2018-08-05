using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Serilog;
using Serilog.Configuration;

namespace mmria.server
{
	[Route("api/[controller]")]
    public class user_role_jurisdictionController: ControllerBase 
	{ 
		public user_role_jurisdictionController()
		{
		}

		[HttpGet]
		public async System.Threading.Tasks.Task<IList<mmria.common.model.couchdb.user_role_jurisdiction>> Get(string p_urj_id)
		{
			Log.Information  ("Recieved message.");
			var result = new List<mmria.common.model.couchdb.user_role_jurisdiction>();

			try
			{
				string jurisdiction_url = Program.config_couchdb_url + $"/jurisdiction/" + p_urj_id;
				if(string.IsNullOrWhiteSpace(p_urj_id))
				{
					jurisdiction_url = Program.config_couchdb_url + $"/jurisdiction/_all_docs?include_docs=true";

					var case_curl = new cURL("GET", null, jurisdiction_url, null, Program.config_timer_user_name, Program.config_timer_password);
					string responseFromServer = await case_curl.executeAsync();

					//var user_role_list = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user_role_jurisdiction[]> (responseFromServer);

					//var user_role_list_expando_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

					var user_role_list = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user_role_jurisdiction>> (responseFromServer);



					foreach(var row in user_role_list.rows)
					{
						var user_role_jurisdiction = row.doc;

						if
						(
							user_role_jurisdiction.data_type != null &&
							user_role_jurisdiction.data_type == mmria.common.model.couchdb.user_role_jurisdiction.user_role_jursidiction_const &&
							mmria.server.util.authorization_user.is_authorized_to_handle_jurisdiction_id(User, mmria.server.util.ResourceRightEnum.ReadUser, user_role_jurisdiction))
						{
							result.Add(user_role_jurisdiction);
						}						
					}
					 
				}
				else
				{
					jurisdiction_url = Program.config_couchdb_url + $"/jurisdiction/" + p_urj_id;	
					var case_curl = new cURL("GET", null, jurisdiction_url, null, Program.config_timer_user_name, Program.config_timer_password);
					string responseFromServer = await case_curl.executeAsync();

					var user_role_jurisdiction = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user_role_jurisdiction> (responseFromServer);


					if
					(
						user_role_jurisdiction.data_type != null &&
						user_role_jurisdiction.data_type == mmria.common.model.couchdb.user_role_jurisdiction.user_role_jursidiction_const &&
						mmria.server.util.authorization_user.is_authorized_to_handle_jurisdiction_id(User, mmria.server.util.ResourceRightEnum.ReadUser, user_role_jurisdiction)
					)
					{
						result.Add(user_role_jurisdiction);
					}
					

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
            [FromBody] mmria.common.model.couchdb.user_role_jurisdiction user_role_jurisdiction
        ) 
		{ 
			string user_role_jurisdiction_json;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{


				if(!mmria.server.util.authorization_user.is_authorized_to_handle_jurisdiction_id(User, mmria.server.util.ResourceRightEnum.WriteUser, user_role_jurisdiction))
				{
					return null;
				}

				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				user_role_jurisdiction_json = Newtonsoft.Json.JsonConvert.SerializeObject(user_role_jurisdiction, settings);

				string jurisdiction_tree_url = Program.config_couchdb_url + "/jurisdiction/" + user_role_jurisdiction._id;


				cURL document_curl = new cURL ("PUT", null, jurisdiction_tree_url, user_role_jurisdiction_json, Program.config_timer_user_name, Program.config_timer_password);


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

                if (!string.IsNullOrWhiteSpace (_id) && !string.IsNullOrWhiteSpace (rev)) 
                {
                    request_string = Program.config_couchdb_url + "/jurisdiction/" + _id + "?rev=" + rev;
                }
                else 
                {
                    return null;
                }

                var delete_report_curl = new cURL ("DELETE", null, request_string, null, Program.config_timer_user_name, Program.config_timer_password);
				var check_document_curl = new cURL ("GET", null, Program.config_couchdb_url + "/jurisdiction/" + _id, null, Program.config_timer_user_name, Program.config_timer_password);
					// check if doc exists

				try 
				{
					string document_json = null;
					document_json = await check_document_curl.executeAsync ();
					var check_document_curl_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user_role_jurisdiction> (document_json);
					IDictionary<string, object> result_dictionary = check_document_curl_result as IDictionary<string, object>;

					if(!mmria.server.util.authorization_user.is_authorized_to_handle_jurisdiction_id(User, mmria.server.util.ResourceRightEnum.WriteUser, check_document_curl_result))
					{
						return null;
					}

					if (result_dictionary.ContainsKey ("_rev")) 
					{
						request_string = Program.config_couchdb_url + "/jurisdiction/" + _id + "?rev=" + result_dictionary ["_rev"];
						//System.Console.WriteLine ("json\n{0}", object_string);
					}

				} 
				catch (Exception ex) 
				{
					// do nothing for now document doesn't exsist.
                    System.Console.WriteLine ($"err caseController.Delete\n{ex}");
				}

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

