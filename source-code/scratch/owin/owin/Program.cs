using System;
using System.Linq;
using System.Collections.Generic;
using System.ServiceProcess;
using System.Threading;
using System.Threading.Tasks;
using Owin;
using System.Net.Http;
using Swashbuckle.Application;
using System.Web.Http;
using Quartz;
using Quartz.Impl;

namespace mmria.server
{
	//sc create MMRIAService binpath = "C:\Program Files (x86)\mmria\MMRIA 17.11.02\mmria-server.exe" start= "demand" DisplayName= "MMRIA Service"
	//sc delete MMRIAService
    class Program : ServiceBase
    {



		static bool config_is_service = true;
        public static string config_app_version;
        public static string config_geocode_api_key;
        public static string config_geocode_api_url;
        public static string config_couchdb_url;
        public static string config_web_site_url;
        public static string config_file_root_folder;
        public static string config_timer_user_name;
        public static string config_timer_password;
        public static string config_cron_schedule;
        public static string config_export_directory;

        public static bool is_processing_export_queue;
        public static bool is_processing_syncronization;


        private static IScheduler sched;
        private static ITrigger check_for_changes_job_trigger;
        private static ITrigger rebuild_queue_job_trigger;

        //public static Dictionary<string, string> Change_Sequence_List;
        public static int Change_Sequence_Call_Count = 0;
        public static IList<DateTime> DateOfLastChange_Sequence_Call;
        public static string Last_Change_Sequence = null;


        // http://www.asp.net/aspnet/samples/owin-katana

        //http://localhost:12345
        //http://localhost:12345/api/values
        //http://localhost:12345/api/geocode?street_address=123 main street&city=los angeles&state=ca&zip=90007
        //http://localhost:12345/api/session?userid=mmrds&password=mmrds
        //http://localhost:12345/api/session?userid=user1&password=password
        //http://localhost:12345/api/session
        //http://localhost:12345/swagger/docs/v1
        //http://localhost:12345/sandbox/index

        public static void Main (string [] args)
        {

            if
			(
					Environment.UserInteractive || 
					bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"]) ||
					System.Diagnostics.Debugger.IsAttached || 
                	args.Contains("--console")
			) 
            {
                config_is_service = false;
            }

/*
            #if (DEBUG)
                config_is_service = false;
            #endif
*/
            if (config_is_service) 
			{
				
                Run (new Program ());
			} 
			else 
			{
                new Program ().OnStart (args);
			}
        }

