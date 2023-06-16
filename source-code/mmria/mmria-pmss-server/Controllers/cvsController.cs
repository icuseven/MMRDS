using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace mmria.pmss.server.Controllers;

[Authorize(Roles  = "abstractor,data_analyst,committee_member")]
[Route("community-vital-signs")]
public sealed class CvsController : Controller
{
    public sealed class CVS_View_Model
    {
        public CVS_View_Model(){}

        public string lat {get;set;}
        public string lon {get;set;}
        public string year{get;set;}
        public string id {get;set;}

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
        string lat = null,
        string lon = null,
        string year = null,
        string id = null
    )
    {

        var model = new CVS_View_Model()
        {
            lat = lat,
            lon = lon,
            year = year,
            id = id
        };

        return View(model);
    }


}
