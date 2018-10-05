using System;
using System.Collections.Generic;
using System.Linq;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

using Microsoft.AspNetCore.Http;
using Akka.Actor;

using mmria.common.model;

namespace mmria.server
{
	[Route("api/[controller]")]
	public class passwordChangeController: ControllerBase 
	{ 
		private IHttpContextAccessor _accessor;
        private ActorSystem _actorSystem;

		public passwordChangeController(IHttpContextAccessor httpContextAccessor, ActorSystem actorSystem)
        {
            _accessor = httpContextAccessor;
            _actorSystem = actorSystem;
        }

		[HttpPost]
        public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post([FromBody] mmria.common.model.couchdb.user user) 
		{ 
			//bool valid_login = false;

			string object_string = null;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			var userName = User.Identities.First(
					u => u.IsAuthenticated && 
					u.HasClaim(c => c.Type == ClaimTypes.Name)).FindFirst(ClaimTypes.Name).Value;


			if("org.couchdb.user:" + userName != user._id)
			{
				return null;
			}


			try
			{
				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				object_string = Newtonsoft.Json.JsonConvert.SerializeObject(user, settings);


				string user_db_url = Program.config_couchdb_url + "/_users/"  + user._id;

				var user_curl = new cURL("PUT", null, user_db_url, object_string, Program.config_timer_user_name, Program.config_timer_password);
				var responseFromServer = await user_curl.executeAsync();
				result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);

				if (result.ok) 
				{
					var Session_Event_Message = new mmria.server.model.actor.Session_Event_Message
					(
						DateTime.Now,
						userName,
						_accessor.HttpContext.Connection.RemoteIpAddress.ToString(),
						mmria.server.model.actor.Session_Event_Message.Session_Event_Message_Action_Enum.password_changed
					);

					_actorSystem.ActorOf(Props.Create<mmria.server.model.actor.Record_Session_Event>()).Tell(Session_Event_Message);

				}

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}

			return result;
		} 

	} 
}

