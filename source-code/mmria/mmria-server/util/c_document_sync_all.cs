using System;
using System.Collections.Generic;


namespace mmria.server.util
{
	public class c_document_sync_all
	{

		private string couchdb_url;
		private string user_name;
		private string password;

		public c_document_sync_all (string p_couchdb_url, string p_user_name, string p_password)
		{
			this.couchdb_url = p_couchdb_url;
			this.user_name = p_user_name;
			this.password = p_password;
		}


		public void execute ()
		{

			try
			{

				var delete_de_id_curl = new cURL ("DELETE", null, this.couchdb_url + "/de_id", null, this.user_name, this.password);
				delete_de_id_curl.execute ();
			}
			catch (Exception ex)
			{
			
			}
			

			try
			{
				var delete_report_curl = new cURL ("DELETE", null, this.couchdb_url + "/report", null, this.user_name, this.password);
				delete_report_curl.execute ();
			}
			catch (Exception ex)
			{
			
			}



			try
			{
				var create_de_id_curl = new cURL ("PUT", null, this.couchdb_url + "/de_id", null, this.user_name, this.password);
				create_de_id_curl.execute ();
			}
			catch (Exception ex)
			{
			
			}



            try 
            {
                string result = System.IO.File.OpenText (System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(),  "database-scripts/case_design_sortable.json")).ReadToEnd ();
                var create_de_id_curl = new cURL ("PUT", null, this.couchdb_url + "/de_id/_design/sortable", result, this.user_name, this.password);
                create_de_id_curl.execute ();
 
            } 
            catch (Exception ex) 
            {

            }



			try
			{
				var create_report_curl = new cURL ("PUT", null, this.couchdb_url + "/report", null, this.user_name, this.password);
				create_report_curl.execute ();	
			}
			catch (Exception ex)
			{
			
			}



			var curl = new cURL ("GET", null, this.couchdb_url + "/mmrds/_all_docs?include_docs=true", null, this.user_name, this.password);
			string res = curl.execute ();
/*
{
  "total_rows": 3, "offset": 0, "rows": [
    {"id": "doc1", "key": "doc1", "value": {"rev": "4324BB"}},
    {"id": "doc2", "key": "doc2", "value": {"rev":"2441HF"}},
    {"id": "doc3", "key": "doc3", "value": {"rev":"74EC24"}}
  ]
}
*/			
			System.Dynamic.ExpandoObject all_docs = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (res);
            try
            {
    			IDictionary<string,object> all_docs_dictionary = all_docs as IDictionary<string,object>;
    			List<object> row_list = all_docs_dictionary ["rows"] as List<object>;
    			foreach (object row_item in row_list) 
                {

                    try
                    {
        				IDictionary<string, object> row_dictionary = row_item as IDictionary<string, object>;
        				IDictionary<string, object> doc_dictionary = row_dictionary ["doc"] as IDictionary<string, object>;
        				string document_id = doc_dictionary ["_id"].ToString ();
        				if (document_id.IndexOf ("_design/") < 0)
        				{
        					string document_json = Newtonsoft.Json.JsonConvert.SerializeObject (doc_dictionary);
        					mmria.server.util.c_sync_document sync_document = new c_sync_document (document_id, document_json);
        					sync_document.execute ();
                        }
    				}
                    catch (Exception document_ex)
                    {
                        System.Console.Write($"error running c_docment_sync_all.document\n{document_ex}");
                    }
    				
    			}
            }
            catch (Exception ex)
            {
                System.Console.Write($"error running c_docment_sync_all\n{ex}");
            }

		}
	}
}

