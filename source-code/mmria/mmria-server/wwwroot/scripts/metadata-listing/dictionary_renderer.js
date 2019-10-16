function dictionary_render(p_metadata, p_path)
{
	var result = [];
				
	if(p_metadata.type.toLowerCase() == 'app')
	{
		result.push('<table class="table" border="1">');
		result.push('<thead class="thead">');
			result.push('<tr class="bg-primary">');
				result.push('<th class="th" colspan="23">');
				result.push(p_path);
				result.push(' ');
				result.push(p_metadata.name);
				result.push(' ');
				result.push(p_metadata.prompt);
				result.push(' ');
				result.push(p_metadata.type);
				result.push('</th>');
			result.push('</tr>');
		result.push('</thead>');
	}
	else
	{
		Array.prototype.push.apply(result, dictionary_render_row(p_metadata, p_path));
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

	result.push(`
		<tr class="tr bg-gray-l3">
			<th class="th">path</th>
			<th class="th">name</th>
			<th class="th">type</th>
			<th class="th">prompt</th>
			<th class="th">control_style</th>
			<th class="th">description</th>
			<th class="th">is_save_value_display_description</th>
			<th class="th">values</th>
			<th class="th">is_core_summary</th>
			<th class="th">is_required</th>
			<th class="th">is_multiselect</th>
			<th class="th">is_read_only</th>
			<th class="th">default_value</th>
			<th class="th">regex_pattern</th>
			<th class="th">pre_fill</th>
			<th class="th">max_value</th>
			<th class="th">min_value</th>	
			<th class="th">validation</th>
			<th class="th">validation_description</th>
			<th class="th">onfocus</th>
			<th class="th">onchange</th>
			<th class="th">onblur</th>
			<th class="th">onclick</th>
		</tr>
	`);

	return result;
}

function dictionary_render_row(p_metadata, p_path)
{
	var result = [];

	result.push('<tr class="tr">');
		result.push('<td class="td">' + p_path + '</td>');
		result.push('<td class="td">' + ((p_metadata['name'])? p_metadata['name']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['type'])? p_metadata['type']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['prompt'])? p_metadata['prompt']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['control_style'])? p_metadata['control_style']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['description'])? p_metadata['description']: "&nbsp;") + '</td>');
		
		if(p_metadata.type.toLowerCase() == "list")
		{
			result.push('<td class="td">')
			if
			(
				p_metadata['is_save_value_display_description'] &&
				p_metadata['is_save_value_display_description'] == true
			)
			{
				result.push("saves the value, displays the <strong>description</strong> in list.");
			}
			else
			{
				result.push("saves value, displays value.");
			}
				
			result.push('</td>');
		}
		else
		{
			result.push("<td class='td'>&nbsp;</td>");
		}

		if(p_metadata.values)
		{
			result.push('<td class="td"><table class="table"><tr class="tr bg-secondary"><th class="th">value</th><th class="th">description</th></tr>');

			let value_list = p_metadata.values;

			if(p_metadata.path_reference && p_metadata.path_reference != "")
			{
				value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));
		
				if(value_list == null)	
				{
					value_list = p_metadata.values;
				}
			}

			for(var i = 0; i < value_list.length; i++)
			{
				var child = value_list[i];
				if(i % 2)
				{
					result.push("<tr class='tr bg-gray-l3'><td>");
				}
				else
				{
					result.push("<tr class='tr'><td class='td'>");
				}
				if(child.value == "")
				{
					result.push("(blank)");
				}
				else
				{
					result.push(child.value);
				}
				
				result.push("</td><td class='td'>")
				if(child.display == "")
				{
					result.push("(blank)");
				}
				else
				{
					result.push(child.display);
				}
				result.push('</td></tr>');
			}
			result.push('</table></td>');
		}
		else
		{
			result.push('<td class="td">&nbsp;</td>');
		}

		result.push('<td class="td">' + ((p_metadata['is_core_summary'])? p_metadata['is_core_summary']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['is_required'])? p_metadata['is_required']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['is_multiselect'])? p_metadata['is_multiselect']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['is_read_only'])? p_metadata['is_read_only']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['default_value'])? p_metadata['default_value']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['regex_pattern'])? p_metadata['regex_pattern']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['pre_fill'])? p_metadata['pre_fill']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['max_value'])? p_metadata['max_value']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['min_value'])? p_metadata['min_value']: "&nbsp;") + '</td>');	
		result.push('<td class="td">' + ((p_metadata['validation'])? p_metadata['validation']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['validation_description'])? p_metadata['validation_description']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['onfocus'])? p_metadata['onfocus']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['onchange'])? p_metadata['onchange']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['onblur'])? p_metadata['onblur']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['onclick'])? p_metadata['onclick']: "&nbsp;") + '</td>');

	result.push('</tr>');

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
