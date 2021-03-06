using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
    [Authorize(Roles  = "form_designer")]
    [Route("export-de-identified-list")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    //https://docs.microsoft.com/en-us/aspnet/core/security/authorization/resourcebased?view=aspnetcore-2.1&tabs=aspnetcore2x
    public class export_de_identified_listController : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        //private readonly IDocumentRepository _documentRepository;

        public export_de_identified_listController(IAuthorizationService authorizationService)
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