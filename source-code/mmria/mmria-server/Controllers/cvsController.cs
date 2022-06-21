using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace mmria.server.Controllers
{
    [Authorize(Roles  = "abstractor")]
    [Route("community-vital-signs")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    //https://docs.microsoft.com/en-us/aspnet/core/security/authorization/resourcebased?view=aspnetcore-2.1&tabs=aspnetcore2x
    public class CvsController : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        IConfiguration configuration;

        public CvsController(IAuthorizationService authorizationService, IConfiguration p_configuration)
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
}