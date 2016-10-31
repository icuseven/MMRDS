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
				
				if(p_metadata.children)
				{
					for(var i = 0; i < p_metadata.children.length; i++)
					{
						var child = p_metadata.children[i];
						Array.prototype.push.apply(result, print_version_render(child, p_data, p_path + "." + child.name, p_ui));
					}
				}
				result.push('</fieldset>');
				break;	
		case 'form':
				result.push('<section>');
				//result.push(p_path)
				result.push(' <h2>')
				result.push(p_metadata.prompt);
				result.push('</h2> ');
				//result.push(p_data[p_metadata.name]);
				
				if(p_metadata.children)
				{
					for(var i = 0; i < p_metadata.children.length; i++)
					{
						var child = p_metadata.children[i];
						Array.prototype.push.apply(result, print_version_render(child, p_data, p_path + "." + child.name, p_ui));
					}
				}
				result.push('</section>');
				break;					
		case 'app':
		default:
				result.push('<p>');
				//result.push(p_path)
				result.push(' <strong>')
				result.push(p_metadata.prompt);
				result.push('</strong>: ');
				result.push(p_data[p_metadata.name]);
				result.push('</p>');
				if(p_metadata.children)
				{
					for(var i = 0; i < p_metadata.children.length; i++)
					{
						var child = p_metadata.children[i];
						Array.prototype.push.apply(result, print_version_render(child, p_data, p_path + "." + child.name, p_ui));
					}
				}
				break;
	}

	return result;

}
