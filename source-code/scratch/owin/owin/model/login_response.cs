using System;

namespace owin
{
	public class session_response
	{
		public session_response ()
		{
		}

		public bool ok { get; set; }
		public string userCtx { get; set; }
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

		//{"ok":true,"userCtx":{"name":null,"roles":[]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"]}}
		/*
		 {
		 	"ok":true,
		 	"userCtx":
		 	{
		 		"name":"mmrds",
		 		"roles":["_admin"]
		 	},
		 	"info":
		 	{
		 		"authentication_db":"_users",
		 		"authentication_handlers":
		 		[
		 			"oauth",
		 			"cookie",
		 			"default"
		 		],
		 		"authenticated":"cookie"
		 	}
		 }

		*/


	}
}

