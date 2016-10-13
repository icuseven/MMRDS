function editor_render(p_metadata, p_path)
{

	var result = [];

	switch(p_metadata.type.toLowerCase())
  {
		/*
		case 'address':
			result.push("<fieldset id='");
			result.push(p_metadata.name);
			result.push("_id'><legend>");
			result.push(p_metadata.prompt);
			result.push("</legend>");
			for(var i = 0; i < p_metadata.children.length; i++)
      {
        var child = p_metadata.children[i];
        Array.prototype.push.apply(result, editor_render(child, p_data[child.name]));
      }
			result.push("<input type='button' value='get location' /></fieldset>");
      break;
    case 'grid':
		result.push("<table id='");
		result.push(p_metadata.name);
		result.push("_id'><tr><th colspan=");
		result.push(p_metadata.children.length)
		result.push(">");
		result.push(p_metadata.prompt);
		result.push("</th><tr>");
		result.push('<tr>');
		for(var i = 0; i < p_metadata.children.length; i++)
		{
			var child = p_metadata.children[i];
			result.push('<th>');
			result.push(child.prompt);
			result.push('</th>')

		}
		result.push('</tr>');

		for(var i = 0; i < p_data[child.name].length; i++)
		{
			result.push('<tr>');
			for(var j = 0; j < p_data[child.name][i].length; j++)
			{
				result.push("<th>");
				result.push(p_data[child.name][i][j]);
				result.push("</th>");
			}
			result.push('</tr>');
		}
		result.push("</table>");
		break;*/
    /*case 'group':
			result.push("<fieldset id='");
			result.push(p_metadata.name);
			result.push("_id'><legend>");
			result.push(p_metadata.prompt);
			result.push("</legend>");
			for(var i = 0; i < p_metadata.children.length; i++)
      {
        var child = p_metadata.children[i];
        Array.prototype.push.apply(result, editor_render(child, p_data[child.name]));
      }
			result.push("</fieldset>");
      break;*/
		case 'address':
		case 'grid':
		case 'group':
    case 'form':
			result.push('<li path=">');
			result.push(p_path + "/" + p_metadata.name);
			result.push('">');
			result.push('<input type="button" value="-" /> ');
			result.push('<input type="button" value="c" /> ');
			result.push('<input type="button" value="d" /> ');
			result.push(p_metadata.name);
			result.push(' <input type="button" value="^" /><br/>children:');
			result.push(' <select><option></option><option>string</option><option>number</option></select>');
			result.push(' <input type="button" value="add" /> <input type="button" value="p" /><ul>');

				for(var i = 0; i < p_metadata.children.length; i++)
	      {
	        var child = p_metadata.children[i];
	        Array.prototype.push.apply(result, editor_render(child, p_path + "/" + p_metadata.name));
	      }
				result.push('</ul></li>');
	      break;
    case 'app':
			result.push('<div style="margin-top:10px" path="/" >');
			result.push('<input type="button" value="-" /> ');
			result.push('<input type="button" value="c" /> ');
			result.push('<input type="button" value="d" /> ');
			result.push(p_metadata.name);
			result.push(' <input type="button" value="^" /><ul>');

	       for(var i = 0; i < p_metadata.children.length; i++)
	       {
	         var child = p_metadata.children[i];
					 Array.prototype.push.apply(result, editor_render(child, p_path + "/" + p_metadata.name));
				 }
			result.push('</ul></div>');
       break;
		 case 'boolean':
		 case 'date':
		 case 'number':
     case 'string':
		 case 'time':
					 result.push('<li path=">');
					 result.push(p_path + "/" + p_metadata.name);
					 result.push('">');
					 result.push('<input type="button" value="-" /> ');
					 result.push('<input type="button" value="c" /> ');
					 result.push('<input type="button" value="d" /> ');
					 result.push(p_metadata.name);
					 result.push(' <input type="button" value="^" /><ul>');
					 result.push('</ul></li>');

           break;

			case 'yes_no':
			case 'race':

			case 'multilist':
			case 'list':
		 			result.push('<li path=">');
		 			result.push(p_path + "/" + p_metadata.name);
		 			result.push('">');
		 			result.push('<input type="button" value="-" /> ');
		 			result.push('<input type="button" value="c" /> ');
		 			result.push('<input type="button" value="d" /> ');
		 			result.push(p_metadata.name);
					result.push(' <input type="button" value="^" /><br/>values:');
					result.push(' <input type="text" value=""/>');
					result.push(' <input type="button" value="add" /><ul>');
					for(var i = 0; i < p_metadata.values.length; i++)
					{
						var child = p_metadata.values[i];
						result.push('<li><input type="text" value="');
						result.push(child);
						result.push('" /> <input type="button" value="^" /></li>');

					}

		 			result.push('</ul></li>');

		 			break;

	/*
     case 'number':
						result.push("<span>");
						result.push(p_metadata.prompt);
						result.push(" <input type='Number' name='");
						result.push(p_metadata.name);
						result.push("' value='");
						result.push(p_data);
						result.push("' /></span>");
           break;
     case 'boolean':
						result.push("<span>");
						result.push(p_metadata.prompt);
						result.push(" <input type='checkbox' name='");
						result.push(p_metadata.name);
						result.push("' checked='");
						result.push(p_data);
						result.push("' /></span>");
            break;
    case 'list':
    case 'yes_no':
					 result.push("<span>");
					 result.push(p_metadata.prompt);
					 if(p_metadata.values.length > 6)
					 {
						 result.push("<br/> <select size=7 name='");
					 }
					 else
					 {
							result.push("<br/> <select size=");
							result.push(p_metadata.values.length);
							result.push(" name='");
					 }

					 result.push(p_metadata.name);
					 result.push("'>");
					 for(var i = 0; i < p_metadata.values.length; i++)
					 {
						 var item = p_metadata.values[i];
						 if(p_data == item)
						 {
							 	result.push("<option value='");
								result.push("' selected>");
								result.push(item);
								result.push("</option>");
						 }
						 else
						 {
							 result.push("<option value='");
							 result.push("'>");
							 result.push(item);
							 result.push("</option>");
						 }
					 }
					 result.push("</select></span>");
           break;

		 case 'multilist':
     case 'race':
			 result.push("<span>");
			 result.push(p_metadata.prompt);
			 if(p_metadata.values.length > 6)
			 {
				 result.push("<br/> <select size=7 multiple name='");
			 }
			 else
			 {
					result.push("<br/> <select size=");
					result.push(p_metadata.values.length);
					result.push(" name='");
			 }

			 result.push(p_metadata.name);
			 result.push("'>");
			 for(var i = 0; i < p_metadata.values.length; i++)
			 {
				 var item = p_metadata.values[i];
				 if(p_data == item)
				 {
						result.push("<option value='");
						result.push("' selected>");
						result.push(item);
						result.push("</option>");
				 }
				 else
				 {
					 result.push("<option value='");
					 result.push("'>");
					 result.push(item);
					 result.push("</option>");
				 }
			 }
			 result.push("</select></span>");
			 break;
			case 'date':
				result.push("<span>");
				result.push(p_metadata.prompt);
				result.push(" <input type='date' name='");
				result.push(p_metadata.name);
				result.push("' value='");
				result.push(p_data);
				result.push("' /></span>");
			 break;
	    case 'time':
					result.push("<span>");
					result.push(p_metadata.prompt);
					result.push(" <input type='text' name='");
					result.push(p_metadata.name);
					result.push("' value='");
					result.push(p_data);
					result.push("' /></span>");
				 break;*/
/*            break;
    case 'radiolist':
           p_parent[p_metadata.name] = "";
           break;
     case 'date':
            p_parent[p_metadata.name] = new Date();
            break;
    case 'time':
           p_parent[p_metadata.name] = "";
           break;*/
     default:
          console.log("editor_render not processed", p_metadata);
       break;
  }

	return result;

}


function prop_element_renderer(metadata, p_path)
{
	var result = [];
	for(var prop in metadata)
	{
		var name_check = prop.toLowerCase();
		switch(name_check)
		{
			case 'children':
				result.push(React.createElement(CollectionNodeComponent,
						{ key: p_path + "/children", metadata_type: "children", defaultMetadata:metadata.children, defaultPath:p_path + "/children", set_meta_data_prop:this.props.set_meta_data_prop}
						));
				break;
			case 'values':
				result.push(React.createElement(CollectionNodeComponent,
						{ key: p_path + "/values", metadata_type: "values", defaultMetadata:metadata.values, defaultPath:p_path + "/values", set_meta_data_prop:this.props.set_meta_data_prop}
						));
				break;
			default:
				result.push(React.createElement(KeyValueNodeComponent,{ key: p_path + "/" + prop, defaultValue: this.state.metadata[prop], defaultPath: p_path + "/" + prop, metadata_property_name: prop, set_meta_data_prop:this.props.set_meta_data_prop }));
				break;
		}
	}
	return result;
}
