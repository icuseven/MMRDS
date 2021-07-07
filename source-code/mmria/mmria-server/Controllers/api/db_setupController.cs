using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Dynamic;
using Serilog;
using Serilog.Configuration;

namespace mmria.server
{
    [Route("api/[controller]")]
	public class db_setupController: ControllerBase
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

        [HttpGet]
		public async Task<IDictionary<string, string>> Get
		(
			string p_target_db_user_name, 
			string p_target_db_user_value

		)
		{

			Dictionary<string,string> result = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase);
            
            if(!await url_endpoint_exists (Program.config_couchdb_url, p_target_db_user_name, p_target_db_user_value))
            {
                result.Add ("End point url NOT available:", Program.config_couchdb_url);
                return result;
            }

			try
			{
                
                string current_directory = AppContext.BaseDirectory;
                if(!System.IO.Directory.Exists(System.IO.Path.Combine(current_directory, "database-scripts")))
                {
                    current_directory = System.IO.Directory.GetCurrentDirectory();
                }

                if (await url_endpoint_exists (Program.config_couchdb_url + "/metadata", p_target_db_user_name, p_target_db_user_value)) 
                {
                    var metadata_curl = new cURL ("DELETE", null, Program.config_couchdb_url + "/metadata", null, p_target_db_user_name, p_target_db_user_value);
                    Log.Information($"metadata_curl\n{await metadata_curl.executeAsync ()}");
                }

                try 
                {
                    await mmria.server.utilsc_db_setup.UpdateMetadata(current_directory);
                }
                catch (Exception ex) 
                {
                    Log.Information($"unable to configure metadata:\n{ex}");
                }
                


                if (!await url_endpoint_exists (Program.config_couchdb_url + $"/{Program.db_prefix}mmrds", p_target_db_user_name, p_target_db_user_value)) 
                {
                    var mmrds_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}mmrds", null, p_target_db_user_name, p_target_db_user_value);
                    Log.Information($"mmrds_curl\n{ await mmrds_curl.executeAsync ()}");

                    await new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}mmrds/_security", "{\"admins\":{\"names\":[],\"roles\":[\"form_designer\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\",\"data_analyst\",\"timer\"]}}", p_target_db_user_name, p_target_db_user_value).executeAsync ();
                    Log.Information($"mmrds/_security completed successfully");
                }

                try 
                {

                    using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/case_design_sortable.json")))
                    {
                        string case_design_sortable = sr.ReadToEnd ();
                        await sync_document (case_design_sortable, Program.config_couchdb_url + $"/{Program.db_prefix}mmrds/_design/sortable", p_target_db_user_name, p_target_db_user_value);
                        
                    }


                    using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine (current_directory, "database-scripts/case_store_design_auth.json")))
                    {
                        string case_store_design_auth = sr.ReadToEnd ();
                        await sync_document (case_store_design_auth, Program.config_couchdb_url + $"/{Program.db_prefix}mmrds/_design/auth", p_target_db_user_name, p_target_db_user_value);
                    }
                }
                catch (Exception ex) 
                {
                    Log.Information($"unable to configure mmrds database:\n{ex}");
                }
                

                if (!await url_endpoint_exists (Program.config_couchdb_url + $"/{Program.db_prefix}export_queue", p_target_db_user_name, p_target_db_user_value)) 
                {
                    System.Console.WriteLine ("Creating export_queue db.");
                    var export_queue_curl = new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}export_queue", null, p_target_db_user_name, p_target_db_user_value);
                    System.Console.WriteLine (await export_queue_curl.executeAsync ());
                    await new cURL ("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}export_queue/_security", "{\"admins\":{\"names\":[],\"roles\":[\"abstractor\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\"]}}", p_target_db_user_name, p_target_db_user_value).executeAsync ();
                }
            }
            catch(Exception ex) 
            {
                Log.Information($"{ex}");
                result.Add("db_setupController.Get Exception",ex.ToString());
            }
            return result;
        } 


        private async Task<bool> url_endpoint_exists(string p_target_db_url, string p_user_name, string p_user_value)
        {
            bool result = false;

            var curl = new cURL ("HEAD", null, p_target_db_url, null, p_user_name, p_user_value);	 
            try
            {
                await curl.executeAsync();
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

        private string set_revision (string p_document, string p_revision_id)
        {

            string result = null;


            var request_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (p_document);
            IDictionary<string, object> expando_object = request_result as IDictionary<string, object>;

            if(expando_object != null)
            {
                expando_object ["_rev"] = p_revision_id;
            }
            

            result = Newtonsoft.Json.JsonConvert.SerializeObject (expando_object);

            return result;
        }


        private async Task<string> get_revision (string p_document_url)
        {

            string result = null;

            var document_curl = new cURL ("GET", null, p_document_url, null, Program.config_timer_user_name, Program.config_timer_value);
            string document_json = null;

            try 
            {

                document_json = await document_curl.executeAsync ();
                var request_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (document_json);
                IDictionary<string, object> updater = request_result as IDictionary<string, object>;
                if(updater != null && updater.ContainsKey("_rev"))
                {
                    result = updater ["_rev"].ToString ();
                }
                
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

        private async Task<bool> sync_document(string p_document_json, string p_target_db_url, string p_user_name, string p_user_value)
        {

            bool result = false;

            string revision_id = await get_revision (p_target_db_url);
            string storage_document_json = null;
            if (!string.IsNullOrEmpty (revision_id)) 
            {
                storage_document_json = set_revision (p_document_json, revision_id);

            } 
            else
            {
                storage_document_json = p_document_json;
            }

            var curl = new cURL ("PUT", null, p_target_db_url, storage_document_json, p_user_name, p_user_value);
            try 
            {
                string curl_result = await curl.executeAsync ();
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

	} 
}

