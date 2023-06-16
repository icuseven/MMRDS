using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.pmss.server.Controllers;

[Authorize(Roles  = "installation_admin")]
[Route("recover-deleted-case")]
public sealed class recover_deleted_caseController : Controller
{
    private readonly IAuthorizationService _authorizationService;
    mmria.common.couchdb.ConfigurationSet ConfigDB;

    public recover_deleted_caseController
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
