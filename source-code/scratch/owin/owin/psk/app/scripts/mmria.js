var $mmria = function() 
{
    return {

        get_geocode_info: function(p_street, p_city, p_state, p_zip, p_call_back_action)
        {
            
            var request = [];
            
            request.push("https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress=")
            request.push(p_street);
            request.push("&city=");
            request.push(p_city);
            request.push("&state=");
            request.push(p_state);
            request.push("&zip=")
            request.push(p_zip);
            request.push("&apikey=");
            request.push("7c39ae93786d4aa3adb806cb66de51b8");
            request.push("&format=json&allowTies=false&tieBreakingStrategy=flipACoin&includeHeader=true&census=true&censusYear=2000|2010&notStore=false&version=4.01");

            var geocode_url = request.join("");

            $.ajax(
            {
                    url: geocode_url
            }
            ).done(function(response) 
            {
                
                var geo_data = null;
                
                var data = eval('(' + response + ')');
                // set the latitude and logitude
                //death_certificate/place_of_last_residence/latitude
                //death_certificate/place_of_last_residence/longitude
                if
                (
                    data &&
                    data.OutputGeocodes &&
                    data.OutputGeocodes.length > 0
                )
                {
                    geo_data = { 
                            latitude: data.OutputGeocodes[0].OutputGeocode.Latitude,
                            longitude: data.OutputGeocodes[0].OutputGeocode.Longitude,
							NAACCRGISCoordinateQualityCode: data.OutputGeocodes[0].OutputGeocode.NAACCRGISCoordinateQualityCode,
							NAACCRGISCoordinateQualityType: data.OutputGeocodes[0].OutputGeocode.NAACCRGISCoordinateQualityType,
							CensusCbsaFips : data.OutputGeocodes[0].CensusValues[0].CensusValue1.CensusCbsaFips,
							CensusCbsaMicro : data.OutputGeocodes[0].CensusValues[0].CensusValue1.CensusCbsaMicro
							
                        };
                }
                
                p_call_back_action(geo_data);

            });
        },
        compose : function() 
        {
            //http://stackoverflow.com/questions/28821765/function-composition-in-javascript
            var funcs = arguments;

            return function() {
                var args = arguments;
                for (var i = funcs.length; i > 0; i--) {
                    args = [funcs[i].apply(this, args)];
                }
                return args[0];
                // var c = compose(trim, capitalize);
            }
        },
        mapEsprimaASt: function (object, f) 
        {
                var key, child;

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
            var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
            //var url = 'http://www.ora.com:80/goodparts?q#fragment';
            var result = [];
            var array = parse_url.exec(url);
            var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
            
            var blanks = '       ';
            var i;
            for (i = 0; i < names.length; i += 1) 
            {
               result[names[i]] = array[i];
            }
            

            return result;
        },
        get_new_guid : function () 
        {
            function s4() 
            {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        },

        addCookie: function (name,value,days)
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
            document.cookie = name + "=" + value + expires + "; path=/";
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
        set_control_value: function(p_dictionary_path, p_value)
        {
            $('[dpath="' + p_dictionary_path + '"]').val(p_value);
        },
        save_current_record: function()
        {
             var db = new PouchDB("mmrds");
             if(g_data)
             {
                db.put(g_data).then(function (doc)
                {
                    if(g_data && g_data._id == doc.id)
                    {
                        g_data._rev = doc.rev;
                        console.log('set_value save finished');
                    }
                    else for(var i = 0; i < g_ui.data_list.length; i++)
                    {
                        if(g_ui.data_list[i]._id == doc.id)
                        {
                            g_ui.data_list[i]._rev = doc.rev;
                            console.log('set_value save finished');
                            break;
                        }
                    }
                }).catch(function (err) 
                {
                    console.log(err);
                });
             }
        },
        get_current_multiform_index: function ()
        {
            var result = parseInt(window.location.href.substr(window.location.href.lastIndexOf("/") + 1,window.location.href.length - (window.location.href.lastIndexOf("/") + 1)));
            
            return result;
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