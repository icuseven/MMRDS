using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace mmria.server
{
	[Route("api/[controller]")]
    public class metadataController: ControllerBase 
	{ 
		public metadataController()
		{
		}
		
		[HttpGet]
		public System.Dynamic.ExpandoObject Get()
		{
			System.Console.WriteLine ("Recieved message.");
			string result = null;
			System.Dynamic.ExpandoObject json_result = null;
			try
			{

				//"2016-06-12T13:49:24.759Z"
                string request_string = Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z";

				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

				request.PreAuthenticate = false;


                if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                {
                    string auth_session_value = this.Request.Cookies["AuthSession"];
                    request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
                    request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
                }



				System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				result = reader.ReadToEnd ();

				json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(result, new  Newtonsoft.Json.Converters.ExpandoObjectConverter());

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}


			//return result;
			return json_result;
		}

		// POST api/values 
		//[Route("api/metadata")]
		[HttpPost]
		public mmria.common.model.couchdb.document_put_response Post
        (
            [FromBody] mmria.common.metadata.app metadata
        ) 
		{ 
			string object_string = null;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

				try
				{
					Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
					settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
					object_string = Newtonsoft.Json.JsonConvert.SerializeObject(metadata, settings);

                    string metadata_url = Program.config_couchdb_url + "/metadata/"  + metadata._id;

					System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(metadata_url));
					request.Method = "PUT";
					request.ContentType = "application/json";
					request.ContentLength = object_string.Length;
					request.PreAuthenticate = false;

                    if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                    {
                        string auth_session_value = this.Request.Cookies["AuthSession"];
                        request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
                        request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
                    }


					using (System.IO.StreamWriter streamWriter = new System.IO.StreamWriter(request.GetRequestStream()))
					{
						try
						{
							streamWriter.Write(object_string);
							streamWriter.Flush();
							streamWriter.Close();


							System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
							System.IO.Stream dataStream = response.GetResponseStream ();
							System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
							string responseFromServer = reader.ReadToEnd ();

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



		[HttpGet("GetCheckCode")]
		public string GetCheckCode()
		{
			System.Console.WriteLine ("Recieved message.");
			string result = null;

			try
			{
				//"2016-06-12T13:49:24.759Z"
                string request_string = Program.config_couchdb_url + $"/metadata/2016-06-12T13:49:24.759Z/mmria-check-code.js";

				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
					request.Method = "GET";
					request.PreAuthenticate = false;

                if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                {
                    string auth_session_value = this.Request.Cookies["AuthSession"];
                    request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
                    request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
                }

				System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				result = reader.ReadToEnd ();

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}

			return result;
		}


		// POST api/values 
		//[Route("api/metadata")]
		[HttpPost("PutCheckCode")]
		public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> PutCheckCode
        (
            
        ) 
		{ 
			string check_code_json;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

				try
				{

					System.IO.Stream dataStream0 = this.Request.Body;
					// Open the stream using a StreamReader for easy access.
					//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
					System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
					// Read the content.
					check_code_json = await reader0.ReadToEndAsync ();




                    string metadata_url = Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z/mmria-check-code.js";

					System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(metadata_url));
					request.Method = "PUT";
					request.ContentType = "text/*";
					request.ContentLength = check_code_json.Length;
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
							streamWriter.Write(check_code_json);
							streamWriter.Flush();
							streamWriter.Close();


							System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
							System.IO.Stream dataStream = response.GetResponseStream ();
							System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
							string responseFromServer = reader.ReadToEnd ();

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

