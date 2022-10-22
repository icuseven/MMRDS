using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers;

[Authorize(Roles  = "installation_admin")]
[Route("recover-case")]
public sealed class recover_caseController : Controller
{
    private readonly IAuthorizationService _authorizationService;
    mmria.common.couchdb.ConfigurationSet ConfigDB;

    public recover_caseController
    (
        IAuthorizationService authorizationService, 
        mmria.common.couchdb.ConfigurationSet p_config_db
    )
    {
        _authorizationService = authorizationService;
        ConfigDB = p_config_db;
    }
    public IActionResult Index()
    {
        return View(ConfigDB);
    }
}
