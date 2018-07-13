using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    
    public class HomeController : Controller
    {
        [AllowAnonymous] 
        public IActionResult Index()
        {
            return View();
        }


        [Authorize]
        public IActionResult Members() {
            return View();
        }
    }
}