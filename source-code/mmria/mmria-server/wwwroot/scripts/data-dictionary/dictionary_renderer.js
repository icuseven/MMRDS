function dictionary_render(p_metadata, p_path)
{
	var result = [];
				
	if(p_metadata.type.toLowerCase() == 'app')
	{
		result.push('<table border=1>');
		result.push('<tr><th colspan="23">');
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

	result.push('<tr><th>path</th>');
	result.push('<th>name</th>');
	result.push('<th>type</th>');
	result.push('<th>prompt</th>');
	result.push('<th>control_style</th>');
	result.push('<th>description</th>');
	result.push('<th>is_save_value_display_description</th>');
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

function dictionary_render_row(p_metadata, p_path)
{
	var result = [];

	result.push('<tr><td>' + p_path + '</td>');
	result.push('<td>' + ((p_metadata['name'])? p_metadata['name']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['type'])? p_metadata['type']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['prompt'])? p_metadata['prompt']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['control_style'])? p_metadata['control_style']: "&nbsp;") + '</td>');
	result.push('<td>' + ((p_metadata['description'])? p_metadata['description']: "&nbsp;") + '</td>');
	

	if(p_metadata.type.toLowerCase() == "list")
	{
		result.push('<td>')
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
		result.push("<td>&nbsp;</td>");
	}


	if(p_metadata.values)
	{
		result.push('<td valign="center"><table><tr style="background-color:#FF7777;color:#FFFFFF"><th>value</th><th>description</th></tr>');
		for(var i = 0; i < p_metadata.values.length; i++)
		{
			var child = p_metadata.values[i];
			if(i % 2)
			{
				result.push("<tr style='background-color:#BBBBBB'><td>");
			}
			else
			{
				result.push("<tr><td>");
			}
			if(child.value == "")
			{
				result.push("(blank)");
			}
			else
			{
				result.push(child.value);
			}
			
			result.push("</td><td>")
			if(child.description == "")
			{
				result.push("(blank)");
			}
			else
			{
				result.push(child.description);
			}
			result.push('</td></tr>');
		}
		result.push('</table></td>');
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
