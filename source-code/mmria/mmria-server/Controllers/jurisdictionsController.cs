using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    [Authorize(Roles = "installation_admin,jurisdiction_admin")]
    public class jurisdictionsController : Controller
    {
        public async Task<IActionResult> Index()
        {

            //var request_string = 
            //var user_curl = new cURL("GET",null,request_string,null, Program.config_timer_user_name, Program.config_timer_password);
            //string responseFromServer = await user_curl.executeAsync();

            return View();
        }

    }
}