using System;
using System.Collections.Generic;
using Microsoft.CSharp;
using System.Web.Http;
using mmria.common.model;

namespace mmria.server
{

	//http://www.opengeocode.org/tutorials/USCensusAPI.php
	/*
	 * 
	 * http://api.census.gov/data/2014/acs5?get=NAME,B27010_001E&for=state:*  //&key=
B27010 Census tract Types of health insurance coverage by age   http://api.census.gov/data/2014/acs5/variables/B27010_001E.json
B15001 Census tract Sex by age by educational attainment for the population 18+	http://api.census.gov/data/2014/acs5/variables/B15001_001E.json
B17020 Census tract Poverty status in the past 12 months by age http://api.census.gov/data/2014/acs5/variables/B17020_001E.json


		http://api.census.gov/data/2014/acs5?get=B27010_001E,B15001_001E,B17020_001E&for=county:037&for=tract:2247&in=state:06&key=

		http://api.census.gov/data/2014/acs5?get=B27010_001E,B15001_001E,B17020_001E&for=tract:*&in=state:06&for=county:037&key=9e913413329e2a898493794349c1a962f6826860
		http://api.census.gov/data/2014/acs5?get=B27010_001E,B15001_001E,B17020_001E&for=tract:224700&in=state:06+county:037&key=9e913413329e2a898493794349c1a962f6826860
		*/

	public class censusController: ApiController 
	{
		private string census_api_key = null;

		public censusController ()
		{

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"])) 
			{
				census_api_key = System.Environment.GetEnvironmentVariable ("census_api_key");
			} 
			else
			{
				census_api_key = System.Configuration.ConfigurationManager.AppSettings["census_api_key"];
			}

		}
		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public IEnumerable<mmria.common.model.census.Census_Variable> Get
		(
			string state,
			string county,
			string tract
		)
		{

			string request_string = string.Format("http://api.census.gov/data/2014/acs5?get=B27010_001E,B15001_001E,B17020_001E&in=state:{0}+county:{1}&for=tract:{2}&key={3}", state, county, tract, census_api_key);
			//System.Net.ServicePointManager.Expect100Continue = true;
			//System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Ssl3;
			System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
			request.ContentType = "application/json; charset=utf-8";
			System.Net.WebResponse response = request.GetResponse();

			System.IO.Stream dataStream = response.GetResponseStream();
			// Open the stream using a StreamReader for easy access.
			System.IO.StreamReader reader = new System.IO.StreamReader(dataStream);
			// Read the content.
			string responseFromServer = reader.ReadToEnd();
			List<List<string>> json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<List<List<string>>>(responseFromServer);

			mmria.common.model.census.Census_Variable[] result = null;

			if (json_result.Count > 1)
			{
				result = new mmria.common.model.census.Census_Variable[json_result.Count -1];

				for (var i = 1; i < json_result.Count; i++)
				{
					mmria.common.model.census.Census_Variable item = new mmria.common.model.census.Census_Variable();
					item.B27010_001E = json_result[i][0];
					item.B15001_001E = json_result[i][1];
					item.B17020_001E = json_result[i][2];
					item.state = json_result[i][3];
					item.county = json_result[i][4];
					item.tract = json_result[i][5];

					result[i - 1] = item;
				}
			}


			/*
			[["B27010_001E","B15001_001E","B17020_001E","state","county","tract"],
	["6254","6143","2655","06","037","224700"]]*/


			return result;
		
		} 

		private string get_census_api_key()
		{
			string result = null;

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"])) 
			{
				result = System.Environment.GetEnvironmentVariable ("census_api_key");
			} 
			else
			{
				result = System.Configuration.ConfigurationManager.AppSettings ["census_api_key"];
			}

			return result;
		}


	}
}

