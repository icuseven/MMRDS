using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.pmss.server.Controllers;

[Authorize(Roles  = "form_designer")]
[Route("version-manager")]
public sealed class version_managerController : Controller
{
    private readonly IAuthorizationService _authorizationService;

    public version_managerController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }
    public IActionResult Index()
    {
        return View();
    }


    [Route("migrate")]
    public IActionResult Migrate()
    {
        return View("migrate");
    }
}
