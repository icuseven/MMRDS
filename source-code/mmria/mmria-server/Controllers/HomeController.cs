using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace AuthorizationLab.Controllers
{
    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    [AllowAnonymous] 
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}