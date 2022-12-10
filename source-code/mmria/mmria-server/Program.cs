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
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.Extensions.Logging;
using Quartz;
using Quartz.Impl;
using System.Diagnostics;
using Serilog;
using Serilog.Configuration;

namespace mmria.server;

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

        try
        {
            configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", true, true)
            .AddUserSecrets<Startup>()
            .Build();



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
        


            var host = WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseUrls(Program.config_web_site_url)
                .Build();


        
            host.Run();
        }
        catch (System.Exception ex)
        {
            System.Console.WriteLine($"MMRIA Server error: ${ex}");
        }    

    }


    
    static void AppDomain_UnhandledExceptionHandler(object sender, UnhandledExceptionEventArgs args) 
    {
        Exception e = (Exception) args.ExceptionObject;
        Console.WriteLine("AppDomain_UnhandledExceptionHandler caught : " + e.Message);
    }






}

