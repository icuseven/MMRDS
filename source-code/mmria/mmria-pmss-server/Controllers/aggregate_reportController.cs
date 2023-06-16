using System;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace mmria.pmss.server.Controllers;

[Authorize(Roles  = "abstractor,data_analyst")]

public sealed class aggregate_reportController : Controller
{
    private readonly IAuthorizationService _authorizationService;
    private IConfiguration configuration;

    public aggregate_reportController(IAuthorizationService authorizationService, IConfiguration p_configuration)
    {
        _authorizationService = authorizationService;
        configuration = p_configuration;
    }
    
    [Route("aggregate-report")]
    public IActionResult Index()
    {
        return View();
    }

    [Route("aggregate-report/pdf")]
    public IActionResult pdf()
    {
        return View();
    }
}
