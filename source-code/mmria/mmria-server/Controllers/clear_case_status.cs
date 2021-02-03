using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace mmria.server.Controllers
{
    [Authorize(Roles  = "cdc_analyst")]
    //[Route("clear-case-status")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    //https://docs.microsoft.com/en-us/aspnet/core/security/authorization/resourcebased?view=aspnetcore-2.1&tabs=aspnetcore2x
    public class clear_case_statusController : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        //private readonly IDocumentRepository _documentRepository;

        public clear_case_statusController(IAuthorizationService authorizationService)
        {
            _authorizationService = authorizationService;
            //_documentRepository = documentRepository;
        }
        public IActionResult Index()
        {
            return View();
        }


        public async Task<IActionResult> FindRecord(mmria.server.model.casestatus.CaseStatusRequest Model)
        {
            if (!ModelState.IsValid)
            {
                 View();
            }

            var model = new mmria.server.model.casestatus.CaseStatusRequestResponse();

           return View(model);
        }

        public async Task<IActionResult> ConfirmClearCaseStatusRequest(string _id)
        {
            if (!ModelState.IsValid)
            {
                 View();
            }

            var model = new mmria.server.model.casestatus.CaseStatusDetail();

           return View(model);
        }

        
        public async Task<IActionResult> ClearCaseStatus(string _id)
        {
            if (!ModelState.IsValid)
            {
                 View();
            }

            var model = new mmria.server.model.casestatus.CaseStatusResult();

           return View(model);
        }

    }
}