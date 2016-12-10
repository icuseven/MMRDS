using System;
using System.Collections.Generic;
using Microsoft.CSharp;
using System.Web.Http;

namespace owin
{
	public class address_normalizationController: ApiController 
	{
		#if CONTAINERBASED
			private static string geocode_api_key = System.Environment.GetEnvironmentVariable("geocode_api_key");
		#else
			private static string geocode_api_key = System.Configuration.ConfigurationManager.AppSettings["geocode_api_key"];
		#endif

		public address_normalizationController ()
		{
		}
		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public IEnumerable<address_normalization_response> Get
		(
			string nonParsedStreetAddress,
			string nonParsedCity,
			string nonParsedState,
			string nonParsedZip
		) 
		{ 

			string request_string = string.Format ("http://geoservices.tamu.edu/Services/AddressNormalization/WebService/v04_01/Rest/?nonParsedStreetAddress={0}&nonParsedCity={1}&nonParsedState={2}&nonParsedZip={3}&apikey={4}&addressFormat=USPSPublication28&responseFormat=JSON&notStore=false&version=4.01", nonParsedStreetAddress, nonParsedCity, nonParsedState, nonParsedZip, geocode_api_key);

			System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
			request.ContentType = "application/json; charset=utf-8";
			System.Net.WebResponse response = request.GetResponse ();

			System.IO.Stream dataStream = response.GetResponseStream ();
			// Open the stream using a StreamReader for easy access.
			System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
			// Read the content.
			string responseFromServer = reader.ReadToEnd ();


			var json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(responseFromServer);

			address_normalization_response[] result = new address_normalization_response[] 
			{ 
				new address_normalization_response()
				{ 
					Number = json_result["StreetAddresses"][0]["Number"],
					NumberFractional = json_result["StreetAddresses"][0]["NumberFractional"],
					PreDirectional = json_result["StreetAddresses"][0]["PreDirectional"],
					PreQualifier = json_result["StreetAddresses"][0]["PreQualifier"],
					PreType = json_result["StreetAddresses"][0]["PreType"],
					PreArticle = json_result["StreetAddresses"][0]["PreArticle"],
					StreetName = json_result["StreetAddresses"][0]["StreetName"],
					Suffix = json_result["StreetAddresses"][0]["Suffix"],
					PostArticle = json_result["StreetAddresses"][0]["PostArticle"],
					PostQualifier = json_result["StreetAddresses"][0]["PostQualifier"],
					PostDirectional = json_result["StreetAddresses"][0]["PostDirectional"],
					SuiteType = json_result["StreetAddresses"][0]["SuiteType"],
					SuiteNumber = json_result["StreetAddresses"][0]["SuiteNumber"],
					City = json_result["StreetAddresses"][0]["City"],
					State = json_result["StreetAddresses"][0]["State"],
					ZIP = json_result["StreetAddresses"][0]["ZIP"],
					ZIPPlus1 = json_result["StreetAddresses"][0]["ZIPPlus1"],
					ZIPPlus2 = json_result["StreetAddresses"][0]["ZIPPlus2"],
					ZIPPlus3 = json_result["StreetAddresses"][0]["ZIPPlus3"],
					ZIPPlus4 = json_result["StreetAddresses"][0]["ZIPPlus4"],
					ZIPPlus5 = json_result["StreetAddresses"][0]["ZIPPlus5"],
					PostOfficeBoxType = json_result["StreetAddresses"][0]["PostOfficeBoxType"],
					PostOfficeBoxNumber = json_result["StreetAddresses"][0]["PostOfficeBoxNumber"]
				}
			}; 

			return result;
		} 

		// GET api/values/5 
		public owin.model.home_record Get(int id) 
		{ 
			return default( owin.model.home_record); 
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

