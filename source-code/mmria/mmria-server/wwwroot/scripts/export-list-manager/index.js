
var g_de_identified_list = null;
var g_selected_list = "global";
var g_is_dragging = false;

$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';
	/*profile.on_login_call_back = function (){
				load_users();
    };*/
	//profile.initialize_profile();

	load_report_set();

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



function load_report_set()
{
	$.ajax({
		url: location.protocol + '//' + location.host + '/api/export_list_manager',
	}).done(function(response) 
	{
		g_de_identified_list = response;
		
		document.getElementById('output').innerHTML = render_de_identified_list().join("");
        post_render();
	});
}


function on_export_list_type_change(p_value)
{
    g_selected_list = p_value;

    document.getElementById('output').innerHTML = render_de_identified_list().join("");
}


function post_render()
{
    const table = document.getElementById('selected_list');
    // Query all rows
    table.querySelectorAll('tr').forEach(function(row, index) {
        // Ignore the header
        // We don't want user to change the order of header
        if 
        (
            index === 0 ||
            index === g_de_identified_list.name_path_list[g_selected_list].length -1
        ) 
        {
            return;
        }

        // Get the first cell of row
        const firstCell = row.firstElementChild;
        firstCell.classList.add('draggable');

        // Attach event handler
        firstCell.addEventListener('mousedown', mouseDownHandler);
    });
}

function render_de_identified_list()
{
	var result = [];
	result.push("<br/>");
    result.push("<select id='export-list-type' onchange='on_export_list_type_change(this.value)'>");

    for (let [key, value] of Object.entries(g_de_identified_list.name_path_list)) 
    {
        if(key == g_selected_list)
        {
            result.push(`<option value='${key}' selected>${key}</option>`);
        }
        else
        {
            result.push(`<option value='${key}'>${key}</option>`);
        }
        
    }

    result.push("</select>")
    if(g_selected_list != "global")
    {
        result.push(`<input type='button' value='remove ${g_selected_list} list ...' onclick='remove_name_path_list_click()'/>`);
    }

    result.push(`
    <br/><br/>
    <input type='text' id='new_list_name' value='&nbsp;'/>
    <input type='button' value='Add New List ...' onclick='add_name_path_list_click()'/>
    <br/>
    `);

    let selected_list = g_de_identified_list.name_path_list[g_selected_list];


	result.push("<table id='selected_list'>");
	result.push("<tr><th colspan='3' bgcolor='silver' scope='colgroup'>[" + g_selected_list + "] de identified list (" + selected_list.length + ")</th></tr>");
	result.push("<tr>");
	result.push("<th scope='col'>path</th>");
	result.push("<th scope='col'>&nbsp;</th>");
	result.push("</tr>");    
	result.push("<tr><td colspan=3 align=right><input type='button' value='add item' onclick='add_new_item_click()' /></td></tr>")

	//result.push("<tr><td colspan=2 align=center><input type='button' value='save list' onclick='server_save()' /></td></tr>")

	
	for(let i in selected_list)
	{
		let item = selected_list[i];

		if(i % 2)
		{
			result.push("<tr bgcolor='#CCCCCC'>");
		}
		else
		{
			result.push("<tr>");
		}
        let row_number = new Number(i);
        row_number++;
        result.push(`<td>${row_number}</td>`)
		result.push("<td><label title='");
		result.push(item);
		result.push("'><input size='120' type='text' value='");
		result.push(item);
		result.push("' onblur='update_item("+ i+", this.value)'/></label></td>");
		result.push("<td><input type=button value=delete onclick='delete_item(" + i + ")' /></td>");
		result.push("</tr>");		
		
	}

    result.push("</table>");

	result.push("<p><input type='button' value='save lists' onclick='server_save()' /></p>")

	
	
	result.push("<br/>");
	
	return result;

}

function update_item(p_index, p_value)
{
	g_de_identified_list.name_path_list[g_selected_list][p_index] = p_value;


}

function delete_item(p_index)
{
	g_de_identified_list.name_path_list[g_selected_list].splice(p_index,1);
	document.getElementById('output').innerHTML = render_de_identified_list().join("");
}

function add_new_item_click()
{
	
	g_de_identified_list.name_path_list[g_selected_list].push("");

	document.getElementById('output').innerHTML = render_de_identified_list().join("");
}

