using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;


namespace migrate.set;

public class CVS_Migration
{

	public string host_db_url;
	public string db_name;
	public string config_timer_user_name;
	public string config_timer_value;

	public bool is_report_only_mode;

	mmria.common.couchdb.ConfigurationSet ConfigDB;

	public System.Text.StringBuilder output_builder;
	private Dictionary<string,mmria.common.metadata.value_node[]> lookup;

	List<Metadata_Node> all_list_set;

	List<Metadata_Node> single_form_value_set;
	List<Metadata_Node> single_form_multi_value_set;
	List<Metadata_Node> single_form_grid_value_set;
	List<Metadata_Node> single_form_grid_multi_value_list_set;
	List<Metadata_Node> multiform_value_set;
	List<Metadata_Node> multiform_multi_value_set;
	List<Metadata_Node> multiform_grid_value_set;

	List<Metadata_Node> multiform_grid_multi_value_set;

	public Dictionary<string, HashSet<string>> summary_value_dictionary = new Dictionary<string, HashSet<string>>(StringComparer.OrdinalIgnoreCase);

	public bool is_data_correction = false;


	public CVS_Migration
	(
		string p_host_db_url, 
		string p_db_name, 
		string p_config_timer_user_name, 
		string p_config_timer_value,
		System.Text.StringBuilder p_output_builder,
		Dictionary<string, HashSet<string>> p_summary_value_dictionary,
		bool p_is_report_only_mode,
		mmria.common.couchdb.ConfigurationSet p_configuration_set
	) 
	{

		host_db_url = p_host_db_url;
		db_name = p_db_name;
		config_timer_user_name = p_config_timer_user_name;
		config_timer_value = p_config_timer_value;
		output_builder = p_output_builder;
		summary_value_dictionary = p_summary_value_dictionary;
		is_report_only_mode = p_is_report_only_mode;
		ConfigDB = p_configuration_set;
	}


