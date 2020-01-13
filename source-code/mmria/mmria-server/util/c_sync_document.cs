using System;
using System.Collections.Generic;


namespace mmria.server.util
{
	public class c_sync_document
	{

		private string document_json;
		private string document_id;
		private string method;

		public c_sync_document (string p_document_id, string p_document_json, string p_method = "PUT")
		{
			this.document_json = p_document_json;
			this.document_id = p_document_id;

			switch (p_method.ToUpperInvariant ())
			{
				case "DELETE":
					this.method = "DELETE";
					break;
				case "PUT":
				default:
					this.method = "PUT";
					break;
			}
			
		}



		private string set_revision(string p_document, string p_revision_id)
		{

			string result = null;


			var request_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(p_document);
			IDictionary<string, object> expando_object = request_result as IDictionary<string, object>;

			if(expando_object != null)
			{
				expando_object ["_rev"] = p_revision_id;
			}

			result =  Newtonsoft.Json.JsonConvert.SerializeObject(expando_object);

			return result;
		}


		private async System.Threading.Tasks.Task<string> get_revision(string p_document_url)
		{

			string result = null;

			var document_curl = new cURL("GET", null, p_document_url, null, Program.config_timer_user_name, Program.config_timer_value);
			string temp_document_json = null;

			try
			{
				
                temp_document_json = await document_curl.executeAsync();
                var request_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(temp_document_json);
				IDictionary<string, object> updater = request_result as IDictionary<string, object>;
				if(updater != null && updater.ContainsKey("_rev"))
                {
                    result = updater ["_rev"].ToString ();
                }
			}
			catch(Exception ex) 
			{
				if (!(ex.Message.IndexOf ("(404) Object Not Found") > -1)) 
				{
					//System.Console.WriteLine ("c_sync_document.get_revision");
					//System.Console.WriteLine (ex);
				}
			}

			return result;
		}

		public async System.Threading.Tasks.Task executeAsync()
		{

			string de_identified_revision = await get_revision (Program.config_couchdb_url + "/de_id/" + this.document_id);
			System.Text.StringBuilder de_identfied_url = new System.Text.StringBuilder();
			string de_identified_json = null;

			de_identfied_url.Append(Program.config_couchdb_url);
			de_identfied_url.Append("/de_id/");
			de_identfied_url.Append(this.document_id);

			if(this.method == "DELETE")
			{
				de_identfied_url.Append("?rev=");
				de_identfied_url.Append(de_identified_revision);	

			}
			else
			{
				de_identified_json = await new mmria.server.util.c_de_identifier(document_json).executeAsync();

				if(string.IsNullOrEmpty(de_identified_json))
				{
					try 
					{
						
						string current_directory = AppContext.BaseDirectory;
						if(!System.IO.Directory.Exists(System.IO.Path.Combine(current_directory, "database-scripts")))
						{
							current_directory = System.IO.Directory.GetCurrentDirectory();
						}

						using (var  sr = new System.IO.StreamReader(System.IO.Path.Combine( current_directory,  $"database-scripts/case-version-{Program.metadata_release_version_name}.json")))
						{
							de_identified_json = await sr.ReadToEndAsync ();
						}

						var case_expando_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (de_identified_json);


						var byName = (IDictionary<string,object>)case_expando_object;
						var created_by = byName["created_by"] as string;
						if(string.IsNullOrWhiteSpace(created_by))
						{
							byName["created_by"] = "system2";
						} 

						if(byName.ContainsKey("last_updated_by"))
						{
							byName["last_updated_by"] = "system2";
						}
						else
						{
							byName.Add("last_updated_by", "system2");
							
						}

						byName["_id"] = this.document_id; 

		
					} 
					catch (Exception ex) 
					{

					}

				}

				if(!string.IsNullOrEmpty(de_identified_revision))
				{
					//de_identfied_url = Program.config_couchdb_url + "/de_id/" + this.document_id + "?new_edits=false";
					
					de_identified_json = set_revision (de_identified_json, de_identified_revision);

				}
			}

			var de_identfied_curl = new cURL(this.method, null, de_identfied_url.ToString(), de_identified_json, Program.config_timer_user_name, Program.config_timer_value);
			try
			{
				string de_id_result = await de_identfied_curl.executeAsync();
				System.Console.WriteLine("sync de_id");
				System.Console.WriteLine(de_id_result);

			}
			catch (Exception ex)
			{
				//System.Console.WriteLine("c_sync_document de_id");
				//System.Console.WriteLine(ex);
			}
		
			
			//string aggregate_url = Program.config_couchdb_url + "/report/" + kvp.Key + "?new_edits=false";

			try
			{
				string aggregate_json = new mmria.server.util.c_convert_to_report_object(document_json).execute();

				string aggregate_revision = await get_revision (Program.config_couchdb_url + "/report/" + this.document_id);

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

				var aggregate_curl = new cURL(this.method, null, aggregate_url.ToString(), aggregate_json,  Program.config_timer_user_name, Program.config_timer_value);

				string aggregate_result = await aggregate_curl.executeAsync();
				System.Console.WriteLine("c_sync_document aggregate_id");
				System.Console.WriteLine(aggregate_result);

			}
			catch (Exception ex)
			{
				//System.Console.WriteLine("sync aggregate_id");
				//System.Console.WriteLine(ex);
			}


		}
	}
}

