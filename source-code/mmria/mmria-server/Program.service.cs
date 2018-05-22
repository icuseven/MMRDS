using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
//using Microsoft.Extensions.PlatformAbstractions;
using System.Timers;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.WindowsServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Quartz;
using Quartz.Impl;
using System.Diagnostics;
using Serilog;
using Serilog.Configuration;


namespace mmria.server
{
	/*
    action:start
    action:stop
    action:uninstall
    action:install
            username:YOUR_USERNAME, password:YOUR_PASSWORD
            built-in-account:(NetworkService|LocalService|LocalSystem) 

    name:YOUR_NAME
	description:YOUR_DESCRIPTION
    display-name:YOUR_DISPLAY_NAME
    start-immediately:(true|false)

     */
	//dotnet.exe "D:\work-space\MMRDS\source-code\mmria\mmria-server\bin\Debug\netcoreapp2.0\mmria-server.dll" action:install
    //dotnet.exe "D:\work-space\MMRDS\source-code\mmria\mmria-server\bin\Debug\netcoreapp2.0\mmria-server.dll" action:uninstall

    //dotnet publish -c Release -r win10-x64
/*
bug\netcoreapp2.0\mmria-server.dll" action:install
Service "mmria.server.Program" ("No description") was already installed. Reinstalling...
Service "mmria.server.Program" ("No description") is already stopped or stop is pending.
Successfully unregistered service "mmria.server.Program" ("No description")
Successfully registered and started service "mmria.server.Program" ("No description")




rm -rf /workspace/test-core/app/* && \
cp -rf /workspace/MMRDS/source-code/mmria /workspace/test-core/app && \
docker run --rm -it -e DOTNET_CLI_TELEMETRY_OPTOUT=1 -v /workspace/test-core/app:/app microsoft/dotnet:latest bash -c "dotnet publish /app/mmria/mmria-server/mmria-server.csproj -r ubuntu.16.10-x64"

File: dockerfile                                                                                                                                                                                           

# Build runtime image
FROM microsoft/aspnetcore:2.1.0-preview1
#WORKDIR /mmria-server

COPY ./app/mmria/mmria-server/bin/Debug/netcoreapp2.0/ubuntu.16.10-x64/publish .
COPY -f ./appsettings.json .

# Expose port 80 for the application.
EXPOSE 80

ENTRYPOINT ["dotnet", "mmria-server.dll", "--use_environment"]

docker run --rm -it -e DOTNET_CLI_TELEMETRY_OPTOUT=1 -v /workspace/test-core/app:/app microsoft/dotnet:latest bash -c "dotnet publish /app/mmria/mmria-server/mmria-server.csproj -r ubuntu.16.10-x64"

docker build -t core_test .

/workspace/test-core/app/mmria/mmria-server/bin/Debug/netcoreapp2.0/publish

docker stop mmria-test && docker rm mmria-test && \
docker run --name mmria-test -d  --publish 8080:80 \
-e geocode_api_key="none" \
-e geocode_api_url="none" \
-e couchdb_url="http://localhost:5984" \
-e web_site_url="http://*:80" \
-e file_root_folder="./" \
-e timer_user_name="test" \
-e timer_password="test" \
-e cron_schedule="0 * /1 * * * ?" \
core_test 


    mmria-server -> /app/mmria/mmria-server/bin/Debug/netcoreapp2.0/ubuntu.16.10-x64/mmria-server.dll
    mmria-server -> /app/mmria/mmria-server/bin/Debug/netcoreapp2.0/ubuntu.16.10-x64/publish/

    https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/windows-service?view=aspnetcore-2.0&tabs=aspnetcore2x
 
    https://github.com/PeterKottas/DotNetCore.WindowsService
    https://dotnetthoughts.net/how-to-host-your-aspnet-core-in-a-windows-service/
 
*/
    public partial class Program : WebHostService
    {

        public Program(IWebHost host) : base(host)
        {

        }

        public static void Main(string[] p_args)
        {
            args = p_args;

            AppDomain currentDomain = AppDomain.CurrentDomain;
			currentDomain.UnhandledException += new UnhandledExceptionEventHandler(AppDomain_UnhandledExceptionHandler);

            try
            {

                configuration = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json", true, true)
                .Build();

                Serilog.Log.Logger = new Serilog.LoggerConfiguration()
                .WriteTo.Console()
                //.WriteTo.File(Path.Combine(configuration["mmria_settings:export_directory"],"log.txt"), rollingInterval: RollingInterval.Day)
                .CreateLogger();

                bool isService = true;
                if (Debugger.IsAttached || args.Contains("--console"))
                {
                    isService = false;
                }

                var pathToContentRoot = Directory.GetCurrentDirectory();
                if (isService)
                {
                    var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
                    pathToContentRoot = Path.GetDirectoryName(pathToExe);
                }

                string web_site_url = configuration["mmria_settings:web_site_url"];

                var host = WebHost.CreateDefaultBuilder(args)
                    .UseContentRoot(pathToContentRoot)
                    .UseStartup<Startup>()
                    .UseUrls(web_site_url)
                    //.UseApplicationInsights()
                    .Build();

                Log.Information($"Program config_is_service: {config_is_service}");
                if (isService)
                {
                    host.RunAsCustomService();
                }
                else
                {
                    host.Run();
                }

/*
                configuration = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json", true, true)
                .Build();

                
                Serilog.Log.Logger = new Serilog.LoggerConfiguration()
                .WriteTo.Console()
                .WriteTo.File(Path.Combine(configuration["mmria_settings:export_directory"],"log.txt"), rollingInterval: RollingInterval.Day)
                .CreateLogger();

                if 
                (
                    //Environment.UserInteractive || 
                    //bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"]) ||
                    Debugger.IsAttached || 
                    args.Contains("--use_environment")
                ) 
                {
                    config_is_service = false;
                }

                var pathToContentRoot = AppContext.BaseDirectory;
                if (config_is_service)
                {
                    var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
                    pathToContentRoot = Path.GetDirectoryName(pathToExe);
                }

                Log.Information($"Program config_is_service: {config_is_service}");
                Log.Information("Program.Run without environment");
                new Program().Run(args); */

            }
            catch (System.Exception ex)
            {
                EventLog.WriteEntry("Application", ex.ToString(), EventLogEntryType.Error);
            }

               
        }

/*

        protected override void OnStarting(string[] args)
        {
            base.OnStarting(args);
        }

        protected override void OnStarted()
        {
            base.OnStarted();
            new Program(this.host).Run(args);
        }

        protected override void OnStopping()
        {
            base.OnStopping();
        }

        public void Stop()
        {
            //Console.WriteLine("I stopped");
        }
 
    }
 */

    }
    
    public static class Program_ServiceExtensions
    {
        public static void RunAsCustomService(this IWebHost host)
        {
            var webHostService = new Program(host);
            System.ServiceProcess.ServiceBase.Run(webHostService);
        }
    }

}
