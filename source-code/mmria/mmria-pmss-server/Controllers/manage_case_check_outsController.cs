using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.pmss.server.Controllers;

[Authorize(Roles  = "jurisdiction_admin")]
[Route("manage-case-check-outs")]
public sealed class manage_case_check_outsController : Controller
{
    private readonly IAuthorizationService _authorizationService;
    
    public manage_case_check_outsController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }
    public IActionResult Index()
    {
        return View();
    }
}
