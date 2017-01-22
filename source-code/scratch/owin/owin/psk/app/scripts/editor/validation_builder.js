

var path_to_node_map = [];
var path_to_int_map = [];
var path_to_onblur_map = [];
var path_to_onclick_map = [];
var path_to_onfocus_map = [];
var path_to_onchange_map = [];
var path_to_validation = [];
var path_to_validation_description = [];
var object_path_to_metadata_path_map = [];

//generate_validation(g_metadata, metadata_list, "", object_list, "", path_to_node_map, path_to_int_map, path_to_onblur_map, path_to_onclick_map, path_to_onfocus_map, path_to_onchange_map, path_to_validation, path_to_validation_description, object_path_to_metadata_path_map);

function generate_validation(p_metadata, p_metadata_list, p_path, p_object_list, p_object_path, p_path_to_node_map, p_path_to_int_map, p_path_to_onblur_map, p_path_to_onclick_map, p_path_to_onfocus_map, p_path_to_onchange_map, p_path_to_validation, p_path_to_validation_description, p_object_path_to_metadata_path_map)
{
    p_path_to_node_map[p_path] = p_metadata;
    p_path_to_int_map[p_path] = p_metadata_list.length;
	p_metadata_list.push(p_path);
	p_object_list.push(p_object_path);

    p_object_path_to_metadata_path_map[p_object_path] = p_path;

    if(p_metadata.onblur && p_metadata.onblur != "")
    {
         p_path_to_onblur_map[p_path] = p_metadata.onblur;
    }

    if(p_metadata.onclick && p_metadata.onclick != "")
    {
        p_path_to_onclick_map[p_path] = p_metadata.onclick;
    }

    if(p_metadata.onfocus && p_metadata.onfocus != "")
    {
        p_path_to_onfocus_map[p_path] = p_metadata.onfocus;
    }

    if(p_metadata.onchange && p_metadata.onchange != "")
    {
        p_path_to_onchange_map[p_path] = p_metadata.onchange;
    }
 
    if(p_metadata.validation && p_metadata.validation != "")
    {
        p_path_to_validation[p_path] = p_metadata.validation;
    }

	if(p_metadata.validation_description && p_metadata.validation_description != '')
	{
			p_path_to_validation_description[p_path] = p_metadata.validation_description;
	}

	if(p_metadata.children && p_metadata.children.length > 0)
	{		
		for(var i = 0; i < p_metadata.children.length; i++)
		{
			var child = p_metadata.children[i];

 			generate_validation(child, p_metadata_list, p_path + "/children/" + i, p_object_list, p_object_path + "/" + child.name, p_path_to_node_map, p_path_to_int_map, p_path_to_onblur_map, p_path_to_onclick_map, p_path_to_onfocus_map, p_path_to_onchange_map, p_path_to_validation, p_path_to_validation_description, p_object_path_to_metadata_path_map);


		}
	}

}


function create_validator_function(p_validator_map, p_validation_description_map, p_metadata, p_path)
{

	if(p_metadata.validation_description && p_metadata.validation_description != '')
	{
			p_validation_description_map[p_path] = p_metadata.validation_description;
	}


	var result = [];
	result.push("( function (value)\n{\n ");
	var validation_added = false;
 
	// is required
	// max_value
	// min_value
	// regex_pattern
	// validator
	// is_read_only


	if(p_metadata.is_read_only && p_metadata.is_read_only == true)
	{
			result.push("\nreturn false;\n");
			validation_added = true;
	}

	switch(p_metadata.type.toLowerCase())
	{
		case "number":
			if(p_metadata.is_required && p_metadata.is_required == true)
			{
					result.push("if(value == null || value == '') return false;\n");
					validation_added = true;
			}

			if(p_metadata.max_value && p_metadata.max_value == true)
			{
					result.push("if(value > new Number(");
					result.push(p_metadata.max_value);
					result.push(")) return false;\n");
					validation_added = true;
			}
			
			if(p_metadata.min_value && p_metadata.min_value == true)
			{
					result.push("if(value < new Number(");
					result.push(p_metadata.min_value);
					result.push(")) return false;\n");
					validation_added = true;
			}
			break;
		case "date":
		case "datetime":
			if(p_metadata.is_required && p_metadata.is_required == true)
			{
					result.push("if(value == null || value == '') return false;\n");
					validation_added = true;
			}

			if(p_metadata.max_value && p_metadata.max_value == true)
			{
					result.push("if(value > new Date(");
					result.push(p_metadata.max_value);
					result.push(")) return false;\n");
					validation_added = true;
			}
			
			if(p_metadata.min_value && p_metadata.min_value == true)
			{
					result.push("if(value < new Date(");
					result.push(p_metadata.min_value);
					result.push(")) return false;\n");
					validation_added = true;
			}
			break;
		case "string":
		default:
			if(p_metadata.is_required && p_metadata.is_required == true)
			{
				result.push("if(value == null || value == '') return false;\n");
				validation_added = true;
			}

			if(p_metadata.max_value && p_metadata.max_value == true)
			{
					result.push("if(value.length > new Number(");
					result.push(p_metadata.max_value);
					result.push(")) return false;\n");
					validation_added = true;
			}
			
			if(p_metadata.min_value && p_metadata.min_value == true)
			{
					result.push("if(value.length < new Number(");
					result.push(p_metadata.min_value);
					result.push(")) return false;\n");
					validation_added = true;
			}			
			break;
	}

	if(p_metadata.regex_pattern && p_metadata.regex_pattern.length > 0)
	{
		try
		{
			var reg_exp = new RegExp(p_metadata.regex_pattern);
		
			result.push("var regexp = /");
			result.push(p_metadata.regex_pattern);
			result.push("/;\nvar matches_array = value.match(regexp);");
			result.push("\nif(matches_array)\n{\t if(matches_array.length < 1) return false;\n\t}\n else return false;\n\n");
			validation_added = true;
		}
		catch(err)
		{

		}
	}


	if
	(
		p_metadata.validation && 
		p_metadata.validation != ""
	)
	{
		try
		{
			var source_code = escodegen.generate(p_metadata.validation);
			var code_array = [];
			code_array.push("return ");
			code_array.push(source_code.substring(0, source_code.length-1));
			code_array.push("(value);\n")
			validation_added = true;
			Array.prototype.push.apply(result,code_array);
		}
		catch(err)
		{
			/*
			try
			{
				var code_array = [];
				code_array.push("return ");
				code_array.push(p_metadata.validation);
				code_array.push("(value);\n")
				validation_added = true;
				Array.prototype.push.apply(result,code_array);
			}
			catch(err2)
			{

			}*/
			
		}
		
	}

	result.push(" return true;\n})")

	return result.join("");

}