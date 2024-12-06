function jurisdiction_render(p_data, p_path, p_nested_level = 0)
{
	var result = [];
    var top_level_indent = 25;
    var indent_level = p_nested_level * top_level_indent;

    if(p_path == null)
    {
        p_path = "";
    }
	if( p_data._id)
	{ 
        result.push("<form data-nested-level='" + p_nested_level + "' onsubmit='event.preventDefault()' id='add-node-form-" + p_data._id.replace("/", "_") + "'>");
		result.push("<div class='horizontal-control' id='" + p_data._id.replace("/","_") + "'>");
        if(p_data.name == "/")
        {
            result.push("<label class='mr-3'>Top Folder</label>");
        }
        else
        {
            result.push("<label id='" + p_data._id + "-label' class='mr-3'>");
		    result.push(p_data.name.split('/').pop());
            result.push("</label>")
        }
        for (const key in g_managed_jurisdiction_set) 
        {
            if (g_managed_jurisdiction_set.hasOwnProperty(key)) 
            {
                if(p_data.name.indexOf(key) == 0)
                {
                    result.push("<input aria-invalid='false' aria-describedby='add_child_of_" + p_data._id.replace("/", "_") + "' placeholder='Enter node name' required aria-label='Add child for " + p_data._id.replace("/","_") + "' class='form-control ml-auto mr-3 mt-2 col-3' id='add_child_of_" + p_data._id.replace("/","_") + "' /><button style='margin-right: 350px;' style='margin-right: 215px;' value='Add Folder' class='secondary-button' onclick='init_small_loader(function(){ jurisdiction_add_child_click(\"" + p_data._id + "\", document.getElementById(\"add_child_of_" + p_data._id.replace("/","_") + "\").value, \"\") })'>Add Folder</button>");
                    //result.push(`<span class="spinner-container spinner-small ml-1"><span class="spinner-body text-primary"><span class="spinner"></span></span></span>`);
                    break;
                }
            }
        }
		result.push("</div>");
	}
	else
	{
        result.push("<form data-nested-level='" + p_nested_level + "'  class='" + p_data.parent_id + "-child' onsubmit='event.preventDefault()' id='add-node-form-" + p_data.id.replace("/", "_") + "'>");
		result.push("<div class='horizontal-control' id='" + p_data.id.replace("/","_") + "'>");
        result.push("<label id='" + p_data.id + "-label' style='padding-left: " + indent_level + "px;' class='mr-3'>");
        if(p_data.children != null && p_data.children.length > 0)
        {
            result.push("<button aria-label='Show " + p_data.name.split('/').pop() + " children' aria-expanded='false' formnovalidate='formnovalidate' aria-hidden='true' hidden onclick='init_small_loader(function(){ set_jurisdiction_show_hide_children_state(\"" + p_data.id + "\", true, false, true)})' id='" + p_data.id + "_show_children' class='btn primary-color p-0 transparent-button'><span class='x20 fill-p cdc-icon-plus'></span></button>");
            result.push("<button aria-label='Hide " + p_data.name.split('/').pop() + " children' aria-expanded='true' formnovalidate='formnovalidate' aria-hidden='false' onclick='init_small_loader(function(){ set_jurisdiction_show_hide_children_state(\"" + p_data.id + "\", false, false, false)})' id='" + p_data.id + "_hide_children' class='btn primary-color p-0 transparent-button'><span class='x20 fill-p cdc-icon-minus'></span></button>");
        }
        // else
        // {
        //     result.push("<button aria-label='Show " + p_data.name.split('/').pop() + " children' aria-expanded='false' formnovalidate='formnovalidate' aria-hidden='true' hidden onclick='init_small_loader(function(){ set_jurisdiction_show_hide_children_state(\"" + p_data.id + "\", true, false, true)})' id='" + p_data.id + "_show_children' class='btn primary-color p-0 transparent-button'><span class='x20 fill-p cdc-icon-plus'></span></button>");
        //     result.push("<button aria-label='Hide " + p_data.name.split('/').pop() + " children' aria-expanded='true' formnovalidate='formnovalidate' aria-hidden='true' hidden onclick='init_small_loader(function(){ set_jurisdiction_show_hide_children_state(\"" + p_data.id + "\", false, false, false)})' id='" + p_data.id + "_hide_children' class='btn primary-color p-0 transparent-button'><span class='x20 fill-p cdc-icon-minus'></span></button>");           
        // }
		result.push(p_data.name.split('/').pop());
        result.push("</label>");

        let new_path = `${p_path}${p_data.name}`;
        if(p_path == "/")
        {
            new_path = p_data.name;
        }

        for (const key in g_managed_jurisdiction_set) 
        {
            if (g_managed_jurisdiction_set.hasOwnProperty(key)) 
            {
                if(new_path.indexOf(key) == 0)
                {
                    result.push("<input aria-invalid='false' aria-describedby='add_child_of_" + p_data.id.replace("/", "_") + "' placeholder='Enter node name' required aria-label='Add child for " + p_data.id.replace("/","_") + "' class='form-control ml-auto mr-3 mt-2 col-3' id='add_child_of_" + p_data.id.replace("/","_") + "' /><button value='Add Folder' class='secondary-button mr-3' onclick='init_small_loader(function(){ jurisdiction_add_child_click(\"" + p_data.id + "\", document.getElementById(\"add_child_of_" + p_data.id.replace("/","_") + "\").value, \"\") })'>Add Folder</button></label><input style='margin-right: 215px;' class='delete-button' type='button' value='Delete Folder' onclick='init_small_loader(function(){ jurisdiction_remove_child_click(\"" + p_data.parent_id + "\", \"" + p_data.id + "\", \"\") })' />");
                    //result.push(`<div style='margin-right: 215px;'><span class="spinner-container spinner-small ml-1"><span class="spinner-body text-primary"><span class="spinner"></span></span></div></span>`);
                    break;
                }
            }
        }
        result.push("</div>");

	}
    result.push("</form>");
    if(p_data.children != null)
        {
            for(var i = 0; i < p_data.children.length; i++)
            {
                var child = p_data.children[i];
                let new_path = `${p_path}${p_data.name}`;
                if(p_path == "")
                {
                    new_path = p_data.name;
                }
                Array.prototype.push.apply(result, jurisdiction_render(child, new_path, p_nested_level + 1));			
            }
        }
	
	if(p_data._id)
	{
		result.push("<br/><input class='primary-button mr-3' type='button' value='Save Folder Changes' onclick='init_small_loader(function(){ save_jurisdiction_tree_click(\"\") })' />");
		result.push(`<span class="spinner-container spinner-small ml-1"><span class="spinner-body text-primary"><span class="spinner"></span></span></span>`);
	}

	return result;
}

