
$(function ()
{
	// start do nothing for now

});



function perform_validation_save(p_metadata)
{


	metadata_list = [];
	object_list = [];

	path_to_node_map = [];
	path_to_int_map = [];
	dictionary_path_to_int_map = [];
	dictionary_path_to_path_map = [];
	is_added_function_map = {};
	path_to_onblur_map = [];
	path_to_onclick_map = [];
	path_to_onfocus_map = [];
	path_to_onchange_map = [];
	path_to_source_validation = [];
	path_to_derived_validation = [];
	path_to_validation_description = [];
	object_path_to_metadata_path_map = [];
	g_ast = null;
	g_function_array = [];
	g_validator_ast = null;

	output_json = [];



	output_json.push("var path_to_int_map = [];\n");
	output_json.push("var dictionary_path_to_path_map = [];\n");
	output_json.push("var path_to_onblur_map = [];\n");
	output_json.push("var path_to_onclick_map = [];\n");
	output_json.push("var path_to_onfocus_map = [];\n");
	output_json.push("var path_to_onchange_map = [];\n");
	output_json.push("var path_to_source_validation = [];\n");
	output_json.push("var path_to_derived_validation = [];\n");
	output_json.push("var path_to_validation_description = [];\n");

	generate_validation(output_json, p_metadata, metadata_list, "", object_list, "", path_to_node_map, path_to_int_map, path_to_onblur_map, path_to_onclick_map, path_to_onfocus_map, path_to_onchange_map, path_to_source_validation, path_to_derived_validation, path_to_validation_description, object_path_to_metadata_path_map);
	
	generate_global(output_json, p_metadata);

	for(var key in dictionary_path_to_path_map)
	{
		if (dictionary_path_to_path_map.hasOwnProperty(key)) 
		{
			output_json.push("dictionary_path_to_path_map['");
			output_json.push(key);
			output_json.push("']='");
			output_json.push(get_eval_string(dictionary_path_to_path_map[key]));
			output_json.push("';\n");
		}
	}
	

	generate_derived_validator(output_json, p_metadata, "", path_to_int_map);



		$.ajax({
			url: location.protocol + '//' + location.host + '/api/validator',
			//contentType: 'application/text; charset=utf-8',
			dataType: 'json',
			data: output_json.join(""),
			type: "POST"
	}).done(function(response) 
	{
		document.getElementById("update_validator_output").innerHTML = "perform_validation_save: complete";
	}).fail(function(ex) {
	document.getElementById("update_validator_output").innerHTML = ex;	
  });
}


function update_validator_click()
{

	document.getElementById("update_validator_output").innerHTML = "";	

	var metadata_url = location.protocol + '//' + location.host + '/api/metadata';

	$.ajax({
			url: metadata_url
	}).done(function(metadata_response) 
	{

			if(metadata_response)
			{
				perform_validation_save(metadata_response);
			}

	});




}




function run_db_setup_click()
{
	document.getElementById("config_form_output").innerHTML = "";

	var base = location.protocol + '//' + location.host + '/api/db_setup';
	var query_string = [];

	var p_target_db_user_name = document.getElementById("p_target_db_user_name").value;
	var p_target_db_password = document.getElementById("p_target_db_password").value;

if
(
p_target_db_user_name && 
p_target_db_password 
)
{
	query_string.push("?p_target_db_user_name=" + p_target_db_user_name);
	query_string.push("p_target_db_password=" + p_target_db_password);

	var setup_url = base + query_string.join("&");
}
else
{
	document.getElementById("config_form_output").innerHTML = "all target information must be completed";
}
	



	$.ajax({
			url: setup_url
	}).done(function(setup_response) 
	{

			if(setup_response)
			{
				document.getElementById("config_form_output").innerHTML = JSON.stringify(setup_response);
			}

	});
}

function get_eval_string(p_path)
{
	var result = "g_metadata" + p_path.replace(new RegExp('/','gm'),".").replace(new RegExp('\\.(\\d+)\\.','gm'),"[$1].").replace(new RegExp('\\.(\\d+)$','g'),"[$1]");

	return result;

}