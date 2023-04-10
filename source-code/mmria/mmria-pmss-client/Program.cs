using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Http;

namespace mmria_pmss_client;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebAssemblyHostBuilder.CreateDefault(args);

        builder.RootComponents.Add<App>("app");

        if(builder.HostEnvironment.IsDevelopment())
        {
            string api_server_uri = string.Empty;
        
            using(var httpClient = new HttpClient()
            {
                BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)
            })
            {
                var config = await httpClient.GetFromJsonAsync<System.Collections.Generic.Dictionary<string,string>>("config.json");
                api_server_uri = config["mmria_settings:web_site_url"];

                Console.WriteLine($"api_server_uri: {api_server_uri}");
                
            }
            

            builder.Services.AddHttpClient("base_client", c => c.BaseAddress = new Uri($"{api_server_uri}/"));
        }
        else
        {
            builder.Services.AddHttpClient("base_client", c => c.BaseAddress = new Uri(builder.HostEnvironment.BaseAddress));

            
        }
        System.Console.WriteLine($"BaseAddress: {builder.HostEnvironment.BaseAddress}");
        
      

        //builder.Services.AddHttpClient("base_client", c => c.BaseAddress = new Uri(builder.HostEnvironment.BaseAddress));
        
        //builder.Services.AddHttpClient("api_client", c => c.BaseAddress = new Uri());
        //builder.Services.AddHttpClient("database_client", c => c.BaseAddress = new Uri("http://localhost:5984/"));
        
/*        
        builder.Services.AddHttpClient<IDatabaseService, DatabaseService>(c => new HttpClient { BaseAddress = new Uri("http://localhost:5984/") });


services.AddHttpClient<ICatalogService, CatalogService>(client =>
{
 client.BaseAddress = new Uri(Configuration["BaseUrl"]);
})
 .AddPolicyHandler(GetRetryPolicy())
 .AddPolicyHandler(GetCircuitBreakerPolicy());

*/

        //builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

        var app = builder.Build();
        
        await app.RunAsync();
    }
}