function render_new_case_folder(p_data, p_path, p_nested_level)
{
	var result = [];
    var top_level_indent = 25;
    p_nested_level = p_nested_level + 1;
    var indent_level = p_nested_level * top_level_indent;

    if(p_path == null)
    {
        p_path = "";
    }
	if( p_data._id)
	{ 
		result.push("<div class='horizontal-control' id='" + p_data._id.replace("/","_") + "'>");
        if(p_data.name == "/")
        {
            result.push("<label id='" + p_data._id + "-label' class='mr-3'>Top Folder</label>");
        }
        else
        {
            result.push("<label class='mr-3'>");
		    result.push(p_data.name.split('/').pop());
            result.push("</label>")
        }
        for (const key in g_managed_jurisdiction_set) 
        {
            if (g_managed_jurisdiction_set.hasOwnProperty(key)) 
            {
                if(p_data.name.indexOf(key) == 0)
                {
                    result.push("<input aria-invalid='false' aria-describedby='add_child_of_" + p_data._id.replace("/", "_") + "' placeholder='Enter node name' required aria-label='Add child for " + p_data._id.replace("/","_") + "' class='form-control ml-auto mr-3 mt-2 col-3' id='add_child_of_" + p_data._id.replace("/","_") + "' /><button style='margin-right: 350px;' style='margin-right: 215px;' value='Add Folder' class='secondary-button' onclick='init_small_loader(function(){ jurisdiction_add_child_click(\"" + p_data._id + "\", document.getElementById(\"add_child_of_" + p_data._id.replace("/","_") + "\").value, \"\") })'>Add Folder</button>");
                    //result.push(`<span class="spinner-container spinner-small ml-1"><span class="spinner-body text-primary"><span class="spinner"></span></span></span>`);
                    break;
                }
            }
        }
		result.push("</div>");
	}
	else
	{
		result.push("<div class='horizontal-control' id='" + p_data.id.replace("/","_") + "'>");
        result.push("<label id='" + p_data.id + "-label' style='padding-left: " + indent_level + "px;' class='mr-3'>");
        if(p_data.children != null && p_data.children.length > 0)
        {
            result.push("<button aria-label='Show " + p_data.name.split('/').pop() + " children' aria-expanded='false' formnovalidate='formnovalidate' aria-hidden='true' hidden onclick='init_small_loader(function(){ set_jurisdiction_show_hide_children_state(\"" + p_data.id + "\", true, false, true)})' id='" + p_data.id + "_show_children' class='btn primary-color p-0 transparent-button'><span class='x20 fill-p cdc-icon-plus'></span></button>");
            result.push("<button aria-label='Hide " + p_data.name.split('/').pop() + " children' aria-expanded='true' formnovalidate='formnovalidate' aria-hidden='false' onclick='init_small_loader(function(){ set_jurisdiction_show_hide_children_state(\"" + p_data.id + "\", false, false, false)})' id='" + p_data.id + "_hide_children' class='btn primary-color p-0 transparent-button'><span class='x20 fill-p cdc-icon-minus'></span></button>");
        }
        // else
        // {
        //     result.push("<button aria-label='Show " + p_data.name.split('/').pop() + " children' aria-expanded='false' formnovalidate='formnovalidate' aria-hidden='true' hidden onclick='init_small_loader(function(){ set_jurisdiction_show_hide_children_state(\"" + p_data.id + "\", true, false, true)})' id='" + p_data.id + "_show_children' class='btn primary-color p-0 transparent-button'><span class='x20 fill-p cdc-icon-plus'></span></button>");
        //     result.push("<button aria-label='Hide " + p_data.name.split('/').pop() + " children' aria-expanded='true' formnovalidate='formnovalidate' aria-hidden='true' hidden onclick='init_small_loader(function(){ set_jurisdiction_show_hide_children_state(\"" + p_data.id + "\", false, false, false)})' id='" + p_data.id + "_hide_children' class='btn primary-color p-0 transparent-button'><span class='x20 fill-p cdc-icon-minus'></span></button>");           
        // }
		result.push(p_data.name.split('/').pop());
        result.push("</label>");

        let new_path = `${p_path}${p_data.name}`;
        if(p_path == "/")
        {
            new_path = p_data.name;
        }

        for (const key in g_managed_jurisdiction_set) 
        {
            if (g_managed_jurisdiction_set.hasOwnProperty(key)) 
            {
                if(new_path.indexOf(key) == 0)
                {
                    result.push("<input aria-invalid='false' aria-describedby='add_child_of_" + p_data.id.replace("/", "_") + "' placeholder='Enter node name' required aria-label='Add child for " + p_data.id.replace("/","_") + "' class='form-control ml-auto mr-3 mt-2 col-3' id='add_child_of_" + p_data.id.replace("/","_") + "' /><button value='Add Folder' class='secondary-button mr-3' onclick='init_small_loader(function(){ jurisdiction_add_child_click(\"" + p_data.id + "\", document.getElementById(\"add_child_of_" + p_data.id.replace("/","_") + "\").value, \"\") })'>Add Folder</button></label><input style='margin-right: 215px;' class='delete-button' type='button' value='Delete Folder' onclick='init_small_loader(function(){ jurisdiction_remove_child_click(\"" + p_data.parent_id + "\", \"" + p_data.id + "\", \"\") })' />");
                    //result.push(`<div style='margin-right: 215px;'><span class="spinner-container spinner-small ml-1"><span class="spinner-body text-primary"><span class="spinner"></span></span></div></span>`);
                    break;
                }
            }
        }
        result.push("</div>");

	}
    var new_case_form_element = document.createElement('form');
    new_case_form_element.classList.add(p_data._id ? p_data._id : p_data.id + '-child');
    new_case_form_element.id = p_data._id ? ('add-node-form-' + p_data._id.replace("/", "_")) : ('add-node-form-' + p_data.id.replace("/", "_"));
    new_case_form_element.dataset.nestedLevel = p_nested_level;
    new_case_form_element.onsubmit = function(e) {
        e.preventDefault();
    }
    new_case_form_element.innerHTML = result.join("");
	return new_case_form_element;
}

