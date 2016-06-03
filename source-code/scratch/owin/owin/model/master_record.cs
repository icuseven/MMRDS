using System;

namespace owin
{
	public class master_record
	{
		public master_record ()
		{
		}

		public System.Guid id { get; set; }
		public string record_id { get; set; }
		public string first_name { get; set; }
		public string middle_name { get; set; }
		public string last_name { get; set; }
		public string date_of_death { get; set; }
		public string state_of_death { get; set; }
		public string agency_case_id { get; set; }
		public bool is_valid_maternal_mortality_record { get; set; }
	}
}

