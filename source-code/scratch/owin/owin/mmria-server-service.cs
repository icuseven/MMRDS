using System;
using System.ComponentModel;
using System.ServiceModel;
using System.ServiceProcess;
using System.Threading.Tasks;
using System.Collections.Generic;
using Quartz;
using Quartz.Impl;
using Topshelf;

namespace mmria.server
{
    public class mmria_server_service : ServiceBase
    {
        public mmria_server_service ()
        {
			
        }


        protected override void OnStart (string[] args)
        {
			/*
            System.Console.WriteLine ("using AppSettings");
            System.Console.WriteLine ("geocode_api_key: {0}", System.Configuration.ConfigurationManager.AppSettings ["geocode_api_key"]);
            System.Console.WriteLine ("geocode_api_url: {0}", System.Configuration.ConfigurationManager.AppSettings ["geocode_api_url"]);
            System.Console.WriteLine ("couchdb_url: {0}", System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"]);
            System.Console.WriteLine ("web_site_url: {0}", System.Configuration.ConfigurationManager.AppSettings ["web_site_url"]);
            System.Console.WriteLine ("export_directory: {0}", System.Configuration.ConfigurationManager.AppSettings ["export_directory"]);
			*/

            Program.config_geocode_api_key = System.Configuration.ConfigurationManager.AppSettings ["geocode_api_key"];
            Program.config_geocode_api_url = System.Configuration.ConfigurationManager.AppSettings ["geocode_api_url"];
            Program.config_couchdb_url = System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"];
            Program.config_web_site_url = System.Configuration.ConfigurationManager.AppSettings ["web_site_url"];
            Program.config_file_root_folder = System.Configuration.ConfigurationManager.AppSettings ["file_root_folder"];
            Program.config_timer_user_name = System.Configuration.ConfigurationManager.AppSettings ["timer_user_name"];
            Program.config_timer_password = System.Configuration.ConfigurationManager.AppSettings ["timer_password"];
            Program.config_cron_schedule = System.Configuration.ConfigurationManager.AppSettings ["cron_schedule"];
            Program.config_export_directory = System.Configuration.ConfigurationManager.AppSettings ["export_directory"];

            

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


			//this.Startup ();




            
        }

		protected override void OnStop ()
        {

            //this.Shutdown ();
            
        }

        public bool Pause (HostControl hostControl)
        {
            //_log.Info("SampleService Paused");

            return true;
        }

        public bool Continue (HostControl hostControl)
        {
            //_log.Info("SampleService Continued");

            return true;
        }



    }
}
