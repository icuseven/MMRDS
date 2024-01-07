using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using  mmria.pmss.server.extension;

namespace mmria.pmss.server.utils;

/*
public sealed class ItemCount
{
    public ItemCount(){}

    public string host_name {get; set; }

    public string folder_name {get; set; } = "/";
    
    public int total{get; set; }
}*/
public sealed class VROSummaryItem
{
    public VROSummaryItem(){}
    public string host_name {get; set; }

    public string folder_name {get; set; } = "/";
    public string rpt_date{get; set; }
    public int num_recs{get; set; }
    public int num_users_unq{get; set; }
    public int num_users_ja{get; set; }
    public int num_users_abs{get; set; }
    public int num_user_anl{get; set; }

    public int num_user_cm { get; set; }


    public string Death_Year { get; set; }
    public string Jurisdiction_Abrev { get; set; }
    public string Jurisdiction_Name { get; set; }
    public string DC_AuxNo { get; set; }
    public string DC_FileNo { get; set; }
    public string DC_DOD { get; set; }
    public string DC_TimingOfDeath { get; set; }
    public string DC_Cod33A { get; set; }
    public string DC_Cod33B { get; set; }
    public string DC_Cod33C { get; set; }
    public string DC_Cod33D { get; set; }
    public string DC_Other_Factors { get; set; }
    public string ACME_UC { get; set; }
    public string MAN_UC { get; set; }
    public string EAC { get; set; }
    public string CDC_CheckBox { get; set; }
    public string CDC_ICD { get; set; }
    public string CDC_LiteralCOD { get; set; }
    public string CDC_Match_Det_BC { get; set; }
    public string CDC_Match_Det_FDC { get; set; }
    public string CDC_Match_Prob_BC { get; set; }
    public string CDC_Match_Prob_FDC { get; set; }
    public string VRO_Resolution_Status { get; set; }
    public string VRO_Confirmation_Method_and_Additional_Notes { get; set; }


}

sealed class VROIComparer : IComparer<VROSummaryItem>
{
    public int Compare(VROSummaryItem x, VROSummaryItem y)
    {
        
        if (x == null || y == null)
        {
            return 0;
        }

        if (x.host_name == null || y.host_name == null)
        {
            return 0;
        }
        
        // "CompareTo()" method

        if(x.host_name != y.host_name)
        {
            return x.host_name.CompareTo(y.host_name);
        }
        else
        {
            return x.folder_name.CompareTo(y.folder_name);
        }
        
    }
}

public sealed class VROSummary
{

    mmria.common.couchdb.OverridableConfiguration configuration;

    mmria.common.couchdb.DBConfigurationDetail db_config;

    List<string> id_list;
    string host_prefix;


    public VROSummary
    (

        mmria.common.couchdb.OverridableConfiguration _configuration,
        string _host_prefix 
    )
    {
        configuration = _configuration;
        host_prefix = _host_prefix;

        db_config = configuration.GetDBConfig(host_prefix);

    }


