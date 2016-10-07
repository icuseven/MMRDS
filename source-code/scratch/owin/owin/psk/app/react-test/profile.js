var Profile_Component = {
	is_logged_in: false,
	user_name: null,
	user_roles: null,
	auth_session: null,
	checkCookieForAuthentication:function()
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
			var url =  location.protocol + '//' + location.host + "/api/session";
			var AJAX = new AJAX_();
			var meta_data = AJAX.GetResponse(url, this.handle_get_response);
		}
		else
		{
			this.setState({ user_name: "user1", password: "password" });
		}
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
		document.cookie = "AuthSession=" + this.auth_session + "; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";		
		this. is_logged_in: false	});
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
		if(this.is_logged_in)
		{
			var result = [];
			
			result.push('<form style="float:\'left\'>');
			result.push('<fieldset>');
			result.push('<legend>profile:</legend>'),
			result.push('user: ');
			result.push(this.user_name);
			result.push('<br/>');
			result.push('roles: ');
			result.push(this.user_roles.join(','));
			result.push('<br/>');
			result.push('<br/>');
			result.push('<input type="button" onClick:profile_component.onLogout, value="logout" />');
			result.push('</fieldset>');
			result.push('</form>');
			
			return result.join();
		}
		else
		{
			result.push('<form id="profile_form" style="float:\'left\'>');
			result.push('<fieldset>');
			result.push('<legend>Login:</legend>'),
			result.push('Email: ');
			result.push('<input type="text" name="email" onChange:this.onNoChange, onBlur: this.onEmailChange, value="' + this.state.user_name + '" />');
			result.push('<br/>');
			result.push('Password: ', 
			result.push('<input type="password" name="password" onChange:this.onPasswordChange value="' + this.state.password + '" />');
			result.push(' ',
			result.push('<input type="button" onClick:profile_component.handleLogin value="login" />');
			
			return result.join();
		}

	},
	login: function()
	{
		var email_text = $("#profile_form[name='email']").val();
		var password_text = $("#profile_form[name='password']").val();
		
		if
		(
			email_text.length > 0 &&
			password_text.length > 0
		)
		{
			var url =  location.protocol + '//' + location.host + "/api/session";
			var AJAX = new AJAX_();
			var post_data = "userid=" + email_text + "&password=" + password_text;
			var meta_data = AJAX.GetResponse(url + "?" + post_data, this.login_response);
		
		}
		

	},
	login_response: function(response) 
	{
		//ready_this.CreateFromMetaData(document, ready_this, metadata, parent);
		console.log("response\n", response);
		var valid_login = false;

		var json_response = response[0];

		console.log(response);
		
		//{"ok":true,"userCtx":{"name":null,"roles":[]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"]}}
		valid_login = json_response.name != null;
		if(valid_login)
		{
			var info = { 
				is_logged_in: true, 
				user_name: json_response.name,
				user_roles: json_response.roles,
				auth_session: json_response.auth_session
			};
			
			this.setState({ is_logged_in: true,
			user_name: json_response.name,
			user_roles: json_response.roles,
			auth_session: json_response.auth_session
			});
			var minutes_14 = 14;
			var current_date_time = new Date();
			var new_date_time = new Date(current_date_time.getTime() + minutes_14 * 60000);
			
			document.cookie = "AuthSession=" + this.state.auth_session + "; expires=" + new_date_time.toGMTString() + "; path=/";
			
			this.props.profile_login_changed(info);
		}
		else
		{
			this.setState({ is_logged_in: false	});
			document.cookie = "AuthSession=" + this.state.auth_session + "; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";		
		}
				
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
	handle_get_response: function(response) 
	{
		//ready_this.CreateFromMetaData(document, ready_this, metadata, parent);
		console.log("response\n", response);
		var valid_login = false;

		var json_response = response[0];

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
		
		
		
		//{"ok":true,"userCtx":{"name":null,"roles":[]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"]}}
		valid_login = json_response.userCTX.name != null;
		if(valid_login)
		{
			
			var info = { 
				is_logged_in: true, 
				user_name: json_response.userCTX.name,
				user_roles: json_response.userCTX.roles,
				auth_session: current_auth_session
			};
			
			this.setState({
				is_logged_in: true,
				user_name: json_response.userCTX.name,
				user_roles: json_response.userCTX.roles,
				auth_session: current_auth_session
			});
			
			var minutes_14 = 14;
			var current_date_time = new Date();
			var new_date_time = new Date(current_date_time.getTime() + minutes_14 * 60000);
			
			document.cookie = "AuthSession=" + this.state.auth_session + "; expires=" + new_date_time.toGMTString() + "; path=/";
			
			this.props.profile_login_changed(info);
		}
		else
		{
			this.setState({ is_logged_in: false	});
			document.cookie = "AuthSession=" + this.state.auth_session + "; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";		
		}

		
	}
};