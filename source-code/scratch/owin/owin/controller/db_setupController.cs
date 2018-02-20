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
			string p_target_db_password

		)
		{

			Dictionary<string,string> result = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase);
            //var curl = new cURL ("GET", null, p_source_db + "/mmrds/_all_docs?include_docs=true", null, p_user_name, p_password);
            if(!url_endpoint_exists (Program.config_couchdb_url, p_target_db_user_name, p_target_db_password))
            {
                result.Add ("End point url NOT available:", Program.config_couchdb_url);
                return result;
            }

			try
			{
                string current_directory = AppDomain.CurrentDomain.BaseDirectory;

                if (!url_endpoint_exists (Program.config_couchdb_url + "/metadata", p_target_db_user_name, p_target_db_password)) 
                {
                    var metadata_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata", null, p_target_db_user_name, p_target_db_password);
                    System.Console.WriteLine ("metadata_curl\n{0}", metadata_curl.execute ());

                    new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[]}}", p_target_db_user_name, p_target_db_password).execute ();
                    System.Console.WriteLine ("metadata/_security completed successfully");

                }

                try 
                {
					string metadata_design_auth = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/metadata_design_auth.json")).ReadToEnd ();

                    sync_document (metadata_design_auth, Program.config_couchdb_url + "/metadata/_design/auth", p_target_db_user_name, p_target_db_password);

                    //var metadata_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/_design/auth", metadata_design_auth, p_target_db_user_name, p_target_db_password);
                    //metadata_design_auth_curl.execute ();

					string metadata_json = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/metadata.json")).ReadToEnd (); 
                    sync_document (metadata_json, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z", p_target_db_user_name, p_target_db_password);

                    //var metadata_json_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/metadata/2016-06-12T13:49:24.759Z", metadata_json, p_target_db_user_name, p_target_db_password);
                    //metadata_json_curl.execute ();

                }
                catch (Exception ex) 
                {
                    System.Console.WriteLine ("unable to configure metadata:\n{0}", ex);
                }
                


                if (!url_endpoint_exists (Program.config_couchdb_url + "/mmrds", p_target_db_user_name, p_target_db_password)) 
                {
                    var mmrds_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds", null, p_target_db_user_name, p_target_db_password);
                    System.Console.WriteLine ("mmrds_curl\n{0}", mmrds_curl.execute ());

                    new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\",\"data_analyst\",\"timer\"]}}", p_target_db_user_name, p_target_db_password).execute ();
                    System.Console.WriteLine ("mmrds/_security completed successfully");
                }

                try 
                {
					string case_design_sortable = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/case_design_sortable.json")).ReadToEnd ();
                    //var case_design_sortable_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_design/sortable", case_design_sortable, p_target_db_user_name, p_target_db_password);
                    //case_design_sortable_curl.execute ();
                    sync_document (case_design_sortable, Program.config_couchdb_url + "/mmrds/_design/sortable", p_target_db_user_name, p_target_db_password);


					string case_store_design_auth = System.IO.File.OpenText (System.IO.Path.Combine (current_directory, "database-scripts/case_store_design_auth.json")).ReadToEnd ();
                    //var case_store_design_auth_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/mmrds/_design/auth", case_store_design_auth, p_target_db_user_name, p_target_db_password);
                    //case_store_design_auth_curl.execute ();
                    sync_document (case_store_design_auth, Program.config_couchdb_url + "/mmrds/_design/auth", p_target_db_user_name, p_target_db_password);
                }
                catch (Exception ex) 
                {
                    System.Console.WriteLine ("unable to configure mmrds database:\n", ex);
                }
                

                if (!url_endpoint_exists (Program.config_couchdb_url + "/export_queue", p_target_db_user_name, p_target_db_password)) 
                {
                    System.Console.WriteLine ("Creating export_queue db.");
                    var export_queue_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue", null, p_target_db_user_name, p_target_db_password);
                    System.Console.WriteLine (export_queue_curl.execute ());
                    new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue/_security", "{\"admins\":{\"names\":[],\"roles\":[\"abstractor\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\"]}}", p_target_db_user_name, p_target_db_password).execute ();
                }

				Program.StartSchedule ();

		}
		catch(Exception ex) 
		{
			Console.WriteLine (ex);
                result.Add("db_setupController.Get Exception",ex.ToString());
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

            mmria.common.model.couchdb.replication_struct replication_object = new mmria.common.model.couchdb.replication_struct();
			replication_object.source = string.Format("{0}/{1}", p_source_server_uri, p_db_name);
			replication_object.target = string.Format("{0}/{1}", p_target_server_uri, p_db_name);

            result =  Newtonsoft.Json.JsonConvert.SerializeObject(replication_object);

			return result;
		}




        private string set_revision (string p_document, string p_revision_id)
        {

            string result = null;


            var request_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (p_document);
            IDictionary<string, object> expando_object = request_result as IDictionary<string, object>;
            expando_object ["_rev"] = p_revision_id;

            result = Newtonsoft.Json.JsonConvert.SerializeObject (expando_object);

            return result;
        }


        private string get_revision (string p_document_url)
        {

            string result = null;

            var document_curl = new cURL ("GET", null, p_document_url, null, Program.config_timer_user_name, Program.config_timer_password);
            string document_json = null;

            try 
            {

                document_json = document_curl.execute ();
                var request_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (document_json);
                IDictionary<string, object> updater = request_result as IDictionary<string, object>;
                result = updater ["_rev"].ToString ();
            }
            catch (Exception ex) 
            {
                if (!(ex.Message.IndexOf ("(404) Object Not Found") > -1)) 
                {
                    //System.Console.WriteLine ("c_sync_document.get_revision");
                    //System.Console.WriteLine (ex);
                }
            }

            return result;
        }


        private bool sync_document(string p_document_json, string p_target_db_url, string p_user_name, string p_password)
        {

            bool result = false;

            string revision_id = get_revision (p_target_db_url);
            string storage_document_json = null;
            if (!string.IsNullOrEmpty (revision_id)) 
            {
                storage_document_json = set_revision (p_document_json, revision_id);

            } 
            else
            {
                storage_document_json = p_document_json;
            }

            var curl = new cURL ("PUT", null, p_target_db_url, storage_document_json, p_user_name, p_password);
            try 
            {
                string curl_result = curl.execute ();
                System.Console.WriteLine ("db_setupController.sync_document");
                System.Console.WriteLine (curl_result);
                result = true;
            }
            catch (Exception ex) 
            {
                //System.Console.WriteLine("c_sync_document de_id");
                //System.Console.WriteLine(ex);
            }

            return result;
        }


		private bool url_endpoint_exists(string p_target_db_url, string p_user_name, string p_password)
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

