var profile = {

	is_logged_in: false,
		user_name: null,
		user_roles: null,
		auth_session: null,
		password: null,

get_auth_session_cookie: function ()
{
	var result = $mmria.getCookie("AuthSession");
	/*
	var cookie_string = new String(document.cookie);
	if(cookie_string.length > 0)
	{
		var cookie_array = cookie_string.split("=");
		if(cookie_array.length > 1 && cookie_array[0] == "AuthSession")
		{
			result=cookie_array[1];
		}
	}*/

	return result;
},
on_login_call_back: null,
on_logout_call_back: null,

initialize_profile: function ()
{
	var current_auth_session = $mmria.getCookie("AuthSession");

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
				if(json_response.auth_session && $mmria.getCookie("uid"))
				{
					$mmria.addCookie("AuthSession", json_response.auth_session);

					profile.is_logged_in = true;
					profile.user_name = $mmria.getCookie("uid");
					profile.password = $mmria.getCookie("pwd");
					profile.user_roles = $mmria.getCookie("roles");
					profile.auth_session = $mmria.getCookie("AuthSession");

					if(profile.user_roles.indexOf("committee_member") >-1)
					{
						g_source_db = "de_id";
					}
					else
					{
						g_source_db = "mmrds";
					}

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
						profile.password = null;
						g_source_db = null;
						$mmria.removeCookie("AuthSession");
				}
			}
			else
			{
				profile.is_logged_in = false;
				profile.user_name = null;
				profile.user_roles = null;
				profile.auth_session = null;
				profile.password = null;
				g_source_db = null;
				$mmria.removeCookie("AuthSession");
			}

			profile.render();

		}).fail(function(response) {

			profile.is_logged_in = false;
			profile.user_name = null;
			profile.user_roles = null;
			profile.auth_session = null;
			profile.password = null;
			g_source_db = null;
			profile.render();

			console.log("failed:", response);
		});


	}
	else
	{
		profile.try_session_login(profile.on_login_call_back);
		//document.getElementById('profile_content_id').innerHTML = "";
		//profile.render();

	}
},

render: function ()
{
	var result = [];

	

	if(profile.is_logged_in)
	{
		result.push('<a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" href="#"><span class="glyphicon glyphicon-user"></span> ');
		result.push(profile.user_name);
		result.push('</a>');
		result.push('<ul class="dropdown-menu" role="menu">');
		result.push('<li>');
		result.push('<form id="profile_form"  role="form">');
		result.push('<div class="form-group" id="profile_content_id">');

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
		result.push('</li><li>');
		result.push("<%=version%>")
		result.push('</li></ul>');

		result.push('</div>');
		result.push('</form>');
		result.push('</li>');
		result.push('</ul>');

	}
	else
	{

		result.push('<a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" href="#"><span class="glyphicon glyphicon-log-in"></span>  Login</a>');
		result.push('<ul class="dropdown-menu" role="menu">');
		result.push('<li>');
		result.push('<form id="profile_form"  role="form">');
		result.push('<div class="form-group" id="profile_content_id">');
		
		result.push('<ul style="list-style-type:none;">');
		result.push('<li><strong>user name:</strong> ');
		result.push('<input  id="profile_form_user_name" type="text" name="email" value="')
		if(profile.user_name)
		{
			result.push(profile.user_name);
		}
		result.push('" class="form-control" required />');
		result.push('</li>');
		result.push('<li><strong>password:</strong> ');
		result.push('<input id="profile_form_password" type="password" name="password" value="');
		if(profile.password)
		{
			result.push(profile.password);
		}
		result.push('" class="form-control" required />');
		result.push('</li>');
		result.push('<li><input type="button"  class="btn btn-default" value="Log in" /></li>');
		result.push('<li id="login_status_area">');
		result.push('</li>');
		result.push('<li>');
		result.push("<%=version%>")
		result.push('</li></ul>');


		result.push('</div>');
		result.push('</form>');
		result.push('</li>');
		result.push('</ul>');

	}

	var profile_content = document.getElementById('profile_content_id');
	if(profile_content)
	{
		profile_content.innerHTML = result.join("");
		$('#profile_content_id input[value="Log in"]').click(profile.login);

		$("#profile_form_password").bind("keypress", {}, keypressInBox);

			function keypressInBox(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if (code == 13) { //Enter keycode                        
					e.preventDefault();

					$("#profile_content_id input[value='Log in']").click();
				}
			};

			$("#profile_form_user_name").bind("keypress", {}, keypressInBox);

			function keypressInBox(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if (code == 13) { //Enter keycode                        
					e.preventDefault();

					$("#profile_content_id input[value='Log in']").click();
				}
			};

	}
	
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
		profile.user_name = email_text;
		profile.password = password_text;

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
	if(response)
	{
		var json_response = response[0];

		console.log(response);

		//{"ok":true,"userCtx":{"name":null,"roles":[]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"]}}
		valid_login = json_response.name != null;
		if(valid_login)
		{


			profile.is_logged_in = true;

			//profile.user_name = json_response.name;
			profile.user_roles = json_response.roles;
			profile.auth_session = json_response.auth_session;

			$mmria.addCookie("uid", profile.user_name);
			$mmria.addCookie("pwd", profile.password);
			$mmria.addCookie("roles", json_response.roles);
			$mmria.addCookie("AuthSession", profile.auth_session);


			if(profile.user_roles.indexOf("committee_member") >-1)
			{
				g_source_db = "de_id";
			}
			else
			{
				g_source_db = "mmrds";
			}

			if(profile.on_login_call_back)
			{
				profile.on_login_call_back();
			}

			profile.render();
		}
		else
		{
			profile.user_name = '';
			profile.password = null;
			$mmria.removeCookie("AuthSession");

			profile.render();
			profile.create_status_warning("Invalid user or password.")
		}
		
	}
	else
	{
		profile.render();
		profile.create_status_warning("Invalid user or password.")
	}
	

},

