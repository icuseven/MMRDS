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
    ""title"": ""MyClient"",
    ""version"": ""1.0.0""
  },
  ""host"": ""swaggersample.azurewebsites.net"",
  ""paths"": {
    ""/api/HelloWorld"": {
      ""get"": {
        ""operationId"": ""GetGreeting"",
        ""produces"": [
          ""application/json""
        ],
        ""responses"": {
          ""200"": {
            ""description"": ""GETs a greeting."",
            ""schema"": {
              ""type"": ""string""
            }
          }
        }
      }
    }
  }
}";
	}
}

