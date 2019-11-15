var g_release_version = null;
var g_version_specification = null;
var g_metadata = null;
var g_data = null;
var g_data_view_rows = [];
var g_save_data_rows = [];

var g_list_lookup = {};

var mmria_path_to_definition_name = null;

var base_api_url = location.protocol + '//' + location.host + "/api/version?path=";
var g_available_version_list = null;


var g_MMRIA_Calculations = null;
var g_validation = null;
var g_ui_specification = null;

var case_view_request = {
    total_rows: 0,
    page :1,
    skip : 0,
    take : 10000,
    sort : "by_date_last_updated",
    search_key : null,
    descending : false,
    get_query_string : function(){
      var result = [];
      result.push("?skip=" + (this.page - 1) * this.take);
      result.push("take=" + this.take);
      result.push("sort=" + this.sort);
  
      if(this.search_key)
      {
        result.push("search_key=\"" + this.search_key.replace(/"/g, '\\"').replace(/\n/g,"\\n") + "\"");
      }
  
      result.push("descending=" + this.descending);
  
      return result.join("&");
    }
  };



function main()
{
    
    get_release_version();
}



function get_release_version()
{
  $.ajax
  ({

      url: location.protocol + '//' + location.host + '/api/version/release-version',
  })
  .done(function(response) 
  {
      g_release_version = response;
      document.getElementById("current_release").innerHTML = g_release_version;
      
      get_metadata();
	});
}

function get_metadata()
{
    $.ajax
    (
        {
            url: location.protocol + '//' + location.host + `/api/version/${g_release_version}/metadata`
        }
    )
    .done
    (
        function(response) 
        {
            g_metadata = response;


            set_list_lookup(g_list_lookup, g_metadata, "");

            get_case_set();
        }
    );
}


function get_case_set()
{

    var case_view_url = location.protocol + '//' + location.host + '/api/case_view' + case_view_request.get_query_string();

    $.ajax
    (
        {
            url: case_view_url,
        }
    )
    .done
    (
        function(case_view_response) 
        {
            case_view_request.total_rows = case_view_response.total_rows;

            g_data_view_rows = case_view_response.rows;

            document.getElementById("output").innerHTML = "case_view_request.total_rows: " + g_data_view_rows.length;
        }
    );
}

function set_list_lookup(p_list_lookup, p_metadata, p_path)
{

    switch(p_metadata.type.toLowerCase())
    {
        case "app":
        case "form":
        case "group":
        case "grid":
            for(let i = 0; i < p_metadata.children.length; i++)
            {
                let child = p_metadata.children[i];
                set_list_lookup(p_list_lookup, child, p_path + "/" + child.name);

            }

            break;
        default:
            if(p_metadata.type.toLowerCase() == "list")
            {
                let data_value_list = p_metadata.values;

                if(p_metadata.path_reference && p_metadata.path_reference != "")
                {
                    data_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));
            
                    if(data_value_list == null)	
                    {
                        data_value_list = p_metadata.values;
                    }
                }
    
                p_list_lookup[p_path] = {};
                for(let i = 0; i < data_value_list.length; i++)
                {
                    let item = data_value_list[i];
                    p_list_lookup[p_path][item.display.toLowerCase()] = item.value;
                }
            }
            break;

    }
}

function convert_dictionary_path_to_lookup_object(p_path)
{

	//g_data.prenatal.routine_monitoring.systolic_bp
	var result = null;
	var temp_result = []
	var temp = "g_metadata." + p_path.replace(new RegExp('/','gm'),".").replace(new RegExp('\\.(\\d+)\\.','gm'),"[$1].").replace(new RegExp('\\.(\\d+)$','g'),"[$1]");
	var index = temp.lastIndexOf('.');
	temp_result.push(temp.substr(0, index));
	temp_result.push(temp.substr(index + 1, temp.length - (index + 1)));

	var lookup_list = eval(temp_result[0]);

	for(var i = 0; i < lookup_list.length; i++)
	{
		if(lookup_list[i].name == temp_result[1])
		{
			result = lookup_list[i].values;
			break;
		}
	}


	return result;
}

