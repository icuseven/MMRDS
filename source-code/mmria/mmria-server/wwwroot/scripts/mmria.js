var $mmria = function() 
{
    return {

        get_geocode_info: function(p_street, p_city, p_state, p_zip, p_call_back_action)
        {
            
            let request = [];
			let state = p_state
			
			if(state)
			{
				let check_state = state.split("-");
				state = check_state[0];
			}

	
            
            request.push("https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress=")
            request.push(p_street);
            request.push("&city=");
            request.push(p_city);
            request.push("&state=");
            request.push(state);
            request.push("&zip=")
            request.push(p_zip);
            request.push("&apikey=");
            request.push("7c39ae93786d4aa3adb806cb66de51b8");
            request.push("&format=json&allowTies=false&tieBreakingStrategy=revertToHierarchy&includeHeader=true&census=true&censusYear=2010&notStore=true&version=4.01");

            let geocode_url = request.join("");

            $.ajax(
            {
                    url: geocode_url
            }
            ).done(function(response) 
            {
                
                let geo_data = null;
                
                let data = eval('(' + response + ')');
                // set the latitude and logitude
                //death_certificate/place_of_last_residence/latitude
                //death_certificate/place_of_last_residence/longitude
                if
                (
                    data &&
                    data.FeatureMatchingResultType &&
					!(["Unmatchable","ExceptionOccurred", "0"].indexOf(data.FeatureMatchingResultType) > -1) &&                 
                    data.OutputGeocodes &&
                    data.OutputGeocodes.length > 0 &&
                    data.OutputGeocodes[0].OutputGeocode &&
                    data.OutputGeocodes[0].OutputGeocode.FeatureMatchingResultType &&
                    !(["Unmatchable","ExceptionOccurred"].indexOf(data.OutputGeocodes[0].OutputGeocode.FeatureMatchingResultType) > -1)
				)
                {
                    geo_data = { 
                            FeatureMatchingResultType: data.OutputGeocodes[0].OutputGeocode.FeatureMatchingResultType,
							FeatureMatchingGeographyType: data.OutputGeocodes[0].OutputGeocode.FeatureMatchingGeographyType,
							latitude: data.OutputGeocodes[0].OutputGeocode.Latitude,
                            longitude: data.OutputGeocodes[0].OutputGeocode.Longitude,
							NAACCRGISCoordinateQualityCode: data.OutputGeocodes[0].OutputGeocode.NAACCRGISCoordinateQualityCode,
                            NAACCRGISCoordinateQualityType: data.OutputGeocodes[0].OutputGeocode.NAACCRGISCoordinateQualityType,
                            NAACCRCensusTractCertaintyCode: data.OutputGeocodes[0].CensusValues[0].CensusValue1.NAACCRCensusTractCertaintyCode,
                            NAACCRCensusTractCertaintyType: data.OutputGeocodes[0].CensusValues[0].CensusValue1.NAACCRCensusTractCertaintyType,
							CensusCbsaFips: data.OutputGeocodes[0].CensusValues[0].CensusValue1.CensusCbsaFips,
                            CensusCbsaMicro: data.OutputGeocodes[0].CensusValues[0].CensusValue1.CensusCbsaMicro,
                            CensusStateFips: data.OutputGeocodes[0].CensusValues[0].CensusValue1.CensusStateFips,
                            CensusCountyFips: data.OutputGeocodes[0].CensusValues[0].CensusValue1.CensusCountyFips,
                            CensusTract: data.OutputGeocodes[0].CensusValues[0].CensusValue1.CensusTract,
                            CensusMetDivFips: data.OutputGeocodes[0].CensusValues[0].CensusValue1.CensusMetDivFips
							
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
            control.value = p_value;
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
        save_current_record: function(p_call_back)
        {

            $.ajax({
                url: location.protocol + '//' + location.host + '/api/case',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(g_data),
                type: "POST"
            }).done(function(case_response) {
        
                console.log("$mmria.save_current_record: success");
        
                g_change_stack = [];
        
                if(g_data && g_data._id == case_response.id)
                {
                g_data._rev = case_response.rev;
                set_local_case(g_data);
                //console.log('set_value save finished');
                }
        
                
                if(case_response.auth_session)
                {
                    //profile.auth_session = case_response.auth_session;
                    //$mmria.addCookie("AuthSession", case_response.auth_session);
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
        confirm_dialog_show: function (p_title, p_header, p_inner_html, p_confirm_dialog_confirm_callback, p_confirm_dialog_cancel_callback){
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
                    <button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close" title="×" onclick="$mmria.confirm_dialog_confirm_close()"><span class="ui-button-icon ui-icon ui-icon-closethick"></span><span class="ui-button-icon-space"> </span>×</button>
                </div>
                <div id="mmria_dialog" style="width: auto; min-height: 101px; max-height: none; height: auto;" class="ui-dialog-content ui-widget-content">
                    <div class="modal-body">
                        <p><strong>${p_header}</strong></p>
                        ${p_inner_html}
                    </div>
                    <footer class="modal-footer">
                        <button id="confirm-dialog-id-confirm-button" class="btn btn-primary mr-1" >Yes, change my selection</button> |
                        <button id="confirm-dialog-id-cancel-button"  class="btn btn-primary mr-1" >Cancel</button>
                    </footer>
                </div>
            `);

            // html.push(`<h3 class="mt-0">${p_title}</h3>`);
            // html.push(`<p><strong>${p_header}</p>`);
            // html.push(`${p_inner_html}`);
            // html.push('<button class="btn btn-primary mr-1" onclick="$mmria.info_dialog_click()">OK</button>');
            
            element.innerHTML = html.join("");

            let confirm_button = document.getElementById("confirm-dialog-id-confirm-button");
            let canel_button = document.getElementById("confirm-dialog-id-cancel-button");

            confirm_button.onclick =  p_confirm_dialog_confirm_callback;
            canel_button.onclick = p_confirm_dialog_cancel_callback;

            element.showModal();
        },
        confirm_dialog_confirm_close: function ()
        {
            let el = document.getElementById("confirm-dialog-id");
            el.close();
        }
    };

}();
/* http://esprima.org/demo/collector.js
example
vist
function collect(node) {
                var str, arg, value;
                if (node.type === 'Literal') {
                    if (node.value instanceof RegExp) {
                        str = node.value.toString();
                        if (str[0] === '/') {
                            result.push({
                                type: 'Literal',
                                value: node.value,
                                line: node.loc.start.line,
                                column: node.loc.start.column,
                                range: node.range
                            });
                        }
                    }
                }
                if (node.type === 'NewExpression' || node.type === 'CallExpression') {
                    if (node.callee.type === 'Identifier' && node.callee.name === 'RegExp') {
                        arg = node['arguments'];
                        if (arg.length === 1 && arg[0].type === 'Literal') {
                            if (typeof arg[0].value === 'string') {
                                value = createRegex(arg[0].value);
                                if (value) {
                                    result.push({
                                        type: 'Literal',
                                        value: value,
                                        line: node.loc.start.line,
                                        column: node.loc.start.column,
                                        range: node.range
                                    });
                                }
                            }
                        }
                        if (arg.length === 2 && arg[0].type === 'Literal' && arg[1].type === 'Literal') {
                            if (typeof arg[0].value === 'string' && typeof arg[1].value === 'string') {
                                value = createRegex(arg[0].value, arg[1].value);
                                if (value) {
                                    result.push({
                                        type: 'Literal',
                                        value: value,
                                        line: node.loc.start.line,
                                        column: node.loc.start.column,
                                        range: node.range
                                    });
                                }
                            }
                        }
                    }
                }
            }
            */