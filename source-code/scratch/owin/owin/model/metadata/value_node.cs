using System;
namespace owin.metadata
{
	public class form
	{
		public string prompt { get; set; }
		public string name { get; set; }
		public string type { get; set; } //= "form"
		public string cardinality { get; set; } 
		public node[] children { get; set; } 

		public form()
		{


		}
	}
}

