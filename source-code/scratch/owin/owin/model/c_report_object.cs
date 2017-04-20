using System;
namespace mmria.server.model
{

	public struct  total_number_of_cases_by_pregnancy_relatedness_struc  
	{
		public int pregnancy_related;
		public int pregnancy_associated_but_not_related;
		public int not_pregnancy_related_or_associated;
		public int unable_to_determine;
		public int blank;
	}


	public struct total_number_of_pregnancy_related_deaths_by_ethnicity_struc
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
		public total_number_of_cases_by_pregnancy_relatedness_struc total_number_of_cases_by_pregnancy_relatedness;
		public total_number_of_pregnancy_related_deaths_by_ethnicity_struc total_number_of_pregnancy_related_deaths_by_ethnicity;
	}
}
