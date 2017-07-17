using System;

namespace mmria
{
	public class export_queue_item
	{
		public export_queue_item ()
		{
		}

		DateTime date_created { get; set;}
		string created_by { get; set;}
		DateTime date_last_updated { get; set;}
		string last_updated_by { get; set;}
		string file_name { get; set;}
		string export_type { get; set;}
		string status { get; set;}
	}
}

