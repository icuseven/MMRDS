using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Quartz;
using Quartz.Impl;

namespace mmria.server.model
{
	public class rebuild_queue_job : IJob
    {
		string couch_db_url = null;
		string user_name = null;
		string password = null;

        public rebuild_queue_job()
		{
				this.couch_db_url = Program.config_couchdb_url;
				this.user_name = Program.config_timer_user_name;
				this.password = Program.config_timer_password;
		}

        void IJob.Execute (IJobExecutionContext context)
        {
			//Common.Logging.ILog log = Common.Logging.LogManager.GetCurrentClassLogger();
			//log.Debug("IJob.Execute");

			JobKey jobKey = context.JobDetail.Key;


            try 
            {
                Program.PauseSchedule (); 
            }
            catch (Exception ex) 
            {
                System.Console.WriteLine ($"rebuild_queue_job. error pausing schedule\n{ex}");
            }

            try 
            {
                string export_directory = System.Configuration.ConfigurationManager.AppSettings ["export_directory"];

                if (System.IO.Directory.Exists (export_directory))
                {
                    RecursiveDirectoryDelete(new System.IO.DirectoryInfo(export_directory));
                }

                System.IO.Directory.CreateDirectory(export_directory);


            }
            catch (Exception ex) 
            {
                System.Console.WriteLine ($"rebuild_queue_job. error deleting directory queue\n{ex}");
            }


            if (url_endpoint_exists (Program.config_couchdb_url + "/export_queue", this.user_name, this.password)) 
            {
                var delete_queue_curl = new cURL ("DELETE", null, Program.config_couchdb_url + "/export_queue", null, this.user_name, this.password);
                System.Console.WriteLine (delete_queue_curl.execute ());
            }


            try 
            {
                System.Console.WriteLine ("Creating export_queue db.");
                var export_queue_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue", null, this.user_name, this.password);
                System.Console.WriteLine (export_queue_curl.execute ());
                new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue/_security", "{\"admins\":{\"names\":[],\"roles\":[\"abstractor\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\"]}}", this.user_name, this.password).execute ();

            }
            catch (Exception ex) 
            {
                System.Console.WriteLine ($"rebuild_queue_job. error creating queue\n{ex}");
            }



            try 
            {
                Program.ResumeSchedule (); 
            }
            catch (Exception ex) 
            {
                System.Console.WriteLine ($"rebuild_queue_job. error resuming schedule\n{ex}");
            }
		}

        private static bool url_endpoint_exists (string p_target_server, string p_user_name, string p_password, string p_method = "HEAD")
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
                // do nothing for now
            }


            return result;
        }

        private static void RecursiveDirectoryDelete(System.IO.DirectoryInfo baseDir)
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