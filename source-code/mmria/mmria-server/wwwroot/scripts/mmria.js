var $mmria = function() 
{
    return {
        dc_plc_cvs_button_click: function (p_control)
        {
            const lat = g_data.death_certificate.place_of_last_residence.latitude;
            const lon = g_data.death_certificate.place_of_last_residence.longitude;
            const year = g_data.home_record.date_of_death.year;
            const record_id = g_data.home_record.record_id;

            if(g_is_committee_member_view != null && g_is_committee_member_view == true)
            {

                $mmria.get_cvs_api_dashboard_info
                (
                    lat,
                    lon,
                    year,
                    record_id
                );

            }
            else
            {
            
                //Error: Community Vital Signs PDF
                //Validation: Address is not validated.
                // Please verify address and validate before clicking button to View Community Vital Signs PDF.


                const census_set = new Set();
                census_set.add(1);
                census_set.add(2);
                census_set.add(3);
                census_set.add(4);
                census_set.add(5);
                census_set.add(6);
    



                ///Error: Community Vital Signs PDF
                //Validation: Census tract certainty code NOT 1,2,3,4,5 or 6.
                //There might be a potential error in the address. Please verify address and validate before clicking the button to View Community Vital Signs PDF.


                let census_track_certainty_code = g_data.death_certificate.address_of_injury.urban_status;
                if
                (
                    census_track_certainty_code == 'Undetermined'
                )
                {

                    $mmria.info_dialog_show("Error: Community Vital Signs PDF","Census tract certainty code NOT 1,2,3,4,5 or 6.", "Please verify address and validate before clicking button to View Community Vital Signs PDF.");
                }
                else
                {

                    if
                    (
                        lat == null ||
                        lon == null ||
                        year == null ||
                        lat == "" ||
                        lon == "" ||
                        year == null
                    )
                    {
                        $mmria.info_dialog_show("Error: Community Vital Signs PDF","Address is not validated.", "Please verify address and validate before clicking button to View Community Vital Signs PDF.");
                    }
                    else
                    {
                        $mmria.get_cvs_api_dashboard_info
                        (
                            lat,
                            lon,
                            year,
                            record_id
                        );
                    }
                }
            }
        },
        cvs_view_community_vital_signs_button_click: function (p_control)
        {

            const lat = g_data.death_certificate.place_of_last_residence.latitude;
            const lon = g_data.death_certificate.place_of_last_residence.longitude;
            const year = g_data.home_record.date_of_death.year;
            const record_id = g_data.home_record.record_id;

            if(g_is_committee_member_view != null && g_is_committee_member_view == true)
            {

                $mmria.get_cvs_api_dashboard_info
                (
                    lat,
                    lon,
                    year,
                    record_id
                );

            }
            else
            {
                let census_track_certainty_code = g_data.death_certificate.address_of_injury.urban_status;
                if
                (
                    census_track_certainty_code == 'Undetermined'
                )
                {
                    $mmria.info_dialog_show("Error: Community Vital Signs PDF","Census tract certainty code NOT 1,2,3,4,5 or 6.", "Please verify address and validate before clicking button to View Community Vital Signs PDF.");
                }
                else
                {

                    if
                    (
                        lat == null ||
                        lon == null ||
                        year == null ||
                        lat == "" ||
                        lon == "" ||
                        year == null
                    )
                    {
                    
                        $mmria.info_dialog_show("Error: Community Vital Signs PDF","Address is not validated.", "Please verify address and validate before clicking button to View Community Vital Signs PDF.");
                    }
                    else
                    {
                        $mmria.get_cvs_api_dashboard_info
                        (
                            lat,
                            lon,
                            year,
                            record_id
                        );
                    }
                }
            }
        },
        callback_cvs_data_success: function (p_result)
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

        },
        callback_cvs_data_error: function (p_result)
        {
            console.log(p_result);
            if
            (
                g_cvs_api_request_data.has("_id") &&
                g_cvs_api_request_data.get("_id") == g_data._id
            )
            {
                g_cvs_api_request_data.set
                (
                    "cvs_api_request_result_message",
                    `status code: ${p_result.status} message: ${p_result.responseText}`
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
        },
        get_cvs_api_data_info: async function
        (
            c_geoid,
            t_geoid,
            year,
            p_success_call_back,
            p_error_call_back
        )
        {
            var base_url = `${location.protocol}//${location.host}/api/cvsAPI`



            g_cvs_api_request_data.set("_id", g_data._id);
            g_cvs_api_request_data.set("cvs_api_request_url", base_url);
            g_cvs_api_request_data.set("cvs_api_request_date_time", new Date());
            g_cvs_api_request_data.set("cvs_api_request_c_geoid", c_geoid);
            g_cvs_api_request_data.set("cvs_api_request_t_geoid", t_geoid);
            g_cvs_api_request_data.set("cvs_api_request_year", year);


            //g_cvs_api_request_data.set("cvs_api_request_result_message", 
           /* 
            await fetch
            (
                base_url,
                {
                    method: "POST",
                    headers: {"Content-type": "application/json;charset=UTF-8"},
                    body: JSON.stringify({
                        action: "data",                        
                        c_geoid: c_geoid,
                        t_geoid: t_geoid,
                        year: year

                    }),
                }
            )            
            .then(response => p_success_call_back(response)) 
            .catch(err => p_error_call_back(err));
            */

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
        },
        get_cvs_api_dashboard_info: async function
        (
            lat,
            lon, 
            year,
            id,
            p_success_call_back,
            p_error_call_back
        )
        {           
            
            http://localhost:12345/community-vital-signs?lat=33.880577&lon=-84.29106&year=2012&id=GA-2012-1234



            var base_url = `${location.protocol}//${location.host}/community-vital-signs?lat=${lat}&lon=${lon}&year=${year}&id=${id}`

            window.open(base_url, target=id)
/*
            fetch
            (
                base_url,
                {
                    method: "POST",
                    body: JSON.stringify({
                        action: "dashboard",
                        lat: lat,
                        lon: lon, 
                        year: year,
                        id: id

                    }),
                }
            )
            .then(response => p_success_call_back(response)) 
            .catch(err => p_error_call_back(err));


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
                            action: "dashboard",
                            lat: lat,
                            lon: lon, 
                            year: year,
                            id: id

                        })
                    }
                );
            }
            catch(ex)
            {
                // do nothing 
            }*/

        },

        get_cvs_api_server_info: async function
        (
            p_success_call_back,
            p_error_call_back
        )
        {
            var base_url = `${location.protocol}//${location.host}/api/cvsAPI`
/*
            fetch
            (
                base_url,
                {
                    method: "POST",
                    body: JSON.stringify({
                        action: "server",

                    }),
                }
            )
            .then(response => p_success_call_back(response)) 
            .catch(err => p_error_call_back(err));
*/
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
                            action: "server"
                        })
                    }
                );
            }
            catch(ex)
            {
                // do nothing 
            }



        },
        get_geocode_info: function(p_street, p_city, p_state, p_zip, p_call_back_action)
        {
            
            let request = [];
			let state = p_state
			
			if(state)
			{
				let check_state = state.split("-");
				state = check_state[0];
			}

	
            var base_url = `${location.protocol}//${location.host}/api/tamuGeoCode?`

            request.push(base_url);
            request.push("streetAddress=")
            request.push(p_street);
            request.push("&city=");
            request.push(p_city);
            request.push("&state=");
            request.push(state);
            request.push("&zip=")
            request.push(p_zip);
            request.push("&format=json&allowTies=false&tieBreakingStrategy=revertToHierarchy&includeHeader=true&census=true&censusYear=2010&notStore=true&version=4.01");

            let geocode_url = request.join("");

            $.ajax(
            {
                    url: geocode_url
            }
            ).done(function(response) 
            {
                
                let geo_data = null;
                
                const data = response;
                // set the latitude and logitude
                //death_certificate/place_of_last_residence/latitude
                //death_certificate/place_of_last_residence/longitude
                if
                (
                    data &&
                    data.featureMatchingResultType &&
					!(["Unmatchable","ExceptionOccurred", "0"].indexOf(data.featureMatchingResultType) > -1) &&                 
                    data.outputGeocodes &&
                    data.outputGeocodes.length > 0 &&
                    data.outputGeocodes[0].outputGeocode &&
                    data.outputGeocodes[0].outputGeocode.featureMatchingResultType &&
                    !(["Unmatchable","ExceptionOccurred"].indexOf(data.outputGeocodes[0].outputGeocode.featureMatchingResultType) > -1)
				)
                {
                    geo_data = { 
                            FeatureMatchingResultType: data.outputGeocodes[0].outputGeocode.featureMatchingResultType,
							FeatureMatchingGeographyType: data.outputGeocodes[0].outputGeocode.featureMatchingGeographyType,
							latitude: data.outputGeocodes[0].outputGeocode.latitude,
                            longitude: data.outputGeocodes[0].outputGeocode.longitude,
							NAACCRGISCoordinateQualityCode: data.outputGeocodes[0].outputGeocode.naaccrgisCoordinateQualityCode,
                            NAACCRGISCoordinateQualityType: data.outputGeocodes[0].outputGeocode.naaccrgisCoordinateQualityType,
                            NAACCRCensusTractCertaintyCode: data.outputGeocodes[0].censusValues[0].CensusValue1.naaccrCensusTractCertaintyCode,
                            NAACCRCensusTractCertaintyType: data.outputGeocodes[0].censusValues[0].CensusValue1.naaccrCensusTractCertaintyType,
							CensusCbsaFips: data.outputGeocodes[0].censusValues[0].CensusValue1.censusCbsaFips,
                            CensusCbsaMicro: data.outputGeocodes[0].censusValues[0].CensusValue1.censusCbsaMicro,
                            CensusStateFips: data.outputGeocodes[0].censusValues[0].CensusValue1.censusStateFips,
                            CensusCountyFips: data.outputGeocodes[0].censusValues[0].CensusValue1.censusCountyFips,
                            CensusTract: data.outputGeocodes[0].censusValues[0].CensusValue1.censusTract,
                            CensusMetDivFips: data.outputGeocodes[0].censusValues[0].CensusValue1.censusMetDivFips
							
                        };
                }
                
                p_call_back_action(geo_data);

            });
        },
        compose : function() 
        {
            //http://stackoverflow.com/questions/28821765/function-composition-in-javascript
            let funcs = arguments;

            return function() {
                let args = arguments;
                for (let i = funcs.length; i > 0; i--) {
                    args = [funcs[i].apply(this, args)];
                }
                return args[0];
                // var c = compose(trim, capitalize);
            }
        },
        mapEsprimaASt: function (object, f) 
        {
            let key, child;

                if (f.call(null, object) === false) {
                    return;
                }
                for (key in object) {
                    if (object.hasOwnProperty(key)) {
                        child = object[key];
                        if (typeof child === 'object' && child !== null) {
                            $mmria.mapEsprimaASt(child, f);
                        }
                    }
                }
        },
        get_url_components: function (url)
        {
            let parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
            //var url = 'http://www.ora.com:80/goodparts?q#fragment';
            let result = [];
            let array = parse_url.exec(url);
            let names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
            
            let blanks = '       ';
            let i;
            for (i = 0; i < names.length; i += 1) 
            {
               result[names[i]] = array[i];
            }
            

            return result;
        },
        get_new_guid : function () 
        {
/*            
            function s4() 
            {
                return Math.floor((1 + $mmria.getRandomCryptoValue()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
*/
            let d = new Date().getTime();//Timestamp
            let d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) 
            {
                let r = $mmria.getRandomCryptoValue() * 16;//random number between 0 and 16
                if(d > 0)
                {//Use timestamp until depleted
                    r = (d + r)%16 | 0;
                    d = Math.floor(d/16);
                } 
                else 
                {//Use microseconds since page-load if supported
                    r = (d2 + r)%16 | 0;
                    d2 = Math.floor(d2/16);
                }
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        },

        addCookie: function (cookie_name,value,days)
        {
            var expires = "";
            if (days) 
            {
                var date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = "; expires=" + date.toUTCString();
            }
            else
            {
                var minutes_12 = 12;
                var current_date_time = new Date();
                var new_date_time = new Date(current_date_time.getTime() + minutes_12 * 60000);
                expires = "; expires=" + new_date_time.toGMTString();

            }
            document.cookie = cookie_name + "=" + value + expires + "; path=/";
        },
        getCookie: function (name)
        {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i < ca.length; i++) 
            {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        },
        removeCookie: function (name) {
            $mmria.addCookie(name,"",-1);
        },
        set_control_value: function(p_dictionary_path, p_value, p_form_index, p_grid_index)
        {
            let form_string = "";
            let grid_string = "";

            let jq = [ '[dpath="' + p_dictionary_path + '"]' ];

            if(p_form_index != null)
            {
                jq.push('[form_index="' + p_form_index +  '"]');
            }

            if(p_grid_index != null)
            {
                jq.push('[grid_index="' + p_grid_index +  '"]');
            }
            var control = document.querySelector(jq.join(""));
            if(control != null)
            {
                control.value = p_value;
            }
            else
            {
                //console.log("control not found: " + p_dictionary_path);
            }
        },
        set_control_visibility: function(p_element_id, p_value)
        {
            switch(p_value.toLowerCase())
            {
                case "none":
                case "block":
                var control = document.getElementById(p_element_id);
                if(control != null)
                {
                    control.style.display = p_value;
                }
                break;
            }
        },
        save_current_record: function(p_call_back, p_note)
        {
            if (g_is_data_analyst_mode != null) 
            {
                return;
            }

            let save_case_request = { 
                Change_Stack:{
                    _id: $mmria.get_new_guid(),
                    case_id: g_data._id,
                    case_rev: g_data._rev,
                    date_created: new Date().toISOString(),
                    user_name: g_user_name, 
                    items: g_change_stack,
                    metadata_version: g_release_version,
                    note: (p_note != null)? p_note : ""
    
                },
                Case_Data:g_data
            };
    
        if(g_case_narrative_is_updated)
        {
            save_case_request.Change_Stack.items.push({
                _id: g_data._id,
                _rev: g_data._rev,
              object_path: "g_data.case_narrative.case_opening_overview",
              metadata_path: "/case_narrative/case_opening_overview",
              old_value: g_case_narrative_original_value,
              new_value: g_data.case_narrative.case_opening_overview,
              dictionary_path: "/case_narrative/case_opening_overview",
              metadata_type: "textarea",
              prompt: 'Case Narrative',
              date_created: g_case_narrative_is_updated_date.toISOString(),
              user_name: g_user_name
            });
        }


            $.ajax({
                url: location.protocol + '//' + location.host + '/api/case',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(save_case_request),
                type: "POST"
            })
            .done(function(case_response) 
            {
                console.log("$mmria.save_current_record: success");
        
                g_change_stack = [];
                g_case_narrative_is_updated = false;
                g_case_narrative_is_updated_date = null;
        
                if(g_data && g_data._id == case_response.id)
                {
                    g_data._rev = case_response.rev;
                    set_local_case(g_data);
                    //console.log('set_value save finished');
                }
        
                
                if(case_response.auth_session)
                {
                    set_session_warning_interval();
                }
        
                if(p_call_back)
                {
                    p_call_back();
                }
        
        
            }).fail(function(xhr, err) { console.log("$mmria.save_current_record: failed", err); });
          
            
        },
        get_current_multiform_index: function ()
        {
            let result = parseInt(window.location.href.substr(window.location.href.lastIndexOf("/") + 1,window.location.href.length - (window.location.href.lastIndexOf("/") + 1)));
            
            return result;
        },
        getRandomCryptoValue: function () 
        {
            let crypto = window.crypto || window.msCrypto; // handles Internet Explorer
            return crypto.getRandomValues(new Uint32Array(1))[0]  / 0xffffffff;
        },
        show_confirmation_dialog: function(p_confirm_call_back, p_cancel_call_back)
        {
            const dialog_div = $("#mmria_dialog");
            
            dialog_div.dialog
            ({
              autoOpen: false,
              closeText: '×',
              closeOnEscape: false,
              draggable: false,
              width: 600,
              modal: true,
              zIndex: 999,
              buttons : {
                'Confirm' : function() {
                  $(this).dialog('close');
                  p_confirm_call_back();
                },
                'Cancel' : function() {
                  $(this).dialog('close');
                  p_cancel_call_back();
                }
              },
              classes: {
                'ui-dialog-titlebar': 'modal-header bg-primary',
                'ui-dialog-buttonpane': 'modal-footer'
              },
              open: function(event, ui) {
                $(event.target).parent().css({
                  'position': 'fixed',
                  'left': '50%',
                  'top': '40%',
                  'transform': 'translate3d(-50%, -50%, 0)',
                  'z-index': '999',
                });

                $(event.target).find('.ui-dialog-buttonpane').hide();

                $('.ui-widget-overlay').bind('click', function () {
                  dialog_div.dialog('close');
                });
/*
                const currentHash = location.hash;
                $(window).bind('hashchange', function () {
                  if (currentHash !== location.hash) {
                    dialog_div.dialog('close');
                  }
                });*/
              }
            });

            $('.confirmLink').unbind('click');
            $('.cancelLink').unbind('click');
        
            $(".confirmLink").click
            (
                function(event) 
                {
                    event.preventDefault();
                    $("#mmria_dialog").dialog("close");
                    p_confirm_call_back();
                }
            );

            $(".cancelLink").click
            (
                function(event) 
                {
                    event.preventDefault();
                    $("#mmria_dialog").dialog("close");
                    p_cancel_call_back();
                }
            );
            

            // let dialog = document.getElementById('mmria_dialog');
            // dialog.style.top = ((window.innerHeight/2) - (dialog.offsetHeight/2))+'px';
            // dialog.style.left = ((window.innerWidth/2) - (dialog.offsetWidth/2))+'px';
            // $(".ui-dialog").css("z-index",10);
            
            $("#mmria_dialog").dialog("open");
            // $(".ui-dialog-titlebar")[0].children[0].style="background-color:silver";
        },
        info_dialog_show: function (p_title, p_header, p_inner_html){
        let element = document.getElementById("case-progress-info-id");
            if(element == null)
            {
                element = document.createElement("dialog");
                element.classList.add('p-0');
                element.classList.add('set-radius');
                element.setAttribute("id", "case-progress-info-id");

                document.firstElementChild.appendChild(element);
            }

            let html = [];
            html.push(`
                <div class="ui-dialog-titlebar modal-header bg-primary ui-widget-header ui-helper-clearfix">
                    <span id="ui-id-1" class="ui-dialog-title">${p_title}</span>
                    <button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close" title="×" onclick="$mmria.info_dialog_click()"><span class="ui-button-icon ui-icon ui-icon-closethick"></span><span class="ui-button-icon-space"> </span>×</button>
                </div>
                <div id="mmria_dialog" style="width: auto; min-height: 101px; max-height: none; height: auto;" class="ui-dialog-content ui-widget-content">
                    <div class="modal-body">
                        <p><strong>${p_header}</strong></p>
                        ${p_inner_html}
                    </div>
                    <footer class="modal-footer">
                        <button class="btn btn-primary mr-1" onclick="$mmria.info_dialog_click()">OK</button>
                    </footer>
                </div>
            `);

            // html.push(`<h3 class="mt-0">${p_title}</h3>`);
            // html.push(`<p><strong>${p_header}</p>`);
            // html.push(`${p_inner_html}`);
            // html.push('<button class="btn btn-primary mr-1" onclick="$mmria.info_dialog_click()">OK</button>');
            
            element.innerHTML = html.join("");

            element.showModal();
        },
        info_dialog_click: function ()
        {
            let el = document.getElementById("case-progress-info-id");
            el.close();
        },
        confirm_dialog_show: function (p_title, p_header, p_inner_html, p_confirm_dialog_confirm_callback, p_confirm_dialog_cancel_callback)
        {
            let element = document.getElementById("confirm-dialog-id");
            if(element == null)
            {
                element = document.createElement("dialog");
                element.classList.add('p-0');
                element.classList.add('set-radius');
                element.setAttribute("id", "confirm-dialog-id");

                document.firstElementChild.appendChild(element);
            }
            
            let html = [];
            html.push(`
                <div class="ui-dialog-titlebar modal-header bg-primary ui-widget-header ui-helper-clearfix">
                    <span id="ui-id-1" class="ui-dialog-title">${p_title}</span>
                    <button id="modal_confirm_cancel_icon"="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close" title="×" onclick="$mmria.confirm_dialog_confirm_close()"><span class="ui-button-icon ui-icon ui-icon-closethick"></span><span class="ui-button-icon-space"> </span>×</button>
                </div>
                <div id="mmria_dialog" style="width: auto; min-height: 101px; max-height: none; height: auto;" class="ui-dialog-content ui-widget-content">
                    <div class="modal-body">
                        <p><strong>${p_header}</strong></p>
                        ${p_inner_html}
                    </div>
                    <footer class="modal-footer">
                        <button id="confirm-dialog-id-confirm-button" class="btn btn-primary mr-1" >Yes, change my selection</button> 
                        <button id="confirm-dialog-id-cancel-button"  class="btn modal-cancel btn-outline-secondary  mr-1" >Cancel</button>
                    </footer>
                </div>
            `);
            
            element.innerHTML = html.join("");

            let confirm_button = document.getElementById("confirm-dialog-id-confirm-button");
            let canel_button = document.getElementById("confirm-dialog-id-cancel-button");
            let modal_confirm_cancel_icon = document.getElementById("modal_confirm_cancel_icon");

            
            confirm_button.onclick =  p_confirm_dialog_confirm_callback;
            canel_button.onclick = p_confirm_dialog_cancel_callback;
            modal_confirm_cancel_icon.onclick = p_confirm_dialog_cancel_callback;

            element.showModal();
        },
        confirm_dialog_confirm_close: function ()
        {
            let el = document.getElementById("confirm-dialog-id");
            el.close();
        },
        get_year_and_quarter: function (p_value)
        {
            let result = null;
            
            if
            (
                p_value != null &&
                p_value != ""
            )
            {
                if
                (
                    p_value instanceof Date && 
                    !isNaN(p_value.valueOf()) &&
                    p_value.getFullYear() >= 1900 &&
                    p_value.getFullYear() <= 2100
                )
                {
                    result = `Q${Math.floor((p_value.getMonth() / 3) + 1)}-${p_value.getFullYear()}`;
                }
                else 
                {
                    let date = new Date(p_value);
                 
                    if
                    (
                        date instanceof Date && 
                        !isNaN(date.valueOf())
                        && date.getFullYear() >= 1900 &&
                        date.getFullYear() <= 2100
                    )
                    {
                        result = `Q${Math.floor((date.getMonth() / 3) + 1)}-${date.getFullYear()}`;
                    }
                }
            }

            return result;
        }
    };

}();
