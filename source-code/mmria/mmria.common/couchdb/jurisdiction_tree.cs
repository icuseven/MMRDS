using System;

namespace mmria.common.model.couchdb
{
	public class jurisdiction_tree
	{

		public string _id { get; } = "jurisdiction_tree";
		public string _rev { get; set; }
		public string name { get; } = "/";
		public DateTime date_created { get; set; } 
		public string created_by { get; set; } 
		public DateTime date_last_updated { get; set; } 
		public string last_updated_by { get; set; } 


		public jurisdiction[] children { get; set; } 

		public string data_type { get; } = "jursidiction_tree";

		public jurisdiction_tree()
		{

		}

	}
}

