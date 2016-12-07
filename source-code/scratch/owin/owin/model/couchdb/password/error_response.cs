using System;

namespace owin.model.couchdb
{
	public class error_response
	{
		public error_response ()
		{
		}

		public string error { get; set; }
		public string reason { get; set; }

	}
}

