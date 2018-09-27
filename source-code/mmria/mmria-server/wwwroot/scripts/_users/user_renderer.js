//http://stackoverflow.com/questions/5558873/changing-user-name-and-password-in-couchdb-user-database

function user_render(p_ui, p_created_by)
{
	var result = [];

	result.push("<div style='clear:both;margin-left:10px;'>");
	result.push("<table border=1><tr style='background:#BBBBBB;'><th colspan=6>User List</th></tr>");
	
	for(var i = 0; i < p_ui.user_summary_list.length; i++)
	{
		var item = p_ui.user_summary_list[i];
		if(item._id != "org.couchdb.user:mmrds")
		{
			Array.prototype.push.apply(result, user_entry_render(item, i, p_created_by));
		}
	}
	result.push("<tr><td colspan=6 align=right>&nbsp;</tr>");
	result.push("<tr><td colspan=6 align=right>");
	result.push("Enter new user name:<input type='text' id='new_user_name' value=''/><br/>");
	result.push("Password: <input type='text' id='new_user_password' value=''/><br/>");
	result.push("Verify password: <input type='password' id='new_user_verify' value=''/><br/>");
	result.push("<input type='button' value='add new user' onclick='add_new_user_click()' /><br/>");
	result.push("<span id='new_user_status_area'>");
	result.push("</span></tr>");
	result.push("</table></div><br/><br/>");


	return result;

}


function user_entry_render(p_user, p_i, p_created_by)
{
	var result = [];

	if(p_i % 2)
	{
		result.push("<tr id='" +  convert_to_jquery_id(p_user._id) + "' style='background:#DDDDDD;' valign=top><td>");
	}
	else
	{
		result.push("<tr id='" +  convert_to_jquery_id(p_user._id) + "' valign=top><td>");
	}

	result.push(p_user.name);
	if(p_user._rev)
	{
		result.push("<br/><input type='button' value='remove user' onclick='remove_user_click(\"" + p_user._id + "\", \"" + p_user._rev + "\")'/>");
		result.push("<br/><span id='");
		result.push(convert_to_jquery_id(p_user._id));
		result.push("_status_area'></span>");
	}
	
	result.push("</td><td>");

	result.push("<td>");
	result.push("<strong>");
	result.push(p_user.name);
	result.push("</strong><br/>");
	result.push("New Password <input type='password' value='' role='confirm_1' path='" + p_user._id + "' />");
	result.push("<br/>Verify Password<input type='password' value='' role='confirm_2' path='" + p_user._id + "' />");
	result.push("<br/><input type='button' value='Update password' onclick='change_password_user_click(\"" + p_user._id + "\")'/>");

	


	result.push("</td>");


	result.push("<td>");
	result.push("<select size='7' id='role_list_for_");
	result.push(p_user.name);
	result.push("' onchange='user_role_list_change(this, \"");
	result.push(p_user._id);
	result.push("\", \"");
	result.push(p_created_by);
	result.push("\")'");
	result.push("'>");
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		var user_role = g_user_role_jurisdiction[i];
		if(user_role.user_id == p_user.name)
		{
			result.push("<option");

			result.push(" value='");
			result.push(user_role._id);
			result.push("'>");
			result.push(user_role.user_id);
			result.push(" ");
			result.push(user_role.role_name);
			result.push(" ");
			result.push(user_role.jurisdiction_id);
			result.push(" ");
			result.push(user_role.effective_start_date);
			result.push(" ");
			result.push(user_role.effective_end_date);
			result.push(" ");
			result.push(user_role.is_active);

			result.push("</option>");
		}
	}
	result.push("</select>");
	result.push("<br/><input type='button' value='Add New Role' onclick='add_role(\"" + p_user._id + "\", \"" + p_created_by + "\")' />");
	result.push("</td>");	


	// Role edit -start 
	var temp_user_role = user_role_jurisdiction_add
