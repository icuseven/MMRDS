var SummaryComponent = React.createClass({
	displayName: "SummaryComponent",
	getInitialState: function() 
	{

		return { };
	},
	componentWillMount:function()
	{
		
	},
	handleLogin : function (e)
	{
		console.log('handle login');
		console.log(e);
		this.login();
	},
	onEmailChange : function()
	{
		console.log(this.refs['email'].value);
	},
	onNoChange : function()
	{
		console.log('on no change');
	},
	onLogin : function()
	{
		this.state.is_logged_in = true;
	},
	onLogout : function()
	{
		document.cookie = "AuthSession=" + this.state.auth_session + "; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";		
		this.setState({ is_logged_in: false	});
		var info = { 
				is_logged_in: false, 
				user_name: '',
				user_roles: [],
				auth_session: ''
			};
		this.props.profile_login_changed(info);
		
		
	},
	render: function render() 
	{

			return React.createElement('form', {},
					React.createElement('fieldset',{},
						React.createElement('legend',{},'select action:'),
						React.createElement('input', {  type:'button', onClick:this.addNewCase, value:'add new mortality case'}), 
						React.createElement('br'),
						React.createElement('hr'),
						'search text: ',
						React.createElement('input', {  type:'text' }),
						' ',
						React.createElement('input', {  type:'button', onClick:this.addNewCase, value:'search'}),
						React.createElement('ul',{},
							React.createElement('li',{},'[ select ] name last (record number)'),
							React.createElement('li',{},'[ select ] name last (record number)'),
							React.createElement('li',{},'[ select ] name last (record number)')
						)
					)
			);		
	}
});