function page_render(p_metadata, p_data, p_ui)
{

	var result = [];

	switch(p_metadata.type.toLowerCase())
  {
		case 'address':
			result.push("<fieldset id='");
			result.push(p_metadata.name);
			result.push("_id' class='group address'><legend>");
			result.push(p_metadata.prompt);
			result.push("</legend>");
			for(var i = 0; i < p_metadata.children.length; i++)
      {
        var child = p_metadata.children[i];
        Array.prototype.push.apply(result, page_render(child, p_data[child.name]));
      }
			result.push("<input type='button' value='get location' /></fieldset>");
      break;
    case 'grid':
		result.push("<table id='");
		result.push(p_metadata.name);
		result.push("_id' class='grid'><tr><th colspan=");
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
		break;
    case 'group':
			result.push("<fieldset id='");
			result.push(p_metadata.name);
			result.push("_id' class='group'><legend>");
			result.push(p_metadata.prompt);
			result.push("</legend>");
			for(var i = 0; i < p_metadata.children.length; i++)
      {
        var child = p_metadata.children[i];
        Array.prototype.push.apply(result, page_render(child, p_data[child.name]));
      }
			result.push("</fieldset>");
      break;
    case 'form':
			result.push("<section id='");
			result.push(p_metadata.name);
			result.push("_id' class='form'><h2>");
			result.push(p_metadata.prompt);
			result.push("</h2>");
			for(var i = 0; i < p_metadata.children.length; i++)
      {
        var child = p_metadata.children[i];
        Array.prototype.push.apply(result, page_render(child, p_data[child.name]));
      }
			result.push("</section>");
      break;
    case 'app':
		result.push("<section id='app_summary'><h2>summary</h2>");
		result.push("<input type='button' class='btn-green' value='add new case' onclick='g_ui.add_new_case()' /><hr/>");
		result.push("<fieldset><legend>filter line listing</legend>");
		result.push("<input type='text' id='search_text_box' value='' /> ");
		result.push("<img src='images/search.png' alt='search' height=8px width=8px valign=bottom class='btn-green' id='search_command_button'>");
		result.push("</fieldset>");

		result.push('<div class="search_wrapper">');
		for(var i = 0; i < g_ui.data_list.length; i++)
		{
			var item = g_ui.data_list[i];

				if(i % 2)
				{
					result.push('		  <div class="result_wrapper_grey">');
				}
				else
				{
					result.push('		  <div class="result_wrapper">');
				}
				result.push('<p class="result">');
				result.push(item.home_record.last_name);
				result.push(', ');
				result.push(item.home_record.first_name);
				result.push('	(');
				result.push(item.home_record.date_of_death);
				result.push('	(');
				result.push(item.home_record.state_of_death);
				result.push('	) <a href="#/'+ item._id + '/home_record" role="button" class="btn-purple">select</a></p>');
				result.push('</div>');
		}
		result.push('		</div>');


		result.push("</section>");

       for(var i = 0; i < p_metadata.children.length; i++)
       {
         var child = p_metadata.children[i];
				 Array.prototype.push.apply(result, page_render(child, p_data[child.name]));
			 }

		result.push('<footer class="footer_wrapper">');
		result.push('<p>FOOTER CONTENT</p>');
		result.push('</footer>');

       break;
     case 'string':
					result.push("<div class='string'>");
					result.push(p_metadata.prompt);
					result.push("<br/> <input type='text' name='");
					result.push(p_metadata.name);
					result.push("' value='");
					result.push(p_data);
					result.push("' /></div>");

           break;
     case 'number':
						result.push("<div class='number'>");
						result.push(p_metadata.prompt);
						result.push("<br/> <input type='Number' name='");
						result.push(p_metadata.name);
						result.push("' value='");
						result.push(p_data);
						result.push("' /></div>");
           break;
     case 'boolean':
						result.push("<div class='boolean'>");
						result.push(p_metadata.prompt);
						result.push(" <input type='checkbox' name='");
						result.push(p_metadata.name);
						result.push("' checked='");
						result.push(p_data);
						result.push("' /></div>");
            break;
    case 'list':
    case 'yes_no':
					 result.push("<div class='list'>");
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
					 result.push("</select></div>");
           break;

		 case 'multilist':
     case 'race':
			 result.push("<div class='multilist'>");
			 result.push(p_metadata.prompt);
       result.push(' ( select all that apply )');
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
			 result.push("</select></div>");
			 break;
			case 'date':
				result.push("<div class='date'>");
				result.push(p_metadata.prompt);
				result.push("<br/> <input type='date' name='");
				result.push(p_metadata.name);
				result.push("' value='");
				result.push(p_data);
				result.push("' /></div>");
			 break;
	    case 'time':
					result.push("<div class='time'>");
					result.push(p_metadata.prompt);
					result.push("<br/> <input type='text' name='");
					result.push(p_metadata.name);
					result.push("' value='");
					result.push(p_data);
					result.push("' /></div>");
				 break;
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
          console.log("page_render not processed", p_metadata);
       break;
  }

	return result;

}