function traverse_object(p_data, p_metadata, p_path, p_call_back)
{



    switch(p_metadata.type.toLowerCase())
    {
        case "form":
            if
            (
                p_metadata.cardinality == "+" ||
                p_metadata.cardinality == "*"
            )
            {
                if(Array.isArray(p_data))
                {
                    for(let j = 0; j < p_data.length; j++)
                    {
                        for(let i = 0; i < p_metadata.children.length; i++)
                        {
                            let child = p_metadata.children[i];
                            let data_child = p_data[j][child.name];
                            if(p_data[j][child.name])
                            {
                                if(child.children != null)
                                {
                                    traverse_object(p_data[j][child.name], child, p_path + "/" + child.name);
                                }
                                else if(child.type.toLowerCase() == "list")
                                {
                                    p_data[j][child.name] = get_value(p_path + "/" + child.name, p_data[j][child.name])
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                for(let i = 0; i < p_metadata.children.length; i++)
                {
                    let child = p_metadata.children[i];
                    let data_child = p_data[child.name];
                    if(p_data[child.name])
                    {
                        if(child.children != null)
                        {
                            traverse_object(p_data[child.name], child, p_path + "/" + child.name);
                        }
                        else if(child.type.toLowerCase() == "list")
                        {
                            p_data[child.name] = get_value(p_path + "/" + child.name, p_data[child.name])
                        }
                    }
                }
            }
            break;
        case "app":
            for(let i = 0; i < p_metadata.children.length; i++)
            {
                let child = p_metadata.children[i];
                let data_child = p_data[child.name];
                if(p_data[child.name])
                {
                    if(child.children != null)
                    {
                        traverse_object(p_data[child.name], child, p_path + "/" + child.name);
                    }
                    else if(child.type.toLowerCase() == "list")
                    {
                        p_data[child.name] = get_value(p_path + "/" + child.name, p_data[child.name])
                    }
                }
            }

            if(p_call_back)
            {
                p_call_back();
            }

            break;
        case "group":
        case "grid":
            for(let i = 0; i < p_metadata.children.length; i++)
            {
                let child = p_metadata.children[i];
                let data_child = p_data[child.name];
                if(p_data[child.name])
                {
                    if(child.children != null)
                    {
                        traverse_object(p_data[child.name], child, p_path + "/" + child.name);
                    }
                    else if(child.type.toLowerCase() == "list")
                    {
                        p_data[child.name] = get_value(p_path + "/" + child.name, p_data[child.name])
                    }
                }
            }
            break;
        default:
            if(p_metadata.type.toLowerCase() == "list")
            {
                let data_value_list = g_list_lookup[p_path];

                if(Array.isArray(p_data))
                {
                    for(let i = 0; i < p_data.length; i++)
                    {
                        let item = p_data[i];

                        if(item == null || item =="")
                        {
                            p_data[i] = data_value_list["(blank)"];
                        }
                        else if(data_value_list[item])
                        {
                            p_data[i] = data_value_list[item];
                        }                   
                        else if(p_data[i] == "No, not Spanish/ Hispanic/ Latino")
                        {
                            p_data[i] = "0"
                        }
                        else if
                        (
                            p_data[i].length > 3 && 
                            (
                                p_data[i].substr(2,1) == "-" ||
                                p_data[i].substr(1,1) == "-"
                            )
                        )
                        {
                            let val = p_data[i].split("-")[1].trim();
                            if(data_value_list[val])
                            {
                                p_data[i] = data_value_list[val];
                            }
                        }
                    }
                }
                else
                {
                    if(p_data == null || p_data =="")
                    {
                        p_data = data_value_list["(blank)"];
                    }
                    else if(data_value_list[p_data])
                    {
                        p_data = data_value_list[p_data];
                    }
                    else if(p_data == "No, not Spanish/ Hispanic/ Latino")
                    {
                        p_data = "0"
                    }
                    else if
                    (
                        p_data.length > 3 && 
                        (
                            p_data.substr(2,1) == "-" ||
                            p_data.substr(1,1) == "-"
                        )
                        
                    )
                    {
                        let val = p_data.split("-")[1].trim();
                        if(data_value_list[val])
                        {
                            p_data = data_value_list[val];
                        }
                    }
                }
            }
            break;

    }
}


function get_value(p_path, p_data)
{
    let data_value_list = g_list_lookup[p_path];
    let result = p_data;

    let is_number_regex = /^\-?\d+\.?\d*$/;
/*
    if(p_path == "/death_certificate/death_information/pregnancy_status")
    {
        console.log("break");
    }
*/
    try
    {
        if(Array.isArray(p_data))
        {
            result = [];
            for(let i = 0; i < p_data.length; i++)
            {
                let item = p_data[i];

                if(item == null || item =="")
                {
                    result.push(data_value_list["(blank)"]);
                }
                else if(is_number_regex.test(data_value_list[item]) && data_value_list[item])
                {
                    result.push(data_value_list[item]);
                }
                else if(!is_number_regex.test(data_value_list[item]) && data_value_list[item.toLowerCase()])
                {
                    result.push(data_value_list[item.toLowerCase()]);
                }                   
                else if(p_data[i] == "No, not Spanish/ Hispanic/ Latino")
                {
                    result.push("0");
                }
                else if(p_data[i] == "Yes, Other Spanish/ Hispanic/ Latino")
                {
                    result.push("4");
                }
                else if
                (
                    p_data[i].length > 3 && 
                    (
                        p_data[i].substr(2,1) == "-" ||
                        p_data[i].substr(1,1) == "-"
                    )
                )
                {
                    let val = p_data[i].split("-")[1].trim().toLowerCase();
                    if(data_value_list[val])
                    {
                        result.push(data_value_list[val]);
                    }
                }
                else if(p_data[i] == "-9")
                {
                    result.push("9999");
                }
                else if(p_data[i] == "-8")
                {
                    result.push("8888");
                }
                else if(p_data[i] == "-7")
                {
                    result.push("7777");
                }
            }
        }
        else
        {
            if(p_data == null || p_data =="")
            {
                result = data_value_list["(blank)"];
            }
            else if(is_number_regex.test(p_data) && data_value_list[p_data])
            {
                result = data_value_list[p_data];
            }
            else if(!is_number_regex.test(p_data) && data_value_list[p_data.toLowerCase()])
            {
                result = data_value_list[p_data.toLowerCase()];
            }
            else if(p_data == "No, not Spanish/ Hispanic/ Latino")
            {
                result = "0"
            }
            else if(p_data == "Yes, Other Spanish/ Hispanic/ Latino")
            {
                result = "4"
            }
            else if
            (
                p_data.length > 3 && 
                (
                    p_data.substr(2,1) == "-" ||
                    p_data.substr(1,1) == "-"
                )
                
            )
            {
                let val = p_data.split("-")[1].trim().toLowerCase();
                if(data_value_list[val])
                {
                    result = data_value_list[val];
                }
            }
            else if(p_data == "-9")
            {
                result = "9999";
            }
            else if(p_data == "-8")
            {
                result = "8888";
            }
            else if(p_data == "-7")
            {
                result = "7777";
            }
        }
    }
    catch(ex)
    {
        console.log(ex);
    }

    return result;
}


function migrate_one_case_click()
{
    let el = document.getElementById("output");

    for(let i = 0; i < g_data_view_rows.length; i++)
    {
        let current_case = g_data_view_rows[i];

        get_specific_case(current_case.id, travers_case);

        el.innerHTML = "Migration Processed:" + (i+1) + " cases";
    }


}

function view_progress_click()
{
    let el = document.getElementById("output");

    el.innerHTML = `g_save_data_rows.length: ${g_save_data_rows.length}`;
    
}

function save_changes_click()
{
    let el = document.getElementById("output");

    for(let i = 0; i < g_save_data_rows.length; i++)
    {
        let current_case = g_save_data_rows[i];

        save_case(current_case, null);

        el.innerHTML = "Save Processed:" + (i+1) + " cases";
    }


}


function travers_case(p_case)
{
    let all_cases = document.getElementById("all_cases").checked;

    if(all_cases)
    {
        traverse_object(p_case, g_metadata, "", function() { g_save_data_rows.push(p_case) });
    }
    else if(p_case.version == null || p_case.version != g_release_version)
    {
        traverse_object(p_case, g_metadata, "", function() { g_save_data_rows.push(p_case) });
    }
    
}

function get_specific_case(p_id, p_call_back)
{

    var case_url = location.protocol + '//' + location.host + '/api/case?case_id=' + p_id;
    $.ajax
    (
        {
          url: case_url,
        }
    )
    .done
    (
        function(case_response) 
        {
            if(case_response)
            { 
                if(p_call_back)
                {
                  p_call_back(case_response);
                }
            }
        }
    );
}



function get_available_versions()
{
  $.ajax
  ({

      url: location.protocol + '//' + location.host + '/api/version/list',
  })
  .done(function(response) 
  {

      g_available_version_list = response;

      render_available_version_list();
      
	});
}


function render_available_version_list()
{
    let available_version = document.getElementById("available_version");

    let result = []
    for(let i = 0; i < g_available_version_list.length; i++)
    {
      let item = g_available_version_list[i];
      let is_selected = "";
      if(i== 0)
      {
          is_selected = "selected=true"
      }
      if(item._id.indexOf("_design/auth") < 0)
      {
          result.push(`<option value="${item._id}" ${is_selected}>${item.name}</option>`)
      }
    }
    available_version.innerHTML = result.join("");
}

function render_selected_version()
{
    document.getElementById("selected_version_name").innerHTML = g_data.name;
    document.getElementById("selected_version_2").innerHTML = g_data.name;
    document.getElementById("selected_publish_status").value = g_data.publish_status;

}


function get_MMRIA_Calculations()
{
  	$.ajax({
            //url: 'http://test-mmria.services-dev.cdc.gov/api/metadata/2016-06-12T13:49:24.759Z',
            url: location.protocol + '//' + location.host + '/api/metadata/GetCheckCode'
	}).done(function(response) {
            g_MMRIA_Calculations = response;
            get_validation()
	});
}

function get_validation()
{
  	$.ajax({
            //url: 'http://test-mmria.services-dev.cdc.gov/api/metadata/2016-06-12T13:49:24.759Z',
            url: location.protocol + '//' + location.host + '/api/validator'
	}).done(function(response) {
            g_validation = response;
            get_ui_specification();
	});
}

function get_ui_specification()
{
  	$.ajax({
            //url: 'http://test-mmria.services-dev.cdc.gov/api/metadata/2016-06-12T13:49:24.759Z',
            url: location.protocol + '//' + location.host + '/api/ui_specification/default_ui_specification'
	}).done(function(response) {
            g_ui_specification = response;
	});
}



function get_gen_from_metadata()
{
    g_metadata = response;
    schema = get_initial_schema();

    for(var child in g_metadata.lookup)
    {
        var child_node = g_metadata.lookup[child];
        set_lookUp(schema.definitions, child_node);
    }

    var schema_context = get_schema_context(g_metadata, schema, "v1",  "");

    var definition_context = get_definition_context(g_metadata, schema_context.schema.definitions, {}, "");
    set_definitions(definition_context);

    mmria_path_to_definition_name = definition_context.mmria_path_to_definition_name;

    generate_schema_phase2(schema_context);

    schema = schema_context.schema;

    //console.log(schema);
    let el = document.getElementById("json_schema")
        
    el.value = JSON.stringify(schema);
    //get_cs_code(schema);
	
}


function get_cs_code(p_schema)
{
    var code_gen_request = { action:"generate", payload: p_schema };
    $.ajax
    ({
            url: location.protocol + '//' + location.host + '/api/version_code_gen',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(code_gen_request),
            type: "POST",
            headers:{ Accept: 'text/plain; charset=utf-8'}
    })
    .done
    (
        function(response) 
        {
            $("#generated_code").value = response;
        }
    ).fail
    (
        function(xhr, ajaxOptions, thrownError) 
        {
            $("#generated_code").val(xhr.responseText);
        }
    );
}

function convert_dictionary_path_to_lookup_object(p_path)
{

	//g_data.prenatal.routine_monitoring.systolic_bp
	var result = null;
	var temp_result = []
	var temp = "g_metadata." + p_path.replace(new RegExp('/','gm'),".").replace(new RegExp('\\.(\\d+)\\.','gm'),"[$1].").replace(new RegExp('\\.(\\d+)$','g'),"[$1]");
	var index = temp.lastIndexOf('.');
	temp_result.push(temp.substr(0, index));
	temp_result.push(temp.substr(index + 1, temp.length - (index + 1)));

	var lookup_list = eval(temp_result[0]);

	for(var i = 0; i < lookup_list.length; i++)
	{
		if(lookup_list[i].name == temp_result[1])
		{
			result = lookup_list[i].values;
			break;
		}
	}


	return result;
}


function save_case(p_data, p_call_back)
{


    $.ajax({
      url: location.protocol + '//' + location.host + '/api/case',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(p_data),
      type: "POST"
  }).done(function(case_response) {

      console.log("save_case: success");

      g_change_stack = [];

      if(p_data && p_data._id == case_response.id)
      {
        p_data._rev = case_response.rev;
        //console.log('set_value save finished');
      }



      if(p_call_back)
      {
        p_call_back();
      }


  })
  .fail
  (
    function(xhr, err) 
    { 
      console.log("server save_case: failed", err); 
      if(xhr.status == 401)
      {
        let redirect_url = location.protocol + '//' + location.host;
        window.location = redirect_url;
      }
      
    }
  );

}


function load_metadata_click()
{
    get_metadata();
}

function generate_schema_click()
{


    let path = document.getElementById("mmria_path").value;
    let selected_metatdata = document.getElementById("selected_metatdata");
    let json = eval("(" + selected_metatdata.value + ")");

    let schema = generate_schema_from_metadata(json, path);
    document.getElementById("json_schema").value = JSON.stringify(schema);

}

function generate_code_click()
{
    let el = document.getElementById("json_schema");

    let json = eval("(" + el.value + ")");

    get_cs_code(json);
}



function create_new_version_click()
{
    let version_name = document.getElementById("version_name").value;
    if(version_name!= null && version_name != "")
    {
        g_data = {
            _id : "version_specification-" + version_name,
            data_type : "version-specification",
            date_created : new Date().toISOString(),
            created_by : "isu7@cdc.gov",
            date_last_updated :  new Date().toISOString(),
            last_updated_by : "isu7@cdc.gov",
            name: version_name,
            publish_status: 0,
            metadata: "",
            ui_specification:"",
            schema: { },
            definition_set: { },
            path_to_csv_all_file: {},
            path_to_csv_all_field: {},
            path_to_csv_core_file: {},
            path_to_csv_core_field: {}
        };


        g_available_version_list.push(g_data);

        render_available_version_list();
        render_selected_version();
    }

    
}


function save_version_click()
{
    $.ajax
    (
        {
        //url: location.protocol + '//' + location.host + '/api/version/save/' + g_data._id,
        url: location.protocol + '//' + location.host + '/api/version/save',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(g_data),
        type: "POST"
        }
    )
    .done
    (
        function(case_response) 
        {
            console.log("save_case: success");
        
            if(g_data && g_data._id == case_response.id)
            {
                g_data._rev = case_response.rev;
            }
        }
    )
    .fail
    (
        function(xhr, err) 
        { 
            console.log("server save_case: failed", err); 
            
            if(xhr.status == 401)
            {
                /*
                let redirect_url = location.protocol + '//' + location.host;
                window.location = redirect_url;
                */
            }
            
        }
    );
}


function get_saved_version_spec()
{
  	$.ajax({
            //url: 'http://test-mmria.services-dev.cdc.gov/api/metadata/2016-06-12T13:49:24.759Z',
            url: location.protocol + '//' + location.host + '/api/metadata/' + g_data._id
	}).done(function(response) {
            g_data = response

            
            document.getElementById("selected_version_name").value = g_data.name;
            document.getElementById("selected_publish_status").value = g_data.publish_status;

	});
}

function show_selected_metadata_click()
{
    let path = document.getElementById("mmria_path").value;
    let selected_metatdata = document.getElementById("selected_metatdata");
    selected_metatdata.value = "";

    let source_metadata = eval("(" + g_data.metadata + ")");

    if(path != null && path != "")
    {

        

        if(path.indexOf("/lookup/") == 0)
        {
            let new_path = path.replace("/lookup/", "")
            for(let i = 0; i < source_metadata.lookup.length; i++)
            {
                let child = source_metadata.lookup[i];

                if(child.name.toLowerCase() == new_path.toLowerCase())
                {
                    //let metadata = source_metadata.lookup[new_path];
                    selected_metatdata.value = JSON.stringify(child);
                    break;
                }
    
            }
    
        }
        else
        {
            let metadata = find_metadata(source_metadata, path);
            selected_metatdata.value = JSON.stringify(metadata);
    
        }

    }
}



function pair_schema_click()
{
    let path = document.getElementById("mmria_path").value;
    let json_schema = document.getElementById("json_schema");
    g_data.schema[path] = json_schema.value;
}


function set_definition_click()
{
    let path = document.getElementById("mmria_path").value;
    let json_schema = document.getElementById("json_schema");
    g_data.definition_set[path] = json_schema.value;
}


function find_metadata(p_metadata, p_path)
{
    var result = null;
    let path_array = p_path.split("/");
    
    switch(p_metadata.type.toLowerCase())
    {
        case "app":
                if
                (
                    path_array.length == 1 ||
                    (
                        path_array.length == 2 &&
                        path_array[0] == "" &&
                        path_array[1] == ""
                    )
                )
                {
                    result =  p_metadata;
                }
                else
                {
                    for(let i = 0; i < p_metadata.children.length; i++)
                    {
                        let child = p_metadata.children[i];
                        let new_path = path_array.slice(1, path_array.length);
    
                        result = find_metadata(child, new_path.join("/"))
                        if(result)
                        {
                            break;
                        }
    
                    }
                }
                break;            
        case "form":
        case "group":
        case "grid":
            if
            (
                path_array.length == 1
            )
            {
                if(path_array[0].toLowerCase() == p_metadata.name.toLowerCase())
                {
                    result =  p_metadata;
                }
            }
            else
            {
                for(let i = 0; i < p_metadata.children.length; i++)
                {
                    let child = p_metadata.children[i];
                    let new_path = path_array.slice(1, path_array.length);

                    result = find_metadata(child, new_path.join("/"))
                    if(result)
                    {
                        break;
                    }

                }
            }
        break;
        default:
            if(p_path.toLowerCase() == p_metadata.name.toLowerCase())
            {
                result = p_metadata;
            }
            break;

    }
    return result;
}



function generate_schema_from_metadata(p_metadata, p_path)
{
    let result = null;

    switch(p_metadata.type.toLowerCase())
    {
        case "app":
                result = { 
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "$id": base_api_url + p_path,
                    "title": "MMRIA_Case",
                    "description": "Maternal Mortality Review Information Application (MMRIA) case schema",
                    "type": "object",
                    "properties" :
                    {
                        "_id": {"type": "string" },
                        "_rev": {"type": "string" },
                        "version": {
                            "type": "string",
                            "enum": [ g_data.name ],
                            "default" : g_data.name
                        }
        
                    },
                    "definitions": {},
                    "required": ["_id", "version"]
                };

                for(let i = 0; i < p_metadata.children.length; i++)
                {
                    let child = p_metadata.children[i];
                    switch(child.type.toLowerCase())
                    {
                        case "form":
                            result.properties[child.name] = { 
                                "type": "object",
                                "$ref": base_api_url + p_path + child.name
                            };

                            break;
                        case "group":
                        case "grid":
                            result.properties[child.name] = { 
                                "type": "object",
                                "$ref": base_api_url + p_path + child.name
                            };
                        break;
                        default:
                            Array.prototype.push.apply(result, generate_schema_from_metadata(child, p_path + child.name));
                            break;
                    }
                }
            break;
        case "form":
        case "group":
        case "grid":
            result = { 
                "$schema": "http://json-schema.org/draft-04/schema#",
                "$id": base_api_url + p_path,
                "title": p_metadata.name,
                "type": "object",
                "properties" :
                {
                    
                }
                
            };

            for(let i = 0; i < p_metadata.children.length; i++)
            {
                let child = p_metadata.children[i];
                switch(child.type.toLowerCase())
                {
                    case "group":
                    case "grid":
                        result.properties[child.name] = { 
                            "type": "object",
                            "$ref": base_api_url + p_path + "/" + child.name
                        };
                    break;
                    default:
                        Array.prototype.push.apply(result, generate_schema_from_metadata(child, p_path + "/" + child.name));
                        break;
                }
            }
            break;
        case "number":
            result = { "type" : "number"}
            break;                    
        case "string":
            result = { "type" : "string"}
            break;
        case "date":
            result = { "type" : "string", "format": "date" }
            break;            
        case "time":
            result = { "type" : "string", "format": "time" }
            break;            
        case "datetime":            
            result = { "type" : "string", "format": "date-time" }
            break;
        case "list":
                
        
            if(p_path.indexOf("/lookup/") == 0)
            {
                result = { };
                result[p_metadata.name] = { "type" : p_metadata.data_type, "x-enumNames": [], "enum": [] };


                for(let j = 0; j < p_metadata.values.length; j++ )
                {
                    result[p_metadata.name]["x-enumNames"].push(p_metadata.values[j].display);
                    result[p_metadata.name]["enum"].push(p_metadata.values[j].value);
                }

            }
            else
            {

                let data_type = "string";

                if
                (
                    p_metadata.data_type != null &&
                    p_metadata.data_type != ""
                )
                {
                    data_type = p_metadata.data_type;
                }

                if
                (
                    p_metadata.is_multiselect != null &&
                    p_metadata.is_multiselect == "true"
                )
                {
                    let data_value_list = p_metadata.values;

                    if
                    (
                        p_metadata.path_reference &&
                        p_metadata.path_reference != ""
                    )
                    {
                        data_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));
                
                        if(data_value_list == null)	
                        {
                            data_value_list = p_metadata.values;
                        }

                        
                        result = { "type": "array", "items": { "type": data_type, "x-enumNames": [], "enum":[] } }

                        for(let j = 0; j < data_value_list.length; j++ )
                        {
                            result["items"]["x-enumNames"].push(data_value_list[j].display);
                            result["items"]["enum"].push(data_value_list[j].value);
                        }

                        /*
                        else
                        {
                            object = p_schema_context.schema[p_schema_context.metadata.name.toLowerCase()] = { "type": "array",  "items": { "allOf": [{ "$ref": "#/definitions/" + p_schema_context.metadata.path_reference.replace("lookup/","") }] } }
                            
                            
                            object = p_schema_context.schema[p_schema_context.metadata.name.toLowerCase()] = { "type": "array", "items": { "type": data_type, "x-enumNames": [], "enum":[] } }

                            for(let j = 0; j < data_value_list.length; j++ )
                            {
                                object["items"]["x-enumNames"].push(data_value_list[j].display);
                                object["items"]["enum"].push(data_value_list[j].value);
                            }
                            
                        }*/

                    }
                    else
                    {
                        result = { "type": "array", "items": { "type": data_type, "x-enumNames": [], "enum":[] } }

                        for(let j = 0; j < p_metadata.values.length; j++ )
                        {
                            result["items"]["x-enumNames"].push(p_metadata.values[j].display);
                            result["items"]["enum"].push(p_metadata.values[j].value);
                        }
                    }

                }
                else
                {

                    

                    if(p_metadata.path_reference && p_metadata.path_reference != "")
                    {
                        data_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));
                
                        if(data_value_list == null)	
                        {
                            data_value_list = p_metadata.values;

                        }


                        result = { "type": data_type,  "x-enumNames": [], "enum":[] }
                            
                        for(let j = 0; j < data_value_list.length; j++ )
                        {
                            result["x-enumNames"].push(data_value_list[j].display);
                            result["enum"].push(data_value_list[j].value);
                        }

                        /*
                        else
                        {
                            object = p_schema_context.schema[p_schema_context.metadata.name.toLowerCase()] = {  "type": data_type, "items": { "oneOf": [{"$ref": "#/definitions/" + p_schema_context.metadata.path_reference.replace("lookup/","") }] } }

                            
                            object = p_schema_context.schema[p_schema_context.metadata.name.toLowerCase()] = { "type": data_type, "x-enumNames": [], "enum":[] }

                            for(let j = 0; j < data_value_list.length; j++ )
                            {
                                object["x-enumNames"].push(data_value_list[j].display);
                                object["enum"].push(data_value_list[j].value);
                            }
                            
                        }*/

                    }
                    else
                    {
                        result = { "type": data_type, "x-enumNames": [], "enum":[] }

                        for(let j = 0; j < p_metadata.values.length; j++ )
                        {
                            result["x-enumNames"].push(p_metadata.values[j].display);
                            result["enum"].push(p_metadata.values[j].value);
                        }
                    }
                }
            }
            break;            
        default:
            result = {"type": "string"}
            break;
    }

    return result;

}



function set_all_lists_in_definition_click()
{

    let metadata = eval("(" + g_data.metadata + ")")
    g_metadata = metadata;
    
    set_all_lists_in_definition(g_data.definition_set, metadata, "")
}


function generate_definition_from_metadata(p_metadata)
{

    let result = { "type" : p_metadata.data_type, "x-enumNames": [], "enum": [] };


    for(let j = 0; j < p_metadata.values.length; j++ )
    {
        result["x-enumNames"].push(p_metadata.values[j].display);
        result["enum"].push(p_metadata.values[j].value);
    }



    return result;

}

function generate_definition_click()
{

    let path = document.getElementById("mmria_path").value;
    let selected_metatdata = document.getElementById("selected_metatdata");
    let json = eval("(" + selected_metatdata.value + ")");

    let schema = generate_definition_from_metadata(json);
    document.getElementById("json_schema").value = JSON.stringify(schema);
}


function set_all_lists_in_definition(p_definitions, p_metadata, p_path)
{
    let result = null;

    switch(p_metadata.type.toLowerCase())
    {
        case "app":
        case "form":
        case "group":
        case "grid":
            for(let i = 0; i < p_metadata.children.length; i++)
            {
                let child = p_metadata.children[i];
                set_all_lists_in_definition(p_definitions, child, p_path + "/" + child.name);
            }
            break;
        case "list":
            /*
                p_definitions[p_path] = { "type" : p_metadata.data_type, "x-enumNames": [], "enum": [] };

                for(let j = 0; j < p_metadata.values.length; j++ )
                {
                    p_definitions[p_path]["x-enumNames"].push(p_metadata.values[j].display);
                    p_definitions[p_path]["enum"].push(p_metadata.values[j].value);
                }
            */

            let data_type = "string";

            if
            (
                p_metadata.data_type != null &&
                p_metadata.data_type != ""
            )
            {
                data_type = p_metadata.data_type;
            }

            if
            (
                p_metadata.is_multiselect != null &&
                p_metadata.is_multiselect == "true"
            )
            {
                let data_value_list = p_metadata.values;

                if
                (
                    p_metadata.path_reference &&
                    p_metadata.path_reference != ""
                )
                {
                    data_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));
            
                    if(data_value_list == null)	
                    {
                        data_value_list = p_metadata.values;
                    }

                    
                    p_definitions[p_path] = { "type": "array", "items": { "type": data_type, "x-enumNames": [], "enum":[] } }

                    for(let j = 0; j < data_value_list.length; j++ )
                    {
                        p_definitions[p_path]["items"]["x-enumNames"].push(data_value_list[j].display);
                        p_definitions[p_path]["items"]["enum"].push(data_value_list[j].value);
                    }

                    /*
                    else
                    {
                        object = p_schema_context.schema[p_schema_context.metadata.name.toLowerCase()] = { "type": "array",  "items": { "allOf": [{ "$ref": "#/definitions/" + p_schema_context.metadata.path_reference.replace("lookup/","") }] } }
                        
                        
                        object = p_schema_context.schema[p_schema_context.metadata.name.toLowerCase()] = { "type": "array", "items": { "type": data_type, "x-enumNames": [], "enum":[] } }

                        for(let j = 0; j < data_value_list.length; j++ )
                        {
                            object["items"]["x-enumNames"].push(data_value_list[j].display);
                            object["items"]["enum"].push(data_value_list[j].value);
                        }
                        
                    }*/

                }
                else
                {
                    p_definitions[p_path] = { "type": "array", "items": { "type": data_type, "x-enumNames": [], "enum":[] } }

                    for(let j = 0; j < p_metadata.values.length; j++ )
                    {
                        p_definitions[p_path]["items"]["x-enumNames"].push(p_metadata.values[j].display);
                        p_definitions[p_path]["items"]["enum"].push(p_metadata.values[j].value);
                    }
                }

            }
            else
            {

                

                if(p_metadata.path_reference && p_metadata.path_reference != "")
                {
                    data_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));
            
                    if(data_value_list == null)	
                    {
                        data_value_list = p_metadata.values;

                    }


                    p_definitions[p_path] = { "type": data_type,  "x-enumNames": [], "enum":[] }
                        
                    for(let j = 0; j < data_value_list.length; j++ )
                    {
                        p_definitions[p_path]["x-enumNames"].push(data_value_list[j].display);
                        p_definitions[p_path]["enum"].push(data_value_list[j].value);
                    }

                    /*
                    else
                    {
                        object = p_schema_context.schema[p_schema_context.metadata.name.toLowerCase()] = {  "type": data_type, "items": { "oneOf": [{"$ref": "#/definitions/" + p_schema_context.metadata.path_reference.replace("lookup/","") }] } }

                        
                        object = p_schema_context.schema[p_schema_context.metadata.name.toLowerCase()] = { "type": data_type, "x-enumNames": [], "enum":[] }

                        for(let j = 0; j < data_value_list.length; j++ )
                        {
                            object["x-enumNames"].push(data_value_list[j].display);
                            object["enum"].push(data_value_list[j].value);
                        }
                        
                    }*/

                }
                else
                {
                    p_definitions[p_path] = { "type": data_type, "x-enumNames": [], "enum":[] }

                    for(let j = 0; j < p_metadata.values.length; j++ )
                    {
                        p_definitions[p_path]["x-enumNames"].push(p_metadata.values[j].display);
                        p_definitions[p_path]["enum"].push(p_metadata.values[j].value);
                    }
                }
            }

            break;            
        case "number":
        case "string":
        case "date":
        case "time":
        case "datetime":            
        default:
            break;
    }

    return result;

}


