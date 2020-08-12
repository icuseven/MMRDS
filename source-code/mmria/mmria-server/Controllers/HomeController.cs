using System;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Akka.Actor;

namespace mmria.server.Controllers
{
    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    
    public class HomeController : Controller
    {



		private IConfiguration _config;
        
        		public HomeController(IConfiguration p_config)
        {
            _config = p_config;
        }

        public async Task<IActionResult> Index()
        {


			var userName = User.Identities.First(
						u => u.IsAuthenticated && 
						u.HasClaim(c => c.Type == ClaimTypes.Name)).FindFirst(ClaimTypes.Name).Value;


            var days_til_expiration = -1;

			var password_days_before_expires = Program.config_pass_word_days_before_expires;

			if(password_days_before_expires > 0)
			{
				try
				{

					
					var session_event_request_url = $"{Program.config_couchdb_url}/{Program.db_prefix}session/_design/session_event_sortable/_view/by_user_id?startkey=\"{userName}\"&endkey=\"{userName}\"";

					var session_event_curl = new cURL("GET", null, session_event_request_url, null, Program.config_timer_user_name, Program.config_timer_value);
					string response_from_server = await session_event_curl.executeAsync ();

					//var session_event_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_object_key_header<mmria.common.model.couchdb.session_event>>(response_from_server);
					var session_event_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.session_event>>(response_from_server);

					DateTime first_item_date = DateTime.Now;
					DateTime last_item_date = DateTime.Now;

					session_event_response.rows.Sort(new mmria.common.model.couchdb.Compare_Session_Event_By_DateCreated<mmria.common.model.couchdb.session_event>());

					var date_of_last_password_change = DateTime.MinValue;
			
					foreach(var session_event in session_event_response.rows)
					{
						if(session_event.value.action_result == mmria.common.model.couchdb.session_event.session_event_action_enum.password_changed)
						{
							date_of_last_password_change = session_event.value.date_created;
							break;
						}
					}

					if(date_of_last_password_change != DateTime.MinValue)
					{
						days_til_expiration = password_days_before_expires - (int)(DateTime.Now - date_of_last_password_change).TotalDays;
					}
						
					
				}
				catch(Exception ex) 
				{
					System.Console.WriteLine ($"{ex}");
				}
			}




			try
			{
				ViewBag.is_power_bi_user = false;

				string my_user_url = $"{Program.config_couchdb_url}/_users/org.couchdb.user:{userName}";

				var user_curl = new cURL("GET",null,my_user_url,null, Program.config_timer_user_name, Program.config_timer_value);
				string responseFromServer = await user_curl.executeAsync();

				var user  = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user>(responseFromServer);
				if
				(
					!string.IsNullOrEmpty(user.alternate_email)
				)
				{
					ViewBag.is_power_bi_user = true;
				}
			}
			catch(Exception ex) 
			{
				System.Console.WriteLine ($"{ex}");
			}


			ViewBag.sams_is_enabled = _config["sams:is_enabled"];
            ViewBag.days_til_password_expires = days_til_expiration;
			ViewBag.config_password_days_before_expires = password_days_before_expires;


            return View();
		}

    }
}