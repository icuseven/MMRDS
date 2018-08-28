
var g_migration_plan_list = [];


function get_migation_plan_default()
{
  return {
    "_id": $mmria.get_new_guid(),
    "name":"",
    "description":"",
    "date_created": new Date(), 
    "created_by": "", 
    "date_last_updated": new Date(),
    "last_updated_by":"",
    "data_type":"migration-plan",
    "plan_items":[
        {
            "old_mmria_path": "",
            "new_mmria_path": "",
            "old_value":"",
            "new_value":"",
            "comment":""
        }
    ]
};

}

function get_migation_plan_item_default ()
{
  return {

            "old_mmria_path": "",
            "new_mmria_path": "",
            "old_value":"",
            "new_value":"",
            "comment":""
};

}



$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';
	/*profile.on_login_call_back = function (){
				load_users();
    };*/
	//profile.initialize_profile();

	load_migration_plan();

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



function load_migration_plan()
{

	$.ajax({
		url: location.protocol + '//' + location.host + '/api/migration_plan',
	}).done(function(response) 
	{
		g_migration_plan_list = [];
		for(var i in response)
		{
			var item = response[i];
			if(item.data_type=="migration-plan")
			{
				
				g_migration_plan_list.push(item);
			}

			
		}
		
		document.getElementById('output').innerHTML = render_migration_plan().join("");
	});

}

function render_migration_plan()
{

	var result = [];
	result.push("<br/>");
	result.push("<table bgcolor=#CCCCCC>");
	result.push("<tr><th colspan=2 bgcolor=silver>add new migration plan</td><tr>");
	result.push("<tr><td align=right><b>name:</b></td><td><input id='add_new_plan_name' type='text' value='' size=45 /></td></tr>")
	result.push("<tr><td><b>description:</b></td><td><textarea cols=45 rows=7 id='add_new_plan_description'></textarea></td></tr>")
	result.push("<tr><td colspan=2 align=right><input type='button' value='add new plan' onclick='add_new_plan_click()' /></td></tr>")
	result.push("</table>");

	result.push("<br/><br/>");
	result.push("<table>");
	result.push("<tr><th colspan=6 bgcolor=silver>migration plan list</th></tr>");
	result.push("<tr>");
	result.push("<th>name</th>");
	result.push("<th>description</th>");
	result.push("<th>created_by</th>");
	result.push("<th>date_created</th>");
	result.push("<th>date_last_updated</th>");
	result.push("<th>last_updated_by</th>");
	result.push("<th>&nbsp;</th>");
	result.push("</tr>");
	for(var i in g_migration_plan_list)
	{
		var item = g_migration_plan_list[i];

		if(i % 2)
		{
			result.push("<tr bgcolor='#CCCCCC'>");
		}
		else
		{
			result.push("<tr>");
		}
		result.push("<td>");
		result.push(item.name);
		result.push("</td>");
		result.push("<td>");
		result.push(item.description);
		result.push("</td>");
		result.push("<td>");
		result.push(item.created_by);
		result.push("</td>");
		result.push("<td>");
		result.push(item.date_created);
		result.push("</td>");
		result.push("<td>");
		result.push(item.date_last_updated);
		result.push("</td>");
		result.push("<td>");
		result.push(item.last_updated_by);
		result.push("</td>");
		result.push("<td><input type=button value=delete onclick='delete_plan_click(\"" + item._id + "\")' /> | <input type=button value=edit onclick='edit_plan_click(\"" + item._id + "\")' /></td>");
		result.push("</tr>");		
		
	}


	result.push("</table>");
	result.push("<br/>");
	
	return result;

}


function add_new_plan_click()
{
	

	var new_name = document.getElementById('add_new_plan_name').value;
	var new_description = document.getElementById('add_new_plan_description').value;

	if(new_name && new_description)
	{
		var new_plan = get_migation_plan_default();

		new_plan.name = new_name;
		new_plan.description = new_description;
		new_plan.created_by = $mmria.getCookie("uid");
		new_plan.last_updated_by = $mmria.getCookie("uid");

		g_migration_plan_list.push(new_plan);
		server_save(new_plan);
	}
	
}