function add_attachment_click(p_value)
{
    let doc_name = p_value.value.toLowerCase();
    document.getElementById("add_attachment_id").value = g_data._id;
    document.getElementById("add_attachment_rev").value = g_data._rev;
    document.getElementById("add_attachment_doc_name").value = doc_name;


    switch(doc_name)
    {
        case "metadata":
            g_metadata.version = g_data.name;
            document.getElementById("add_attachment_document_content").value = JSON.stringify(g_metadata);
            add_attachment(g_data._id, g_data._rev, doc_name, g_metadata)
            break;
        case "mmria_calculations":
            document.getElementById("add_attachment_document_content").value = g_MMRIA_Calculations;
            add_attachment(g_data._id, g_data._rev, doc_name, g_MMRIA_Calculations)
            break;
        case "validation":
            document.getElementById("add_attachment_document_content").value = g_validation;
            add_attachment(g_data._id, g_data._rev, doc_name, g_validation)
            break;
        case "ui_specification":
            document.getElementById("add_attachment_document_content").value = JSON.stringify(g_ui_specification);
            add_attachment(g_data._id, g_data._rev, doc_name, g_ui_specification)
            break;
        
    }
}

function add_attachment(p_id, p_rev, p_doc_name, p_content) 
{
    //add_attachment/{_id}/{_rev}/{doc_name}
    ///${p_rev}/${p_doc_name}

    $.ajax({
        //url: `${location.protocol}//${location.host}/api/version_attach/add/${p_id}`,
        //url: `${location.protocol}//${location.host}/api/version_attach/add`,
        //url: `${location.protocol}//${location.host}/api/version_attach/add/${p_id}`,
        url: `${location.protocol}//${location.host}/api/version_attach`,
        //contentType: 'application/json; charset=utf-8',
        contentType: 'multipart/form-data; charset=utf-8',
        //dataType: 'text',
        data:  $("#add_attachment").serialize(),
        type: "POST"
}).done(function(response) 
{

    if(response && response.ok == null)
    {
        response = JSON.parse(response);
    }
    
    if(response.ok)
    {
        g_data._rev = response.rev; 
        console.log("add_attachment: complete");
    }

    
})
.fail
(
    function(x) 
    {
        console.log(x);
    }
);
}
function base_api_url_change(p_value)
{

    base_api_url = p_value;
}

function selected_publish_status_change(p_value)
{
    g_data.publish_status = p_value;
}