    public async Task<List<VROSummaryItem>> execute
    (
        System.Threading.CancellationToken cancellationToken
    )
    {


        var field_dictionary = new Dictionary<string,string>()
        {
            { "Death_Year", "tracking/admin_info/track_year"},
            { "Jurisdiction_Abrev", "tracking/admin_info/jurisdiction"},
            { "Jurisdiction_Name", "tracking/admin_info/jurisdiction"},
            { "DC_AuxNo", "ije_dc/file_info/auxno_dc"},
            { "DC_FileNo", "ije_dc/file_info/fileno_dc"},
            { "DC_DOD_month", "ije_dc/death_info/dod_mo_dc"},
            { "DC_DOD_day", "ije_dc/death_info/dod_dy_dc"},
            { "DC_DOD_year", "ije_dc/death_info/dod_yr_dc"},
            { "DC_TimingOfDeath", "ije_dc/death_info/tod_dc"},
            { "DC_Cod33A", "ije_dc/cause_details/cod1a_dc"},
            { "DC_Cod33B", "ije_dc/cause_details/cod1b_dc"},
            { "DC_Cod33C", "ije_dc/cause_details/cod1c_dc"},
            { "DC_Cod33D", "ije_dc/cause_details/cod1d_dc"},
            { "DC_Other_Factors", "ije_dc/cause_details/othercondition_dc"},
            { "ACME_UC", "ije_dc/cause_details/acme_uc_dc"},
            { "MAN_UC", "ije_dc/cause_details/man_uc_dc"},
            { "EAC", "ije_dc/cause_details/eac_dc"},
            { "CDC_CheckBox", "vro_case_determnation/cdc_case_matching_results/pregcb_match"},
            { "CDC_ICD", "vro_case_determnation/cdc_case_matching_results/icd10_match"},
            { "CDC_LiteralCOD", "vro_case_determnation/cdc_case_matching_results/literalcod_match"},
            { "CDC_Match_Det_BC", "vro_case_determnation/cdc_case_matching_results/bc_det_match"},
            { "CDC_Match_Det_FDC", "vro_case_determnation/cdc_case_matching_results/fdc_det_match"},
            { "CDC_Match_Prob_BC", "vro_case_determnation/cdc_case_matching_results/bc_prob_match"},
            { "CDC_Match_Prob_FDC", "vro_case_determnation/cdc_case_matching_results/fdc_prob_match"},
            { "VRO_Resolution_Status", "vro_case_determnation/vro_update/vro_resolution_status"},
            { "VRO_Confirmation_Method_and_Additional_Notes", "vro_case_determnation/vro_update/vro_resolution_remarks"},
        };

        var result = new Dictionary<string, VROSummaryItem>(System.StringComparer.OrdinalIgnoreCase);
        var user_count_result = new Dictionary<string, ItemCount>(System.StringComparer.OrdinalIgnoreCase);
        var record_count_result = new Dictionary<string, ItemCount>(System.StringComparer.OrdinalIgnoreCase);
        var user_count_task_list = new List<Task>();
        var record_count_task_list = new List<Task>();
        //var jurisdiction_count_task_list = new List<Task>();

        var current_date = System.DateTime.Now;
    /*

Death_Year	app/tracking/admin_info/track_year	2022
Jurisdiction_Abrev	app/tracking/admin_info/jurisdiction	WA
Jurisdiction_Name	app/tracking/admin_info/jurisdiction	Washington
DC_AuxNo	app/ije_dc/file_info/auxno_dc	2022X
DC_FileNo	app/ije_dc/file_info/fileno_dc	223109122
DC_DOD	"app/ije_dc/death_info/dod_mo_dc 
app/ije_dc/death_info/dod_dy_dc
app/ije_dc/death_info/dod_yr_dc"	1/11/2022
DC_TimingOfDeath	app/ije_dc/death_info/tod_dc	Pregnant at death
DC_Cod33A	app/ije_dc/cause_details/cod1a_dc	SEPSIS DUE TO BILATERAL LOWER EXTREMITY CHRONIC WOUNDS
DC_Cod33B	app/ije_dc/cause_details/cod1b_dc	HYPOKALEMIA AND HYPOMAGNESEMIA DUE TO NAUSEA AND DIARRHEA
DC_Cod33C	app/ije_dc/cause_details/cod1c_dc	INSULIN-DEPENDENT DIABETES MELLITUS
DC_Cod33D	app/ije_dc/cause_details/cod1d_dc	CHRONIC PAIN SYNDROME WITH CONTINUOUS OPIATE DEPENDENCE.
DC_Other_Factors	app/ije_dc/cause_details/othercondition_dc	HISTORY OF DEEP VEIN THROMBOSIS ON LONG-TERM ANTICOAGULATION
ACME_UC	app/ije_dc/cause_details/acme_uc_dc	K529
MAN_UC	app/ije_dc/cause_details/man_uc_dc	L340
EAC	app/ije_dc/cause_details/eac_dc	11A419  21L97   31E876  32E834  41R11   42K529  51E109  52R522  53F112  61I802
CDC_CheckBox	app/vro_case_determnation/cdc_case_matching_results/pregcb_match	Yes
CDC_ICD	app/vro_case_determnation/cdc_case_matching_results/icd10_match	No
CDC_LiteralCOD	app/vro_case_determnation/cdc_case_matching_results/literalcod_match	No
CDC_Match_Det_BC	app/vro_case_determnation/cdc_case_matching_results/bc_det_match	No
CDC_Match_Det_FDC	app/vro_case_determnation/cdc_case_matching_results/fdc_det_match	No
CDC_Match_Prob_BC	app/vro_case_determnation/cdc_case_matching_results/bc_prob_match	No
CDC_Match_Prob_FDC	app/vro_case_determnation/cdc_case_matching_results/fdc_prob_match	No
VRO_Resolution_Status	app/vro_case_determnation/vro_update/vro_resolution_status	Pending VRO Investigation
VRO_Confirmation_Method_and_Additional_Notes	app/vro_case_determnation/vro_update/vro_resolution_remarks	Not pregnant per clinical nurse. Amendment is still pending.



        foreach(var config in ConfigDB.detail_list)
        {

            cancellationToken.ThrowIfCancellationRequested();

            var prefix = config.Key.ToUpper();
            string exclude_jurisdiction = "";

        

            if(prefix == "VITAL_IMPORT") continue;

            if(prefix == "NY"|| prefix == "PA")
            {
                {
                    
                        
                    if(prefix == "NY")
                    {
                        exclude_jurisdiction = "/NYC";
                        
                    }

                    if(prefix == "PA")
                    {
                        exclude_jurisdiction = "/PHILADELPHIA";
                        
                    }
                    
                    var jsi = new VROSummaryItem();
                    jsi.rpt_date = $"{current_date.Month}/{current_date.Day}/{current_date.Year}";
                    jsi.host_name = prefix;

                    result.Add(prefix, jsi);

                    var usr_count = new ItemCount();
                    usr_count.host_name = prefix;
                    
                    user_count_result.Add(prefix, usr_count);

                    var record_count = new ItemCount();
                    record_count.host_name = prefix;
                    
                    record_count_result.Add(prefix, record_count);

                    user_count_task_list.Add(GetUserCount(cancellationToken, prefix, config.Value, usr_count, jsi, exclude_jurisdiction));
                    record_count_task_list.Add(GetCaseCount(cancellationToken, prefix, config.Value, record_count, exclude_jurisdiction));
                }
                
                {
                    var key_name = prefix;
                    var folder_name = "/";
                    if(prefix == "NY")
                    {
                            exclude_jurisdiction = "/";
                            key_name = "NYC";
                            folder_name = "/NYC";
                    }

                    if(prefix == "PA")
                    {
                            exclude_jurisdiction = "/";
                            key_name = "PHILADELPHIA";
                            folder_name = "/PHILADELPHIA";
                    }

                    var jsi = new VROSummaryItem();
                    jsi.rpt_date = $"{current_date.Month}/{current_date.Day}/{current_date.Year}";
                    jsi.host_name = prefix;

                    result.Add(key_name, jsi);

                    var usr_count = new ItemCount();
                    usr_count.host_name = key_name;
                    usr_count.folder_name = folder_name;
                    user_count_result.Add(key_name, usr_count);

                    var record_count = new ItemCount();
                    record_count.host_name = key_name;
                    record_count.folder_name = folder_name;
                    record_count_result.Add(key_name, record_count);

                    user_count_task_list.Add(GetUserCount(cancellationToken, prefix, config.Value, usr_count, jsi, exclude_jurisdiction));
                    record_count_task_list.Add(GetCaseCount(cancellationToken, prefix, config.Value, record_count, exclude_jurisdiction));
                    //jurisdiction_count_task_list.Add(GetJurisdictions(cancellationToken, prefix, config.Value, jsi));
                }

            }
            else
            {

                var jsi = new VROSummaryItem();
                
                jsi.rpt_date = $"{current_date.Month}/{current_date.Day}/{current_date.Year}";
                jsi.host_name = prefix;

                result.Add(prefix, jsi);

                var usr_count = new ItemCount();
                usr_count.host_name = prefix;
                user_count_result.Add(prefix, usr_count);

                var record_count = new ItemCount();
                record_count.host_name = prefix;
                record_count_result.Add(prefix, record_count);

                user_count_task_list.Add(GetUserCount(cancellationToken, prefix, config.Value, usr_count, jsi, exclude_jurisdiction));
                record_count_task_list.Add(GetCaseCount(cancellationToken, prefix, config.Value, record_count, exclude_jurisdiction));
                //jurisdiction_count_task_list.Add(GetJurisdictions(cancellationToken, prefix, config.Value, jsi));
                
            }
        }
*/

        await Task.WhenAll(user_count_task_list);
        cancellationToken.ThrowIfCancellationRequested();
        await Task.WhenAll(record_count_task_list);
        cancellationToken.ThrowIfCancellationRequested();
        //var user_count_call_results = user_count_responses.Where(r => !string.IsNullOrWhiteSpace(r)); //filter out any null values


        //await Task.WhenAll(jurisdiction_count_task_list);
        //cancellationToken.ThrowIfCancellationRequested();
        //var jurisdiction_count_call_results = jurisdiction_count_responses.Where(r => !string.IsNullOrWhiteSpace(r)); //filter out any null values
        foreach(var kvp in user_count_result)
        {
            result[kvp.Key].num_users_unq = kvp.Value.total;
        }

        foreach(var kvp in record_count_result)
        {
            result[kvp.Key].num_recs = kvp.Value.total;
        }

        List<VROSummaryItem> view_data = new();

        foreach(var item in result)
        {
            item.Value.host_name = item.Key;
            view_data.Add(item.Value);
        }

        view_data.Sort(new VROIComparer());

        return view_data;
    }

