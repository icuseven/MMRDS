using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
    [AllowAnonymous] 
    [Route("privacy-policy")]
    
    public class privacy_policyController : Controller
    {
        private readonly IAuthorizationService _authorizationService;

        public privacy_policyController(IAuthorizationService authorizationService)
        {
            _authorizationService = authorizationService;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}