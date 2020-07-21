using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
    [Authorize(Roles  = "jurisdiction_admin")]
    [Route("manage-case-check-outs")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    //https://docs.microsoft.com/en-us/aspnet/core/security/authorization/resourcebased?view=aspnetcore-2.1&tabs=aspnetcore2x
    public class manage_case_check_outsController : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        //private readonly IDocumentRepository _documentRepository;

        public manage_case_check_outsController(IAuthorizationService authorizationService)
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