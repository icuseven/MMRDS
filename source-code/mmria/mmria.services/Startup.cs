using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Serilog;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Quartz;
using Quartz.Impl;
using Akka.Actor;
using Akka.Quartz.Actor;
using Akka;

namespace mmria.services
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
 
 
        public void ConfigureServices(IServiceCollection services)
        {

            Program.DateOfLastChange_Sequence_Call = new List<DateTime>();
            Program.Change_Sequence_Call_Count++;
            Program.DateOfLastChange_Sequence_Call.Add(DateTime.Now);

            Program.config_geocode_api_key = "";
            Program.config_geocode_api_url = "";

            if (!string.IsNullOrEmpty(Configuration["mmria_settings:is_schedule_enabled"]))
            {
                bool.TryParse(Configuration["mmria_settings:is_schedule_enabled"], out Program.is_schedule_enabled);
            }

            if (!string.IsNullOrEmpty(Configuration["mmria_settings:is_db_check_enabled"]))
            {
                bool.TryParse(Configuration["mmria_settings:is_db_check_enabled"], out Program.is_db_check_enabled);
            }


            if (!string.IsNullOrEmpty(Configuration["mmria_settings:app_instance_name"]))
            {
                Program.app_instance_name = Configuration["mmria_settings:app_instance_name"];
            }

            if (!string.IsNullOrEmpty(Configuration["mmria_settings:metadata_version"]))
            {
                Program.metadata_release_version_name = Configuration["mmria_settings:metadata_version"];
            }


            if (!string.IsNullOrEmpty(Configuration["mmria_settings:power_bi_link"]))
            {
                Program.power_bi_link = Configuration["mmria_settings:power_bi_link"];
            }

            if (!string.IsNullOrEmpty(Configuration["mmria_settings:db_prefix"]))
            {
                Program.db_prefix = Configuration["mmria_settings:db_prefix"];
            }

            if (!string.IsNullOrEmpty(Configuration["mmria_settings:cdc_instance_pull_list"]))
            {
                Program.config_cdc_instance_pull_list = Configuration["mmria_settings:cdc_instance_pull_list"];
            }

            if (!string.IsNullOrEmpty(Configuration["mmria_settings:cdc_instance_pull_db_url"]))
            {
                Program.config_cdc_instance_pull_db_url = Configuration["mmria_settings:cdc_instance_pull_db_url"];
            }


            if (!string.IsNullOrEmpty(Configuration["mmria_settings:vitals_url"]))
            {
                Program.config_vitals_url = Configuration["mmria_settings:vitals_url"];
            }




            var test_int = 0;
            //Program.config_geocode_api_key = configuration["mmria_settings:geocode_api_key"];
            //Program.config_geocode_api_url = configuration["mmria_settings:geocode_api_url"];
            Program.config_couchdb_url = Configuration["mmria_settings:couchdb_url"];
            Program.config_web_site_url = Configuration["mmria_settings:web_site_url"];
            //Program.config_file_root_folder = configuration["mmria_settings:file_root_folder"];
            Program.config_timer_user_name = Configuration["mmria_settings:timer_user_name"];
            Program.config_timer_value = Configuration["mmria_settings:timer_password"];
            Program.config_cron_schedule = Configuration["mmria_settings:cron_schedule"];
            Program.config_export_directory = Configuration["mmria_settings:export_directory"];

            Program.config_session_idle_timeout_minutes = Configuration["mmria_settings:session_idle_timeout_minutes"] != null && int.TryParse(Configuration["mmria_settings:session_idle_timeout_minutes"], out test_int) ? test_int : 30;


            Program.config_pass_word_minimum_length = string.IsNullOrWhiteSpace(Configuration["password_settings:minimum_length"]) ? 8 : int.Parse(Configuration["password_settings:minimum_length"]);
            Program.config_pass_word_days_before_expires = string.IsNullOrWhiteSpace(Configuration["password_settings:days_before_expires"]) ? 0 : int.Parse(Configuration["password_settings:days_before_expires"]);
            Program.config_pass_word_days_before_user_is_notified_of_expiration = string.IsNullOrWhiteSpace(Configuration["password_settings:days_before_user_is_notified_of_expiration"]) ? 0 : int.Parse(Configuration["password_settings:days_before_user_is_notified_of_expiration"]);


            /*
            Program.config_EMAIL_USE_AUTHENTICATION = Configuration["mmria_settings:EMAIL_USE_AUTHENTICATION"];
            Program.config_EMAIL_USE_SSL = Configuration["mmria_settings:EMAIL_USE_SSL"];
            Program.config_SMTP_HOST = Configuration["mmria_settings:SMTP_HOST"];
            Program.config_SMTP_PORT = Configuration["mmria_settings:SMTP_PORT"];
            Program.config_EMAIL_FROM = Configuration["mmria_settings:EMAIL_FROM"];
            Program.config_EMAIL_PASSWORD = Configuration["mmria_settings:EMAIL_PASSWORD"];
            */
            Program.config_default_days_in_effective_date_interval = string.IsNullOrWhiteSpace(Configuration["authentication_settings:default_days_in_effective_date_interval"]) ? 0 : int.Parse(Configuration["authentication_settings:default_days_in_effective_date_interval"]);
            Program.config_unsuccessful_login_attempts_number_before_lockout = string.IsNullOrWhiteSpace(Configuration["authentication_settings:unsuccessful_login_attempts_number_before_lockout"]) ? 5 : int.Parse(Configuration["authentication_settings:unsuccessful_login_attempts_number_before_lockout"]);
            Program.config_unsuccessful_login_attempts_within_number_of_minutes = string.IsNullOrWhiteSpace(Configuration["authentication_settings:unsuccessful_login_attempts_within_number_of_minutes"]) ? 120 : int.Parse(Configuration["authentication_settings:unsuccessful_login_attempts_within_number_of_minutes"]);
            Program.config_unsuccessful_login_attempts_lockout_number_of_minutes = string.IsNullOrWhiteSpace(Configuration["authentication_settings:unsuccessful_login_attempts_lockout_number_of_minutes"]) ? 15 : int.Parse(Configuration["authentication_settings:unsuccessful_login_attempts_lockout_number_of_minutes"]);



            if (bool.Parse(Configuration["mmria_settings:is_environment_based"]))
            {
                Log.Information("using Environment");


                //Log.Information ("geocode_api_key: {0}", System.Environment.GetEnvironmentVariable ("geocode_api_key"));
                //Log.Information ("geocode_api_url: {0}", System.Environment.GetEnvironmentVariable ("geocode_api_url"));
                Log.Information("couchdb_url: {0}", System.Environment.GetEnvironmentVariable("couchdb_url"));
                Log.Information("web_site_url: {0}", System.Environment.GetEnvironmentVariable("web_site_url"));
                Log.Information("export_directory: {0}", System.Environment.GetEnvironmentVariable("export_directory"));

                //Program.config_geocode_api_key = System.Environment.GetEnvironmentVariable ("geocode_api_key");
                //Program.config_geocode_api_url = System.Environment.GetEnvironmentVariable ("geocode_api_url");
                Program.config_couchdb_url = System.Environment.GetEnvironmentVariable("couchdb_url");
                Program.config_web_site_url = System.Environment.GetEnvironmentVariable("web_site_url");
                //Program.config_file_root_folder = System.Environment.GetEnvironmentVariable ("file_root_folder");
                Program.config_timer_user_name = System.Environment.GetEnvironmentVariable("timer_user_name");
                Program.config_timer_value = System.Environment.GetEnvironmentVariable("timer_password");
                Program.config_cron_schedule = System.Environment.GetEnvironmentVariable("cron_schedule");
                Program.config_export_directory = System.Environment.GetEnvironmentVariable("export_directory") != null ? System.Environment.GetEnvironmentVariable("export_directory") : "/workspace/export";

                Configuration["mmria_settings:couchdb_url"]  = Program.config_couchdb_url;
                Configuration["mmria_settings:web_site_url"] = Program.config_web_site_url;

                Configuration["mmria_settings:timer_user_name"] = Program.config_timer_user_name;
                Configuration["mmria_settings:timer_password"] = Program.config_timer_value;
                Configuration["mmria_settings:cron_schedule"] = Program.config_cron_schedule;



                Configuration["mmria_settings:export_directory"] = Program.config_export_directory;

                Program.config_session_idle_timeout_minutes = System.Environment.GetEnvironmentVariable("session_idle_timeout_minutes") != null && int.TryParse(System.Environment.GetEnvironmentVariable("session_idle_timeout_minutes"), out test_int) ? test_int : 30;
                Configuration["mmria_settings:session_idle_timeout_minutes"] = Program.config_session_idle_timeout_minutes.ToString();


                Program.config_pass_word_minimum_length = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("password_minimum_length")) ? 8 : int.Parse(System.Environment.GetEnvironmentVariable("password_minimum_length"));
                Program.config_pass_word_days_before_expires = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("password_days_before_expires")) ? 0 : int.Parse(System.Environment.GetEnvironmentVariable("password_days_before_expires"));
                Program.config_pass_word_days_before_user_is_notified_of_expiration = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("password_days_before_user_is_notified_of_expiration")) ? 0 : int.Parse(System.Environment.GetEnvironmentVariable("password_days_before_user_is_notified_of_expiration"));

                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_endpoint_authorization")))
                {
                Configuration["sams:endpoint_authorization"] = System.Environment.GetEnvironmentVariable("sams_endpoint_authorization");
                }


                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("use_development_settings")))
                {
                Configuration["mmria_settings:is_development"] = System.Environment.GetEnvironmentVariable("use_development_settings");
                }


                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("metadata_version")))
                {
                Configuration["mmria_settings:metadata_version"] = System.Environment.GetEnvironmentVariable("metadata_version");
                Program.metadata_release_version_name = System.Environment.GetEnvironmentVariable("metadata_version");
                }

                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("vitals_url")))
                {
                    Configuration["mmria_settings:vitals_url"] = System.Environment.GetEnvironmentVariable("vitals_url");
                    Program.config_vitals_url = System.Environment.GetEnvironmentVariable("vitals_url");
                }

                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_endpoint_token")))
                {
                Configuration["sams:endpoint_token"] = System.Environment.GetEnvironmentVariable("sams_endpoint_token");
                }


                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_endpoint_user_info")))
                {
                Configuration["sams:endpoint_user_info"] = System.Environment.GetEnvironmentVariable("sams_endpoint_user_info");
                }


                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_endpoint_token_validation")))
                {
                Configuration["sams:token_validation"] = System.Environment.GetEnvironmentVariable("sams_endpoint_token_validation");
                }


                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_endpoint_user_info_sys")))
                {
                Configuration["sams:user_info_sys"] = System.Environment.GetEnvironmentVariable("sams_endpoint_user_info_sys");
                }


                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_client_id")))
                {
                Configuration["sams:client_id"] = System.Environment.GetEnvironmentVariable("sams_client_id");
                }


                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_client_secret")))
                {
                Configuration["sams:client_secret"] = System.Environment.GetEnvironmentVariable("sams_client_secret");
                }

                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_callback_url")))
                {
                Configuration["sams:callback_url"] = System.Environment.GetEnvironmentVariable("sams_callback_url");
                }

                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_logout_url")))
                {
                Configuration["sams:logout_url"] = System.Environment.GetEnvironmentVariable("sams_logout_url");
                }

                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_is_enabled")))
                {
                Configuration["sams:is_enabled"] = System.Environment.GetEnvironmentVariable("sams_is_enabled");
                }


                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("is_schedule_enabled")) && bool.TryParse(System.Environment.GetEnvironmentVariable("is_schedule_enabled"), out Program.is_schedule_enabled))
                {
                Configuration["is_schedule_enabled"] = System.Environment.GetEnvironmentVariable("is_schedule_enabled");
                }

                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("is_db_check_enabled")) && bool.TryParse(System.Environment.GetEnvironmentVariable("is_db_check_enabled"), out Program.is_db_check_enabled))
                {
                Configuration["is_db_check_enabled"] = System.Environment.GetEnvironmentVariable("is_db_check_enabled");
                }


                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("app_instance_name")))
                {
                Configuration["mmria_settings:app_instance_name"] = System.Environment.GetEnvironmentVariable("app_instance_name");
                Program.app_instance_name = Configuration["mmria_settings:app_instance_name"];
                }

                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("power_bi_link")))
                {
                Configuration["mmria_settings:power_bi_link"] = System.Environment.GetEnvironmentVariable("power_bi_link");
                Program.power_bi_link = Configuration["mmria_settings:power_bi_link"];
                }


                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("db_prefix")))
                {
                Configuration["mmria_settings:db_prefix"] = System.Environment.GetEnvironmentVariable("db_prefix");
                Program.db_prefix = Configuration["mmria_settings:db_prefix"];
                }

                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("cdc_instance_pull_list")))
                {
                Configuration["mmria_settings:cdc_instance_pull_list"] = System.Environment.GetEnvironmentVariable("cdc_instance_pull_list");
                Program.config_cdc_instance_pull_list = Configuration["mmria_settings:cdc_instance_pull_list"];
                }


                if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("cdc_instance_pull_db_url")))
                {
                Configuration["mmria_settings:cdc_instance_pull_db_url"] = System.Environment.GetEnvironmentVariable("cdc_instance_pull_db_url");
                Program.config_cdc_instance_pull_db_url = Configuration["mmria_settings:cdc_instance_pull_db_url"];
                }

                /*
                Program.config_EMAIL_USE_AUTHENTICATION = System.Environment.GetEnvironmentVariable ("EMAIL_USE_AUTHENTICATION"); //  = true;
                Program.config_EMAIL_USE_SSL = System.Environment.GetEnvironmentVariable ("EMAIL_USE_SSL"); //  = true;
                Program.config_SMTP_HOST = System.Environment.GetEnvironmentVariable ("SMTP_HOST"); //  = null;
                Program.config_SMTP_PORT = System.Environment.GetEnvironmentVariable ("SMTP_PORT"); //  = 587;
                Program.config_EMAIL_FROM = System.Environment.GetEnvironmentVariable ("EMAIL_FROM"); //  = null;
                Program.config_EMAIL_PASSWORD = System.Environment.GetEnvironmentVariable ("EMAIL_PASSWORD"); //  = null;
                */
                Program.config_default_days_in_effective_date_interval = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("default_days_in_effective_date_interval")) ? 90 : int.Parse(System.Environment.GetEnvironmentVariable("default_days_in_effective_date_interval"));
                Program.config_unsuccessful_login_attempts_number_before_lockout = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_number_before_lockout")) ? 5 : int.Parse(System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_number_before_lockout"));
                Program.config_unsuccessful_login_attempts_within_number_of_minutes = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_within_number_of_minutes")) ? 120 : int.Parse(System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_within_number_of_minutes"));
                Program.config_unsuccessful_login_attempts_lockout_number_of_minutes = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_lockout_number_of_minutes")) ? 15 : int.Parse(System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_lockout_number_of_minutes"));

            }



            Log.Information($"Program.config_timer_user_name = {Program.config_timer_user_name}");
            Log.Information($"Program.config_couchdb_url = {Program.config_couchdb_url}");
            Log.Information($"Program.db_prefix = {Program.db_prefix}");
            Log.Information($"Logging = {Configuration["Logging:IncludeScopes"]}");
            Log.Information($"Console = {Configuration["Console:LogLevel:Default"]}");
            Log.Information("sams:callback_url: {0}", Configuration["sams:callback_url"]);
            Log.Information("sams:activity_name: {0}", Configuration["sams:activity_name"]);
            Log.Information("mmria_settings:is_schedule_enabled: {0}", Configuration["mmria_settings:is_schedule_enabled"]);
            Log.Information("mmria_settings:is_db_check_enabled: {0}", Configuration["mmria_settings:is_db_check_enabled"]);
            Log.Information("mmria_settings:is_development: {0}", Configuration["mmria_settings:is_development"]);
            Log.Information("mmria_settings:metadata_version: {0}", Configuration["mmria_settings:metadata_version"]);
            Log.Information("mmria_settings:power_bi_link: {0}", Configuration["mmria_settings:power_bi_link"]);
            Log.Information("mmria_settings:app_instance_name: {0}", Configuration["mmria_settings:app_instance_name"]);
            Log.Information("mmria_settings:session_idle_timeout_minutes: {0}", Configuration["mmria_settings:session_idle_timeout_minutes"]);
            Log.Information("Program.config_session_idle_timeout_minutes: {0}", Program.config_session_idle_timeout_minutes);
