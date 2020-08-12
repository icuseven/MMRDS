using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Dynamic;
using mmria.common.model;
using Microsoft.Extensions.Configuration;
using Akka.Actor;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace mmria.server
{
	[Authorize(Roles  = "abstractor, data_analyst")]
	[Route("api/[controller]")]
	public class export_queueController: ControllerBase
	{ 

		private ActorSystem _actorSystem;

		public export_queueController(ActorSystem actorSystem)
		{
		    _actorSystem = actorSystem;
    	}


 		[HttpGet]
		// GET api/values 
		//public IEnumerable<master_record> Get() 
        public async System.Threading.Tasks.Task<IEnumerable<export_queue_item>> Get() 
		{ 
			List<export_queue_item> result = new List<export_queue_item>();

			var userName = "";
			if (User.Identities.Any(u => u.IsAuthenticated))
			{
				userName = User.Identities.First(
					u => u.IsAuthenticated && 
					u.HasClaim(c => c.Type == ClaimTypes.Name)).FindFirst(ClaimTypes.Name).Value;
			}


			try
			{
				string request_string = Program.config_couchdb_url + $"/{Program.db_prefix}export_queue/_all_docs?include_docs=true";
				var export_queue_curl = new cURL ("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);

				string responseFromServer = await export_queue_curl.executeAsync();

				IDictionary<string,object> response_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(responseFromServer) as IDictionary<string,object>; 


				IList<object> enumerable_rows = null;


				if(response_result != null && response_result.ContainsKey("rows"))
				{
					enumerable_rows = response_result["rows"] as IList<object>;
				}


				if(enumerable_rows != null)
				foreach(IDictionary<string,object> enumerable_item in enumerable_rows)
				{

					IDictionary<string,object> doc_item = enumerable_item["doc"] as IDictionary<string,object>;

					if(doc_item == null)
					{
						continue;
					}

					export_queue_item item = new export_queue_item();
					try
					{
						item._id = doc_item ["_id"].ToString ();
						item._rev = doc_item ["_rev"].ToString ();
						item._deleted = doc_item .ContainsKey("_deleted") ? doc_item["_deleted"] as bool?: null;
						item.date_created = doc_item["date_created"] as DateTime?;
						item.created_by = doc_item.ContainsKey("created_by") ? doc_item["created_by"] as string: null;
						item.date_last_updated = doc_item["date_last_updated"] as DateTime?;
						item.last_updated_by = doc_item.ContainsKey("last_updated_by")? doc_item["last_updated_by"] as string : null;
						item.file_name = doc_item["file_name"] != null? doc_item["file_name"].ToString() : null;
						item.export_type = doc_item["export_type"] != null? doc_item["export_type"].ToString() : null;
						item.status = doc_item["status"] != null? doc_item["status"].ToString() : null;
					
						if(userName.ToLowerInvariant() == item.created_by.ToLowerInvariant())
						{
							result.Add(item);
						}
						
					}
					catch(Exception ex)
					{
						// do nothing for now
					}
				
				}

				return result;

				/*
		< HTTP/1.1 200 OK
		< Set-Cookie: AuthSession=YW5uYTo0QUIzOTdFQjrC4ipN-D-53hw1sJepVzcVxnriEw;
		< Version=1; Path=/; HttpOnly
		> ...
		<
		{"ok":true}*/



			}
			catch(Exception ex)
			{
				//Console.WriteLine (ex);

			} 

			return null;
		} 



		// POST api/values 
		 [HttpPost]
        public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post([FromBody] export_queue_item queue_item) 
		{ 
			//bool valid_login = false;
			//mmria.common.data.api.Set_Queue_Request queue_request = null;

			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();
			
			var userName = "";
			if (User.Identities.Any(u => u.IsAuthenticated))
			{
				userName = User.Identities.First(
					u => u.IsAuthenticated && 
					u.HasClaim(c => c.Type == ClaimTypes.Name)).FindFirst(ClaimTypes.Name).Value;
			}


			if(queue_item == null)
			try
			{

				using(System.IO.Stream dataStream0 = this.Request.Body)
				{
					//await this.Request.Body.t..Body.CopyToAsync(dataStream0);
					// Open the stream using a StreamReader for easy access.
					dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
					System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
					// Read the content.
					var object_string = reader0.ReadToEnd ();

					queue_item = Newtonsoft.Json.JsonConvert.DeserializeObject<export_queue_item>(object_string);


					
				}

			}
			catch(Exception ex)
			{
				//Console.WriteLine (ex);
			}
 
			if(string.IsNullOrWhiteSpace(queue_item.created_by))
			{
				queue_item.created_by = userName;
			} 

			
			queue_item.last_updated_by = userName;

			//if(queue_request.case_list.Length == 1)
			try
			{
				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				string object_string = Newtonsoft.Json.JsonConvert.SerializeObject (queue_item, settings); 

				string export_queue_request_url = Program.config_couchdb_url + $"/{Program.db_prefix}export_queue/"  +  queue_item._id;

				var export_queue_curl = new cURL ("PUT", null, export_queue_request_url, object_string, Program.config_timer_user_name, Program.config_timer_value);


				string responseFromServer = await export_queue_curl.executeAsync();

				result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
			

				if
				(
					result.ok && 
					(
						queue_item.status.StartsWith("In Queue...", StringComparison.OrdinalIgnoreCase) ||
						queue_item.status.StartsWith ("Deleted", StringComparison.OrdinalIgnoreCase)
					)
				)
				{

					var juris_user_name = User.Claims.Where(c => c.Type == ClaimTypes.Name).FirstOrDefault().Value; 

					mmria.server.model.actor.ScheduleInfoMessage new_scheduleInfo = new mmria.server.model.actor.ScheduleInfoMessage
					(
						Program.config_cron_schedule,
						Program.config_couchdb_url,
						Program.config_timer_user_name,
						Program.config_timer_value,
						Program.config_export_directory,
						juris_user_name,
						Program.metadata_release_version_name

					);

					//_actorSystem.ActorOf(Props.Create<mmria.server.model.actor.quartz.Process_Export_Queue>(), "Process_Export_Queue").Tell(new_scheduleInfo);
					_actorSystem.ActorOf(Props.Create<mmria.server.model.actor.quartz.Process_Export_Queue>()).Tell(new_scheduleInfo);
					//_actorSystem.ActorSelection("akka://mmria-actor-system/user/Process_Export_Queue").Tell(new_scheduleInfo);
				}
				else // if (!result.ok) 
				{

				}

			}
			catch(Exception ex) 
			{
				//Console.Write("auth_session_token: {0}", auth_session_token);
				//Console.WriteLine (ex);
			}

			return result;

		} 

	} 
}

