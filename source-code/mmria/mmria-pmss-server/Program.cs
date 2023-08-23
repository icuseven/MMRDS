﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Timers;
using System.Threading.Tasks;
using Serilog;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Quartz;
using Quartz.Impl;
using System.Diagnostics;
using Serilog.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Authorization;
using Akka.Actor;
using Akka.DI.Extensions.DependencyInjection;

using System.Net.Http;
using System.Net.Http.Json;


using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;


using mmria.pmss.server.extension;
using mmria.pmss.server.authentication;

namespace mmria.pmss.server;

public sealed partial class Program
{
    static bool config_is_service = true;
    public static string config_geocode_api_key;
    public static string config_geocode_api_url;
    public static string config_couchdb_url = "http://localhost:5984";

    public static string db_prefix = "";
    public static string config_web_site_url;
    //public static string config_file_root_folder;
    public static string config_timer_user_name;
    public static string config_timer_value;
    public static string config_cron_schedule;
    public static string config_export_directory;

    public static string app_instance_name;

    public static string metadata_release_version_name;

    public static string vitals_service_key;
    public static string config_id;

    public static mmria.common.couchdb.ConfigurationSet configuration_set;

    public static string config_cdc_instance_pull_list;
    public static string config_cdc_instance_pull_db_url;

    public static bool is_schedule_enabled = true;
    public static int config_session_idle_timeout_minutes;

    public static bool is_db_check_enabled = false;

    public static string config_vitals_url;
    
    public static int config_pass_word_minimum_length = 8;
    public static int config_pass_word_days_before_expires = 0;
    public static int config_pass_word_days_before_user_is_notified_of_expiration = 0;
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
    
    public static Quartz.IScheduler sched;
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

        var builder = WebApplication.CreateBuilder(args);
        builder.Configuration.AddUserSecrets<Program>();
        configuration = builder.Configuration;

