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
	} 
}

