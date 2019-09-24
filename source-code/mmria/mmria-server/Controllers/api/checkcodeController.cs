using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server
{
	[Route("api/[controller]")]
    public class checkcodeController: ControllerBase 
	{ 
		public checkcodeController()
		{
		}

		[AllowAnonymous] 
		[HttpGet]
		public async System.Threading.Tasks.Task<string> Get()
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

				/*
                if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                {
                    string auth_session_value = this.Request.Cookies["AuthSession"];
                    request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
                    request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
                }
				*/

				System.Net.WebResponse response = (System.Net.HttpWebResponse) await request.GetResponseAsync();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				result = await reader.ReadToEndAsync ();

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}

			return result;
		}


		// POST api/values 
		//[Route("api/metadata")]
		[HttpPost]
		public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Put
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

					var put_curl = new cURL("PUT", null, metadata_url, check_code_json, Program.config_timer_user_name, Program.config_timer_value, "text/*");
                    if (!string.IsNullOrWhiteSpace(this.Request.Headers["If-Match"]))
                    {

						System.Text.RegularExpressions.Regex rgx = new System.Text.RegularExpressions.Regex("[^a-zA-Z0-9 -]");
						string If_Match = rgx.Replace(this.Request.Headers["If-Match"], "");
                         
                        put_curl.AddHeader("If-Match",  If_Match);
                    }

					string responseFromServer = await put_curl.executeAsync();

					result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);


/*
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
 */
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

