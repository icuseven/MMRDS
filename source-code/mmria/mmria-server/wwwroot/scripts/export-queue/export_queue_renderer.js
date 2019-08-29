function export_queue_render(p_queue_data)
{
	var result = [];


result.push("1.  Would you like to export all data or only core data? ");

result.push("<input type='radio' name='one' value='all' onclick='one_click(this.value)'");
if(answer_summary[0] == 'all')
{
result.push(" checked='true' /> all ");
}
else
{
	result.push(" /> all ");
}
result.push("<input type='radio' name='one' value='core'onclick=' one_click(this.value)'");
if(answer_summary[0] == 'core')
{
result.push(" checked='true' /> core ");
}
else
{
	result.push(" /> core ");
}
result.push("<br/>");


 result.push("2. Would you like to encrypt the file? ");
result.push("<input type='radio' name='two' value='csv'  two_click(this.value)' ");
if(answer_summary[1] == 'csv')
{
result.push(" checked='true' /> csv ");
}
else
{
	result.push(" /> csv ");
}
result.push("<input type='radio' name='two' value='json' two_click(this.value)' ");
if(answer_summary[1] == 'json')
{
result.push(" checked='true' /> json ");
}
else
{
	result.push(" /> json ");
}
result.push("<input type='radio' name='two' value='url'  onclick='two_click(this.value)'");
if(answer_summary[1] == 'url')
{
result.push(" checked='true' /> url ");
}
else
{
	result.push(" /> url ");
}
result.push("<input type='text' value='");
result.push(answer_summary[3])
result.push("' />");

result.push("<br/>");
result.push("3. What fields do you want to de-identify? ");
result.push("<input type='radio' name='three' value='none' ");
if(answer_summary[2] == 'none')
{
result.push(" checked='true' /> none ");
}
else
{
	result.push(" /> none ");
}
result.push("<input type='radio' name='three' value='standard' ");
if(answer_summary[2] == 'standard')
{
result.push(" checked='true' /> standard ");
}
else
{
	result.push(" /> standard ");
}
result.push("<input type='radio' name='three' value='custom' ");
if(answer_summary[2] == 'custom')
{
result.push(" checked='true' /> custom ");
}
else
{
	result.push(" /> custom ");
}
result.push("<a onclick='custom_field_click()'>[ select custom fields ]</a> <br/>");

result.push("<br/>");


result.push("4. What filters do you want to apply? (Add filter to export by day, month, year of death)");
result.push("<ul>");

result.push("<li>1. Filter by date, year of death, etc (already have this in MMRIA)</li>");
result.push("<li>2. Filter by Status (reviewed)</li>");
result.push("<li>3. Filter by Case</li>");
result.push("<li>* Add filter to exclude PII tagged fields</li>");
result.push("<li>* Add filter to include PII tagged fields and any data in the field</li>");
result.push("</ul>");


result.push("5. What export name do you want to add? <input type='text' value=''/><br/>");
result.push("6. What export name do you want to add? <input type='text' value=''/>");

result.push("<br/>");
result.push("<div id='answer_summary'>");
result.push("You choose to: ");
result.push("You selected to export " + answer_summary[0] + " data.");
result.push("You selected export format of " + answer_summary[1]);
result.push("You selected to de-identifiey " +  answer_summary[2] + " fields");
result.push("<br/>");
result.push("</div>");
//result.push("<input type='button' value='confirm' /> | ");
result.push("<input type='button' value='confirm' />");





	result.push('<div class="content-intro">');
		result.push('<h1 class="h2 mb-0">Submit Export Data Request</h1>');
	result.push('</div> <!-- end .content-intro -->');

	result.push('<p>Click on Export Core Data to CSV format to produce a zip file that contains your core data export plus a data dictionary. The zip file will be downloaded directly to the “Downloads” folder in the local environment of your computer.</p>');
	result.push('<p class="mb-0"><strong>Contains 2 Files:</strong></p>');
	result.push('<ul>');
		result.push('<li>core_export.csv</li>');
		result.push('<li>data-dictionary.csv</li>');
	result.push('</ul>');
	result.push('<button type="button" class="btn btn-secondary mb-2" onclick="add_new_core_export_item()">Export Core Data to CSV format</button>');
	result.push('<p>Details of the data dictionary format can be found here: <a target="_data_dictionary" href="/data-dictionary">data-dictionary-format</a></p>');
	
	result.push('<hr />');


	

	result.push('<p>Click on Export All Data to CSV format to produce a zip file that contains 59 case data files plus a data dictionary. The zip file will be downloaded directly to the “Downloads” folder in the local environment of your computer.</p>');
	result.push('<p class="mb-0"><strong>Contains a total of 60 files:</strong></p>');
	result.push('<ul>');
		result.push('<li>59 *.csv</li>');
		result.push('<li>data-dictionary.csv</li>');
	result.push('</ul>');
	result.push('<button type="button" class="btn btn-secondary mb-2" onclick="add_new_all_export_item()">Export All Data to  CSV format</button>');
	result.push('<p>Details of the data dictionary format can be found here: <a target="_data_dictionary" href="/data-dictionary">data-dictionary-format</a></p>');

	// result.push("<ul>");
	// 	result.push("<li><input type='button' value='Export Core Data to CSV format.' onclick='add_new_core_export_item()'/>");
	// 	result.push("<br/>Click on Export Core Data to CSV format to produce a zip file that contains your core data export plus a data dictionary. The zip file will be downloaded directly to the “Downloads” folder in the local environment of your computer.<br/>Contains 2 Files<ul><li>core_export.csv</li><li>data-dictionary.csv <p>Details of the data dictionary format can be found here: <a target='_data_dictionary' href='/data-dictionary'>data-dictionary-format</a></p></li></ul></li>");
	// 	result.push("<li><input type='button' value='Export All Data to  CSV format.' onclick='add_new_all_export_item()'/>");
	// 	result.push("<br/>Click on Export All Data to CSV format to produce a zip file that contains 59 case data files plus a data dictionary. The zip file will be downloaded directly to the “Downloads” folder in the local environment of your computer.<br/>Contains a total of 60 files:<ul><li>59 *.csv</li><li>data-dictionary.csv <p>Details of the data dictionary format can be found here: <a target='_data_dictionary' href='/data-dictionary'>data-dictionary-format</a></p></li></ul></li>");
	// 	//result.push("<li><input type='button' value='Export All Data to  Deidentified CDC CSV format.' onclick='add_new_cdc_export_item()'/></li>");
	// 	//result.push("<li><input type='button' value='All Data to MMRIA JSON format.' onclick='add_new_json_export_item()'/></li>");
	// result.push("</ul>");

	result.push('<table class="table">');
		result.push('<thead class="thead">');
			result.push('<tr class="tr bg-tertiary"><th class="th h4" colspan="8">Export Request History</th></tr>');
			result.push('<tr class="tr bg-quaternary"><th class="th" colspan="8">(*Please note that the export queue is deleted at midnight each day.)</th></tr>');
			result.push('<tr class="tr">');
				result.push('<th class="th">date_created</th>');
				result.push('<th class="th">created_by</th>');
				result.push('<th class="th">date_last_updated</th>');
				result.push('<th class="th">last_updated_by</th>');
				result.push('<th class="th">file_name</th>');
				result.push('<th class="th">export_type</th>');
				result.push('<th class="th">status</th>');
				result.push('<th class="th">action</th>');
			result.push('</tr>');
		result.push('</thead>');
		result.push('<tbody class="tbody">');
			// result.push("<table><hr/>");
			// result.push("<tr><th colspan='8' bgcolor='#CCCCCC'>Export Request History</th></tr>");
			// result.push("<tr><th colspan='8' bgcolor='#DDDDAA'>(*Please note that the export queue is deleted at midnight each day.)</th></tr>");
			// result.push("<tr bgcolor='#DDDDDD'><th>date_created</th><th>created_by</th><th>date_last_updated</th><th>last_updated_by</th><th>file_name</th><th>export_type</th><th>status</th><th>action</th></tr>");

			for(var i = 0; i < p_queue_data.length; i++)
			{
				var item = p_queue_data[i];
				console.log(item);

				// if(i % 2 == 0)
				// {
				// 	result.push("<tr>");
				// }
				// else
				// {
				// 	result.push("<tr bgcolor='#EEEEEE'>");
				// }
				
				result.push('<tr class="tr">');
					result.push(`<td class="td">${item.date_created}</td>`);
					result.push(`<td class="td">${item.created_by}</td>`);
					result.push(`<td class="td">${item.date_last_updated}</td>`);
					result.push(`<td class="td">${item.last_updated_by}</td>`);
					result.push(`<td class="td">${item.file_name}</td>`);
					result.push(`<td class="td">${item.export_type}</td>`);
					result.push(`<td class="td">${item.status}</td>`);

					if(item.status == "Confirmation Required")
					{
						result.push(`<td class="td"><input type='button' value='Confirm' onclick='confirm_export_item(\"" ${item._id} "\")' /> | <input type='button' value='Cancel' onclick='cancel_export_item(\"" ${item._id} "\")' /></td>`);
					}
					else if(item.status == "Download")
					{
						result.push(`<td class="td"><input type='button' value='Download' onclick='download_export_item(\"" ${item._id} "\")' /></td>`);
					}
					else if(item.status == "Downloaded")
					{
						result.push(`<td class="td"><input type='button' value='Download' onclick='download_export_item(\"" ${item._id} "\")' /> | <input type='button' value='Delete' onclick='delete_export_item(\"" + ${item._id} "\")' /></td>`);
					}
					else 
					{
						result.push("<td>&nbsp;</td>");	
					}
				result.push("</tr>")
			}

		result.push("</tbody>");
	result.push("</table>");

	return result;
}