using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers;

[AllowAnonymous] 


public sealed class view_data_summaryController : Controller
{

    public view_data_summaryController()
    {

    }

    [Route("view-data-summary")]
    public IActionResult Index()
    {
        return View();
    }

}
