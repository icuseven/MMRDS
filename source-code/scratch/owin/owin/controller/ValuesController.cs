using System;
using System.Collections.Generic;
using System.Web.Http;

namespace mmria.server
{
	public class ValuesController: ApiController 
	{ 
		// GET api/values 
		public Dictionary<string,object> Get() 
		{ 
            try
            {
    			var result = new Dictionary<string,object>{
    				{ "couchdb_url", Program.config_couchdb_url },
    				{ "cron_schedule", Program.config_cron_schedule },
    				{ "Last_Change_Sequence", Program.Last_Change_Sequence },
    				{ "Change_Sequence_Call_Count", Program.Change_Sequence_Call_Count },
    				{ "DateOfLastChange_Sequence_Call", Program.DateOfLastChange_Sequence_Call }
    			}; 

                return result;
            }
            catch(Exception ex)
            {
                Console.WriteLine ($"ValuesController error {ex}");
            }

            return new Dictionary<string,object>{{ "has values" , false }};
		} 

		// GET api/values/5 
		/*
		public  Dictionary<string,string>  Get(string value) 
		{ 
			System.Environment.SetEnvironmentVariable("couchdb_url", value);

			return new Dictionary<string,string>{{ "couchdb_url", Program.config_couchdb_url }};
		}*/

		// POST api/values 
		public void Post([FromBody]string value) 
		{ 
			//System.Environment.SetEnvironmentVariable("couchdb_url", value);
		} 

		// PUT api/values/5 
		public void Put(int id, [FromBody]string value) 
		{ 
		} 

		// DELETE api/values/5 
		public void Delete(int id) 
		{ 
		} 


	} 
}

