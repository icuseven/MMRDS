var AppComponent = React.createClass({
	displayName: "AppComponent",
	getInitialState: function() 
	{
		//return { email: this.props.initialEmail, password: this.props.initialPassword };
		return { };
	},
	render: function render() 
	{
		return React.createElement('div', {},
			React.createElement('h1',{},'App Element: MMRIA'),
			React.createElement('div',{ id:'app_content_id'},'App Element: MMRIA')
		);
	}
});