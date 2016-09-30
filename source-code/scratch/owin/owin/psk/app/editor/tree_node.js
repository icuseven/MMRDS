var SingleTreeNodeComponent = React.createClass(
{
	displayName: "SingleTreeNodeComponent",
	getInitialState() {
		return {is_cut: false, delete_mode: 0, paste_mode: 0, metadata: this.props.defaultMetadata, path: this.props.defaultPath, collapsed: false};
	},
	render() 
	{
		var button_array = []
		
		if(this.state.collapsed)
		{
			button_array.push(React.createElement('input',{ key:1, type:"button", value:"+", onClick:this.toggle_child_display }))
		}
		else
		{
			button_array.push(React.createElement('input',{ key:1, type:"button", value:"-", onClick:this.toggle_child_display }));
		}
		
		if(this.state.is_cut)
		{
			button_array.push(' ');
			button_array.push(React.createElement('input',{ key:2, type:"button", value:"c*", onClick:this.update_cut }));
		}
		else
		{
			button_array.push(' ');
			button_array.push(React.createElement('input',{ key:2, type:"button", value:"c", onClick:this.update_cut }));
		}
		
		switch(this.state.delete_mode)
		{
			
			default: 
				button_array.push(' ');
				button_array.push(React.createElement('input',{ key:3, type:"button", value:"d", onClick:this.toggle_child_display }));
			break;
		}
		
		if(this.state.collapsed)
		{
			return React.createElement('div',{  onClick:this.toggle_child_display, key: this.state.path + "/" + this.state.metadata.name},
				button_array,
				' ',
				this.state.metadata.name, ' : ', this.state.metadata.type,
				' ',
				React.createElement('input',{ key: this.state.path + "/" + this.state.metadata.name + '/^', type:"button", value:"^", onClick:this.toggle_child_display })
				);
		}
		else
		{
			return React.createElement('div',{  key: this.state.path + "/" + this.state.metadata.name},
				button_array,
				' ',
				this.state.metadata.name, ' : ', this.state.metadata.type,
				' ',
				React.createElement('input',{ type:"button", value:"add key:value", path:this.state.path + "/" + this.state.metadata.name}),
				' ',
				React.createElement('input',{ key: this.state.path + "/" + this.state.metadata.name + '/^', type:"button", value:"^", onClick:this.toggle_child_display }),
				React.createElement('ul',{},this.get_prop_elements(this.state.metadata, this.state.path + "/" + this.state.metadata.name))
				);
		}		
		
		
	},
	toggle_child_display:function()
	{
		this.setState({collapsed: !this.state.collapsed});
	},
	update_cut:function()
	{
		this.setState({is_cut: !this.state.is_cut});
	},
	get_prop_elements: function(metadata, p_path)
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
	},
	
	set_meta_data_prop: function(prop, value)
	{
		this.state.metadata[prop] = value;
	}
	
}
);

var KeyValueNodeComponent = React.createClass(
{
	displayName: "KeyValueNodeComponent",
	getInitialState() {
		return { dataValue: this.props.defaultValue, path: this.props.defaultPath };
	},
	render() 
	{
		return React.createElement('li',{}, this.props.metadata_property_name, ' : ',
				React.createElement('input',{ onBlur: this.update_value, "path": this.props.defaultPath + "/" + this.props.metadata_property_name, defaultValue: this.state.dataValue, size: (this.state.dataValue)? this.state.dataValue.length + 5: 20 }));
	},
	update_value: function(e)
	{
		this.state.dataValue = e.currentTarget.value;
		this.props.set_meta_data_prop("update", this.props.defaultPath + "/" + this.props.metadata_property_name, e.currentTarget.value)
	}
});

var ValueNodeComponent = React.createClass(
{
	displayName: "ValueNodeComponent",
	getInitialState() {
		return { dataValue: this.props.defaultValue, path: this.props.defaultPath };
	},
	render() 
	{
		return React.createElement('li',
						{ key: this.props.defaultPath },
						React.createElement('input',{ key: this.props.defaultPath + '/^', type:"button", value:"^" }),
						' ',
						React.createElement('input',{ key: this.props.defaultPath + '/D', type:"button", value:"D" }),
						' ',
						React.createElement('input',{ key:this.props.defaultPath, type:"text", defaultValue:this.state.dataValue, size:(this.state.dataValue)? this.state.dataValue.length + 5: 20, onBlur:this.update_value})
						); 
				
},
	update_value: function(e)
	{
		this.state.dataValue = e.currentTarget.value;
		this.props.set_meta_data_prop("update", this.props.defaultPath, e.currentTarget.value);
	}
});


var CollectionNodeComponent = React.createClass(
{
	displayName: "CollectionNodeComponent",
	getInitialState() {
		return { collasped: false, metadata: this.props.defaultMetadata, path: this.props.defaultPath };
	},
	render() 
	{

		var result = null;
		var metadata = this.state.metadata;
		var p_path = this.props.defaultPath;
		
	
		switch(this.props.metadata_type.toLowerCase())
		{
			case 'children':
				var children_list = [];
				for(var i = 0; i < metadata.length; i++)
				{
					var child = metadata[i];
					
					children_list.push(React.createElement(SingleTreeNodeComponent,
						{ key: p_path + "/children/" + child.name,  defaultPath: p_path + "/" + child.name, defaultMetadata: child, set_meta_data_prop:this.props.set_meta_data_prop })
					);
				}
				
				if(this.state.collapsed)
				{
					result = React.createElement('li',
							{ key: p_path + "/children"},
							React.createElement('input',{ type:"button", value:"+", onClick:this.toggle_child_display }),
							' children'
							);
				}
				else
				{
					result = React.createElement('li',
						{ key: p_path + "/children"},
						React.createElement('input',{ type:"button", value:"-", onClick:this.toggle_child_display }),
						' children',
						React.createElement('ul',{},children_list)
						);
				}
				break;
			case 'values':
				var value_list = [];
				for(var i = 0; i < metadata.length; i++)
				{
					var child = metadata[i];
					
					value_list.push(React.createElement(ValueNodeComponent,{ key: p_path + "/values/" + i, defaultPath:p_path + "/values/" + i, defaultValue:child, set_meta_data_prop:this.props.set_meta_data_prop}));
				}
				
				if(this.state.collapsed)
				{
					result = React.createElement('li',
							{ key: p_path + "/values"},
							React.createElement('input',{ type:"button", value:"+", onClick:this.toggle_child_display }),
							' values ',
							React.createElement('input',{ type:"button", value:"add value", onClick:this.toggle_child_display })
							);
				}
				else
				{
					result = React.createElement('li',
							{ key: p_path + "/values"},
							React.createElement('input',{ type:"button", value:"-", onClick:this.toggle_child_display }),
							' values ',
							React.createElement('input',{ type:"button", value:"add value", onClick:this.toggle_child_display }),
							React.createElement('ul',{},value_list)
							);
				}
				break;
			default:
				console.log("CollectionNodeComponent.render: this should NOT be happening");
				break;
		}
	
		return result;	
	},
	toggle_child_display:function()
	{
		this.setState({collapsed: !this.state.collapsed});
	}
});