function render_show_hide_buttons(p_data, indent_level)
{
    var result = [];
    result.push("<button aria-label='Show " + p_data.name.split('/').pop() + " children' aria-expanded='false' formnovalidate='formnovalidate' aria-hidden='true' hidden onclick='init_small_loader(function(){ set_jurisdiction_show_hide_children_state(\"" + p_data.id + "\", true, false, true)})' id='" + p_data.id + "_show_children' class='btn primary-color p-0 transparent-button'><span class='x20 fill-p cdc-icon-plus'></span></button>");
    result.push("<button aria-label='Hide " + p_data.name.split('/').pop() + " children' aria-expanded='true' formnovalidate='formnovalidate' aria-hidden='false' onclick='init_small_loader(function(){ set_jurisdiction_show_hide_children_state(\"" + p_data.id + "\", false, false, false)})' id='" + p_data.id + "_hide_children' class='btn primary-color p-0 transparent-button'><span class='x20 fill-p cdc-icon-minus'></span></button>");
    result.push(p_data.name.split("/").pop());
    var new_label_element = document.createElement('label');
    new_label_element.classList.add('mr-3');
    new_label_element.id = p_data.id + '-label';
    new_label_element.setAttribute('style', 'left-padding: ' + indent_level * 25);
    new_label_element.innerHTML = result.join("");
    return new_label_element;
}

