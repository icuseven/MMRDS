using System;

namespace owin
{
	public class Info
	{
		public Info ()
		{
		}

		public string authentication_db { get; set;}
		public System.Collections.Generic.IDictionary<string,string> authentication_handlers { get; set;}
		public string authenticated { get; set;}
	}
}