function server_save(p_migration_plan)
{
	$.ajax({
				url: location.protocol + '//' + location.host + '/api/migration_plan',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(p_migration_plan),
				type: "POST"/*,
				beforeSend: function (request)
				{
					request.setRequestHeader ("Authorization", "Basic " + btoa($mmria.getCookie("uid")  + ":" + $mmria.getCookie("pwd")));
					request.setRequestHeader("AuthSession", $mmria.getCookie("AuthSession"));
				},*/
		}).done(function(response) 
		{

			var response_obj = eval(response);
			if(response_obj.ok)
			{
				for(var i = 0; i < g_migration_plan_list.length; i++)
				{
					if(g_migration_plan_list[i]._id == response_obj.id)
					{
						g_migration_plan_list[i]._rev = response_obj.rev; 
						break;
					}
				}			

				document.getElementById('output').innerHTML = render_edit_migration_plan(p_migration_plan).join("");
			}
		});

}


function delete_plan_click(p_id)
{
 console.log("delete_plan_click");
}

function edit_plan_click(p_id)
{
	var selected_plan = null;

	for(var i = 0; i < g_migration_plan_list.length; i++)
	{
		if(g_migration_plan_list[i]._id == p_id)
		{
			selected_plan = g_migration_plan_list[i]; 
			break;
		}
	}	

	if(selected_plan)
	{
		document.getElementById('output').innerHTML = render_edit_migration_plan(selected_plan).join("");

	}
	
}



function render_edit_migration_plan(p_migration_plan)
{

	var result = [];

	result.push("<a href=/migrationplan>back to migration plan list</a><br/>");
	result.push("<table>");
	result.push("<tr bgcolor=#CCCCCC><th colspan=2>selected migration plan</th><ttr>");
	result.push("<tr><td><b>name:</b></td>");
	result.push("<td><input type='text' value='");
	result.push(p_migration_plan.name);
	result.push("'/></td>");
	result.push("</tr>");
	result.push("<tr><td valign=top><b>description:</b></td>");
	result.push("<td><textarea cols=35 rows=7>");
	result.push(p_migration_plan.description);
	result.push("</textarea></td>");
	result.push("</tr>");
	result.push("<tr><td><b>created by:</b></td><td>");
	result.push(p_migration_plan.created_by);
	result.push("</td>");
	result.push("<tr><td><b>date created:</b></td><td>");
	result.push(p_migration_plan.date_created);
	result.push("</td>");
	result.push("<tr><td><b>last updated by:</b></td><td>");
	result.push(p_migration_plan.date_last_updated);
	result.push("</td>");
	result.push("<tr><td><b>created by:</b></td><td>");
	result.push(p_migration_plan.last_updated_by);
	result.push("</td>");
	result.push("</tr>");		
	
	
/*
	result.push("<tr>");
	result.push("<td colspan=2>name: <input id='add_new_plan_name' type='text' value='' /></td>")
	result.push("<td colspan=2>description: <input id='add_new_plan_description' type='text' value='' /></td>")
	result.push("<td colspan=2><input type='button' value='add new plan' onclick='add_new_plan_click()' /></td>")
	result.push("</tr>");
*/
	result.push("</table>");


	Array.prototype.push.apply(result, render_migration_plan_item_list(p_migration_plan))

	result.push("<br/><input type=button value='== save migration plan ==' onclick='save_migration_plan_item_click(\"" + p_migration_plan._id + "\")' /><br/>");

	result.push("<br/><a href=/migrationplan>back to migration plan list</a><br/>");
	return result;

}


