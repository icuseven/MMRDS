/*
function jurisdiction_tree_render(p_tree_root)
{
	var result = [];

	result.push("<li id='" + p_tree_root._id.replace("/","_") + "'>");


	result.push("name:&nbsp;");
	result.push(p_tree_root.name);
	result.push("&nbsp;");
	result.push("<input id='add_child_of_jurisdiction_root' />&nbsp;<input type='button' value='+' onclick='add_child_click(\"jurisdiction_tree\", document.getElementById(\"add_child_of_jurisdiction_root\").value, \"" + $mmria.getCookie("uid") + "\")' />");
	result.push("</li>")
	
	if(p_tree_root.children != null)
	{
		for(var i = 0; i < p_tree_root.children.length; i++)
		{
			result.push("</li>")
			result.push("<ul>");
			var child = p_tree_root.children[i];
			Array.prototype.push.apply(result, jurisdiction_render(p_tree_root.name, child));
			result.push("</ul>");
			result.push("</li>");
		}
	}
	


	return result;

}

*/

function jurisdiction_render(p_parent_id, p_data)
{
	var result = [];

	if( p_data._id)
	{
		result.push("<li id='" + p_data._id.replace("/","_") + "'>");
		result.push(p_data.name);
		result.push("&nbsp;");
		result.push("<input id='add_child_of_" + p_data._id.replace("/","_") + "' />&nbsp;<input type='button' value='+' onclick='add_child_click(\"" + p_data._id + "\", document.getElementById(\"add_child_of_" + p_data._id.replace("/","_") + "\").value, \"" + $mmria.getCookie("uid") + "\")' />");
	
		
	}
	else
	{
		result.push("<li id='" + p_data.id.replace("/","_") + "'>");
		result.push(p_data.name);
		result.push("&nbsp;");
		result.push("<input id='add_child_of_" + p_data.id.replace("/","_") + "' />&nbsp;<input type='button' value='+' onclick='add_child_click(\"" + p_data.id + "\", document.getElementById(\"add_child_of_" + p_data.id.replace("/","_") + "\").value, \"" + $mmria.getCookie("uid") + "\")' />");
		
	}

	if(p_data.children != null)
	{
		for(var i = 0; i < p_data.children.length; i++)
		{
			result.push("<ul>");
			var child = p_data.children[i];
			if( p_data._id)
			{
				Array.prototype.push.apply(result, jurisdiction_render(p_data._id, child));
			}
			else
			{
				Array.prototype.push.apply(result, jurisdiction_render(p_data.id, child));
			}
			result.push("</ul>");
			
		}
	}
	result.push("</li>");
	




	return result;

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