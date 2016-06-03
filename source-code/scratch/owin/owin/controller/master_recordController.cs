using System.Collections.Generic;
using System.Web.Http;

namespace owin
{
	public class master_recordController: ApiController 
	{ 
		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public IEnumerable<master_record> Get() 
		{ 
			return new master_record[] 
			{ 
				new master_record(){ 
					id =  System.Guid.Parse("e5c511cc-40ec-4730-9656-95f53582a51b"),
					record_id = "VA-2011-1703",
					first_name = "Caterina",
					middle_name = "",
					last_name = "Schroeder",
					date_of_death = "3/8/2011",
					state_of_death = "VA",
					agency_case_id = "",
					is_valid_maternal_mortality_record = true
				},
				new master_record(){ 
					id =  System.Guid.Parse("42ad2325-0713-4fd0-a49e-5b03ee38e0e3"),
					record_id = "TN-2011-2722",
					first_name = "Bibiana",
					middle_name = "",
					last_name = "Hendriks",
					date_of_death = "12/9/2011",
					state_of_death = "TN",
					agency_case_id = "",
					is_valid_maternal_mortality_record = false
				},
				new master_record(){ 
					id =  System.Guid.Parse("1954deef-e6bb-4ae1-af88-15abffbba7db"),
					record_id = "RI-2012-9090",
					first_name = "Helen",
					middle_name = "",
					last_name = "Hendricks",
					date_of_death = "RI",
					state_of_death = "RI",
					agency_case_id = "",
					is_valid_maternal_mortality_record = true
				},
				}; 
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

