using System;

namespace mmria.common.model.couchdb
{
	public class jurisdiction
	{

		public string _id { get; set; }
		public string _rev { get; set; }
		public string name { get; set; }
		public DateTime date_created { get; set; } 
		public string created_by { get; set; } 
		public DateTime date_last_updated { get; set; } 
		public string last_updated_by { get; set; } 
		public bool is_active { get; set; } 
		public bool is_enabled { get; set; } 

		public string parent_id { get; set; }

		public jurisdiction()
		{

		}

	}
}

