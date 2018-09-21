using System;
using System.Collections.Generic;

namespace mmria.common.model.couchdb.aggregate_report
{
    public interface aggregate_report_marker {}
	public class or_specification : aggregate_report_marker
	{
		public or_specification(){}

		public List<aggregate_report_marker> or {  get; set;}
	}


	public class and_specification : aggregate_report_marker
	{
		public and_specification(){}

		public List<aggregate_report_marker> and {  get; set;}
	}

	public class path_specification : aggregate_report_marker
	{
		public path_specification(){}

        public string path { get; set; }
	
		public List<aggregate_report_marker> value {  get; set;}
	}
	
	public class group_specfication
	{
		public group_specfication(){}

        public string group { get; set; }
		public string name { get; set; } 
        public string prompt { get; set; } 
		
		public List<aggregate_report_marker> specification {  get; set;}
	
	}

	
}