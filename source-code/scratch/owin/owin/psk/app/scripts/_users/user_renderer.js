//http://stackoverflow.com/questions/5558873/changing-user-name-and-password-in-couchdb-user-database

function user_render(p_ui, p_data, p_metadata_path, p_object_path, p_is_grid_context)
{
	var result = [];

	result.push("<div style='clear:both;margin-left:10px;'>(ctrl + 's' to save changes)");
	result.push("<table border=1><tr style='background:#BBBBBB;'><th colspan=4>user list</th></tr>");
	
	for(var i = 0; i < p_ui.user_summary_list.length; i++)
	{
		var item = p_ui.user_summary_list[i];
		Array.prototype.push.apply(result, user_entry_render(item, i));
		result.push("<tr><td colspan=4 align=center><input type='button' value='save changes'/></tr>")
	}
	result.push("<tr><td colspan=4 align=right>&nbsp;</tr>")
	result.push("<tr><td colspan=4 align=right>user name:<input type='text' id='new_user_name' value=''/>password:<input type='text' id='new_user_password' value=''/><input type='button' value='add new user' onclick='add_new_user_click()' /></tr>")
	result.push("</table></div><br/><br/>");


	return result;

}


function user_entry_render(p_user, p_i)
{
	var result = [];

	if(p_i % 2)
	{
		result.push("<tr style='background:#DDDDDD;'><td valign=top>");
	}
	else
	{
		result.push("<tr><td valign=top>");
	}

	result.push(p_user.name);
	result.push("</td><td>");
	result.push("<table>");
	result.push("<tr><th>role name</th><th>&nbsp;</th><tr>");
	for(var j = 0; j < p_user.roles.length; j++)
	{
		result.push("<tr><td>");
		result.push(p_user.roles[j]);
		result.push("</td><td><input type='button' value='remove role'/></td></tr>");
	}
	result.push("<tr><td colspan=2 align=right>");
	Array.prototype.push.apply(result, user_role_render(p_user));
	result.push("</td></tr>")
	result.push("</table></td>");
	result.push("<td>");
	result.push("<input type='text' value='");
	result.push(p_user.name);
	result.push("'/>");
	result.push("<input type='button' value='change user name'/>");	
	result.push("<br/><br/><input type='password' value=''/>");
	result.push("<input type='button' value='change password'/>");
	result.push("</td>");
	result.push("<td>")
	//result.push("<input type='button' value='disable user'/>");
	result.push("<br/><br/><input type='button' value='remove user'/>");
	result.push("</td>")
	result.push("<tr>");

	return result;
}

function user_role_render(p_user)
{
	var result = [];
	var role_set = [ '', 'abstractor','committe_reviewer','form_designer', 'user_admin'];

	result.push("<select size='1'>")
	for(var i = 0; i < role_set.length; i++)
	{
		var item = role_set[i];
		if(p_user.roles.indexOf(item) > -1)
		{
			// do nothing
			/*
			result.push("<option selected='true'>");
			result.push(item);
			result.push("</option>");
			*/
		}
		else
		{
			result.push("<option>");
			result.push(item);
			result.push("</option>");
		}
	}
	result.push("</select>");
	result.push("<input type='button' value='add role'/>");
	return result;
}
