using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Dynamic;
using mmria.common;
using Microsoft.Extensions.Configuration;
using Akka.Actor;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server
{
	[Route("api/[controller]")]
    public class caseController: ControllerBase 
	{ 


		private ActorSystem _actorSystem;


 		private readonly IAuthorizationService _authorizationService;
        //private readonly IDocumentRepository _documentRepository;

		public caseController(ActorSystem actorSystem, IAuthorizationService authorizationService)
		{
		    _actorSystem = actorSystem;
			_authorizationService = authorizationService;
    	}
		// GET api/values 
		[HttpGet]
		public async Task<System.Dynamic.ExpandoObject> Get(string case_id) 
		{ 
			try
			{
                string request_string = Program.config_couchdb_url + "/mmrds/_all_docs?include_docs=true";

                if (!string.IsNullOrWhiteSpace (case_id)) 
                {
                    request_string = Program.config_couchdb_url + "/mmrds/" + case_id;

					System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

					request.PreAuthenticate = false;


					if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
					{
						string auth_session_value = this.Request.Cookies["AuthSession"];
						request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
						request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
					}

					System.Net.WebResponse response = (System.Net.HttpWebResponse) await request.GetResponseAsync();
					System.IO.Stream dataStream = response.GetResponseStream ();
					System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
					string responseFromServer = reader.ReadToEnd ();

					var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

					if(mmria.server.util.case_authorization.is_authorized_to_handle_jurisdiction_id(User, result))
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
			} 

			return null;
		} 


		// POST api/values 
        [HttpPost]
		public async Task<mmria.common.model.couchdb.document_put_response> Post
		(
            [FromBody] System.Dynamic.ExpandoObject queue_request
        ) 
		{ 
			string auth_session_token = null;

			string object_string = null;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();


			try
			{

				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				object_string = Newtonsoft.Json.JsonConvert.SerializeObject(queue_request, settings);

				var byName = (IDictionary<string,object>)queue_request;
				var temp_id = byName["_id"]; 
				string id_val = null;

				if(temp_id is DateTime)
				{
					id_val = string.Concat(((DateTime)temp_id).ToString("s"), "Z");
				}
				else
				{
					id_val = temp_id.ToString();
				}


				if(!byName.ContainsKey("jurisdiction_id"))
				{
					byName["jurisdiction_id"] = "/";
				}

				if(!mmria.server.util.case_authorization.is_authorized_to_handle_jurisdiction_id(User, byName["jurisdiction_id"].ToString()))
				{
					Console.Write($"unauthorized PUT {byName["jurisdiction_id"]}: {byName["_id"]}");
					return result;
				}


				// begin - check if doc exists
				try 
				{
					var check_document_curl = new cURL ("GET", null, Program.config_couchdb_url + "/mmrds/" + id_val, null, null, null);
					string document_json = null;
					document_json = await check_document_curl.executeAsync ();
					var check_document_expando_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (document_json);
					IDictionary<string, object> result_dictionary = check_document_expando_object as IDictionary<string, object>;

					if(!mmria.server.util.case_authorization.is_authorized_to_handle_jurisdiction_id(User, check_document_expando_object))
					{
						Console.Write($"unauthorized PUT {result_dictionary["jurisdiction_id"]}: {result_dictionary["_id"]}");
						return result;
					}

				} 
				catch (Exception ex) 
				{
					// do nothing for now document doesn't exsist.
                    System.Console.WriteLine ($"err caseController.Delete\n{ex}");
				}
				// end - check if doc exists




				string metadata_url = Program.config_couchdb_url + "/mmrds/"  + id_val;

				cURL document_curl = new cURL ("PUT", null, metadata_url, object_string, null, null);

                if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                {
                    string auth_session_value = this.Request.Cookies["AuthSession"];
                    document_curl.AddHeader("Cookie", "AuthSession=" + auth_session_value);
                    document_curl.AddHeader("X-CouchDB-WWW-Authenticate", auth_session_value);
                }

                try
                {
                    string responseFromServer = await document_curl.executeAsync();
                    result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
                }
                catch(Exception ex)
                {
                    Console.Write("auth_session_token: {0}", auth_session_token);
                    Console.WriteLine(ex);
                }


				mmria.server.model.actor.ScheduleInfoMessage new_scheduleInfo = new mmria.server.model.actor.ScheduleInfoMessage
				(
					Program.config_cron_schedule,
					Program.config_couchdb_url,
					Program.config_timer_user_name,
					Program.config_timer_password,
					Program.config_export_directory
				);

		/*
				_actorSystem.ActorOf(Props.Create<mmria.server.model.actor.quartz.Process_DB_Synchronization_Set>(), "Process_DB_Synchronization_Set").Tell(new_scheduleInfo);
				_actorSystem.ActorOf(Props.Create<mmria.server.model.actor.quartz.Synchronize_Deleted_Case_Records>(), "Synchronize_Deleted_Case_Records").Tell(new_scheduleInfo);
 */
 				_actorSystem.ActorOf(Props.Create<mmria.server.model.actor.quartz.Process_DB_Synchronization_Set>()).Tell(new_scheduleInfo);
				_actorSystem.ActorOf(Props.Create<mmria.server.model.actor.quartz.Synchronize_Deleted_Case_Records>()).Tell(new_scheduleInfo);

                if (!result.ok)
                {

                }

			}
			catch(Exception ex) 
			{
				Console.Write("auth_session_token: {0}", auth_session_token);
				Console.WriteLine (ex);
			}

			return result;

		} 

		[HttpDelete]
        public async Task<System.Dynamic.ExpandoObject> Delete(string case_id = null, string rev = null) 
        { 
            try
            {
                string request_string = null;

                if (!string.IsNullOrWhiteSpace (case_id) && !string.IsNullOrWhiteSpace (rev)) 
                {
                    request_string = Program.config_couchdb_url + "/mmrds/" + case_id + "?rev=" + rev;
                }
                else 
                {
                    return null;
                }

                var delete_report_curl = new cURL ("DELETE", null, request_string, null);
				var check_document_curl = new cURL ("GET", null, Program.config_couchdb_url + "/mmrds/" + case_id, null, null, null);


                if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                {
                    string auth_session_value = this.Request.Cookies["AuthSession"];
                    delete_report_curl.AddHeader("Cookie", "AuthSession=" + auth_session_value);
                    delete_report_curl.AddHeader("X-CouchDB-WWW-Authenticate", auth_session_value);
                    check_document_curl.AddHeader("Cookie", "AuthSession=" + auth_session_value);
                    check_document_curl.AddHeader("X-CouchDB-WWW-Authenticate", auth_session_value);
                }


					// check if doc exists

				try 
				{
					string document_json = null;
					document_json = await check_document_curl.executeAsync ();
					var check_docuement_curl_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (document_json);
					IDictionary<string, object> result_dictionary = check_docuement_curl_result as IDictionary<string, object>;
					if (result_dictionary.ContainsKey ("_rev")) 
					{
						request_string = Program.config_couchdb_url + "/mmrds/" + case_id + "?rev=" + result_dictionary ["_rev"];
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


				mmria.server.model.actor.ScheduleInfoMessage new_scheduleInfo = new mmria.server.model.actor.ScheduleInfoMessage
				(
					Program.config_cron_schedule,
					Program.config_couchdb_url,
					Program.config_timer_user_name,
					Program.config_timer_password,
					Program.config_export_directory
				);

		

		/*
				_actorSystem.ActorOf(Props.Create<mmria.server.model.actor.quartz.Process_DB_Synchronization_Set>(), "Process_DB_Synchronization_Set").Tell(new_scheduleInfo);
				_actorSystem.ActorOf(Props.Create<mmria.server.model.actor.quartz.Synchronize_Deleted_Case_Records>(), "Synchronize_Deleted_Case_Records").Tell(new_scheduleInfo);
 */
 				_actorSystem.ActorOf(Props.Create<mmria.server.model.actor.quartz.Process_DB_Synchronization_Set>()).Tell(new_scheduleInfo);
				_actorSystem.ActorOf(Props.Create<mmria.server.model.actor.quartz.Synchronize_Deleted_Case_Records>()).Tell(new_scheduleInfo);


                return result;

            }
            catch(Exception ex)
            {
                Console.WriteLine (ex);
            } 

            return null;
        }

/*
		public async Task<IActionResult> OnGetAsync(string documentId)
		{
			Document = _documentRepository.Find(documentId);

			if (Document == null)
			{
				return new NotFoundResult();
			}

			var authorizationResult = await _authorizationService
					.AuthorizeAsync(User, Document, "EditPolicy");

			if (authorizationResult.Succeeded)
			{
				return Page();
			}
			else if (User.Identity.IsAuthenticated)
			{
				return new ForbidResult();
			}
			else
			{
				return new ChallengeResult();
			}
		} 
 */

	} 
}

