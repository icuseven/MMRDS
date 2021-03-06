using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
    [Authorize(Roles  = "cdc_analyst")]
    [Route("recover-case")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    //https://docs.microsoft.com/en-us/aspnet/core/security/authorization/resourcebased?view=aspnetcore-2.1&tabs=aspnetcore2x
    public class recover_caseController : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        //private readonly IDocumentRepository _documentRepository;

        public recover_caseController(IAuthorizationService authorizationService)
        {
            _authorizationService = authorizationService;
            //_documentRepository = documentRepository;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}