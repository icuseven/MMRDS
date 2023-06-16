using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.pmss.server.Controllers;

[AllowAnonymous] 
[Route("metadata-listing")]

public sealed class metadata_listingController : Controller
{
    private readonly IAuthorizationService _authorizationService;

    public metadata_listingController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }
    public IActionResult Index()
    {
        return View();
    }
}