    public async System.Threading.Tasks.Task GetUserCount
    (
        System.Threading.CancellationToken cancellationToken, 
        string p_id, 
        mmria.common.couchdb.DBConfigurationDetail p_config_detail, 
        ItemCount p_result, 
        VROSummaryItem p_SummaryItem,
        string exclude_jurisdiction
    ) 
    { 
        try
        {
            string request_string = $"{p_config_detail.url}/_users/_all_docs?include_docs=true&skip=1";

            var user_curl = new cURL("GET",null,request_string,null, p_config_detail.user_name, p_config_detail.user_value);
            string responseFromServer = await user_curl.executeAsync();

            var user_alldocs_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.user>>(responseFromServer);

            HashSet<string> user_id_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            List<mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.user>> temp_list = new List<mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.user>>();
            foreach(mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.user> uai in user_alldocs_response.rows)
            {
                cancellationToken.ThrowIfCancellationRequested();


                if(string.IsNullOrWhiteSpace(p_config_detail.prefix))
                {
                    if(uai.doc.app_prefix_list == null)
                    {
                        p_result.total +=1; 
                        user_id_set.Add(uai.doc.name);
                    }
                    else if(uai.doc.app_prefix_list.Count == 0 || uai.doc.app_prefix_list.ContainsKey("__no_prefix__"))
                    {
                        p_result.total +=1;
                        user_id_set.Add(uai.doc.name);
                    }
                }
                else if(uai.doc.app_prefix_list.ContainsKey(p_config_detail.prefix.ToLower()))
                {
                    p_result.total +=1;
                    user_id_set.Add(uai.doc.name);
                }
                else
                {

                }
            }

            await GetJurisdictions
            (
                cancellationToken,  
                p_id, 
                p_config_detail, 
                p_SummaryItem, 
                user_id_set,
                exclude_jurisdiction
            );

            p_result.total = user_id_set.Count;

        }
        catch(System.Exception)
        {
            p_result.total = -1;
        }
    }

