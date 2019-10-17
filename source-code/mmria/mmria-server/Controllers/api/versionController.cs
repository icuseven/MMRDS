using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using mmria.common.model;
using System.Net.Http;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server
{
	[Route("api/[controller]")]
	public class versionController: ControllerBase
	{ 
		// GET api/values 
		//public IEnumerable<master_record> Get() 
		[AllowAnonymous] 
		[HttpGet]
		public async Task<string> Get()
		{
			string result = null;

			try
			{
				//"2016-06-12T13:49:24.759Z"
                string request_string = Program.config_couchdb_url + $"/metadata/2016-06-12T13:49:24.759Z/validator.js";

				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
				request.Method = "GET";
				request.PreAuthenticate = false;

				System.Net.WebResponse response = (System.Net.HttpWebResponse) await request.GetResponseAsync();
				System.IO.Stream dataStream = response.GetResponseStream();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				result = await reader.ReadToEndAsync ();

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}

			return result;
		} 


		[AllowAnonymous] 
		[HttpGet]
		[Route("{p_Version_Specification_Id}")]
		public async Task<mmria.common.metadata.Version_Specification> Get_Version_Specification(string p_Version_Specification_Id, string path = "")
		{
			mmria.common.metadata.Version_Specification result = null;

			try
			{
				/*//"2016-06-12T13:49:24.759Z"
                string request_string = Program.config_couchdb_url + $"/metadata/2016-06-12T13:49:24.759Z/validator.js";

				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
				request.Method = "GET";
				request.PreAuthenticate = false;

				System.Net.WebResponse response = (System.Net.HttpWebResponse) await request.GetResponseAsync();
				System.IO.Stream dataStream = response.GetResponseStream();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				result = await reader.ReadToEndAsync ();
				*/

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}

			return result;
		} 

		// POST api/values 
		[Authorize(Roles  = "form_designer")]
		[HttpPost]
		[HttpPut]
		public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post
		(
			[FromBody] mmria.common.metadata.Version_Specification p_Version_Specification
		) 
		{ 
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			//if(!string.IsNullOrWhiteSpace(json))
			try
			{
				string id_val = p_Version_Specification._id;


				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				var object_string = Newtonsoft.Json.JsonConvert.SerializeObject(p_Version_Specification, settings);


				
				string metadata_url = Program.config_couchdb_url + "/metadata/"  + id_val;
				cURL document_curl = new cURL ("PUT", null, metadata_url, object_string, Program.config_timer_user_name, Program.config_timer_value);

                try
                {
                    string responseFromServer = await document_curl.executeAsync();
                    result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
                }
                catch(Exception ex)
                {
                    Console.WriteLine(ex);
                }

			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);
			}
/*
			this.Response.Clear();
			this.Response.ClearHeaders();
			this.Response.AddHeader("Content-Type", "text/plain");
 */
			return result;
		}

		async Task<string> GenerateFileAsync(string schemaJson)
		{
				string result = null;

				var schema = await NJsonSchema.JsonSchema.FromJsonAsync(schemaJson);
				var settings = new NJsonSchema.CodeGeneration.CSharp.CSharpGeneratorSettings()
				{
					Namespace = "AwesomeSauce.v1",
					//ClassStyle = NJsonSchema.CodeGeneration.CSharp.CSharpClassStyle.Inpc 
					ClassStyle = NJsonSchema.CodeGeneration.CSharp.CSharpClassStyle.Poco,
					GenerateJsonMethods = true,
					GenerateDataAnnotations = true
				};

				var generator = new NJsonSchema.CodeGeneration.CSharp.CSharpGenerator(schema, settings);
				result = generator.GenerateFile();

//NJsonSchema.CodeGeneration.CSharp.CSharpClassStyle.
				return result;
		}
 
	} 
}