/*
{
	_id: "jurisdiction_tree", 
	_rev: "1-b3e65347756f3cf46116dac1e8d9cec7", 
	name: "/", 
	children:null
	created_by:null
	date_created:"0001-01-01T00:00:00"
	date_last_updated:"0001-01-01T00:00:00"
	last_updated_by:null
	data_type:"jursidiction_tree"
}
*/


function save_jurisdiction_tree_click()
{
	if(g_jurisdiction_tree && g_current_u_id)
	{ 
		$.ajax({
					url: location.protocol + '//' + location.host + '/api/jurisdiction_tree',
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					data: JSON.stringify(g_jurisdiction_tree),
					type: "POST"
			}).done(function(response) 
			{
						var response_obj = eval(response);
						if(response_obj.ok)
						{
							g_jurisdiction_tree._rev = response_obj.rev; 
							//document.getElementById('form_content_id').innerHTML = editor_render(g_user_list, "", g_ui).join("");
						}
						//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
					console.log("jurisdiction_tree sent", response);
			});
	}
}

function save_user_role_jurisdiction(p_user_role, p_user, p_user_id)
{
	if(p_user_role && p_user_id)
	{ 
		$.ajax({
			url: location.protocol + '//' + location.host + '/api/user_role_jurisdiction',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(p_user_role),
			type: "POST",
		})
		.done(
			function(response) 
			{
				if(response)
				{
					var response_obj = eval(response);
					if(response_obj.ok)
					{
						
						for(var i in g_user_role_jurisdiction)
						{
							if(g_user_role_jurisdiction[i]._id == response_obj.id)
							{
								g_user_role_jurisdiction[i]._rev = response_obj.rev; 
								//document.getElementById('form_content_id').innerHTML = editor_render(g_user_list, "", g_ui).join("");
	
								var render_result = render_role_list_for(p_user, p_user_id);
								var role_list_for_ = document.getElementById("role_list_for_" + p_user.name);
								role_list_for_.outerHTML = render_result.join("");

								break;
							}
						}
					}
						//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
					console.log("jurisdiction_tree sent", response);
				}
				else
				{
					alert("You are not authorized to make this change.");
				}
			}
		);
	}
}
