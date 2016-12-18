using System;

namespace owin.model
{
	public class home_record
	{
		public home_record ()
		{
		}

		public string id { get; set; }
		public string record_id { get; set; }
		public string first_name { get; set; }
		public string middle_name { get; set; }
		public string last_name { get; set; }
		public string date_of_death { get; set; }
		public string state_of_death { get; set; }
		public string agency_case_id { get; set; }
		public bool is_valid_maternal_mortality_record { get; set; }

		public DateTime date_created { get; set; }
		public string created_by { get; set; }
		public DateTime date_last_updated { get; set; }
		public string last_updated_by { get; set; }

		public string state_of_last_known_residence { get; set; }
	
		public string death_certificate { get; set; }
		public string autopsy_report { get; set; }
		public string birth_certificate_parent_section { get; set; }
		public string birth_certificate_infant_or_fetal_death_section { get; set; }
		public string prenatal_care_record { get; set; }
		public string other_medical_visits { get; set; }
		public string er_visits_and_hospitalizations { get; set; }
		public string social_and_psychological_profile { get; set; }
		public string informant_interviews { get; set; }
		public string committe_review_worksheet { get; set; }

		public static home_record convert(System.Dynamic.ExpandoObject value)
		{
			var val = value as System.Collections.Generic.IDictionary<string, object>;
			return new owin.model.home_record
			{
				id = val["id"].ToString(),
				record_id = val["record_id"].ToString(),
				first_name = val["first_name"].ToString(),
				middle_name = val["middle_name"].ToString(),
				last_name = val["last_name"].ToString(),
				date_of_death = val["date_of_death"].ToString(),
				state_of_death = val["state_of_death"].ToString(),
				agency_case_id = val["agency_case_id"].ToString(),
				is_valid_maternal_mortality_record = bool.Parse(val["is_valid_maternal_mortality_record"].ToString()),
				date_created = DateTime.Parse(val["date_created"].ToString()),
				created_by = val["created_by"].ToString(),
				date_last_updated = DateTime.Parse(val["date_last_updated"].ToString()),
				last_updated_by = val["last_updated_by"].ToString(),
				state_of_last_known_residence = val["state_of_last_known_residence"].ToString(),
				death_certificate = val["death_certificate"].ToString(),
				autopsy_report = val["autopsy_report"].ToString(),
				birth_certificate_parent_section = val["birth_certificate_parent_section"].ToString(),
				birth_certificate_infant_or_fetal_death_section = val["birth_certificate_infant_or_fetal_death_section"].ToString(),
				prenatal_care_record = val["prenatal_care_record"].ToString(),
				other_medical_visits = val["other_medical_visits"].ToString(),
				er_visits_and_hospitalizations = val["er_visits_and_hospitalizations"].ToString(),
				social_and_psychological_profile = val["social_and_psychological_profile"].ToString(),
				informant_interviews = val["informant_interviews"].ToString(),
				committe_review_worksheet = val["committe_review_worksheet"].ToString()


			};
		}
	}
}

