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


// POST api/values 
		[Authorize(Roles  = "form_designer")]
		[HttpPost]
		[HttpPut]
		public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> SetValue
		(
			[FromBody] string id, string name, string value
		) 
		{ 
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			//if(!string.IsNullOrWhiteSpace(json))
			try
			{
				string id_val = id;

/*
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
 */
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

		[Authorize(Roles  = "form_designer")]
		[Route("add_attachement")]
		[HttpPost]
		public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Add_Attachment
        (
			
            //[FromBody] mmria.common.metadata.Add_Attachement add_attachement
        ) 
		{ 



			string document_content;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

				try
				{


					mmria.common.metadata.Add_Attachement add_attachement = null;

					System.IO.Stream dataStream0 = this.Request.Body;

					//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
					System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);

					document_content = await reader0.ReadToEndAsync ();


					add_attachement = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.Add_Attachement>(document_content);

					if
					(
						//p_version_specification.data_type == null ||
						//p_version_specification.data_type != "version-specification" || 
						add_attachement._id =="default_ui_specification" ||
						add_attachement._id == "2016-06-12T13:49:24.759Z" ||
						add_attachement._id == "de-identified-list"

					)
					{
						return null;
					}


					

                    string metadata_url = Program.config_couchdb_url + $"/metadata/{add_attachement._id}/{add_attachement.doc_name}";

					var put_curl = new cURL("PUT", null, metadata_url, add_attachement.document_content, Program.config_timer_user_name, Program.config_timer_value, "text/*");
					put_curl.AddHeader("If-Match",  add_attachement._rev);

					string responseFromServer = await put_curl.executeAsync();

					result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);

					if (!result.ok) 
					{

					}

				}
				catch(Exception ex) 
				{
					Console.WriteLine (ex);
				}
				
			return result;
		} 

 
	} 
}

