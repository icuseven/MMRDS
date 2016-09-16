var LoginComponent = React.createClass({
	displayName: "LoginComponent",
	getInitialState: function() 
	{
		//return { email: this.props.initialEmail, password: this.props.initialPassword };
		return { };
	},
	componentWillMount:function()
	{
		this.setState({ email: "user1", password: "password" });
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
	render: function render() 
	{
		if(this.state.is_logged_in)
		{
			return React.createElement('form', {},
				React.createElement('fieldset',{},
					React.createElement('legend',{},'Login:'),
					'Email:', 
					React.createElement('input', { type:'text', ref:'email', onChange:this.onNoChange, onBlur: this.onEmailChange, defaultValue: this.state.email}),
					React.createElement('br'),
					'Password:', 
					React.createElement('input', { type:'password', ref:'password', onChange:this.onPasswordChange, defaultValue:this.state.password}),
					React.createElement('input', {  type:'button', onClick:this.handleLogin, value:'login'})
				)
			);
		}
		else
		{
			return React.createElement('form', {},
					React.createElement('fieldset',{},
						React.createElement('legend',{},'Login:'),
						'Email:', 
						React.createElement('input', { type:'text', ref:'email', onChange:this.onNoChange, onBlur: this.onEmailChange, defaultValue: this.state.email}),
						React.createElement('br'),
						'Password:', 
						React.createElement('input', { type:'password', ref:'password', onChange:this.onPasswordChange, defaultValue:this.state.password}),
						React.createElement('input', {  type:'button', onClick:this.handleLogin, value:'login'})
					)
			);		
		}

	},
	login: function()
	{
		if
		(
			this.refs['email'].value.length > 0 &&
			this.refs['password'].value.length > 0
		)
		{
			var url =  location.protocol + '//' + location.host + "/api/session";
			var AJAX = new AJAX_();
			var post_data = "userid=" + this.refs['email'].value + "&password=" + this.refs['password'].value;
			var meta_data = AJAX.GetResponse(url + "?" + post_data, function(response)
			{
				//ready_this.CreateFromMetaData(document, ready_this, metadata, parent);
				console.log("response\n", response);
				var valid_login = false;
		
				var json_response = response[0];

				console.log(response);
				
				//document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC";
				//console.log(this.$.ajax.lastResponse);
				//{"ok":true,"userCtx":{"name":null,"roles":[]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"]}}
				//http://stackoverflow.com/questions/34042408/polymerjs-iron-ajax-how-to-bind-token-to-headers-property
				
				valid_login = json_response.name != null;
				if(valid_login)
				{
					var blank = { 
						is_logged_in: true, 
						user_name: json_response.name,
						user_roles: json_response.roles,
						auth_session: json_response.auth_session,
					};
				}
				
			}
			
			);		
		
		}
		

	},
	handle_response: function(request) 
	{

	},
	ready:function()
	{
		var current_auth_session = null;
		var cookie_string = new String(document.cookie);
		if(cookie_string.length > 0)
		{
			var cookie_array = cookie_string.split("=");
			if(cookie_array.length > 1 && cookie_array[0] == "AuthSession")
			{
				current_auth_session=cookie_array[1];
			}
		}
		
		if(current_auth_session)
		{
			this.$.ajax.url = location.protocol + '//' + location.host + "/api/session";
			this.$.ajax.headers='{"AuthSession": ' + current_auth_session + '}';
			this.$.ajax.generateRequest();
		}
	},
	handle_response: function(request) 
	{
		var valid_login = false;
		
	
		var json_response = request.detail.response[0];
		this.user_name = json_response.userCTX.name;
		this.user_roles = json_response.userCTX.roles
		
		var current_auth_session = null;
		var cookie_string = new String(document.cookie);
		if(cookie_string.length > 0)
		{
			var cookie_array = cookie_string.split("=");
			if(cookie_array.length > 1 && cookie_array[0] == "AuthSession")
			{
				current_auth_session=cookie_array[1];
			}
		}
		
		this.auth_session = current_auth_session;

		console.log(request.detail.response);
		/*
		var minutes_14 = 14;
		var current_date_time = new Date();
		var new_date_time = new Date(current_date_time.getTime() + minutes_14 * 60000);
		
		document.cookie = "AuthSession=" + json_response.auth_session + "; expires=" + new_date_time.toISOString() + ";";
		
		
		*/
		valid_login = this.user_name != null;
		if(valid_login)
		{
			this.fire('profile_login_changed', { 
				is_logged_in: true, 
				user_name: this.user_name,
				user_roles: this.user_roles,
				auth_session: this.auth_session,
			});
		}
		
	}
});