using System;
using System.Collections.Generic;
using Microsoft.CSharp;
using System.Web.Http;

namespace owin
{
	public class geocodeController: ApiController 
	{
		public geocodeController ()
		{
		}
		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public IEnumerable<geocode_response> Get
		(
			string nonParsedStreetAddress,
			string nonParsedCity,
			string nonParsedState,
			string nonParsedZip
		) 
		{ 

			string request_string = string.Format ("http://geoservices.tamu.edu/Services/AddressNormalization/WebService/v04_01/Rest/?nonParsedStreetAddress={0}&nonParsedCity={1}&nonParsedState={2}&nonParsedZip={3}&apikey=7c39ae93786d4aa3adb806cb66de51b8&addressFormat=USPSPublication28&responseFormat=JSON&notStore=false&version=4.01", nonParsedStreetAddress, nonParsedCity, nonParsedState, nonParsedZip);

			System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
			request.ContentType = "application/json; charset=utf-8";
			System.Net.WebResponse response = request.GetResponse ();

			System.IO.Stream dataStream = response.GetResponseStream ();
			// Open the stream using a StreamReader for easy access.
			System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
			// Read the content.
			string responseFromServer = reader.ReadToEnd ();


			var result = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(responseFromServer);

			return new geocode_response[] 
			{ 
				new geocode_response(){ 
					Number = result.StreetAddresses[0].Number,
					NumberFractional = "",
					PreDirectional = "",
					PreQualifier = "",
					PreType = "",
					PreArticle = "",
					StreetName = "OLD US 25",
					Suffix = "",
					PostArticle = "",
					PostQualifier = "",
					PostDirectional = "",
					SuiteType = "",
					SuiteNumber = "",
					City = "LOS ANGELES",
					State = "CA",
					ZIP = "90089",
					ZIPPlus1 = "",
					ZIPPlus2 = "",
					ZIPPlus3 = "",
					ZIPPlus4 = "0255",
					ZIPPlus5 = "",
					PostOfficeBoxType = "",
					PostOfficeBoxNumber = ""
				}
			}; 
		} 

		// GET api/values/5 
		public master_record Get(int id) 
		{ 
			return default(master_record); 
		} 
		/*
		// POST api/values 
		public void Post([FromBody]master_record value) 
		{ 
		} 

		// PUT api/values/5 
		public void Put(int id, [FromBody]master_record value) 
		{ 
		} */

		// DELETE api/values/5 
		public void Delete(System.Guid  id) 
		{ 
		} 


	}
}