function render_migration_plan_item_list(p_migration_plan)
{

	var result = [];

	result.push("<table>");
	result.push("<tr><th colspan=6 bgcolor=silver>migration plan item list</th></tr>");
	result.push("<tr>");
	result.push("<th>old_mmria_path</th>");
	result.push("<th>new_mmria_path</th>");
	result.push("<th>old_value</th>");
	result.push("<th>new_value</th>");
	result.push("<th>comment</th>");
	result.push("<th>&nbsp;</th>");
	result.push("</tr>");
	for(var i in p_migration_plan.plan_items)
	{
		var item = p_migration_plan.plan_items[i];

		if(i % 2)
		{
			result.push("<tr bgcolor='#CCCCCC'>");
		}
		else
		{
			result.push("<tr>");
		}

		create_input_box_td(result, item.old_mmria_path);
		create_input_box_td(result, item.new_mmria_path);
		create_input_box_td(result, item.old_value);
		create_input_box_td(result, item.new_value);
		create_input_box_td(result, item.comment);
		
		result.push("<td><input type=button value=delete onclick='delete_plan_item_click(" + i + ")' /></td>");
		result.push("</tr>");		
		
	}


	result.push("<tr bgcolor='#DDDDDD'>");
	create_input_box_td(result, "");
	create_input_box_td(result, "");
	create_input_box_td(result, "");
	create_input_box_td(result, "");
	create_input_box_td(result, "");
	
	result.push("<td><input type=button value='add new item' onclick='add_new_plan_item_click(\"" + p_migration_plan._id + "\")' /></td>");
	result.push("</tr>");

/*
	result.push("<tr>");
	result.push("<td colspan=2>name: <input id='add_new_plan_name' type='text' value='' /></td>")
	result.push("<td colspan=2>description: <input id='add_new_plan_description' type='text' value='' /></td>")
	result.push("<td colspan=2><input type='button' value='add new plan' onclick='add_new_plan_click()' /></td>")
	result.push("</tr>");
*/
	result.push("</table>");

	return result;

}

function create_input_box_td(p_result, p_item_text)
{
	p_result.push("<td><input alt='");
	p_result.push(p_item_text);
	p_result.push("' type='text' value='");
	p_result.push(p_item_text);
	p_result.push("'/></td>");
}


function delete_plan_item_click(p_item_index)
{

}


function add_new_plan_item_click()
{

}

function save_migration_plan_item_click(p_id)
{
	var selected_plan = null;

	for(var i = 0; i < g_migration_plan_list.length; i++)
	{
		if(g_migration_plan_list[i]._id == p_id)
		{
			selected_plan = g_migration_plan_list[i]; 
			break;
		}
	}	

	if(selected_plan)
	{
		server_save(selected_plan)
	}
}

function add_new_user_click()
{
	var new_user_name = document.getElementById('new_user_name').value;
	//var new_user_password = document.getElementById('new_user_password').value;
	var user_id = null;
	if(
		is_valid_user_name(new_user_name) //&& 
		//is_valid_password(new_user_password)
	)
	{

		var new_user = $$.add_new_user(new_user_name, "password");
		user_id = new_user._id;
		g_ui.user_summary_list.push(new_user);

		$.ajax({
			url: location.protocol + '//' + location.host + '/api/user',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(new_user),
			type: "POST"
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

				if(response_obj.auth_session)
				{
					//profile.auth_session = response_obj.auth_session;
					$mmria.addCookie("AuthSession", response_obj.auth_session);
				}

				document.getElementById('form_content_id').innerHTML = user_render(g_ui, "", g_ui).join("");
				create_status_message("new user has been added.", "new_user");

			}
			//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
			
		});

		//console.log("greatness awaits.");
	}
	else
	{
		create_status_warning("invalid user name.", "new_user");
		console.log("got nothing.");
	}
}


