var NumberComponent = React.createClass({
	displayName: "NumberComponent",
	getInitialState: function() 
	{
		//return { email: this.props.initialEmail, password: this.props.initialPassword };
		return { };
	},
	componentWillMount:function()
	{
		
	},
	onChange : function(e)
	{
		var state_name = new String(this.props.metadata.name);
		this.setState({ state_name: e.target.value });
	},
	render: function() 
	{
		return React.createElement(
			"p",{ key: this.props.metadata.name},
			this.props.metadata.prompt,
			' ',
			React.createElement("input", 
			{ 
				onChange:this.onChange, 
				type:"text", 
				ref : this.props.metadata.name,
				"defaultValue": this.props.defaultValue
			})
		);
	}
});