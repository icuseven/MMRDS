using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.pmss.server.Controllers;

public sealed class editorController : Controller
{
    public IActionResult Index()
    {
        return View();
    }


    [Authorize]
    public IActionResult Members() {
        return View();
    }
}
