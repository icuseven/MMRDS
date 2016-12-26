using System;

namespace mmria.server
{
	public class geocode_response
	{
		public geocode_response ()
		{
		}

		public string Latitude { get; set; }
		public string Longitude { get; set; }
		public string NAACCRGISCoordinateQualityCode { get; set; }
		public string NAACCRGISCoordinateQualityType { get; set; }
		public string MatchScore { get; set; }
		public string MatchType { get; set; }
		public string FeatureMatchingResultType { get; set; }
		public string FeatureMatchingResultCount { get; set; }
		public string FeatureMatchingGeographyType { get; set; }
		public string RegionSize { get; set; }
		public string RegionSizeUnits { get; set; }
		public string MatchedLocationType { get; set; }
		public string ExceptionOccured { get; set; }
		public string Exception { get; set; }
		public string ErrorMessage { get; set; }


		/*
		{
	"version" : "4.10",
	"TransactionId" : "50e58be1-67b5-48e0-a55b-34050d7dfa31",
	"Version" : "4.1",
	"QueryStatusCodeValue" : "200",
	"FeatureMatchingResultType" : "Success",
	"FeatureMatchingResultCount" : "1",
	"TimeTaken" : "0.0170017",
	"ExceptionOccured" : "False",
	"Exception" : "",
	"InputAddress" :
		{
		"StreetAddress" : "123 MAIN ST LOS ANGELES CA 90007",
		"City" : "LOS ANGELES",
		"State" : "CA",
		"Zip" : "90007"
		},
	"OutputGeocodes" :
	[
		{
		"OutputGeocode" :
			{
			"Latitude" : "34.026525",
			"Longitude" : "-118.282408",
			"NAACCRGISCoordinateQualityCode" : "09",
			"NAACCRGISCoordinateQualityType" : "AddressZIPCentroid",
			"MatchScore" : "100",
			"MatchType" : "Exact",
			"FeatureMatchingResultType" : "Success",
			"FeatureMatchingResultCount" : "1",
			"FeatureMatchingGeographyType" : "USPSZip",
			"RegionSize" : "0",
			"RegionSizeUnits" : "Meters",
			"MatchedLocationType" : "LOCATION_TYPE_STREET_ADDRESS",
			"ExceptionOccured" : "False",
			"Exception" : "",
			"ErrorMessage" : ""
			}
		}
	]
}*/

	}
}

