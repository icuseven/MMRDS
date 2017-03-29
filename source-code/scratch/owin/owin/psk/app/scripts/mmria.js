var $mmria = function() 
{
    return {

        get_geocode_info: function()
        {

            $.ajax({
                    url: location.protocol + '//' + location.host + '/api/values',
            }).done(function(response) {
                    g_couchdb_url = response.couchdb_url;
            load_profile();

            });
        },
        generate_record_id : function f(p_control) 
        {
            if 
            (
                (!p_control.value || p_control.value == '') && 
                (
                    this.state_of_death_record &&
                    this.state_of_death_record != '' &&
                    this.date_of_death &&
                    this.date_of_death.year > 2000 &&
                    this.record_id &&
                    this.record_id != ''
                )
            ) 
            {
                this.record_id = this.state_of_death_record + '-' + this.date_of_death.year + '-' + Math.random().toString().substring(2, 6);
                p_control.value = this.record_id;
            }
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
                var minutes_10 = 10;
                var current_date_time = new Date();
                var new_date_time = new Date(current_date_time.getTime() + minutes_10 * 60000);
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