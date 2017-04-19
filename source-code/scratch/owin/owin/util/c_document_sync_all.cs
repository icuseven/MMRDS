using System;
using System.Collections.Generic;


namespace mmria.server.util
{
	public class c_document_sync_all
	{

		private string couchdb_url;
		private string document_url;
		private string user_name;
		private string password;

		public c_document_sync_all (string p_couchdb_url, string p_document_url, string p_user_name, string p_password)
		{
			this.couchdb_url = p_couchdb_url;
			this.document_url = p_document_url;
			this.user_name = p_user_name;
			this.password = p_password;
		}


		public void execute()
		{


			var curl = new cURL ("GET", null, this.couchdb_url + "/mmrds/_changes", null, this.user_name, this.password);
			string res = curl.execute ();
			mmria.server.model.couchdb.c_change_result latest_change_set = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_change_result> (res);

			Dictionary<string, KeyValuePair<string,bool>> response_results = new Dictionary<string, KeyValuePair<string,bool>> (StringComparer.OrdinalIgnoreCase);
			
			if (Program.Last_Change_Sequence != latest_change_set.last_seq)
			{
				foreach (mmria.server.model.couchdb.c_seq seq in latest_change_set.results)
				{
					if (response_results.ContainsKey (seq.id)) 
					{
						if 
						(
							seq.changes.Count > 0 &&
							response_results [seq.id].Key != seq.changes [0].rev
						)
						{
							if (seq.deleted == null)
							{
								response_results [seq.id] = new KeyValuePair<string, bool> (seq.changes [0].rev, false);
							}
							else
							{
								response_results [seq.id] = new KeyValuePair<string, bool> (seq.changes [0].rev, true);
							}
							
						}
					}
					else 
					{
						if (seq.deleted == null)
						{
							response_results.Add (seq.id, new KeyValuePair<string, bool> (seq.changes [0].rev, false));
						}
						else
						{
							response_results.Add (seq.id, new KeyValuePair<string, bool> (seq.changes [0].rev, true));
						}
					}
				}
			}

			foreach (KeyValuePair<string, KeyValuePair<string, bool>> kvp in response_results)
			{
				if (kvp.Value.Value)
				{
					try
					{
						mmria.server.util.c_sync_document sync_document = new mmria.server.util.c_sync_document (kvp.Key, null, "DELETE");
						sync_document.execute ();
						
	
					}
					catch (Exception ex)
					{
							System.Console.WriteLine ("Sync Delete case");
							System.Console.WriteLine (ex);
					}
				}
				else
				{

					string document_url = this.couchdb_url + "/mmrds/" + kvp.Key;
					var document_curl = new cURL ("GET", null, this.document_url, null, this.user_name, this.password);
					string document_json = null;

					try
					{
						document_json = document_curl.execute ();
						if (!string.IsNullOrEmpty (document_json) && document_json.IndexOf ("\"_id\":\"_design/") < 0)
						{
							mmria.server.util.c_sync_document sync_document = new mmria.server.util.c_sync_document (kvp.Key, document_json);
							sync_document.execute ();
						}
	
					}
					catch (Exception ex)
					{
							System.Console.WriteLine ("Sync PUT case");
							System.Console.WriteLine (ex);
					}
				}
			}



			string de_identified_json = new mmria.server.util.c_de_identifier(document_json).execute();

			string de_identified_revision = get_revision (Program.config_couchdb_url + "/de_id/" + this.document_id);
			System.Text.StringBuilder de_identfied_url = new System.Text.StringBuilder();

			if(!string.IsNullOrEmpty(de_identified_revision))
			{
				//de_identfied_url = Program.config_couchdb_url + "/de_id/" + this.document_id + "?new_edits=false";
				
				de_identified_json = set_revision (de_identified_json, de_identified_revision);

			}

			de_identfied_url.Append(Program.config_couchdb_url);
			de_identfied_url.Append("/de_id/");
			de_identfied_url.Append(this.document_id);

			if(this.method == "DELETE")
			{
				de_identfied_url.Append("?rev=");
				de_identfied_url.Append(de_identified_revision);	
			}

			var de_identfied_curl = new cURL(this.method, null, de_identfied_url.ToString(), de_identified_json, Program.config_timer_user_name, Program.config_timer_password);
			try
			{
				string de_id_result = de_identfied_curl.execute();
				System.Console.WriteLine("sync de_id");
				System.Console.WriteLine(de_id_result);

			}
			catch (Exception ex)
			{
				System.Console.WriteLine("c_sync_document de_id");
				System.Console.WriteLine(ex);
			}


			//string aggregate_url = Program.config_couchdb_url + "/report/" + kvp.Key + "?new_edits=false";

			try
			{
				string aggregate_json = new mmria.server.util.c_aggregator(document_json).execute();

				string aggregate_revision = get_revision (Program.config_couchdb_url + "/report/" + this.document_id);

				System.Text.StringBuilder aggregate_url = new System.Text.StringBuilder();

				if(!string.IsNullOrEmpty(aggregate_revision))
				{
					//aggregate_url = Program.config_couchdb_url + "/report/" + this.document_id + "?new_edits=false";
					aggregate_json = set_revision (aggregate_json, aggregate_revision);
				}


				aggregate_url.Append(Program.config_couchdb_url);
				aggregate_url.Append("/report/");
				aggregate_url.Append(this.document_id);
	
				if(this.method == "DELETE")
				{
					aggregate_url.Append("?rev=");
					aggregate_url.Append(aggregate_revision);	
				}

				var aggregate_curl = new cURL(this.method, null, aggregate_url.ToString(), aggregate_json,  Program.config_timer_user_name, Program.config_timer_password);

				string aggregate_result = aggregate_curl.execute();
				System.Console.WriteLine("c_sync_document aggregate_id");
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

