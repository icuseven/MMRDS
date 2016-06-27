using System;
using System.Collections.Generic;
using Microsoft.CSharp;
using System.Web.Http;

namespace owin
{
	public class geocodeController: ApiController 
	{
		private static string geocode_api_key = System.Configuration.ConfigurationManager.AppSettings["geocode_api_key"];

		public geocodeController ()
		{
		}
		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public IEnumerable<geocode_response> Get
		(
			string street_address,
			string city,
			string state,
			string zip
		) 
		{ 
			
			string request_string = string.Format ("https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress={0}&city={1}&state={2}&zip={3}&apikey={4}&format=json&allowTies=false&tieBreakingStrategy=flipACoin&includeHeader=true&notStore=false&version=4.01", street_address, city, state, zip, geocode_api_key);

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
					Latitude = result.OutputGeocodes[0].Latitude,
					Longitude = result.OutputGeocodes[0].Longitude,
					NAACCRGISCoordinateQualityCode = result.OutputGeocodes[0].NAACCRGISCoordinateQualityCode,
					NAACCRGISCoordinateQualityType = result.OutputGeocodes[0].NAACCRGISCoordinateQualityType,
					MatchScore = result.OutputGeocodes[0].MatchScore,
					MatchType = result.OutputGeocodes[0].MatchType,
					FeatureMatchingResultType = result.OutputGeocodes[0].FeatureMatchingResultType,
					FeatureMatchingResultCount = result.OutputGeocodes[0].FeatureMatchingResultCount,
					FeatureMatchingGeographyType = result.OutputGeocodes[0].FeatureMatchingGeographyType,
					RegionSize = result.OutputGeocodes[0].RegionSize,
					RegionSizeUnits = result.OutputGeocodes[0].RegionSizeUnits,
					MatchedLocationType = result.OutputGeocodes[0].MatchedLocationType,
					ExceptionOccured = result.OutputGeocodes[0].ExceptionOccured,
					Exception = result.OutputGeocodes[0].Exception,
					ErrorMessage = result.OutputGeocodes[0].ErrorMessage
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

