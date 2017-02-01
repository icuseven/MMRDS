using System;
using System.Collections.Generic;
using Microsoft.CSharp;
using System.Web.Http;
using mmria.common.model;

namespace mmria.server
{
	public class geocodeController: ApiController 
	{
		private string geocode_api_key = null;

		public geocodeController ()
		{

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"])) 
			{
				geocode_api_key = System.Environment.GetEnvironmentVariable ("geocode_api_key");
			} 
			else
			{
				geocode_api_key = System.Configuration.ConfigurationManager.AppSettings["geocode_api_key"];
			}

		}
		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public IEnumerable<mmria.common.model.geocode_response> Get
		(
			string street_address,
			string city,
			string state,
			string zip
		) 
		{ 
			
			string request_string = string.Format ("https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress={0}&city={1}&state={2}&zip={3}&apikey={4}&format=json&allowTies=false&tieBreakingStrategy=flipACoin&includeHeader=true&census=true&censusYear=2000|2010&notStore=false&version=4.01", street_address, city, state, zip, geocode_api_key);

			System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
			request.ContentType = "application/json; charset=utf-8";
			System.Net.WebResponse response = request.GetResponse ();

			System.IO.Stream dataStream = response.GetResponseStream ();
			// Open the stream using a StreamReader for easy access.
			System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
			// Read the content.
			string responseFromServer = reader.ReadToEnd ();

			geocode_response json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<geocode_response>(responseFromServer);

			// make call to census if
			/*
			 NAACCR GIS Coordinate Quality Code

naaccrCensusTractCertaintyCode

				Valid Ranges Numeric ranges


				00 - 04, 08, 

				Then call census
*/


			geocode_response[] result =  new geocode_response[] 
			{ 
				json_result
				/*
				new geocode_response()
				{ 
					Latitude = json_result["OutputGeocodes"][0]["OutputGeocode"]["Latitude"],
					Longitude = json_result["OutputGeocodes"][0]["OutputGeocode"]["Longitude"],
					NAACCRGISCoordinateQualityCode = json_result["OutputGeocodes"][0]["OutputGeocode"]["NAACCRGISCoordinateQualityCode"],
					NAACCRGISCoordinateQualityType = json_result["OutputGeocodes"][0]["OutputGeocode"]["NAACCRGISCoordinateQualityType"],
					MatchScore = json_result["OutputGeocodes"][0]["OutputGeocode"]["MatchScore"],
					MatchType = json_result["OutputGeocodes"][0]["OutputGeocode"]["MatchType"],
					FeatureMatchingResultType = json_result["OutputGeocodes"][0]["OutputGeocode"]["FeatureMatchingResultType"],
					FeatureMatchingResultCount = json_result["OutputGeocodes"][0]["OutputGeocode"]["FeatureMatchingResultCount"],
					FeatureMatchingGeographyType = json_result["OutputGeocodes"][0]["OutputGeocode"]["FeatureMatchingGeographyType"],
					RegionSize = json_result["OutputGeocodes"][0]["OutputGeocode"]["RegionSize"],
					RegionSizeUnits = json_result["OutputGeocodes"][0]["OutputGeocode"]["RegionSizeUnits"],
					MatchedLocationType = json_result["OutputGeocodes"][0]["OutputGeocode"]["MatchedLocationType"],
					ExceptionOccured = json_result["OutputGeocodes"][0]["OutputGeocode"]["ExceptionOccured"],
					Exception = json_result["OutputGeocodes"][0]["OutputGeocode"]["Exception"],
					ErrorMessage = json_result["OutputGeocodes"][0]["OutputGeocode"]["ErrorMessage"],

				}*/
			}; 

			return result;
		} 

		private string get_couch_db_url()
		{
			string result = null;

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"])) 
			{
				result = System.Environment.GetEnvironmentVariable ("couchdb_url");
			} 
			else
			{
				result = System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"];
			}

			return result;
		}


	}
}