function change_password_user_click(p_user_id)
{
	
	var new_user_password = document.querySelector('[role="confirm_1"][path="' + p_user_id + '"]').value;
	var new_confirm_password = document.querySelector('[role="confirm_2"][path="' + p_user_id + '"]').value;

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


	if(
		is_valid_password(new_user_password) && 
		is_valid_password(new_confirm_password) &&
		new_user_password == new_confirm_password
	)
	{



		if(user)
		{
			user.password = new_user_password;

			//var current_auth_session = profile.get_auth_session_cookie();

			//if(current_auth_session)
			//{ 
				$.ajax({
					url: location.protocol + '//' + location.host + '/api/user',
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					data: JSON.stringify(user),
					type: "POST"/*,
					beforeSend: function (request)
					{
						request.setRequestHeader("AuthSession", current_auth_session);
					}*/
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

						if(response_obj.auth_session)
						{
							//profile.auth_session = response_obj.auth_session;
							$mmria.addCookie("AuthSession", response_obj.auth_session);
						}

						document.getElementById('form_content_id').innerHTML = user_render(g_ui, "", g_ui).join("");
						create_status_message("user information saved", convert_to_jquery_id(user._id));
						console.log("password saved sent", response);


					}
					//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
					
				});
			//}
		}
		else
		{
			document.getElementById('form_content_id').innerHTML = user_render(g_ui, "", g_ui).join("");
			//console.log("greatness awaits.");
		}
	}
	else
	{
		create_status_warning("invalid password and confirm", convert_to_jquery_id(user._id));
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
		p_value.length >= 8
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

						if(response_obj.auth_session)
						{
							//profile.auth_session = response_obj.auth_session;
							$mmria.addCookie("AuthSession", response_obj.auth_session);
						}

						document.getElementById('form_content_id').innerHTML = user_render(g_ui, "", g_ui).join("");
						create_status_message("user information saved", convert_to_jquery_id(user._id));
						console.log("password saved sent", response);


					}
					//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
					
				});
			}
	}
}

function add_role(p_user_id, p_created_by)
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

		var temp_user_role = user_role_jurisdiction_add
		(
			"",
			user.name,
			"",
			new Date(),
			new Date(new Date().getTime() + 90*24*60*60*1000),
			true,
			p_created_by
		);

		g_user_role_jurisdiction.push(temp_user_role);

		var role_list_for_ = document.getElementById("role_list_for_" + user.name);


		var opt = document.createElement('option');
		var option_text = [];
		option_text.push(temp_user_role.user_id);
		option_text.push(" ");
		option_text.push(temp_user_role.role_name);
		option_text.push(" ");
		option_text.push(temp_user_role.jurisdiction_id);
		option_text.push(" ");

		if(temp_user_role.effective_start_date instanceof Date)
		{
			option_text.push(temp_user_role.effective_start_date.toISOString());
		}
		else
		{
			option_text.push(temp_user_role.effective_start_date);
		}
		
		option_text.push(" ");
		if(temp_user_role.effective_end_date instanceof Date)
		{
			option_text.push(temp_user_role.effective_end_date.toISOString());
		}
		else
		{
			option_text.push(temp_user_role.effective_end_date);
		}		
		option_text.push(" ");
		option_text.push(temp_user_role.is_active);

		opt.value = temp_user_role._id;
		opt.innerHTML = option_text.join("");

		role_list_for_.appendChild(opt);

	
		var render_result = user_role_edit_render(user, temp_user_role, p_created_by);
		var selected_user_role_for_ = document.getElementById("selected_user_role_for_" + user.name);
		selected_user_role_for_.outerHTML = render_result.join("");

	}

}


function update_role(p_user_role_jurisdiction_id, p_user_id)
{
	var user_role_index = -1;
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		if(g_user_role_jurisdiction[i]._id == p_user_role_jurisdiction_id)
		{
			user_role_index = i;
			break;
		}
	}



	if(user_role_index > -1)
	{
		var user_index = -1;
		var user_list = g_ui.user_summary_list;
		for(var i = 0; i < user_list.length; i++)
		{
			if(user_list[i].name ==  g_user_role_jurisdiction[user_role_index].user_id)
			{
				user_index = i;
				break;
			}
		}

		if(user_index > -1)
		{

		
			var user_role = g_user_role_jurisdiction[user_role_index];
			var user = user_list[user_index];

			var selected_user_role_for_ = null;
			var role = document.getElementById("selected_user_role_for_" + user_role.user_id + "_role");
			var jurisdiction = document.getElementById("selected_user_role_for_" + user_role.user_id+ "_jurisdiction");
			var effective_start_date = document.getElementById("selected_user_role_for_" + user_role.user_id + "_effective_start_date");
			var effective_end_date = document.getElementById("selected_user_role_for_" + user_role.user_id + "_effective_end_date");
			var is_active = document.getElementById("selected_user_role_for_" + user_role.user_id + "_is_active");

			user_role.role_name = role.value;
			user_role.jurisdiction_id = jurisdiction.value;
			user_role.effective_start_date = new Date(effective_start_date.value);
			user_role.effective_end_date = new Date(effective_end_date.value);
			user_role.is_active = (is_active.value == "true")? true: false;
			user_role.last_updated_by = p_user_id;

			if(user_role.jurisdiction_id && user_role.role_name)
			{
				save_user_role_jurisdiction(user_role, user, p_user_id);
			}
			else
			{
				create_status_warning("invalid jusidiction or role name", convert_to_jquery_id(user._id));
			}

		}
	}
}




