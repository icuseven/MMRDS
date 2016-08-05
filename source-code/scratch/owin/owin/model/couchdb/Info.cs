using System;

namespace owin
{
	public class Info
	{
		public Info ()
		{
		}

		public string authentication_db { get; set;}
		public string[] authentication_handlers { get; set;}
		public string authenticated { get; set;}
	}
}

