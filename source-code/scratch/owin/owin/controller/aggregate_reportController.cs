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
				string request_string = this.get_couch_db_url() + "/report/_all_docs?include_docs=true";

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
				List<object> row_list = all_docs_dictionary ["rows"] as List<object> ;
				foreach (object row_item in row_list)
				{
					IDictionary<string, object> row_dictionary = row_item as IDictionary<string, object>; 
					KeyValuePair<bool,mmria.server.model.c_report_object> convert_result = convert(row_dictionary["doc"]  as IDictionary<string,object>);
					if(convert_result.Key)
					{
						result.Add(convert_result.Value);
					}
	
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


		private KeyValuePair<bool,mmria.server.model.c_report_object> convert (IDictionary<string, object> p_item)
		{
			
 			mmria.server.model.c_report_object  temp = new mmria.server.model.c_report_object ();
			bool is_complete_conversion = true;

			temp._id = p_item ["_id"].ToString ();
		
			int val = 0;


			try
			{

				if (p_item.ContainsKey("year_of_death") &&  p_item ["year_of_death"] != null && int.TryParse (p_item ["year_of_death"].ToString (), out val)) 
				{
					temp.year_of_death = val;
				}
				if (p_item.ContainsKey("year_of_case_review") &&  p_item ["year_of_case_review"] != null && int.TryParse (p_item ["year_of_case_review"].ToString (), out val))
				{
					temp.year_of_case_review = val; 
				}
				if (p_item.ContainsKey("month_of_case_review") &&  p_item ["month_of_case_review"] != null && int.TryParse (p_item ["month_of_case_review"].ToString (), out val)) 
				{
					temp.month_of_case_review = val; 
				}


				IDictionary<string, object> current_dictionary = p_item ["total_number_of_cases_by_pregnancy_relatedness"] as IDictionary<string, object>;

				temp.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related = int.Parse (current_dictionary ["pregnancy_related"].ToString ());
				temp.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related = int.Parse (current_dictionary ["pregnancy_associated_but_not_related"].ToString ());
				temp.total_number_of_cases_by_pregnancy_relatedness.not_pregnancy_related_or_associated = int.Parse (current_dictionary ["not_pregnancy_related_or_associated"].ToString ());
				temp.total_number_of_cases_by_pregnancy_relatedness.unable_to_determine = int.Parse (current_dictionary ["unable_to_determine"].ToString ());
				temp.total_number_of_cases_by_pregnancy_relatedness.blank = int.Parse (current_dictionary ["blank"].ToString ());

				current_dictionary = p_item ["total_number_of_pregnancy_related_deaths_by_ethnicity"] as IDictionary<string, object>;
			
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.blank = int.Parse (current_dictionary ["blank"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.hispanic = int.Parse (current_dictionary ["hispanic"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.non_hispanic_black = int.Parse (current_dictionary ["non_hispanic_black"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.non_hispanic_white = int.Parse (current_dictionary ["non_hispanic_white"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.american_indian_alaska_native = int.Parse (current_dictionary ["american_indian_alaska_native"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.native_hawaiian = int.Parse (current_dictionary ["native_hawaiian"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.guamanian_or_chamorro = int.Parse (current_dictionary ["guamanian_or_chamorro"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.samoan = int.Parse (current_dictionary ["samoan"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.other_pacific_islander = int.Parse (current_dictionary ["other_pacific_islander"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.asian_indian = int.Parse (current_dictionary ["asian_indian"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.filipino = int.Parse (current_dictionary ["filipino"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.korean = int.Parse (current_dictionary ["korean"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.other_asian = int.Parse (current_dictionary ["other_asian"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.chinese = int.Parse (current_dictionary ["chinese"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.japanese = int.Parse (current_dictionary ["japanese"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.vietnamese = int.Parse (current_dictionary ["vietnamese"].ToString ());
				temp.total_number_of_pregnancy_related_deaths_by_ethnicity.other = int.Parse (current_dictionary ["other"].ToString ());

			}
			catch (Exception ex)
			{
				System.Console.WriteLine(ex);
				is_complete_conversion = false;
			}

			
			return new KeyValuePair<bool,mmria.server.model.c_report_object>(is_complete_conversion, temp);
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

