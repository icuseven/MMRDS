using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers;

[Authorize(Roles  = "cdc_admin")]
[Route("broadcast-message")]
public sealed class broadcast_messageController : Controller
{
    private readonly IAuthorizationService _authorizationService;

    public broadcast_messageController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }
    public IActionResult Index()
    {
        return View();
    }
}
