using System;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;

namespace mmria.server.model.actor.quartz
{
    public class Process_Migrate_Data : UntypedActor
    {
        protected override void PreStart() => Console.WriteLine("Process_Migrate_Data started");
        protected override void PostStop() => Console.WriteLine("Process_Migrate_Data stopped");

        protected override void OnReceive(object message)
        {
			try
			{
				string migration_plan_id = message.ToString();

				Console.WriteLine($"Process_Migrate_Data Begin {System.DateTime.Now}");


				string url = Program.config_couchdb_url + "/mmrds/_all_docs?include_docs=true";

				var case_curl = new cURL("GET", null, url, null, Program.config_timer_user_name, Program.config_timer_password);
				string responseFromServer = case_curl.execute();
				
				var case_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<System.Dynamic.ExpandoObject>>(responseFromServer);

				var migration_plan = get_migration_plan(migration_plan_id);

				var lookup = get_look_up(migration_plan);

				foreach(var case_item in case_response.rows)
				{
					foreach(var plan_item in migration_plan.plan_items)
					{
						if
						(
							string.IsNullOrWhiteSpace(plan_item.old_mmria_path) || 
							string.IsNullOrWhiteSpace(plan_item.new_mmria_path)
						)
						{
							continue;
						}

						var old_value = get_value(plan_item.old_mmria_path.TrimEnd('/'), case_item.doc);

						string new_value = old_value;
						if
						(
							lookup[plan_item.old_mmria_path][plan_item.new_mmria_path].ContainsKey(old_value + "")
						)
						{
							new_value = lookup[plan_item.old_mmria_path][plan_item.new_mmria_path][old_value];
						}

						var set_result = set_value(plan_item.new_mmria_path.TrimEnd('/'), new_value, case_item.doc);
					}

					set_value("date_last_updated", DateTime.UtcNow.ToString("o"), case_item.doc);
					set_value("last_updated_by", "migration_plan", case_item.doc);


					Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
					settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
					var object_string = Newtonsoft.Json.JsonConvert.SerializeObject(case_item.doc, settings);

					string put_url = Program.config_couchdb_url + "/mmrds/"  + case_item.id;
					cURL document_curl = new cURL ("PUT", null, put_url, object_string, Program.config_timer_user_name, Program.config_timer_password);

					try
					{
						responseFromServer = document_curl.execute();
						var	result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
					}
					catch(Exception ex)
					{
						//Console.Write("auth_session_token: {0}", auth_session_token);
						Console.WriteLine(ex);
					}
				}

				Console.WriteLine($"Process_Migrate_Data End {System.DateTime.Now}");
			
			}
			catch(Exception ex)
			{
				Console.WriteLine($"Process_Migrate_Data exception {System.DateTime.Now}\n{ex}");
			}

        }


        private mmria.common.model.migration_plan get_migration_plan(string p_id)
        {
			string url = Program.config_couchdb_url + $"/metadata/{p_id}";

			var curl = new cURL("GET", null, url, null, Program.config_timer_user_name, Program.config_timer_password);
			string responseFromServer = curl.execute();
              
            var migration_plan = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.migration_plan>(responseFromServer);

            return migration_plan;

        }


		private Dictionary<string,Dictionary<string,Dictionary<string,string>>> get_look_up(mmria.common.model.migration_plan p_migration_plan)
        {
			var result = new Dictionary<string,Dictionary<string,Dictionary<string,string>>>(StringComparer.OrdinalIgnoreCase);

			foreach(var plan_item in p_migration_plan.plan_items)
			{

				if
				(
					string.IsNullOrEmpty(plan_item.old_mmria_path) ||
					string.IsNullOrEmpty(plan_item.new_mmria_path) 
				)
				{
					continue;
				}

				if(!result.ContainsKey(plan_item.old_mmria_path))
				{
					result.Add(plan_item.old_mmria_path, new Dictionary<string,Dictionary<string,string>>(StringComparer.OrdinalIgnoreCase));
				}

				var Left_dictionary = result[plan_item.old_mmria_path];

				if(!Left_dictionary.ContainsKey(plan_item.new_mmria_path))
				{
					Left_dictionary.Add(plan_item.new_mmria_path, new Dictionary<string,string>(StringComparer.OrdinalIgnoreCase));
				}

				var current_dictionary = Left_dictionary[plan_item.new_mmria_path];
				if(current_dictionary.ContainsKey(plan_item.old_value))
				{
					current_dictionary[plan_item.old_value] = plan_item.new_value;
				}
				else
				{
					current_dictionary.Add(plan_item.old_value, plan_item.new_value);
				}
			}


			return result;
		}

		private string get_value(string p_metadata_path, object p_case)
		{
			string result = null;

			var metadata_path_array = p_metadata_path.Split("/");
			var item_key = metadata_path_array[0];

			if(metadata_path_array.Length == 1)
			{
				switch(p_case)
				{
					case IDictionary<string,object> val:
						if(val.ContainsKey(item_key))
						{
							object new_item = val[item_key];

							switch(new_item)
							{
								default:
									if(new_item != null)
									{
										result = new_item.ToString();
									}
									
								break;
							}
						}

						break;

				}
			}
			else
			{
				var  builder = new System.Text.StringBuilder();
				for(int i = 1; i < metadata_path_array.Length; i++)
				{
					builder.Append(metadata_path_array[i]);
					builder.Append("/");
				}
				builder.Length = builder.Length - 1;

				var metadata_path = builder.ToString();
				object new_item = null;

				switch(p_case)
				{
					case IDictionary<string,object> val:
						if(val.ContainsKey(item_key))
						{
							new_item = val[item_key];
						}

						break;

				}
				result = get_value(metadata_path, new_item);
			}
			


			return result;
		}

		private bool set_value(string p_metadata_path, string p_value, object p_case)
		{
			bool result = false;

			var metadata_path_array = p_metadata_path.Split("/");
			var item_key = metadata_path_array[0];

			if(metadata_path_array.Length == 1)
			{
				switch(p_case)
				{
					case IDictionary<string,object> val:
						if(val.ContainsKey(item_key))
						{
							val[item_key] = p_value;
							/*
							object new_item = val[item_key];

							switch(new_item)
							{
								default:
									val[item_key] = new_item.ToString();
								break;
							} */
						}
						else
						{
							val.Add(item_key, p_value);
						}

						break;

				}
			}
			else
			{
				var  builder = new System.Text.StringBuilder();
				for(int i = 1; i < metadata_path_array.Length; i++)
				{
					builder.Append(metadata_path_array[i]);
					builder.Append("/");
				}
				builder.Length = builder.Length - 1;

				var metadata_path = builder.ToString();
				object new_item = null;

				switch(p_case)
				{
					case IDictionary<string,object> val:
						if(val.ContainsKey(item_key))
						{
							result = set_value(metadata_path, p_value, val[item_key]);
						}
						else
						{
							// error
						}

						break;
					case IList<object> val:
						foreach(var item in val)
						{
							switch(item)
							{
								case IDictionary<string,object> item_val:
									if(item_val.ContainsKey(item_key))
									{
										result &= set_value(metadata_path, p_value, item_val[item_key]);
									}
									else
									{
										// error
									}

									break;
							}
						}

						break;

				}
				//result = set_value(metadata_path, p_value, new_item);
			}
			



			return result;
		}
    }


}