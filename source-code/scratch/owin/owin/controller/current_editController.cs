using System.Collections.Generic;
using System.Web.Http;

namespace owin
{
	public class current_editController: ApiController 
	{ 
		static current_edit current_edit_ = null;

		static current_editController()
		{
			current_edit_ = new current_edit ();
		}

		// GET api/values 
		public current_edit Get() 
		{ 
			return current_edit_; 
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
		public void Put(string id, [FromBody]string value) 
		{ 
		} 

		// DELETE api/values/5 
		public void Delete(int id) 
		{ 
		} 
	} 
}

