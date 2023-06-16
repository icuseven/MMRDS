using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.pmss.server.Controllers;

[Authorize(Roles  = "form_designer,cdc_analyst")]
[Route("manage-substance-lists")]
public sealed class manageSubstanceListsController : Controller
{
    private readonly IAuthorizationService _authorizationService;

    public manageSubstanceListsController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;

    }
    public IActionResult Index()
    {
        return View();
    }
}
