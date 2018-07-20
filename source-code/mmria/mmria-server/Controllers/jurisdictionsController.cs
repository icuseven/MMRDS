using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    [Authorize(Policy = "installation_admin,jurisdiction_admin")]
    public class jurisdictionsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

    }
}