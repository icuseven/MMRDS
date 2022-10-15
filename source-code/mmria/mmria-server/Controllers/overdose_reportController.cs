using System;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace mmria.server.Controllers
{
    [Authorize(Roles  = "abstractor,data_analyst")]
    public sealed class overdose_reportController : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        private IConfiguration configuration;

        public overdose_reportController(IAuthorizationService authorizationService, IConfiguration p_configuration)
        {
            _authorizationService = authorizationService;
            configuration = p_configuration;
        }
        
        [Route("overdose-data-summary")]
        public IActionResult Index()
        {
            return View();
        }
    
        [Route("overdose-data-summary/pdf")]
        public IActionResult pdf()
        {
            return View();
        }
    }
}