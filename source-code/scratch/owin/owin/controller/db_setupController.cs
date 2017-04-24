using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace mmria.server
{
	public class db_setupController: ApiController 
	{ 

		/*

curl -X PUT http://uid:pwd@target_db_url/_users
curl -X PUT http://uid:pwd@target_db_url/_replicator
curl -X PUT http://uid:pwd@target_db_url/_global_changes
curl -X PUT http://uid:pwd@target_db_url/metadata
curl -X PUT http://uid:pwd@target_db_url/mmrds
curl -X PUT http://uid:pwd@target_db_url/de_id
curl -X PUT http://uid:pwd@target_db_url/report
curl -X PUT http://uid:pwd@target_db_url/config

curl -vX POST http://uid:pwd@target_db_url/_replicate \
     -d '{"source":"http://uid:pwd@source_db_url/_users","target":"http://uid:pwd@target_db_url/_users"}' \
     -H "Content-Type:application/json"
 
	 
curl -vX POST http://uid:pwd@target_db_url/_replicate \
     -d '{"source":"http://muid:pwd@source_db_url/metadata","target":"http://uid:pwd@target_db_url/metadata"}' \
     -H "Content-Type:application/json"
	 
curl -vX POST http://uid:pwd@target_db_url/_replicate \
     -d '{"source":"http://uid:pwd@source_db_url","target":"http://uid:pwd@target_db_url/mmrds"}' \
     -H "Content-Type:application/json"
	 



		 */


		public db_setupController()
		{

		}

		public IDictionary<string, string> Get
		(
			string p_target_db_user_name, 
			string p_target_db_password,
			string p_target_db,
			string p_source_db_user_name, 
			string p_source_db_password,
			string p_source_db
		)
		{

			Dictionary<string,string> result = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase);
			//var curl = new cURL ("GET", null, p_source_db + "/mmrds/_all_docs?include_docs=true", null, p_user_name, p_password);

			try
			{

				var users_curl = new cURL ("PUT", null, p_target_db + "/_users", null, p_target_db_user_name, p_target_db_password);
				result.Add("users_curl",users_curl.execute());
				var replicator_curl = new cURL ("PUT", null, p_target_db + "/_replicator", null, p_target_db_user_name, p_target_db_password);
				result.Add("replicator_curl",replicator_curl.execute());
				var global_changes_curl = new cURL ("PUT", null, p_target_db + "/_global_changes", null, p_target_db_user_name, p_target_db_password);
				result.Add("global_changes_curl",global_changes_curl.execute());
				var metadata_curl = new cURL ("PUT", null, p_target_db + "/metadata", null, p_target_db_user_name, p_target_db_password);
				result.Add("metadata_curl",metadata_curl.execute());
				var mmrds_curl = new cURL ("PUT", null, p_target_db + "/mmrds", null, p_target_db_user_name, p_target_db_password);
				result.Add("mmrds_curl",mmrds_curl.execute());
				var de_id_curl = new cURL ("PUT", null, p_target_db + "/de_id", null, p_target_db_user_name, p_target_db_password);
				result.Add("de_id_curl",de_id_curl.execute());
				var report_curl = new cURL ("PUT", null, p_target_db + "/report", null, p_target_db_user_name, p_target_db_password);
				result.Add("report_curl",report_curl.execute());
				var config_curl = new cURL ("PUT", null, p_target_db + "/config", null, p_target_db_user_name, p_target_db_password);
				result.Add("config_curl",config_curl.execute());


//curl -vX POST http://uid:pwd@target_db_url/_replicate \
//     -d '{"source":"http://uid:pwd@source_db_url/_users","target":"http://uid:pwd@target_db_url/_users"}' \

			var replicate_users_curl = new cURL ("PUT", null, p_source_db + "/_replicate", string.Format
			(
				"{\"source\":\"http://{0}:{1}@{2}/_users\",\"target\":\"http://{3}:{4}@{5}/_users\"}",
				p_target_db_user_name, 
				p_target_db_password,
				p_target_db,
				p_source_db_user_name, 
				p_source_db_password,
				p_source_db
			),
		 	p_target_db_user_name, p_target_db_password);
	 		result.Add("replicate_users_curl",replicate_users_curl.execute());
//curl -vX POST http://uid:pwd@target_db_url/_replicate \
//     -d '{"source":"http://muid:pwd@source_db_url/metadata","target":"http://uid:pwd@target_db_url/metadata"}' \

			var replicate_metadata_users_curl = new cURL ("PUT", null, p_source_db + "/_replicate", string.Format
			(
				"{\"source\":\"http://{0}:{1}@{2}/metadata\",\"target\":\"http://{3}:{4}@{5}/metadata\"}",
				p_target_db_user_name, 
				p_target_db_password,
				p_target_db,
				p_source_db_user_name, 
				p_source_db_password,
				p_source_db
			),
			p_target_db_user_name, p_target_db_password);	 
			result.Add("replicate_metadata_users_curl",replicate_metadata_users_curl.execute());
//curl -vX POST http://uid:pwd@target_db_url/_replicate \
//     -d '{"source":"http://uid:pwd@source_db_url","target":"http://uid:pwd@target_db_url/mmrds"}' \

			var replicate_records_curl = new cURL ("PUT", null, p_source_db + "/_replicate", string.Format
			(
				"{\"source\":\"http://{0}:{1}@{2}\",\"target\":\"http://{3}:{4}@{5}/mmrds\"}",
				p_target_db_user_name, 
				p_target_db_password,
				p_target_db,
				p_source_db_user_name, 
				p_source_db_password,
				p_source_db
			),
 			p_target_db_user_name, p_target_db_password);	 
			result.Add("replicate_records_curl",replicate_records_curl.execute());

		}
		catch(Exception ex) 
		{
			Console.WriteLine (ex);
		}


			//return result;
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

