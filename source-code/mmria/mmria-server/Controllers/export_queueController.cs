using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers;
public sealed class export_queueController : Controller
{
    private readonly IAuthorizationService _authorizationService;

    public export_queueController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;

    }
    public IActionResult Index()
    {
        return View();
    }
}
