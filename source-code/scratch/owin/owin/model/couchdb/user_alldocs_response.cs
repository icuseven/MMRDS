using System;

namespace owin.model.couchdb
{


	public class value_struct {  
		public string rev; 
		public owin.model.couchdb.user doc;
		public value_struct(){}
	}
	public class user_alldoc_item
	{
		public user_alldoc_item(){}

		public string id { get; set; } //": "16e458537602f5ef2a710089dffd9453",
		public string key { get; set; } //": "16e458537602f5ef2a710089dffd9453",
		public value_struct value {get;set;}
	
	}

	public class user_alldocs_response
	{
		public user_alldocs_response (){}

		public int offset { get; set; } //": 0,
		public user_alldoc_item[] rows { get; set; }
		public int total_rows { get; set; } 
	}
}

