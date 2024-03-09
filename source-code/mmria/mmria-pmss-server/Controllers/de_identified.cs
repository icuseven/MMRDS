using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

using  mmria.pmss.server.extension; 
namespace mmria.pmss.server.Controllers;


[Authorize(Roles  = "committee_member")]
[Route("de-identified")]
public sealed class de_identifiedController : Controller
{
    mmria.common.couchdb.OverridableConfiguration configuration;
    mmria.common.couchdb.DBConfigurationDetail db_config;
    string host_prefix = null;
    public de_identifiedController
    (
        IHttpContextAccessor httpContextAccessor, 
        mmria.common.couchdb.OverridableConfiguration _configuration
    )
    {
        configuration = _configuration;
        host_prefix = httpContextAccessor.HttpContext.Request.Host.GetPrefix();
        db_config = configuration.GetDBConfig(host_prefix);
    }
    public IActionResult Index()
    {
        TempData["metadata_version"] = configuration.GetString("metadata_version", host_prefix);
        
        return View();
    }
}
