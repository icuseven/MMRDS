using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace mmria.server
{
	public class aggregate_reportController: ApiController 
	{ 
		public aggregate_reportController()
		{

		}

		public IList<mmria.server.model.c_report_object> Get()
		{

			List<mmria.server.model.c_report_object> result =  new List<mmria.server.model.c_report_object>();

			System.Console.WriteLine ("Recieved message.");

			
			try
			{
				string request_string = this.get_couch_db_url() + "/report/_all_docs";

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


				System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				string all_docs_result = reader.ReadToEnd ();

				System.Dynamic.ExpandoObject expando_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(all_docs_result, new  Newtonsoft.Json.Converters.ExpandoObjectConverter());

				IDictionary<string,object> all_docs_dictionary = expando_result as IDictionary<string,object>;
				IList<object> row_list = all_docs_dictionary ["rows"] as IList<object> ;
				foreach (object row_item in row_list)
				{
	
					mmria.server.model.c_report_object report_object =convert(row_item  as IDictionary<string,object>);
					result.Add(report_object);
	
				}


/*
{
  "total_rows": 3, "offset": 0, "rows": [
    {"id": "doc1", "key": "doc1", "value": {"rev": "4324BB"}},
    {"id": "doc2", "key": "doc2", "value": {"rev":"2441HF"}},
    {"id": "doc3", "key": "doc3", "value": {"rev":"74EC24"}}
  ]
}*/


			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}


			//return result;
			return result;
		} 


		private mmria.server.model.c_report_object convert (IDictionary<string, object> p_item)
		{
			mmria.server.model.c_report_object result;

			result._id = p_item["_id"].ToString();

			IDictionary<string, object> pregnancy_related = p_item["total_number_of_cases_by_pregnancy_relatedness"] as IDictionary<string, object>;

			result.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related = int.Parse(pregnancy_related["pregnancy_related"].ToString());
			result.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related = int.Parse(pregnancy_related["pregnancy_associated_but_not_related"].ToString());
			result.total_number_of_cases_by_pregnancy_relatedness.not_pregnancy_related_or_associated = int.Parse(pregnancy_related["not_pregnancy_related_or_associated"].ToString());
			result.total_number_of_cases_by_pregnancy_relatedness.unable_to_determine = int.Parse(pregnancy_related["unable_to_determine"].ToString());
			result.total_number_of_cases_by_pregnancy_relatedness.blank = int.Parse(pregnancy_related["blank"].ToString());

			return result;
		}

		/*
		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public System.Dynamic.ExpandoObject Get(string value) 
		{ 
			//System.Console.WriteLine ("Recieved message.");
			string result = null;

			//"2016-06-12T13:49:24.759Z"
			string request_string = this.get_couch_db_url() + "/metadata/" + value;

			System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

			request.PreAuthenticate = false;


			if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
			{
				string[] auth_session_token = this.Request.Headers.GetValues("Cookie").First().Split('=');
				request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
				//request.Headers.Add(this.Request.Headers.GetValues("Cookie").First(), "");
				request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);

			}


			System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
			System.IO.Stream dataStream = response.GetResponseStream ();
			System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
			result = reader.ReadToEnd ();

			System.Dynamic.ExpandoObject json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(result, new  Newtonsoft.Json.Converters.ExpandoObjectConverter());

			return json_result;
		} */


		// POST api/values 
		//[Route("api/metadata")]
		[HttpPost]
		public mmria.common.model.couchdb.document_put_response Post() 
		{ 
			//bool valid_login = false;
			mmria.common.metadata.app metadata = null;
			string object_string = null;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{

				System.IO.Stream dataStream0 = this.Request.Content.ReadAsStreamAsync().Result;
				// Open the stream using a StreamReader for easy access.
				//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
				System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
				// Read the content.
				string temp = reader0.ReadToEnd ();

				metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.app>(temp);
				//System.Dynamic.ExpandoObject json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(result, new  Newtonsoft.Json.Converters.ExpandoObjectConverter());



				//string metadata = DecodeUrlString(temp);
			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);
			}
				try
				{
					Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
					settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
					object_string = Newtonsoft.Json.JsonConvert.SerializeObject(metadata, settings);

					string metadata_url = this.get_couch_db_url() + "/metadata/"  + metadata._id;

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
							string[] auth_session_token = cookie_set[i].Split('=');
							if(auth_session_token[0].Trim() == "AuthSession")
							{
								request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
								request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
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


							System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
							System.IO.Stream dataStream = response.GetResponseStream ();
							System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
							string responseFromServer = reader.ReadToEnd ();

							result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);

							if(response.Headers["Set-Cookie"] != null)
							{
								string[] set_cookie = response.Headers["Set-Cookie"].Split(';');
								string[] auth_array = set_cookie[0].Split('=');
								if(auth_array.Length > 1)
								{
									string auth_session_token = auth_array[1];
									result.auth_session = auth_session_token;
								}
								else
								{
									result.auth_session = "";
								}
							}



						System.Threading.Tasks.Task.Run( new Action(()=> { var f = new GenerateSwaggerFile(); System.IO.File.WriteAllText(Program.config_file_root_folder + "/api-docs/api.json", f.generate(metadata)); }));
							
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

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_environment_based"])) 
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