/*
var config = ConfigurationFactory.ParseString(@"
akka.remote.dot-netty.tcp {
    transport-class = ""Akka.Remote.Transport.DotNetty.DotNettyTransport, Akka.Remote""
    transport-protocol = tcp
    port = 8091
    hostname = ""127.0.0.1""
}");

var system = ActorSystem.Create("MyActorSystem", config);
*/

            var config = Akka.Configuration.ConfigurationFactory.ParseString(@"
            akka.remote.dot-netty.tcp {
                transport-class = ""Akka.Remote.Transport.DotNetty.DotNettyTransport, Akka.Remote""
                transport-protocol = tcp
                port = 8091
                hostname = ""127.0.0.1""
            }");


            Program.actorSystem = ActorSystem.Create("mmria-actor-system", config);
            services.AddSingleton(typeof(ActorSystem), (serviceProvider) => Program.actorSystem);

            ISchedulerFactory schedFact = new StdSchedulerFactory();
            Quartz.IScheduler sched = schedFact.GetScheduler().Result;

            // compute a time that is on the next round minute
            DateTimeOffset runTime = DateBuilder.EvenMinuteDate(DateTimeOffset.UtcNow);

            // define the job and tie it to our HelloJob class
            IJobDetail job = JobBuilder.Create<mmria.services.model.Pulse_job>()
            .WithIdentity("job1", "group1")
            .Build();

            // Trigger the job to run on the next round minute
            ITrigger trigger = TriggerBuilder.Create()
            .WithIdentity("trigger1", "group1")
            .StartAt(runTime.AddMinutes(3))
            .WithCronSchedule(Configuration["mmria_settings:cron_schedule"])
            .Build();

            sched.ScheduleJob(job, trigger);

            //if (Program.is_schedule_enabled)
            {
                sched.Start();
            }
            
            Log.Information("mmria_settings:is_schedule_enabled: {0}", Configuration["mmria_settings:is_schedule_enabled"]);
            Log.Information("mmria_settings:is_db_check_enabled: {0}", Configuration["mmria_settings:is_db_check_enabled"]);
     


            /*
            Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.quartz.Check_DB_Install>(), "Check_DB_Install");
            Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.quartz.Rebuild_Export_Queue>(), "Rebuild_Export_Queue");
            Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.quartz.Process_Export_Queue>(), "Process_Export_Queue");
            Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.quartz.Process_Migrate_Data>(), "Process_Migrate_Data");
            Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.Synchronize_Case>(), "case_sync_actor");
            */
            //Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.quartz.Process_Migrate_Data>(), "Process_Migrate_Data");

            var quartzSupervisor = Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.QuartzSupervisor>(), "QuartzSupervisor");

            //System.Threading.Thread.Sleep(1000);

            quartzSupervisor.Tell("init");
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("Hello World!");
                });
            });
        }
    }
}