        try
        {
            /*
            configuration = new configurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("apLoggerConfigurationpsettings.json", true, true)
            .AddUserSecrets<Startup>()
            .Build();
            */

            if (bool.Parse (configuration["mmria_settings:is_environment_based"])) 
            {
                Program.config_web_site_url = System.Environment.GetEnvironmentVariable ("web_site_url");
                Program.config_export_directory = System.Environment.GetEnvironmentVariable ("export_directory") != null ? System.Environment.GetEnvironmentVariable ("export_directory") : "/workspace/export";
            }
            else 
            {
                Program.config_web_site_url = configuration["mmria_settings:web_site_url"];
                Program.config_export_directory = configuration["mmria_settings:export_directory"];
            }


            if(configuration["mmria_settings:log_directory"]!= null && !string.IsNullOrEmpty(configuration["mmria_settings:log_directory"]))
            {
                try
                {
                    Serilog.Log.Logger = new Serilog.LoggerConfiguration()
                    .WriteTo.Console()
                    .WriteTo.File(Path.Combine(configuration["mmria_settings:log_directory"],"log.txt"), rollingInterval: RollingInterval.Day)
                    .CreateLogger();
                }
                catch(System.Exception)
                {
                    Serilog.Log.Logger = new Serilog.LoggerConfiguration()
                    .WriteTo.Console()
                    .CreateLogger();    
                }

            }
            else
            {
                Serilog.Log.Logger = new Serilog.LoggerConfiguration()
                .WriteTo.Console()
                .CreateLogger();    
            }


            Program.DateOfLastChange_Sequence_Call = new List<DateTime>();
            Program.Change_Sequence_Call_Count++;
            Program.DateOfLastChange_Sequence_Call.Add(DateTime.Now);

            Program.config_geocode_api_key = "";
            Program.config_geocode_api_url = "";

            configuration["mmria_settings:is_schedule_enabled"].SetIfIsNotNullOrWhiteSpace(ref Program.is_schedule_enabled);

            configuration["mmria_settings:is_db_check_enabled"].SetIfIsNotNullOrWhiteSpace(ref Program.is_db_check_enabled);
            configuration["mmria_settings:app_instance_name"].SetIfIsNotNullOrWhiteSpace(ref Program.app_instance_name);
            configuration["mmria_settings:metadata_version"].SetIfIsNotNullOrWhiteSpace(ref Program.metadata_release_version_name);
            configuration["mmria_settings:db_prefix"].SetIfIsNotNullOrWhiteSpace(ref Program.db_prefix);
            configuration["mmria_settings:cdc_instance_pull_list"].SetIfIsNotNullOrWhiteSpace(ref Program.config_cdc_instance_pull_list);
            configuration["mmria_settings:cdc_instance_pull_db_url"].SetIfIsNotNullOrWhiteSpace(ref Program.config_cdc_instance_pull_db_url);
            configuration["mmria_settings:vitals_url"].SetIfIsNotNullOrWhiteSpace(ref Program.config_vitals_url);
            configuration["mmria_settings:vitals_service_key"].SetIfIsNotNullOrWhiteSpace(ref Program.vitals_service_key);
            configuration["mmria_settings:config_id"].SetIfIsNotNullOrWhiteSpace(ref Program.config_id );


            //Program.config_geocode_api_key = configuration["mmria_settings:geocode_api_key"];
            //Program.config_geocode_api_url = configuration["mmria_settings:geocode_api_url"];
            Program.config_couchdb_url = configuration["mmria_settings:couchdb_url"];
            Program.config_web_site_url = configuration["mmria_settings:web_site_url"];
            //Program.config_file_root_folder = configuration["mmria_settings:file_root_folder"];
            Program.config_timer_user_name = configuration["mmria_settings:timer_user_name"];
            Program.config_timer_value = configuration["mmria_settings:timer_password"];
            configuration["mmria_settings:timer_value"] = configuration["mmria_settings:timer_password"];
            Program.config_cron_schedule = configuration["mmria_settings:cron_schedule"];
            Program.config_export_directory = configuration["mmria_settings:export_directory"];

            configuration["mmria_settings:session_idle_timeout_minutes"].SetIfIsNotNullOrWhiteSpace(ref Program.config_session_idle_timeout_minutes,30);

            Program.config_pass_word_minimum_length = SetFromIfHasValue(Program.config_pass_word_minimum_length, configuration["password_settings:minimum_length"], 8);
            Program.config_pass_word_days_before_expires = SetFromIfHasValue(Program.config_pass_word_days_before_expires, configuration["password_settings:days_before_expires"], 0);
            Program.config_pass_word_days_before_user_is_notified_of_expiration = SetFromIfHasValue(Program.config_pass_word_days_before_user_is_notified_of_expiration, configuration["password_settings:days_before_user_is_notified_of_expiration"], 0);

            Program.config_default_days_in_effective_date_interval = SetFromIfHasValue(Program.config_default_days_in_effective_date_interval, configuration["authentication_settings:default_days_in_effective_date_interval"], 0);
            Program.config_unsuccessful_login_attempts_number_before_lockout = SetFromIfHasValue(Program.config_unsuccessful_login_attempts_number_before_lockout, configuration["authentication_settings:unsuccessful_login_attempts_number_before_lockout"], 5);
            Program.config_unsuccessful_login_attempts_within_number_of_minutes = SetFromIfHasValue(Program.config_unsuccessful_login_attempts_within_number_of_minutes, configuration["authentication_settings:unsuccessful_login_attempts_within_number_of_minutes"], 120);
            Program.config_unsuccessful_login_attempts_lockout_number_of_minutes = SetFromIfHasValue(Program.config_unsuccessful_login_attempts_lockout_number_of_minutes, configuration["authentication_settings:unsuccessful_login_attempts_lockout_number_of_minutes"], 15);

            string couchdb_url =  configuration["mmria_settings:couchdb_url"];
            string timer_user_name = configuration["mmria_settings:timer_user_name"];
            string timer_value = configuration["mmria_settings:timer_value"];
            string shared_config_id = configuration["mmria_settings:shared_config_id"];

            System.Environment.GetEnvironmentVariable("couchdb_url").SetIfIsNotNullOrWhiteSpace(ref couchdb_url);
            System.Environment.GetEnvironmentVariable("timer_user_name").SetIfIsNotNullOrWhiteSpace(ref timer_user_name);
            System.Environment.GetEnvironmentVariable("timer_password").SetIfIsNotNullOrWhiteSpace(ref timer_value);
            System.Environment.GetEnvironmentVariable("shared_config_id").SetIfIsNotNullOrWhiteSpace(ref shared_config_id);


            Log.Information("Overriable Config:");
            Log.Information($"couchdb_url: {couchdb_url}");
            Log.Information($"timer_user_name: {timer_user_name}");
            Log.Information($"shared_config_id: {shared_config_id}");
            Log.Information("");


            var overridable_config = GetOverridableConfiguration
            (
                new()
                {
                    url =  couchdb_url,
                    user_name = timer_user_name,
                    user_value = timer_value
                },
                shared_config_id
            );


            builder.Services.AddSingleton<mmria.common.couchdb.OverridableConfiguration>(overridable_config);

            if (bool.Parse(configuration["mmria_settings:is_environment_based"]))
            {
                Log.Information("using Environment");

                //Log.Information ("geocode_api_key: {0}", System.Environment.GetEnvironmentVariable ("geocode_api_key"));
                //Log.Information ("geocode_api_url: {0}", System.Environment.GetEnvironmentVariable ("geocode_api_url"));
                Log.Information("couchdb_url: {0}", System.Environment.GetEnvironmentVariable("couchdb_url"));
                Log.Information("web_site_url: {0}", System.Environment.GetEnvironmentVariable("web_site_url"));
                Log.Information("export_directory: {0}", System.Environment.GetEnvironmentVariable("export_directory"));

                //Program.config_geocode_api_key = System.Environment.GetEnvironmentVariable ("geocode_api_key");
                //Program.config_geocode_api_url = System.Environment.GetEnvironmentVariable ("geocode_api_url");
                System.Environment.GetEnvironmentVariable("couchdb_url").SetIfIsNotNullOrWhiteSpace(ref Program.config_couchdb_url);
                System.Environment.GetEnvironmentVariable("web_site_url").SetIfIsNotNullOrWhiteSpace(ref Program.config_web_site_url);

                //Program.config_file_root_folder = System.Environment.GetEnvironmentVariable ("file_root_folder");
                System.Environment.GetEnvironmentVariable("timer_user_name").SetIfIsNotNullOrWhiteSpace(ref Program.config_timer_user_name);
                System.Environment.GetEnvironmentVariable("timer_password").SetIfIsNotNullOrWhiteSpace(ref Program.config_timer_value);
                System.Environment.GetEnvironmentVariable("cron_schedule").SetIfIsNotNullOrWhiteSpace(ref Program.config_cron_schedule);
                System.Environment.GetEnvironmentVariable("export_directory").SetIfIsNotNullOrWhiteSpace(ref Program.config_export_directory, "/workspace/export");

                configuration["mmria_settings:couchdb_url"]  = Program.config_couchdb_url;
                configuration["mmria_settings:web_site_url"] = Program.config_web_site_url;

                configuration["mmria_settings:timer_user_name"] = Program.config_timer_user_name;
                configuration["mmria_settings:timer_value"] = Program.config_timer_value;
                configuration["mmria_settings:cron_schedule"] = Program.config_cron_schedule;

                configuration["mmria_settings:export_directory"] = Program.config_export_directory;

                System.Environment.GetEnvironmentVariable("session_idle_timeout_minutes")
                    .SetIfIsNotNullOrWhiteSpace(ref Program.config_session_idle_timeout_minutes, 30);
                configuration["mmria_settings:session_idle_timeout_minutes"] = Program.config_session_idle_timeout_minutes.ToString();

                System.Environment.GetEnvironmentVariable("password_minimum_length")
                    .SetIfIsNotNullOrWhiteSpace(ref Program.config_pass_word_minimum_length, 8);
        
                System.Environment.GetEnvironmentVariable("password_days_before_expires")
                    .SetIfIsNotNullOrWhiteSpace(ref Program.config_pass_word_days_before_expires, 0);

                System.Environment.GetEnvironmentVariable("password_days_before_user_is_notified_of_expiration")
                    .SetIfIsNotNullOrWhiteSpace(ref Program.config_pass_word_days_before_user_is_notified_of_expiration, 0);

                System.Environment.GetEnvironmentVariable("vitals_url")
                    .SetIfIsNotNullOrWhiteSpace(ref Program.config_vitals_url);
                configuration["mmria_settings:vitals_url"] = SetFromIfHasValue(configuration["mmria_settings:vitals_url"], Program.config_vitals_url);

                configuration["sams:endpoint_authorization"] = SetFromIfHasValue(configuration["sams:endpoint_authorization"], System.Environment.GetEnvironmentVariable("sams_endpoint_authorization"));
                
                configuration["mmria_settings:is_development"] = SetFromIfHasValue(configuration["mmria_settings:is_development"], System.Environment.GetEnvironmentVariable("use_development_settings"));
                
                configuration["mmria_settings:metadata_version"] = SetFromIfHasValue(configuration["mmria_settings:metadata_version"], System.Environment.GetEnvironmentVariable("metadata_version"));
                Program.metadata_release_version_name = SetFromIfHasValue(Program.metadata_release_version_name, System.Environment.GetEnvironmentVariable("metadata_version"));
                
                configuration["sams:endpoint_token"] = SetFromIfHasValue(configuration["sams:endpoint_token"], System.Environment.GetEnvironmentVariable("sams_endpoint_token"));
                configuration["sams:endpoint_user_info"] = SetFromIfHasValue(configuration["sams:endpoint_user_info"] , System.Environment.GetEnvironmentVariable("sams_endpoint_user_info"));
                configuration["sams:token_validation"] = SetFromIfHasValue(configuration["sams:token_validation"], System.Environment.GetEnvironmentVariable("sams_endpoint_token_validation"));
                configuration["sams:user_info_sys"] = SetFromIfHasValue(configuration["sams:user_info_sys"], System.Environment.GetEnvironmentVariable("sams_endpoint_user_info_sys"));
                
                configuration["sams:client_id"] = SetFromIfHasValue(configuration["sams:client_id"], System.Environment.GetEnvironmentVariable("sams_client_id"));
                configuration["sams:client_secret"] = SetFromIfHasValue(configuration["sams:client_secret"], System.Environment.GetEnvironmentVariable("sams_client_secret"));
                configuration["sams:callback_url"] = SetFromIfHasValue(configuration["sams:callback_url"], System.Environment.GetEnvironmentVariable("sams_callback_url"));
                configuration["sams:logout_url"] = SetFromIfHasValue(configuration["sams:logout_url"], System.Environment.GetEnvironmentVariable("sams_logout_url"));
                configuration["sams:is_enabled"] = SetFromIfHasValue(configuration["sams:is_enabled"], System.Environment.GetEnvironmentVariable("sams_is_enabled"));
            
                configuration["is_schedule_enabled"] = SetFromIfHasValue(configuration["is_schedule_enabled"], System.Environment.GetEnvironmentVariable("is_schedule_enabled"));
                configuration["is_db_check_enabled"] = SetFromIfHasValue(configuration["is_db_check_enabled"], System.Environment.GetEnvironmentVariable("is_db_check_enabled"));

                configuration["mmria_settings:app_instance_name"] = SetFromIfHasValue(configuration["mmria_settings:app_instance_name"], System.Environment.GetEnvironmentVariable("app_instance_name"));
                Program.app_instance_name = SetFromIfHasValue(Program.app_instance_name, configuration["mmria_settings:app_instance_name"]);
            
                configuration["mmria_settings:db_prefix"] = SetFromIfHasValue(configuration["mmria_settings:db_prefix"], System.Environment.GetEnvironmentVariable("db_prefix"));
                Program.db_prefix = SetFromIfHasValue(Program.db_prefix, configuration["mmria_settings:db_prefix"]);
            
                configuration["mmria_settings:cdc_instance_pull_list"] = SetFromIfHasValue(configuration["mmria_settings:cdc_instance_pull_list"], System.Environment.GetEnvironmentVariable("cdc_instance_pull_list"));
                Program.config_cdc_instance_pull_list = SetFromIfHasValue(Program.config_cdc_instance_pull_list, configuration["mmria_settings:cdc_instance_pull_list"]);
            
                configuration["mmria_settings:cdc_instance_pull_db_url"] = SetFromIfHasValue(configuration["mmria_settings:cdc_instance_pull_db_url"], System.Environment.GetEnvironmentVariable("cdc_instance_pull_db_url"));
                Program.config_cdc_instance_pull_db_url = SetFromIfHasValue(Program.config_cdc_instance_pull_db_url, configuration["mmria_settings:cdc_instance_pull_db_url"]);
            
                configuration["mmria_settings:vitals_service_key"] = SetFromIfHasValue(configuration["mmria_settings:vitals_service_key"], System.Environment.GetEnvironmentVariable("vitals_service_key"));
                Program.vitals_service_key = SetFromIfHasValue(Program.vitals_service_key, configuration["mmria_settings:vitals_service_key"]);
            
                configuration["mmria_settings:config_id"] = SetFromIfHasValue(configuration["mmria_settings:config_id"], System.Environment.GetEnvironmentVariable("config_id"));
                Program.config_id = SetFromIfHasValue(Program.config_id, configuration["mmria_settings:config_id"]);
                
                Program.config_default_days_in_effective_date_interval = SetFromIfHasValue(Program.config_default_days_in_effective_date_interval, System.Environment.GetEnvironmentVariable("default_days_in_effective_date_interval"), 90);
                Program.config_unsuccessful_login_attempts_number_before_lockout = SetFromIfHasValue(Program.config_unsuccessful_login_attempts_number_before_lockout, System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_number_before_lockout"), 5);
                Program.config_unsuccessful_login_attempts_within_number_of_minutes = SetFromIfHasValue(Program.config_unsuccessful_login_attempts_within_number_of_minutes, System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_within_number_of_minutes"), 120);
                Program.config_unsuccessful_login_attempts_lockout_number_of_minutes = SetFromIfHasValue(Program.config_unsuccessful_login_attempts_lockout_number_of_minutes, System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_lockout_number_of_minutes"), 15);
            }

            Log.Information($"Program.config_timer_user_name = {Program.config_timer_user_name}");
            Log.Information($"Program.config_couchdb_url = {Program.config_couchdb_url}");
            Log.Information($"Program.db_prefix = {Program.db_prefix}");
            Log.Information($"Logging = {configuration["Logging:IncludeScopes"]}");
            Log.Information($"Console = {configuration["Console:LogLevel:Default"]}");
            Log.Information("sams:callback_url: {0}", configuration["sams:callback_url"]);
            Log.Information("sams:activity_name: {0}", configuration["sams:activity_name"]);
            Log.Information("mmria_settings:is_schedule_enabled: {0}", configuration["mmria_settings:is_schedule_enabled"]);
            Log.Information("mmria_settings:is_db_check_enabled: {0}", configuration["mmria_settings:is_db_check_enabled"]);
            Log.Information("mmria_settings:is_development: {0}", configuration["mmria_settings:is_development"]);
            Log.Information("mmria_settings:metadata_version: {0}", configuration["mmria_settings:metadata_version"]);
            Log.Information("mmria_settings:power_bi_link: {0}", configuration["mmria_settings:power_bi_link"]);
            Log.Information("mmria_settings:app_instance_name: {0}", configuration["mmria_settings:app_instance_name"]);
            Log.Information("mmria_settings:session_idle_timeout_minutes: {0}", configuration["mmria_settings:session_idle_timeout_minutes"]);
            Log.Information("Program.config_session_idle_timeout_minutes: {0}", Program.config_session_idle_timeout_minutes);

            if(!string.IsNullOrWhiteSpace(Program.vitals_service_key))
            {
                Log.Information("Program.config_vitals_service_key is present");
            }

            var DbConfigSet = GetConfiguration();
            builder.Services.AddSingleton<mmria.common.couchdb.ConfigurationSet>(DbConfigSet);

            Program.configuration_set = DbConfigSet;


            configuration["steve_api:sea_bucket_kms_key"] = DbConfigSet.name_value["steve_api:sea_bucket_kms_key"];
            configuration["steve_api:client_name"] = DbConfigSet.name_value["steve_api:client_name"];
            configuration["steve_api:client_secret_key"] = DbConfigSet.name_value["steve_api:client_secret_key"];
            configuration["steve_api:base_url"] = DbConfigSet.name_value["steve_api:base_url"];


            var collection = new ServiceCollection();

            collection.AddSingleton<mmria.common.couchdb.ConfigurationSet>(DbConfigSet);
            collection.AddSingleton<IConfiguration>(configuration);
            collection.AddSingleton<mmria.common.couchdb.OverridableConfiguration>(overridable_config);

            collection.AddLogging();

            var provider = collection.BuildServiceProvider();          

            Program.actorSystem = ActorSystem.Create("mmria-actor-system").UseServiceProvider(provider);
            builder.Services.AddSingleton(typeof(ActorSystem), (serviceProvider) => Program.actorSystem);

            ISchedulerFactory schedFact = new StdSchedulerFactory();
            Quartz.IScheduler sched = schedFact.GetScheduler().Result;

            DateTimeOffset runTime = DateBuilder.EvenMinuteDate(DateTimeOffset.UtcNow);

            IJobDetail job = JobBuilder.Create<mmria.pmss.server.model.Pulse_job>()
                .WithIdentity("job1", "group1")
                .Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("trigger1", "group1")
                .StartAt(runTime.AddMinutes(3))
                .WithCronSchedule(Program.config_cron_schedule)
                .Build();

            sched.ScheduleJob(job, trigger);

            if (Program.is_schedule_enabled)
            {
                sched.Start();
            }

            var quartzSupervisor = Program.actorSystem.ActorOf(Props.Create<mmria.pmss.server.model.actor.QuartzSupervisor>(provider), "QuartzSupervisor");
            actorSystem.ActorOf<mmria.pmss.server.SteveAPISupervisor>("steve-api-supervisor");
        

            quartzSupervisor.Tell("init");

            bool use_sams = false;

            configuration["sams:is_enabled"].SetIfIsNotNullOrWhiteSpace(ref use_sams);

            if (use_sams)
            {
                Log.Information("using sams");

                builder.Services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = CustomAuthOptions.DefaultScheme;
                    options.DefaultChallengeScheme = CustomAuthOptions.DefaultScheme;
                })
                .AddCustomAuth(options =>
                {
                    options.AuthKey = "custom auth key";
                    options.Is_SAMS = true;
                });
            }
            else
            {
                Log.Information("NOT using sams");

                builder.Services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = CustomAuthOptions.DefaultScheme;
                    options.DefaultChallengeScheme = CustomAuthOptions.DefaultScheme;
                })
                .AddCustomAuth(options =>
                {
                    options.AuthKey = "custom auth key";
                    options.Is_SAMS = false;
                });
            }

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("abstractor", policy => policy.RequireRole("abstractor"));
                options.AddPolicy("data_analyst", policy => policy.RequireRole("data_analyst"));
                options.AddPolicy("form_designer", policy => policy.RequireRole("form_designer"));
                options.AddPolicy("committee_member", policy => policy.RequireRole("committee_member"));
                options.AddPolicy("vital_importer", policy => policy.RequireRole("vital_importer"));
                options.AddPolicy("cdc_admin", policy => policy.RequireRole("cdc_admin"));
                options.AddPolicy("cdc_analyst", policy => policy.RequireRole("cdc_analyst"));
                options.AddPolicy("jurisdiction_admin", policy => policy.RequireRole("jurisdiction_admin"));
                options.AddPolicy("installation_admin", policy => policy.RequireRole("installation_admin"));
                options.AddPolicy("guest", policy => policy.RequireRole("guest"));
            });


            builder.Services.AddMvc
            (
                config =>
                {
                    var policy = new AuthorizationPolicyBuilder()
                                    .RequireAuthenticatedUser()
                                    .Build();
                    config.Filters.Add(new AuthorizeFilter(policy));

                    config.CacheProfiles.Add
                    (
                        "NoStore",
                        new Microsoft.AspNetCore.Mvc.CacheProfile()
                        {
                            NoStore = true
                        }
                    );
                }
            );

            builder.Services.AddControllersWithViews().AddNewtonsoftJson();
            builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            if (Program.is_schedule_enabled)
            {
                System.Threading.Tasks.Task.Run
                (
                    new Action(async () =>
                    {
                        await new mmria.pmss.server.utils.c_db_setup(Program.actorSystem).Setup();
                    }
                ));
            }

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.Use
            (
                middleware
            );

            app.UseDefaultFiles();
            app.UseStaticFiles();
