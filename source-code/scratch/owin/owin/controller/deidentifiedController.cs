using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Dynamic;
using mmria.common.model;

namespace mmria.server
{
	public class deidentifiedController: ApiController 
	{ 
		// GET api/values 
		//public IEnumerable<master_record> Get() 
        public async System.Threading.Tasks.Task<System.Dynamic.ExpandoObject> Get() 
		{ 
			try
			{
				string request_string = Program.config_couchdb_url + "/mmrds/_all_docs?include_docs=true";
				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

				request.PreAuthenticate = false;


				if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
				{
					string[] cookie_set = this.Request.Headers.GetValues("Cookie").First().Split(';');
					for(int i = 0; i < cookie_set.Length; i++)
					{
						string[] auth_session_token = cookie_set[i].Split('=');
						if(auth_session_token[0].Trim() == "AuthSession")
						{
							request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
							request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
							break;
						}
					}
				}

				System.Net.WebResponse response = await request.GetResponseAsync();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				string responseFromServer = reader.ReadToEnd ();

				var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(responseFromServer);

				return result;

				/*
		< HTTP/1.1 200 OK
		< Set-Cookie: AuthSession=YW5uYTo0QUIzOTdFQjrC4ipN-D-53hw1sJepVzcVxnriEw;
		< Version=1; Path=/; HttpOnly
		> ...
		<
		{"ok":true}*/



			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return null;
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
		[Route]
        public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post() 
		{ 
			//bool valid_login = false;
			//mmria.common.data.api.Set_Queue_Request queue_request = null;
			System.Dynamic.ExpandoObject  queue_request = null;
			string auth_session_token = null;

			string object_string = null;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{

				System.IO.Stream dataStream0 = await this.Request.Content.ReadAsStreamAsync();
				// Open the stream using a StreamReader for easy access.
				//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
				System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
				// Read the content.
				string temp = reader0.ReadToEnd ();

				queue_request = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(temp);

				//mmria.server.util.LuceneSearchIndexer.RunIndex(new List<mmria.common.model.home_record> { mmria.common.model.home_record.convert(queue_request)});
				//System.Dynamic.ExpandoObject json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(result, new  Newtonsoft.Json.Converters.ExpandoObjectConverter());



				//string metadata = DecodeUrlString(temp);
			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);
			}

			//if(queue_request.case_list.Length == 1)
			try
			{
				//dynamic case_item = queue_request.case_list[0];

				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				object_string = Newtonsoft.Json.JsonConvert.SerializeObject(queue_request, settings);

				var byName = (IDictionary<string,object>)queue_request;
				var temp_id = byName["_id"]; 
				string id_val = null;

				if(temp_id is DateTime)
				{
					id_val = string.Concat(((DateTime)temp_id).ToString("s"), "Z");
				}
				else
				{
					id_val = temp_id.ToString();
				}


				string metadata_url = Program.config_couchdb_url + "/mmrds/"  + id_val;

				System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(metadata_url));
				request.Method = "PUT";
				request.ContentType = "application/json";
				request.ContentLength = object_string.Length;
				request.PreAuthenticate = false;

				if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
				{
					string[] cookie_set = this.Request.Headers.GetValues("Cookie").First().Split(';');
					for(int i = 0; i < cookie_set.Length; i++)
					{
						string[] auth_session_token_item = cookie_set[i].Split('=');
						if(auth_session_token_item[0].Trim() == "AuthSession")
						{
							auth_session_token = auth_session_token_item[1];
							request.Headers.Add("Cookie", "AuthSession=" + auth_session_token);
							request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token);
							break;
						}
					}
				}

				using (System.IO.StreamWriter streamWriter = new System.IO.StreamWriter(request.GetRequestStream()))
				{
					try
					{
						streamWriter.Write(object_string);
						streamWriter.Flush();
						streamWriter.Close();


						System.Net.WebResponse response = await request.GetResponseAsync();
						System.IO.Stream dataStream = response.GetResponseStream ();
						System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
						string responseFromServer = reader.ReadToEnd ();

						result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);

					}
					catch(Exception ex)
					{
						Console.Write("auth_session_token: {0}", auth_session_token);
						Console.WriteLine (ex);
					}
				}

				if (!result.ok) 
				{

				}

			}
			catch(Exception ex) 
			{
				Console.Write("auth_session_token: {0}", auth_session_token);
				Console.WriteLine (ex);
			}

			return result;

		} 
	} 
}

