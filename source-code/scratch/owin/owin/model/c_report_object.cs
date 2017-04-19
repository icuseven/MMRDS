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

	public struct c_report_object
	{
		public string _id ;

		public total_number_of_cases_by_pregnancy_relatedness_struc total_number_of_cases_by_pregnancy_relatedness;
	}
}
