using System;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace mmria.server.Controllers
{
    [Authorize(Roles  = "abstractor,data_analyst")]
    [Route("interactive-aggregate-report")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    //https://docs.microsoft.com/en-us/aspnet/core/security/authorization/resourcebased?view=aspnetcore-2.1&tabs=aspnetcore2x
    public class interactive_aggregate_reportController : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        private IConfiguration configuration;

        public interactive_aggregate_reportController(IAuthorizationService authorizationService, IConfiguration p_configuration)
        {
            _authorizationService = authorizationService;
            configuration = p_configuration;
        }
        public async Task<IActionResult> Index()
        {
            ViewBag.is_power_bi_user = false;

			var userName = User.Identities.First(
						u => u.IsAuthenticated && 
						u.HasClaim(c => c.Type == ClaimTypes.Name)).FindFirst(ClaimTypes.Name).Value;

			try
			{
				string my_user_url = $"{Program.config_couchdb_url}/_users/org.couchdb.user:{userName}";

				var user_curl = new cURL("GET",null,my_user_url,null, Program.config_timer_user_name, Program.config_timer_value);
				string responseFromServer = await user_curl.executeAsync();

				var user  = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user>(responseFromServer);
				if(!string.IsNullOrEmpty(user.alternate_email))
				{
					ViewBag.is_power_bi_user = true;

                    var temp_string = configuration["mmria_settings:power_bi_aggregate"];
                    
                    if(!string.IsNullOrWhiteSpace(temp_string))
                    {
                        var app_instance_name = configuration["mmria_settings:app_instance_name"];
                        if(!string.IsNullOrWhiteSpace(app_instance_name))
                        {
                            ViewBag.power_bi_link = temp_string.Replace("{prefix}",app_instance_name);
                        }
                        else
                        {
                            ViewBag.power_bi_link = temp_string.Replace("{prefix}","");
                        }
                    }
                    else
                    {
                        ViewBag.power_bi_link = "";
                    }
				}
			}
			catch(Exception ex) 
			{
				System.Console.WriteLine ($"{ex}");
			}


            return View();
        }
    }
}