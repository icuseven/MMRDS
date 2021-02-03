using System;
using System.Collections.Generic;

namespace mmria.common.couchdb
{
    public class DBConfigurationDetail
    {
        public string prefix { get; set;}
        public string url { get; set; }

        public string user_name { get; set; }

        public string user_value { get; set; }

    }
    public class ConfigurationSet
    {
        public string _id { get; set;}
        public string _rev { get; set; }

        public string data_type { get; } = "configuration-set";

        public DBConfigurationDetail DetailList { get;set; }


		public DateTime date_created { get; set; } 
		public string created_by { get; set; } 
		public DateTime date_last_updated { get; set; } 
		public string last_updated_by { get; set; } 

    }
}