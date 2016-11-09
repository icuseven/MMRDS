using System;
using System.Web.Http;

public class importAPIController : ApiController
{
	//
	// GET: /Default1/
	public System.Dynamic.ExpandoObject Get()
	{
		return Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (@"{
  ""swaggerVersion"": ""1.2"",
  ""basePath"": ""http://localhost:8000/greetings"",
  ""apis"": [
    {
      ""path"": ""/hello/{subject}"",
      ""operations"": [
        {
          ""method"": ""GET"",
          ""summary"": ""Greet our subject with hello!"",
          ""type"": ""string"",
          ""nickname"": ""helloSubject"",
          ""parameters"": [
            {
              ""name"": ""subject"",
              ""description"": ""The subject to be greeted."",
              ""required"": true,
              ""type"": ""string"",
              ""paramType"": ""path""
            }
          ]
        }
      ]
    }
  ],
  ""models"": {}
}");
	}
	
		//
		// GET: /Default1/
		public System.Dynamic.ExpandoObject Put()
		{
			string file_text = System.IO.File.OpenText ("api.json").ReadToEnd();
			return Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(file_text);
		}


}