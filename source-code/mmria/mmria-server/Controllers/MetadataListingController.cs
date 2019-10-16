using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
    [AllowAnonymous] 
    [Route("metadata-listing")]
    
    public class MetadataListing : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        //private readonly IDocumentRepository _documentRepository;

        public MetadataListing(IAuthorizationService authorizationService)
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