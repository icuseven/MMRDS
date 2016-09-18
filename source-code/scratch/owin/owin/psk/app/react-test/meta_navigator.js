function Meta_Navigator_(){};

Meta_Navigator_.prototype.navigate = function(metadata, entry_callback, exit_callback)
{
	if(metadata.type)
	{
		switch(metadata.type.toLowerCase())
		{
			case 'string':
				entry_callback(metadata);
				exit_callback(metadata);
				break;			

			case 'form':
			case 'group':
				entry_callback(metadata);
				for(var i = 0; i < metadata.children.length; i++)
				{
					var child = metadata.children[i];
					this.navigate(child, entry_callback, exit_callback);
				}
				exit_callback(metadata);
				break;
			case 'radio':
				entry_callback(metadata);
				
				for(var i = 0; i < metadata.values.length; i++)
				{
					var radio_value = metadata.values[i];
					this.navigate(radio_value, entry_callback, exit_callback);
				}
				
				exit_callback(metadata);
				break;
			default:
				console.log("meta_navigator unimplemented", metadata.type);
				entry_callback(metadata);
				exit_callback(metadata);
				break;
			
		}
	}
	else
	{
		
		console.log("meta_navigator metadata node without type", metadata);
	}
}


Meta_Navigator_.prototype.accumulate = function(metadata, p_accumulate_function, p_start_value)
{
	
	var result = {};
	
	if(metadata.type)
	{
		switch(metadata.type.toLowerCase())
		{
			case 'string':
				entry_callback(metadata);
				exit_callback(metadata);
				break;			

			case 'form':
			case 'group':
				entry_callback(metadata);
				for(var i = 0; i < metadata.children.length; i++)
				{
					var child = metadata.children[i];
					this.navigate(child, entry_callback, exit_callback);
				}
				exit_callback(metadata);
				break;
			case 'radio':
				entry_callback(metadata);
				
				for(var i = 0; i < metadata.values.length; i++)
				{
					var radio_value = metadata.values[i];
					this.navigate(radio_value, entry_callback, exit_callback);
				}
				
				exit_callback(metadata);
				break;
			default:
				console.log("meta_navigator unimplemented", metadata.type);
				entry_callback(metadata);
				exit_callback(metadata);
				break;
			
		}
	}
	else
	{
		
		console.log("meta_navigator metadata node without type", metadata);
	}
}

Meta_Navigator_.prototype.map = function(metadata, p_map_function)
{
	
	var result = {};
	
	if(metadata.type)
	{
		switch(metadata.type.toLowerCase())
		{
			case 'string':
				entry_callback(metadata);
				exit_callback(metadata);
				break;			

			case 'form':
			case 'group':
				entry_callback(metadata);
				for(var i = 0; i < metadata.children.length; i++)
				{
					var child = metadata.children[i];
					this.navigate(child, entry_callback, exit_callback);
				}
				exit_callback(metadata);
				break;
			case 'radio':
				entry_callback(metadata);
				
				for(var i = 0; i < metadata.values.length; i++)
				{
					var radio_value = metadata.values[i];
					this.navigate(radio_value, entry_callback, exit_callback);
				}
				
				exit_callback(metadata);
				break;
			default:
				console.log("meta_navigator unimplemented", metadata.type);
				entry_callback(metadata);
				exit_callback(metadata);
				break;
			
		}
	}
	else
	{
		
		console.log("meta_navigator metadata node without type", metadata);
	}
}


Meta_Navigator_.prototype.filter = function(metadata, p_filter_function)
{
	
	var result = {};
	
	if(metadata.type)
	{
		switch(metadata.type.toLowerCase())
		{
			case 'string':
				entry_callback(metadata);
				exit_callback(metadata);
				break;			

			case 'form':
			case 'group':
				entry_callback(metadata);
				for(var i = 0; i < metadata.children.length; i++)
				{
					var child = metadata.children[i];
					this.navigate(child, entry_callback, exit_callback);
				}
				exit_callback(metadata);
				break;
			case 'radio':
				entry_callback(metadata);
				
				for(var i = 0; i < metadata.values.length; i++)
				{
					var radio_value = metadata.values[i];
					this.navigate(radio_value, entry_callback, exit_callback);
				}
				
				exit_callback(metadata);
				break;
			default:
				console.log("meta_navigator unimplemented", metadata.type);
				entry_callback(metadata);
				exit_callback(metadata);
				break;
			
		}
	}
	else
	{
		
		console.log("meta_navigator metadata node without type", metadata);
	}
}