/*
            

            var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            // Add new mappings
            provider.Mappings[".dll"] = "application/octet-stream";
            provider.Mappings[".blat"] = "application/octet-stream";
            provider.Mappings[".dat"] = "application/octet-stream";
            provider.Mappings[".css"] = "text/css";
            provider.Mappings[".js"] = "text/javascript";

            app.UseStaticFiles(
                
                new StaticFileOptions
            {
                
                FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
                RequestPath = "",
                //ContentTypeProvider = provider
            });*/


            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllerRoute
            (
                name: "default",
                pattern: "{controller=Home}/{action=Index}"///{id?}"
            );
        
            app.Run(config_web_site_url);

        }
        catch (System.Exception ex)
        {
            System.Console.WriteLine($"PMSS Server error: ${ex}");
        }    
    }

    static async Task middleware(HttpContext context, Func<Task> next)
    {
        var resetFeature = context.Features.Get<Microsoft.AspNetCore.Http.Features.IHttpResetFeature>();

        switch (context.Request.Method.ToLower())
        {
            case "get":
            case "put":
            case "post":
            case "head":
            case "delete":

            if
            (
                (
                    context.Request.Headers.ContainsKey("Content-Length") &&
                    context.Request.Headers["Content-Length"].Count > 1
                ) 
                ||
                (
                    context.Request.Headers.ContainsKey("Transfer-Encoding") &&
                    context.Request.Headers["Transfer-Encoding"].Count > 1
                )
            )
            {
                context.Response.StatusCode = 400;
                context.Response.Headers.Add("Connection", "close");
                resetFeature.Reset(errorCode: 4);
                //context.Abort();
                //context.RequestAborted.Session
            }
            else if
            (
                context.Request.Headers.ContainsKey("Content-Length") &&
                context.Request.Headers.ContainsKey("Transfer-Encoding")
            )
            {
                context.Response.StatusCode = 400;
                context.Response.Headers.Add("Connection", "close");
                resetFeature.Reset(errorCode: 4);
                // context.Abort();
            }
            else if
            (
                context.Request.Headers.ContainsKey("X-HTTP-METHOD") ||
                context.Request.Headers.ContainsKey("X-HTTP-Method-Override") ||
                context.Request.Headers.ContainsKey("X-METHOD-OVERRIDE")
            )
            {
                context.Response.Headers.Add("X-Frame-Options", "DENY");
                context.Response.Headers.Add("Content-Security-Policy", "frame-ancestors  'none';");
                context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Add("Cache-Control", "no-cache, no-store");
                context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
                context.Response.Headers.Add("Connection", "close");
                context.Response.StatusCode = 400;
                //resetFeature.Reset(errorCode: 4);
                //context.Abort();
            }
            else if(next is null)
            {
                context.Response.StatusCode = 400;
                context.Response.Headers.Add("Connection", "close");
                resetFeature.Reset(errorCode: 4);
            }
            else
            {
                context.Response.Headers.Add("X-Frame-Options", "DENY");
                context.Response.Headers.Add("Content-Security-Policy","frame-ancestors  'none'");
                context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Add("Cache-Control", "no-cache, no-store");
                context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");

                await next();
            }

            break;
            default:
            context.Response.StatusCode = 400;
            context.Response.Headers.Add("Connection", "close");
            resetFeature.Reset(errorCode: 4);
            //context.Abort();
            break;
        }
    
    }

    static void AppDomain_UnhandledExceptionHandler(object sender, UnhandledExceptionEventArgs args) 
    {
        Exception e = (Exception) args.ExceptionObject;
        Console.WriteLine("AppDomain_UnhandledExceptionHandler caught : " + e.Message);
    }

    private static mmria.common.couchdb.ConfigurationSet GetConfiguration()
    {
        var result = new mmria.common.couchdb.ConfigurationSet();
        try
        {
            string request_string = $"{Program.config_couchdb_url}/configuration/{Program.config_id}";
            var case_curl = new mmria.pmss.server.cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
            string responseFromServer = case_curl.execute();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.couchdb.ConfigurationSet> (responseFromServer);
        }
        catch(Exception ex)
        {
            Console.WriteLine (ex);
        } 

        return result;
    }

    static mmria.common.couchdb.OverridableConfiguration GetOverridableConfiguration
    (
        mmria.common.couchdb.DBConfigurationDetail configuration,
        string shared_config_id
    )
    {
        var result = new mmria.common.couchdb.OverridableConfiguration();
        try
        {
            string request_string = $"{configuration.url}/configuration/{shared_config_id}";
            var case_curl = new mmria.pmss.server.cURL("GET", null, request_string, null, configuration.user_name, configuration.user_value);
            string responseFromServer = case_curl.execute();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.couchdb.OverridableConfiguration> (responseFromServer);
        }
        catch(Exception ex)
        {
            Console.WriteLine (ex);
        } 

        return result;
    }

    public static string SetFromIfHasValue(string @this, string that)
    {
        var result = @this;

        if (!string.IsNullOrWhiteSpace(that))
        {
            result = that;
        }

        return result;
    }

    public static int SetFromIfHasValue(int @this, string that, int defaultValue)
    {
        var result = @this;
        if (!string.IsNullOrWhiteSpace(that))
        {
            if(int.TryParse(that, out var test_int))
            {
                result = test_int;
            }
            else result = defaultValue;
        }
        else
        {
            result = defaultValue;
        }

        return result;
    }

}