function remove_role(p_user_role_id)
{
	var user_role_index = -1;
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		if(g_user_role_jurisdiction[i]._id == p_user_role_id)
		{
			user_role_index = i;
			break;
		}
	}

	if(user_role_index > -1)
	{
		var user_role = g_user_role_jurisdiction[user_role_index];
		

		if(user_role._rev)
		{ 
			$.ajax({
				url: location.protocol + '//' + location.host + '/api/user_role_jurisdiction?_id=' + user_role._id + '&rev=' + user_role._rev,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				//data: JSON.stringify(p_data),
				type: "DELETE",
				beforeSend: function (request)
				{
					request.setRequestHeader("AuthSession", profile.get_auth_session_cookie()
				);
				}
			}).done(function(response) 
			{
				if(response.ok)
				{

					g_user_role_jurisdiction.splice(user_role_index, 1);

					for(var i = 0; i < g_ui.user_summary_list.length; i++)
					{
						if(g_ui.user_summary_list[i].name == user_role.user_id)
						{
							var escaped_id =  convert_to_jquery_id(g_ui.user_summary_list[i]._id);
							$( "#" + escaped_id).replaceWith( user_entry_render(g_ui.user_summary_list[i], "", g_ui).join("") );
							break;
						}
					}
					
				}
			});
		}
		else
		{
				
			g_user_role_jurisdiction.splice(user_role_index, 1);

			for(var i = 0; i < g_ui.user_summary_list.length; i++)
			{
				if(g_ui.user_summary_list[i].name == user_role.user_id)
				{
					var escaped_id =  convert_to_jquery_id(g_ui.user_summary_list[i]._id);
					$( "#" + escaped_id).replaceWith( user_entry_render(g_ui.user_summary_list[i], "", g_ui).join("") );
					break;
				}
			}

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
			create_status_message("user information saved", convert_to_jquery_id(user._id));
		}
	}
}


function convert_to_jquery_id(p_value)
{
	return p_value.replace('@', 'ATT').replace(':','COL').replace(/\./g,'DOT');
}


