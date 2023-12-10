using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Akka.Actor;
using System.Globalization;

using mmria.pmss.server.Controllers;
using mmria_pmss_client.Models.IJE;
using TinyCsvParser;
using mmria.common.model.couchdb;

namespace mmria.pmss.services.vitalsimport;




public sealed class StartPMSSBatchItemMessage
{
    public StartPMSSBatchItemMessage(){}
    //public mmria_pmss_client.Models.IJE.PMSS_Other pmss_other { get; set; }

    public string record_id { get; init; }


    public DateTime ImportDate { get; init; }
    public string ImportFileName { get; init; }
    public List<string> headers { get; init; }
    public List<string> data { get; init; }

}

public sealed class pmss_item_data
{
    public string mmria_path { get; set; }
    public string name {get; set;}

    public string data { get; set; }
}


public sealed class TAMUGeoCode
{

	public mmria.common.texas_am.geocode_response execute
	(
		string geocode_api_key,
		string street_address,
		string city,
		string state,
		string zip
	) 
	{ 

		var result = new common.texas_am.geocode_response();

		string request_string = string.Format ("https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress={0}&city={1}&state={2}&zip={3}&apikey={4}&format=json&allowTies=false&tieBreakingStrategy=flipACoin&includeHeader=true&census=true&censusYear=2000|2010&notStore=false&version=4.01", street_address, city, state, zip, geocode_api_key);

		var curl = new mmria.getset.cURL("GET", null, request_string, null);
		try
		{
			string responseFromServer = curl.execute();

			result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.texas_am.geocode_response>(responseFromServer);
		
		}
		catch(Exception ex)
		{
			// do nothing for now
		}

		return result;

	} 


	public async Task<IEnumerable<mmria.common.texas_am.geocode_response>> executeAsync
	(
		string geocode_api_key,
		string street_address,
		string city,
		string state,
		string zip
	) 
	{ 
		
		string request_string = string.Format ("https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress={0}&city={1}&state={2}&zip={3}&apikey={4}&format=json&allowTies=false&tieBreakingStrategy=flipACoin&includeHeader=true&census=true&censusYear=2000|2010&notStore=false&version=4.01", street_address, city, state, zip, geocode_api_key);

		var curl = new mmria.getset.cURL("GET", null, request_string, null);
					// Read the content.
		string responseFromServer = await curl.executeAsync();

		var json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.texas_am.geocode_response>(responseFromServer);



		var result =  new mmria.common.texas_am.geocode_response[] 
		{ 
			json_result

		}; 

		return result;
	} 
}



public sealed class PMSS_ItemProcessor : ReceiveActor
{

    Dictionary<string, mmria.common.metadata.value_node[]> lookup;

    protected override void PreStart() => Console.WriteLine("Process_Message started");
    protected override void PostStop() => Console.WriteLine("Process_Message stopped");
    private string config_timer_user_name = null;
    private string config_timer_value = null;

    private string config_couchdb_url = null;
    private string db_prefix = "";

    
    static HashSet<string> ExistingRecordIds = null;

    mmria.common.couchdb.DBConfigurationDetail item_db_info;

    private System.Dynamic.ExpandoObject case_expando_object = null;

    private Dictionary<string, string> StateDisplayToValue;

    private string location_of_residence_latitude = null;
    private string location_of_residence_longitude = null;
    private string facility_of_delivery_location_latitude = null;
    private string facility_of_delivery_location_longitude = null;

    private string death_certificate_place_of_last_residence_latitude = null;
    private string death_certificate_place_of_last_residence_longitude = null;
    private string death_certificate_address_of_death_latitude = null;
    private string death_certificate_address_of_death_longitude = null;

    
    mmria.common.couchdb.OverridableConfiguration configuration;

