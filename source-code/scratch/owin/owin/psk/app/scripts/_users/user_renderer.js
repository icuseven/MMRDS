function user_render(p_ui, p_data, p_metadata_path, p_object_path, p_is_grid_context)
{

	var result = [];

	result.push("<table border=1><tr><th colspan=2>user list</th></tr>");
	
	for(var i = 0; i < p_ui.user_summary_list.length; i++)
	{
		var item = p_ui.user_summary_list[i];
		result.push("<tr><td>");

		result.push(item.id);
		result.push("</td><td>");
		result.push(item.key);
		result.push("</td><tr>");
	}
	result.push("</table>");


	return result;

}
