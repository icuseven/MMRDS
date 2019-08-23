
function page_render(p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx)
{
	var stack = [];
	var result = [];


	switch(p_metadata.type.toLowerCase())
  	{
		case 'grid':
			grid_render(result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
		case 'group':
			group_render(result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
		case 'form':
			form_render(result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
		case 'app':
			app_render(result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
		case 'label':
			label_render(result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
		case 'button':
			page_render_create_input(result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);
			break;
		case 'string':
			let string_data = p_data;
			if
			(
				p_metadata.mirror_reference &&
				p_metadata.mirror_reference.length > 0
			)
			{
				let mirror_object = get_data_object_for_mirror(p_metadata.mirror_reference);

				if(mirror_object)
				{
					string_data = mirror_object;
				}
			}		
			string_render(result, p_metadata, string_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
				
		case 'address':
		case 'textarea':
			
			let textarea_data = p_data;
			if
			(
				p_metadata.mirror_reference &&
				p_metadata.mirror_reference.length > 0
			)
			{
				let mirror_object = get_data_object_for_mirror(p_metadata.mirror_reference);

				if(mirror_object)
				{
					textarea_data = mirror_object;
				}
			}
			textarea_render(result, p_metadata, textarea_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
		case 'number':
			let number_data = p_data;
			if
			(
				p_metadata.mirror_reference &&
				p_metadata.mirror_reference.length > 0
			)
			{
				let mirror_object = get_data_object_for_mirror(p_metadata.mirror_reference);

				if(mirror_object)
				{
					number_data = mirror_object;
				}
			}			
			number_render(result, p_metadata, number_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
		case 'boolean':
			boolean_render(result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
		case 'list':
			list_render(result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
		case 'date':
			let date_data = p_data;
			if
			(
				p_metadata.mirror_reference &&
				p_metadata.mirror_reference.length > 0
			)
			{
				let mirror_object = get_data_object_for_mirror(p_metadata.mirror_reference);

				if(mirror_object)
				{
					date_data = mirror_object;
				}
			}			
			date_render(result, p_metadata, date_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;	
		case 'datetime':
			let datetime_data = p_data;
			if
			(
				p_metadata.mirror_reference &&
				p_metadata.mirror_reference.length > 0
			)
			{
				let mirror_object = get_data_object_for_mirror(p_metadata.mirror_reference);

				if(mirror_object)
				{
					datetime_data = mirror_object;
				}
			}			
			datetime_render(result, p_metadata, datetime_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
		case 'time':
			let time_data = p_data;
			if
			(
				p_metadata.mirror_reference &&
				p_metadata.mirror_reference.length > 0
			)
			{
				let mirror_object = get_data_object_for_mirror(p_metadata.mirror_reference);

				if(mirror_object)
				{
					time_data = mirror_object;
				}
			}			
			time_render(result, p_metadata, time_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
		case 'chart':
			chart_render(result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;			
		case 'hidden':
			hidden_render(result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;
		case 'jurisdiction':
			let jurisdiction_data = p_data;
			if
			(
				p_metadata.mirror_reference &&
				p_metadata.mirror_reference.length > 0
			)
			{
				let mirror_object = get_data_object_for_mirror(p_metadata.mirror_reference);

				if(mirror_object)
				{
					jurisdiction_data = mirror_object;
				}
			}
			user_jurisdiction_render(result, p_metadata, jurisdiction_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx);
			break;						
		default:
			console.log("page_render not processed", p_metadata);
			break;
	}

	return result;

}

function get_style_string(p_style_string)
{

	//"{"position":"absolute","top":12,"left":8,"height":50,"width":110.219,"font-weight":"400","font-size":"16px","font-style":"normal","color":"rgb(0, 0, 0)"}"
	var result = p_style_string.substring(1);

	result = result.replace(/["']/g, "").replace("{","").replace("}","").replace(/,/g, ";");


	return result;
}


function get_grid_style_string(p_grid_style_string, p_style_string)
{
	var top_regex = /"top":(\d+\.?\d*),/;
	var left_regex = /"left":(\d+\.?\d*),/;
	var grid_top =  null;
	var grid_left = null;
	var other_top = null;
	var other_left = null;


	var new_top = null;
	var new_left = null;

	var match = top_regex.exec(p_grid_style_string);
	grid_top = new Number(match[1]);
	match = left_regex.exec(p_grid_style_string);
	grid_left = new Number(match[1]);
	match = top_regex.exec(p_style_string);
	other_top = new Number(match[1]);
	match = left_regex.exec(p_style_string);
	other_left = new Number(match[1]);
	//"{"position":"absolute","top":12,"left":8,"height":50,"width":110.219,"font-weight":"400","font-size":"16px","font-style":"normal","color":"rgb(0, 0, 0)"}"
	var result = p_style_string.substring(1);

	result = result.replace(/["']/g, "").replace("{","").replace("}","").replace(/,/g, ";");


	return result;
}


function convert_dictionary_path_to_array_field(p_path)
{

	//g_data.prenatal.routine_monitoring.systolic_bp
	//er_visit_and_hospital_medical_records/vital_signs/date_and_time
	//er_visit_and_hospital_medical_records[current_index]/vital_signs[]/date_and_time
	/* [
			er_visit_and_hospital_medical_records[current_index]/vital_signs,
			date_and_time
	 ]

	*/
	//g_data.er_visit_and_hospital_medical_records[current_index].vital_signs[].date_and_time
	//var temp = "g_data." + p_path.replace(new RegExp('/','gm'),".").replace(new RegExp('\\.(\\d+)\\.','gm'),"[$1].").replace(new RegExp('\\.(\\d+)$','g'),"[$1]");

	var result = []
	var temp = "g_data." + p_path.replace(new RegExp('/','gm'),".");
	
	var multi_form_check = temp.split(".") ;
	var check_path = eval(multi_form_check[0] + "." + multi_form_check[1]);
	if(Array.isArray(check_path))
	{
		var new_path = [];
		for(var i = 0; i < multi_form_check.length; i++)
		{
			
			if(i == 1)
			{
				new_path.push(multi_form_check[i] + "[" + $mmria.get_current_multiform_index() + "]");
			}
			else
			{
				new_path.push(multi_form_check[i]);
			}
		}
		var path = new_path.join('.');
		var index = path.lastIndexOf('.');
		result.push(path.substr(0, index));
		result.push(path.substr(index + 1, path.length - (index + 1)));
	}
	else
	{
		var index = temp.lastIndexOf('.');
		result.push(temp.substr(0, index));
		result.push(temp.substr(index + 1, temp.length - (index + 1)));
	}

	return result;
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

function page_render_create_input(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path)
{

	p_result.push("<input ");


	if
	(
		p_metadata.is_read_only && 	
		(
			p_metadata.is_read_only == true ||
			p_metadata.is_read_only == "true" ||
			(
				p_metadata.mirror_reference &&
				p_metadata.mirror_reference.length > 0
			)
		)
	)
	{
				p_result.push(" readonly='true' ");
	}


	p_result.push(" style='");
	
	var style_object = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];

	if(style_object)
    {
        p_result.push(get_style_string(style_object.control.style));
    }
    p_result.push("' ");


	p_result.push(" class='");
	p_result.push(p_metadata.type.toLowerCase());
	
	if
	(
		p_metadata.type.toLowerCase() == "number" && 	
		p_metadata.decimal_precision && 
		p_metadata.decimal_precision != ""
	)
	{
				p_result.push(p_metadata.decimal_precision);
	}
	

	if(p_metadata.type=="date")
	{
		p_result.push(" date");
	}
	
	if(p_metadata.type=="button")
	{
		p_result.push(" btn btn-secondary");
	}
	
	p_result.push("' dpath='");
	p_result.push(p_dictionary_path.substring(1, p_dictionary_path.length));
	
	if(p_metadata.type=="button")
	{
		p_result.push("' type='button' name='");
		p_result.push(p_metadata.name);
		p_result.push("' value='");
		p_result.push(p_metadata.prompt.replace(/'/g, "\\'"));
		p_result.push("' ");

		if(p_metadata.type == "")
		{
			p_result.push("placeholder='");
			if(p_metadata.prompt.length > 25)
			{
				p_result.push(p_metadata.prompt.substring(0, 25).replace(/'/g, "\\'"));
			}
			else
			{
				p_result.push(p_metadata.prompt.replace(/'/g, "\\'"));
			}
			
			p_result.push("' ");
		}


		
		var f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ocl";
		if(path_to_onclick_map[p_metadata_path])
		{
			page_render_create_event(p_result, "onclick", p_metadata.onclick, p_metadata_path, p_object_path, p_dictionary_path)
		}
		
	}
	else
	{
		if(p_metadata.type.toLowerCase() == "hidden")
		{
			p_result.push("' type='hidden' name='");
		}
		else
		{
			p_result.push("' type='text' name='");
		}
		
		p_result.push(p_metadata.name);
		p_result.push("' value='");
		if(p_data || p_data == 0)
		{ 
			if (typeof p_data === 'string' || p_data instanceof String)
			{
				p_result.push(p_data.replace(/'/g, "&apos;"));
			}
			else
			{
				p_result.push(p_data);
			}
			
		}
		p_result.push("' ");

		if
		(
			!(
				p_metadata.mirror_reference &&
				p_metadata.mirror_reference.length > 0
			)
		)
		{
			var f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_of";
			if(path_to_onfocus_map[p_metadata_path])
			{
				page_render_create_event(p_result, "onfocus", p_metadata.onfocus, p_metadata_path, p_object_path, p_dictionary_path)
			}

			f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_och";
			if(path_to_onchange_map[p_metadata_path])
			{
				page_render_create_event(p_result, "onchange", p_metadata.onchange, p_metadata_path, p_object_path, p_dictionary_path)
			}
			
			f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ocl";
			if(path_to_onclick_map[p_metadata_path])
			{
				page_render_create_event(p_result, "onclick", p_metadata.onclick, p_metadata_path, p_object_path, p_dictionary_path)
			}
			
			page_render_create_onblur_event(p_result, p_metadata, p_metadata_path, p_object_path, p_dictionary_path);
		}
	}

	p_result.push("/>");

	
}


function page_render_create_event(p_result, p_event_name, p_code_json, p_metadata_path, p_object_path, p_dictionary_path)
{
	var post_fix = null;

/*
var path_to_int_map = [];
var path_to_onblur_map = [];
var path_to_onclick_map = [];
var path_to_onfocus_map = [];
var path_to_onchange_map = [];
var path_to_source_validation = [];
var path_to_derived_validation = [];
var path_to_validation_description = [];
*/

	switch(p_event_name)
	{
		case "onfocus":
			post_fix = "_of";
			break;
		case "onchange":
			post_fix = "_och";
			break;
		case "onclick":
			post_fix = "_ocl";
			break;
		default:
			console.log("page_render_create_event - missing case: " + p_event_name);
			break;
	}

	//var source_code = escodegen.generate(p_metadata.onfocus);
	var code_array = [];
	
	code_array.push("x" + path_to_int_map[p_metadata_path].toString(16) + post_fix);
	code_array.push(".call(");
	code_array.push(p_object_path.substring(0, p_object_path.lastIndexOf(".")));
	code_array.push(", this);");

	p_result.push(" ");
	p_result.push(p_event_name);
	p_result.push("='");
	p_result.push(code_array.join('').replace(/'/g,"\""));
	p_result.push("'");
	
}


function page_render_create_onblur_event(p_result, p_metadata, p_metadata_path, p_object_path, p_dictionary_path)
{
/*
var path_to_int_map = [];
var path_to_onblur_map = [];
var path_to_onclick_map = [];
var path_to_onfocus_map = [];
var path_to_onchange_map = [];
var path_to_source_validation = [];
var path_to_derived_validation = [];
var path_to_validation_description = [];
*/
	var f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ob";
	if(path_to_onblur_map[p_metadata_path])
	{
		//var source_code = escodegen.generate(p_metadata.onfocus);
		var code_array = [];
		
		
		code_array.push("(function x" + path_to_int_map[p_metadata_path].toString(16) + "_sob(p_control){\n");
		code_array.push("x" + path_to_int_map[p_metadata_path].toString(16) + "_ob");
		code_array.push(".call(");
		code_array.push(p_object_path.substring(0, p_object_path.lastIndexOf(".")));
		code_array.push(", p_control);\n");
		
		code_array.push("g_set_data_object_from_path(\"");
		code_array.push(p_object_path);
		code_array.push("\",\"");
		code_array.push(p_metadata_path);
		code_array.push("\",\"");
		code_array.push(p_dictionary_path);
		code_array.push("\",p_control.value);\n}).call(");
		code_array.push(p_object_path.substring(0, p_object_path.lastIndexOf(".")));
		code_array.push(", event.target);");

		p_result.push(" onblur='");
		p_result.push(code_array.join('').replace(/'/g,"\""));
		p_result.push("'");
	}
	else //if(p_metadata.type!="number")
	{
		p_result.push(" onblur='g_set_data_object_from_path(\"");
		p_result.push(p_object_path);
		p_result.push("\",\"");
		p_result.push(p_metadata_path);
		p_result.push("\",\"");
		p_result.push(p_dictionary_path);
		if(p_metadata.type=="boolean")
		{
			p_result.push("\",this.checked)'");
		}
		else
		{
			p_result.push("\",this.value)'");
		}
		
	}
	
}


function page_render_create_onchange_event(p_result, p_metadata, p_metadata_path, p_object_path)
{
/*
var path_to_int_map = [];
var path_to_onblur_map = [];
var path_to_onclick_map = [];
var path_to_onfocus_map = [];
var path_to_onchange_map = [];
var path_to_source_validation = [];
var path_to_derived_validation = [];
var path_to_validation_description = [];
*/

	var f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_och";
	if(path_to_onchange_map[p_metadata_path])
	{
		//var source_code = escodegen.generate(p_metadata.onfocus);
		var code_array = [];
		
		
		code_array.push("(function x" + path_to_int_map[p_metadata_path].toString(16) + "_sob(p_control){\n");
		code_array.push("x" + path_to_int_map[p_metadata_path].toString(16) + "_och");
		code_array.push(".call(");
		code_array.push(p_object_path.substring(0, p_object_path.lastIndexOf(".")));
		code_array.push(", p_control);\n");
		
		code_array.push("g_set_data_object_from_path(\"");
		code_array.push(p_object_path);
		code_array.push("\",\"");
		code_array.push(p_metadata_path);
		code_array.push("\",\"");
		code_array.push(p_dictionary_path);
		code_array.push("\",p_control.value);\n}).call(");
		code_array.push(p_object_path.substring(0, p_object_path.lastIndexOf(".")));
		code_array.push(", event.target);");

		p_result.push(" onchange='");
		p_result.push(code_array.join('').replace(/'/g,"\""));
		p_result.push("'");
	}
	else
	{
		p_result.push(" onchange='g_set_data_object_from_path(\"");
		p_result.push(p_object_path);
		p_result.push("\",\"");
		p_result.push(p_metadata_path);
		p_result.push("\",\"");
		p_result.push(p_dictionary_path);
		if(p_metadata.type=="boolean")
		{
			p_result.push("\",this.checked)'");
		}
		else
		{
			p_result.push("\",this.value)'");
		}
		
	}
	
}

function page_render_create_checkbox(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path)
{
	p_result.push("<input  class='checkbox' type='checkbox' name='");
	p_result.push(p_metadata.name);
	if(p_data == true)
	{
		p_result.push("' checked='true'");
	}
	else
	{
		p_result.push("'  value='");
	}
	p_result.push(p_data);
	p_result.push("' ");

	var style_object = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];
    if(style_object)
    {
        p_result.push(" style='");
        p_result.push(get_style_string(style_object.control.style));
        p_result.push("'");
    }


	var f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_of";
	if(path_to_onfocus_map[p_metadata_path])
	{
		page_render_create_event(p_result, "onfocus", p_metadata.onfocus, p_metadata_path, p_object_path, p_dictionary_path)
	}

	f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_och";
	if(path_to_onchange_map[p_metadata_path])
	{
		page_render_create_event(p_result, "onchange", p_metadata.onchange, p_metadata_path, p_object_path, p_dictionary_path)
	}
	
	f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ocl";
	if(path_to_onclick_map[p_metadata_path])
	{
		page_render_create_event(p_result, "onclick", p_metadata.onclick, p_metadata_path, p_object_path, p_dictionary_path)
	}
	
	page_render_create_onblur_event(p_result, p_metadata, p_metadata_path, p_object_path, p_dictionary_path);



	p_result.push("/>");
	
}


function page_render_create_textarea(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path)
{

	//hack
	if(p_metadata.name == "case_opening_overview")
	{
		p_result.push("<textarea  rows=30 cols=120 name='");
	}
	else
	{
		p_result.push("<textarea  name='");
	}
	p_result.push(p_metadata.name);
	p_result.push("' ");


	p_result.push(" class='");
	p_result.push(p_metadata.type.toLowerCase());
	p_result.push("' ");

	if
	(
		p_metadata.is_read_only && 	
		(
			p_metadata.is_read_only == true ||
			p_metadata.is_read_only == "true"
		)
	)
	{
				p_result.push(" readonly='true' ");
	}

	var style_object = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];
    if(style_object)
    {
        p_result.push(" style='");
        p_result.push(get_style_string(style_object.control.style));
        p_result.push("'");
    }

	var f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_of";
	if(path_to_onfocus_map[p_metadata_path])
	{
		page_render_create_event(p_result, "onfocus", p_metadata.onfocus, p_metadata_path, p_object_path, p_dictionary_path)
	}

	f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ochs";
	if(path_to_onchange_map[p_metadata_path])
	{
		page_render_create_event(p_result, "onchange", p_metadata.onchange, p_metadata_path, p_object_path, p_dictionary_path)
	}
	
	f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ocl";
	if(path_to_onclick_map[p_metadata_path])
	{
		page_render_create_event(p_result, "onclick", p_metadata.onclick, p_metadata_path, p_object_path, p_dictionary_path)
	}
	
	page_render_create_onblur_event(p_result, p_metadata, p_metadata_path, p_object_path, p_dictionary_path);

	p_result.push(" >");
	p_result.push(p_data);
	p_result.push("</textarea>");
	
}

function convert_object_path_to_jquery_id(p_value)
{
	return p_value.replace(/\./g,"_").replace(/\[/g,"_").replace(/\]/g,"_")
}


function make_c3_date(p_value)
{
	//'%Y-%m-%d %H:%M:%S
	
	var date_time = new Date(p_value);

	var result = [];

	result.push(date_time.getFullYear());
	result.push("-");
	result.push(date_time.getMonth() + 1);
	result.push("-");
	result.push(date_time.getDate());

	result.push(" ");
	result.push(date_time.getHours());
	result.push(":");
	result.push(date_time.getMinutes());
	result.push(":");
	result.push(date_time.getSeconds());

	return result.join("");
}

function get_style_string(p_specicification_style_string)
{

    var result = [];

    var properly_formated_style = p_specicification_style_string;
    properly_formated_style = properly_formated_style.replace(/[{}]/g, ""); 
    properly_formated_style = properly_formated_style.replace(/['"]+/g, '');
    properly_formated_style = properly_formated_style.replace(/[,]+/g, ';');


    properly_formated_style = properly_formated_style.replace(/(\d+); (\d+); (\d+)/g, '$1, $2, $3');
    //"position:absolute;top:4;left:13;height:46px;width:146.188px;font-weight:400;font-size:16px;font-style:normal;color:rgb(33; 37; 41)"ui_specification
    var items = properly_formated_style.split(";")
    for(var i in items)
    {
        var pair = items[i].split(":");
        switch(pair[0].toLocaleLowerCase())
        {
            case "top":
            case "left":
            case "height":
            case "width":
            case "font-size":
                var value = pair[1].trim();
                if(/px$/.test(value))
                {
                    result.push(pair[0] + ":" + value);
                }
                else
                {
                    result.push(pair[0] + ":" + pair[1].trim() + "px");
                }
            break;

            default:
                result.push(pair.join(":"));
            break;
        }

    }

    return result.join(";");
}


function get_only_size_and_position_string(p_specicification_style_string)
{

    var result = [];

    var properly_formated_style = p_specicification_style_string;
    properly_formated_style = properly_formated_style.replace(/[{}]/g, ""); 
    properly_formated_style = properly_formated_style.replace(/['"]+/g, '');
    properly_formated_style = properly_formated_style.replace(/[,]+/g, ';');


    properly_formated_style = properly_formated_style.replace(/(\d+); (\d+); (\d+)/g, '$1, $2, $3');
    //"position:absolute;top:4;left:13;height:46px;width:146.188px;font-weight:400;font-size:16px;font-style:normal;color:rgb(33; 37; 41)"ui_specification
    var items = properly_formated_style.split(";")
    for(var i in items)
    {
        var pair = items[i].split(":");
        switch(pair[0].toLocaleLowerCase())
        {
            case "top":
            case "left":
            case "height":
            case "width":
                var value = pair[1].trim();
                if(/px$/.test(value))
                {
                    result.push(pair[0] + ":" + value);
                }
                else
                {
                    result.push(pair[0] + ":" + pair[1].trim() + "px");
                }
                break;
            case "position":
                result.push(pair.join(":"));
                break;
        }

    }

    return result.join(";");
}

function get_only_font_style_string(p_specicification_style_string)
{

    var result = [];

    var properly_formated_style = p_specicification_style_string;
    properly_formated_style = properly_formated_style.replace(/[{}]/g, ""); 
    properly_formated_style = properly_formated_style.replace(/['"]+/g, '');
    properly_formated_style = properly_formated_style.replace(/[,]+/g, ';');
    properly_formated_style = properly_formated_style.replace(/(\d+); (\d+); (\d+)/g, '$1, $2, $3');
    //"position:absolute;top:4;left:13;height:46px;width:146.188px;font-weight:400;font-size:16px;font-style:normal;color:rgb(33; 37; 41)"
    var items = properly_formated_style.split(";")
    for(var i in items)
    {
        var pair = items[i].split(":");
        switch(pair[0].toLocaleLowerCase())
        {
            case "font-size":
                var value = pair[1].trim();
                if(/px$/.test(value))
                {
                    result.push(pair[0] + ":" + value);
                }
                else
                {
                    result.push(pair[0] + ":" + pair[1].trim() + "px");
                }
                break;

            case "font-weight":
            case "color":
                result.push(pair.join(":"));
                break;
        }

    }

    return result.join(";");
}

function get_chart_size(p_style_string)
{

	var result = {
		height: 240,
		width: 480,
		top: 10,
		left:10
	};

	var top_regex = /"top":(\d+\.?\d*),/;
	var left_regex = /"left":(\d+\.?\d*),/;

	var width_regex = /"width":(\d+\.?\d*),/;
	var height_regex = /"height":(\d+\.?\d*),/;


	var outer_witdh =  null;
	var outer_height = null;
	var outer_top = null;
	var outer_left = null;


	var new_top = null;
	var new_left = null;
	var new_width = null;
	var new_height = null;



	var match = top_regex.exec(p_style_string);
	outer_top = new Number(match[1]);

	match = left_regex.exec(p_style_string);
	outer_left = new Number(match[1]);

	match = width_regex.exec(p_style_string);
	outer_witdh = new Number(match[1]);

	match = height_regex.exec(p_style_string);
	outer_height = new Number(match[1]);

	result.height = outer_height - 5;
	result.width = outer_witdh - 5;

	//"{"position":"absolute","top":12,"left":8,"height":50,"width":110.219,"font-weight":"400","font-size":"16px","font-style":"normal","color":"rgb(0, 0, 0)"}"

	return result;
}

function get_data_object_for_mirror(p_mirror_reference)
{
	return eval("g_data." + p_mirror_reference.replace(/\//g, "."));
}