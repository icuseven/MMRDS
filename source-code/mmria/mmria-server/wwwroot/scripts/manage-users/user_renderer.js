function user_render(p_ui, p_created_by)
{
	var result = [];
    let role_set = get_role_list();


    const temp_result = [];

    role_set.forEach(role => {
        if(role === "")
        {
            temp_result.push("<option selected>Filter by Role</option>");
        }
        else
        {
            temp_result.push("<option value ='" + role + "'>");
            var role_name = role.split('_');
            role_name = role_name.map(section => {
                if (section === 'steve' || section === 'mmria' || section === 'prams')
                    return section.toUpperCase();
                else
                    return section[0].toUpperCase() + section.slice(1);
            });
            temp_result.push(role_name.join(" "));
            temp_result.push("</option>");
        }

    });
    result.push
    (`
        <div class='d-flex'>
            <select class='form-control col-3'>
                ${temp_result.join("")}
            </select>
            <div class='vertical-control col-md-3'><div class='input-group'>
                <input autocomplete='off' class='form-control' type='text' placeholder='Search'>
                <div class='input-group-append'><button class='btn btn-outline-secondary'><img src='./img/icon_search.svg'></button></div>
                </div>
            </div>
        </div>
        ${render_user_table_navigation()}
        <div style='clear:both;'>
            <table class='table table-layout-fixed align-cell-top'><caption class='table-caption'>User management table</caption>
                <thead>
                    <tr class='header-level-2'>
                        <th width='250' scope='colgroup'>Username (Email Address)</th>
                        <th scope='colgroup;'>Role(s)</th>
                        <th width='250' scope='colgroup;'>Actions</th>
                    </tr>
                </thead><tbody>
	`);

	for(var i = 0; i < p_ui.user_summary_list.length; i++)
	{
		var item = p_ui.user_summary_list[i];
		if(item._id != "org.couchdb.user:mmrds")
		{
			Array.prototype.push.apply(result, user_entry_render(item, i, p_created_by, role_set));
		}
	}

	result.push("</tbody></table></div>");
    result.push(render_user_table_navigation());

	return result;
}

function render_user_table_navigation()
{
    const result = [`
        <div class='d-flex mb-3 mt-2'>
	        <button class='btn secondary-button' aria-label='View Audit Log' value='View Audit Log' onclick='view_audit_log_click()'>
                <span class='x20 fill-p cdc-icon-clipboard-list-check-solid'><span class='ml-1'>View Audit Log</span></span>
            </button>
            <div class='ml-auto mr-3 d-flex'>
                <div class='d-flex align-items-center'>
                    <div>Showing 1-10 of 30 cases</div>
                    <div class='row ml-2'>
                        <button disabled='' aria-disabled='true' class='icon-button btn-tab-navigation reverse'><span class='x24 fill-p cdc-icon-chevron-double-right'></span></button>
                        <button disabled='' aria-disabled='true' class='icon-button btn-tab-navigation reverse'><span class='x24 fill-p cdc-icon-chevron-right'></span></button>
                        <button class='icon-button btn-tab-navigation'>1</button>
                        <button class='icon-button pt-1 btn-tab-navigation'><span class='x24 fill-p cdc-icon-chevron-right'></span></button>
                        <button class='icon-button pt-1 btn-tab-navigation'><span class='x24 fill-p cdc-icon-chevron-double-right'></span></button>
                    </div>
                </div>
            </div>
            <button class='btn primary-button ml-1' aria-label='Add New User' value='View Audit Log' onclick='add_new_user_click()'>
                <span class='x20 cdc-icon-plus'><span class='ml-1'>Add New User</span></span>
            </button>
            <button class='btn primary-button ml-1' aria-label='Export User list' value='Export User List' onclick='export_user_list_click()'>
                <span class='x18 cdc-icon-share'><span class='ml-1'>Export User List</span></span>
            </button>
        </div>
    `];

    return result.join("");
}

