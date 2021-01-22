using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Akka.Actor;
using Akka.DI.Core;
using Akka.DI.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace System.Runtime.CompilerServices
{
    public class IsExternalInit{}
}

namespace mmria.services.vitalsimport
{
    public class Program
    {
        //public static Akka.Actor.ActorSystem actorSystem;

        public static string config_web_site_url = null;
        public static string  couchdb_url;
        public static string db_prefix;
        public static string timer_user_name;
        public static string timer_value;

        public static Dictionary<string, mmria.common.ije.Batch> BatchSet;

        private static IConfiguration configuration;

        public static void Main(string[] args)
        {
            BatchSet = new Dictionary<string, mmria.common.ije.Batch>(StringComparer.OrdinalIgnoreCase);
            
            configuration = new ConfigurationBuilder()
                .SetBasePath(System.IO.Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true, true)
                .AddUserSecrets<Startup>()
                .Build();

                if (bool.Parse (configuration["mmria_settings:is_environment_based"])) 
                {
                    config_web_site_url = System.Environment.GetEnvironmentVariable ("web_site_url");
                    //Program.config_export_directory = System.Environment.GetEnvironmentVariable ("export_directory") != null ? System.Environment.GetEnvironmentVariable ("export_directory") : "/workspace/export";
                    couchdb_url = System.Environment.GetEnvironmentVariable ("couchdb_url");
                    db_prefix = System.Environment.GetEnvironmentVariable ("db_prefix");
                    timer_user_name = System.Environment.GetEnvironmentVariable ("timer_user_name");
                    timer_value = System.Environment.GetEnvironmentVariable ("timer_password");
                    

                    configuration["mmria_settings:web_site_url"] = config_web_site_url;
                    //Program.config_export_directory = configuration["mmria_settings:export_directory"];
                    configuration["mmria_settings:couchdb_url"] = couchdb_url;
                    configuration["mmria_settings:db_prefix"] = db_prefix;
                    configuration["mmria_settings:timer_user_name"] = timer_user_name;
                    configuration["mmria_settings:timer_password"] = timer_value;
                }
                else 
                {
                    config_web_site_url = configuration["mmria_settings:web_site_url"];
                    //Program.config_export_directory = configuration["mmria_settings:export_directory"];
                    couchdb_url = configuration["mmria_settings:couchdb_url"];
                    db_prefix = configuration["mmria_settings:db_prefix"];
                    timer_user_name = configuration["mmria_settings:timer_user_name"];
                    timer_value = configuration["mmria_settings:timer_password"];
                }

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                    webBuilder.UseUrls(config_web_site_url);
                }).ConfigureServices((hostContext, services) =>
                {
                    
                    var collection = new ServiceCollection();
                    collection.AddSingleton<IConfiguration>(configuration);
                    collection.AddLogging();
                    var provider = collection.BuildServiceProvider();

                    var actorSystem = ActorSystem.Create("mmria-actor-system").UseServiceProvider(provider);
                    //actorSystem.ActorOf(actorSystem.DI().Props<RecordsProcessor_Worker.Actors.BatchSupervisor>(), "batch-supervisor");
                    actorSystem.ActorOf<RecordsProcessor_Worker.Actors.BatchSupervisor>("batch-supervisor");
                    
                    services.AddHostedService<Worker>();
                    services.AddSingleton(typeof(ActorSystem), (serviceProvider) => actorSystem);
                });
    }
}
