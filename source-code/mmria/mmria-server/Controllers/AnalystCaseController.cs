using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace mmria.server.Controllers
{
    [Authorize(Roles  = "data_analyst")]
    [Route("analyst-case")]
    public class AnalystCaseController : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        IConfiguration configuration;

        public AnalystCaseController(IAuthorizationService authorizationService, IConfiguration p_configuration)
        {
            _authorizationService = authorizationService;
            configuration = p_configuration;
        }
        public IActionResult Index(string r = "da")
        {

            TempData["metadata_version"] = configuration["mmria_settings:metadata_version"];
            TempData["ui_role_mode"] = r;
            return View();
        }
    }
}