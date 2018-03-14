using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.PlatformAbstractions;
using PeterKottas.DotNetCore.WindowsService.Interfaces;
using System.Timers;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Quartz;
using Quartz.Impl;
using System.Diagnostics;
using PeterKottas.DotNetCore.WindowsService;

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

/*
bug\netcoreapp2.0\mmria-server.dll" action:install
Service "mmria.server.Program" ("No description") was already installed. Reinstalling...
Service "mmria.server.Program" ("No description") is already stopped or stop is pending.
Successfully unregistered service "mmria.server.Program" ("No description")
Successfully registered and started service "mmria.server.Program" ("No description")




rm -rf /workspace/test/app/*
cp -rf /workspace/MMRDS/source-code/mmria /workspace/test/app
docker run --rm -it -e DOTNET_CLI_TELEMETRY_OPTOUT=1 -v /workspace/test/app:/app microsoft/dotnet:latest bash -c "dotnet publish /app/mmria/mmria-server/mmria-server.csproj -r ubuntu.16.10-x64"

File: dockerfile                                                                                                                                                                                           
# Build runtime image
FROM microsoft/aspnetcore:2.1.0-preview1
#WORKDIR /mmria-server
COPY ./app/mmria/mmria-server/bin/Debug/netcoreapp2.0/ubuntu.16.10-x64/publish .
ENTRYPOINT ["dotnet", "mmria-server.dll"]



docker build -t mmria_test .

/workspace/test/app/mmria/mmria-server/bin/Debug/netcoreapp2.0/publish


docker run --name mmria-check -d  --publish 8500:80 \
-e geocode_api_key="none" \
-e geocode_api_url="none" \
-e couchdb_url="http://db1.mmria.org" \
-e web_site_url="http://*:9000" \
-e file_root_folder="/workspace/owin/psk/app" \
-e timer_user_name="mmrds" \
-e timer_password="mmrds" \
-e cron_schedule="0 * /1 * * * ?" \
mmria_test 


mmria-server -> /app/mmria/mmria-server/bin/Debug/netcoreapp2.0/ubuntu.16.10-x64/mmria-server.dll
  mmria-server -> /app/mmria/mmria-server/bin/Debug/netcoreapp2.0/ubuntu.16.10-x64/publish/


*/
    public class Program : IMicroService//, IConfiguration
    {
        private IMicroServiceController controller;
/*
IConfiguration.GetSection(string)
IConfiguration.GetChildren()
IConfiguration.GetReloadToken()
IConfiguration.this[string]
 */



        public Program()
        {
            controller = null;
        }

        public Program(IMicroServiceController controller)
        {
            this.controller = controller;
        }


		
		static void AppDomain_UnhandledExceptionHandler(object sender, UnhandledExceptionEventArgs args) 
		{
		   Exception e = (Exception) args.ExceptionObject;
		   Console.WriteLine("AppDomain_UnhandledExceptionHandler caught : " + e.Message);
		}
		
        static bool config_is_service = true;
        public static string config_geocode_api_key;
        public static string config_geocode_api_url;
        public static string config_couchdb_url = "http://localhost:5984";
        public static string config_web_site_url;
        public static string config_file_root_folder;
        public static string config_timer_user_name;
        public static string config_timer_password;
        public static string config_cron_schedule;
        public static string config_export_directory;

        public static bool is_processing_export_queue;
        public static bool is_processing_syncronization;

        
        public static IScheduler sched;
        public static ITrigger check_for_changes_job_trigger;
        public static ITrigger rebuild_queue_job_trigger;
    
        public static Dictionary<string, string> Change_Sequence_List;
        public static int Change_Sequence_Call_Count = 0;
        public static IList<DateTime> DateOfLastChange_Sequence_Call;
        public static string Last_Change_Sequence = null;

        private static IConfiguration configuration = null;

        public static void Main(string[] args)
        {
            AppDomain currentDomain = AppDomain.CurrentDomain;
			currentDomain.UnhandledException += new UnhandledExceptionEventHandler(AppDomain_UnhandledExceptionHandler);

            var fileName = Path.Combine(PlatformServices.Default.Application.ApplicationBasePath, "log.txt");

            configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", true, true)
            .Build();
            


/* 
            IConfiguration configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", true, true)
                .Build();

            https://github.com/PeterKottas/DotNetCore.WindowsService
            https://dotnetthoughts.net/how-to-host-your-aspnet-core-in-a-windows-service/
            */
            File.AppendAllText(fileName, $"\nmain enterd {DateTime.Now}\n");
            File.AppendAllText(fileName, $"Environment.UserInteractive {Environment.UserInteractive}\n");
            //File.AppendAllText(fileName, $"bool.Parse (System.Configuration.ConfigurationManager.AppSettings [\"is_environment_based\"])");
            //File.AppendAllText(fileName, System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"]);
            File.AppendAllText(fileName, $"\nDebugger.IsAttached {Debugger.IsAttached}\n");
            File.AppendAllText(fileName, $"args.Contains(\"--console\") ");
            File.AppendAllText(fileName, args.Contains("--console").ToString());
            if 
            (
                //Environment.UserInteractive || 
                //bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"]) ||
                Debugger.IsAttached || 
                args.Contains("--console")
            ) 
            {
                config_is_service = false;
            }
/*
            var pathToContentRoot = Directory.GetCurrentDirectory();
            if (config_is_service)
            {
                var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
                pathToContentRoot = Path.GetDirectoryName(pathToExe);
            }
 */

            File.AppendAllText(fileName, $"\nconfig_is_service {config_is_service} started\n");

            

            if (config_is_service)
            {
                //host.RunAsService();
                
                ServiceRunner<Program>.Run(config =>
                {

                    config.SetName("MyTestService");


                    var name = config.GetDefaultName();
                    config.Service(serviceConfig =>
                    {
                        serviceConfig.ServiceFactory((extraArguments, controller) =>
                        {
                            return new Program(controller);
                        });

                        serviceConfig.OnStart((service, extraParams) =>
                        {
                            Console.WriteLine("Service {0} started", name);
                            service.Run(new string[0]);
                        });

                        serviceConfig.OnStop(service =>
                        {
                            Console.WriteLine("Service {0} stopped", name);
                            service.Stop();
                        });

                        serviceConfig.OnError(e =>
                        {
                            //File.AppendAllText(fileName, $"Exception: {e.ToString()}\n");
                            Console.WriteLine("Service {0} errored with exception : {1}", name, e.Message);
                        });
                    });
                });

            }
            else
            {
               new Program().Run(args);
            }

        }

        public static IWebHost BuildWebHost(string[] args)
        {

            string web_site_url = configuration["mmria_settings:web_site_url"];


            return WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseUrls(web_site_url)
                .Build();
        }
        public void Run(string[] args)
        {
			this.Start();
            var host = BuildWebHost(args);//, config);
            host.Run();

        }

        public void Shutdown ()
        {
			lock (syncLock) 
			{

				if (sched != null) 
				{
					sched.Clear ();
					sched.Shutdown ();
				}
				System.Console.WriteLine ("Quit command recieved shutting down.");
			}
        }

        public void Stop()
        {
            //Console.WriteLine("I stopped");
             Shutdown ();
        }

        public void Start()
		{


            if (bool.Parse (configuration["mmria_settings:is_environment_based"])) 
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
                Program.config_geocode_api_key = configuration["mmria_settings:geocode_api_key"];
                Program.config_geocode_api_url = configuration["mmria_settings:geocode_api_url"];
                Program.config_couchdb_url = configuration["mmria_settings:couchdb_url"];
                Program.config_web_site_url = configuration["mmria_settings:web_site_url"];
                Program.config_file_root_folder = configuration["mmria_settings:file_root_folder"];
                Program.config_timer_user_name = configuration["mmria_settings:timer_user_name"];
                Program.config_timer_password = configuration["mmria_settings:timer_password"];
                Program.config_cron_schedule = configuration["mmria_settings:cron_schedule"];
                Program.config_export_directory = configuration["mmria_settings:export_directory"];
            }




			Program.DateOfLastChange_Sequence_Call = new List<DateTime> ();
            Program.Change_Sequence_Call_Count++;
            Program.DateOfLastChange_Sequence_Call.Add (DateTime.Now);

            
            StdSchedulerFactory sf = new StdSchedulerFactory ();
			Program.sched = sf.GetScheduler ().Result;
			DateTimeOffset startTime = DateBuilder.NextGivenSecondDate (null, 15);

			IJobDetail check_for_changes_job = JobBuilder.Create<mmria.server.model.check_for_changes_job> ()
																 .WithIdentity ("check_for_changes_job", "group1")
																 .Build ();


			Program.check_for_changes_job_trigger = (ITrigger)TriggerBuilder.Create ()
			                .WithIdentity ("check_for_changes_job_trigger", "group1")
			                .StartAt (startTime)
			                .WithCronSchedule (Program.config_cron_schedule)
			                .Build ();


			DateTimeOffset? check_for_changes_job_ft = sched.ScheduleJob (check_for_changes_job, Program.check_for_changes_job_trigger).Result;



			IJobDetail rebuild_queue_job = JobBuilder.Create<mmria.server.model.rebuild_queue_job> ()
															 .WithIdentity ("rebuild_queue_job", "group2")
															 .Build ();

			string rebuild_queue_job_cron_schedule = "0 0 0 * * ?";// at midnight every 24 hours


			Program.rebuild_queue_job_trigger = (ITrigger)TriggerBuilder.Create ()
			                .WithIdentity ("rebuild_queue_job_trigger", "group2")
			                .StartAt (startTime)
			                .WithCronSchedule (rebuild_queue_job_cron_schedule)
			                .Build ();


			DateTimeOffset? rebuild_queue_job_ft = sched.ScheduleJob (rebuild_queue_job, Program.rebuild_queue_job_trigger).Result;
            

			System.Threading.Tasks.Task.Run
			(
				new Action (async () => 
				{

					bool is_able_to_connect = false;
					try 
					{
						if (!url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET"))
						{
							is_able_to_connect = true;
						}
					} 
					catch (Exception ex) {

					}

                    if(!is_able_to_connect)
							
                    {
                        System.Console.WriteLine("Starup pausing for 1 minute to give database a chance to start");
    					int milliseconds_in_second = 1000;
    					int number_of_seconds = 60;
    					int total_milliseconds = number_of_seconds * milliseconds_in_second;

                        System.Threading.Thread.Sleep(total_milliseconds);/**/
                    }

                    System.Console.WriteLine("Starup/Install Check - start");
                    if 
                    (
                        url_endpoint_exists (Program.config_couchdb_url, null, null, "GET") &&
							!Program.config_timer_user_name.Equals("couchdb_admin_user_name", StringComparison.OrdinalIgnoreCase) &&
							!Program.config_timer_password.Equals ("couchdb_admin_password", StringComparison.OrdinalIgnoreCase) &&
                        !url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET")
                    )
                    {

                        try
                        {
                                new cURL ("PUT", null, Program.config_couchdb_url + $"/_node/nonode@nohost/_config/admins/{Program.config_timer_user_name}", $"\"{Program.config_timer_password}\"", null, null).execute();

                            //new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/mmria_section/app_version", $"\"{Program.config_app_version}\"", Program.config_timer_user_name, Program.config_timer_password).execute();


                                new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/couch_httpd_auth/allow_persistent_cookies", $"\"true\"", Program.config_timer_user_name, Program.config_timer_password).execute();


                                new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/chttpd/bind_address", $"\"0.0.0.0\"", Program.config_timer_user_name, Program.config_timer_password).execute();
                                new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/chttpd/port", $"\"5984\"", Program.config_timer_user_name, Program.config_timer_password).execute();


                                new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/httpd/enable_cors", $"\"true\"", Program.config_timer_user_name, Program.config_timer_password).execute();


                                new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/origins", $"\"*\"", Program.config_timer_user_name, Program.config_timer_password).execute();

                                new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/credentials", $"\"true\"", Program.config_timer_user_name, Program.config_timer_password).execute();

                                new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/headers", $"\"accept, authorization, content-type, origin, referer, cache-control, x-requested-with\"", Program.config_timer_user_name, Program.config_timer_password).execute();

                                new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/cors/methods", $"\"GET, PUT, POST, HEAD, DELETE\"", Program.config_timer_user_name, Program.config_timer_password).execute();

                                new cURL ("PUT", null, Program.config_couchdb_url + "/_users", null, Program.config_timer_user_name, Program.config_timer_password).execute();
                                new cURL ("PUT", null, Program.config_couchdb_url + "/_replicator", null, Program.config_timer_user_name, Program.config_timer_password).execute();
                                new cURL ("PUT", null, Program.config_couchdb_url + "/_global_changes", null, Program.config_timer_user_name, Program.config_timer_password).execute();
                        }
                        catch(Exception ex)
                        {
                            System.Console.WriteLine($"Failed configuration \n{ex}");
                        }
                    }
                    System.Console.WriteLine("Starup/Install Check - end");






					if (

						url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET") //&&
						//Verify_Password (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password)
					) 
					{
						//string current_directory = AppDomain.CurrentDomain.BaseDirectory;
                        //string current_directory = System.IO.Path.Combine(Directory.GetCurrentDirectory(), Program.config_file_root_folder);
                        string current_directory = Directory.GetCurrentDirectory();

                        System.Console.WriteLine("DB Repair Check - start");

						if
						(
							!url_endpoint_exists (Program.config_couchdb_url + "/metadata", Program.config_timer_user_name, Program.config_timer_password)
						) 
						{

							var metadata_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata", null, Program.config_timer_user_name, Program.config_timer_password);
							System.Console.WriteLine ("metadata_curl\n{0}", metadata_curl.execute ());
	
							new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[]}}", Program.config_timer_user_name, Program.config_timer_password).execute ();
							System.Console.WriteLine ("metadata/_security completed successfully");
	
							try 
							{
								string metadata_design_auth = System.IO.File.OpenText (System.IO.Path.Combine(current_directory, "database-scripts/metadata_design_auth.json")).ReadToEnd ();
								var metadata_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_design/auth", metadata_design_auth, Program.config_timer_user_name, Program.config_timer_password);
								metadata_design_auth_curl.execute ();
	
								string metadata_json = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/metadata.json")).ReadToEnd (); ;
								var metadata_json_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z", metadata_json, Program.config_timer_user_name, Program.config_timer_password);
								metadata_json_curl.execute ();
	
							}
							catch (Exception ex) 
							{
								System.Console.WriteLine ("unable to configure metadata:\n", ex);
							}
	
	
							}
	
	
							if (!url_endpoint_exists (Program.config_couchdb_url + "/mmrds", Program.config_timer_user_name, Program.config_timer_password)) 
							{
								var mmrds_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds", null, Program.config_timer_user_name, Program.config_timer_password);
								System.Console.WriteLine ("mmrds_curl\n{0}", mmrds_curl.execute ());
	
								new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\",\"data_analyst\",\"timer\"]}}", Program.config_timer_user_name, Program.config_timer_password).execute ();
								System.Console.WriteLine ("mmrds/_security completed successfully");
	
								try 
								{
								string case_design_sortable = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/case_design_sortable.json")).ReadToEnd ();
									var case_design_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_design/sortable", case_design_sortable, Program.config_timer_user_name, Program.config_timer_password);
									case_design_sortable_curl.execute ();
	
								string case_store_design_auth = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/case_store_design_auth.json")).ReadToEnd ();
									var case_store_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_design/auth", case_store_design_auth, Program.config_timer_user_name, Program.config_timer_password);
									case_store_design_auth_curl.execute ();
	
								}
								catch (Exception ex) 
								{
									System.Console.WriteLine ("unable to configure mmrds database:\n", ex);
								}
							}
	
							if 
							(
								url_endpoint_exists (Program.config_couchdb_url + "/export_queue", Program.config_timer_user_name, Program.config_timer_password)
							) 
							{
								var delete_queue_curl = new cURL ("DELETE", null, Program.config_couchdb_url + "/export_queue", null, Program.config_timer_user_name, Program.config_timer_password);
								System.Console.WriteLine (delete_queue_curl.execute ());
							}
	
	

							try 
							{
								string export_directory = System.Configuration.ConfigurationManager.AppSettings ["export_directory"];
	
								if (System.IO.Directory.Exists (export_directory)) 
								{
									RecursiveDirectoryDelete (new System.IO.DirectoryInfo (export_directory));
								}
	
								System.IO.Directory.CreateDirectory (export_directory);
	
	
							} 
							catch (Exception ex) 
							{
								// do nothing for now
							}
	
							System.Console.WriteLine ("Creating export_queue db.");
							var export_queue_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue", null, Program.config_timer_user_name, Program.config_timer_password);
							System.Console.WriteLine (export_queue_curl.execute ());
							new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue/_security", "{\"admins\":{\"names\":[],\"roles\":[\"abstractor\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\"]}}", Program.config_timer_user_name, Program.config_timer_password).execute ();
	
	
							if
							(
								url_endpoint_exists (Program.config_couchdb_url + "/metadata", Program.config_timer_user_name, Program.config_timer_password) &&
								url_endpoint_exists (Program.config_couchdb_url + "/mmrds", Program.config_timer_user_name, Program.config_timer_password)
							) 
							{
								var sync_curl = new cURL ("GET", null, Program.config_couchdb_url + "/mmrds/_changes", null, Program.config_timer_user_name, Program.config_timer_password);
								string res = sync_curl.execute ();
								mmria.server.model.couchdb.c_change_result latest_change_set = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_change_result> (res);
	
								Program.Last_Change_Sequence = latest_change_set.last_seq;
	
								
								await System.Threading.Tasks.Task.Run
								(
									new Action (async () => {
                                        mmria.server.util.c_document_sync_all sync_all = new mmria.server.util.c_document_sync_all (
                                                                                             Program.config_couchdb_url,
                                                                                             Program.config_timer_user_name,
                                                                                             Program.config_timer_password
                                                                                         );

                                        sync_all.execute ();
                                        Program.StartSchedule ();
                                    })
							 	);
							}

                            System.Console.WriteLine("DB Repair Check - end");
						}
					}
			));

            // ****   Quartz Timer - End

		}


        private bool url_endpoint_exists (string p_target_server, string p_user_name, string p_password, string p_method = "HEAD")
        {
            bool result = false;

            var curl = new cURL (p_method, null, p_target_server, null, p_user_name, p_password);
            try 
            {
                curl.execute ();
                /*
				HTTP/1.1 200 OK
				Cache-Control: must-revalidate
				Content-Type: application/json
				Date: Mon, 12 Aug 2013 01:27:41 GMT
				Server: CouchDB (Erlang/OTP)*/
                result = true;
            } 
            catch (Exception ex) 
            {
                System.Console.WriteLine ($"failed end_point exists check: {p_target_server}\n{ex}");
            }


            return result;
        }


        private bool Verify_Password (string p_target_server, string p_user_name, string p_password)
        {
            bool result = false;

            var curl = new cURL ("GET", null, p_target_server + "/mmrds/_design/auth", null, p_user_name, p_password);
            try
            {
                curl.execute ();
                /*
                HTTP/1.1 200 OK
                Cache-Control: must-revalidate
                Content-Type: application/json
                Date: Mon, 12 Aug 2013 01:27:41 GMT
                Server: CouchDB (Erlang/OTP)*/
                result = true;
            } 
            catch (Exception ex) 
            {
                System.Console.WriteLine ($"failed Verify_Password check: {p_target_server}/mmrds/_design/auth\n{ex}");
            }


            return result;
        }


        private static object syncLock = new object();
        public static void StartSchedule ()
        {
            lock (syncLock)
            {
                if (Program.sched != null && !Program.sched.IsStarted) 
                {



                    Program.sched.Start ();
                }
            }

        }


        public static void PauseSchedule ()
        {
            lock (syncLock)
            {
                if (Program.sched != null) 
                {
                    Program.sched.PauseJob(Program.check_for_changes_job_trigger.JobKey);
                }
            }
        }


        public static void ResumeSchedule ()
        {
            lock (syncLock)
            {
                if (Program.sched != null) 
                {
                    Program.sched.ResumeJob (Program.check_for_changes_job_trigger.JobKey);
                }
            }
        }


        private void RecursiveDirectoryDelete(System.IO.DirectoryInfo baseDir)
        {
            if (!baseDir.Exists)
                return;

            foreach (var dir in baseDir.EnumerateDirectories())
            {
                RecursiveDirectoryDelete(dir);
            }
            baseDir.Delete(true);
        }

    }
}
