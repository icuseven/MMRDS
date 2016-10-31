function dictionary_render(p_metadata, p_path, p_ui)
{
	var result = [];
	//switch(p_metadata.type.toLowerCase())
	//{
	//	case 'app':
	//	default:
				result.push('<table border=1>');
				result.push('<tr><th colspan=2>');
				result.push(p_path);
				result.push('</th></tr>');
				result.push('<tr><th>attribue</th><th>value</th></tr>');
				result.push('<tr><td>name</td><td>');
				result.push(p_metadata.name);
				result.push('</td></tr>');
				result.push('<tr><td>prompt</td><td>');
				result.push(p_metadata.prompt);
				result.push('</td></tr>');
				result.push('<tr><td>type</td><td>');
				result.push(p_metadata.type);
				result.push('</td></tr>');
				if(p_metadata.values)
				{
					result.push('<tr><td valign="center">values</td><td>');
					for(var i = 0; i < p_metadata.values.length; i++)
					{
						var child = p_metadata.values[i];
						result.push(child);
						result.push('<br/>');
					}
					result.push('</td></tr>');
				}
				result.push("</table><br/>");


				if(p_metadata.children)
				{
					for(var i = 0; i < p_metadata.children.length; i++)
					{
						var child = p_metadata.children[i];
						Array.prototype.push.apply(result, dictionary_render(child, p_path + "." + child.name, p_ui));
					}
				}
				//break;
			//console.log("editor_render not processed", p_metadata);
	//}

	return result;

}
