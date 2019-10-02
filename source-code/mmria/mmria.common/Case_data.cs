using System;
using System.Collections.Generic;

namespace mmria.common.data.api
{
	

    public class Answer_Summary 
    {
        public Answer_Summary()
        {
            de_identified_field_set= new HashSet<string>();
            case_set = new List<string>();
        }
        public string all_or_core {get; set;}
        public string grantee_name {get; set;}
        public string is_encrypted {get; set;}
        public string encryption_key {get; set;}
        public string is_for_cdc {get; set;}
        public string de_identified_selection_type {get; set;}
        public HashSet<string> de_identified_field_set {get; set;}
        public List<string> case_set {get; set;}
    }

	public class Set_Queue_Request
	{
		public string security_token { get; set; }
		public string action { get; set; }
		public System.Dynamic.ExpandoObject[] case_list { get; set;}
	}

	public class Set_Queue_Response
	{
		public bool Ok { get; set;}
		public string message { get; set;}
		public string Queue_Id { get; set;}
	}


	public class Check_Queue_Request
	{
		public string security_token { get; set; }
		public string action { get; set; }
		public string[] Queue_Id { get; set;}
	}


	public class Check_Queue_Response
	{
		public bool Ok { get; set;}
		public string message { get; set;}
		public Queue_Status_Item[] queue_id { get; set;}
	}

	public class Queue_Status_Item
	{
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


	public class Queue_Item
	{
		public string queue_id { get; set;}
		public string processing_status { get; set;}
		public string action { get; set; }
		public System.Dynamic.ExpandoObject[] case_list { get; set;}
		public Result_Item[] result_list { get; set;}
	}
}

