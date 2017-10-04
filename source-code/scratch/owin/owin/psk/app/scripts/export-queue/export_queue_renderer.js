function export_queue_render(p_queue_data)
{
	var result = [];


	result.push("<h3>Submit Export Data Request</h3>");
	result.push("<ul>");
	result.push("<li><input type='button' value='Export Core Data to CSV format.' onclick='add_new_core_export_item()'/></li>");
	result.push("<li><input type='button' value='Export All Data to  CSV format.' onclick='add_new_all_export_item()'/></li>");
	//result.push("<li><input type='button' value='Export All Data to  Deidentified CDC CSV format.' onclick='add_new_cdc_export_item()'/></li>");
	//result.push("<li><input type='button' value='All Data to MMRIA JSON format.' onclick='add_new_json_export_item()'/></li>");
	result.push("</ul>");

	result.push("<table><hr/>");
	result.push("<tr><th colspan='8' bgcolor='#CCCCCC'>Export Request History</th></tr>");
	result.push("<tr><th colspan='8' bgcolor='#DDDDAA'>(*Please note that the export queue is deleted at midnight each day.)</th></tr>");
	result.push("<tr bgcolor='#DDDDDD'><th>date_created</th><th>created_by</th><th>date_last_updated</th><th>last_updated_by</th><th>file_name</th><th>export_type</th><th>status</th><th>&nbsp;</th></tr>");

	for(var i = 0; i < p_queue_data.length; i++)
	{
		var item = p_queue_data[i];

		if(i % 2 == 0)
		{
			result.push("<tr>");
		}
		else
		{
			result.push("<tr bgcolor='#EEEEEE'>");
		}
		result.push("<td>");
		result.push(item.date_created); result.push("</td><td>");
		result.push(item.created_by); result.push("</td><td>");
		result.push(item.date_last_updated); result.push("</td><td>");
		result.push(item.last_updated_by); result.push("</td><td>");
		result.push(item.file_name); result.push("</td><td>");
		result.push(item.export_type); result.push("</td><td>");
		result.push(item.status); result.push("</td>");

		if(item.status == "Confirmation Required")
		{
			result.push("<td><input type='button' value='Confirm' onclick='confirm_export_item(\"" + item._id + "\")' /> | <input type='button' value='Cancel' onclick='cancel_export_item(\"" + item._id + "\")' /></td>");
		}
		else if(item.status == "Download")
		{
			result.push("<td><input type='button' value='Download' onclick='download_export_item(\"" + item._id + "\")' /></td>");
		}
		else if(item.status == "Downloaded")
		{
			result.push("<td><input type='button' value='Download' onclick='download_export_item(\"" + item._id + "\")' /> | <input type='button' value='Delete' onclick='delete_export_item(\"" + item._id + "\")' /></td>");
		}
		else 
		{
			result.push("<td>&nbsp;</td>");	
		}
		result.push("</tr>")
	}


	result.push("</table>");

	return result;
}