function Meta_Navigator(p_entry_callback, p_exit_callback)
{
	this.entry_callback = p_entry_callback;
	this.exit_callback = p_exit_callback;
};

Meta_Navigator.prototype.navigate = function(metadata)
{
	if(metadata.type)
	{
		switch(metadata.type.toLowerCase())
		{
			case 'string':
				this.entry_callback(metadata);
				this.exit_callback(metadata);
				break;			
			// container field
			case 'form':
			case 'group':
				this.entry_callback(metadata);
				for(var i = 0; i < metadata.children.length; i++)
				{
					var child = metadata.children[i];
					this.navigate(child);
				}
				this.exit_callback(metadata);
				break;
			// list field
			case 'radio':
				this.entry_callback(metadata);
				
				for(var i = 0; i < metadata.values.length; i++)
				{
					var radio_value = metadata.values[i];
					this.navigate(radio_value);
				}
				
				this.exit_callback(metadata);
				break;
			// grid field
			case 'grid':
				this.entry_callback(metadata);
				for(var i = 0; i < metadata.children.length; i++)
				{
					var child = metadata.children[i];
					this.navigate(child, entry_callback, exit_callback);
				}
				this.exit_callback(metadata);
				break;				
			default:
				console.log("meta_navigator unimplemented", metadata.type);
				this.entry_callback(metadata);
				this.exit_callback(metadata);
				break;
			
		}
	}
	else
	{
		
		console.log("meta_navigator metadata node without type", metadata);
	}
}

Meta_Navigator.prototype.map = function(metadata, p_map_function)
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


Meta_Navigator.prototype.filter = function(metadata, p_filter_function)
{
	
	var result = {};
	
	if(metadata.type)
	{
		switch(metadata.type.toLowerCase())
		{
			// single field
			case 'string':
				if(p_filter_function(metadata))
				{
					this.entry_callback(metadata);
					this.exit_callback(metadata);
				}
				break;			
			// container field
			case 'form':
			case 'group':
				if(p_filter_function(metadata))
				{
					this.entry_callback(metadata);
				}
				for(var i = 0; i < metadata.children.length; i++)
				{
					var child = metadata.children[i];
					this.filter(child, p_filter_function);
				}
				
				if(p_filter_function(metadata))
				{
					this.exit_callback(metadata);
				}
				break;
			// list field
			case 'radio':
				if(p_filter_function(metadata))
				{
					this.entry_callback(metadata);
				}
				
				for(var i = 0; i < metadata.values.length; i++)
				{
					var radio_value = metadata.values[i];
					this.filter(radio_value);
				}
				
				if(p_filter_function(metadata))
				{
					this.exit_callback(metadata);
				}
				break;
			// grid field
			case 'grid':
				if(p_filter_function(metadata))
				{
					this.entry_callback(metadata);
				}
				
				for(var i = 0; i < metadata.children.length; i++)
				{
					var child = metadata.children[i];
					this.filter(child);
				}
				
				if(p_filter_function(metadata))
				{
					this.exit_callback(metadata);
				}
				break;				
			default:
				console.log("meta_filter unimplemented", metadata.type);
				if(p_filter_function(metadata))
				{
					this.entry_callback(metadata);
					this.exit_callback(metadata);
				}
				break;
			
		}
	}
	else
	{
		
		console.log("meta_navigator metadata node without type", metadata);
	}
}