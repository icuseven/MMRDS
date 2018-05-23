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
using Akka.Quartz.Actor;
using Swashbuckle.AspNetCore.Swagger;
using Quartz;
using Quartz.Impl;
using Serilog;
using Serilog.Configuration;

namespace mmria.server
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
  
            Program.DateOfLastChange_Sequence_Call = new List<DateTime> ();
            Program.Change_Sequence_Call_Count++;
            Program.DateOfLastChange_Sequence_Call.Add (DateTime.Now);

            Program.config_geocode_api_key = "";
            Program.config_geocode_api_url = "";
            //Program.config_file_root_folder = "wwwroot";          

            if (bool.Parse (Configuration["mmria_settings:is_environment_based"])) 
            {
                Log.Information ("using Environment");
                //Log.Information ("geocode_api_key: {0}", System.Environment.GetEnvironmentVariable ("geocode_api_key"));
                //Log.Information ("geocode_api_url: {0}", System.Environment.GetEnvironmentVariable ("geocode_api_url"));
                Log.Information ("couchdb_url: {0}", System.Environment.GetEnvironmentVariable ("couchdb_url"));
                Log.Information ("web_site_url: {0}", System.Environment.GetEnvironmentVariable ("web_site_url"));
                Log.Information ("export_directory: {0}", System.Environment.GetEnvironmentVariable ("export_directory"));

                //Program.config_geocode_api_key = System.Environment.GetEnvironmentVariable ("geocode_api_key");
                //Program.config_geocode_api_url = System.Environment.GetEnvironmentVariable ("geocode_api_url");
                Program.config_couchdb_url = System.Environment.GetEnvironmentVariable ("couchdb_url");
                Program.config_web_site_url = System.Environment.GetEnvironmentVariable ("web_site_url");
                //Program.config_file_root_folder = System.Environment.GetEnvironmentVariable ("file_root_folder");
                Program.config_timer_user_name = System.Environment.GetEnvironmentVariable ("timer_user_name");
                Program.config_timer_password = System.Environment.GetEnvironmentVariable ("timer_password");
                Program.config_cron_schedule = System.Environment.GetEnvironmentVariable ("cron_schedule");
                Program.config_export_directory = System.Environment.GetEnvironmentVariable ("export_directory") != null ? System.Environment.GetEnvironmentVariable ("export_directory") : "/workspace/export";


            }
            else 
            {
                //Program.config_geocode_api_key = configuration["mmria_settings:geocode_api_key"];
                //Program.config_geocode_api_url = configuration["mmria_settings:geocode_api_url"];
                Program.config_couchdb_url = Configuration["mmria_settings:couchdb_url"];
                Program.config_web_site_url = Configuration["mmria_settings:web_site_url"];
                //Program.config_file_root_folder = configuration["mmria_settings:file_root_folder"];
                Program.config_timer_user_name = Configuration["mmria_settings:timer_user_name"];
                Program.config_timer_password = Configuration["mmria_settings:timer_password"];
                Program.config_cron_schedule = Configuration["mmria_settings:cron_schedule"];
                Program.config_export_directory = Configuration["mmria_settings:export_directory"];
            }


            Log.Information($"Program.config_timer_user_name = {Program.config_timer_user_name}");
            Log.Information($"Logging = {Configuration["Logging:IncludeScopes"]}");
            Log.Information($"Console = {Configuration["Console:LogLevel:Default"]}");


            Program.actorSystem = ActorSystem.Create("mmria-actor-system");
            services.AddSingleton(typeof(ActorSystem), (serviceProvider) => Program.actorSystem);

            ISchedulerFactory schedFact = new StdSchedulerFactory();
            Quartz.IScheduler sched = schedFact.GetScheduler().Result;

            // compute a time that is on the next round minute
            DateTimeOffset runTime = DateBuilder.EvenMinuteDate(DateTimeOffset.UtcNow);

            // define the job and tie it to our HelloJob class
            IJobDetail job = JobBuilder.Create< mmria.server.model.Pulse_job>()
                .WithIdentity("job1", "group1")
                .Build();

            // Trigger the job to run on the next round minute
            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("trigger1", "group1")
                .StartAt(runTime)
                .WithCronSchedule (Program.config_cron_schedule)
                .Build();

            sched.ScheduleJob(job, trigger);

            sched.Start();
 
            var quartzSupervisor = Program.actorSystem.ActorOf(Props.Create<mmria.server.model.actor.QuartzSupervisor>(), "QuartzSupervisor");
            quartzSupervisor.Tell("init");

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

            this.Start();
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

        public void Start()
		{
			System.Threading.Tasks.Task.Run
			(
				new Action (async () => 
				{

					bool is_able_to_connect = false;
					try 
					{
						if (url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET"))
						{
							is_able_to_connect = true;
						}
					} 
					catch (Exception ex) {

					}

                    if(!is_able_to_connect)
							
                    {
                        Log.Information("Starup pausing for 1 minute to give database a chance to start");
    					int milliseconds_in_second = 1000;
    					int number_of_seconds = 60;
    					int total_milliseconds = number_of_seconds * milliseconds_in_second;

                        System.Threading.Thread.Sleep(total_milliseconds);/**/
                    }

                    Log.Information("Starup/Install Check - start");
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
                            Log.Information($"Failed configuration \n{ex}");
                        }
                    }
                    Log.Information("Starup/Install Check - end");


					if (

						url_endpoint_exists (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password, "GET") //&&
						//Verify_Password (Program.config_couchdb_url, Program.config_timer_user_name, Program.config_timer_password)
					) 
					{
                        string current_directory =  AppContext.BaseDirectory;

                        Log.Information("DB Repair Check - start");

						if
						(
							!url_endpoint_exists (Program.config_couchdb_url + "/metadata", Program.config_timer_user_name, Program.config_timer_password)
						) 
						{

							var metadata_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata", null, Program.config_timer_user_name, Program.config_timer_password);
							Log.Information ("metadata_curl\n{0}", metadata_curl.execute ());
	
							new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[]}}", Program.config_timer_user_name, Program.config_timer_password).execute ();
							Log.Information ("metadata/_security completed successfully");
	
							try 
							{
								string metadata_design_auth = System.IO.File.OpenText (System.IO.Path.Combine(current_directory, "database-scripts/metadata_design_auth.json")).ReadToEnd ();
								var metadata_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_design/auth", metadata_design_auth, Program.config_timer_user_name, Program.config_timer_password);
								metadata_design_auth_curl.execute ();
	
								string metadata_json = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/metadata.json")).ReadToEnd (); ;
								var metadata_json_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z", metadata_json, Program.config_timer_user_name, Program.config_timer_password);
								
                                var metadata_result_string = metadata_json_curl.execute ();
                                var metadata_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(metadata_result_string);

                                string metadata_attachment = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/MMRIA_calculations.js")).ReadToEnd (); ;
								var metadata_attachement_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z/mmria-check-code.js", metadata_attachment, Program.config_timer_user_name, Program.config_timer_password);
                                metadata_attachement_curl.AddHeader("If-Match",  metadata_result.rev);

								metadata_result_string = metadata_attachement_curl.execute ();
                                metadata_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(metadata_result_string);

                                metadata_attachment = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/mmria-check-code.js")).ReadToEnd (); ;
								var mmria_check_code_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z/validator.js", metadata_attachment, Program.config_timer_user_name, Program.config_timer_password);
                                mmria_check_code_curl.AddHeader("If-Match",  metadata_result.rev);
								Log.Information($"{mmria_check_code_curl.execute ()}");
/*
                                var replication_json = Newtonsoft.Json.JsonConvert.SerializeObject( new mmria.common.model.couchdb.replication_request(){ source = "metadata", target="de_id" });
                                var replication_request_curl = new cURL("POST", null, Program.config_couchdb_url + "/_replicate", replication_json, Program.config_timer_user_name, Program.config_timer_password);
                                replication_request_curl.execute ();
 */

							}
							catch (Exception ex) 
							{
								Log.Information ("unable to configure metadata:\n", ex);
							}
	
	
						}
	
	
							if (!url_endpoint_exists (Program.config_couchdb_url + "/mmrds", Program.config_timer_user_name, Program.config_timer_password)) 
							{
								var mmrds_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds", null, Program.config_timer_user_name, Program.config_timer_password);
								Log.Information ("mmrds_curl\n{0}", mmrds_curl.execute ());
	
								new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\",\"data_analyst\",\"timer\"]}}", Program.config_timer_user_name, Program.config_timer_password).execute ();
								Log.Information ("mmrds/_security completed successfully");
	
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
									Log.Information ("unable to configure mmrds database:\n", ex);
								}
							}
	
							if 
							(
								url_endpoint_exists (Program.config_couchdb_url + "/export_queue", Program.config_timer_user_name, Program.config_timer_password)
							) 
							{
								var delete_queue_curl = new cURL ("DELETE", null, Program.config_couchdb_url + "/export_queue", null, Program.config_timer_user_name, Program.config_timer_password);
								Log.Information (delete_queue_curl.execute ());
							}
	
	

							try 
							{
								string export_directory = Program.config_export_directory;
	
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
	
							Log.Information ("Creating export_queue db.");
							var export_queue_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue", null, Program.config_timer_user_name, Program.config_timer_password);
							Log.Information (export_queue_curl.execute ());
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
                                        //Program.StartSchedule ();
                                    })
							 	);
							}

                            Log.Information("DB Repair Check - end");
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
                Log.Information ($"failed end_point exists check: {p_target_server}\n{ex}");
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
                Log.Information ($"failed Verify_Password check: {p_target_server}/mmrds/_design/auth\n{ex}");
            }


            return result;
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
