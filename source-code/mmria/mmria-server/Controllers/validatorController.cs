using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using mmria.common.model;

namespace mmria.server
{
	[Route("api/[controller]")]
	public class validatorController: ControllerBase
	{ 
		// GET api/values 
		//public IEnumerable<master_record> Get() 
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

		private void PutDocument(string postUrl, string document)
		{
			byte[] data = new System.Text.ASCIIEncoding().GetBytes(document);

			System.Net.WebRequest request = System.Net.WebRequest.Create("request_string");
			request.UseDefaultCredentials = true;
			request.Credentials = new System.Net.NetworkCredential("_username", "_password");
			request.Method = "PUT";
			request.ContentType = "text/json";
			request.ContentLength = data.Length;

			using (System.IO.StreamWriter streamWriter = new System.IO.StreamWriter(request.GetRequestStream()))
			{
				try
				{
					streamWriter.Write(document);
					streamWriter.Flush();
					streamWriter.Close();

					System.Net.HttpWebResponse httpResponse = (System.Net.HttpWebResponse)request.GetResponse();
					using (System.IO.StreamReader streamReader = new System.IO.StreamReader(httpResponse.GetResponseStream()))
					{
						string result = streamReader.ReadToEnd();
						streamReader.Close();
					}
				}
				catch (System.Exception e)
				{
					//_logger.Error("Exception thrown when contacting service.", e);
					//_logger.ErrorFormat("Error posting document to {0}", postUrl);
				}
			}
		}



		// POST api/values 
		[HttpPost]
		[HttpPut]
		public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post() 
		{ 
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			//if(!string.IsNullOrWhiteSpace(json))
			try
			{

				System.IO.Stream dataStream0 = this.Request.Body;
				// Open the stream using a StreamReader for easy access.
				//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
				System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
				// Read the content.
				string validator_js_text = await reader0.ReadToEndAsync ();

				string file_root_folder = null;

				file_root_folder = Program.config_file_root_folder;

				//System.IO.File.WriteAllText(file_root_folder + "/scripts/validator.js", validator_js_text);

				string metadata_url = Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z/validator.js";

				System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(metadata_url));
				request.Method = "PUT";
				request.ContentType = "text/*";
				request.ContentLength = validator_js_text.Length;
				request.PreAuthenticate = false;

				if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
				{
					string auth_session_value = this.Request.Cookies["AuthSession"];
					request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
					request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
					request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
				}

				if (!string.IsNullOrWhiteSpace(this.Request.Headers["If-Match"]))
				{
					string If_Match = this.Request.Headers["If-Match"];
					request.Headers.Add("If-Match",  If_Match);
				}

				using (System.IO.StreamWriter streamWriter = new System.IO.StreamWriter(request.GetRequestStream()))
				{
					try
					{
						streamWriter.Write(validator_js_text);
						streamWriter.Flush();
						streamWriter.Close();

						System.Net.WebResponse response = (System.Net.HttpWebResponse) await request.GetResponseAsync();
						System.IO.Stream dataStream = response.GetResponseStream ();
						System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
						string responseFromServer = await reader.ReadToEndAsync ();

						result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);

						if(response.Headers["Set-Cookie"] != null)
						{
							this.Response.Headers.Add("Set-Cookie", response.Headers["Set-Cookie"]);
						}

					//System.Threading.Tasks.Task.Run( new Action(()=> { var f = new GenerateSwaggerFile(); System.IO.File.WriteAllText(Program.config_file_root_folder + "/api-docs/api.json", f.generate(metadata)); }));
						
					}
					catch(Exception ex)
					{
						Console.WriteLine (ex);
					}
				}

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