function user_entry_render(p_user, p_i, p_created_by, role_set)
{
	//var result = [];
    var role_count = 0;
	// result.push("<tr id='" +  convert_to_jquery_id(p_user._id) + "' valign=top><td>");
	// result.push('<div>' + p_user.name + '</div>');
    // result.push('</td>');
    // result.push()


	// result.push("<td>");

    // result.push('<div style="overflow-x: hidden; overflow-y: auto; height: 100px;">')
    const role_result = [];
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		var user_role = g_user_role_jurisdiction[i];
		if
        (
            role_set.indexOf(user_role.role_name) > -1  &&
            (
                (
                    g_managed_jurisdiction_set[user_role.jurisdiction_id] != null &&
                    g_managed_jurisdiction_set[user_role.jurisdiction_id] == true
                ) 
                ||
                g_managed_jurisdiction_set["/"] == true

            ) 
            &&
            user_role.user_id == p_user.name
        )
		{
            role_result.push('<div>');
            var role_name = user_role.role_name.split('_');
            role_name = role_name.map(section => {
                if (section === 'steve' || section === 'mmria' || section === 'prams')
                    return section.toUpperCase();
                else
                    return section[0].toUpperCase() + section.slice(1)
            });
			role_result.push(role_name.join(" "));
			role_result.push(" / ");
			role_result.push(user_role.jurisdiction_id  == "/"? "Top Folder": user_role.jurisdiction_id);
			role_result.push(" / ");
            if(user_role.is_active)
			    role_result.push(" Active");
            else
                role_result.push(" Inactive");
            role_result.push('</div>');
		}
	}
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


	// result.push("<td>")
    // result.push("<div class='d-flex flex-column col-12'>");
	// result.push("<input class='btn secondary-button' aria-label='Set All Roles to Inactive for " + p_user.name + "' type='button' value='Set All Roles to Inactive' onclick='set_role_to_inactive_for_user(\"" + p_user._id + "\")'/>");
    // result.push("<input class='btn delete-button' type='button' aria-label='Delete User " + p_user.name + "' value='Delete' onclick='delete_user(\"" + p_user._id + "\")'/>");
    // result.push("</div>");

	// result.push("</td>")
	// result.push("</tr>");

    const result = [`
        <tr id=" +  ${convert_to_jquery_id(p_user._id)} + " valign=top>
            <td>
                <div>
                    <button onclick="edit_user_click('${p_user._id}')" class="btn btn-link">${p_user.name}</button>
                </div>
            </td>
            <td>
                <div style="overflow-x: hidden; overflow-y: auto; height: 100px;">
                    ${role_result.join("")}
                </div>
            </td>
            <td>
                <div class="d-flex flex-column col-12">
                <button class="btn secondary-button" aria-label="Set all roles to inactive for ${p_user.name}" onclick="set_roles_inactive_for_user_click('${p_user._id}')">
                    Set All Roles to Inactive
                </button>
                <button class="btn delete-button" aria-label="Delete user ${p_user.name}" onclick="delete_user_click('${p_user._id}')">
                    Delete
                </button>
                </div>
            </td>
        </tr>
    `];


	return result;
}



function get_role_list()
{
    let result = [];

    if(g_is_pmss_enhanced)
    {
        if
        (
            g_is_installation_admin && 
            g_is_installation_admin.toLowerCase() == "true"
        )
        {
            result = [ '', 'abstractor','data_analyst', 'committee_member','cdc_admin','cdc_analyst','form_designer', 'jurisdiction_admin', 'steve_mmria', 'steve_prams', 'vital_importer', "vro"];
        }
        else if(g_jurisdiction_list.find(f => f.role_name == "cdc_admin"))
        {
            result = [ '', 'abstractor','data_analyst', 'committee_member', 'jurisdiction_admin','steve_mmria', 'steve_prams', 'vital_importer', "vro"];
        }
        else
        {
            result = [ '', 'abstractor','data_analyst', 'committee_member', 'jurisdiction_admin', "vro"];
        }
    }
    else
    {
        if
        (
            g_is_installation_admin && 
            g_is_installation_admin.toLowerCase() == "true"
        )
        {
            result = [ '', 'abstractor','data_analyst', 'committee_member','cdc_admin','cdc_analyst','form_designer', 'jurisdiction_admin', 'steve_mmria', 'steve_prams', 'vital_importer', 'vital_importer_state'];
        }
        else if(g_jurisdiction_list.find(f => f.role_name == "cdc_admin"))
        {
            result = [ '', 'abstractor','data_analyst', 'committee_member', 'jurisdiction_admin','steve_mmria', 'steve_prams', 'vital_importer'];
        }
        else
        {
            result = [ '', 'abstractor','data_analyst', 'committee_member', 'jurisdiction_admin'];
        }
    }
    

    return result;
}