logout : function()
	{

	if(profile.on_logout_call_back)
	{
		profile.on_logout_call_back(profile.user_name, profile.password);
	}

	
	profile.is_logged_in=false;
	profile.user_name = '';
	profile.password = null;
	profile.user_roles=[];
	profile.auth_session='';

	g_source_db = null;

	$mmria.removeCookie("uid");
	$mmria.removeCookie("pwd");
	$mmria.removeCookie("roles");
	$mmria.removeCookie("AuthSession");

	g_source_db = null;

	profile.render();

	},
  try_session_login : function(p_success_call_back)
  {
	var current_auth_session = null;

	var url =  location.protocol + '//' + location.host + "/api/session";

	$.ajax({
		url: url,
		method: 'GET'
	}).done(function(response) {
		// this will be run when the AJAX request succeeds

		if(response && $mmria.getCookie("AuthSession"))
		{
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

				if(json_response.auth_session)
				{
					profile.auth_session = json_response.auth_session;
					$mmria.addCookie("AuthSession", profile.auth_session);

				}
				else
				{
					profile.auth_session = current_auth_session;
					$mmria.addCookie("AuthSession", profile.auth_session);

				}
				
				if(profile.user_roles.legnth == 1 && profile.user_roles[0]=="committee_member")
				{
					var url =  location.protocol + '//' + location.host + "/committee-member";
					window.location.href = url;
				}
				else if(profile.on_login_call_back)
				{
					profile.on_login_call_back();
				}
				
				if(p_success_call_back)
				{
					p_success_call_back(profile.auth_session);
				}
			}
			else
			{
				profile.is_logged_in = false;
				profile.user_name = null;
				profile.user_roles = null;
				profile.auth_session = null;
				g_source_db = null;
				$mmria.removeCookie("AuthSession");
			}
		}
		else
		{
			profile.is_logged_in = false;
			profile.user_name = null;
			profile.user_roles = null;
			profile.auth_session = null;
			g_source_db = null;
			$mmria.removeCookie("AuthSession");
		}

		profile.render();

	}).fail(function(response) {

		profile.is_logged_in = false;
		profile.user_name = null;
		profile.user_roles = null;
		profile.auth_session = null;
		g_source_db = null;
		
		profile.render();

		console.log("failed:", response);
	});

  },
	create_status_message: function (p_message)
	{
		var result = [];

		result.push('<div class="alert alert-success alert-dismissible">');
		result.push('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
		result.push('<strong>Info!</strong> ');
		result.push(p_message);
		result.push('</div>');

		document.getElementById("login_status_area").innerHTML = result.join("");

		window.setTimeout(profile.clear_status, 30000);
	},
	create_status_warning : function (p_message)
	{
		var result = [];

		result.push('<div class="alert alert-danger">');
		result.push('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
		result.push('<strong>Warning!</strong> ');
		result.push(p_message);
		result.push('</div>');

		document.getElementById("login_status_area").innerHTML = result.join("");

		window.setTimeout(profile.clear_status, 30000);
	},
	clear_status :function ()
	{
		document.getElementById("login_status_area").innerHTML = "<div>&nbsp;</div>";
	}
};
