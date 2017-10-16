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

                        Program.PauseSchedule ();

						mmria.server.util.c_document_sync_all sync_all = new mmria.server.util.c_document_sync_all (
																			 Program.config_couchdb_url,
																			 Program.config_timer_user_name,
																			 Program.config_timer_password
																		 );

						sync_all.execute ();

                        Program.ResumeSchedule ();
					})
				);
			}

			return result;
		} 
	
	} 
}

