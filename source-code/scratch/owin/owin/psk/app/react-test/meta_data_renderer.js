function Meta_Data_Renderer_(){};

Meta_Data_Renderer_.prototype.CreateFromMetaData = function(metadata, data)
{
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
			var child_data = data[i];
			var temp = this.CreateFromMetaData(child, child_data);
			if(temp)
			{
				result.push(temp);
			}
		}
				
		return result;
	}
	else if(metadata.type)
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
				
				element = React.createElement(StringComponent, { key:metadata.name, "metadata":metadata });
				return element;
				break;			

			case 'form':
				var section = React.createElement
				(
					"section", { "data-route": metadata.data_route, "tabindex": "-1"},
					React.createElement("h1", null, metadata.prompt),
					this.CreateFromMetaData(metadata.children)
				);
				return section;
				break;
			case 'group'://<paper-material elevation="1">
				element = document.createElement("paper-material");
				a  = document.createAttribute("elevation");
				a.value = "1";
				element.setAttributeNode(a);
				
				h1 = document.createElement("h1");
				h1.innerHTML = metadata.prompt;
				Polymer.dom(element).appendChild(h1);

				Polymer.dom(parent).appendChild(element);

				for(var i = 0; i < metadata.children.length; i++)
				{
					var child = metadata.children[i];
					this.CreateFromMetaData(document, child, element)
				}
				
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
			default:
				console.log(metadata.type);
				break;
			
		}
	}
}
