using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.pmss.server.Controllers;

[Authorize(Roles  = "abstractor, data_analyst")]
[Route("export-queue")]
  
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
