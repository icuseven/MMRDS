using System;
using System.Collections.Generic;

namespace mmria.common.metadata
{
	public class Version_Specification
	{
        public Version_Specification()
        {
            this.shema = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            this.data_type = "version_specification";
        }
        public string _id { get; set; }

        public string _rev { get; set; }
	
		public string data_type { get; set; }
		public string date_created { get; set; } 
		public string created_by { get; set; } 
		public string date_last_updated { get; set; } 
		public string last_updated_by { get; set; }         

		public string name { get; set; }

        public string metadata { get; set; }

        public Dictionary<string, string> shema { get; set; } 

    }
}