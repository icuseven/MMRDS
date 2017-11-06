using System;
using System.Collections.Generic;
using System.Linq;

using Microsoft.AspNetCore.Mvc;


namespace mmria.server
{
	[Route("api/[controller]")]
	public class syncController: ControllerBase 
	{ 
		public syncController()
		{
			
		}

		[HttpGet]
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

