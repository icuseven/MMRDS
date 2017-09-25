using System;

namespace mmria.common.model.couchdb
{

/*
{
    "total_rows":2,
    "offset":0,
    "rows":[
            {"id":"02279162-6be3-49e4-930f-42eed7cd4706","key":["hubbard","silvia","2016"],"value":null},
            {"id":"cb9f90c5-fc9b-1530-7d20-4891f9a40027","key":["sumo","maiko","2017"],"value":null}
    ]
}

home_record/first_name
home_record/middle_name
home_record/last_name
home_record/date_of_death/year
home_record/date_of_death/month

date_created
created_by
date_last_updated
last_updated_by

home_record/record_id
home_record/agency_case_id
committee_review/date_of_review



*/

    public class case_view_item
	{
        public case_view_item(){}

		public string id { get; set; } //": "16e458537602f5ef2a710089dffd9453",
		public string key { get; set; } //": "16e458537602f5ef2a710089dffd9453",
		public struct value {  public string rev;}
	
	}

    public class case_view_response
	{
        public case_view_response (){}

		public int offset { get; set; } //": 0,
        public case_view_item[] rows { get; set; }
		public int total_rows { get; set; } 
	}
}

