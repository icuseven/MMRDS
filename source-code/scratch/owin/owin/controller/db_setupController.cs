using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace mmria.server
{
	public class db_setupController: ApiController 
	{ 
		struct replication_struc
		{
			public string source;
			public string target;
		}
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
			string p_target_server,
			string p_source_db_user_name, 
			string p_source_db_password,
			string p_source_server
		)
		{

			Dictionary<string,string> result = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase);
			//var curl = new cURL ("GET", null, p_source_db + "/mmrds/_all_docs?include_docs=true", null, p_user_name, p_password);

			try
			{
				/*
				var get_all_dbs_curl = new cURL ("GET", null, p_target_server + "/_all_dbs", null, p_target_db_user_name, p_target_db_password);
				var all_dbs_string = get_all_dbs_curl.execute();
				HashSet<string> all_db_set = Newtonsoft.Json.JsonConvert.DeserializeObject<HashSet<string>>(all_dbs_string, new  Newtonsoft.Json.Converters.ExpandoObjectConverter());
*/

				if(!database_exists(p_target_server + "/_users", p_target_db_user_name, p_target_db_password))
				{
					var users_curl = new cURL ("PUT", null, p_target_server + "/_users", null, p_target_db_user_name, p_target_db_password);
					result.Add("users_curl",users_curl.execute());
				}
				else
				{
					result.Add("users_curl","users_curl already exists.");
				}

				if(!database_exists(p_target_server + "/_replicator", p_target_db_user_name, p_target_db_password))
				{
					var replicator_curl = new cURL ("PUT", null, p_target_server + "/_replicator", null, p_target_db_user_name, p_target_db_password);
					result.Add("replicator_curl",replicator_curl.execute());
				}
				else
				{
					result.Add("replicator_curl","replicator_curl already exists.");
				}

				if(!database_exists(p_target_server + "/_global_changes", p_target_db_user_name, p_target_db_password))
				{
					var global_changes_curl = new cURL ("PUT", null, p_target_server + "/_global_changes", null, p_target_db_user_name, p_target_db_password);
					result.Add("global_changes_curl",global_changes_curl.execute());

				}
				else
				{
					result.Add("global_changes_curl","global_changes_curl already exists.");
				}

				if(!database_exists(p_target_server + "/metadata", p_target_db_user_name, p_target_db_password))
				{
					var metadata_curl = new cURL ("PUT", null, p_target_server + "/metadata", null, p_target_db_user_name, p_target_db_password);
					result.Add("metadata_curl",metadata_curl.execute());
				}
				else
				{
					result.Add("metadata_curl","metadata_curl already exists.");
				}

				if(!database_exists(p_target_server + "/mmrds", p_target_db_user_name, p_target_db_password))
				{
					var mmrds_curl = new cURL ("PUT", null, p_target_server + "/mmrds", null, p_target_db_user_name, p_target_db_password);
					result.Add("mmrds_curl",mmrds_curl.execute());
				}
				else
				{
					result.Add("mmrds_curl","mmrds_curl already exists.");
				}

				if(!database_exists(p_target_server + "/de_id", p_target_db_user_name, p_target_db_password))
				{
					var de_id_curl = new cURL ("PUT", null, p_target_server + "/de_id", null, p_target_db_user_name, p_target_db_password);
					result.Add("de_id_curl",de_id_curl.execute());
				}
				else
				{
					result.Add("de_id_curl","de_id_curl already exists.");
				}

				if(!database_exists(p_target_server + "/report", p_target_db_user_name, p_target_db_password))
				{
					var report_curl = new cURL ("PUT", null, p_target_server + "/report", null, p_target_db_user_name, p_target_db_password);
					result.Add("report_curl",report_curl.execute());
				}
				else
				{
					result.Add("report_curl","report_curl already exists.");
				}

				if(!database_exists(p_target_server + "/config", p_target_db_user_name, p_target_db_password))
				{
					var config_curl = new cURL ("PUT", null, p_target_server + "/config", null, p_target_db_user_name, p_target_db_password);
					result.Add("config_curl",config_curl.execute());
				}
				else
				{
					result.Add("config_curl","config_curl already exists.");
				}



				if(
					!string.IsNullOrWhiteSpace(p_source_server) &&
					!string.IsNullOrWhiteSpace(p_source_db_user_name) &&
					!string.IsNullOrWhiteSpace(p_source_db_password)
				)

				{

				//http://docs.couchdb.org/en/2.0.0/api/server/configuration.html

				string source_server_uri = construct_basic_authentication_url(p_source_server,
					p_source_db_user_name, 
					p_source_db_password);
				string target_server_uri = construct_basic_authentication_url(p_target_server,
					p_target_db_user_name, 
					p_target_db_password);

//curl -vX POST http://uid:pwd@target_db_url/_replicate \
//     -d '{"source":"http://uid:pwd@source_db_url/_users","target":"http://uid:pwd@target_db_url/_users"}' \

				string users_replication_string =  get_replicate_json_string("_users", source_server_uri, target_server_uri);

				var replicate_users_curl = new cURL ("POST", null, p_target_server + "/_replicate", users_replication_string,
		 	p_target_db_user_name, p_target_db_password);
				result.Add("users_replication",replicate_users_curl.execute());
//curl -vX POST http://uid:pwd@target_db_url/_replicate \
//     -d '{"source":"http://muid:pwd@source_db_url/metadata","target":"http://uid:pwd@target_db_url/metadata"}' \


				string metadata_replication_string =  get_replicate_json_string("metadata", source_server_uri, target_server_uri);


				var replicate_metadata_curl = new cURL 
					(
						"POST", null, p_target_server + "/_replicate", metadata_replication_string,
			p_target_db_user_name, p_target_db_password
					);	 
				result.Add("metadata_replication",replicate_metadata_curl.execute());
//curl -vX POST http://uid:pwd@target_db_url/_replicate \
//     -d '{"source":"http://uid:pwd@source_db_url","target":"http://uid:pwd@target_db_url/mmrds"}' \

				string mmrds_replication_string =  get_replicate_json_string("mmrds", source_server_uri, target_server_uri);

				var replicate_mmrds_curl = new cURL ("POST", null, p_target_server + "/_replicate", mmrds_replication_string,
 			p_target_db_user_name, p_target_db_password);	 
				result.Add("mmrds_replication",replicate_mmrds_curl.execute());


				string de_id_replication_string =  get_replicate_json_string("de_id_", source_server_uri, target_server_uri);

				var replicate_de_id__curl = new cURL ("POST", null, p_target_server + "/_replicate", de_id_replication_string,
					p_target_db_user_name, p_target_db_password);	 
				result.Add("de_id__replication",replicate_de_id__curl.execute());

				string report_replication_string =  get_replicate_json_string("report", source_server_uri, target_server_uri);

				var replicate_report_curl = new cURL ("POST", null, p_target_server + "/_replicate", report_replication_string,
					p_target_db_user_name, p_target_db_password);	 
				result.Add("report_replication",replicate_report_curl.execute());

				}

		}
		catch(Exception ex) 
		{
			Console.WriteLine (ex);
				result.Add("Exception",ex.ToString());
		}


			//return result;
		return result;
	} 


		private string construct_basic_authentication_url(string p_url, string p_user_name, string p_password)
		{
			System.Text.StringBuilder result = new System.Text.StringBuilder();


			Uri uri = new Uri(p_url);

			result.Append (uri.Scheme);
			result.Append ("://");
			result.Append (p_user_name);
			result.Append (":");
			result.Append (p_password);
			result.Append ("@");
			result.Append (uri.Host);
			result.Append (":");
			result.Append (uri.Port);



			return result.ToString ();

		}


		private string get_replicate_json_string(string p_db_name, string p_source_server_uri, string p_target_server_uri)
		{
			string result = null;

			replication_struc replication_object = new replication_struc();
			replication_object.source = string.Format("{0}/{1}", p_source_server_uri, p_db_name);
			replication_object.target = string.Format("{0}/{1}", p_target_server_uri, p_db_name);

			result =  Newtonsoft.Json.JsonConvert.SerializeObject(replication_object);

			return result;
		}


		private bool database_exists(string p_target_db_url, string p_user_name, string p_password)
		{
			bool result = false;

			var curl = new cURL ("HEAD", null, p_target_db_url, null, p_user_name, p_password);	 
			try
			{
				curl.execute();
				/*
				HTTP/1.1 200 OK
				Cache-Control: must-revalidate
				Content-Type: application/json
				Date: Mon, 12 Aug 2013 01:27:41 GMT
				Server: CouchDB (Erlang/OTP)*/
				result = true;
			}
			catch(Exception ex)
			{
				// do nothing for now
			}


			return result;
		}

	} 
}

