using System;
using System.Web.Http;

public class importAPIController : ApiController
{
	//
	// GET: /Default1/
	public System.Dynamic.ExpandoObject Get()
	{
		return Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>("{\r\n  \"swaggerVersion\": \"1.2\",\r\n  \"basePath\": \"http://localhost:8000/greetings\",\r\n  \"apis\": [\r\n    {\r\n      \"path\": \"/hello/{subject}\",\r\n      \"operations\": [\r\n        {\r\n          \"method\": \"GET\",\r\n          \"summary\": \"Greet our subject with hello!\",\r\n          \"type\": \"string\",\r\n          \"nickname\": \"helloSubject\",\r\n          \"parameters\": [\r\n            {\r\n              \"name\": \"subject\",\r\n              \"description\": \"The subject to be greeted.\",\r\n              \"required\": true,\r\n              \"type\": \"string\",\r\n              \"paramType\": \"path\"\r\n            }\r\n          ]\r\n        }\r\n      ]\r\n    }\r\n  ],\r\n  \"models\": {}\r\n}");
	}
}