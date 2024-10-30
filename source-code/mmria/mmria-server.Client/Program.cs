using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Services.AddScoped(sp =>
    new HttpClient
    {
        //BaseAddress = new Uri(builder.Configuration["FrontendUrl"] ?? "https://localhost:5002")
        BaseAddress = new Uri(builder.Configuration["FrontendUrl"] ?? "http://localhost:12345")
    });




await builder.Build().RunAsync();
