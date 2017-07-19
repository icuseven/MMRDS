function export_queue_render(p_queue_data)
{
	var result = [];


	result.push("<h3>Submit Export Data Request</h3>");
	result.push("<ul>");
	result.push("<li><input type='button' value='Export Core Data to CSV format.' /></li>");
	result.push("<li><input type='button' value='Export All Data to  CSV format.' /></li>");
	result.push("<li><input type='button' value='All Data to MMRIA JSON format.' /></li>");
	result.push("</ul>");

	result.push("<table><hr/>");
	result.push("<tr><th colspan='7' bgcolor='#CCCCCC'>Export Request History</th></tr>");
	result.push("<tr bgcolor='#DDDDDD'><th>date_created</th><th>created_by</th><th>date_last_updated</th><th>last_updated_by</th><th>file_name</th><th>export_type</th><th>status</th></tr>");

	for(var i = 0; i < p_queue_data.length; i++)
	{
		var item = p_queue_data[i];

		if(i % 2 == 0)
		{
			result.push("<tr><td>");
		}
		else
		{
			result.push("<tr bgcolor='#EEEEEE'><td>");
		}
		result.push(item.date_created); result.push("</td><td>");
		result.push(item.created_by); result.push("</td><td>");
		result.push(item.date_last_updated); result.push("</td><td>");
		result.push(item.last_updated_by); result.push("</td><td>");
		result.push(item.file_name); result.push("</td><td>");
		result.push(item.export_type); result.push("</td><td>");
		result.push(item.status);
		result.push("</td></tr>");	
	}


	result.push("</table>");

	return result;
}