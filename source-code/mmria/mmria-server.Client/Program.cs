using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Http;
using mmria.common.couchdb;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

//builder.Configuration["BaseAddress"] = builder.HostEnvironment.BaseAddress;

var configuration = builder.Configuration;


builder.Services
    .AddTransient<CookieHandler>()
    .AddScoped(sp => sp
        .GetRequiredService<IHttpClientFactory>()
        .CreateClient("API"))
    .AddHttpClient("API", client => client.BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)).AddHttpMessageHandler<CookieHandler>();

builder.Services.AddScoped<CookieStorageAccessor>();
builder.Services.AddSingleton<IConfiguration>(configuration);




await builder.Build().RunAsync();



