using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.PlatformAbstractions;
using System.Timers;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
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

*/
    public partial class Program
    {
        static bool config_is_service = true;
        public static string config_geocode_api_key;
        public static string config_geocode_api_url;
        public static string config_couchdb_url = "http://localhost:5984";
        public static string config_web_site_url;
        //public static string config_file_root_folder;
        public static string config_timer_user_name;
        public static string config_timer_password;
        public static string config_cron_schedule;
        public static string config_export_directory;


        public static int config_password_minimum_length = 8;
        public static int config_password_days_before_expires = 0;
        public static int config_password_days_before_user_is_notified_of_expiration = 0;
        public static bool config_EMAIL_USE_AUTHENTICATION = true;
        public static bool config_EMAIL_USE_SSL = true;
        public static string config_SMTP_HOST = null;
        public static int config_SMTP_PORT = 587;
        public static string config_EMAIL_FROM = null;
        public static string config_EMAIL_PASSWORD = null;
        public static int config_default_days_in_effective_date_interval = 90;
        public static int config_unsuccessful_login_attempts_number_before_lockout = 5;
        public static int config_unsuccessful_login_attempts_within_number_of_minutes = 120;
        public static int config_unsuccessful_login_attempts_lockout_number_of_minutes = 15;



        
        public static Akka.Actor.ActorSystem actorSystem;
        public static IScheduler sched;
        public static ITrigger check_for_changes_job_trigger;
        public static ITrigger rebuild_queue_job_trigger;
    
        public static Dictionary<string, string> Change_Sequence_List;
        public static int Change_Sequence_Call_Count = 0;
        public static IList<DateTime> DateOfLastChange_Sequence_Call;
        public static string Last_Change_Sequence = null;

        private static IConfiguration configuration = null;


		
		static void AppDomain_UnhandledExceptionHandler(object sender, UnhandledExceptionEventArgs args) 
		{
		   Exception e = (Exception) args.ExceptionObject;
		   Console.WriteLine("AppDomain_UnhandledExceptionHandler caught : " + e.Message);
		}

        public static IWebHost BuildWebHost(string[] p_args)
        {

            string web_site_url = configuration["mmria_settings:web_site_url"];


            return WebHost.CreateDefaultBuilder(p_args)
                .UseStartup<Startup>()
                .UseUrls(web_site_url)
                .Build();
        }





    }
}
