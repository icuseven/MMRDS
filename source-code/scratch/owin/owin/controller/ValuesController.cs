using System.Collections.Generic;
using System.Web.Http;

namespace mmria.server
{
	public class ValuesController: ApiController 
	{ 
		// GET api/values 
		public Dictionary<string,string> Get() 
		{ 
			return new Dictionary<string,string>{{ "couchdb_url", get_couch_db_url() }}; 
		} 

		// GET api/values/5 
		public string Get(int id) 
		{ 
			return "value"; 
		} 

		// POST api/values 
		public void Post([FromBody]string value) 
		{ 
		} 

		// PUT api/values/5 
		public void Put(int id, [FromBody]string value) 
		{ 
		} 

		// DELETE api/values/5 
		public void Delete(int id) 
		{ 
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

