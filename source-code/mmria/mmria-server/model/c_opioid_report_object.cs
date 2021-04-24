using System;
namespace mmria.server.model
{
	public struct opioid_report_value_struct
	{
		public string host_state;

		public int? year_of_death;
		public int? month_of_death;
		public int? day_of_death;

		public int? case_review_year;
		public int? case_review_month;

		public int? case_review_day;

		public int? pregnancy_related;

		public string indicator_id;

		public string field_id;
		public int? value;
		public string jurisdiction_id;
	}

	public class c_opioid_report_object
	{

		public c_opioid_report_object(string p_type = "overdose")
		{
			this.type = p_type;
			this.data = new System.Collections.Generic.List<opioid_report_value_struct>();
		}
		public string _id ;

		public string type;
        public int? means_of_fatal_injury;

		public System.Collections.Generic.List<opioid_report_value_struct> data;

		public int? year_of_death;
		public int? month_of_case_review;
		public int? year_of_case_review;
		public int? day_of_case_review;

		public string jurisdiction_id;

	}
}
