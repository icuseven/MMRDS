using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.pmss.server.Controllers;

[AllowAnonymous] 


public sealed class view_data_summaryController : Controller
{
    private readonly IAuthorizationService _authorizationService;

    public view_data_summaryController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
;
    }

    [Route("view-data-summary")]
    public IActionResult Index()
    {
        return View();
    }

}
