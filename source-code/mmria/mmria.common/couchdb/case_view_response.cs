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

http://localhost:5984/mmrds/_design/sortable/_view/all

find one
    by_date?key="2009/01/30 18:04:11"

find many
    by_date?startkey="2010/01/01 00:00:00"&endkey="2010/02/00 00:00:00"


reverse sort
    descending=true
    also endkey=1&descending=true: 
*/

    public class case_view_sortable_item
    {
        public case_view_sortable_item () { }

        public string first_name{ get; set; }
        public string middle_name{ get; set; }
        public string last_name{ get; set; }
        public int? date_of_death_year{ get; set; }
        public int? date_of_death_month{ get; set; }

        public DateTime? date_created { get; set; }
        public string created_by{ get; set; }
        public DateTime? date_last_updated{ get; set; }
        public string last_updated_by{ get; set; }

        public DateTime? date_last_checked_out{ get; set; }
        public string last_checked_out_by{ get; set; }

        public string record_id{ get; set; }
        public string agency_case_id{ get; set; }
        public DateTime? date_of_committee_review{ get; set; }

        public string jurisdiction_id {get; set;}

        public int? case_status { get; set; }

        public DateTime? review_date_projected{ get; set; }

        public DateTime? review_date_actual{ get; set; }

        public DateTime? case_locked_date { get; set; }

        public string host_state{ get; set; }

        public string state_of_death{ get; set; }
        public int? pregnancy_relatedness{ get; set; }
    }


    public class case_view_item
	{
        public case_view_item(){}

		public string id { get; set; } //": "16e458537602f5ef2a710089dffd9453",
		public string key { get; set; } //": "16e458537602f5ef2a710089dffd9453",
        public case_view_sortable_item value {  get; set; }
	
	}

    public class case_view_response
	{
        public case_view_response () 
        {
            this.rows = new System.Collections.Generic.List<case_view_item> ();
        }

        public case_view_response 
        (
            int p_offset,
            System.Collections.Generic.List<case_view_item> p_rows,
            int p_total_rows 
        ) 
        {
            this.offset = p_offset;
            this.rows = p_rows;
            this.total_rows = p_total_rows;
        }


		public int offset { get; set; } //": 0,
        public System.Collections.Generic.List<case_view_item> rows { get; set; }
		public int total_rows { get; set; } 
	}
}