    public async System.Threading.Tasks.Task GetCaseCount
    (
        System.Threading.CancellationToken cancellationToken, 
        string p_id, 
        mmria.common.couchdb.DBConfigurationDetail p_config_detail, 
        ItemCount p_result,
        string exclude_jurisdiction
    ) 
    { 
        try
        {
            string request_string = $"{p_config_detail.url}/{p_config_detail.prefix}mmrds/_design/sortable/_view/by_jurisdiction_id?skip=0&take=100000";


            cancellationToken.ThrowIfCancellationRequested();
            var user_curl = new cURL("GET",null,request_string,null, p_config_detail.user_name, p_config_detail.user_value);
            string responseFromServer = await user_curl.executeAsync();

            cancellationToken.ThrowIfCancellationRequested();

            var case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

            if
            (
                p_result.host_name.ToUpper() == "NY" ||
                p_result.host_name.ToUpper() == "NYC" ||
                p_result.host_name.ToUpper() == "PA" ||
                p_result.host_name.ToUpper() == "PHILADELPHIA"

            )
            {

                var count = 0;
                foreach(var cvr in case_view_response.rows)
                {

                    if(p_result.folder_name == "/")
                    {
                        if
                        (
                            !cvr.value.jurisdiction_id.StartsWith("/PHILADELPHIA", StringComparison.OrdinalIgnoreCase) &&
                            !cvr.value.jurisdiction_id.StartsWith("/NYC", StringComparison.OrdinalIgnoreCase)
                        )
                        {
                            count += 1;
                        }
                    }
                    else if(p_result.folder_name == "/NYC")
                    {
                        if(cvr.value.jurisdiction_id.StartsWith("/NYC", StringComparison.OrdinalIgnoreCase))
                        {
                            count += 1;
                        }
                    }
                    else if(p_result.folder_name == "/PHILADELPHIA")
                    {
                        if(cvr.value.jurisdiction_id.StartsWith("/PHILADELPHIA", StringComparison.OrdinalIgnoreCase))
                        {
                            count += 1;
                        }
                        
                    }
                }

                p_result.total = count;
            }
            else
            {
                p_result.total = case_view_response.total_rows;
            }


            

        }
        catch(System.Exception)
        {
            p_result.total = -1;
        }


    }

    
    public async Task GetJurisdictions
    (
        System.Threading.CancellationToken cancellationToken,  
        string p_id, 
        mmria.common.couchdb.DBConfigurationDetail p_config_detail, 
        VROSummaryItem p_result, 
        HashSet<string> p_user_id_set,
        string exclude_jurisdiction
    ) 
    {
        //string sort = "by_date_created";
        string search_key = null;
        bool descending = false;
        int skip = 0;
        int take = 20000;
        search_key = "";
        string sort_view = "by_date_created";

        try
        {
            System.Text.StringBuilder request_builder = new System.Text.StringBuilder ();
            request_builder.Append (p_config_detail.url);
            request_builder.Append ($"/{p_config_detail.prefix}jurisdiction/_design/sortable/_view/{sort_view}?");


            if (string.IsNullOrWhiteSpace (search_key))
            {
                if (skip > -1) 
                {
                    request_builder.Append ($"skip={skip}");
                } 
                else 
                {

                    request_builder.Append ("skip=0");
                }


                if (take > -1) 
                {
                    request_builder.Append ($"&limit={take}");
                }

                if (descending) 
                {
                    request_builder.Append ("&descending=true");
                }
            } 
            else 
            {
                request_builder.Append ("skip=0");

                if (descending) 
                {
                    request_builder.Append ("&descending=true");
                }
            }

            cancellationToken.ThrowIfCancellationRequested();

            var user_role_jurisdiction_curl = new cURL("GET", null, request_builder.ToString(), null, p_config_detail.user_name, p_config_detail.user_value);
            string response_from_server = await user_role_jurisdiction_curl.executeAsync ();

            cancellationToken.ThrowIfCancellationRequested();

            var case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.user_role_jurisdiction>>(response_from_server);

            HashSet<string> Jurisdictin_User_Set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var Jurisdictin_Role_Dictionary = new Dictionary<string,HashSet<string>>(StringComparer.OrdinalIgnoreCase)
            {
                {  "jurisdiction_admin", new HashSet<string>(StringComparer.OrdinalIgnoreCase)},
                { "abstractor", new HashSet<string>(StringComparer.OrdinalIgnoreCase)},
                { "data_analyst", new HashSet<string>(StringComparer.OrdinalIgnoreCase)},
                { "committee_member", new HashSet<string>(StringComparer.OrdinalIgnoreCase)},
            };



            foreach(mmria.common.model.couchdb.get_sortable_view_response_item<mmria.common.model.couchdb.user_role_jurisdiction> cvi in case_view_response.rows)
            {
                if(string.IsNullOrWhiteSpace(cvi.value.role_name)) continue;

                if(string.IsNullOrWhiteSpace(cvi.value.jurisdiction_id)) continue;

                if(string.IsNullOrWhiteSpace(cvi.value.user_id)) continue;

                if(cvi.value.is_active.HasValue && cvi.value.is_active.Value == false) continue;


                var user_id = cvi.value.user_id;

                if(!p_user_id_set.Contains(user_id)) continue;

                if(!string.IsNullOrWhiteSpace(exclude_jurisdiction))
                {
                    if
                    (
                        exclude_jurisdiction ==
                        cvi.value.jurisdiction_id.ToUpper()
                    )
                    {
                        continue;
                    }
                }

                if(Jurisdictin_Role_Dictionary.ContainsKey(cvi.value.role_name))
                {
                    Jurisdictin_Role_Dictionary[cvi.value.role_name].Add(cvi.value.user_id);
                    Jurisdictin_User_Set.Add(cvi.value.user_id);
                }
            }

            p_result.num_users_ja = Jurisdictin_Role_Dictionary["jurisdiction_admin"].Count;
            p_result.num_users_abs = Jurisdictin_Role_Dictionary["abstractor"].Count;
            p_result.num_user_anl = Jurisdictin_Role_Dictionary["data_analyst"].Count;
            p_result.num_user_cm = Jurisdictin_Role_Dictionary["committee_member"].Count;

            p_user_id_set.RemoveWhere( x=> !Jurisdictin_User_Set.Contains(x));
            
        }
        catch(System.Exception)
        {
            //System.Console.WriteLine (ex);
            p_result.num_users_ja = -1;
            p_result.num_users_abs = -1;
            p_result.num_user_anl = -1;
            p_result.num_user_cm = -1;

        } 
    }


