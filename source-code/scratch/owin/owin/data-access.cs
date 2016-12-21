using System;

namespace mmria.server
{
	public class data_access
	{
		public data_access ()
		{
		}
		/*	
		public void login(string user_id, string password)
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

			public dynamic getjson(string request_string)
		{
			//string request_string = string.Format ("http://geoservices.tamu.edu/Services/AddressNormalization/WebService/v04_01/Rest/?nonParsedStreetAddress={0}&nonParsedCity={1}&nonParsedState={2}&nonParsedZip={3}&apikey={4}&addressFormat=USPSPublication28&responseFormat=JSON&notStore=false&version=4.01", nonParsedStreetAddress, nonParsedCity, nonParsedState, nonParsedZip, geocode_api_key);

			System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
			request.ContentType = "application/json; charset=utf-8";
			System.Net.WebResponse response = request.GetResponse ();

			System.IO.Stream dataStream = response.GetResponseStream ();
			// Open the stream using a StreamReader for easy access.
			System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
			// Read the content.
			string responseFromServer = reader.ReadToEnd ();


			var json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(responseFromServer);
		}*/


	}
}

