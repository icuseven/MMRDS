using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.pmss.server.Controllers;

[AllowAnonymous] 
[Route("privacy-policy")]

public sealed class privacy_policyController : Controller
{
    public privacy_policyController()
    {
        
    }
    public IActionResult Index()
    {
        return View();
    }
}
