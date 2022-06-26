using System;
using System.Collections.Generic;

namespace mmria.services.backup
{
	public class cBulkDocument
	{
		public cBulkDocument ()
		{
			docs = new List<IDictionary<string, object>> ();
		}

		public List<IDictionary<string, object>> docs { get; set; }

	}
}
