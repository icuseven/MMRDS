function editor_render(p_metadata, p_path, p_ui)
{

	var result = [];

	switch(p_metadata.type.toLowerCase())
  {
		case 'address':
		case 'grid':
		case 'group':
    case 'form':
			result.push('<li path="');
			result.push(p_path);
			result.push('">');
			result.push('<input type="button" value="-" onclick="editor_toggle(this, g_ui)"/> ');
			result.push(' <input type="button" value="^" onclick="editor_move_up(this, g_ui)" /> <input type="button" value="c" /> ');
			result.push('<input type="button" value="d" /> ');
			result.push(p_metadata.name);
			result.push(' ');
			result.push(p_path);
			result.push(' <br/><ul tag="attribute_list" ');
			if(p_ui.is_collapsed[p_path])
			{
				result.push(' style="display:none">');
			}
			else
			{
			 result.push(' style="display:block">');
			}
			Array.prototype.push.apply(result, attribute_renderer(p_metadata, p_path));
			result.push('<li path="');
			result.push(p_path);
			result.push('/children"><input type="button" value="-" onclick="editor_toggle(this, g_ui)"/> children:');
			result.push(' <select><option></option><option>string</option><option>number</option></select>');
			result.push(' <input type="button" value="add" /> <input type="button" value="p" /> ');
			result.push(p_path + "/children");
			result.push(' <ul>');

				for(var i = 0; i < p_metadata.children.length; i++)
	      {
	        var child = p_metadata.children[i];
	        Array.prototype.push.apply(result, editor_render(child, p_path + "/children/" + i, p_ui));
	      }
				result.push('</ul></li></ul></li>');
	      break;
    case 'app':
			result.push('<div style="margin-top:10px" path="/" >');
			/*result.push('<input type="button" value="-" /> ');
			result.push('<input type="button" value="c" /> ');
			result.push('<input type="button" value="d" /> ');*/
			result.push(p_metadata.name);
			result.push('<ul tag="attribute_list" ');
			if(p_ui.is_collapsed["/"])
			{
				result.push(' style="display:none">');
			}
			else
			{
			 result.push(' style="display:block">');
			}
			Array.prototype.push.apply(result, attribute_renderer(p_metadata, "/"));
			result.push('<li path="');
			result.push(p_path + "/children");
			result.push('"><input type="button" value="-" onclick="editor_toggle(this, g_ui)" /> children: <input type="button" value="add" onclick="editor_add_form(this)"/> ');
			result.push(p_path + "/children");
			result.push('<ul>');

	       for(var i = 0; i < p_metadata.children.length; i++)
	       {
	         var child = p_metadata.children[i];
					 Array.prototype.push.apply(result, editor_render(child, "/children/" + i, p_ui));
				 }
			result.push('</ul></li></ul></div>');
       break;
		 case 'boolean':
		 case 'date':
		 case 'number':
     case 'string':
		 case 'time':
					 result.push('<li path="');
					 result.push(p_path);
					 result.push('">');
					 result.push('<input type="button" value="-" onclick="editor_toggle(this, g_ui)"/> ');
					 result.push('<input type="button" value="^" onclick="editor_move_up(this, g_ui)"/> <input type="button" value="c" /> ');
					 result.push('<input type="button" value="d" /> ');
					 result.push(p_metadata.name);
					 result.push(' ');
					 result.push(p_path);
					 result.push(' <ul tag="attribute_list" ');
					 if(p_ui.is_collapsed[p_path])
					 {
						 result.push(' style="display:none">');
					 }
					 else
					 {
					 	result.push(' style="display:block">');
					 }
					 Array.prototype.push.apply(result, attribute_renderer(p_metadata, p_path));
					 result.push('</ul></li>');

           break;

			case 'yes_no':
			case 'race':

			case 'multilist':
			case 'list':
		 			result.push('<li path="');
		 			result.push(p_path);
		 			result.push('">');
					result.push(' <input type="button" value="-"  onclick="editor_toggle(this, g_ui)"/> ');
		 			result.push(' <input type="button" value="^" onclick="editor_move_up(this, g_ui)" />' );
		 			result.push('<input type="button" value="c" /> ');
		 			result.push('<input type="button" value="d" /> ');
		 			result.push(p_metadata.name);
					result.push('<br/><ul  tag="attribute_list">');
					Array.prototype.push.apply(result, attribute_renderer(p_metadata, p_path));
					result.push('<li><input type="button" value="-" /> values:');
					result.push(' <input type="text" value=""/>');
					result.push(' <input type="button" value="add" /> ');
					result.push(p_path + "/" + p_metadata.name + "/" + "values");
					result.push(' <ul>');


					for(var i = 0; i < p_metadata.values.length; i++)
					{
						var child = p_metadata.values[i];

						result.push('<li path="');
						result.push(p_path + "/" + "values/" + i);
						result.push('"> <input type="button" value="^" onclick="editor_move_up(this, g_ui)"/> <input type="button" value="d" /> <input type="text" value="');
						result.push(child);
						result.push('" size=');
						result.push(child.length + 5);
						result.push('  onBlur="editor_set_value(this, g_ui)" path="');
						result.push(p_path + "/" + p_metadata.name + "/" + "values/" + i);
						result.push('" /> ');
						result.push(p_path + "/" + p_metadata.name + "/" + "values/" + i);
						result.push(' </li>');

					}

		 			result.push('</ul></li></ul></li>');

		 			break;
     default:
          console.log("editor_render not processed", p_metadata);
       break;
  }

	return result;

}

var valid_types = [
"string",
"number",
"date",
"list",
"multilist",
"app",
"form",
"group",
"time",
"textarea",
"boolean",
"label",
"button"
];