function server_save()
{

	$.ajax({
				url: location.protocol + '//' + location.host + '/api/export_list_manager',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(g_de_identified_list),
				type: "POST"/*,
				beforeSend: function (request)
				{
					request.setRequestHeader ("Authorization", "Basic " + btoa(g_uid  + ":" + $mmria.getCookie("pwd")));
					request.setRequestHeader("AuthSession", $mmria.getCookie("AuthSession"));
				},*/
		}).done(function(response) 
		{

			var response_obj = eval(response);
			if(response_obj.ok)
			{
				g_de_identified_list._rev = response_obj.rev; 

				document.getElementById('output').innerHTML = render_de_identified_list().join("");
			}
		});

}





function remove_name_path_list_click(p_id)
{


	if(g_selected_list != 'global')
	{

		var answer = prompt ("Are you sure you want to remove the " + g_selected_list + " list?", "Enter yes to confirm");
		if(answer == "yes")
		{
            g_de_identified_list.name_path_list[g_selected_list] = [];
			delete g_de_identified_list.name_path_list[g_selected_list];

            g_selected_list = 'global';

            document.getElementById('output').innerHTML = render_de_identified_list().join("");
		}
		

	}
}

function add_name_path_list_click(p_id)
{
    let new_name = document.getElementById("new_list_name").value.trim();

	if
    (
        new_name != null && 
        new_name != '' &&
        g_de_identified_list.name_path_list[new_name] == null
    )
	{

		var answer = prompt ("Are you sure you want to add the " + new_name + " list?\n\nUse CDC host site prefix.\n\nhttp://demo-mmria.cdc.gov = demo\nhttp://fl-mmria.cdc.gov = fl\nhttps://test-mmria.apps.ecpaas-dev.cdc.gov = test", "Enter yes to confirm");
		if(answer == "yes")
		{
			g_de_identified_list.name_path_list[new_name] = [];


            g_de_identified_list.name_path_list['global'].forEach
            (path => {
                g_de_identified_list.name_path_list[new_name].push(path)
            });
            g_selected_list = new_name;

            document.getElementById('output').innerHTML = render_de_identified_list().join("");
		}
		

	}
    else
    {
        alert("Add new list: invalid name. name must not be blank and must not already be on the list.")
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
	result.push("<tr bgcolor='#DDDD88'><th colspan='2' scope='colgroup'>selected migration plan</th></tr>");
	result.push("<tr><td><b>name:</b></td>");
	result.push("<td><span title='" + p_migration_plan.name + "'><input type='text' value='");
	result.push(p_migration_plan.name);
	result.push("' onblur='update_plan_name_click(\"" + p_migration_plan._id + "\", this.value)'/></span> <input type=button value='== run migration plan ==' onclick='run_migration_plan_item_click(\"" + p_migration_plan._id + "\")' /></td>");
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
	result.push("<tr><th colspan='6' bgcolor='#DDDD88' scope='colgroup'>migration plan item list</th></tr>");
	result.push("<tr>");
	result.push("<th scope='col'>old_mmria_path</th>");
	result.push("<th scope='col'>new_mmria_path</th>");
	result.push("<th scope='col'>old_value</th>");
	result.push("<th scope='col'>new_value</th>");
	result.push("<th scope='col'>comment</th>");
	result.push("<th scope='col'>&nbsp;</th>");
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

		create_input_box_td(result, item.old_mmria_path, "oldmmriapath_" + i, "update_plan_item_old_mmria_path_onblur", p_migration_plan._id, i);
		create_input_box_td(result, item.new_mmria_path, "newmmriapath_" + i, "update_plan_item_new_mmria_path_onblur", p_migration_plan._id, i);
		create_input_box_td(result, item.old_value, "oldvalue_" + i, "update_plan_item_old_value_onblur", p_migration_plan._id, i);
		create_input_box_td(result, item.new_value, "newvalue_" + i, "update_plan_item_new_value_onblur", p_migration_plan._id, i);
		create_textarea_td(result, item.comment, "comment_" + i, "update_plan_item_comment_onblur", p_migration_plan._id, i);
		
		result.push("<td><input type=button value=delete onclick='delete_plan_item_click(\"" + p_migration_plan._id + "\"," + i + ")' /></td>");
		result.push("</tr>");		
		
	}


	result.push("<tr>");
	result.push("<td colspan=6 align=right><input type=button value='add new item' onclick='add_new_plan_item_click(\"" + p_migration_plan._id + "\")' /></td>");
	result.push("</tr>");

	result.push("</table>");

	return result;

}

