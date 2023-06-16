using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers;

[Authorize(Roles  = "form_designer, cdc_admin")]
[Route("export-de-identified-list")]
public sealed class export_de_identified_listController : Controller
{
    private readonly IAuthorizationService _authorizationService;

    public export_de_identified_listController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;

    }
    public IActionResult Index()
    {
        return View();
    }
}
