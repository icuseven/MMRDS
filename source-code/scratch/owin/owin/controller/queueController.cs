using System;
using System.Web.Http;

namespace owin
{
	public class queueController: ApiController 
	{
		public queueController ()
		{
		}

		public owin.data.api.Check_Queue_Response Post(owin.data.api.Check_Queue_Request check_queue_request)
		{ 
			owin.data.api.Check_Queue_Response result = null;

			return result;
		}

		private string get_couch_db_url()
		{
			string result = null;

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_container_based"])) 
			{
				result = System.Environment.GetEnvironmentVariable ("couchdb_url");
			} 
			else
			{
				result = System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"];
			}

			return result;
		}
	}
}

