using System;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using mmria.server.model.actor;

namespace mmria.server.model.actor.quartz
{
    public class Rebuild_Export_Queue : UntypedActor
    {
        protected override void PreStart() => Console.WriteLine("Rebuild_Export_Queue started");
        protected override void PostStop() => Console.WriteLine("Rebuild_Export_Queue stopped");

        protected override void OnReceive(object message)
        {
                Console.WriteLine($"Rebuild_Export_Queue Baby {System.DateTime.Now}");

            
            switch (message)
            {
                case ScheduleInfoMessage scheduleInfo:


                    var midnight_timespan = new TimeSpan(0, 0, 0);
                    var difference = DateTime.Now - midnight_timespan;
                    if(difference.Hour != 0 && difference.Minute != 0)
                    {
                        return;
                    }
                    /*
                    try 
                    {
                        Program.PauseSchedule (); 
                    }
                    catch (Exception ex) 
                    {
                        System.Console.WriteLine ($"rebuild_queue_job. error pausing schedule\n{ex}");
                    }
                    */

                    try 
                    {
                        string export_directory = scheduleInfo.export_directory;

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


                    if (url_endpoint_exists (Program.config_couchdb_url + "/export_queue", scheduleInfo.user_name, scheduleInfo.user_value)) 
                    {
                        var delete_queue_curl = new cURL ("DELETE", null, Program.config_couchdb_url + "/export_queue", null, scheduleInfo.user_name, scheduleInfo.user_value);
                        System.Console.WriteLine (delete_queue_curl.execute ());
                    }


                    try 
                    {
                        System.Console.WriteLine ("Creating export_queue db.");
                        var export_queue_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue", null, scheduleInfo.user_name, scheduleInfo.user_value);
                        System.Console.WriteLine (export_queue_curl.execute ());
                        new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue/_security", "{\"admins\":{\"names\":[],\"roles\":[\"abstractor\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\"]}}", scheduleInfo.user_name, scheduleInfo.user_value).execute ();

                    }
                    catch (Exception ex) 
                    {
                        System.Console.WriteLine ($"rebuild_queue_job. error creating queue\n{ex}");
                    }

/*

                    try 
                    {
                        Program.ResumeSchedule (); 
                    }
                    catch (Exception ex) 
                    {
                        System.Console.WriteLine ($"rebuild_queue_job. error resuming schedule\n{ex}");
                    }
 */
                    break;
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