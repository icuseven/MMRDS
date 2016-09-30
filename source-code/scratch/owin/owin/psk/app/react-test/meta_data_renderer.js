function Meta_Data_Renderer_(){};

Meta_Data_Renderer_.prototype.CreateFromMetaData = function(metadata, data)
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
				temp = this.CreateFromMetaData(child, child_data);

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
							temp = this.CreateFromMetaData(child, child_data);
							break;
					}
					
				}
				else
				{
					data[child.name] = "";
					child_data = data[child.name];
					temp = this.CreateFromMetaData(child, child_data);
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
						this.CreateFromMetaData(metadata.children, data)
					);
					return section;
					break;
					
				
				case 'address':
				case 'group':
					element = React.createElement('fieldset',{ key:metadata.name },
							React.createElement('legend',{},metadata.prompt),
							this.CreateFromMetaData(metadata.children, data)
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
					return this.CreateFromMetaData(metadata.children, data);
					break;					
				default:
					console.log(metadata.type);
					break;
				
			}
		}
	}
}
