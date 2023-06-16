using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.pmss.server.Controllers;

[AllowAnonymous] 


public sealed class data_dictionaryController : Controller
{
    private readonly IAuthorizationService _authorizationService;

    public data_dictionaryController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
;
    }

    [Route("data-dictionary")]
    public IActionResult Index()
    {
        return View();
    }

    
    [Route("data-dictionary/diff")]
    public IActionResult diff()
    {
        return View();
    }
}
