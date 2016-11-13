
function get_metadata_eval_string(p_path)
{
	var result = "g_metadata" + p_path.replace(new RegExp('/','gm'),".").replace(new RegExp('\\.(\\d+)\\.','gm'),"[$1].").replace(new RegExp('\\.(\\d+)$','g'),"[$1]");

	return result;
}


function create_validator_map(p_metadata_path_map, p_validator_map, p_validation_description_map, p_metadata, p_path)
{

	p_metadata_path_map[p_path] = get_metadata_eval_string(p_path);

	if(p_metadata.validation_description && p_metadata.validation_description != '')
	{
			p_validation_description_map[p_path] = p_metadata.validation_description;
	}


	var result = [];
	result.push("function (value)\n{\n var result = false;\n ");
 
	// is required
	// max_value
	// min_value
	// regex_pattern
	// validator
	// is_read_only
	switch(p_metadata.type.toLowerCase())
	{

		case "number":
			if(p_metadata.is_required && p_metadata.is_required == true)
			{
					result.push("if(value == null || value == '') return false;");
			}

			if(p_metadata.max_value && p_metadata.max_value == true)
			{
					result.push("if(value > new Number(");
					result.push(p_metadata.max_value);
					result.push(")) return false;");
			}
			
			if(p_metadata.min_value && p_metadata.min_value == true)
			{
					result.push("if(value < new Number(");
					result.push(p_metadata.max_value);
					result.push(")) return false;");
			}

			if(p_metadata.regex_pattern && p_metadata.regex_pattern  == true)
			{
					result.push("if(value < new Number(");
					result.push(p_metadata.max_value);
					result.push(")) return false;");
			}

			if(p_metadata.validator && p_metadata.validator == true)
			{
					result.push("if(value < new Number(");
					result.push(p_metadata.max_value);
					result.push(")) return false;");
			}
			break;
		case "string":
		default:
			if(p_metadata.is_required && p_metadata.is_required == true)
			{

			}

			if(p_metadata.max_value && p_metadata.max_value == true)
			{

			}
			
			if(p_metadata.min_value && p_metadata.min_value == true)
			{

			}

			if(p_metadata.regex_pattern && p_metadata.regex_pattern  == true)
			{

			}

			if(p_metadata.validator && p_metadata.validator == true)
			{

			}
			break;
	}

	result.push(" return result;\n}")


/*
if(p_metadata.is_required && p_metadata.is_required == true)
{

}

if(p_metadata.max_value && p_metadata.max_value == true)
{

}
 
if(p_metadata.min_value && p_metadata.min_value == true)
{

}

if(p_metadata.regex_pattern && p_metadata.regex_pattern  == true)
{

}

if(p_metadata.validator && p_metadata.validator == true)
{

}
*/
// is_read_only



	if(p_metadata.type.toLowerCase() == 'app')
	{
		result.push('<table border=1>');
		result.push('<tr><th colspan="22">');
		result.push(p_path);
		result.push(' ');
		result.push(p_metadata.name);
		result.push(' ');
		result.push(p_metadata.prompt);
		result.push(' ');
		result.push(p_metadata.type);
		result.push('</th></tr>');
	}
	else
	{
		Array.prototype.push.apply(result, create_validator_map(p_metadata_path_map, p_validator_map, p_validation_description_map, p_metadata, p_path));
	}

	if(p_metadata.children && p_metadata.children.length > 0)
	{
		
		Array.prototype.push.apply(result, dictionary_render_header());
		
		for(var i = 0; i < p_metadata.children.length; i++)
		{
			var child = p_metadata.children[i];

			if(p_metadata.type.toLowerCase() == 'app')
			{
				Array.prototype.push.apply(result, dictionary_render(child, child.name));
			}
			else
			{
				Array.prototype.push.apply(result, dictionary_render(child, p_path + "/" + child.name));
			}
		}
	}

	if(p_metadata.type.toLowerCase() == 'app')
	{
		result.push("</table>");
	}

	return result;
}

function dictionary_render_header()
{
	var result = [];

	result.push('<tr><th>path</th>');
	result.push('<th>name</th>');
	result.push('<th>type</th>');
	result.push('<th>prompt</th>');
	result.push('<th>control_style</th>');
	result.push('<th>description</th>');
	result.push('<th>values</th>');
	result.push('<th>is_core_summary</th>');
	result.push('<th>is_required</th>');
	result.push('<th>is_multiselect</th>');
	result.push('<th>is_read_only</th>');
	result.push('<th>default_value</th>');
	result.push('<th>regex_pattern</th>');
	result.push('<th>pre_fill</th>');
	result.push('<th>max_value</th>');
	result.push('<th>min_value</th>');	
	result.push('<th>validation</th>');
	result.push('<th>validation_description</th>');
	result.push('<th>onfocus</th>');
	result.push('<th>onchange</th>');
	result.push('<th>onblur</th>');
	result.push('<th>onclick</th>');

	
	result.push('</tr>');
	return result;

}

function create_validator_map(p_metadata, p_path)
{
	var result = [];

	result.push('<tr><td>' + p_path + '</td>');
	result.push('<td>' + ((p_metadata['name'])? p_metadata['name']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['type'])? p_metadata['type']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['prompt'])? p_metadata['prompt']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['control_style'])? p_metadata['control_style']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['description'])? p_metadata['description']: "&nbsp;") + '</td>');
	if(p_metadata.values)
	{
		result.push('<td valign="center">');
		for(var i = 0; i < p_metadata.values.length; i++)
		{
			var child = p_metadata.values[i];
			result.push(child);
			result.push('<br/>');
		}
		result.push('</td>');
	}
	else
	{
		result.push('<td>&nbsp;</td>');
	}

	result.push('<td>' + ((p_metadata['is_core_summary'])? p_metadata['is_core_summary']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['is_required'])? p_metadata['is_required']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['is_multiselect'])? p_metadata['is_multiselect']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['is_read_only'])? p_metadata['is_read_only']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['default_value'])? p_metadata['default_value']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['regex_pattern'])? p_metadata['regex_pattern']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['pre_fill'])? p_metadata['pre_fill']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['max_value'])? p_metadata['max_value']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['min_value'])? p_metadata['min_value']: "&nbsp;") + '</td>');	
	result.push('<td>' + ((p_metadata['validation'])? p_metadata['validation']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['validation_description'])? p_metadata['validation_description']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['onfocus'])? p_metadata['onfocus']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['onchange'])? p_metadata['onchange']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['onblur'])? p_metadata['onblur']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['onclick'])? p_metadata['onclick']: "&nbsp;") + '</td>');

	


	result.push('</tr>');

	return result;

}
