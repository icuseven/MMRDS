using System;

namespace mmria
{
	public class export_queue_item
	{
		public export_queue_item ()
		{
		}

		public string _id {get; set;}
		public string _rev {get; set;}
		public bool? _deleted { get; set;}
		public DateTime? date_created { get; set;}
		public string created_by { get; set;}
		public DateTime? date_last_updated { get; set;}
		public string last_updated_by { get; set;}
		public string file_name { get; set;}
		public string export_type { get; set;}
		public string status { get; set;}
	}
}

