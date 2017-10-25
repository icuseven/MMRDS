using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace mmria.server
{
	public class syncController: ApiController 
	{ 

		/*

curl -X PUT http://uid:pwd@target_db_url/_users
curl -X PUT http://uid:pwd@target_db_url/_replicator
curl -X PUT http://uid:pwd@target_db_url/_global_changes
curl -X PUT http://uid:pwd@target_db_url/metadata
curl -X PUT http://uid:pwd@target_db_url/mmrds

curl -vX POST http://uid:pwd@target_db_url/_replicate \
     -d '{"source":"http://uid:pwd@source_db_url/_users","target":"http://uid:pwd@target_db_url/_users"}' \
     -H "Content-Type:application/json"
 
	 
curl -vX POST http://uid:pwd@target_db_url/_replicate \
     -d '{"source":"http://muid:pwd@source_db_url/metadata","target":"http://uid:pwd@target_db_url/metadata"}' \
     -H "Content-Type:application/json"
	 
curl -vX POST http://uid:pwd@target_db_url/_replicate \
     -d '{"source":"http://uid:pwd@source_db_url","target":"http://uid:pwd@target_db_url/mmrds"}' \
     -H "Content-Type:application/json"
	 



		 */


		public syncController()
		{
			
		}

		public string Get
		(
			string uid, 
			string pwd
		)
		{
			string result = null;

			if
			(
					!string.IsNullOrWhiteSpace(uid) &&
					!string.IsNullOrWhiteSpace (pwd) &&
					uid == "mmria" &&
					pwd == "sync"

			) 
			{
				System.Threading.Tasks.Task.Run
				(
					new Action (() =>
					{

                        //Program.PauseSchedule ();

						mmria.server.util.c_document_sync_all sync_all = new mmria.server.util.c_document_sync_all (
																			 Program.config_couchdb_url,
																			 Program.config_timer_user_name,
																			 Program.config_timer_password
																		 );

						sync_all.execute ();


                        if (url_endpoint_exists (Program.config_couchdb_url + "/export_queue", Program.config_timer_user_name, Program.config_timer_password)) 
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


                        //Program.ResumeSchedule ();
					})
				);
			}

			return result;
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
                // do nothing for now
            }


            return result;
        }

        private void RecursiveDirectoryDelete (System.IO.DirectoryInfo baseDir)
        {
            if (!baseDir.Exists)
                return;

            foreach (var dir in baseDir.EnumerateDirectories ()) 
            {
                RecursiveDirectoryDelete (dir);
            }
            baseDir.Delete (true);
        }
	
	} 
}

