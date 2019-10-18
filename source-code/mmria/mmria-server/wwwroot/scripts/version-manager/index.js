var g_metadata = null;
var schema = null;
var mmria_path_to_definition_name = null;
var g_data = null;

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
    var el = document.getElementById("mmria_path")


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
        schema: { } 
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

}

function save_schema_click()
{
    
}