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
        public ConfigurationSet()
        {
            this.detail_list = new Dictionary<string, DBConfigurationDetail>(StringComparer.OrdinalIgnoreCase);
            this.name_value = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        }
        public string _id { get; set;}
        public string _rev { get; set; }
        public string service_key {get; set; }

        public string data_type { get; } = "configuration-set";

        public Dictionary<string, string> name_value { get;set; }

        public Dictionary<string, DBConfigurationDetail> detail_list { get;set; }

		public DateTime date_created { get; set; } 
		public string created_by { get; set; } 
		public DateTime date_last_updated { get; set; } 
		public string last_updated_by { get; set; } 

    }
}