    mmria.common.couchdb.DBConfigurationDetail db_config;
    string host_name;
    public PMSS_ItemProcessor
    (
        mmria.common.couchdb.OverridableConfiguration _configuration,
        string _host_name
    )
    {
        configuration = _configuration;
        host_name = _host_name;

        db_config = configuration.GetDBConfig(host_name);

        Receive<StartPMSSBatchItemMessage>(message =>
        {    
            Console.WriteLine("Message Recieved");
            //Console.WriteLine(JsonConvert.SerializeObject(message));
            Sender.Tell("Message Recieved");
            Process_Message(message);
        });
    }

    private async void Process_Message(StartPMSSBatchItemMessage message)
    {

        var mor = new mmria_pmss_client.Models.IJE.MOR_Specification();
        var fet = new mmria_pmss_client.Models.IJE.FET_Specification();
        var nat = new mmria_pmss_client.Models.IJE.NAT_Specification();

        string metadata_url = $"{db_config.url}/metadata/version_specification-{configuration.GetString("metadata_version", host_name)}/metadata";
        var metadata_curl = new mmria.getset.cURL("GET", null, metadata_url, null, config_timer_user_name, config_timer_value);
        mmria.common.metadata.app metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.app>(metadata_curl.execute());

        lookup = get_look_up(metadata);




        var new_case = new System.Dynamic.ExpandoObject();

        mmria.pmss.services.vitalsimport.default_case.create(metadata, new_case);

        var current_date_iso_string = System.DateTime.UtcNow.ToString("o");

        var gs = new migrate.C_Get_Set_Value(new System.Text.StringBuilder());

        var mmria_id = System.Guid.NewGuid().ToString();

        gs.set_value("_id", mmria_id, new_case);
        gs.set_value("date_created", current_date_iso_string, new_case);
        gs.set_value("created_by", "pmss-import", new_case);
        gs.set_value("date_last_updated", current_date_iso_string, new_case);
        gs.set_value("last_updated_by", "pmss-import", new_case);
        gs.set_value("version", metadata.version, new_case);

    
        var is_valid_file = true;

        var header_to_index = new System.Collections.Generic.Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        for(var i = 0; i < message.headers.Count; i++)
        {
            var key = message.headers[i];
            if(header_to_index.ContainsKey(key))
            {
                System.Console.WriteLine($"duplicate header: {key} column: {i+1}");
                is_valid_file = false;
            }
            else
            {
                header_to_index.Add(message.headers[i], i);
            }
        }
            
        
        

        if (! is_valid_file)
        {
            Context.Stop(this.Self);
            return;
        }

        I_PMSS_File_Specification name_to_path;

        if( header_to_index.Count == 155)
        {
            name_to_path = new PMSS_Other_Specification();
        }
        else
        {
            name_to_path = new PMSS_All_Specification();
        }

        foreach(var kvp in header_to_index)
        {

            if(name_to_path.Contains(kvp.Key))
            {
                var mmria_path = name_to_path[kvp.Key];
                var data = message.data[kvp.Value];

                if(mmria_path.ToUpper() == "NOT MAPPED") continue;

                if(mmria_path == "tracking/admin_info/jurisdiction")
                {
                    var state_node = lookup["lookup/state"];

                    var item = state_node.Where (x => int.Parse(x.value) == int.Parse(data)).SingleOrDefault();
                    if(item != null)
                    {
                        //System.Console.WriteLine($"{item.value}");
                        data = item.value;
                    }

                }

                
                var metdata_node = get_metadata_node(metadata, mmria_path);

                if(metdata_node.type.ToLower() == "date")
                {
                    var arr = data.Split("/");
                    if(arr.Length > 2)
                    {
                        data = $"{arr[2]}-{arr[0]}-{arr[1]}";
                    }
                }

                var set_result = gs.set_value
                (
                    mmria_path, 
                    data, 
                    new_case
                );

                if(set_result)
                {
                    //System.Console.WriteLine($"Updated {kvp.Key}:{data} {mmria_path}");
                }
                else
                {
                    System.Console.WriteLine($"Error updating {kvp.Key}:{data} {mmria_path}");
                }
            }
        }

/*

            14a. Decedent's usual occupation         occup    /demographic/q14/occup            

    14b. Kind of business/industry              indust   /demographic/q14/indust
Destination:

    01) industry_code_1 demographic/q14/

    02) industry_code_2

    03) industry_code_3

    04) occupation_code_1

    05) occupation_code_2

    06) occupation_code_3
*/

        pmss_item_data? get_data_item(string name)
        {
            pmss_item_data? result = null;

            if(header_to_index.ContainsKey(name))
            {
                result = new pmss_item_data()
                {
                    name = name,
                    mmria_path = name_to_path[name],
                    data = message.data[header_to_index[name]]
                };



                if(result.mmria_path == "tracking/q9/statres")
                {
                    var state_node = lookup["lookup/state"];

                    var item = state_node.Where (x => int.Parse(x.value) == int.Parse(result.data)).SingleOrDefault();
                    if(item != null)
                    {
                        //System.Console.WriteLine($"{item.value}");
                        //result.data = item.value;
                        result.data = item.display.Substring(item.display.IndexOf("(")+1, 2);
                    }

                }

            }


            return result;
        }

        var occup = get_data_item("occup");
        var occup_string = "";
        var indust = get_data_item("indust");
        var indust_string = "";

        if(occup != null)
        {

            occup_string = occup.data;

        }

        
        if(indust != null)
        {

            indust_string = indust.data;

        }

        
        if(occup != null || indust != null)
        {

            var niosh_result = get_niosh_codes(occup_string, indust_string);
            if(niosh_result.Industry.Count > 0)
            {
                gs.set_value
                (
                    "demographic/q14/industry_code_1", 
                    niosh_result.Industry[0].Code, 
                    new_case
                );
            }

            if(niosh_result.Industry.Count > 1)
            {
                gs.set_value
                (
                    "demographic/q14/industry_code_2", 
                    niosh_result.Industry[1].Code, 
                    new_case
                );
            }

            if(niosh_result.Industry.Count > 2)
            {
                gs.set_value
                (
                    "demographic/q14/industry_code_3", 
                    niosh_result.Industry[2].Code, 
                    new_case
                );
            }

            if(niosh_result.Occupation.Count > 0)
            {
                gs.set_value
                (
                    "demographic/q14/occupation_code_1", 
                    niosh_result.Occupation[0].Code, 
                    new_case
                );
            }

            if(niosh_result.Occupation.Count > 1)
            {
                gs.set_value
                (
                    "demographic/q14/occupation_code_2", 
                    niosh_result.Occupation[1].Code, 
                    new_case
                );
            }

            if(niosh_result.Occupation.Count > 2)
            {
                gs.set_value
                (
                    "demographic/q14/occupation_code_3", 
                    niosh_result.Occupation[2].Code, 
                    new_case
                );
            }

        }


/*
  Q9. State of residence               statres                  /tracking/q9/statres   CODED (00 à NYC,  01 à AL, … 63 à VI)

     9a. Zip code of residence        reszip                    /tracking/q9/reszip    

     9c. County of residence           county                  /tracking/q9/county
Destination:
*/

        var statres = get_data_item("statres");
        var reszip = get_data_item("reszip");
        var county = get_data_item("county");


        if(statres != null && reszip != null)
        {
            var geocode_data = get_geocode_info
            (
                "", // address
                "", // city
                statres.data,
                reszip.data
            );


            Set_Residence_Gecocode
            (
                gs, 
                geocode_data, 
                new_case
            );
        }


/*
        var finished = new mmria.common.ije.BatchItem()
        {
            Status = mmria.common.ije.BatchItem.StatusEnum.NewCaseAdded,
            CDCUniqueID = mor_field_set["SSN"],
            ImportDate = message.ImportDate,
            ImportFileName = message.ImportFileName,
            ReportingState = message.host_state,

            StateOfDeathRecord = mor_field_set["DSTATE"],
            DateOfDeath = $"{mor_field_set["DOD_YR"]}-{mor_field_set["DOD_MO"]}-{mor_field_set["DOD_DY"]}",
            DateOfBirth = $"{mor_field_set["DOB_YR"]}-{mor_field_set["DOB_MO"]}-{mor_field_set["DOB_DY"]}",
            LastName = mor_field_set["LNAME"],
            FirstName = mor_field_set["GNAME"],
            
            mmria_record_id = message.record_id,
            mmria_id = mmria_id,
            StatusDetail = "Added new case"
        };
        */

        string request_string = $"{db_config.url}/{db_config.prefix}mmrds/{mmria_id}";

        Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings();
        settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
        var object_string = Newtonsoft.Json.JsonConvert.SerializeObject(new_case, settings);

        var document_curl = new mmria.getset.cURL("PUT", null, request_string, object_string, db_config.user_name, db_config.user_value);

        var document_put_response = new mmria.common.model.couchdb.document_put_response();
        try
        {
            var responseFromServer = document_curl.execute();
            document_put_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
        }
        catch (Exception ex)
        {

            System.Console.WriteLine(ex);
/*
            finished = new mmria.common.ije.BatchItem()
            {
                Status = mmria.common.ije.BatchItem.StatusEnum.ImportFailed,
                CDCUniqueID = mor_field_set["SSN"],
                ImportDate = message.ImportDate,
                ImportFileName = message.ImportFileName,
                ReportingState = message.host_state,

                StateOfDeathRecord = mor_field_set["DSTATE"],
                DateOfDeath = $"{mor_field_set["DOD_YR"]}-{mor_field_set["DOD_MO"]}-{mor_field_set["DOD_DY"]}",
                DateOfBirth = $"{mor_field_set["DOB_YR"]}-{mor_field_set["DOB_MO"]}-{mor_field_set["DOB_DY"]}",
                LastName = mor_field_set["LNAME"],
                FirstName = mor_field_set["GNAME"],
                mmria_record_id = message.record_id,
                mmria_id = mmria_id,
                StatusDetail = "Error\n" + ex.ToString()
            };
            */
        }

        //Sender.Tell(finished);

        Context.Stop(this.Self);

    }


