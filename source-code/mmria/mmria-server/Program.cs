using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace mmria
{
    public class Program
    {

        //static bool config_is_service = true;
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

        /*
        private static IScheduler sched;
        private static ITrigger check_for_changes_job_trigger;
        private static ITrigger rebuild_queue_job_trigger;
    */
        //public static Dictionary<string, string> Change_Sequence_List;
        public static int Change_Sequence_Call_Count = 0;
        public static IList<DateTime> DateOfLastChange_Sequence_Call;
        public static string Last_Change_Sequence = null;


        public static void Main(string[] args)
        {




            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                //.UseWebRoot(Directory.GetDirectoryRoot("/vagrant/source-code/scratch/owin/owin/psk/app"))
                .UseStartup<Startup>()
                .Build();
    }
}
