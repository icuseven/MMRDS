using System;
namespace owin.metadata
{
	public class node
	{
		public string prompt { get; set; }
		public string name { get; set; }
		public string type { get; set; }
		public string cardinality { get; set; } 
		public string[] values  { get; set; } 
		public node[] children { get; set; } 
		public string is_core_summary { get; set; } 
		public string is_required { get; set; } 

		public string regex_pattern { get; set; } 
		public string validation { get; set; } 
		public string onfocus { get; set; } 
		public string onchange { get; set; } 
		public string onblur { get; set; } 
		public string onclick { get; set; } 

		public string max_value { get; set; } 
		public string min_value { get; set; } 
		public string control_style { get; set; } 


		public node()
		{

		} 
			//

	}
}

