using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Dynamic;

namespace owin
{
	public class caseController: ApiController 
	{ 
		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public IEnumerable< owin.model.home_record> Get() 
		{ 
			return new  owin.model.home_record[] 
			{ 
				new  owin.model.home_record(){ 
					id =  "e5c511cc-40ec-4730-9656-95f53582a51b",
					record_id = "VA-2011-1703",
					first_name = "Caterina",
					middle_name = "",
					last_name = "Schroeder",
					date_of_death = "3/8/2011",
					state_of_death = "VA",
					agency_case_id = "",
					is_valid_maternal_mortality_record = true
				},
				new  owin.model.home_record(){ 
					id =  "42ad2325-0713-4fd0-a49e-5b03ee38e0e3",
					record_id = "TN-2011-2722",
					first_name = "Bibiana",
					middle_name = "",
					last_name = "Hendriks",
					date_of_death = "12/9/2011",
					state_of_death = "TN",
					agency_case_id = "",
					is_valid_maternal_mortality_record = false
				},
				new  owin.model.home_record(){ 
					id =  "1954deef-e6bb-4ae1-af88-15abffbba7db",
					record_id = "RI-2012-9090",
					first_name = "Helen",
					middle_name = "",
					last_name = "Hendricks",
					date_of_death = "RI",
					state_of_death = "RI",
					agency_case_id = "",
					is_valid_maternal_mortality_record = true
				},
				}; 
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
		public owin.couchdb.document_put_response Post() 
		{ 
			//bool valid_login = false;
			//owin.data.api.Set_Queue_Request queue_request = null;
			System.Dynamic.ExpandoObject  queue_request = null;
			string object_string = null;
			owin.couchdb.document_put_response result = new owin.couchdb.document_put_response ();

			try
			{

				System.IO.Stream dataStream0 = this.Request.Content.ReadAsStreamAsync().Result;
				// Open the stream using a StreamReader for easy access.
				//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
				System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
				// Read the content.
				string temp = reader0.ReadToEnd ();

				queue_request = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(temp);
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


				string metadata_url = this.get_couch_db_url() + "/mmrds/"  + id_val;

				System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(metadata_url));
				request.Method = "PUT";
				request.ContentType = "application/json";
				request.ContentLength = object_string.Length;
				request.PreAuthenticate = false;

				if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
				{
					string[] auth_session_token = this.Request.Headers.GetValues("Cookie").First().Split('=');
					request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
					//request.Headers.Add(this.Request.Headers.GetValues("Cookie").First(), "");
					request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
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

						result = Newtonsoft.Json.JsonConvert.DeserializeObject<owin.couchdb.document_put_response>(responseFromServer);

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

		private string get_couch_db_url()
		{
			string result = null;

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_container_based"])) 
			{
				result = System.Environment.GetEnvironmentVariable ("couchdb_url");
			} 
			else
			{
				result = System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"];
			}

			return result;
		}

	} 
}

