using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]

    [Route("form-designer")]
    public class form_designerController : Controller
    {
        [Authorize(Roles = "form_designer")]
        public IActionResult Index()
        {
            return View();
        }
    }
}