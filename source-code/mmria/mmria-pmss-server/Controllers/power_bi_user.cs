using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers;

[Authorize(Roles  = "form_designer,power_bi_manager")]
[Route("power-bi-user")]
public sealed class power_bi_userController : Controller
{
    private readonly IAuthorizationService _authorizationService;
 
    public power_bi_userController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }
    public IActionResult Index()
    {
        return View();
    }
}
