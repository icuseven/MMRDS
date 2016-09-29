var SingleTreeNodeComponent = React.createClass(
{
	displayName: "SingleTreeNodeComponent",
	getInitialState() {
		return {metadata: this.props.defaultMetadata, path: this.props.defaultPath };
	},
	render() 
	{
		return React.createElement('div',{  key: this.state.path + "/" + this.state.metadata.name}, this.state.metadata.name, ' : ', this.state.metadata.type, ' ', this.state.path + "/" + this.state.metadata.name,
					' ',
					React.createElement('input',{ type:"button", value:"add key:value", path:this.state.path + "/" + this.state.metadata.name}),
					React.createElement('ul',{},this.get_prop_elements(this.state.metadata, this.state.path + "/" + this.state.metadata.name))
					);
	},
	get_prop_elements: function(metadata, p_path)
	{
		var result = [];
		for(var prop in metadata)
		{
			var name_check = prop.toLowerCase();
			if(name_check != "children" && name_check != "values")
			{
				result.push(React.createElement(ValueTreeNodeComponent,{ key: p_path + "/" + prop, defaultValue: this.state.metadata[prop], defaultPath: p_path + "/" + prop, metadata_property_name: prop }
				));
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

var ValueTreeNodeComponent = React.createClass(
{
	displayName: "ValueTreeNodeComponent",
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
	}
});