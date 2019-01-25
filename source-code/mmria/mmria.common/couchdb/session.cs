using System;

namespace mmria.common.model.couchdb
{	
    public class session
	{
    	public session ()
		{
            data = new System.Collections.Generic.Dictionary<string,string>(StringComparer.InvariantCultureIgnoreCase);
		}

        public string _id {get; set;}
        public string _rev {get; set;}
		public string data_type { get; set; } = "session";
        public DateTime date_created {get; set;}
        public string user_id {get; set;}
        public string ip {get; set;}
        public string session_event_id {get; set;}

        public System.Collections.Generic.Dictionary<string,string> data { get; set; }

    }
}