using System;

namespace mmria.server.model.couchdb
{


	public class value_tuple 
	{  
		public value_tuple(){}
		
		public string rev { get; set; }

		public mmria.server.model.couchdb.user doc { get; set; }

	}
	public class user_alldoc_item
	{
		public user_alldoc_item(){}

		public string id { get; set; } //": "16e458537602f5ef2a710089dffd9453",
		public string key { get; set; } //": "16e458537602f5ef2a710089dffd9453",
		public value_tuple value {get;set;}
	
	}

	public class user_alldocs_response
	{
		public user_alldocs_response (){}

		public int offset { get; set; } //": 0,
		public user_alldoc_item[] rows { get; set; }
		public int total_rows { get; set; } 
	}
}

