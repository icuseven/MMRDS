using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    
    [Authorize(Roles = "installation_admin,jurisdiction_admin")]
    public class _auditController : Controller
    {
        [Route("_audit/{p_id}")]
        public IActionResult Index(string p_id)
        {
            return View();
        }

    }
}