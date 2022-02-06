using System;
using System.Collections.Generic;
using System.Linq;

namespace mmria.server.utils
{
	public class c_convert_to_dqr_detail
	{


		string source_json;

        string data_type = "overdose";

		private System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>> List_Look_Up;

		private int blank_value = 9999;

		public c_convert_to_dqr_detail (string p_source_json, string p_type = "dqr-detail")
		{

			source_json = p_source_json;
            this.data_type = p_type;
		}

		public string execute ()
		{
			string result = null;

            var gs = new migrate.C_Get_Set_Value(new ());
			
			string metadata_url = Program.config_couchdb_url + $"/metadata/version_specification-{Program.metadata_release_version_name}/metadata";
			cURL metadata_curl = new cURL("GET", null, metadata_url, null, Program.config_timer_user_name, Program.config_timer_value);
			mmria.common.metadata.app metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.app>(metadata_curl.execute());


			List_Look_Up = new Dictionary<string, Dictionary<string, string>>(StringComparer.OrdinalIgnoreCase);

			foreach(var child in metadata.children)
			{
				Get_List_Look_Up(List_Look_Up, metadata.lookup, child, "/" + child.name);
			}



            //migrate.C_Get_Set_Value.get_grid_value_result grid_value_result = null;
            migrate.C_Get_Set_Value.get_value_result value_result = null;
			var dqr_detail = new mmria.server.model.dqr.DQRDetail();

			System.Dynamic.ExpandoObject source_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (source_json);
            int means_of_fatal_injury = 9999;

            value_result = gs.get_value(source_object, "_id");
        
            dqr_detail._id  = ((object)value_result.result).ToString();
/*
            if(data_type == "overdose")
            {
                try
                {
                    var filter_check_string = get_value(source_object, "committee_review/means_of_fatal_injury");
                    int int_check = 0;
                    if
                    (
                        filter_check_string == null ||
                        string.IsNullOrWhiteSpace(filter_check_string.ToString())
                    )
                    {
                        return result;
                    }
                    
                    int Overdose_Poisioning = 3;
                    if(int.TryParse(filter_check_string.ToString(), out int_check))
                    {
                        if(int_check != Overdose_Poisioning)
                        {
                            return result;
                        }
                    }
                    else
                    {
                        return result;
                    }

                }
                catch(Exception)
                {
                    //System.Console.WriteLine (ex);
                }
            }
            else
            {
                try
                {
                    var filter_check_string = get_value(source_object, "committee_review/means_of_fatal_injury");
                    int int_check = 0;
                    if
                    (
                        filter_check_string == null ||
                        string.IsNullOrWhiteSpace(filter_check_string.ToString())
                    )
                    {
                        means_of_fatal_injury = 9999;
                    }
                    else if(int.TryParse(filter_check_string.ToString(), out int_check))
                    {
                        means_of_fatal_injury = int_check;
                    }
                    else
                    {
                        means_of_fatal_injury = 9999;
                    }

                }
                catch(Exception)
                {
                    //System.Console.WriteLine (ex);
                }
            }
            */

			//dynamic source_object = Newtonsoft.Json.Linq.JObject.Parse(source_json);

			Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
			//settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
			result = Newtonsoft.Json.JsonConvert.SerializeObject(dqr_detail, settings);

			return result;
		}

        private void Get_List_Look_Up
        (
            System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>> p_result,
            mmria.common.metadata.node[] p_lookup,
            mmria.common.metadata.node p_metadata,
            string p_path
        )
        {
            switch (p_metadata.type.ToLower())
            {
                case "form":
                case "group":
                case "grid":
                foreach (mmria.common.metadata.node node in p_metadata.children)
                {
                    Get_List_Look_Up(p_result, p_lookup, node, p_path + "/" + node.name.ToLower());
                }
                break;
                case "list":
                if
                (
                    p_metadata.control_style != null &&
                    p_metadata.control_style.ToLower() == "editable"
                )
                {
                    break;
                }

                p_result.Add(p_path, new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase));

                var value_node_list = p_metadata.values;
                if
                (
                    !string.IsNullOrWhiteSpace(p_metadata.path_reference)
                )
                {
                    var name = p_metadata.path_reference.Replace("lookup/", "");
                    foreach (var item in p_lookup)
                    {
                    if (item.name.ToLower() == name.ToLower())
                    {
                        value_node_list = item.values;
                        break;
                    }
                    }
                }

                foreach (var value in value_node_list)
                {
                    p_result[p_path].Add(value.value, value.display);
                }

                break;
                default:
                break;
            }
        }


	}
}

