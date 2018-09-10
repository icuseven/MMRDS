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
        


			string migration_plan_id = message.ToString();

            Console.WriteLine($"Process_Migrate_Data {System.DateTime.Now}");


			string url = Program.config_couchdb_url + "/mmrds/_all_docs?include_docs=true";

			var case_curl = new cURL("GET", null, url, null, Program.config_timer_user_name, Program.config_timer_password);
			string responseFromServer = case_curl.execute();
              
            var case_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<System.Dynamic.ExpandoObject>>(responseFromServer);

			var migration_plan = get_migration_plan("0b12902e-41fc-648c-2dcb-e0f1d2f47d4a");

			var lookup = get_look_up(migration_plan);

			foreach(var case_item in case_response.rows)
			{
				foreach(var plan_item in migration_plan.plan_items)
				{
					var old_value = get_value(plan_item.old_mmria_path, case_item.doc);

					string new_value = old_value;
					if
					(
						lookup[plan_item.old_mmria_path][plan_item.new_mmria_path].ContainsKey(old_value + "")
					)
					{
						new_value = lookup[plan_item.old_mmria_path][plan_item.new_mmria_path][old_value];
					}

					var set_result = set_value(plan_item.new_mmria_path, new_value, case_item.doc);
				}
			}
			/*
{"total_rows":7,"offset":0,"rows":[
{"id":"010d8406-55d0-416f-9000-55c068b4ec54","key":"010d8406-55d0-416f-9000-55c068b4ec54","value":{"rev":"1-c6855378e0dc9920bc13669c3de428b9"},"doc":{
	}			
			*/


			//result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_change_result>(res);


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

		private string get_value(string p_metadata_path, System.Dynamic.ExpandoObject p_case)
		{
			string result = null;

			return result;
		}

		private bool set_value(string p_metadata_path, string p_value, System.Dynamic.ExpandoObject p_case)
		{
			bool result = false;

			return result;
		}
    }


}