    HashSet<string> GetIdList ()
	{

		var result = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

		try
		{
			string URL = $"{db_config.url}/{db_config.prefix}mmrds/_all_docs";
			var document_curl = new mmria.getset.cURL ("GET", null, URL, null, db_config.user_name, db_config.user_value);
			var curl_result = document_curl.execute();

			var all_cases = System.Text.Json.JsonSerializer.Deserialize<mmria.common.model.couchdb.alldocs_response<System.Dynamic.ExpandoObject>> (curl_result);
			var all_cases_rows = all_cases.rows;

			foreach (var row in all_cases_rows) 
			{
				result.Add(row.id);
			}
		}
		catch(Exception)
		{

		}
		return result;
	}

	


	(int SuccessCount, int ErrorCount) GetDocumentList ()
	{
		int SuccessCount = 0;
		int ErrorCount = 0;

		Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
		settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;

		foreach(var id in id_list)
		{
			try
			{
				string URL = $"{db_config.url}/{db_config.prefix}mmrds/{id}";
				var document_curl = new mmria.getset.cURL ("GET", null, URL, null, db_config.user_name, db_config.user_value);
				var curl_result = document_curl.execute();

				dynamic case_row = System.Text.Json.JsonSerializer.Deserialize<System.Dynamic.ExpandoObject> (curl_result);

				IDictionary<string, object> case_doc = case_row as IDictionary<string, object>;
				case_doc.Remove("_rev");

				var case_json = System.Text.Json.JsonSerializer.Serialize(case_doc);
                /*

				var backup_file_path = this.backup_file_path;

				if(this.database_url.EndsWith("/metadata"))
				{
					var new_id = id.Replace(":","-").Replace(".","-");
					var file_path = System.IO.Path.Combine(backup_file_path, new_id);
					System.IO.Directory.CreateDirectory($"{file_path}/_attachments");

					file_path = System.IO.Path.Combine(file_path, $"{id.Replace(":","-").Replace(".","-")}.json");
					if (!System.IO.File.Exists (file_path)) 
					{
						System.IO.File.WriteAllText (file_path, case_json);
					}
				}
				else
				{

					var file_path = System.IO.Path.Combine(backup_file_path, $"{id}.json");
					if (!System.IO.File.Exists (file_path)) 
					{
						System.IO.File.WriteAllText(file_path, case_json);
					}
				}

				if(this.database_url.EndsWith("/metadata"))
				{
					if(case_doc.ContainsKey("_attachments"))
					{
						var attachment_set = case_doc["_attachments"] as IDictionary<string,object>;
						if(attachment_set != null)
						{
							var new_id = id.Replace(":","-").Replace(".","-");
							var attachment_path = System.IO.Path.Combine(backup_file_path, new_id, "_attachments");
							

							foreach(var kvp in attachment_set)
							{
								var attachment_url = $"{URL}/{kvp.Key}";
								var attachment_curl = new mmria.getset.cURL ("GET", null, URL, null, this.user_name, this.password);
								var attachment_doc_json = attachment_curl.execute();

								var attachment_file_path = System.IO.Path.Combine(attachment_path, kvp.Key);
								if (!System.IO.File.Exists (attachment_file_path)) 
								{
									System.IO.File.WriteAllText(attachment_file_path, attachment_doc_json);
								}
							}
						}
					}
				}
                */

				SuccessCount+= 1;
			}
			catch(Exception)
			{
				ErrorCount += 1;
			}


			
		}

		return (SuccessCount, ErrorCount);
	}
}
