function print_version_render(p_metadata, p_data,  p_path, p_ui)
{
	var result = [];
	switch(p_metadata.type.toLowerCase())
	{
		case 'group':
				result.push('<fieldset>');
				//result.push(p_path)
				result.push('<legend>')
				result.push(p_metadata.prompt);
				result.push('</legend> ');
				//result.push(p_data[p_metadata.name]);

				for(var i = 0; i < p_metadata.children.length; i++)
				{
					var child = p_metadata.children[i];
					if(p_data[child.name] != null)
					Array.prototype.push.apply(result, print_version_render(child, p_data[child.name], p_path + "." + child.name, p_ui));
				}

				result.push('</fieldset>');
				break;	
		case 'grid':
				result.push('<table border="1">');
				//result.push(p_path)
				result.push('<tr><th colspan=')
				result.push(p_metadata.children.length);
				result.push('>')
				result.push(p_metadata.prompt);
				result.push('</th></tr>');
				//result.push(p_data[p_metadata.name]);
				result.push("<tr>");
				for(var i = 0; i < p_metadata.children.length; i++)
				{
					var child = p_metadata.children[i];
					result.push("<td>");
					result.push(child.prompt);
					result.push("</td>");
				}
				result.push("</tr>");

				for(var i = 0; i < p_data.length; i++)
				{
					result.push("<tr>");
					for(var j = 0; j < p_metadata.children.length; j++)
					{
						result.push("<td>");
						var child = p_metadata.children[j];
						if(p_data[i][child.name] == null)
						{
							result.push("&nbsp;");
						}
						else
						{
							var data = p_data[i][child.name];
							if(Array.isArray(data))
							{
								result.push("<ul>");
								for(var k = 0; k < data.length; k++)
								{
									result.push("<li>");
									result.push(data[k]);
									result.push("</li>");
								}
								result.push("</ul>");
							}
							else
							{
								result.push(data);
							}
						}
						result.push("</td>");
					}
					result.push("</tr>");
				}

				result.push('</table>');
				break;					
		case 'form':

		if(
			 p_metadata.cardinality == "+" ||
			 p_metadata.cardinality == "*"
		
		)
		{
			result.push('<section id="');
			result.push(p_metadata.name)
			result.push('">');

			for(var form_index = 0; form_index < p_data.length; form_index++)
			{
				var form_item = p_data[form_index];

				
				result.push(p_metadata.name)
				result.push('<h2>')
				result.push(p_metadata.prompt);
				result.push(' Record: ');
				result.push(form_index + 1);
				result.push('</h2> ');
				//result.push(p_data[p_metadata.name]);
				
				if(p_metadata.children)
				{
					for(var i = 0; i < p_metadata.children.length; i++)
					{
						var child = p_metadata.children[i];
						if(form_item[child.name] != null)
						Array.prototype.push.apply(result, print_version_render(child, form_item[child.name], p_path + "." + child.name, p_ui));
					}
				}
			}
			result.push('</section>');
		}
		else
		{
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
						Array.prototype.push.apply(result, print_version_render(child, p_data[child.name], p_path + "." + child.name, p_ui));
					}
				}
				result.push('</section>');
		}
				
				break;	
		case "list":
				result.push('<p>');
				//result.push(p_path)
				result.push(' <strong>')
				result.push(p_metadata.prompt);
				result.push('</strong>: ');
				//result.push(p_data[p_metadata.name]);
				if(Array.isArray(p_data))
				{
					result.push("<ul>");
					for(var i = 0; i < p_data.length; i++)
					{
						result.push("<li>");
						result.push(p_data[i]);
						result.push("</li>");

					}
					result.push("</ul>");
				}
				else
				{
					result.push(p_data);
				}
				
				result.push('</p>');
				break;				
		case 'app':
				/*
				result.push('<p>');
				//result.push(p_path)
				result.push(' <strong>')
				result.push(p_metadata.prompt);
				result.push('</strong>: ');
				result.push(p_data[p_metadata.name]);
				result.push('</p>');
				*/
				if(p_metadata.children)
				{
					for(var i = 0; i < p_metadata.children.length; i++)
					{
						var child = p_metadata.children[i];
						if(child.type.toLowerCase() == "form" && p_data[child.name] != null)
						Array.prototype.push.apply(result, print_version_render(child, p_data[child.name], p_path + "." + child.name, p_ui));
					}
				}
				break;				
		default:
				result.push('<p>');
				//result.push(p_path)
				result.push(' <strong>')
				result.push(p_metadata.prompt);
				result.push('</strong>: ');
				result.push(p_data);
				result.push('</p>');
				/*
				if(p_metadata.children)
				{
					for(var i = 0; i < p_metadata.children.length; i++)
					{
						var child = p_metadata.children[i];
						if(p_data[child.name] != null)
						Array.prototype.push.apply(result, print_version_render(child, p_data[child.name], p_path + "." + child.name, p_ui));
					}
				}*/
				break;
	}

	return result;

}
