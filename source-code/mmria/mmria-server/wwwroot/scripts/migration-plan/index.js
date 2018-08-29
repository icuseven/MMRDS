
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



function server_delete(p_migration_plan)
{
	$.ajax({
				url: location.protocol + '//' + location.host + '/api/migration_plan?migration_plan_id=' + p_migration_plan._id + '&rev=' + p_migration_plan._rev,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				//data: JSON.stringify(p_migration_plan),
				type: "DELETE"/*,
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
						g_migration_plan_list.splice(i, 1);; 
						break;
					}
				}			

				document.getElementById('output').innerHTML = render_migration_plan().join("");
			}
		});

}



function delete_plan_click(p_id)
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

		var answer = prompt ("Are you sure you want to delete plan: " + selected_plan.name, "Enter yes to confirm");
		if(answer == "yes")
		{
			server_delete(selected_plan);
		}
		

	}
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
	result.push("' onblur='update_plan_name_click(\"" + p_migration_plan._id + "\", this.value)'/></td>");
	result.push("</tr>");
	result.push("<tr><td valign=top><b>description:</b></td>");
	result.push("<td><textarea cols=35 rows=7 onblur='update_plan_description_click(\"" + p_migration_plan._id + "\", this.value)'>");
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
			result.push("<tr valign=top bgcolor='#CCCCCC'>");
		}
		else
		{
			result.push("<tr valign=top>");
		}

		create_input_box_td(result, item.old_mmria_path, "oldmmriapath_" + i);
		create_input_box_td(result, item.new_mmria_path, "newmmriapath_" + i);
		create_input_box_td(result, item.old_value, "oldvalue_" + i);
		create_input_box_td(result, item.new_value, "newvalue_" + i);
		create_textarea_td(result, item.comment, "comment_" + i);
		
		result.push("<td><input type=button value=delete onclick='delete_plan_item_click(\"" + p_migration_plan._id + "\"," + i + ")' /> | <input type=button value=update onclick='update_plan_item_click(\"" + p_migration_plan._id + "\"," + i + ")' /></td>");
		result.push("</tr>");		
		
	}


	result.push("<tr valign=top bgcolor='#DDDDDD'>");
	create_input_box_td(result, "", "new_old_mmria_path");
	create_input_box_td(result, "", "new_new_mmria_path");
	create_input_box_td(result, "", "new_old_value");
	create_input_box_td(result, "", "new_new_value");
	create_textarea_td(result, "", "new_comment");
	
	result.push("<td><input type=button value='add new item' onclick='add_new_plan_item_click(\"" + p_migration_plan._id + "\")' /></td>");
	result.push("</tr>");

	result.push("</table>");

	return result;

}

function create_input_box_td(p_result, p_item_text, p_id)
{
	p_result.push("<td><input alt='");
	p_result.push(p_item_text);
	p_result.push("' type='text' value='");
	p_result.push(p_item_text);

	if(p_id)
	{
		p_result.push("' id='");
		p_result.push(p_id);
	}
	
	p_result.push("'/></td>");
		
}


function create_textarea_td(p_result, p_item_text, p_id)
{
	p_result.push("<td><textarea cols=35 rows=3 alt='");
	p_result.push(p_item_text);
	if(p_id)
	{
		p_result.push("' id='");
		p_result.push(p_id);
	}
	p_result.push("'>");
	p_result.push(p_item_text);
	p_result.push("</textarea></td>");
		
}


function delete_plan_item_click(p_id, p_item_index)
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
		selected_plan.plan_items.splice(p_item_index, 1);

		document.getElementById('output').innerHTML = render_edit_migration_plan(selected_plan).join("");

	}
}


function add_new_plan_item_click(p_id)
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
		var new_old_mmria_path = document.getElementById("new_old_mmria_path").value;
		var new_new_mmria_path = document.getElementById("new_new_mmria_path").value;
		var new_old_value = document.getElementById("new_old_value").value;
		var new_new_value = document.getElementById("new_new_value").value;
		var new_comment = document.getElementById("new_comment").value;

		var plan_item = get_migation_plan_item_default();

		plan_item.old_mmria_path = new_old_mmria_path;
		plan_item.new_mmria_path = new_new_mmria_path;
		plan_item.old_value = new_old_value;
		plan_item.new_value = new_new_value;
		plan_item.comment = new_comment;

		selected_plan.plan_items.push(plan_item);

		document.getElementById('output').innerHTML = render_edit_migration_plan(selected_plan).join("");

	}
}


function update_plan_item_click(p_id, p_item_index)
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
		var old_mmria_path = document.getElementById("oldmmriapath_" + p_item_index).value;
		var new_mmria_path = document.getElementById("newmmriapath_" + p_item_index).value;
		var old_value = document.getElementById("oldvalue_" + p_item_index).value;
		var new_value = document.getElementById("newvalue_" + p_item_index).value;
		var comment = document.getElementById("comment_" + p_item_index).value;

		var plan_item = selected_plan.plan_items[p_item_index];

		plan_item.old_mmria_path = old_mmria_path;
		plan_item.new_mmria_path = new_mmria_path;
		plan_item.old_value = old_value;
		plan_item.new_value = new_value;
		plan_item.comment = comment;

		document.getElementById('output').innerHTML = render_edit_migration_plan(selected_plan).join("");

	}
}

function update_plan_name_click(p_id, p_value)
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
		selected_plan.name = p_value;
		//document.getElementById('output').innerHTML = render_edit_migration_plan(selected_plan).join("");
	}
}

function update_plan_description_click(p_id, p_value)
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
		selected_plan.description = p_value;

		//document.getElementById('output').innerHTML = render_edit_migration_plan(selected_plan).join("");

	}
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
