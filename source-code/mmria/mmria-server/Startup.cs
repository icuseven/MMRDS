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
using Akka.Actor;
using Swashbuckle.AspNetCore.Swagger;

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
            if (bool.Parse (Configuration["mmria_settings:is_environment_based"])) 
            {
                System.Console.WriteLine ("using Environment");
                System.Console.WriteLine ("geocode_api_key: {0}", System.Environment.GetEnvironmentVariable ("geocode_api_key"));
                System.Console.WriteLine ("geocode_api_url: {0}", System.Environment.GetEnvironmentVariable ("geocode_api_url"));
                System.Console.WriteLine ("couchdb_url: {0}", System.Environment.GetEnvironmentVariable ("couchdb_url"));
                System.Console.WriteLine ("web_site_url: {0}", System.Environment.GetEnvironmentVariable ("web_site_url"));
                System.Console.WriteLine ("export_directory: {0}", System.Environment.GetEnvironmentVariable ("export_directory"));

                Program.config_geocode_api_key = System.Environment.GetEnvironmentVariable ("geocode_api_key");
                Program.config_geocode_api_url = System.Environment.GetEnvironmentVariable ("geocode_api_url");
                Program.config_couchdb_url = System.Environment.GetEnvironmentVariable ("couchdb_url");
                Program.config_web_site_url = System.Environment.GetEnvironmentVariable ("web_site_url");
                Program.config_file_root_folder = System.Environment.GetEnvironmentVariable ("file_root_folder");
                Program.config_timer_user_name = System.Environment.GetEnvironmentVariable ("timer_user_name");
                Program.config_timer_password = System.Environment.GetEnvironmentVariable ("timer_password");
                Program.config_cron_schedule = System.Environment.GetEnvironmentVariable ("cron_schedule");
                Program.config_export_directory = System.Environment.GetEnvironmentVariable ("export_directory") != null ? System.Environment.GetEnvironmentVariable ("export_directory") : "/workspace/export";


            }
            else 
            {
                Program.config_geocode_api_key = Configuration["mmria_settings:geocode_api_key"];
                Program.config_geocode_api_url = Configuration["mmria_settings:geocode_api_url"];
                Program.config_couchdb_url = Configuration["mmria_settings:couchdb_url"];
                Program.config_web_site_url = Configuration["mmria_settings:web_site_url"];
                Program.config_file_root_folder = Configuration["mmria_settings:file_root_folder"];
                Program.config_timer_user_name = Configuration["mmria_settings:timer_user_name"];
                Program.config_timer_password = Configuration["mmria_settings:timer_password"];
                Program.config_cron_schedule = Configuration["mmria_settings:cron_schedule"];
                Program.config_export_directory = Configuration["mmria_settings:export_directory"];
            }

            Console.WriteLine($"Program.config_timer_user_name = {Program.config_timer_user_name}");
            Console.WriteLine($"Logging = {Configuration["Logging:IncludeScopes"]}");
            Console.WriteLine($"Console = {Configuration["Console:LogLevel:Default"]}");


            var actorSystem = ActorSystem.Create("mmria-actor-system");
            services.AddSingleton(typeof(ActorSystem), (serviceProvider) => actorSystem);

            services.AddMvc(setupAction: options =>
            {
                options.RespectBrowserAcceptHeader = false; // false by default
            });

            
            //https://docs.microsoft.com/en-us/aspnet/core/tutorials/web-api-help-pages-using-swagger?tabs=netcore-cli
            // Register the Swagger generator, defining one or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "My API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }


            app.UseMvc();


            app.UseDefaultFiles();
            app.UseStaticFiles();

                        //http://localhost:5000/swagger/v1/swagger.json
            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

        }
    }
}
