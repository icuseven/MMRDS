

namespace mmria_pmss_server;

class Message
{
    public string Text { get;set; }
}
public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var config = builder.Configuration;

        var db_url = config["mmria_settings:couchdb_url"];
        if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("couchdb_url")))
        {
            db_url = System.Environment.GetEnvironmentVariable ("couchdb_url");
            config["mmria_settings:couchdb_url"] = db_url;
            var timer_user_name = System.Environment.GetEnvironmentVariable ("timer_user_name");
            var timer_value = System.Environment.GetEnvironmentVariable ("timer_password");
            config["mmria_settings:timer_user_name"] = timer_user_name;
            config["mmria_settings:timer_password"] = timer_value;

        }

        builder.Services.AddHttpClient("database_client", c => c.BaseAddress = new Uri($"{db_url}/"));

  
        if(builder.Environment.IsDevelopment())
        {
            builder.Services.AddCors(options => options.AddDefaultPolicy(builder => 
                { 
                    builder.WithOrigins(
                        "http://*:5000");
                }));
        }


        var app = builder.Build();

        var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
        // Add new mappings
        provider.Mappings[".dll"] = "application/octet-stream";
        provider.Mappings[".blat"] = "application/octet-stream";
        provider.Mappings[".dat"] = "application/octet-stream";
        provider.Mappings[".css"] = "text/css";


        var static_content_location = Path.Combine
        (
            Directory.GetCurrentDirectory().Replace("mmria-pmss-server","mmria-pmss-client"),
            "bin",
            "Release",
            "netstandard2.1",
            "browser-wasm",
            "publish",
            "wwwroot"
        );

        if(!builder.Environment.IsDevelopment())
        {
            static_content_location = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        }

            
        app.UseStaticFiles
        (
            
            new StaticFileOptions
            {
            
                FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider
                (
                    static_content_location
                    //Path.Combine("..", "mmria-pmss-client","wwwroot")
                ),
                RequestPath = "",
                ContentTypeProvider = provider
            }
        );
        





        if(builder.Environment.IsDevelopment())
        {
            app.UseCors(builder => builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());
            //.AllowCredentials());
        }


        //app.MapGet("/", () => "Hello World!");

        app.MapGet("/", (HttpRequest request, HttpResponse response) =>
                {
                    response.WriteAsync(System.IO.File.ReadAllText($"{static_content_location}/index.html"));
                    
                });
        app.MapGet("/hello", () => Results.Ok(new Message() {  Text = "Hello World!" }))
            .Produces<Message>();

        app.MapGet("/metadata/mmria-pmss-builder", (IHttpClientFactory httpClientFactory) =>
        {
             var client = httpClientFactory.CreateClient("database_client");

            //var metadata_path = "metadata/mmria-pmss-builder";
            var metadata_path = "metadata/2016-06-12T13:49:24.759Z";

            var result = client.GetFromJsonAsync<mmria.common.metadata.app>(metadata_path).GetAwaiter().GetResult();

            return Results.Ok<mmria.common.metadata.app>(result);
           
        });


        app.MapGet("/metadata/ui_specification", (IHttpClientFactory httpClientFactory) =>
        {
             var client = httpClientFactory.CreateClient("database_client");

            //var metadata_path = "metadata/mmria-pmss-builder";
            var metadata_path = "metadata/default_ui_specification";

            var result = client.GetFromJsonAsync<mmria.common.metadata.UI_Specification>(metadata_path).GetAwaiter().GetResult();

            return Results.Ok<mmria.common.metadata.UI_Specification>(result);
           
        });



        if(builder.Environment.IsDevelopment())
        {
            app.Run(config["mmria_settings:web_site_url"]);
        }
        else
        {
            app.Run("http://*:8080");
        }
        
    }

}
