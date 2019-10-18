var g_metadata = null;
var schema = null;
var mmria_path_to_definition_name = null;

function main()
{
    
}

function get_metadata()
{
  	$.ajax({
            //url: 'http://test-mmria.services-dev.cdc.gov/api/metadata/2016-06-12T13:49:24.759Z',
            url: location.protocol + '//' + location.host + '/api/metadata'
	}).done(function(response) {
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
            let el = document.getElementById("output2")
                
            el.value = JSON.stringify(schema);
            //get_cs_code(schema);
	});
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
            $("#output3").value = response;
        }
    ).fail
    (
        function(xhr, ajaxOptions, thrownError) 
        {
            $("#output3").val(xhr.responseText);
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

function generate_code_click()
{
    let el = document.getElementById("output2");

    let json = eval("(" + el.value + ")");

    get_cs_code(json);
}
