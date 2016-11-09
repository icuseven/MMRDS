using System;

namespace owin
{
	public class GenerateSwaggerFile
	{
		public GenerateSwaggerFile ()
		{
		}

		//http://json-schema.org/
		//http://swagger.io/specification/

		public string generate(owin.metadata.app app)
		{
			System.Text.StringBuilder result = new System.Text.StringBuilder ();

			result.Append (sample);


			return result.ToString();
		}

		private static string sample = @"{
  ""swagger"": ""2.0"",
  ""info"": {
    ""version"": ""0.0.3"",
    ""title"": ""MMRIA data import API"",
    ""description"": ""An API for use in electronic importing of case data using OpenAPISpecification -swagger-2.0"",
    ""termsOfService"": ""http://swagger.io/terms/"",
    ""contact"": {
      ""name"": ""jhaines@cdc.gov""
    },
    ""license"": {
      ""name"": ""GPLv3""
    }
  },
  ""host"": ""test.mmria.org"",
  ""basePath"": ""/api"",
  ""schemes"": [
    ""http""
  ],
  ""consumes"": [
    ""application/json""
  ],
  ""produces"": [
    ""application/json""
  ],
""paths"": {
    ""/queue"": {
      ""get"": {
        ""operationId"": ""setQueueRequest"",
        ""description"": ""Adds new and existing case records into processing queue."",
        ""produces"": [
          ""application/json""
        ],
		""parameters"": [ 
		{
            ""name"": ""set_queue_request"",
            ""in"": ""body"",
            ""description"": ""How many items to return at one time (max 100)"",
            ""required"": true,
            ""schema"": { ""$ref"": ""#/definitions/set_queue_request""   }
    }
		],
        ""responses"": {
          ""200"": {
            ""description"": ""Sets a data import queue."",
            ""schema"": {""$ref"": ""#/definitions/set_queue_response"" }
          }
        }
      }
    }
  },
  ""definitions"": {
    ""set_queue_request"": {
              ""title"": ""Example Schema"",
              ""type"": ""object"",
              ""properties"": {
                ""security_token"": {
                  ""type"": ""string""
                },
                ""action"": {
                  ""type"": ""string""
                },
                ""case_list"": {
                  ""description"": ""Array of cases to be processed"",
                  ""type"": ""array"",
                  ""items"": {
                        ""$ref"": ""#/definitions/case_item""
                  }
                },
              ""attribute1"":{
              ""title"": ""attribute 1"",
              ""type"": ""object"",
              ""properties"": {
                ""street"": {
                  ""type"": ""string""
                },
                ""city"": {
                  ""type"": ""string""
                },
                ""order"": {
                  ""description"": ""Age in years"",
                  ""type"": ""integer"",
                  ""minimum"": 0
                }
              },
              ""required"": [""street"", ""city""]
              }
            }              ,
              ""required"": [""secutiry_token"", ""case_list""]
            },
        ""set_queue_response"":{
              ""title"": ""Example Schema"",
              ""type"": ""object"",
              ""properties"": {
                ""ok"": {
                  ""description"": ""Error indication if request is accepted."",
                  ""type"": ""boolean""
                },
                ""message"": {
                  ""description"": ""Message from server."",
                  ""type"": ""string""
                },
                ""queue_id"": {
                  ""description"": ""queue item id."",
                  ""type"": ""string""
                  
                }
             }
        },
        ""case_item"":{
              ""title"": ""case_item schema"",
              ""type"": ""object"",
              ""properties"": {
                ""_id"": {
                  ""description"": ""id"",
                  ""type"": ""boolean""
                },
                ""_rev"": {
                  ""description"": ""revision"",
                  ""type"": ""string""
                },
                ""text_item"": {
                  ""description"": ""text item."",
                  ""type"": ""string""
                  
                }
             }
        }
  }
}";
	}
}

