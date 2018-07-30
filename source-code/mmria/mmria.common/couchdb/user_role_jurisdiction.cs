using System;

namespace mmria.common.model.couchdb
{
	public class user_role_jurisdiction
	{
		public string _id { get; set; }
		public string _rev { get; set; }
		public string parent_id { get; set; }
		public string role_name { get; set; }
		public string user_id { get; set; }
		public string jurisdiction_id { get; set; }

		public DateTime? effective_start_date { get; set; } 
		public DateTime? effective_end_date { get; set; } 

		public bool? is_active { get; set; } 

		public DateTime? date_created { get; set; } 
		public string created_by { get; set; } 
		public DateTime? date_last_updated { get; set; } 
		public string last_updated_by { get; set; } 

		public string data_type { get; }  = "user_role_jursidiction";

		public user_role_jurisdiction()
		{

		}

	}
}