(
	"",
	p_user.name,
	"",
	new Date(),
	new Date(new Date().getTime() + 90*24*60*60*1000),
	true,
	p_created_by
);


	//g_user_role_jurisdiction.push(temp_user_role);

	Array.prototype.push.apply(result, user_role_edit_render(null, temp_user_role, p_created_by));





	/*

user_role_jurisdiction
{
	_id { get; set; }
	_rev { get; set; }
	parent_id { get; set; }
	role_name { get; set; }
	user_id { get; set; }
	jurisdiction_id { get; set; }

	effective_start_date { get; set; } 
	effective_end_date { get; set; } 

	is_active { get; set; } 
	date_created { get; set; } 
	created_by { get; set; } 
	date_last_updated { get; set; } 
	last_updated_by { get; set; } 

	data_type : "user_role_jursidiction";
	
}
	*/	


	result.push("<td>&nbsp;")
	//result.push("<input type='button' value='Save User " + p_user.name + " changes' onclick='change_password_user_click(\"" + p_user._id + "\")'/>");

	result.push("</td>")
	result.push("</tr>");



	return result;
}


function render_role_list_for(p_user, p_created_by)
{
	var result = [];

	result.push("<select size='7' id='role_list_for_");
	result.push(p_user.name);
	result.push("' onchange='user_role_list_change(this, \"");
	result.push(p_user._id);
	result.push("\", \"");
	result.push(p_created_by);
	result.push("\")'");
	result.push("'>");
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		var user_role = g_user_role_jurisdiction[i];
		if(user_role.user_id == p_user.name)
		{
			result.push("<option");

			result.push(" value='");
			result.push(user_role._id);
			result.push("'>");
			result.push(user_role.user_id);
			result.push(" ");
			result.push(user_role.role_name);
			result.push(" ");
			result.push(user_role.jurisdiction_id);
			result.push(" ");

			if(user_role.effective_start_date instanceof Date)
			{
				result.push(user_role.effective_start_date.toISOString());
			}
			else
			{
				result.push(user_role.effective_start_date);
			}


			result.push(" ");
			
			if(user_role.effective_end_date instanceof Date)
			{
				result.push(user_role.effective_end_date.toISOString());
			}
			else
			{
				result.push(user_role.effective_end_date);
			}			
			result.push(" ");
			result.push(user_role.is_active);

			result.push("</option>");
		}
	}
	result.push("</select>");

	return result;
}


function user_role_list_change(p_select_list, p_user_id, p_updated_by)
{
	if(p_select_list.selectedIndex > -1)
	{
		var selected_id = p_select_list.value;

		var user_role_jurisdiction = null;
		var user = null;

		for(var i in g_ui.user_summary_list)
		{
			if(g_ui.user_summary_list[i]._id == p_user_id)
			{
				user = g_ui.user_summary_list[i];
				break;
			}
		}


		for(var i in g_user_role_jurisdiction)
		{
			if(g_user_role_jurisdiction[i]._id == selected_id)
			{
				user_role_jurisdiction = g_user_role_jurisdiction[i];
				break;
			}
		}

		if(user && user_role_jurisdiction)
		{
			var render_result = user_role_edit_render(user, user_role_jurisdiction, p_updated_by);
			var selected_user_role_for_ = document.getElementById("selected_user_role_for_" + user.name);

			selected_user_role_for_.outerHTML = render_result.join("");
		}
		
	}
	
}

function user_role_render(p_user, p_user_role_jurisdiction)
{
	var result = [];
	var role_set = [ '', 'abstractor','committee_member','form_designer', 'jurisdiction_admin'];

	result.push("<select id='selected_user_role_for_" + p_user.name + "_role' size='1' path='" + p_user._id + "'>")
	for(var i = 0; i < role_set.length; i++)
	{
		var item = role_set[i];
		if(p_user_role_jurisdiction.role_name == item)
		{
			result.push("<option selected='true'>");
			result.push(item);
			result.push("</option>");

		}
		else
		{
			result.push("<option>");
			result.push(item);
			result.push("</option>");
		}
	}
	result.push("</select>");

	return result;
}


function user_role_jurisdiction_render(p_data, p_selected_id, p_level, p_user_name)
{
	var result = [];
	if( p_data._id)
	{

		result.push("<select id='selected_user_role_for_" + p_user_name + "_jurisdiction' size=1")
		result.push("><option></option>")
		p_level = 0;
	}

	result.push("<option")
	if(p_data.name == p_selected_id)
	{
		result.push(" selected=true")
	}
	result.push(">")
	result.push(p_data.name);
	result.push("</option>")
	


	if(p_data.children != null)
	{
		for(var i = 0; i < p_data.children.length; i++)
		{
			var child = p_data.children[i];
			Array.prototype.push.apply(result, user_role_jurisdiction_render(child, p_selected_id, p_level + 1, p_user_name));
			
		}
	}

	if( p_data._id)
	{
		result.push("</select>");
	}

	return result;

}

