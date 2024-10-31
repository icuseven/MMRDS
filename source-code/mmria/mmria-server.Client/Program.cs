using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Configuration;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Configuration["BaseAddress"] = builder.HostEnvironment.BaseAddress;

builder.Services.AddScoped(sp =>
    new HttpClient
    {
        //BaseAddress = new Uri(builder.Configuration["FrontendUrl"] ?? "https://localhost:5002")
        BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)
    });




await builder.Build().RunAsync();



