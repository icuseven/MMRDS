using System;
namespace mmria.server.model
{
	public class c_aggregate
	{
		public string _id { get; set; }
		public long? hr_date_of_death_year { get; set; }
		public long? hr_date_of_death_month { get; set; }
		public long? hr_date_of_death_day { get; set; }
		public System.DateTime?  date_of_review { get; set; }
		public string was_this_death_preventable { get; set; }
		public string pregnancy_relatedness { get; set; }
		public string bc_is_of_hispanic_origin { get; set; }
		public string dc_is_of_hispanic_origin { get; set; }
		public string age { get; set; }
		public string  pmss { get; set; }
		public string  pmss_mm_secondary { get; set; }
		public string did_obesity_contribute_to_the_death { get; set; }
		public string did_mental_health_conditions_contribute_to_the_death { get; set; }
		public string did_substance_use_disorder_contribute_to_the_death { get; set; }
		public string was_this_death_a_sucide { get; set; }
		public string was_this_death_a_homicide { get; set; }
		public System.Collections.Generic.List<string> dc_race { get; set; }
		public System.Collections.Generic.List<string> bc_race { get; set; }

		public c_aggregate()
		{
		}
	}
}
