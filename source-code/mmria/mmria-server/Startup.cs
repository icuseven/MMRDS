using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace mmria.server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            /*
            if (bool.Parse(System.Configuration.ConfigurationManager.AppSettings["is_environment_based"]))
            {

                Configuration.GetSection(
                    
                System.Console.WriteLine("using Environment");
                System.Console.WriteLine("geocode_api_key: {0}", System.Environment.GetEnvironmentVariable("geocode_api_key"));
                System.Console.WriteLine("geocode_api_url: {0}", System.Environment.GetEnvironmentVariable("geocode_api_url"));
                System.Console.WriteLine("couchdb_url: {0}", System.Environment.GetEnvironmentVariable("couchdb_url"));
                System.Console.WriteLine("web_site_url: {0}", System.Environment.GetEnvironmentVariable("web_site_url"));
                System.Console.WriteLine("export_directory: {0}", System.Environment.GetEnvironmentVariable("export_directory"));

                Program.config_geocode_api_key = System.Environment.GetEnvironmentVariable("geocode_api_key");
                Program.config_geocode_api_url = System.Environment.GetEnvironmentVariable("geocode_api_url");
                Program.config_couchdb_url = System.Environment.GetEnvironmentVariable("couchdb_url");
                Program.config_web_site_url = System.Environment.GetEnvironmentVariable("web_site_url");
                Program.config_file_root_folder = System.Environment.GetEnvironmentVariable("file_root_folder");
                Program.config_timer_user_name = System.Environment.GetEnvironmentVariable("timer_user_name");
                Program.config_timer_password = System.Environment.GetEnvironmentVariable("timer_password");
                Program.config_cron_schedule = System.Environment.GetEnvironmentVariable("cron_schedule");
                Program.config_export_directory = System.Environment.GetEnvironmentVariable("export_directory") != null ? System.Environment.GetEnvironmentVariable("export_directory") : "/workspace/export";


            }
            else
            {
                System.Console.WriteLine("using AppSettings");
                System.Console.WriteLine("geocode_api_key: {0}", System.Configuration.ConfigurationManager.AppSettings["geocode_api_key"]);
                System.Console.WriteLine("geocode_api_url: {0}", System.Configuration.ConfigurationManager.AppSettings["geocode_api_url"]);
                System.Console.WriteLine("couchdb_url: {0}", System.Configuration.ConfigurationManager.AppSettings["couchdb_url"]);
                System.Console.WriteLine("web_site_url: {0}", System.Configuration.ConfigurationManager.AppSettings["web_site_url"]);
                System.Console.WriteLine("export_directory: {0}", System.Configuration.ConfigurationManager.AppSettings["export_directory"]);


                Program.config_geocode_api_key = System.Configuration.ConfigurationManager.AppSettings["geocode_api_key"];
                Program.config_geocode_api_url = System.Configuration.ConfigurationManager.AppSettings["geocode_api_url"];
                Program.config_couchdb_url = System.Configuration.ConfigurationManager.AppSettings["couchdb_url"];
                Program.config_web_site_url = System.Configuration.ConfigurationManager.AppSettings["web_site_url"];
                Program.config_file_root_folder = System.Configuration.ConfigurationManager.AppSettings["file_root_folder"];
                Program.config_timer_user_name = System.Configuration.ConfigurationManager.AppSettings["timer_user_name"];
                Program.config_timer_password = System.Configuration.ConfigurationManager.AppSettings["timer_password"];
                Program.config_cron_schedule = System.Configuration.ConfigurationManager.AppSettings["cron_schedule"];
                Program.config_export_directory = System.Configuration.ConfigurationManager.AppSettings["export_directory"];

            }*/


            Console.WriteLine($"Logging = {Configuration["Logging:IncludeScopes"]}");
            Console.WriteLine($"Console = {Configuration["Console:LogLevel:Default"]}");

            services.AddMvc(setupAction: options =>
            {
                options.RespectBrowserAcceptHeader = false; // false by default
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMvc(/* routes =>
            {
               routes.MapRoute(
                    name: "api",
                    template: "api/[controller]",
                    defaults: new { controller = "Home", action = "PageOne" }); */
  /*
                routes.MapRoute(
                    name: "couch",
                    template: "couch/{controller=couch},{action=Proxy}");

                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}"); 
            }*/);
            app.UseDefaultFiles();
            app.UseStaticFiles();
        }
    }
}
