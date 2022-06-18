using System;
using System.Collections.Generic;
using System.Linq;

namespace mmria.server.utils;

public class c_generate_frequency_summary_report
{
/*


FREQ (N)

STAT_N (N,MIN,MEAN,MEDIAN,SD)

STAT_D (N,MIN,MAX)


FREQ STAT_N STAT_D



*/

    string source_json;

    string data_type = "overdose";

    private System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>> List_Look_Up;

    private int blank_value = 9999;

    public c_generate_frequency_summary_report (string p_source_json, string p_type = "dqr-detail")
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

        var FrequencySummaryDocument = new mmria.server.model.SummaryReport.FrequencySummaryDocument();

        HashSet<string> Custom_Case_Id_List = new HashSet<string>(StringComparer.OrdinalIgnoreCase);


        try
        {
            string request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/_design/sortable/_view/by_date_created?skip=0&take=250000";

            var case_view_curl = new mmria.server.cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
            string case_view_responseFromServer = case_view_curl.execute();

            mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(case_view_responseFromServer);

            foreach (mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
            {
                Custom_Case_Id_List.Add(cvi.id);

            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }


        foreach(string case_id in Custom_Case_Id_List)
        {

        string URL = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/{case_id}";
        cURL document_curl = new cURL("GET", null, URL, null, Program.config_timer_user_name, Program.config_timer_value);
        System.Dynamic.ExpandoObject case_row = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(document_curl.execute());

        IDictionary<string, object> case_doc = case_row as IDictionary<string, object>;

        if
        (
            case_doc == null ||
            !case_doc.ContainsKey("_id") ||
            case_doc["_id"] == null ||
            case_doc["_id"].ToString().StartsWith("_design", StringComparison.InvariantCultureIgnoreCase)
        )
        {
            continue;
        }
        }



        Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
        //settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
        result = Newtonsoft.Json.JsonConvert.SerializeObject(FrequencySummaryDocument, settings);

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