function create_status_message(p_message, p_div_id)
{
	var result = [];

	result.push('<div class="alert alert-success alert-dismissible">');
	result.push('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
	result.push('<strong>Info!</strong> ');
	result.push(p_message);
	result.push('</div>');

	document.getElementById(p_div_id + "_status_area").innerHTML = result.join("");

	window.setTimeout(clear_status, 30000);
}

function create_status_warning(p_message, p_div_id)
{
	var result = [];

	result.push('<div class="alert alert-danger">');
	result.push('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
	result.push('<strong>Warning!</strong> ');
	result.push(p_message);
	result.push('</div>');

	document.getElementById(p_div_id + "_status_area").innerHTML = result.join("");

	window.setTimeout(clear_status, 30000);
}

function clear_status()
{
	document.getElementById("status_area").innerHTML = "<div>&nbsp;</div>";
}


function jurisdiction_add_child_click(p_parent_id, p_name, p_user_id)
{
	var parent = get_jurisdiction(p_parent_id, g_jurisdiction_tree);
	var new_child  = null;

	if(parent)
	{
		if(parent.name == "/")
		{
			new_child  = jurisdiction_add(p_parent_id, "/" + p_name, p_user_id);
		}
		else
		{
			new_child  = jurisdiction_add(p_parent_id, parent.name + "/" + p_name, p_user_id);
		}
		
	}
	else
	{
		new_child  = jurisdiction_add(p_parent_id, p_name, p_user_id);
	}
	
	
	if
	(
		p_name != null && 
		p_name != "" && 
		p_name.match(/\W/) == null && 
		get_jurisdiction(new_child.id, g_jurisdiction_tree) == null
	)
	{
		var node_to_add_to = get_jurisdiction(p_parent_id, g_jurisdiction_tree);
		if(node_to_add_to)
		{
			node_to_add_to.children.push(new_child);
			g_jurisdiction_tree.date_last_updated = new Date();
			g_jurisdiction_tree.last_updated_by = p_user_id;
			var x = jurisdiction_render(node_to_add_to);

			var y=document.getElementById(p_parent_id.replace("/","_"));

			y.outerHTML = x.join("");
			
		}

	}
	
}

function jurisdiction_remove_child_click(p_parent_id, p_node_id, p_user_id)
{

	if(p_node_id != "jurisdiction_tree")
	{
		remove_jurisdiction(p_node_id, g_jurisdiction_tree)
		g_jurisdiction_tree.date_last_updated = new Date();
		g_jurisdiction_tree.last_updated_by = p_user_id;
		var node_to_add_to = get_jurisdiction(p_parent_id, g_jurisdiction_tree);
		if(node_to_add_to)
		{
			var x = jurisdiction_render(node_to_add_to);

			var y=document.getElementById(p_parent_id.replace("/","_"));

			y.outerHTML = x.join("");
			
		}

	}
	
}

function get_jurisdiction(p_search_id, p_node)
{
	var result = null;

	if(p_node._id && p_node._id == p_search_id)
	{
		return p_node;
	}

	if(p_node.id && p_node.id == p_search_id)
	{
		return p_node;
	}

	if(p_node.children != null)
	{
		for(var i = 0; i < p_node.children.length; i++)
		{
			var child = p_node.children[i];
			result = get_jurisdiction(p_search_id, child);
			if(result != null)
			{
				return result;
			}
		}
	}

	return result;
}


function remove_jurisdiction(p_search_id, p_node)
{
	if(p_node._id && p_node._id == p_search_id)
	{
		return;
	}

	if(p_node.children != null)
	{
		for(var i = 0; i < p_node.children.length; i++)
		{
			var child = p_node.children[i];
			if(p_node.children[i].id == p_search_id)
			{
				p_node.children.splice(i, 1);
				return;
			}
			else
			{
				remove_jurisdiction(p_search_id, child)
			}
		}
	}

	return;
}


function jurisdiction_add(p_parent_id, p_name, p_user_id)
{
	var result = {
		id: p_parent_id + "/" + p_name,
		name: p_name,
		date_created: new Date(),
		created_by: p_user_id,
		date_last_updated: new Date(),
		last_updated_by: p_user_id,
		is_active: true,
		is_enabled: true,
		children:[],
		parent_id: p_parent_id
	}

	return result;
}

function jurisdiction_update()
{
	
}


function jurisdiction_delete()
{
	
}


function user_role_jurisdiction_add
(
	p_role_name,
	p_user_id,
	p_jurisdiction_id,
	p_effective_start_date,
	p_effective_end_date,
	p_is_active,
	p_created_by
)
{
	var result = {
		_id: $mmria.get_new_guid(),
		role_name : p_role_name,
		user_id: p_user_id,
		jurisdiction_id: p_jurisdiction_id,

		effective_start_date: p_effective_start_date,
		effective_end_date: p_effective_end_date,
		is_active: p_is_active,
		date_created: new Date(),
		created_by: p_created_by,
		date_last_updated: new Date(),
		last_updated_by: p_created_by,
		data_type:"user_role_jursidiction"
	}

	return result;
}