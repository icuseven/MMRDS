
var g_couchdb_url = null;

var g_ui = { 
	user_summary_list:[],
	user_list:[],
	data:null,
	url_state: {
    selected_form_name: null,
    selected_id: null,
    selected_child_id: null,
    path_array : []

  }
};

var $$ = {
 is_id: function(value){
   // 2016-06-12T13:49:24.759Z
    if(value)
    {
      var test = value.match(/^\d+-\d+-\d+T\d+:\d+:\d+.\d+Z$/);
      return (test)? true : false;
    }
    else
    {
        return false;
    }
  },
  add_new_user: function(p_name, p_password)
  {
	  return {
		"_id": "org.couchdb.user:" + p_name,
		"password": p_password,
		"password_scheme": "pbkdf2",
		"iterations": 10,
		"name": p_name,
		"roles": [  ],
		"type": "user",
		"derived_key": "a1bb5c132df5b7df7654bbfa0e93f9e304e40cfe",
		"salt": "510427706d0deb511649021277b2c05d"
		};
  }
};



$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';
	/*profile.on_login_call_back = function (){
				load_users();
    };*/
	//profile.initialize_profile();

	load_values();

	$(document).keydown(function(evt){
		if (evt.keyCode==83 && (evt.ctrlKey)){
			evt.preventDefault();
			//metadata_save();
		}
	});



	window.onhashchange = function(e)
	{
		if(e.isTrusted)
		{
			var new_url = e.newURL || window.location.href;

			g_ui.url_state = url_monitor.get_url_state(new_url);
		}
	};
});



function load_values()
{
	$.ajax({
			url: location.protocol + '//' + location.host + '/api/values',
	}).done(function(response) {
			g_couchdb_url = response.couchdb_url;
      	load_users();

 

	});

}


function load_users()
{
	var metadata_url = location.protocol + '//' + location.host + '/api/user';

	$.ajax({
			url: metadata_url,
			beforeSend: function (request)
			{
				request.setRequestHeader("AuthSession", $mmria.getCookie("AuthSession"));
			}
	}).done(function(response) {
			
			var temp = [];
			for(var i = 0; i < response.rows.length; i++)
			{
				temp.push(response.rows[i].doc);
			}
			console.log(temp);
			g_ui.user_summary_list = temp;
			console.log(g_ui.user_summary_list);
			g_ui.url_state = url_monitor.get_url_state(window.location.href);

			//document.getElementById('navigation_id').innerHTML = navigation_render(g_user_list, 0, g_ui).join("");

			document.getElementById('form_content_id').innerHTML = user_render(g_ui, "", g_ui).join("");

	});
}








function server_save(p_user)
{
	console.log("server save");
	var current_auth_session = profile.get_auth_session_cookie();

	if(current_auth_session)
	{ 
		$.ajax({
					url: location.protocol + '//' + location.host + '/api/user',
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					data: JSON.stringify(p_user),
					type: "POST",
					beforeSend: function (request)
					{
						request.setRequestHeader ("Authorization", "Basic " + btoa($mmria.getCookie("uid")  + ":" + $mmria.getCookie("pwd")));
						request.setRequestHeader("AuthSession", $mmria.getCookie("AuthSession"));
					}//,
			}).done(function(response) 
			{


						var response_obj = eval(response);
						if(response_obj.ok)
						{
							g_user_list._rev = response_obj.rev; 
							document.getElementById('form_content_id').innerHTML = editor_render(g_user_list, "", g_ui).join("");
						}
						//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
					console.log("metadata sent", response);
			});
	}

}

function add_new_user_click()
{
	var new_user_name = document.getElementById('new_user_name').value;
	var new_user_password = document.getElementById('new_user_password').value;
	if(
		is_valid_user_name(new_user_name) && 
		is_valid_password(new_user_password)
	)
	{

		var new_user = $$.add_new_user(new_user_name, new_user_password);
		g_ui.user_summary_list.push(new_user);
		document.getElementById('form_content_id').innerHTML = user_render(g_ui, "", g_ui).join("");
		console.log("greatness awaits.");
	}
	else
	{
		create_status_warning("invalid user name or password.");
		console.log("got nothing.");
	}
}


function change_password_user_click(p_user_id)
{
	
	var new_user_password = document.querySelector('[role="confirm_1"][path="' + p_user_id + '"]').value;
	var new_confirm_password = document.querySelector('[role="confirm_2"][path="' + p_user_id + '"]').value;
	if(
		is_valid_password(new_user_password) && 
		is_valid_password(new_confirm_password) &&
		new_user_password == new_confirm_password
	)
	{
		var user_index = -1;
		var user_list = g_ui.user_summary_list;
		var user = null;
		for(var i = 0; i < user_list.length; i++)
		{
			if(user_list[i]._id == p_user_id)
			{
				user = user_list[i];
				break;
			}
		}


		if(user)
		{
			user.password = new_user_password;

			var current_auth_session = profile.get_auth_session_cookie();

			if(current_auth_session)
			{ 
				$.ajax({
					url: location.protocol + '//' + location.host + '/api/user',
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					data: JSON.stringify(user),
					type: "POST",
					beforeSend: function (request)
					{
						request.setRequestHeader("AuthSession", current_auth_session);
					}
				}).done(function(response) 
				{
					var response_obj = eval(response);
					if(response_obj.ok)
					{
						for(var i = 0; i < g_ui.user_summary_list.length; i++)
						{
							if(g_ui.user_summary_list[i]._id == response_obj.id)
							{
								g_ui.user_summary_list[i]._rev = response_obj.rev; 
								break;
							}
						}
						document.getElementById('form_content_id').innerHTML = user_render(g_ui, "", g_ui).join("");
						console.log("password saved sent", response);


					}
					//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
					
				});
			}
		}

		document.getElementById('form_content_id').innerHTML = user_render(g_ui, "", g_ui).join("");
		console.log("greatness awaits.");
	}
	else
	{
		create_status_warning("invalid password and confirm");
		console.log("got nothing.");
	}
}