		protected override void OnStart(string[] args)
        {
#if (FILE_WATCHED)
			Console.WriteLine ("starting file watch.");
			WatchFiles.StartWatch();
#endif

            if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"])) 
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
                System.Console.WriteLine ("using AppSettings");
                System.Console.WriteLine ("geocode_api_key: {0}", System.Configuration.ConfigurationManager.AppSettings ["geocode_api_key"]);
                System.Console.WriteLine ("geocode_api_url: {0}", System.Configuration.ConfigurationManager.AppSettings ["geocode_api_url"]);
                System.Console.WriteLine ("couchdb_url: {0}", System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"]);
                System.Console.WriteLine ("web_site_url: {0}", System.Configuration.ConfigurationManager.AppSettings ["web_site_url"]);
                System.Console.WriteLine ("export_directory: {0}", System.Configuration.ConfigurationManager.AppSettings ["export_directory"]);


                Program.config_geocode_api_key = System.Configuration.ConfigurationManager.AppSettings ["geocode_api_key"];
                Program.config_geocode_api_url = System.Configuration.ConfigurationManager.AppSettings ["geocode_api_url"];
                Program.config_couchdb_url = System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"];
                Program.config_web_site_url = System.Configuration.ConfigurationManager.AppSettings ["web_site_url"];
                Program.config_file_root_folder = System.Configuration.ConfigurationManager.AppSettings ["file_root_folder"];
                Program.config_timer_user_name = System.Configuration.ConfigurationManager.AppSettings ["timer_user_name"];
                Program.config_timer_password = System.Configuration.ConfigurationManager.AppSettings ["timer_password"];
                Program.config_cron_schedule = System.Configuration.ConfigurationManager.AppSettings ["cron_schedule"];
                Program.config_export_directory = System.Configuration.ConfigurationManager.AppSettings ["export_directory"];

            }

            System.Net.ServicePointManager.CertificatePolicy = new mmria.server.util.NoCheckCertificatePolicy ();

            Program.is_processing_export_queue = false;
            Program.is_processing_syncronization = false;

            /*
			if (!System.IO.Directory.Exists (Program.config_export_directory))
			{

				System.IO.Directory.CreateDirectory (Program.config_export_directory);
			}*/


            // ****   Web Server - Start

			Microsoft.Owin.Hosting.WebApp.Start (Program.config_web_site_url);
            Console.WriteLine ("Web Server Listening at " + Program.config_web_site_url);

			Program.DateOfLastChange_Sequence_Call = new List<DateTime> ();
            Program.Change_Sequence_Call_Count++;
            Program.DateOfLastChange_Sequence_Call.Add (DateTime.Now);

            StdSchedulerFactory sf = new StdSchedulerFactory ();
			Program.sched = sf.GetScheduler ();
			            DateTimeOffset startTime = DateBuilder.NextGivenSecondDate (null, 15);

			IJobDetail check_for_changes_job = JobBuilder.Create<mmria.server.model.check_for_changes_job> ()
																 .WithIdentity ("check_for_changes_job", "group1")
																 .Build ();

			string cron_schedule = Program.config_cron_schedule;


			Program.check_for_changes_job_trigger = (ITrigger)TriggerBuilder.Create ()
			                .WithIdentity ("check_for_changes_job_trigger", "group1")
			                .StartAt (startTime)
			                .WithCronSchedule (cron_schedule)
			                .Build ();


			DateTimeOffset? check_for_changes_job_ft = sched.ScheduleJob (check_for_changes_job, Program.check_for_changes_job_trigger);



			IJobDetail rebuild_queue_job = JobBuilder.Create<mmria.server.model.rebuild_queue_job> ()
															 .WithIdentity ("rebuild_queue_job", "group2")
															 .Build ();

			string rebuild_queue_job_cron_schedule = "0 0 0 * * ?";// at midnight every 24 hours


			Program.rebuild_queue_job_trigger = (ITrigger)TriggerBuilder.Create ()
			                .WithIdentity ("rebuild_queue_job_trigger", "group2")
			                .StartAt (startTime)
			                .WithCronSchedule (rebuild_queue_job_cron_schedule)
			                .Build ();


			DateTimeOffset? rebuild_queue_job_ft = sched.ScheduleJob (rebuild_queue_job, Program.rebuild_queue_job_trigger);


			this.Startup ();


			if (!config_is_service) 
			{
				if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"]))
	            {
	                bool stay_on_till_power_fail = true;

	                while (stay_on_till_power_fail) 
	                {

	                }
	            } 
	            else 
	            {
	                //http://odetocode.com/blogs/scott/archive/2014/02/10/building-a-simple-file-server-with-owin-and-katana.aspx
	                string read_line = Console.ReadLine ();
	                while (string.IsNullOrWhiteSpace (read_line) || read_line.ToLower () != "quit") 
	                {
	                    read_line = Console.ReadLine ();
	                }
	                if (sched != null) 
	                {
	                    sched.Clear ();
	                    sched.Shutdown ();
	                }
	                System.Console.WriteLine ("Quit command recieved shutting down.");
	            }
			}
			




        }


