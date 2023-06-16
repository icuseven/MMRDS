using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers;

[Authorize(Roles  = "form_designer")]

public sealed class migrationplanController : Controller
{
    private readonly IAuthorizationService _authorizationService;
 
    public migrationplanController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
     }

    public IActionResult Index()
    {
        return View();
    }


    public IActionResult detail()
    {
        return View();
    }
}
