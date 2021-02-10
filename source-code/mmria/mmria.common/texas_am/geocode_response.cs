using System;

namespace mmria.common.model
{
	public interface OutputGeocodeItem{}
	public class CensusValue : OutputGeocodeItem
	{
		public CensusValue(){}
		public string CensusYear { get;set;}
		public string CensusTimeTaken { get;set;}
		public string NAACCRCensusTractCertaintyCode { get;set;}
		public string NAACCRCensusTractCertaintyType { get;set;}
		public string CensusBlock { get;set;}
		public string CensusBlockGroup { get;set;}
		public string CensusTract { get;set;}
		public string CensusCountyFips { get;set;}
		public string CensusStateFips { get;set;}
		public string CensusCbsaFips { get;set;}
		public string CensusCbsaMicro { get;set;}
		public string CensusMcdFips { get;set;}
		public string CensusMetDivFips { get;set;}
		public string CensusMsaFips { get;set;}
		public string CensusPlaceFips { get;set;}
		public string ExceptionOccured { get;set;}
		public string Exception { get;set;}
		public string ErrorMessage { get;set;}
	}
	public class OutputGeocode : OutputGeocodeItem
	{
		public OutputGeocode(){}

		public string Latitude { get;set;}
		public string Longitude { get;set;}
		public string NAACCRGISCoordinateQualityCode { get;set;}
		public string NAACCRGISCoordinateQualityType { get;set;}
		public string MatchScore { get;set;}
		public string MatchType { get;set;}
		public string FeatureMatchingResultType { get;set;}
		public string FeatureMatchingResultCount { get;set;}
		public string FeatureMatchingGeographyType { get;set;}
		public string RegionSize { get;set;}
		public string RegionSizeUnits { get;set;}
		public string MatchedLocationType { get;set;}
		public string ExceptionOccured { get;set;}
		public string Exception { get;set;}
		public string ErrorMessage { get;set;}

	}
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
		public  OutputGeocodeItem[] OutputGeocodes { get; set; }



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

