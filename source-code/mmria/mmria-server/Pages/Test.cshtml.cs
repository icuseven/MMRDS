using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace mmria.blazor.Pages;
public class TestModel : PageModel
{
    private readonly ILogger<TestModel> _logger;

    public TestModel(ILogger<TestModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {
       
    }

}