function render_role_list_for(p_user, p_created_by)
{
	let result = [];

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
        
		if
        (
            user_role.user_id == p_user.name
        )
		{
			result.push("<option");

			result.push(" value='");
			result.push(user_role._id);
			result.push("'>");
			result.push(user_role.user_id);
			result.push(" ");
			result.push(user_role.role_name);
			result.push(" ");
			result.push(user_role.jurisdiction_id == "/" ? "Top Folder" : user_role.jurisdiction_id);
			result.push(" ");

			if(user_role.effective_start_date instanceof Date && user_role.effective_start_date != "Invalid Date")
			{
				result.push(user_role.effective_start_date.toISOString());
			}
			else
			{
				result.push(user_role.effective_start_date);
			}


			result.push(" ");
			
			if(user_role.effective_end_date instanceof Date && user_role.effective_end_date != "Invalid Date")
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

	if(p_updated_by == null || p_updated_by == "")
	{
		p_updated_by = g_current_u_id;
	}

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
	let result = [];
	let role_set = get_role_list();

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
		result.push("><option></option>")
		p_level = 0;
	}
    let is_managed_jusisdiction = false;
    for (const key in g_managed_jurisdiction_set) 
    {
        if (g_managed_jurisdiction_set.hasOwnProperty(key)) 
        {
            if(p_data.name.indexOf(key) == 0)
            {
                is_managed_jusisdiction = true;
                break;
            }
        }
    }
    if(is_managed_jusisdiction)
    {
        result.push(`<option value=${p_data.name}`);
        if(p_data.name == p_selected_id)
        {
            result.push(" selected=true")
        }
        result.push(">");
        result.push(p_data.name == "/" ? "Top Folder" : p_data.name);
        result.push("</option>");
    }
    if(p_data.children != null)
    {
        for(var i = 0; i < p_data.children.length; i++)
        {
            var child = p_data.children[i];
            Array.prototype.push.apply(result, user_role_jurisdiction_render(child, p_selected_id, p_level + 1, p_user_name));
            
        }
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
	result.push("<tr><th scope='col'>Name</th><th scope='col'>Value</th><tr>");

	result.push("<tr><td>")
	result.push("user_id");
	result.push("</td><td>");
	result.push(p_user_role_jurisdiction.user_id);
	result.push("</td></tr>")
	result.push("<tr><td>")
	result.push("<label for='selected_user_role_for_" + p_user.name + "_role'>role_name</label>");
	result.push("</td><td>")
    

	Array.prototype.push.apply(result, user_role_render(p_user, p_user_role_jurisdiction));

	result.push("</td></tr>")
	result.push("<tr><td>")
	result.push("<label for='selected_user_role_for_" + p_user.name + "_jurisdiction'>case_folder_access</label>");
	result.push("</td><td>")
	Array.prototype.push.apply(result, user_role_jurisdiction_render(g_jurisdiction_tree, p_user_role_jurisdiction.jurisdiction_id, 0, p_user.name));

	result.push("</td></tr>")
	result.push("<tr><td>")
	result.push("<label for='selected_user_role_for_" + p_user.name + "_effective_start_date'>effective_start_date</label>");
	result.push("</td><td><input id='selected_user_role_for_" + p_user.name + "_effective_start_date' type='text' size=25 value='")
	if(p_user_role_jurisdiction.effective_start_date instanceof Date && p_user_role_jurisdiction.effective_start_date != "Invalid Date")
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
	result.push("<label for='selected_user_role_for_" + p_user.name + "_effective_end_date'>effective_end_date</label>");
	result.push("</td><td><input id='selected_user_role_for_" + p_user.name + "_effective_end_date' type='text' size=25 value='")
	if(p_user_role_jurisdiction.effective_end_date instanceof Date && p_user_role_jurisdiction.effective_end_date != "Invalid Date")
	{
		result.push(p_user_role_jurisdiction.effective_end_date.toISOString());
	
	}
	else
	{
		result.push(p_user_role_jurisdiction.effective_end_date);
	}
	
	result.push("'/> </td></tr>")
	result.push("<tr><td>")
	result.push("<label for='selected_user_role_for_" + p_user.name + "_is_active'>is_active</label>");
	result.push("</td><td><input id='selected_user_role_for_" + p_user.name + "_is_active' type='text' value='")
	result.push(p_user_role_jurisdiction.is_active);
	result.push("' /> </td></tr>")


	result.push("<tr><td>");
	result.push(`<span>`);
	result.push("<input type='button' value='Remove Role' onclick='init_small_loader(function(){ remove_role(\"" + p_user_role_jurisdiction._id + "\") })'/>");
	result.push(`<span class="spinner-container spinner-small ml-1"><span class="spinner-body text-primary"><span class="spinner"></span></span></span>`);
	result.push(`</span>`);
	result.push(`<span>`);
	result.push("<input type='button' value='Update Role' onclick='init_small_loader(function(){ update_role(\"" + p_user_role_jurisdiction._id + "\",\"" + p_updated_by + "\") })' />");
	result.push(`<span class="spinner-container spinner-small ml-1"><span class="spinner-body text-primary"><span class="spinner"></span></span></span>`);
	result.push(`</span>`);
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

						document.getElementById('form_content_id').innerHTML = user_render(g_ui, g_current_u_id).join("")
						+ "<p>tree</p><ul>" + jurisdiction_render(g_jurisdiction_tree).join("") + "</ul>";
						;

						break;
					}
				}
			}
		});
	}
}