function create_input_box_td(p_result, p_item_text, p_id, p_onblur, p_plan_id,  p_index)
{
	p_result.push("<td><span title='");
	p_result.push(p_item_text);
	p_result.push("'><input type='text' value='");
	p_result.push(p_item_text);

	if(p_id)
	{
		p_result.push("' id='");
		p_result.push(p_id);
	}
	p_result.push("'");

	if(p_onblur)
	{
		p_result.push(" onblur='" + p_onblur + "(\"" + p_plan_id + "\",\"" + p_index + "\", this.value)'");
	}

	p_result.push("/><span></td>");
		
}


function create_textarea_td(p_result, p_item_text, p_id, p_onblur, p_plan_id, p_index)
{
	p_result.push("<td><span title='");
	p_result.push(p_item_text);
	if(p_id)
	{
		p_result.push("' id='");
		p_result.push(p_id);
	}
	p_result.push("'><textarea cols=35 rows=3 ");
	
	if(p_onblur)
	{
		p_result.push(" onblur='" + p_onblur + "(\"" + p_plan_id + "\",\"" + p_index + "\", this.value)'");
	}

	p_result.push(">");
	p_result.push(p_item_text);
	p_result.push("</textarea></span></td>");
		
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
		var plan_item = get_migation_plan_item_default();
		selected_plan.plan_items.push(plan_item);

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

function run_migration_plan_item_click(p_id)
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
		var answer = prompt ("Are you sure you want to run the [" + selected_plan.name + "] migration plan?", "Enter yes to confirm");
		if(answer == "yes")
		{
			
		}
	}
}


function update_plan_item_old_mmria_path_onblur(p_id, p_item_index, p_value)
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
		var plan_item = selected_plan.plan_items[p_item_index];
		plan_item.old_mmria_path = p_value;
	}
}

function update_plan_item_new_mmria_path_onblur(p_id, p_item_index, p_value)
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
		var plan_item = selected_plan.plan_items[p_item_index];
		plan_item.new_mmria_path = p_value;
	}
}

function update_plan_item_old_value_onblur(p_id, p_item_index, p_value)
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
		var plan_item = selected_plan.plan_items[p_item_index];

		plan_item.old_value = p_value;

	}
}

function update_plan_item_new_value_onblur(p_id, p_item_index, p_value)
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
		var plan_item = selected_plan.plan_items[p_item_index];

		plan_item.new_value = p_value;
	}
}





let draggingEle;
let draggingRowIndex;
let placeholder;
let list;
let isDraggingStarted = false;
let model_drag_index = -1;
let model_target_index = -1;

// The current position of mouse relative to the dragging element
let x = 0;
let y = 0;

// Swap two nodes
function swap(nodeA, nodeB) 
{
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    // Move `nodeA` to before the `nodeB`
    nodeB.parentNode.insertBefore(nodeA, nodeB);

    // Move `nodeB` to before the sibling of `nodeA`
    parentA.insertBefore(nodeB, siblingA);
}

// Check if `nodeA` is above `nodeB`
function isAbove (nodeA, nodeB) 
{
    // Get the bounding rectangle of nodes
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();

    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
}

function cloneTable() 
{
    const table = document.getElementById("selected_list");
    const rect = table.getBoundingClientRect();
    const width = parseInt(window.getComputedStyle(table).width);

    list = document.createElement('div');
    list.classList.add('clone-list');
    list.style.position = 'absolute';
    list.style.left = `${rect.left}px`;
    list.style.top = `${rect.top}px`;
    table.parentNode.insertBefore(list, table);

    // Hide the original table
    table.style.visibility = 'hidden';

    table.querySelectorAll('tr').forEach(function (row) {
        // Create a new table from given row
        const item = document.createElement('div');
        item.classList.add('draggable');

        const newTable = document.createElement('table');
        newTable.setAttribute('class', 'clone-table');
        newTable.style.width = `${width}px`;

        const newRow = document.createElement('tr');
        const cells = [].slice.call(row.children);
        cells.forEach(function (cell) {
            const newCell = cell.cloneNode(true);
            newCell.style.width = `${parseInt(window.getComputedStyle(cell).width)}px`;
            newRow.appendChild(newCell);
        });

        newTable.appendChild(newRow);
        item.appendChild(newTable);
        list.appendChild(item);
    });
}

function mouseDownHandler(e) 
{
    const table = document.getElementById("selected_list");
    // Get the original row
    const originalRow = e.target.parentNode;
    draggingRowIndex = [].slice.call(table.querySelectorAll('tr')).indexOf(originalRow);

    model_drag_index = parseInt(originalRow.innerText);

    // Determine the mouse position
    x = e.clientX;
    y = e.clientY;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
}

