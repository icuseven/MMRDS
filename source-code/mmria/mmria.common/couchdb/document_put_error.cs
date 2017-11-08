using System;

namespace mmria.common.model.couchdb
{
	public class document_put_error
	{
		public string error { get; set;}
		public string reason { get; set; }

		public document_put_error ()
		{
		}
	}
}

