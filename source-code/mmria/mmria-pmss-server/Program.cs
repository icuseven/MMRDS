
using Microsoft.AspNetCore.Builder;
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
        builder.Services.AddHttpClient("base_client", c => c.BaseAddress = new Uri($"{config["mmria_settings:web_site_url"]}/"));

        //builder.Services.AddRazorPages();
        //builder.Services.AddControllersWithViews();
        builder.Services.AddMvc();
        builder.Services.AddRazorPages();
        builder.Services.AddServerSideBlazor();
        //builder.Services.AddControllersWithViews();//.AddNewtonsoftJson();
        builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

        builder.WebHost.UseStaticWebAssets();


        var app = builder.Build();




        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            //app.UseWebAssemblyDebugging();
            app.UseExceptionHandler("/Home/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            //app.UseHsts();
        }

        //app.UseHttpsRedirection();
        //app.UseStaticFiles();

        var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
        // Add new mappings
        provider.Mappings[".dll"] = "application/octet-stream";
        provider.Mappings[".blat"] = "application/octet-stream";
        provider.Mappings[".dat"] = "application/octet-stream";
        provider.Mappings[".css"] = "text/css";
        provider.Mappings[".js"] = "text/javascript";

/*
        var static_content_location = Path.Combine
            (
                Directory.GetCurrentDirectory(),
                "wwwroot"
            );
*/

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

        app.UseStaticFiles
        (
            
            new StaticFileOptions
            {
            
                FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider
                (
                    //static_content_location
                    //Path.Combine("..", "mmria-pmss-client","wwwroot")
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")
                ),
                RequestPath = "",
                ContentTypeProvider = provider
            }
        );
   
        


        app.UseRouting();

        app.UseAuthorization();


        //app.MapRazorPages();

        //app.MapBlazorHub();
/*
        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");*/


        app.MapRazorPages();
        app.MapControllerRoute
        (
            "default", 
            "{controller=Home}/{action=Index}"
        );
        app.MapBlazorHub();
        //app.MapFallbackToFile("index.html");
        app.UseDefaultFiles();
        
        

        app.Run(config["mmria_settings:web_site_url"]);
        
    }

}