function is_valid_user_name(p_value)
{
	var result = true;

	if(
		p_value && 
		p_value.length >4
	)
	{
		//console.log("greatness awaits.");
	}
	else
	{
		result = false;
	}

	return result;
}

function is_valid_password(p_value)
{
	var result = true;

	if(
		p_value &&
		p_value.length > 8
	)
	{
		//console.log("greatness awaits.");
	}
	else
	{
		result = false;
	}

	return result;
	
}

function save_user(p_user_id)
{
	var user_index = -1;
	var user_list = g_ui.user_summary_list;

	for(var i = 0; i < user_list.length; i++)
	{
		if(user_list[i]._id == p_user_id)
		{
			user_index = i;
			break;
		}
	}

	if(user_index > -1)
	{
		var user = user_list[user_index];
		var current_auth_session = profile.get_auth_session_cookie();

			if(current_auth_session)
			{ 
				$.ajax({
					url: location.protocol + '//' + location.host + '/api/user',
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					data: JSON.stringify(user),
					type: "POST",
					beforeSend: function (request)
					{
						request.setRequestHeader("AuthSession", current_auth_session);
					}
				}).done(function(response) 
				{
					var response_obj = eval(response);
					if(response_obj.ok)
					{
						for(var i = 0; i < g_ui.user_summary_list.length; i++)
						{
							if(g_ui.user_summary_list[i]._id == response_obj.id)
							{
								g_ui.user_summary_list[i]._rev = response_obj.rev; 
								break;
							}
						}
						document.getElementById('form_content_id').innerHTML = user_render(g_ui, "", g_ui).join("");
						console.log("password saved sent", response);


					}
					//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
					
				});
			}
	}
}

function add_role(p_user_id)
{
	var selected_role = document.querySelector('select[path="' + p_user_id + '"]');
	if(selected_role && selected_role.value != '')
	{
		var user_index = -1;
		var user_list = g_ui.user_summary_list;
		var escaped_id =  convert_to_jquery_id(p_user_id);
		for(var i = 0; i < user_list.length; i++)
		{
			if(user_list[i]._id == p_user_id)
			{
				user_index = i;
				break;
			}
		}

		if(user_index > -1)
		{
			var user = user_list[user_index];
			user.roles.push(selected_role.value);
			g_ui.user_summary_list[user_index] = user;
			$( "#" + escaped_id).replaceWith( user_entry_render(user, "", g_ui).join("") );
			create_status_message("role added");
		}
	}
}


function remove_role(p_user_id, p_role)
{
	var user_index = -1;
	var user_list = g_ui.user_summary_list;
	var escaped_id =  convert_to_jquery_id(p_user_id);
	for(var i = 0; i < user_list.length; i++)
	{
		if(user_list[i]._id == p_user_id)
		{
			user_index = i;
			break;
		}
	}

	if(user_index > -1)
	{
		var user = user_list[user_index];
		var role_index = user.roles.indexOf(p_role);
		if(role_index > -1)
		{
			user.roles.splice(role_index, 1);
			g_ui.user_summary_list[user_index] = user;
			$( "#" + escaped_id).replaceWith( user_entry_render(user, "", g_ui).join("") );
			create_status_message("role removed.");
		}
	}
}

function change_password(p_user_id, p_role)
{
	var user_index = -1;
	var user_list = g_ui.user_summary_list;
	var escaped_id =  convert_to_jquery_id(p_user_id);
	for(var i = 0; i < user_list.length; i++)
	{
		if(user_list[i]._id == p_user_id)
		{
			user_index = i;
			break;
		}
	}

	if(user_index > -1)
	{
		var user = user_list[user_index];
		var role_index = user.roles.indexOf(p_role);
		if(role_index > -1)
		{
			user.roles.splice(role_index, 1);
			g_ui.user_summary_list[user_index] = user;
			$( "#" + escaped_id).replaceWith( user_entry_render(user, "", g_ui).join("") );
		}
	}
}


function convert_to_jquery_id(p_value)
{
	return p_value.replace('@', 'ATT').replace(':','COL').replace(/\./g,'DOT');
}


function create_status_message(p_message)
{
	var result = [];

	result.push('<div class="alert alert-success alert-dismissible">');
	result.push('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
	result.push('<strong>Info!</strong> ');
	result.push(p_message);
	result.push('</div>');

	document.getElementById("status_area").innerHTML = result.join("");

	window.setTimeout(clear_status, 30000);
}

function create_status_warning(p_message)
{
	var result = [];

	result.push('<div class="alert alert-danger">');
	result.push('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
	result.push('<strong>Warning!</strong> ');
	result.push(p_message);
	result.push('</div>');

	document.getElementById("status_area").innerHTML = result.join("");

	window.setTimeout(clear_status, 30000);
}

function clear_status()
{
	document.getElementById("status_area").innerHTML = "<div>&nbsp;</div>";
}