function attribute_renderer(p_metadata, p_path)
{
	var result = [];
	for(var prop in p_metadata)
	{
		var name_check = prop.toLowerCase();
		switch(name_check)
		{
			case 'children':
			case 'values':

				break;
			case 'type':
					result.push('<li>type: <select onChange="editor_set_value(this, g_ui)" path="');
					result.push(p_path + "/" + prop);
					result.push('" /> ');
					result.push("<option></option>");
					for(var i = 0; i < valid_types.length; i++)
					{
						
						var item = valid_types[i];
						if(p_metadata[prop] && item.toLowerCase() == p_metadata[prop].toLowerCase())
						{
							result.push('<option selected>');
						}
						else
						{
							result.push('<option>');
						}
						result.push(valid_types[i]);
						result.push('</option>');
					}


					result.push('</select>');

			break;
			default:
				if(p_metadata.type.toLowerCase() == "app")
				{
					result.push('<li>')
					result.push(prop);
					result.push(' : ');
					result.push(p_metadata[prop]);
					result.push('</li>');
				}
				else
				{
					result.push('<li>')
					result.push(prop);
					result.push(' : <input type="text" value="');
					result.push(p_metadata[prop]);
					result.push('" size=');
					if(p_metadata[prop])
					{
						result.push((p_metadata[prop].length)?  p_metadata[prop].length + 5: 5);
					}
					else
					{
						result.push(15);
					}

					result.push(' onBlur="editor_set_value(this, g_ui)" path="');
					result.push(p_path + "/" + prop);
					result.push('" /> ');
					result.push(p_path + "/" + prop);
					result.push(' </li>');

				}


				break;
		}
	}
	return result;
}

function editor_set_value(e, p_ui)
{
	var path = e.attributes['path'].value;
	var path_array = path.split('/');
	var attribute_name = path_array[path_array.length - 1];
	var item_path = get_eval_string(path);

	switch(attribute_name.toLowerCase())
	{
		case 'name':
			if(eval(item_path) != e.value)
			{
				if(e.value)
				{
					var test = e.value.match(/^[a-zA-z][a-zA-z0-9_]*$/);
					if(test)
					{
						//var item = eval(item_path);
						eval(item_path + ' = "' + e.value + '"');
						//var after = eval(item_path);
						e.style.color = "black";
					}
					else
					{
						e.style.color = "red";
					}
				}
				else
				{
					//var item = eval(item_path);
					eval(item_path + ' = "' + e.value + '"');
					//var after = eval(item_path);
				}
			}
			else if (e.style.color != "black")
			{
				e.style.color = "black"
			}
				
			
			break;
		default:
			//var item = eval(item_path);
			eval(item_path + ' = "' + e.value.replace('"', '\\"') + '"');
			//var after = eval(item_path);
			break;
	}
}

function editor_add_form(e)
{
	var form = md.create_form(			
			'new_form_name',
			'form prompt',
			'?');
	g_metadata.children.push(form);
	var node = editor_render(g_metadata, "", g_ui);
	
	var node_to_render = document.querySelector("div[path='/']");
	node_to_render.innerHTML = node.join("");
	
}


function editor_toggle(e, p_ui)
{
	var element = document.querySelector('li[path="' + e.parentElement.attributes['path'].value + '"] ul');

	if(element.style.display=="none")
	{
		element.style.display="block";
		e.value = "-";
		p_ui.is_collapsed[e.parentElement.attributes['path'].value] = false;
	}
	else
	{
			element.style.display="none";
			e.value = "+";
			p_ui.is_collapsed[e.parentElement.attributes['path'].value] = true;
	}
	//console.log('toggle: path', e.parentElement.attributes['path']);
}

function editor_move_up(e, p_ui)
{

	var current_li = e.parentElement;
	var parent = current_li.parentElement;
	var path = current_li.attributes['path'].value;

	var item = get_eval_string(path);


	var node_path = get_eval_string(remove_last_digit_in_path(path));
	var list = eval(node_path);
	var y = path.match(/\d*$/)[0];
	var x = y - 1;

	//swap toggle state
	var temp = p_ui.is_collapsed[node_path + y];
	p_ui.is_collapsed[node_path + y] = p_ui.is_collapsed[node_path + x];
	p_ui.is_collapsed[node_path + x] = temp;
	

	if(x >= 0)
	{
		var b = list[y];
		list[y] = list[x];
		list[x] = b;

		var parent_path = get_parent_path(path);
		var metadata_path = get_eval_string(parent_path);
		var metadata = eval(metadata_path);
		var node = editor_render(metadata, parent_path, p_ui);

		var node_to_render = null;
		if(parent_path == "")
		{
			node_to_render = document.querySelector("div[path='/']");
		}
		else
		{
			node_to_render = document.querySelector("li[path='" + parent_path + "']");

		}
		node_to_render.innerHTML = node.join("");

	}

}

function remove_last_digit_in_path(p_path)
{
    var index = p_path.lastIndexOf("/");
    var result = p_path.substring(0,index)
    return result;
}

function get_eval_string(p_path)
{
	var result = "g_metadata" + p_path.replace(new RegExp('/','gm'),".").replace(new RegExp('.(\\d+).','g'),"[$1].").replace(new RegExp('.(\\d+)$','g'),"[$1]");

	return result;

}

function get_parent_path(p_path)
{
	var result = null;
	if(p_path.match(new RegExp('/values/(\\d+)$','g')))
	{
		result = p_path.replace(new RegExp('/values/(\\d+)$','g'),"");
	}
	else
	{

		result = p_path.replace(new RegExp('/children/(\\d+)$','g'),"");
	}



	return result;

}
