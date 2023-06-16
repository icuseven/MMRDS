using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers;

[Authorize(Roles  = "committee_member")]
[Route("de-identified")]
    public sealed class de_identifiedController : Controller
{
    private readonly IAuthorizationService _authorizationService;

    public de_identifiedController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;

    }
    public IActionResult Index()
    {
        return View();
    }
}
