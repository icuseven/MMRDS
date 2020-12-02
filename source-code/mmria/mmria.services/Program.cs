using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Quartz;

namespace mmria.services
{
    public class Program
    {
        public static bool config_is_service = true;
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

        public static string power_bi_link;

        public static string config_cdc_instance_pull_list;
        public static string config_cdc_instance_pull_db_url;

        public static bool is_schedule_enabled = true;
        public static int config_session_idle_timeout_minutes;

        public static bool is_db_check_enabled = false;

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
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });



    }
}
