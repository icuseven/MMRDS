using System;

namespace mmria.common.model
{
	public class geocode_response
	{
		public geocode_response ()
		{
		}

		//public string version { get; set; }
		public string TransactionId { get; set; }
		public string Version { get; set; }
		public string QueryStatusCodeValue { get; set; }
		public string FeatureMatchingResultType { get; set; }
		public string FeatureMatchingResultCount { get; set; }
		public string TimeTaken { get; set; }
		public string ExceptionOccured { get; set; }
		public string Exception { get; set; }
		public InputAddress InputAddress { get; set; }
		public System.Dynamic.ExpandoObject[] OutputGeocodes { get; set; }



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
			"Latitude" : "33.7045294464357",
			"Longitude" : "-84.4990086891076",
			"NAACCRGISCoordinateQualityCode" : "02",
			"NAACCRGISCoordinateQualityType" : "Parcel",
			"MatchScore" : "96.7455621301775",
			"MatchType" : "Relaxed;Soundex",
			"FeatureMatchingResultType" : "Success",
			"FeatureMatchingResultCount" : "1",
			"FeatureMatchingGeographyType" : "Parcel",
			"RegionSize" : "1939.79034121102",
			"RegionSizeUnits" : "Meters",
			"MatchedLocationType" : "LOCATION_TYPE_STREET_ADDRESS",
			"ExceptionOccured" : "False",
			"Exception" : "",
			"ErrorMessage" : ""
			},
		"CensusValues" :
		[
			{
			"CensusValue2" :
				{
				"CensusYear" : "TwoThousand",
				"CensusTimeTaken" : "51.0051",
				"NAACCRCensusTractCertaintyCode" : "1",
				"NAACCRCensusTractCertaintyType" : "ResidenceStreetAddress",
				"CensusBlock" : "5010",
				"CensusBlockGroup" : "5",
				"CensusTract" : "0077.01",
				"CensusCountyFips" : "121",
				"CensusStateFips" : "13",
				"CensusCbsaFips" : "12060",
				"CensusCbsaMicro" : "0",
				"CensusMcdFips" : "90144",
				"CensusMetDivFips" : "",
				"CensusMsaFips" : "0520",
				"CensusPlaceFips" : "04000",
				"ExceptionOccured" : "False",
				"Exception" : "",
				"ErrorMessage" : ""
				},
			"CensusValue1" :
				{
				"CensusYear" : "TwoThousandTen",
				"CensusTimeTaken" : "90.009",
				"NAACCRCensusTractCertaintyCode" : "1",
				"NAACCRCensusTractCertaintyType" : "ResidenceStreetAddress",
				"CensusBlock" : "3004",
				"CensusBlockGroup" : "3",
				"CensusTract" : "0077.03",
				"CensusCountyFips" : "121",
				"CensusStateFips" : "13",
				"CensusCbsaFips" : "12060",
				"CensusCbsaMicro" : "0",
				"CensusMcdFips" : "90144",
				"CensusMetDivFips" : "",
				"CensusMsaFips" : "0520",
				"CensusPlaceFips" : "04000",
				"ExceptionOccured" : "False",
				"Exception" : "",
				"ErrorMessage" : ""
				}
			}
		]
		}
	]
}
*/

	}
}

