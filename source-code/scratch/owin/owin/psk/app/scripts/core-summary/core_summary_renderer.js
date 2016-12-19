function core_summary_render(p_metadata, p_data,  p_path, p_ui, p_is_core_summary)
{
	var is_core_summary = false;

	if(p_is_core_summary)
	{
		is_core_summary = true;
	}


	var result = [];
	switch(p_metadata.type.toLowerCase())
	{
		case 'group':

				/*									
				result.push('<fieldset>');

				result.push('<legend>')
				result.push(p_metadata.prompt);
				result.push('</legend> ');
				*/
				
				if(p_metadata.is_core_summary || p_metadata.is_core_summary == true)
				{
					is_core_summary = true;
				}

				if(p_metadata.children)
				{
					for(var i = 0; i < p_metadata.children.length; i++)
					{
						var child = p_metadata.children[i];
						if(p_data[child.name] != null)
						Array.prototype.push.apply(result, core_summary_render(child, p_data[child.name], p_path + "." + child.name, p_ui, is_core_summary));
					}
				}
				//result.push('</fieldset>');
				break;	
		case 'form':
				result.push('<section id="');
				result.push(p_metadata.name)
				result.push('"> <h2>')
				result.push(p_metadata.prompt);
				result.push('</h2> ');
				//result.push(p_data[p_metadata.name]);
				
				if(p_metadata.children)
				{
					for(var i = 0; i < p_metadata.children.length; i++)
					{
						var child = p_metadata.children[i];
						if(p_data[child.name] != null)
						Array.prototype.push.apply(result, core_summary_render(child, p_data[child.name], p_path + "." + child.name, p_ui, is_core_summary));
					}
				}
				result.push('</section>');
				break;	
		case "grid":
				if(
					(p_metadata.is_core_summary || p_metadata.is_core_summary == true) ||
					is_core_summary == true
				)
				{
					result.push('<table border=1>');
					result.push('<tr><th colspan=')
					result.push(p_metadata.children.length);
					result.push('>');
					result.push(p_metadata.prompt);
					result.push('</th></tr>');

					result.push('<tr>');
					for(var j = 0; j < p_metadata.children.length; j++)
					{
						var child = p_metadata.children[j];
						result.push('<td>');
						result.push(child.name);
						result.push('</td>');
					}
					result.push('</tr>');

					for(var i = 0; i < p_data.length; i++)
					{
						if(p_data[i] != null)
						{
							result.push('<tr>');
							for(var j = 0; j < p_metadata.children.length; j++)
							{
								var child = p_metadata.children[j];
								result.push('<td>');
								if(p_data[i][child.name] != null)
								{
									result.push(p_data[i][child.name]);
								}
								else
								{
									result.push("&nbsp;");
								}
								result.push('</td>');
							}
							result.push('</tr>');
						}
					}
					result.push('</table>');
				}
				break;				
		case 'app':	
				if(
					(p_metadata.is_core_summary || p_metadata.is_core_summary == true) ||
					is_core_summary == true
				)
				{
				result.push('<p>');
				//result.push(p_path)
				result.push(' <strong>')
				result.push(p_metadata.prompt);
				result.push('</strong>: ');
				result.push(p_data[p_metadata.name]);
				result.push('</p>');
				}

				if(p_metadata.children)
				{
					for(var i = 0; i < p_metadata.children.length; i++)
					{
						var child = p_metadata.children[i];
						if(child.type.toLowerCase() == "form" && p_data[child.name] != null)
						Array.prototype.push.apply(result, core_summary_render(child, p_data[child.name], p_path + "." + child.name, p_ui, is_core_summary));
					}
				}
				break;		
		case 'list':
				if(
					(p_metadata.is_core_summary || p_metadata.is_core_summary == true) ||
					is_core_summary == true
				)
				{

					result.push('<p>');
					//result.push(p_path)
					result.push(' <strong>')
					result.push(p_metadata.prompt);
					result.push('</strong>: ');
					result.push(p_data);
					result.push('</p>');
				}
			break;
		default:
				if(
					(p_metadata.is_core_summary || p_metadata.is_core_summary == true) ||
					is_core_summary == true
				)
				{

					result.push('<p>');
					//result.push(p_path)
					result.push(' <strong>')
					result.push(p_metadata.prompt);
					result.push('</strong>: ');
					result.push(p_data);
					result.push('</p>');
				}

				if(p_metadata.children)
				{
					for(var i = 0; i < p_metadata.children.length; i++)
					{
						var child = p_metadata.children[i];
						if(p_data[child.name] != null)
						Array.prototype.push.apply(result, core_summary_render(child, p_data[child.name], p_path + "." + child.name, p_ui, is_core_summary));
					}
				}
				break;
	}

	return result;

}
