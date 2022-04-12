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
    public class overdose_reportController : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        private IConfiguration configuration;

        public overdose_reportController(IAuthorizationService authorizationService, IConfiguration p_configuration)
        {
            _authorizationService = authorizationService;
            configuration = p_configuration;
        }
        
        [Route("overdose-data-summary")]
        public async Task<IActionResult> Index()
        {
            return View();
        }
    
        [Route("overdose-data-summary/pdf")]
        public async Task<IActionResult> pdf()
        {
            return View();
        }
    }
}