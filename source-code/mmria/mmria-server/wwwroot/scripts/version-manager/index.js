var schema = null;
var mmria_path_to_definition_name = null;
var g_data = null;
let base_api_url = location.protocol + '//' + location.host + "/api/version?p_mmria_path=";

function main()
{
    
}


function get_version_click()
{
  	$.ajax({
            //url: 'http://test-mmria.services-dev.cdc.gov/api/metadata/2016-06-12T13:49:24.759Z',
            url: location.protocol + '//' + location.host + '/api/metadata/version_specification-19.10.18'
	}).done(function(response) {
            g_data = response;
            base_api_url = location.protocol + '//' + location.host + "/api/version/" + g_data.name + "/?p_mmria_path=";
	});
}

function get_metadata()
{
  	$.ajax({
            //url: 'http://test-mmria.services-dev.cdc.gov/api/metadata/2016-06-12T13:49:24.759Z',
            url: location.protocol + '//' + location.host + '/api/metadata'
	}).done(function(response) {
            g_metadata = response;
            g_data.metadata = JSON.stringify(g_metadata);
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
    g_data = {
        _id : "version_specification-19.10.18",
		data_type : "version-specification",
		date_created : new Date().toISOString(),
		created_by : "isu7@cdc.gov",
		date_last_updated :  new Date().toISOString(),
		last_updated_by : "isu7@cdc.gov",
		name: "19.10.18",
        metadata: "",
        ui_specification:"",
        schema: { },
        path_to_csv_all: {},
        path_to_csv_core: {}
    };
}


function save_version_click()
{
    $.ajax
    (
        {
        url: location.protocol + '//' + location.host + '/api/metadata/' + g_data._id,
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
    g_data.schema[path] = json_schema;
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
    let result = { 
        "$schema": "http://json-schema.org/schema#",
        "$id": base_api_url + p_path
    };


    return result;

}