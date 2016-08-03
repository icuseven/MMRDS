using System;
using DreamSeat;
using MindTouch;

namespace owin
{
	public class data_access
	{
		public data_access ()
		{
		}

		public void login()
		{

			CouchClient theClient;
			CouchDatabase theDatabase;

			// assumes localhost:5984 and Admin Party if constructor is left blank
			//theClient = new CouchClient("localhost",5984,"mmrds", "mmrds");
			theClient = new CouchClient();
			//theDatabase = theClient.GetDatabase ("mmrds");
			//Console.WriteLine(theClient.Logon(
			bool isLoggedin = theClient.Logon ("user1", "password", new MindTouch.Tasking.Result<bool>()).Wait();



		}

	}
}

