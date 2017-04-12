using System;
using System.Collections.Generic;


namespace mmria.server.util
{
	public class c_sync_document
	{

		private string document_json;
		private string document_id;

		public c_sync_document (string p_document_id, string p_document_json)
		{
			this.document_json = p_document_json;
			this.document_id = p_document_id;
		}



		private string get_revision(string p_document_url)
		{

			string result = null;

			var document_curl = new cURL("GET", null, p_document_url, null, Program.config_timer_user_name, Program.config_timer_password);
			string document_json = null;

			try
			{
				
				document_json = document_curl.execute();
				var request_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(document_json);
				IDictionary<string, object> updater = request_result as IDictionary<string, object>;
				result = updater["_rev"].ToString();
			}
			catch(Exception Ex) 
			{

			}

			return result;
		}

		public void execute()
		{


			string de_identified_json = new mmria.server.util.c_de_identifier(document_json).execute();

			string de_identified_revision = get_revision (Program.config_couchdb_url + "/de_id/" + this.document_id);
			string de_identfied_url = null;

			if(string.IsNullOrEmpty(de_identified_revision))
			{
				de_identfied_url = Program.config_couchdb_url + "/de_id/" + this.document_id;
			}
			{
				de_identfied_url = Program.config_couchdb_url + "/de_id/" + this.document_id + "?new_edits=false";
			}
			var de_identfied_curl = new cURL("PUT", null, de_identfied_url, de_identified_json, Program.config_timer_user_name, Program.config_timer_password);
			try
			{
				string de_id_result = de_identfied_curl.execute();
				System.Console.WriteLine("sync de_id");
				System.Console.WriteLine(de_id_result);

			}
			catch (Exception ex)
			{
				System.Console.WriteLine("sync de_id");
				System.Console.WriteLine(ex);
			}


			//string aggregate_url = Program.config_couchdb_url + "/report/" + kvp.Key + "?new_edits=false";

			try
			{
				string aggregate_json = new mmria.server.util.c_aggregator(document_json).execute();

				string aggregate_revision = get_revision (Program.config_couchdb_url + "/report/" + this.document_id);

				string aggregate_url = null;

				if(string.IsNullOrEmpty(de_identified_revision))
				{
					aggregate_url = Program.config_couchdb_url + "/report/" + this.document_id;
				}
				{
					aggregate_url = Program.config_couchdb_url + "/report/" + this.document_id + "?new_edits=false";
				}
				var aggregate_curl = new cURL("PUT", null, aggregate_url, aggregate_json,  Program.config_timer_user_name, Program.config_timer_password);

				string aggregate_result = aggregate_curl.execute();
				System.Console.WriteLine("sync aggregate_id");
				System.Console.WriteLine(aggregate_result);

			}
			catch (Exception ex)
			{
				System.Console.WriteLine("sync aggregate_id");
				System.Console.WriteLine(ex);
			}


		}
	}
}

