var SingleTreeNodeComponent = React.createClass(
{
	displayName: "SingleTreeNodeComponent",
	getInitialState() {
		return {metadata: this.props.defaultMetadata, path: this.props.defaultPath };
	},
	render() 
	{
		return React.createElement('div',{  key: this.state.path + "/" + this.state.metadata.name, onclick: function() { this.props.set_record_data(this.state.path + "/"); } }, this.state.metadata.name, ' : ', this.state.metadata.type, ' ', this.state.path + "/" + this.state.metadata.name,
					React.createElement('ul',{},this.get_prop_elements(this.state.metadata, this.state.path + "/" + this.state.metadata.name))
					);
	},
	get_prop_elements: function(metadata, path)
	{
		var result = [];
		for(var prop in metadata)
		{
			var name_check = prop.toLowerCase();
			if(name_check != "children" && name_check != "values")
			{
				result.push(React.createElement('li',{key: this.state.path + "/" + prop }, prop, ' : ',
				React.createElement('input',{ "path": this.state.path + "/" + prop, defaultValue: this.state.metadata[prop]})));
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
		return {metadata: this.props.defaultMetadata, path: this.props.defaultPath };
	},
	render() 
	{
		return React.createElement('div',{  key: this.state.path + "/" + this.state.metadata.name }, this.state.metadata.name, ' : ', this.state.metadata.type, ' ', this.state.path + "/" + this.state.metadata.name,
					React.createElement('ul',{},this.get_prop_elements(this.state.metadata, this.state.path + "/" + this.state.metadata.name))
					);
	},
	get_prop_elements: function(metadata, path)
	{
		var result = [];
		for(var prop in metadata)
		{
			var name_check = prop.toLowerCase();
			if(name_check != "children" && name_check != "values")
			{
				result.push(React.createElement('li',{key: this.state.path + "/" + prop }, prop, ' : ',
				React.createElement('input',{ "path": this.state.path + "/" + prop, defaultValue: this.state.metadata[prop]})));
			}

		}
		return result;
	}
}
);