		protected override void OnStop ()
		{
			base.OnStop ();
			this.Shutdown ();  
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


		public void Startup ()
		{
            System.Threading.Tasks.Task.Run
			(
				new Action (() => 
				{
                    
					int milliseconds_in_second = 1000;
					int number_of_seconds = 60;
					int total_milliseconds = number_of_seconds * milliseconds_in_second;

                    System.Threading.Thread.Sleep(total_milliseconds);/**/
                    

                    if 
                    (
                        url_endpoint_exists (Program.config_couchdb_url, null, null, "GET") &&
                        !url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET")
                    )
                    {

                        try
                        {
                                new cURL ("PUT", null, Program.config_couchdb_url + $"/_node/nonode@nohost/_config/admins/{Program.config_timer_user_name}", $"\"{Program.config_timer_password}\"", null, null).execute();

                                new cURL ("PUT", null, Program.config_couchdb_url + "/_node/nonode@nohost/_config/mmria_section/app_version", $"\"bass!\"", Program.config_timer_user_name, Program.config_timer_password).execute();


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







					if (

						url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET") //&&
						//Verify_Password (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password)
					) 
					{
						string current_directory = AppDomain.CurrentDomain.BaseDirectory;
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
								string metadata_design_auth = System.IO.File.OpenText (current_directory + "database-scripts/metadata_design_auth.json").ReadToEnd ();
								var metadata_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_design/auth", metadata_design_auth, Program.config_timer_user_name, Program.config_timer_password);
								metadata_design_auth_curl.execute ();
	
								string metadata_json = System.IO.File.OpenText (current_directory + "database-scripts/metadata.json").ReadToEnd (); ;
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
									string case_design_sortable = System.IO.File.OpenText (current_directory + "database-scripts/case_design_sortable.json").ReadToEnd ();
									var case_design_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_design/sortable", case_design_sortable, Program.config_timer_user_name, Program.config_timer_password);
									case_design_sortable_curl.execute ();
	
									string case_store_design_auth = System.IO.File.OpenText (current_directory + "database-scripts/case_store_design_auth.json").ReadToEnd ();
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
	
								
								System.Threading.Tasks.Task.Run
								(
									new Action (() => {
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



	public class Startup
	{
		public void Configuration(IAppBuilder app)
        {
			//app.Use(typeof(RequestSizeLimitingMiddleware), long.MaxValue);
			string url = null;

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"]))
			{
				url = System.Environment.GetEnvironmentVariable ("web_site_url");
			}
			else
			{
				url = System.Configuration.ConfigurationManager.AppSettings["web_site_url"];
			}


			#if DEBUG
			app.UseErrorPage();
			#endif


			//app.Use(typeof(mmria.util.MiddlewareUrlRewriter));
			//app.UseWelcomePage("/");
			// Configure Web API for self-host. 
			HttpConfiguration config = new HttpConfiguration(); 

			config.Routes.MapHttpRoute( 
				name: "DefaultApi", 
				routeTemplate: "api/{controller}/{id}", 
				defaults: new { id = RouteParameter.Optional } 
			); 

			/*
			config.Routes.MapHttpRoute( 
				name: "DynamicApi", 
				routeTemplate: "api-docs/{controller}/{id}", 
				defaults: new { id = RouteParameter.Optional } 
			); */

			config.Formatters.Clear();
			config.Formatters.Add(new  System.Net.Http.Formatting.JsonMediaTypeFormatter());
			config.Formatters.JsonFormatter.SerializerSettings =
				new Newtonsoft.Json.JsonSerializerSettings
			{
				ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()//,
				//NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore
			};

			//https://github.com/NSwag/NSwag/wiki/Middlewares
			//app.UseSwaggerUi(typeof(Startup).Assembly, new SwaggerUiOwinSettings());
			//app.UseWebApi(config);

            /*
			config
				.EnableSwagger("docs/{apiVersion}/swagger", c => { 
					
					c.SingleApiVersion("v1", "MMRIA data API");

					c.RootUrl(req =>
						req.RequestUri.GetLeftPart(UriPartial.Authority) +
						req.GetRequestContext().VirtualPathRoot.TrimEnd('/'));

					c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First()); 
					//c.DocumentFilter<mmria.server.swashbuckle.Document_Filter>();

				})
				.EnableSwaggerUi("sandbox/{*assetPath}");
			
			config
				.EnableSwagger(c =>
					{
						//c.RootUrl(req => url);
						c.RootUrl(req =>
							req.RequestUri.GetLeftPart(UriPartial.Authority) +
							req.GetRequestContext().VirtualPathRoot.TrimEnd('/'));

						c.Schemes(new[] { "http", "https" });

						c.SingleApiVersion("v1", "Swashbuckle.Dummy")
							.Description("A sample API for testing and prototyping Swashbuckle features")
							.TermsOfService("Some terms")
							.Contact(cc => cc
								.Name("Some contact")
								.Url("http://tempuri.org/contact")
								.Email("some.contact@tempuri.org"))
							.License(lc => lc
								.Name("Some License")
								.Url("http://tempuri.org/license"));
					})
				.EnableSwaggerUi("sandbox/{*assetPath}");*/
            
           

			app.UseWebApi(config); 




			//app.UseSwagger();

			string root = null;

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"]))
			{
				root = System.Environment.GetEnvironmentVariable("file_root_folder");
			}
			else
			{
				root = System.Configuration.ConfigurationManager.AppSettings["file_root_folder"];
			}

			var fileSystem = new Microsoft.Owin.FileSystems.PhysicalFileSystem(root);
			var options = new Microsoft.Owin.StaticFiles.FileServerOptions() 
            {
                EnableDirectoryBrowsing = false,
				EnableDefaultFiles = true,
				DefaultFilesOptions = { DefaultFileNames = {"index.html"}},
				FileSystem = fileSystem,
				StaticFileOptions = { ContentTypeProvider = new CustomContentTypeProvider() 
				}
			};
			app.UseFileServer (options);

		}	
	}
}
