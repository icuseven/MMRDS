function jurisdiction_render(p_data)
{
	var result = [];

	if( p_data._id)
	{
		result.push("<li id='" + p_data._id.replace("/","_") + "'>");
		result.push(p_data.name);
		result.push("&nbsp;");
		result.push("<input id='add_child_of_" + p_data._id.replace("/","_") + "' />&nbsp;<input type='button' value='add' onclick='jurisdiction_add_child_click(\"" + p_data._id + "\", document.getElementById(\"add_child_of_" + p_data._id.replace("/","_") + "\").value, \"" + $mmria.getCookie("uid") + "\")' />");
	
		
	}
	else
	{
		result.push("<li id='" + p_data.id.replace("/","_") + "'>");
		result.push(p_data.name);
		result.push("&nbsp;");
		result.push("<input id='add_child_of_" + p_data.id.replace("/","_") + "' />&nbsp;<input type='button' value='add' onclick='jurisdiction_add_child_click(\"" + p_data.id + "\", document.getElementById(\"add_child_of_" + p_data.id.replace("/","_") + "\").value, \"" + $mmria.getCookie("uid") + "\")' />&nbsp;<input type='button' value='delete' onclick='jurisdiction_remove_child_click(\"" + p_data.parent_id + "\", \"" + p_data.id + "\", \"" + $mmria.getCookie("uid") + "\")' />");
		
	}

	if(p_data.children != null)
	{
		for(var i = 0; i < p_data.children.length; i++)
		{
			result.push("<ul>");
			var child = p_data.children[i];
			Array.prototype.push.apply(result, jurisdiction_render(child));
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