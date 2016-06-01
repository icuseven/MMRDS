using System.Collections.Generic;
using System.Web.Http;

namespace owin
{
	public class master_recordController: ApiController 
	{ 
		// GET api/values 
		public IEnumerable<master_record> Get() 
		{ 
			return new master_record[] { default(master_record), default(master_record) }; 
		} 

		// GET api/values/5 
		public master_record Get(int id) 
		{ 
			return default(master_record); 
		} 

		// POST api/values 
		public void Post([FromBody]master_record value) 
		{ 
		} 

		// PUT api/values/5 
		public void Put(int id, [FromBody]master_record value) 
		{ 
		} 

		// DELETE api/values/5 
		public void Delete(System.Guid  id) 
		{ 
		} 
	} 
}