function user_role_edit_render(p_user, p_user_role_jurisdiction, p_updated_by)
{
	var result = [];

	if(p_user==null)
	{
		result.push("<td width=386px id='selected_user_role_for_");
		result.push(p_user_role_jurisdiction.user_id);
		result.push("'>&nbsp;</td>");

		return result;
	}

	result.push("<td id='selected_user_role_for_");
	result.push(p_user_role_jurisdiction.user_id);
	result.push("'><table>");
	result.push("<tr><th>Name</th><th>Value</th><tr>");

	result.push("<tr><td>")
	result.push("user_id");
	result.push("</td><td>");
	result.push(p_user_role_jurisdiction.user_id);
	result.push("</td></tr>")
	result.push("<tr><td>")
	result.push("role_name");
	result.push("</td><td>")


	Array.prototype.push.apply(result, user_role_render(p_user, p_user_role_jurisdiction));

	result.push("</td></tr>")
	result.push("<tr><td>")
	result.push("jurisdiction_id");
	result.push("</td><td>")
	Array.prototype.push.apply(result, user_role_jurisdiction_render(g_jurisdiction_tree, p_user_role_jurisdiction.jurisdiction_id, 0, p_user.name));

	result.push("</td></tr>")
	result.push("<tr><td>")
	result.push("effective_start_date");
	result.push("</td><td><input id='selected_user_role_for_" + p_user.name + "_effective_start_date' type='text' size=25 value='")
	if(p_user_role_jurisdiction.effective_start_date instanceof Date)
	{
		result.push(p_user_role_jurisdiction.effective_start_date.toISOString());
	}
	else
	{
		//result.push(new Date(p_user_role_jurisdiction.effective_start_date).toISOString());
		result.push(p_user_role_jurisdiction.effective_start_date);
	}
	result.push("'/> </td></tr>")
	result.push("<tr><td>")
	result.push("effective_end_date");
	result.push("</td><td><input id='selected_user_role_for_" + p_user.name + "_effective_end_date' type='text' size=25 value='")
	if(p_user_role_jurisdiction.effective_end_date instanceof Date)
	{
		result.push(p_user_role_jurisdiction.effective_end_date.toISOString());
	}
	else
	{
		result.push(p_user_role_jurisdiction.effective_end_date);
	}
	
	result.push("'/> </td></tr>")
	result.push("<tr><td>")
	result.push("is_active");
	result.push("</td><td><input id='selected_user_role_for_" + p_user.name + "_is_active' type='text' value='")
	result.push(p_user_role_jurisdiction.is_active);
	result.push("' /> </td></tr>")

	result.push("<tr><td>");
	result.push("<input type='button' value='Remove Role' onclick='remove_role(\"" + p_user_role_jurisdiction._id + "\")'/>");
	result.push("<input type='button' value='Update Role' onclick='update_role(\"" + p_user_role_jurisdiction._id + "\",\"" + p_updated_by + "\")' />");
	result.push("</td></tr>");
	result.push("</table></td>");

	// Role edit - end

	return result;
}


function remove_user_click(p_user_id, p_rev)
{
	var retVal = prompt("Confirm removal by entering the user name to delete: ", "user name here");
	if(p_user_id && p_rev && retVal && retVal == p_user_id.replace("org.couchdb.user:",""))
	{ 
		$.ajax({
			url: location.protocol + '//' + location.host + '/api/user?user_id=' + p_user_id + '&rev=' + p_rev,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			type: "DELETE"
		}).done(function(response) 
		{
			if(response.ok)
			{
				for(var i in g_ui.user_summary_list)
				{
					if(g_ui.user_summary_list[i]._id == response.id)
					{
						g_ui.user_summary_list.splice(i,1)

						document.getElementById('form_content_id').innerHTML = user_render(g_ui, $mmria.getCookie("uid")).join("")
						+ "<p>tree</p><ul>" + jurisdiction_render(g_jurisdiction_tree).join("") + "</ul>";
						;

						break;
					}
				}
			}
		});
	}
}