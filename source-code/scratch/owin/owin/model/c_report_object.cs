using System;
namespace mmria.server.model
{
	public struct total_number_pregnant_at_time_of_death_struct
	{
		public int pregnant_at_the_time_of_death;
		public int pregnant_within_42_days_of_death;
		public int pregnant_within_43_to_365_days_of_death;
		public int blank;	}

	public struct total_number_of_pregnancy_related_deaths_by_age_struct
	{
		public int age_less_than_20;
		public int age_20_to_24;
		public int age_25_to_29;
		public int age_30_to_34;
		public int age_35_to_44;
		public int age_45_and_above;
		public int blank;	}

	public struct  total_number_of_cases_by_pregnancy_relatedness_struct 
	{
		public int pregnancy_related;
		public int pregnancy_associated_but_not_related;
		public int not_pregnancy_related_or_associated;
		public int unable_to_determine;
		public int blank;
	}


	public struct ethnicity_struct
	{
		public int blank;
		public int hispanic;
		public int non_hispanic_black;
		public int non_hispanic_white;
		public int american_indian_alaska_native;
		public int native_hawaiian;
		public int guamanian_or_chamorro;
		public int samoan;
		public int other_pacific_islander;
		public int asian_indian;
		public int filipino;
		public int korean;
		public int other_asian;
		public int chinese;
		public int japanese;
		public int vietnamese;
		public int other;
	}


	public struct c_report_object
	{
		public string _id ;
		public int? year_of_death;
		public int? month_of_case_review;
		public int? year_of_case_review;
		public total_number_of_cases_by_pregnancy_relatedness_struct total_number_of_cases_by_pregnancy_relatedness;
		public ethnicity_struct total_number_of_pregnancy_related_deaths_by_ethnicity;
		public ethnicity_struct total_number_of_pregnancy_associated_ethnicity;
		public total_number_of_pregnancy_related_deaths_by_age_struct total_number_of_pregnancy_related_deaths_by_age;
		public total_number_of_pregnancy_related_deaths_by_age_struct total_number_of_pregnancy_associated_deaths_by_age;
		public total_number_pregnant_at_time_of_death_struct total_number_pregnancy_related_at_time_of_death;
		public total_number_pregnant_at_time_of_death_struct total_number_pregnancy_associated_at_time_of_death;
	}
}