	public async Task execute()
	{
		this.output_builder.AppendLine($"CVS_Migration Data Migration started at: {DateTime.Now.ToString("o")}");
		DateTime begin_time = System.DateTime.Now;
		
		this.output_builder.AppendLine($"CVS_Migration started at: {begin_time.ToString("o")}");
		
		var gs = new C_Get_Set_Value(this.output_builder);

		

		try
		{

                string ping_result = null;
                int ping_count = 0;
                
                while
                (
                    (
                        ping_result == null ||
                        ping_result != "Server is up!"
                    ) && 
                    ping_count < 5
                )
                {
                    ping_result = await PingCVSServer();

                    ping_count +=1;

                }


			string MetadataVersion = "22.06.08";

			string metadata_url = $"{host_db_url}/metadata/version_specification-{MetadataVersion}/metadata";
			
			cURL metadata_curl = new cURL("GET", null, metadata_url, null, null, null);
			mmria.common.metadata.app metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.app>(await metadata_curl.executeAsync());
		
			this.lookup = get_look_up(metadata);

			all_list_set = get_metadata_node_by_type(metadata, "list");

			single_form_value_set = all_list_set.Where(o=> o.is_multiform == false && o.is_grid == false && o.Node.is_multiselect == null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();
			single_form_multi_value_set = all_list_set.Where(o=> o.is_multiform == false && o.is_grid == false && o.Node.is_multiselect != null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();

			single_form_grid_value_set = all_list_set.Where(o=> o.is_multiform == false && o.is_grid == true && o.Node.is_multiselect == null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();
			single_form_grid_multi_value_list_set = all_list_set.Where(o=> o.is_multiform == false && o.is_grid == true && o.Node.is_multiselect != null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();

			multiform_value_set = all_list_set.Where(o=> o.is_multiform == true && o.is_grid == false && o.Node.is_multiselect == null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();
			multiform_multi_value_set = all_list_set.Where(o=> o.is_multiform == true && o.is_grid == false && o.Node.is_multiselect != null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();

			multiform_grid_value_set = all_list_set.Where(o=> o.is_multiform == true && o.is_grid == true && o.Node.is_multiselect == null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();
			multiform_grid_multi_value_set = all_list_set.Where(o=> o.is_multiform == true && o.is_grid == true && o.Node.is_multiselect != null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();


			var total_count = single_form_value_set.Count + single_form_grid_value_set.Count + multiform_value_set.Count + multiform_grid_value_set.Count + single_form_multi_value_set.Count + single_form_grid_multi_value_list_set.Count + multiform_multi_value_set.Count + multiform_grid_multi_value_set.Count;
			System.Console.WriteLine($"all_list_set.Count: {all_list_set.Count} total_count: {total_count}");
			System.Console.WriteLine($"is count the same: {all_list_set.Count == single_form_value_set.Count + single_form_grid_value_set.Count + multiform_value_set.Count + multiform_grid_value_set.Count + single_form_multi_value_set.Count + single_form_grid_multi_value_list_set.Count + multiform_multi_value_set.Count + multiform_grid_multi_value_set.Count}");


			var ExistingRecordIds = await GetExistingRecordIds();

			string url = $"{host_db_url}/{db_name}/_all_docs?include_docs=true";
			var case_curl = new cURL("GET", null, url, null, config_timer_user_name, config_timer_value);
			string responseFromServer = await case_curl.executeAsync();
			
			var case_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<System.Dynamic.ExpandoObject>>(responseFromServer);
			
			foreach(var case_item in case_response.rows)
			{
				var case_has_changed = false;
				var case_change_count = 0;

				var doc = case_item.doc;
				
				if(doc != null)
				{

					C_Get_Set_Value.get_value_result value_result = gs.get_value(doc, "_id");
					var mmria_id = value_result.result;
					if(mmria_id.IndexOf("_design") > -1)
					{
						continue;
					}

					string get_value(string p_path)
					{
						var result = String.Empty;

						value_result = gs.get_value(doc, p_path);
						if
						(
							! value_result.is_error &&
							value_result.result != null
						)
						{
							result = value_result.result.ToString();
						}

						return result;
					}

					List<(int, string)> get_grid_value(string p_path)
					{
						var result = new List<(int, string)>();

						var value_result = gs.get_grid_value(doc, p_path);
						if
						(
							! value_result.is_error &&
							value_result.result != null
						)
						{
							foreach(var (index, value) in value_result.result )
							{
								if(value != null)
								{
									result.Add((index, value.ToString()));
								}
								else
								{
									result.Add((index, null));
								}
							}
						}

						return result;
					}


					
					void set_grid_value(string p_path, dynamic p_value_list)
					{
						case_has_changed = case_has_changed &&  gs.set_grid_value(doc, p_path, new List<(int, dynamic)>() { ( 0, p_value_list) });
					}


					var state_county_fips = get_value("death_certificate/place_of_last_residence/state_county_fips");
					var  census_tract_fips = get_value("death_certificate/place_of_last_residence/census_tract_fips");
					var  year = get_value("home_record/date_of_death/year");

					if
					(
						!string.IsNullOrEmpty(state_county_fips) &&
						!string.IsNullOrEmpty(census_tract_fips) &&
						!string.IsNullOrEmpty(year)
					)
					{
						var t_geoid = $"{state_county_fips}{census_tract_fips.Replace(".","").PadRight(6, '0')}";


						// check if record already populated
						var new_case_dictionary = doc as IDictionary<string, object>;
						if(!new_case_dictionary.ContainsKey("cvs"))
						{

							var cvs_form_metadata = new mmria.common.metadata.node();

							foreach(var child in metadata.children)
							{
								if(child.name.Equals("cvs", StringComparison.OrdinalIgnoreCase))
								{
									cvs_form_metadata = child;
								}
							}

							var new_cvs_form = new Dictionary<string,object>(StringComparer.OrdinalIgnoreCase);
							mmria.services.vitalsimport.default_case.create(cvs_form_metadata, new_cvs_form, true);
							var list = new_cvs_form["cvs"] as IDictionary<string,object>;

							if(new_case_dictionary != null)
							{
								new_case_dictionary["cvs"] = list;
							}

						}

						///cvs/cvs_grid/cvs_api_request_result_message

						var api_result_message = get_grid_value("cvs/cvs_grid/cvs_api_request_result_message");

						if(api_result_message.Count > 0)
						{
							var api_result_text = api_result_message[0].Item2;
							if(api_result_text.IndexOf("success") > -1)
							{
								break;
							}
						}

						if(case_change_count == 0)
						{
							case_change_count += 1;
							case_has_changed = true;
						}
						

						var (cvs_response_status, tract_county_result) = await GetCVSData
						(
							state_county_fips,
							t_geoid,
							year
						);

						set_grid_value("cvs/cvs_grid/cvs_api_request_url", ConfigDB.name_value["cvs_api_url"]);
						set_grid_value("cvs/cvs_grid/cvs_api_request_date_time", DateTime.Now.ToString("o"));
						set_grid_value("cvs/cvs_grid/cvs_api_request_c_geoid", state_county_fips);
						set_grid_value("cvs/cvs_grid/cvs_api_request_t_geoid", t_geoid);
						set_grid_value("cvs/cvs_grid/cvs_api_request_year", year);
						set_grid_value("cvs/cvs_grid/cvs_api_request_result_message", cvs_response_status);



						if(cvs_response_status == "success")
						{
							set_grid_value("cvs/cvs_grid/cvs_mdrate_county", tract_county_result.county.MDrate);
							set_grid_value("cvs/cvs_grid/cvs_pctnoins_fem_county", tract_county_result.county.pctNOIns_Fem);
							set_grid_value("cvs/cvs_grid/cvs_pctnoins_fem_tract", tract_county_result.tract.pctNOIns_Fem);
							set_grid_value("cvs/cvs_grid/cvs_pctnovehicle_county", tract_county_result.county.pctNoVehicle);
							set_grid_value("cvs/cvs_grid/cvs_pctnovehicle_tract", tract_county_result.tract.pctNoVehicle);
							set_grid_value("cvs/cvs_grid/cvs_pctmove_county", tract_county_result.county.pctMOVE);
							set_grid_value("cvs/cvs_grid/cvs_pctmove_tract", tract_county_result.tract.pctMOVE);
							set_grid_value("cvs/cvs_grid/cvs_pctsphh_county", tract_county_result.county.pctSPHH);
							set_grid_value("cvs/cvs_grid/cvs_pctsphh_tract", tract_county_result.tract.pctSPHH);
							set_grid_value("cvs/cvs_grid/cvs_pctovercrowdhh_county", tract_county_result.county.pctOVERCROWDHH);
							set_grid_value("cvs/cvs_grid/cvs_pctovercrowdhh_tract", tract_county_result.tract.pctOVERCROWDHH);
							set_grid_value("cvs/cvs_grid/cvs_pctowner_occ_county", tract_county_result.county.pctOWNER_OCC);
							set_grid_value("cvs/cvs_grid/cvs_pctowner_occ_tract", tract_county_result.tract.pctOWNER_OCC);
							set_grid_value("cvs/cvs_grid/cvs_pct_less_well_county", tract_county_result.county.pct_less_well);
							set_grid_value("cvs/cvs_grid/cvs_pct_less_well_tract", tract_county_result.tract.pct_less_well);
							set_grid_value("cvs/cvs_grid/cvs_ndi_raw_county", tract_county_result.county.NDI_raw);
							set_grid_value("cvs/cvs_grid/cvs_ndi_raw_tract", tract_county_result.tract.NDI_raw);
							set_grid_value("cvs/cvs_grid/cvs_pctpov_county", tract_county_result.county.pctPOV);
							set_grid_value("cvs/cvs_grid/cvs_pctpov_tract", tract_county_result.tract.pctPOV);
							set_grid_value("cvs/cvs_grid/cvs_ice_income_all_county", tract_county_result.county.ICE_INCOME_all);
							set_grid_value("cvs/cvs_grid/cvs_ice_income_all_tract", tract_county_result.tract.ICE_INCOME_all);
							set_grid_value("cvs/cvs_grid/cvs_medhhinc_county", tract_county_result.county.MEDHHINC);
							set_grid_value("cvs/cvs_grid/cvs_medhhinc_tract", tract_county_result.tract.MEDHHINC);
							set_grid_value("cvs/cvs_grid/cvs_pctobese_county", tract_county_result.county.pctOBESE);
							set_grid_value("cvs/cvs_grid/cvs_fi_county", tract_county_result.county.FI);
							set_grid_value("cvs/cvs_grid/cvs_cnmrate_county", tract_county_result.county.CNMrate);
							set_grid_value("cvs/cvs_grid/cvs_obgynrate_county", tract_county_result.county.OBGYNrate);
							set_grid_value("cvs/cvs_grid/cvs_rtteenbirth_county", tract_county_result.county.rtTEENBIRTH);
							set_grid_value("cvs/cvs_grid/cvs_rtstd_county", tract_county_result.county.rtSTD);
							set_grid_value("cvs/cvs_grid/cvs_rtmhpract_county", tract_county_result.county.rtMHPRACT);
							set_grid_value("cvs/cvs_grid/cvs_rtdrugodmortality_county", tract_county_result.county.rtDRUGODMORTALITY);
							set_grid_value("cvs/cvs_grid/cvs_rtopioidprescript_county", tract_county_result.county.rtOPIOIDPRESCRIPT);
							set_grid_value("cvs/cvs_grid/cvs_soccap_county", tract_county_result.county.SocCap);
							set_grid_value("cvs/cvs_grid/cvs_rtsocassoc_county", tract_county_result.county.rtSocASSOC);
							set_grid_value("cvs/cvs_grid/cvs_pcthouse_distress_county", tract_county_result.county.pctHOUSE_DISTRESS);
							set_grid_value("cvs/cvs_grid/cvs_rtviolentcr_icpsr_county", tract_county_result.county.rtVIOLENTCR_ICPSR);
							set_grid_value("cvs/cvs_grid/cvs_isolation_county", tract_county_result.county.isolation);

							var output_text = $"item record_id: {mmria_id} path: cvs/cvs_grid success";
							this.output_builder.AppendLine(output_text);
							Console.WriteLine(output_text);

						}
						else
						{
							set_grid_value("cvs/cvs_grid/cvs_mdrate_county", "");
							set_grid_value("cvs/cvs_grid/cvs_pctnoins_fem_county", "");
							set_grid_value("cvs/cvs_grid/cvs_pctnoins_fem_tract", "");
							set_grid_value("cvs/cvs_grid/cvs_pctnovehicle_county", "");
							set_grid_value("cvs/cvs_grid/cvs_pctnovehicle_tract", "");
							set_grid_value("cvs/cvs_grid/cvs_pctmove_county", "");
							set_grid_value("cvs/cvs_grid/cvs_pctmove_tract", "");
							set_grid_value("cvs/cvs_grid/cvs_pctsphh_county", "");
							set_grid_value("cvs/cvs_grid/cvs_pctsphh_tract", "");
							set_grid_value("cvs/cvs_grid/cvs_pctovercrowdhh_county", "");
							set_grid_value("cvs/cvs_grid/cvs_pctovercrowdhh_tract", "");
							set_grid_value("cvs/cvs_grid/cvs_pctowner_occ_county", "");
							set_grid_value("cvs/cvs_grid/cvs_pctowner_occ_tract", "");
							set_grid_value("cvs/cvs_grid/cvs_pct_less_well_county", "");
							set_grid_value("cvs/cvs_grid/cvs_pct_less_well_tract", "");
							set_grid_value("cvs/cvs_grid/cvs_ndi_raw_county", "");
							set_grid_value("cvs/cvs_grid/cvs_ndi_raw_tract", "");
							set_grid_value("cvs/cvs_grid/cvs_pctpov_county", "");
							set_grid_value("cvs/cvs_grid/cvs_pctpov_tract", "");
							set_grid_value("cvs/cvs_grid/cvs_ice_income_all_county", "");
							set_grid_value("cvs/cvs_grid/cvs_ice_income_all_tract", "");
							set_grid_value("cvs/cvs_grid/cvs_medhhinc_county", "");
							set_grid_value("cvs/cvs_grid/cvs_medhhinc_tract", "");
							set_grid_value("cvs/cvs_grid/cvs_pctobese_county", "");
							set_grid_value("cvs/cvs_grid/cvs_fi_county", "");
							set_grid_value("cvs/cvs_grid/cvs_cnmrate_county", "");
							set_grid_value("cvs/cvs_grid/cvs_obgynrate_county", "");
							set_grid_value("cvs/cvs_grid/cvs_rtteenbirth_county", "");
							set_grid_value("cvs/cvs_grid/cvs_rtstd_county", "");
							set_grid_value("cvs/cvs_grid/cvs_rtmhpract_county", "");
							set_grid_value("cvs/cvs_grid/cvs_rtdrugodmortality_county", "");
							set_grid_value("cvs/cvs_grid/cvs_rtopioidprescript_county", "");
							set_grid_value("cvs/cvs_grid/cvs_soccap_county", "");
							set_grid_value("cvs/cvs_grid/cvs_rtsocassoc_county", "");
							set_grid_value("cvs/cvs_grid/cvs_pcthouse_distress_county", "");
							set_grid_value("cvs/cvs_grid/cvs_rtviolentcr_icpsr_county", "");
							set_grid_value("cvs/cvs_grid/cvs_isolation_county", "");

							var response_status = "";
							if(cvs_response_status != null)
							{
								if(cvs_response_status.Length > 40)
								{
									response_status = cvs_response_status.Replace("\n"," ").Substring(0, 40);
								}
								else
								{
									response_status = cvs_response_status;
								}
							}

							var output_text = $"item record_id: {mmria_id} path: cvs/cvs_grid fail: {response_status}";
							this.output_builder.AppendLine(output_text);
							Console.WriteLine(output_text);

						}

					}


/*


g_data.death_certificate.place_of_last_residence.state_county_fips
g_data.death_certificate.place_of_last_residence.census_tract_fips

            const t_geoid = state_county_fips + g_data.death_certificate.place_of_last_residence.census_tract_fips.replace(".","").padStart(6, "0");
            //$mmria.get_cvs_api_data_info
            //(
                g_data.death_certificate.place_of_last_residence.state_county_fips,  //c_geoid, // = "13089",
                t_geoid, // = "13089021204",
                g_data.home_record.date_of_death.year, //year = "2012"


					var new_grid_item = new mmria.common.cvs.CVS_Grid_Item()
					{

						//cvs_api_request_data._ =("_id", g_data._id),
						cvs_api_request_url = base_url,
						cvs_api_request_date_time =("cvs_api_request_date_time", new Date()),
						cvs_api_request_c_geoid =("cvs_api_request_c_geoid", c_geoid),
						cvs_api_request_t_geoid =("cvs_api_request_t_geoid", t_geoid),
						cvs_api_request_year =("cvs_api_request_year", year),
					}
*/


/*

cvs_api_request_url
cvs_api_request_date_time
cvs_api_request_c_geoid
cvs_api_request_t_geoid
cvs_api_request_year
cvs_api_request_result_message

*/
				if(!is_report_only_mode && case_has_changed)
				{
					var save_result = await new SaveRecord(this.host_db_url, this.db_name, this.config_timer_user_name, this.config_timer_value, this.output_builder).save_case(doc as IDictionary<string, object>,"CVS_Migration", true);
				}

			}

		
		}
	}
	catch(Exception ex)
	{
		Console.WriteLine(ex);
	}

	Console.WriteLine($"CVS_Migration Finished {DateTime.Now}");
}


	public class Metadata_Node
	{
		public Metadata_Node(){}
		public bool is_multiform { get; set; }
		public bool is_grid { get; set; }

		public string path {get;set;}

		public string sass_export_name {get;set;}
		public mmria.common.metadata.node Node { get; set; }

		public Dictionary<string,string> display_to_value { get; set; }
		public Dictionary<string,string> value_to_display { get; set; }
	}
	

	private List<Metadata_Node> get_metadata_node_by_type(mmria.common.metadata.app p_metadata, string p_type)
	{
		var result = new List<Metadata_Node>();
		foreach(var node in p_metadata.children)
		{
			var current_type = node.type.ToLowerInvariant();
			if(current_type == p_type)
			{
				result.Add(new Metadata_Node()
				{
					is_multiform = false,
					is_grid = false,
					path = node.name,
					Node = node,
					sass_export_name = node.sass_export_name
				});
			}
			else if(current_type == "form")
			{
				if
				(
					node.cardinality == "+" ||
					node.cardinality == "*"
				)
				{
					get_metadata_node_by_type(ref result, node, p_type, true, false, node.name);
				}
				else
				{
					get_metadata_node_by_type(ref result, node, p_type, false, false, node.name);
				}
			}
		}
		return result;
	}


	private void get_metadata_node_by_type(ref List<Metadata_Node> p_result, mmria.common.metadata.node p_node, string p_type, bool p_is_multiform, bool p_is_grid, string p_path)
	{
		var current_type = p_node.type.ToLowerInvariant();
		if(current_type == p_type)
		{
			var value_to_display = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
			var display_to_value = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

			if
			(
				current_type == "list"
			)
			{

				if(!string.IsNullOrWhiteSpace(p_node.path_reference))
				{
					//var key = "lookup/" + p_node.name;
					var key = p_node.path_reference;
					if(this.lookup.ContainsKey(key))
					{
						var values = this.lookup[key];

						p_node.values = values;
					}
				}

				foreach(var value_item in p_node.values)
				{
					var value = value_item.value;
					var display = value_item.display;

					if(!value_to_display.ContainsKey(value))
					{
						value_to_display.Add(value, display);
					}

					if(!display_to_value.ContainsKey(display))
					{
						display_to_value.Add(display, value);
					}
				}
			}

			p_result.Add(new Metadata_Node()
			{
				is_multiform = p_is_multiform,
				is_grid = p_is_grid,
				path = p_path,
				Node = p_node,
				value_to_display = value_to_display,
				display_to_value = display_to_value,
				sass_export_name = p_node.sass_export_name
			});
		}
		else if(p_node.children != null)
		{
			foreach(var node in p_node.children)
			{
				if(current_type == "grid")
				{
					get_metadata_node_by_type(ref p_result, node, p_type, p_is_multiform, true, p_path + "/" + node.name);
				}
				else
				{
					get_metadata_node_by_type(ref p_result, node, p_type, p_is_multiform, p_is_grid, p_path + "/" + node.name);
				}
			}
		}
	}

	private mmria.common.metadata.node get_metadata_node(mmria.common.metadata.app p_metadata, string p_path)
	{
		mmria.common.metadata.node result = null;

		mmria.common.metadata.node current = null;
		
		string[] path = p_path.Split("/");

		for(int i = 0; i < path.Length; i++)
		{
			string current_name = path[i];
			if(i == 0)
			{
				foreach(var child in p_metadata.children)
				{
					if(child.name.Equals(current_name, StringComparison.OrdinalIgnoreCase))
					{
						current = child;
						break;
					}
				}
			}

			else
			{

				if(current.children != null)
				{
					foreach(var child2 in current.children)
					{
						if(child2.name.Equals(current_name, StringComparison.OrdinalIgnoreCase))
						{
							current = child2;
							break;
						}
					}	
				}
				else
				{
					return result;
				}

				if(i == path.Length -1)
				{
					result = current;
				}
			}

		}

		return result;
	}
	private Dictionary<string,mmria.common.metadata.value_node[]> get_look_up(mmria.common.metadata.app p_metadata)
	{
		var result = new Dictionary<string,mmria.common.metadata.value_node[]>(StringComparer.OrdinalIgnoreCase);

		foreach(var node in p_metadata.lookup)
		{
			result.Add("lookup/" + node.name, node.values);
		}
		return result;
	}	


	public async Task<HashSet<string>> GetExistingRecordIds()
	{
		var result = new HashSet<string>(StringComparer.OrdinalIgnoreCase);


		try
		{        
			string request_string = $"{host_db_url}/{db_name}/_design/sortable/_view/by_date_created?skip=0&take=25000";

			var case_view_curl = new cURL("GET", null, request_string, null, config_timer_user_name, config_timer_value);
			string responseFromServer = await case_view_curl.executeAsync();

			mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

			foreach(mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
			{
				result.Add(cvi.value.record_id);

			}
		}
		catch(Exception ex) 
		{
			Console.WriteLine (ex);
		}

		return result;
	} 

	private int GenerateRandomFourDigits()
	{
		int _min = 1000;
		int _max = 9999;
		Random _rdm = new Random();
		return _rdm.Next(_min, _max);
	}


	public async Task<mmria.common.texas_am.geocode_response> Get
        (
			string street_address,
			string city,
			string state,
			string zip
        ) 
		{ 

                var result = new mmria.common.texas_am.geocode_response();

                string geocode_api_key = ConfigDB.name_value["geocode_api_key"];
                //string geocode_api_url = configuration["mmria_settings:geocode_api_url"];

                string request_string = string.Format ($"https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress={street_address}&city={city}&state={state}&zip={zip}&apikey={geocode_api_key}&format=json&allowTies=false&tieBreakingStrategy=flipACoin&includeHeader=true&census=true&censusYear=2000|2010&notStore=false&version=4.01");

                var curl = new cURL("GET", null, request_string, null);
                try
                {
                    string responseFromServer = await curl.executeAsync();

                    result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.texas_am.geocode_response>(responseFromServer);
                
                }
                catch(Exception ex)
                {
                    // do nothing for now
                }

                return result;
		}


	public async Task<string> PingCVSServer() 
    { 
        var response_string = "";

        var base_url = ConfigDB.name_value["cvs_api_url"];

        try
        {
			var sever_status_body = new mmria.common.cvs.server_status_post_body()
			{
				id = ConfigDB.name_value["cvs_api_id"],
				secret = ConfigDB.name_value["cvs_api_key"],

			};

			var body_text = JsonSerializer.Serialize(sever_status_body);
			var server_statu_curl = new cURL("POST", null, base_url, body_text);

			response_string = await server_statu_curl.executeAsync();
			System.Console.WriteLine(response_string);

    
        }
        catch(System.Net.WebException ex)
        {
            System.Console.WriteLine($"cvsAPIController  POST\n{ex}");
            
            /*return Problem(
                type: "/docs/errors/forbidden",
                title: "CVS API Error",
                detail: ex.Message,
                statusCode: (int) ex.Status,
                instance: HttpContext.Request.Path
            );*/
        }


        return response_string.Trim('"');
    }	

	public async Task<(string, mmria.common.cvs.tract_county_result)> GetCVSData
    (
		string c_geoid,
		string t_geoid,
		string year
    ) 
    { 

        mmria.common.cvs.tract_county_result result = null;
        var response_string = string.Empty;

        var base_url = ConfigDB.name_value["cvs_api_url"];

        try
        {
            
			var get_all_data_body = new mmria.common.cvs.get_all_data_post_body()
			{
				id = ConfigDB.name_value["cvs_api_id"],
				secret = ConfigDB.name_value["cvs_api_key"],
				payload = new()
				{
					
					c_geoid = c_geoid,
					t_geoid = t_geoid,
					year = year
				}
			};

			var body_text = JsonSerializer.Serialize(get_all_data_body);
			var get_all_data_curl = new cURL("POST", null, base_url, body_text);

			response_string = await get_all_data_curl.executeAsync();
			System.Console.WriteLine(response_string);

			result = JsonSerializer.Deserialize<mmria.common.cvs.tract_county_result>(response_string);

		

             
        }
        catch(System.Net.WebException ex)
        {
            System.Console.WriteLine($"CVS MIGRATION GetCVSDATA\n{ex}");
            
            /*return Problem(
                type: "/docs/errors/forbidden",
                title: "CVS API Error",
                detail: ex.Message,
                statusCode: (int) ex.Status,
                instance: HttpContext.Request.Path
            );*/

			return ($"{response_string}  {ex.Message}", null);
        }

        return ("success", result);
    }
	/*

 		async Task get_cvs_api_data_info
        (
            string c_geoid,
            string t_geoid,
            string year
        )
        {
            var base_url = `${location.protocol}//${location.host}/api/cvsAPI`



            g_cvs_api_request_data.set("_id", g_data._id);
            g_cvs_api_request_data.set("cvs_api_request_url", base_url);
            g_cvs_api_request_data.set("cvs_api_request_date_time", new Date());
            g_cvs_api_request_data.set("cvs_api_request_c_geoid", c_geoid);
            g_cvs_api_request_data.set("cvs_api_request_t_geoid", t_geoid);
            g_cvs_api_request_data.set("cvs_api_request_year", year);




            try
            {
                await $.ajax(
                    {
                        url: base_url,
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        success: p_success_call_back,
                        error: p_error_call_back,
                        data: JSON.stringify({
                            action: "data",                        
                            c_geoid: c_geoid,
                            t_geoid: t_geoid,
                            year: year

                        })
                    }
                );
            }
            catch(ex)
            {
                // do nothing 
            }
        }



	void callback_cvs_data_success (p_result)
        {

            //const data = eval("(" + p_result + ")"); 
            console.log(p_result);
            //console.log(data);
            console.log(p_result);
            if
            (
                g_cvs_api_request_data.has("_id") &&
                g_cvs_api_request_data.get("_id") == g_data._id
            )
            {
                if(p_result.tract == null)
                {
                    g_cvs_api_request_data.set("cvs_api_request_result_message", p_result); 
                    g_cvs_api_request_data.set
                    (
                        "cvs_api_request_result_message",
                        `status code: ${p_result.status} message: ${p_result.message}`
                    );
                    
                    
                    const new_grid_item = {

                        cvs_api_request_url: g_cvs_api_request_data.get("cvs_api_request_url"),
                        cvs_api_request_date_time: g_cvs_api_request_data.get("cvs_api_request_date_time"),
                        cvs_api_request_c_geoid: g_cvs_api_request_data.get("cvs_api_request_c_geoid"),
                        cvs_api_request_t_geoid: g_cvs_api_request_data.get("cvs_api_request_t_geoid"),
                        cvs_api_request_year: g_cvs_api_request_data.get("cvs_api_request_year"),
                        cvs_api_request_result_message: g_cvs_api_request_data.get("cvs_api_request_result_message"),
                        cvs_mdrate_county: "",
                        cvs_pctnoins_fem_county: "",
                        cvs_pctnoins_fem_tract: "",
                        cvs_pctnovehicle_county: "",                                   
                        cvs_pctnovehicle_tract: "",
                        cvs_pctmove_county: "",
                        cvs_pctmove_tract: "",
                        cvs_pctsphh_county: "",
                        cvs_pctsphh_tract: "",
                        cvs_pctovercrowdhh_county: "",
                        cvs_pctovercrowdhh_tract: "",
                        cvs_pctowner_occ_county: "",
                        cvs_pctowner_occ_tract: "",
                        cvs_pct_less_well_county: "",
                        cvs_pct_less_well_tract: "",
                        cvs_ndi_raw_county: "",
                        cvs_ndi_raw_tract: "",
                        cvs_pctpov_county: "",
                        cvs_pctpov_tract: "",
                        cvs_ice_income_all_county: "",
                        cvs_ice_income_all_tract: "",
                        cvs_medhhinc_county: "",
                        cvs_medhhinc_tract: "",
                        cvs_pctobese_county: "",
                        cvs_fi_county: "",
                        cvs_cnmrate_county: "",
                        cvs_obgynrate_county: "",
                        cvs_rtteenbirth_county: "",
                        cvs_rtstd_county: "",
                        cvs_rtmhpract_county: "",
                        cvs_rtdrugodmortality_county: "",
                        cvs_rtopioidprescript_county: "",
                        cvs_soccap_county: "",
                        cvs_rtsocassoc_county: "",
                        cvs_pcthouse_distress_county: "",
                        cvs_rtviolentcr_icpsr_county: "",
                        cvs_isolation_county: ""
                        
                        };
    
                        g_data.cvs.cvs_grid = [ new_grid_item ];
                }
                else
                {
                    g_cvs_api_request_data.set("cvs_api_request_result_message", "Data request successful."); 

                    const new_grid_item = {

                    cvs_api_request_url: g_cvs_api_request_data.get("cvs_api_request_url"),
                    cvs_api_request_date_time: g_cvs_api_request_data.get("cvs_api_request_date_time"),
                    cvs_api_request_c_geoid: g_cvs_api_request_data.get("cvs_api_request_c_geoid"),
                    cvs_api_request_t_geoid: g_cvs_api_request_data.get("cvs_api_request_t_geoid"),
                    cvs_api_request_year: g_cvs_api_request_data.get("cvs_api_request_year"),
                    cvs_api_request_result_message: g_cvs_api_request_data.get("cvs_api_request_result_message"),
                    cvs_mdrate_county: p_result.county.mDrate,
                    cvs_pctnoins_fem_county: p_result.county.pctNOIns_Fem,
                    cvs_pctnoins_fem_tract: p_result.tract.pctNOIns_Fem,
                    cvs_pctnovehicle_county: p_result.county.pctNoVehicle,                                   
                    cvs_pctnovehicle_tract: p_result.tract.pctNoVehicle,
                    cvs_pctmove_county: p_result.county.pctMOVE,
                    cvs_pctmove_tract: p_result.tract.pctMOVE,
                    cvs_pctsphh_county: p_result.county.pctSPHH,
                    cvs_pctsphh_tract: p_result.tract.pctSPHH,
                    cvs_pctovercrowdhh_county: p_result.county.pctOVERCROWDHH,
                    cvs_pctovercrowdhh_tract: p_result.tract.pctOVERCROWDHH,
                    cvs_pctowner_occ_county: p_result.county.pctOWNER_OCC,
                    cvs_pctowner_occ_tract: p_result.tract.pctOWNER_OCC,
                    cvs_pct_less_well_county: p_result.county.pct_less_well,
                    cvs_pct_less_well_tract: p_result.tract.pct_less_well,
                    cvs_ndi_raw_county: p_result.county.ndI_raw,
                    cvs_ndi_raw_tract: p_result.tract.ndI_raw,
                    cvs_pctpov_county: p_result.county.pctPOV,
                    cvs_pctpov_tract: p_result.tract.pctPOV,
                    cvs_ice_income_all_county: p_result.county.icE_INCOME_all,
                    cvs_ice_income_all_tract: p_result.tract.icE_INCOME_all,
                    cvs_medhhinc_county: p_result.county.medhhinc,
                    cvs_medhhinc_tract: p_result.tract.medhhinc,
                    cvs_pctobese_county: p_result.county.pctOBESE,
                    cvs_fi_county: p_result.county.fi,
                    cvs_cnmrate_county: p_result.county.cnMrate,
                    cvs_obgynrate_county: p_result.county.obgyNrate,
                    cvs_rtteenbirth_county: p_result.county.rtTEENBIRTH,
                    cvs_rtstd_county: p_result.county.rtSTD,
                    cvs_rtmhpract_county: p_result.county.rtMHPRACT,
                    cvs_rtdrugodmortality_county: p_result.county.rtDRUGODMORTALITY,
                    cvs_rtopioidprescript_county: p_result.county.rtOPIOIDPRESCRIPT,
                    cvs_soccap_county: p_result.county.socCap,
                    cvs_rtsocassoc_county: p_result.county.rtSocASSOC,
                    cvs_pcthouse_distress_county: p_result.county.pctHOUSE_DISTRESS,
                    cvs_rtviolentcr_icpsr_county: p_result.county.rtVIOLENTCR_ICPSR,
                    cvs_isolation_county: p_result.county.isolation
                    }

                    g_data.cvs.cvs_grid = [ new_grid_item ];
                }
            }

        }
		*/


}
