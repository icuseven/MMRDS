
var g_substance_mapping = null;
var g_selected_list = null;

window.onload = function () 
{
    let selection_list = document.getElementById("select-list");
    selection_list.onchange = on_selection_changed;

    load_substance_mapping();
}

function on_selection_changed()
{
    let selection_list = document.getElementById("select-list");
    g_selected_list = selection_list.value;
    render();
}

function load_substance_mapping()
{

	$.ajax({
		url: location.protocol + '//' + location.host + '/api/substance_mapping',
	}).done(function(response) 
	{
		g_substance_mapping = response;
		
		render();
	});

}


function render()
{
    let html = [];

    let selected_list = g_substance_mapping.substance_lists[g_selected_list];
    if(selected_list)
    {
        html.push(`<br/><table border=1><tr bgcolor=silver align=center><th colspan=3>${g_selected_list}</th></tr>`);
        html.push(`<tr bgcolor=silver><th>source_value</th><th>target_value</th><th>action</th></tr>`);
        for(let i = 0; i < selected_list.length; i++)
        {
            let item = selected_list[i];
            let color = "";
            if(i % 2 == 1)
            {
                color = "bgcolor=CCCCCC";
            }
            html.push(`<tr id=item-${i} ${color}><td>${item.source_value}</td><td>${item.target_value}</td><td><a href="javascript:select_row(${i})">edit</a></td></tr>`)
        }
        html.push('</table>')
    }

	document.getElementById('output').innerHTML = html.join("");
}

function select_row(p_index)
{
    let selected_list = g_substance_mapping.substance_lists[g_selected_list];
    let item = selected_list[p_index];
    console.log('bbbubba ' + item.source_value);

    let element = document.getElementById(`item-${p_index}`);

    let html = [];
    html.push(`<td>${item.source_value}</td><td><input id=new-item-${p_index} type="text" value="${item.target_value}"/></td><td><a href="javascript:cancel_row(${p_index})">cancel</a> | <a href="javascript:save_row(${p_index})">save</a></td>`);
    element.innerHTML = html.join("");

}

function cancel_row(p_index)
{
    let selected_list = g_substance_mapping.substance_lists[g_selected_list];
    let item = selected_list[p_index];
    console.log('bbbubba ' + item.source_value);

    let element = document.getElementById(`item-${p_index}`);
    

    let html = [];
    html.push(`<td>${item.source_value}</td><td>${item.target_value}</td><td><a href="javascript:select_row(${p_index})">edit</a></td>`);
    element.innerHTML = html.join("");

}

function save_row(p_index)
{
    
    let selected_list = g_substance_mapping.substance_lists[g_selected_list];
    let item = selected_list[p_index];

    let input_element = document.getElementById(`new-item-${p_index}`);
    selected_list[p_index].target_value = input_element.value;

    console.log('bbbubba ' + item.source_value);

    let element = document.getElementById(`item-${p_index}`);
    let html = [];
    html.push(`<td>${item.source_value}</td><td>${item.target_value}</td><td><a href="javascript:select_row(${p_index})">edit</a></td>`);
    element.innerHTML = html.join("");

}

function render_power_bi_user_list()
{

	var result = [];
	result.push("<br/>");
	result.push("<table>");
	result.push("<tr  bgcolor='silver'>")
	result.push("<th scope='col'>user name</th>");
	result.push("<th scope='col'>power bi user</th>");
	result.push("<th scope='col'>action</th>");
	result.push("</tr>");

	//result.push("<tr><td colspan=2 align=center><input type='button' value='save list' onclick='server_save()' /></td></tr>")

	
	for(let i = 0; i < g_power_bi_user_list.rows.length; i++)
	{
		var item = g_power_bi_user_list.rows[i].doc;

		if(i % 2)
		{
			result.push("<tr bgcolor='#CCCCCC'>");
		}
		else
		{
			result.push("<tr>");
		}
		result.push("<td>");
		result.push(encodeHTML(item.name));
		result.push("</td>");
		result.push("<td><label title='");
		if(item.alternate_email != null)
		{
			result.push(encodeHTML(item.alternate_email));
		}
		result.push("'><input size='120' type='text' value='");
		if(item.alternate_email != null)
		{
			result.push(escape(item.alternate_email));
		}
		result.push("' onchange='update_item("+ i +", this.value)'/></label></td>");
		result.push("<td colspan=2 align=center><input type='button' value='save' onclick='server_save("+ i +")' /></td>")
		result.push("</tr>");		
		
	}

	
	result.push("</table>");
	result.push("<br/>");
	
	return result;

}

function update_item(p_index, p_value)
{
	g_power_bi_user_list.rows[p_index].doc.alternate_email = p_value;


}

function server_save(p_index)
{

	let user = g_power_bi_user_list.rows[p_index].doc;

	$.ajax({
				url: location.protocol + '//' + location.host + '/api/user',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(user),
				type: "POST"
		}).done(function(response) 
		{

			let response_obj = eval(response);
			if(response_obj.ok)
			{
				user._rev = user.rev; 

				render();
			}
		});
		
}



function encodeHTML(s) 
{
	let result = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    return result;
}




