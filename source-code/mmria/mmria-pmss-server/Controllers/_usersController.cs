using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers;
    
[Authorize(Roles = "installation_admin,jurisdiction_admin")]
public sealed class _usersController : Controller
{
    public IActionResult Index()
    {
        return View();
    }

}
