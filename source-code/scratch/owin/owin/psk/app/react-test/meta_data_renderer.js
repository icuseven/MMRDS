function Meta_Data_Renderer_(){};

Meta_Data_Renderer_.prototype.CreateFromMetaData = function(document, app, metadata, parent)
{
	var a = null;
	var element = null;
	var h1 = null;
	var element_2 = null;
	var element_3 = null;

	if(metadata.type)
	{
		switch(metadata.type.toLowerCase())
		{
			case 'string':
				//<paper-input label="In prior 3 months (# of cigarettes/ packs)" value="{{bound_data.cigarette_smoking.prior_3_months}}"></paper-input>


				element = document.createElement("p");
				//a = document.createAttribute("label");
				//a.value = metadata.prompt;
				//element.setAttributeNode(a);
				element.innerHTML = metadata.prompt;
				
				parent.appendChild(element);
				
				element = document.createElement("input");
				a = document.createAttribute("value");
				a.value = "{{bound_data." + metadata.name + "}}";
				element.setAttributeNode(a);
				
				parent.appendChild(element);
				break;			

			case 'form':
				var page_set =  app.querySelector('#page_set');
				var section = document.createElement("section");
				
				a = document.createAttribute("data-route");
				a.value = metadata.data_route;
				section.setAttributeNode(a);
				
				a  = document.createAttribute("tabindex");
				a.value = "-1";
				section.setAttributeNode(a);
				
				a  = document.createAttribute("class");
				a.value = "style-scope mmrds-app";
				section.setAttributeNode(a);
				
				h1 = document.createElement("h1");
				h1.innerHTML = metadata.prompt;
				section.appendChild(h1);
			
				Polymer.dom(page_set).appendChild(section);
				
				for(var i = 0; i < metadata.children.length; i++)
				{
					var child = metadata.children[i];
					this.CreateFromMetaData(document, app, child, section)
				}

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
					this.CreateFromMetaData(document, app, child, element)
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

	/*
	if(typeof i=='undefined')i='';
	if(i.length>50)return '[MAX ITERATIONS]';
	var r=[];
	for(var p in o)
	{
	var t=typeof o[p];
	r.push(i+'"'+p+'" ('+t+') => '+(t=='object' ? 'object:'+xinspect(o[p],i+'  ') : o[p]+''));
	}
	return r.join(i+'\n');*/
}
