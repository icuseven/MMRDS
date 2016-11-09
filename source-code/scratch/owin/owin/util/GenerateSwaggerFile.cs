using System;

namespace owin
{
	public class GenerateSwaggerFile
	{
		public GenerateSwaggerFile ()
		{
		}


		public string generate(owin.metadata.app app)
		{
			System.Text.StringBuilder result = new System.Text.StringBuilder ();

			result.Append (sample);


			return result.ToString();
		}

		private static string sample = @"{
  ""swagger"": ""2.0"",
  ""info"": {
    ""title"": ""MMRIA Data Import"",
    ""version"": ""1.0.0""
  },
  ""host"": ""test.mmria.org"",
  ""paths"": {
    ""/api/queue"": {
      ""get"": {
        ""operationId"": ""setqueue"",
        ""produces"": [
          ""application/json""
        ],
		""parameters"": [ 
		{
            ""name"": ""set_queue_request"",
            ""in"": ""path"",
            ""description"": ""How many items to return at one time (max 100)"",
            ""required"": true,
            ""schema"": {
  							""security_token"": """",
  							""action"": """",
 							""case_list"": [
								{}
							  ]
						}

          }
		],
        ""responses"": {
          ""200"": {
            ""description"": ""Sets a data import queue."",
            ""schema"": {
              ""ok"": ""boolean"",
				""message"": ""string"",
				""queue_id"": ""string""
            }
          }
        }
      }
    }
  }
}";
	}
}

