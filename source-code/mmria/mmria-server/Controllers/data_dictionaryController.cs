using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
    [AllowAnonymous] 
    
    
    public class data_dictionaryController : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        //private readonly IDocumentRepository _documentRepository;

        public data_dictionaryController(IAuthorizationService authorizationService)
        {
            _authorizationService = authorizationService;
            //_documentRepository = documentRepository;
        }

        [Route("data-dictionary")]
        public IActionResult Index()
        {
            return View();
        }

        
        [Route("data-dictionary/diff")]
        public IActionResult diff()
        {
            return View();
        }
    }
}