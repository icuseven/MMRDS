//http://stackoverflow.com/questions/5558873/changing-user-name-and-password-in-couchdb-user-database

function user_render(p_ui, p_created_by)
{
	var result = [];

	result.push("<div style='clear:both;margin-left:10px;'>");
	result.push("<table border=1><tr style='background:#BBBBBB;'><th colspan=5>User List</th></tr>");
	
	for(var i = 0; i < p_ui.user_summary_list.length; i++)
	{
		var item = p_ui.user_summary_list[i];
		if(item._id != "org.couchdb.user:mmrds")
		{
			Array.prototype.push.apply(result, user_entry_render(item, i, p_created_by));
		}
	}
	result.push("<tr><td colspan=4 align=right>&nbsp;</tr>")
	result.push("<tr><td colspan=4 align=right>enter new user name:<input type='text' id='new_user_name' value=''/> <input type='button' value='add new user' onclick='add_new_user_click()' /><span id='new_user_status_area'></span></tr>")
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
	result.push("<select size='7'>");
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
	result.push("</td>");	


	// Role edit -start 
	var temp_user_role = user_role_jurisdiction_add
(
	"",
	p_user.name,
	"",
	new Date(),
	new Date(),
	true,
	p_created_by
);


	result.push("<td>");	
	result.push("<table>");
	result.push("<tr><th>Name</th><th>Value</th><tr>");

	result.push("<tr><td>")
	result.push("user_id");
	result.push("</td><td>");
	result.push(temp_user_role.user_id);
	result.push("</td></tr>")
	result.push("<tr><td>")
	result.push("role_name");
	result.push("</td><td>")


	Array.prototype.push.apply(result, user_role_render(p_user, temp_user_role));
	//result.push(user_role.role_name);
	result.push("</td></tr>")
	result.push("<tr><td>")
	result.push("user_role.jurisdiction_id");
	result.push("</td><td>")
	Array.prototype.push.apply(result, user_role_jurisdiction_render(g_jurisdiction_tree, temp_user_role.jurisdiction_id, 0));
	//result.push(temp_user_role.jurisdiction_id);
	result.push("</td></tr>")
	result.push("<tr><td>")
	result.push("user_role.effective_start_date");
	result.push("</td><td><input type='text' value='")
	result.push(temp_user_role.effective_start_date);
	result.push("'/> </td></tr>")
	result.push("<tr><td>")
	result.push("user_role.effective_end_date");
	result.push("</td><td><input type='text' value='")
	result.push(temp_user_role.effective_end_date);
	result.push("'/> </td></tr>")
	result.push("<tr><td>")
	result.push("user_role.is_active");
	result.push("</td><td><input type='text' value='")
	result.push(temp_user_role.is_active);
	result.push("' /> </td></tr>")
	
	// Role edit - end
/*
	for(var j = 0; j < p_user.roles.length; j++)
	{
		result.push("<tr><td>");
		result.push(p_user.roles[j]);
		result.push("</td><td>&nbsp;</td></tr>");
	}
	result.push("<tr><td colspan=2 align=right>");
	*/
	//result.push("<tr><td colspan=2 align=right>");



	result.push("<tr><td>");
	result.push("<input type='button' value='Remove Role' onclick='remove_role(\"" + temp_user_role._id + "\")'/>");
	result.push("<input type='button' value='Add Role' onclick='add_role(\"" + temp_user_role._id + "\")' />");
	result.push("</td></tr>");
	result.push("</table></td>");






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
	//result.push("<input type='button' value='disable user'/>");
	result.push("<input type='button' value='Save User " + p_user.name + " changes' onclick='change_password_user_click(\"" + p_user._id + "\")'/>");
	
	result.push("<span id='");
	result.push(convert_to_jquery_id(p_user._id));
	result.push("_status_area'><span id=");
	result.push("</td>")
	result.push("</tr>");



	return result;
}

function user_role_render(p_user, p_user_role_jurisdiction)
{
	var result = [];
	var role_set = [ '', 'abstractor','committee_member','form_designer', 'jurisdiction_admin'];

	result.push("<select size='1' path='" + p_user._id + "'>")
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

/*
function user_role_render(p_user)
{
	var result = [];
	var role_set = [ '', 'abstractor','committee_member','form_designer'];

	result.push("<select size='1' path='" + p_user._id + "'>")
	for(var i = 0; i < role_set.length; i++)
	{
		var item = role_set[i];
		if(p_user.roles.indexOf(item) > -1)
		{
			// do nothing
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

*/

function user_role_jurisdiction_render(p_data, p_selected_id, p_level)
{
	var result = [];
	if( p_data._id)
	{

		result.push("<select size=1>")
		result.push("<option></option>")
		result.push("<option")

		if(p_data.name == p_selected_id)
		{
			result.push(" selected=true")
		}
		result.push(">")
		result.push(p_data.name);
		result.push("</option>")
		p_level = 0;
	}
	else
	{
		result.push("<option")
		if(p_data.name == p_selected_id)
		{
			result.push(" selected=true")
		}
		result.push(">")

		for(var i = 0; i < p_level; i++)
		{
			result.push("-");
		}
		result.push(p_data.name);
		result.push("</option>")
	
	}

	if(p_data.children != null)
	{
		for(var i = 0; i < p_data.children.length; i++)
		{
			var child = p_data.children[i];
			Array.prototype.push.apply(result, user_role_jurisdiction_render(child, p_selected_id, p_level + 1));
			
		}
	}
	result.push("</select>");
	

	return result;

}