function page_renderer2(metadata, data)
{
	if(data){}else{ data = {};}
	var a = null;
	var element = null;
	var h1 = null;
	var element_2 = null;
	var element_3 = null;

	var result = null;



	if(Array.isArray(metadata))
	{
		result = [];
		for(var i = 0; i < metadata.length; i++)
		{
			var child = metadata[i];
			var child_data = data[child.name];
			var temp = null;
			if(child_data || child_data== "")
			{
				temp = page_renderer(child, child_data);

			}
			else
			{
				if(child.type)
				{
					switch(child.type.toLowerCase())
					{
						case "yes_no":
						case "list":
							data[child.name] = "";
							var value_list = [];
							for(var i = 0; i < child.values.length; i++)
							{
								value_list.push(React.createElement('option', { key:child.values[i]}, child.values[i]));
							}
							var key_value = child.name + Math.random();
							temp = React.createElement('fieldset',{ key:key_value },
									React.createElement('legend',{},child.prompt),
									React.createElement('select',{},
										value_list
										)
									);
							break;
						case 'race':
							data[child.name] = "";
							var value_list = [];
							for(var i = 0; i < child.values.length; i++)
							{
								value_list.push(React.createElement('option', { key:child.values[i]}, child.values[i]));
							}
							var key_value = child.name + Math.random();
							temp = React.createElement('fieldset',{ key:key_value },
									React.createElement('legend',{},child.prompt),
									React.createElement('select',{ multiple:true, size:7 },
										value_list
										)
									);
							break;
						case "string":
							data[child.name] = "";
							break;
						case "number":
							data[child.name] = new Number();
							break;
						case "address":
						case "group":
							data[child.name] = {};
							break;
						case "date":
							data[child.name] = new Date().toISOString();
							break;
						case "list":
							data[child.name] = "";
							break;
						case "grid":
							data[child.name] = [];
							break;
						default:
							data[child.name] = "";
							break;
					}

					switch(child.type.toLowerCase())
					{
						case "yes_no":
						case "list":
							child_data = data[child.name];
							temp = React.createElement('option', { key:i}, child_data);
							break;
						default:
							child_data = data[child.name];
							temp = page_renderer(child, child_data);
							break;
					}

				}
				else
				{
					data[child.name] = "";
					child_data = data[child.name];
					temp = page_renderer(child, child_data);
				}
			}
			if(temp)
			{
				result.push(temp);
			}
		}

		return result;
	}
	else if(metadata.type)
	{
		if(metadata.type.toLowerCase().endsWith(".json"))
		{
			/*
			var url = location.protocol + '//' + location.host + '/meta-data/00/' + metadata.type;
			var AJAX = new AJAX_();

			var meta_data = AJAX.GetSynchronousResponse(url);
			console.log("synchronous", meta_data);
			*/

			console.log("meta_data_render called .json: ", metadata.type);
		}
		else
		{
			switch(metadata.type.toLowerCase())
			{
				case 'string':
					//<p key=''>prompt text <input /><p>
					/*
					element = React.createElement
					(
						"p",{ key: metadata.name},
						metadata.prompt,
						' ',
						React.createElement("input",
						{
							onChange:eval ('function(value){ this.bound_data.' + metadata.name + '=value' }'
						}, type:"text", "defaultValue": metadata.name'})
					);*/

					element = React.createElement(StringComponent, { key:metadata.name, "metadata":metadata, defaultValue: data });
					return element;
					break;
				case 'number':
					element = React.createElement(NumberComponent, { key:metadata.name, "metadata":metadata, defaultValue: data });
					return element;
					break;
				case 'boolean':
					element = React.createElement(BooleanComponent, { key:metadata.name, "metadata":metadata, defaultValue: data });
					return element;
					break;
				case 'date':
					element = React.createElement(DateComponent, { key:metadata.name, "metadata":metadata, defaultValue: data });
					//element = React.createElement(AReactDatepicker, { key:metadata.name, "metadata":metadata, defaultValue: data });
					return element;
					break;
				case 'form':
					var section = React.createElement
					(
						"section", { "data-route": metadata.data_route, "tabindex": "-1", key: metadata.name},
						React.createElement("h1", null, metadata.prompt),
						page_renderer(metadata.children, data)
					);
					return section;
					break;


				case 'address':
				case 'group':
					element = React.createElement('fieldset',{ key:metadata.name },
							React.createElement('legend',{},metadata.prompt),
							page_renderer(metadata.children, data)
							);
					return element;
					break;
				case 'yes_no':
				case 'list':
					var value_list = [];
					for(var i = 0; i < metadata.values.length; i++)
					{
						var key_value = metadata.name + i;
						value_list.push(React.createElement('option', { key: key_value}, metadata.values[i]));
					}

					element = React.createElement('fieldset',{ key:metadata.name },
							React.createElement('legend',{},metadata.prompt),
							React.createElement('select',{ },
								value_list
								)
							);
					return element;
					break;
				case 'race':

					var value_list = [];
					for(var i = 0; i < metadata.values.length; i++)
					{
						var key_value = metadata.name + i;
						value_list.push(React.createElement('option', { key: key_value}, metadata.values[i]));
					}

					element = React.createElement('fieldset',{ key:metadata.name },
							React.createElement('legend',{},metadata.prompt),
							React.createElement('select',{ multiple:true, size:7},
								value_list
								)
							);
					return element;
					break;
				case 'radio':
					//<paper-input label="In prior 3 months (# of cigarettes/ packs)" value="{{bound_data.cigarette_smoking.prior_3_months}}"></paper-input>
					//<paper-radio-group selected="{{bound_data.cigarette_smoking.prior_3_months_type}}">

					h1 = document.createElement("h2");
					h1.innerHTML = metadata.prompt;
					Polymer.dom(parent).appendChild(h1);

					element = document.createElement("paper-radio-group");
					a  = document.createAttribute("selected");
					a.value = "{{bound_data." + metadata.name + "}}";
					element.setAttributeNode(a);



					//<paper-radio-button name="">not specified</paper-radio-button>
					element_2 = document.createElement("paper-radio-button");
					element_2.innerHTML = "not specified";

					a = document.createAttribute("name");
					a.value = "";
					element_2.setAttributeNode(a);

					Polymer.dom(element).appendChild(element_2);


					for(var i = 0; i < metadata.values.length; i++)
					{
						var radio_value = metadata.values[i];


						element_2 = document.createElement("paper-radio-button");
						a = document.createAttribute("name");
						a.value = radio_value;
						element_2.setAttributeNode(a);
						element_2.innerHTML = radio_value;
						Polymer.dom(element).appendChild(element_2);
					}

					Polymer.dom(parent).appendChild(element);

					break;
				case 'app':
					return page_renderer(metadata.children, data);
					break;
				default:
					console.log(metadata.type);
					break;

			}
		}
	}
}