    GeocodeTuple get_geocode_info(string street, string city, string state, string zip)
    {

        var result = new GeocodeTuple();

        if (!string.IsNullOrEmpty(state))
        {
            var check_state = state.Split("-");
            state = check_state[0];
        }

        var TAMUGeocoder = new TAMUGeoCode();

        var response = TAMUGeocoder.execute(configuration.GetSharedString("geocode_api_key"), street, city, state, zip);
        
        if(response!= null && response.OutputGeocodes?.Length > 0)
        {
            result.OutputGeocode = response.OutputGeocodes[0].OutputGeocode;

            if(response.OutputGeocodes[0].CensusValues.Count > 0)
            {
                if(response.OutputGeocodes[0].CensusValues[0].ContainsKey("CensusValue1"))
                {
                    result.Census_Value = response.OutputGeocodes[0].CensusValues[0]["CensusValue1"];
                }
                
            }
        }

        return result;
    }

    private void Set_Residence_Gecocode(migrate.C_Get_Set_Value gs, GeocodeTuple geocode_data, System.Dynamic.ExpandoObject new_case)
    {
        string urban_status = null;
        string state_county_fips = null;

        string feature_matching_geography_type = "Unmatchable";
        string latitude = "";
        string longitude = "";
        string naaccr_gis_coordinate_quality_code = "";
        string naaccr_gis_coordinate_quality_type = "";
        string naaccr_census_tract_certainty_code = "";
        string naaccr_census_tract_certainty_type = "";
        string census_state_fips = "";
        string census_county_fips = "";
        string census_tract_fips = "";
        string census_cbsa_fips = "";
        string census_cbsa_micro = "";
        string census_met_div_fips = "";
        urban_status = "";
        state_county_fips = "";

        var outputGeocode_data = geocode_data.OutputGeocode;
        var censusValues_data = geocode_data.Census_Value;
        
        if
        (
            outputGeocode_data != null && 
            outputGeocode_data.FeatureMatchingResultType != null &&
            !outputGeocode_data.FeatureMatchingResultType.Equals("Unmatchable", StringComparison.OrdinalIgnoreCase)
        )
        {
            latitude = outputGeocode_data.Latitude;
            longitude = outputGeocode_data.Longitude;
            feature_matching_geography_type = outputGeocode_data.FeatureMatchingGeographyType;
            naaccr_gis_coordinate_quality_code = outputGeocode_data.NAACCRGISCoordinateQualityCode;
            naaccr_gis_coordinate_quality_type = outputGeocode_data.NAACCRGISCoordinateQualityType;
            naaccr_census_tract_certainty_code = censusValues_data?.NAACCRCensusTractCertaintyCode;
            naaccr_census_tract_certainty_type = censusValues_data?.NAACCRCensusTractCertaintyType;
            census_state_fips = censusValues_data?.CensusStateFips;
            census_county_fips = censusValues_data?.CensusCountyFips;
            census_tract_fips = censusValues_data?.CensusTract;
            census_cbsa_fips = censusValues_data?.CensusCbsaFips;
            census_cbsa_micro = censusValues_data?.CensusCbsaMicro;
            census_met_div_fips = censusValues_data?.CensusMetDivFips;
            // calculate urban_status
            if (censusValues_data != null)
            {
                if
                        (
                            int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) > 0 &&
                            int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) < 7 &&
                            censusValues_data?.CensusCbsaFips == ""
                        )
                {
                    urban_status = "Rural";
                }
                else if
                (
                    int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) > 0 &&
                    int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) < 7 &&
                    int.Parse(censusValues_data?.CensusCbsaFips) > 0
                )
                {
                    if (!string.IsNullOrEmpty(censusValues_data?.CensusMetDivFips))
                    {
                        urban_status = "Metropolitan Division";
                    }
                    else if (int.Parse(censusValues_data?.CensusCbsaMicro) == 0)
                    {
                        urban_status = "Metropolitan";
                    }
                    else if (int.Parse(censusValues_data?.CensusCbsaMicro) == 1)
                    {
                        urban_status = "Micropolitan";
                    }
                }
                else
                {
                    urban_status = "Undetermined";
                } 
            }

            // calculate state_county_fips
            if (!String.IsNullOrEmpty(censusValues_data?.CensusStateFips) && !String.IsNullOrEmpty(censusValues_data?.CensusCountyFips))
            {
                state_county_fips = censusValues_data?.CensusStateFips + censusValues_data?.CensusCountyFips;
            }

            facility_of_delivery_location_latitude = latitude;
            facility_of_delivery_location_longitude = longitude;
        }

        gs.set_value("tracking/q9/feature_matching_geography_type", feature_matching_geography_type, new_case);
        gs.set_value("tracking/q9/latitude", latitude, new_case);
        gs.set_value("tracking/q9/longitude", longitude, new_case);
        gs.set_value("tracking/q9/naaccr_gis_coordinate_quality_code", naaccr_gis_coordinate_quality_code, new_case);
        gs.set_value("tracking/q9/naaccr_gis_coordinate_quality_type", naaccr_gis_coordinate_quality_type, new_case);
        gs.set_value("tracking/q9/naaccr_census_tract_certainty_code", naaccr_census_tract_certainty_code, new_case);
        gs.set_value("tracking/q9/naaccr_census_tract_certainty_type", naaccr_census_tract_certainty_type, new_case);
        gs.set_value("tracking/q9/census_state_fips", census_state_fips, new_case);
        gs.set_value("tracking/q9/census_county_fips", census_county_fips, new_case);
        gs.set_value("tracking/q9/census_tract_fips", census_tract_fips, new_case);
        gs.set_value("tracking/q9/census_cbsa_fips", census_cbsa_fips, new_case);
        gs.set_value("tracking/q9/census_cbsa_micro", census_cbsa_micro, new_case);
        gs.set_value("tracking/q9/census_met_div_fips", census_met_div_fips, new_case);
        gs.set_value("tracking/q9/urban_status", urban_status, new_case);
        gs.set_value("tracking/q9/state_county_fips", state_county_fips, new_case);
        
    }


    public sealed class GeocodeTuple
    {
        public GeocodeTuple(){}

        public mmria.common.texas_am.OutputGeocode OutputGeocode {get;set;}
        public mmria.common.texas_am.CensusValue Census_Value {get;set;}

    }

    public sealed class Metadata_Node
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
    struct Result_Struct
    {
        public System.Dynamic.ExpandoObject[] docs;
    }


    private Dictionary<string, mmria.common.metadata.value_node[]> get_look_up(mmria.common.metadata.app p_metadata)
    {
        var result = new Dictionary<string, mmria.common.metadata.value_node[]>(StringComparer.OrdinalIgnoreCase);

        foreach (var node in p_metadata.lookup)
        {
            result.Add("lookup/" + node.name, node.values);
        }
        return result;
    }


    private  mmria.common.metadata.value_node[] get_metadata_value_node(string search_path, mmria.common.metadata.app p_metadata, string path = "")
    {
        mmria.common.metadata.value_node[] result = null;

        foreach (var node in p_metadata.children)
        {
            result = get_metadata_value_node(search_path, node, node.name);
            if(result != null) break;
        }
        return result;
    }

    private mmria.common.metadata.value_node[] get_metadata_value_node(string search_path, mmria.common.metadata.node p_metadata, string path = "")
    {
        mmria.common.metadata.value_node[] result = null;
        string key = $"{path}/{p_metadata.name}";
        if(search_path.Equals(path, StringComparison.OrdinalIgnoreCase))
        {
            if(! string.IsNullOrWhiteSpace(p_metadata.path_reference))
            {
                //result = lookup[p_metadata.path_reference];
            }
            else
            {
                result = p_metadata.values;
            }
        }
        else if(p_metadata.children!= null)
        {
            foreach (var node in p_metadata.children)
            {
                result = get_metadata_value_node(search_path, node, $"{path}/{node.name}");
                if(result != null) break;
            }
        }
        return result;
    }

    private static string ConvertHHmm_To_MMRIATime(string value)
    {
        string result = value;
        try
        {
            /*
                42 => 00:42:00
                1945 => 19:45:00
                1530 => 15:30:00
                815 => 08:15:00


                42 => 00:42
                1945 => 19:45
                1530 => 15:30
                815 => 08:15
            */
            //Ensure three digit times parse with 4 digits, e.g. 744 becomes 0744 and will be parsed to 7:44 AM
            switch (value.Length)
            {
                case 0:
                    break;
                case 1:
                    result = $"00:0{value}:00";
                    break;
                case 2:
                    result = $"00:{value}:00";
                    break;
                case 3:
                    result = $"0{value[0]}:{value[1..^0]}:00";
                    break;
                case 4:
                    result = $"{value[0..2]}:{value[2..^0]}:00";
                    break;


                default:
                    //result = $"{value.Substring(0,2)}:{value.Substring(2,2)}";
                    System.Console.Write($"ConvertHHmm_To_MMRIATime unable to convert {value}");
                    break;
            }
        }
        catch (Exception ex)
        {
            //Error parsing, eat it and put exact text in as to not lose data on import
            //result = value;
        }

        return result;
    }



    mmria.common.niosh.NioshResult get_niosh_codes(string p_occupation, string p_industry)
    {
        var result = new mmria.common.niosh.NioshResult();
        var builder = new StringBuilder();
        builder.Append("https://wwwn.cdc.gov/nioccs/IOCode.ashx?n=3");
        var has_occupation = false;
        var has_industry = false;

        if(!string.IsNullOrWhiteSpace(p_occupation))
        {
            has_occupation = true;
            builder.Append($"&o={p_occupation}");
        }

        if(!string.IsNullOrWhiteSpace(p_industry))
        {
            has_industry = true;
            builder.Append($"&i={p_industry}");
        }

        


        if(has_occupation || has_industry)
        {
            var niosh_url = builder.ToString();

            var niosh_curl = new mmria.getset.cURL("GET", null, niosh_url, null);

            try
            {
                string responseFromServer = niosh_curl.execute();

                result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.niosh.NioshResult>(responseFromServer);
            }
            catch
            {
                result.is_error = true;
            }
            
        }
        //{"Industry": [{"Code": "611110","Title": "Elementary and Secondary Schools","Probability": "9.999934E-001"},{"Code": "611310","Title": "Colleges, Universities, and Professional Schools","Probability": "2.598214E-006"},{"Code": "009990","Title": "Insufficient information","Probability": "2.312557E-006"}],"Occupation": [{"Code": "00-9900","Title": "Insufficient Information","Probability": "9.999897E-001"},{"Code": "11-9032","Title": "Education Administrators, Elementary and Secondary School","Probability": "6.550550E-006"},{"Code": "53-3022","Title": "Bus Drivers, School or Special Client","Probability": "4.932875E-007"}],"Scheme": "NAICS 2012 and SOC 2010"}
        return result;

    }


	public (string, mmria.common.cvs.tract_county_result) GetCVSData
    (
        string c_geoid,
		string t_geoid,
		string year,
        mmria.common.couchdb.ConfigurationSet ConfigDB
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

            var body_text =  System.Text.Json.JsonSerializer.Serialize(get_all_data_body);
            var get_all_data_curl = new mmria.getset.cURL("POST", null, base_url, body_text);

            response_string = get_all_data_curl.execute();
            System.Console.WriteLine(response_string);

            result = System.Text.Json.JsonSerializer.Deserialize<mmria.common.cvs.tract_county_result>(response_string);
        
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

            return ($"Status: {ex.Status} {ex.Message} {response_string}", null);
        }

        return ("success", result);
    }


    public List<int> CVS_Get_Valid_Years(mmria.common.couchdb.ConfigurationSet ConfigDB) 
    { 
        var result = new List<int>()
		{
			2010,
			2011,
			2012,
			2013,
			2014,
			2015,
			2016,
			2017,
			2018,
			2019,
			2020
		};

        var base_url = ConfigDB.name_value["cvs_api_url"];

        try
        {


			var get_year_body = new mmria.common.cvs.get_year_post_body()
			{
				id = ConfigDB.name_value["cvs_api_id"],
				secret = ConfigDB.name_value["cvs_api_key"],
				payload = new()
			};

			var body_text =  System.Text.Json.JsonSerializer.Serialize(get_year_body);
			var get_year_curl = new mmria.getset.cURL("POST", null, base_url, body_text);
			string get_year_response = get_year_curl.execute();
			result = Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>> (get_year_response);

			System.Console.WriteLine(get_year_response);

    
        }
        catch(System.Net.WebException ex)
        {
            System.Console.WriteLine($"cvsAPIController Get Year POST\n{ex}");
            
            /*return Problem(
                type: "/docs/errors/forbidden",
                title: "CVS API Error",
                detail: ex.Message,
                statusCode: (int) ex.Status,
                instance: HttpContext.Request.Path
            );*/
        }


        return result;
    }	

    bool is_result_quality_in_need_of_checking(mmria.common.cvs.tract_county_result val)
	{

		var over_all_result = false;
		var tract_result = false;
		var county_result = false;

		const float tract_total = 11F;
		const float county_total = 26F;

		float tract_zero_count = 0F;
		float county_zero_count = 0F;

		const float _30_percent_correct = .3F;

		if
		(
			val.tract.pctMOVE == 0  && //cvs_pctmove_tract
			val.tract.pctNOIns_Fem == 0 && //cvs_pctnoins_fem_tract		
			val.county.pctNoVehicle == 0 && //cvs_pctnovehicle_county
			val.tract.pctNoVehicle == 0 && //cvs_pctnovehicle_tract
			val.tract.pctOWNER_OCC == 0 //cvs_pctowner_occ_tract
		)
		{
			over_all_result = true;
		}


		if(val.tract.pctNOIns_Fem == 0) tract_zero_count += 1;
		if(val.tract.MEDHHINC == 0) tract_zero_count += 1;
		if(val.tract.pctNoVehicle == 0) tract_zero_count += 1;
		if(val.tract.pctMOVE == 0) tract_zero_count += 1;
		if(val.tract.pctSPHH == 0) tract_zero_count += 1;
		if(val.tract.pctOVERCROWDHH == 0) tract_zero_count += 1;
		if(val.tract.pctOWNER_OCC == 0) tract_zero_count += 1;
		if(val.tract.pct_less_well == 0) tract_zero_count += 1;
		if(val.tract.NDI_raw == 0) tract_zero_count += 1;
		if(val.tract.pctPOV == 0) tract_zero_count += 1;
		if(val.tract.ICE_INCOME_all == 0) tract_zero_count += 1;



		if(val.county.MDrate == 0) county_zero_count += 1;
		if(val.county.pctNOIns_Fem == 0) county_zero_count += 1;
		if(val.county.pctNoVehicle == 0) county_zero_count += 1;
		if(val.county.pctMOVE == 0) county_zero_count += 1;
		if(val.county.pctSPHH == 0) county_zero_count += 1;
		if(val.county.pctOVERCROWDHH == 0) county_zero_count += 1;
		if(val.county.pctOWNER_OCC == 0) county_zero_count += 1;
		if(val.county.pct_less_well == 0) county_zero_count += 1;
		if(val.county.NDI_raw == 0) county_zero_count += 1;
		if(val.county.pctPOV == 0) county_zero_count += 1;
		if(val.county.ICE_INCOME_all == 0) county_zero_count += 1;
		if(val.county.MEDHHINC == 0) county_zero_count += 1;
		if(val.county.pctOBESE == 0) county_zero_count += 1;
		if(val.county.FI == 0) county_zero_count += 1;
		if(val.county.CNMrate == 0) county_zero_count += 1;
		if(val.county.OBGYNrate == 0) county_zero_count += 1;
		if(val.county.rtTEENBIRTH == 0) county_zero_count += 1;
		if(val.county.rtSTD == 0) county_zero_count += 1;
		if(val.county.rtMHPRACT == 0) county_zero_count += 1;
		if(val.county.rtDRUGODMORTALITY == 0) county_zero_count += 1;
		if(val.county.rtOPIOIDPRESCRIPT == 0) county_zero_count += 1;
		if(val.county.SocCap == 0) county_zero_count += 1;
		if(val.county.rtSocASSOC == 0) county_zero_count += 1;
		if(val.county.pctHOUSE_DISTRESS == 0) county_zero_count += 1;
		if(val.county.rtVIOLENTCR_ICPSR == 0) county_zero_count += 1;
		if(val.county.isolation == 0) county_zero_count += 1;


		if(tract_zero_count / tract_total < _30_percent_correct) tract_result = true;

		if(county_zero_count / county_total < _30_percent_correct) county_result = true;


		return over_all_result || tract_result || county_result;
	}



 static List<List<string>> ParseCsv(ReadOnlySpan<char> csv) 
 {
    var result = new List<List<string>>();
    var row = new List<string>();
    string field = "";
    bool inQuotedField = false;

    for (int i = 0; i < csv.Length; i++) 
    {
        char current = csv[i];
        char next = i == csv.Length - 1 ? ' ' : csv[i + 1];

        if 
        (
            (
                current != '"' && 
                current != ',' && 
                current != '\r' && 
                current != '\n'
            ) || 
            (
                current != '"' && 
                inQuotedField
            )
        ) 
        {
            field += current;
        } 
        else if (current == ' ' || current == '\t') 
        {
            continue;
        } 
        else if (current == '"') 
        {
            if (inQuotedField && next == '"') 
            {
                i++;
                field += current;
            } 
            else if (inQuotedField) 
            {
                row.Add(field);
                if (next == ',') 
                {
                    i++;
                }
                field = "";
                inQuotedField = false;
            } 
            else 
            {
                inQuotedField = true; 
            }
        } 
        else if (current == ',') 
        {
            row.Add(field);
            field = "";
        } 
        else if (current == '\n') 
        {
            row.Add(field);
            result.Add(new List<string>(row));
            field = "";
            row.Clear();
        }
    }

    return result;
}
}