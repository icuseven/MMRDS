var profile = {

	is_logged_in: false,
		user_name: null,
		user_roles: null,
		auth_session: null,

get_auth_session_cookie: function ()
{
	var result = null;
	var cookie_string = new String(document.cookie);
	if(cookie_string.length > 0)
	{
		var cookie_array = cookie_string.split("=");
		if(cookie_array.length > 1 && cookie_array[0] == "AuthSession")
		{
			result=cookie_array[1];
		}
	}

	return result;
},
on_login_call_back: null,

set_auth_session_cookie: function (p_auth_session)
{
	var minutes_14 = 14;
	var current_date_time = new Date();
	var new_date_time = new Date(current_date_time.getTime() + minutes_14 * 60000);

	document.cookie = "AuthSession=" + p_auth_session + "; expires=" + new_date_time.toGMTString() + "; path=/";
},

expire_auth_session_cookie: function (p_auth_session)
{
	document.cookie = "AuthSession=" + p_auth_session + "; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
},

initialize_profile: function ()
{
	var current_auth_session = this.get_auth_session_cookie();

	if(current_auth_session)
	{
		var url =  location.protocol + '//' + location.host + "/api/session";

		$.ajax({
			url: url,
			beforeSend: function (request)
			{
				request.setRequestHeader("AuthSession", current_auth_session);
			},
			method: 'GET'
		}).done(function(response) {
			// this will be run when the AJAX request succeeds

			console.log("response\n", response);
			var valid_login = false;

			var json_response = response[0];

			//{"ok":true,"userCtx":{"name":null,"roles":[]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"]}}
			valid_login = json_response.userCTX.name != null;
			if(valid_login)
			{
				profile.is_logged_in = true;
				profile.user_name = json_response.userCTX.name;
				profile.user_roles = json_response.userCTX.roles;
				profile.auth_session = current_auth_session;


				profile.set_auth_session_cookie(current_auth_session);

				if(profile.on_login_call_back)
				{
					profile.on_login_call_back();
				}
			}
			else
			{
				profile.is_logged_in = false;
				profile.user_name = null;
				profile.user_roles = null;
				profile.auth_session = null;
				profile.expire_auth_session_cookie(current_auth_session);
			}

			profile.render();

		}).fail(function(response) {

			profile.is_logged_in = false;
			profile.user_name = null;
			profile.user_roles = null;
			profile.auth_session = null;

			profile.render();

			console.log("failed:", response);
		});


	}
	else
	{
		profile.is_logged_in = false;
		profile.user_name = null;
		profile.user_roles = null;
		profile.auth_session = null;

		profile.render();
	}
},

render: function ()
{
	var result = [];
	if(profile.is_logged_in)
	{
		result.push('<ul style="list-style-type:none;">');
		result.push('<li><strong>USER:</strong> ');
		result.push(profile.user_name);
		result.push('</li>');
		result.push('<li><table><tr><th>ROLES</th></tr>');
		for(var i = 0; i < profile.user_roles.length; i++)
		{
			result.push('<tr><td>');
			result.push(profile.user_roles[i]);
			result.push('</td></tr>');
		}
		
		result.push('</table> </li><li> <input type="button" value="Log Out" class="btn btn-default" onclick="profile.logout()"/>');
		result.push('</li>');
		result.push('</ul>');
	}
	else
	{
		result.push('<ul style="list-style-type:none;">');
		result.push('<li><strong>user_name:</strong> ');
		result.push('<input type="text" name="email" value="user1" class="form-control" required />');
		result.push('</li>');
		result.push('<li><strong>password:</strong> ');
		result.push('<input type="password" name="password" value="password" class="form-control" required />');
		result.push('</li>');
		result.push('<li><input type="button"  class="btn btn-default" value="Log in" /></li>');
		result.push('</ul>');
	}

	document.getElementById('profile_content_id').innerHTML = result.join("");
	$('#profile_content_id input[value="Log in"]').click(profile.login);
},

login: function ()
{
	var email_text = $("#profile_form input[name='email']").val();
	var password_text = $("#profile_form input[name='password']").val();

	if
	(
		email_text.length > 0 &&
		password_text.length > 0
	)
	{
		var ctx = this;
		var url =  location.protocol + '//' + location.host + "/api/session";
		var post_data = { "userid" : email_text , "password": password_text};
		$.ajax({
			"url": url,
			data: post_data
		}).done(profile.login_response).fail(function(response) {
				console.log("fail bubba");console.log(response);
		});
	}
},


login_response: function (response)
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


		profile.is_logged_in = true;
		profile.user_name = json_response.name;
		profile.user_roles = json_response.roles;
		profile.auth_session = json_response.auth_session;

		profile.set_auth_session_cookie(profile.auth_session);

		if(profile.on_login_call_back)
		{
			profile.on_login_call_back();
		}

	}
	else
	{
		profile.expire_auth_session_cookie(profile.auth_session);
	}

	profile.render();

},

logout : function()
	{
		profile.expire_auth_session_cookie(profile.auth_session);
		profile.is_logged_in=false;
		profile.user_name='';
		profile.user_roles=[];
		profile.auth_session='';
		profile.render();
	}
};
