using System;

namespace owin.data.api
{
	
	public class Set_Case_List_Request
	{
		public string security_token { get; set; }
		public System.Dynamic.ExpandoObject[] case_list { get; set;}
	}

	public class Set_Case_List_Response
	{
		public bool Ok { get; set;}
		public string Queue_Id { get; set;}
	}


	public class Check_Queue_Request
	{
		public string security_token { get; set; }
		public string Queue_Id { get; set;}
	}


	public class Check_Queue_Response
	{
		public bool Ok { get; set;}
		public string queue_id { get; set;}
		public string processing_status { get; set;}
		public Result_Item[] result_list { get; set;}

	}

	public class Result_Item
	{
		public string summary { get; set;}
		public string case_id { get; set;}
		public string path { get; set;}
		public string detail { get; set;}
	}
}

