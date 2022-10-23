using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace mmria.server.Controllers;

[Authorize(Roles  = "abstractor")]
public sealed class CaseController : Controller
{
    private readonly IAuthorizationService _authorizationService;
    IConfiguration configuration;

    public CaseController(IAuthorizationService authorizationService, IConfiguration p_configuration)
    {
        _authorizationService = authorizationService;
        configuration = p_configuration;
    }
    public IActionResult Index()
    {

        TempData["metadata_version"] = configuration["mmria_settings:metadata_version"];
        return View();
    }

}
