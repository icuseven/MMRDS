using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers;

[Authorize(Roles  = "abstractor,data_analyst")]
[Route("d3-report")]
public sealed class d3_reportController : Controller
{
    private readonly IAuthorizationService _authorizationService;

    public d3_reportController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }
    public IActionResult Index()
    {
        return View();
    }
}