function mouseMoveHandler(e) 
{
    if(draggingRowIndex < 0)
    {
        return;
    }

    if (!isDraggingStarted) 
    {
        isDraggingStarted = true;

        cloneTable();

        draggingEle = [].slice.call(list.children)[draggingRowIndex];
        draggingEle.classList.add('dragging');

        // Let the placeholder take the height of dragging element
        // So the next element won't move up
        placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
        placeholder.style.height = `${draggingEle.offsetHeight}px`;
    }

    // Set position for dragging element
    draggingEle.style.position = 'absolute';
    draggingEle.style.top = `${draggingEle.offsetTop + e.clientY - y}px`;
    draggingEle.style.left = `${draggingEle.offsetLeft + e.clientX - x}px`;

    // Reassign the position of mouse
    x = e.clientX;
    y = e.clientY;

    // The current order
    // prevEle
    // draggingEle
    // placeholder
    // nextEle
    const prevEle = draggingEle.previousElementSibling;
    const nextEle = placeholder.nextElementSibling;

    // The dragging element is above the previous element
    // User moves the dragging element to the top
    // We don't allow to drop above the header
    // (which doesn't have `previousElementSibling`)
    if (prevEle && prevEle.previousElementSibling && isAbove(draggingEle, prevEle)) {
        // The current order    -> The new order
        // prevEle              -> placeholder
        // draggingEle          -> draggingEle
        // placeholder          -> prevEle
        swap(placeholder, draggingEle);
        swap(placeholder, prevEle);
        return;
    }

    // The dragging element is below the next element
    // User moves the dragging element to the bottom
    if (nextEle && isAbove(nextEle, draggingEle)) {
        // The current order    -> The new order
        // draggingEle          -> nextEle
        // placeholder          -> placeholder
        // nextEle              -> draggingEle
        swap(nextEle, placeholder);
        swap(nextEle, draggingEle);
    }
}

function mouseUpHandler() 
{
    const table = document.getElementById("selected_list");

    if(placeholder.nextElementSibling != null)
    {
        model_target_index = parseInt(placeholder.nextElementSibling.innerText);
    }
    else
    {
        model_target_index = -1;
    }

    //const y = g_de_identified_list.name_path_list[g_selected_list][model_drag_index -1];
    //const x = g_de_identified_list.name_path_list[g_selected_list][model_target_index -1];

    if(model_target_index != -1 && model_drag_index != -1)
    {
        const x = model_target_index -1;
        const y = model_drag_index -1;
        

        const swap_list = g_de_identified_list.name_path_list[g_selected_list];
        const b = swap_list[y];
        swap_list[y] = swap_list[x];
        swap_list[x] = b;
    }
    // Remove the placeholder
    if
    (
        placeholder!=null &&
        placeholder.parentNode != null
    )
    {
        placeholder.parentNode.removeChild(placeholder);
    }

    draggingEle.classList.remove('dragging');
    draggingEle.style.removeProperty('top');
    draggingEle.style.removeProperty('left');
    draggingEle.style.removeProperty('position');

    // Get the end index
    const endRowIndex = [].slice.call(list.children).indexOf(draggingEle);

    isDraggingStarted = false;

    // Remove the `list` element
    if(list.parentNode != null)
    {
        list.parentNode.removeChild(list);
    }

    // Move the dragged row to `endRowIndex`
    let rows = [].slice.call(table.querySelectorAll('tr'));
    if
    (

        draggingRowIndex > endRowIndex
    )
    {
        rows[endRowIndex].parentNode.insertBefore(rows[draggingRowIndex], rows[endRowIndex])
    }
    else if(draggingRowIndex > -1)
    {
        rows[endRowIndex].parentNode.insertBefore(
                rows[draggingRowIndex],
                rows[endRowIndex].nextSibling
            );
    }

    // Bring back the table
    table.style.removeProperty('visibility');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    document.getElementById('output').innerHTML = render_de_identified_list().join("");
    post_render();
}

/*
table.querySelectorAll('tr').forEach(function (row, index) {
    // Ignore the header
    // We don't want user to change the order of header
    if (index === 0) {
        return;
    }

    const firstCell = row.firstElementChild;
    firstCell.classList.add('draggable');
    firstCell.addEventListener('mousedown', mouseDownHandler);
});
*/
