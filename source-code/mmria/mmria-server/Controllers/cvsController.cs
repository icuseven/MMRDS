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
        public class CVS_View_Model
        {
            public CVS_View_Model(){}
            public string c_geoid {get;set;}
            public string t_geoid {get;set;}
            public string year {get;set;}
        }
        private readonly IAuthorizationService _authorizationService;
        IConfiguration configuration;

        public CvsController(IAuthorizationService authorizationService, IConfiguration p_configuration)
        {
            _authorizationService = authorizationService;
            configuration = p_configuration;
        }

        [HttpGet]
        public IActionResult Index
        (
            string c_geoid = null,
            string t_geoid = null,
            string year = null
        )
        {

            var model = new CVS_View_Model()
            {
                c_geoid = c_geoid,
                t_geoid = t_geoid,
                year = year
            };

            return View(model);
        }


    }
}