var SingleTreeNodeComponent = React.createClass(
{
	displayName: "SingleTreeNodeComponent",
	getInitialState() {
		return {metadata: this.props.defaultMetadata, path: this.props.defaultPath, collapsed: false};
	},
	render() 
	{
		
		if(this.state.collapsed)
		{
			return React.createElement('div',{  onClick:this.toggle_child_display, key: this.state.path + "/" + this.state.metadata.name},
				React.createElement('input',{ type:"button", value:"+", onClick:this.toggle_child_display }),
				' ',
				this.state.metadata.name, ' : ', this.state.metadata.type,
				' '
				);
		}
		else
		{
			return React.createElement('div',{  key: this.state.path + "/" + this.state.metadata.name},
				React.createElement('input',{ type:"button", value:"-", onClick:this.toggle_child_display }),
				' ',
				this.state.metadata.name, ' : ', this.state.metadata.type,
						' ',
						React.createElement('input',{ type:"button", value:"add key:value", path:this.state.path + "/" + this.state.metadata.name}),
						React.createElement('ul',{},this.get_prop_elements(this.state.metadata, this.state.path + "/" + this.state.metadata.name))
						);
		}
	},
	toggle_child_display:function()
	{
		this.setState({collapsed: !this.state.collapsed});
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
					for(var i = 0; i < metadata.children.length; i++)
					{
						var child = metadata.children[i];
						
						result.push(React.createElement(SingleTreeNodeComponent,
							{ key: p_path + "/" + child.name,  defaultPath: p_path + "/" + child.name, defaultMetadata: child, set_record_data:this.set_record_data })
						);
					}
					break;
				case 'values':
					for(var i = 0; i < metadata.values.length; i++)
					{
						var child = metadata.values[i];
						
						result.push(React.createElement('li',
							{ key: p_path + "/" + child },
							child
							));
					}
					break;
				default:
					result.push(React.createElement(KeyValueNodeComponent,{ key: p_path + "/" + prop, defaultValue: this.state.metadata[prop], defaultPath: p_path + "/" + prop, metadata_property_name: prop, set_meta_data_prop:this.set_meta_data_prop }));
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
				React.createElement('input',{ onChange:this.update_value, "path": this.props.defaultPath + "/" + this.props.metadata_property_name, defaultValue: this.state.dataValue }));
	},
	update_value: function(e)
	{
		this.state.dataValue = e.currentTarget.value;
		this.props.set_meta_data_prop(this.props.metadata_property_name, e.currentTarget.value)
	}
});

