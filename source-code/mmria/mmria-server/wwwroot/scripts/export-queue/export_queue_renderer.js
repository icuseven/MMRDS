function renderSummaryString(event, callback) {
	console.log('First start');
	let el = event.target;
	let val = el.value;
	let summary = el.dataset.summaryType;
	let tar = document.querySelector(`#${summary}`);
	console.log(el.dataset);

	if (answer_summary[summary] != summary) {
		answer_summary[summary] = val;
		callback(val, summary);
		tar.innerText = val;
	}

	console.log('First end');
}

function updateAnswerSummary(val, type) {
	console.log('Second start');
	// if data-type changed`
	if (answer_summary[type] != type) {
		answer_summary[type] = val;
	}
	console.log('Second end');
}

class DropDown {
	constructor(type) {
		this.type = type;
		this.iterator = 1;
		this.condition = 1;
		this.opts = '<option value=""></option>'; // options should be empty my default
	}

	buildDropdown() {
		// based on case type, we change iterator and/or condition
		switch (this.type) {
			case "y":
				this.iterator = new Date().getFullYear() - 119;
				this.condition = new Date().getFullYear();
				break;
			case "m":
				this.condition = 12;
				break;
			case "d":
				this.condition = 31;
				break;
		}

		// iterate through iterator and condition to build the options
		for (let i = this.iterator; i <= this.condition; i++) {
			this.opts += `<option value='${i}'>`;
			this.opts += i;
			this.opts += "</option>";
		}
		return this.opts;
	}
}






function export_queue_render(p_queue_data)
{
	var result = [];

	result.push(`
		<div class="row">
			<div class="col-3 fancy-sidebar">
				<div class="card">
					<div class="card-header bg-gray-l3">
					<h2 class="h5 font-weight-bold">Summary of your Export Data choices</h2>
					</div>
					<div class="card-body bg-gray-l3">
					<ul>
						<li>
							Export <span id="all_or_core">${answer_summary.all_or_core == 'all' ? 'All' : 'Core'}</span> data
						</li>
						<li>
							Export/Grantee name: <code>${answer_summary.grantee_name}</code>
						</li>
						<!-- <li>You have selected to export in JSON format</li> -->
						<li>
							Password protected: <span id="is_encrypted">${answer_summary.is_encrypted == 'no' ? 'No' : 'Yes'}</span>
						</li>
						<li>
							Send file to CDC: <span id="is_for_cdc">${answer_summary.is_for_cdc == 'no' ? 'No' : 'Yes'}</span>
						</li>
						<li>
							De-identify fields: <span id="de_identified_selection_type">${answer_summary.de_identified_selection_type}</span>
						</li>
					</ul>
					</div>
					<div class="card-footer bg-gray-l3">
						<button class="btn btn-secondary w-100">Confirm & Start Export</button>
					</div>
				</div>
			</div>

			<div class="col-9">
				<ol class="font-weight-bold">
					<li class="form-group">
						<p class="mb-2">Export all data or only core data?</p>
						<ul class="font-weight-normal list-unstyled" style="padding-left: 0px;">
							<li>
								<input name="export-type" id="all-data" class="mr-1" data-summary-type="all_or_core" type="radio" value="all" checked onchange="renderSummaryString(event, updateAnswerSummary)" />
								<label for="all-data" class="mb-0">All</label>
							</li>
							<li>
								<input name="export-type" id="core-data" class="mr-1" data-summary-type="all_or_core" type="radio" value="core" onchange="renderSummaryString(event, updateAnswerSummary)" />
								<label for="core-data" class="mb-0">Core</label>
							</li>
						</ul>
					</li>

					<li class="form-group">
						<label for="grantee-name" class="mb-2">What export or grantee name do you want to add to each case?</label>
						<input id="grantee-name" class="form-control w-auto" type="text" value="${answer_summary.grantee_name}" disabled readonly="true" />
					</li>

					<li class="form-group">
						<p class="mb-2">Would you like to password protect the file?</p>
						<ul class="font-weight-normal list-unstyled" style="padding-left: 0px;">
							<li>
								<input name="password-protect" id="password-protect-no" class="mr-1" data-summary-type="is_encrypted" type="radio" value="no" checked onchange="renderSummaryString(event, updateAnswerSummary)" />
								<label for="password-protect-no" class="mb-0">No</label>
							</li>
							<li>
								<input name="password-protect" id="password-protect-yes" class="mr-1" data-summary-type="is_encrypted" type="radio" value="yes" onchange="renderSummaryString(event, updateAnswerSummary)" />
								<label for="password-protect-yes" class="mb-0">Yes</label>
								<div class="mt-2">
									<label for="encryption-key" class="mb-2">Add encryption key</label>
									<!-- TODO: Add logic to show dynamically input if user selects corresponding control -->
									<input id="encryption-key" class="form-control w-auto" type="text" value="${answer_summary.encryption_key}" />
								</div>
							</li>
						</ul>
					</li>

					<li class="form-group">
						<p class="mb-2">Are you sending this file to CDC?</p>
						<ul class="font-weight-normal list-unstyled" style="padding-left: 0px;">
							<li>
								<input name="cdc" id="cdc-no" class="mr-1" data-summary-type="is_for_cdc" type="radio" value="no" checked onchange="renderSummaryString(event, updateAnswerSummary)" />
								<label for="cdc-no" class="mb-0">No</label>
							</li>
							<li>
								<input name="cdc" id="cdc-yes" class="mr-1" data-summary-type="is_for_cdc" type="radio" value="yes" onchange="renderSummaryString(event, updateAnswerSummary)" />
								<label for="cdc-yes" class="mb-0">Yes <small><em>(If Yes, your file will be password encrypted using a CDC keyion key)</em></small></label>
							</li>
						</ul>
					</li>
						
					<li class="form-group">
						<p class="mb-2">What fields do you want to de-identify?</p>
						<ul class="font-weight-normal list-unstyled" style="padding-left: 0px;">
							<li>
								<input name="de-identify" id="de-identify-none" class="mr-1" data-summary-type="de_identified_selection_type" type="radio" value="none" checked onchange="renderSummaryString(event, updateAnswerSummary)" /> 
								<label for="de-identify-none" class="mb-0">None</label>
							</li>
							<li>
								<input name="de-identify" id="de-identify-standard" class="mr-1" data-summary-type="de_identified_selection_type" type="radio" value="standard" onchange="renderSummaryString(event, updateAnswerSummary)" />
								<label for="de-identify-standard" class="mb-0">Standard</label>
							</li>
							<li>
								<input name="de-identify" id="de-identify-custom" class="mr-1" data-summary-type="de_identified_selection_type" type="radio" value="custom" onchange="renderSummaryString(event, updateAnswerSummary)" />
								<label for="de-identify-custom" class="mb-0">Custom</label>
								<!-- TODO: Add logic to show dynamically input if user selects corresponding control -->
								<div class="mt-2">
									<button class="btn btn-tertiary">Select custom fields</button>
								</div>
							</li>
						</ul>
					</li>

						<li class="form-group">
							<p class="mb-2">What filters do you want to apply? (Add filter to export by day, month, year of death)</p>
							<ul class="font-weight-bold list-unstyled">
							<li class="form-group">
							<p class="mb-2 font-weight-bold">Date of death:</p>
							<ul class="font-weight-normal row list-unstyled pl-3">
							<li class="mr-2">
							<label for="dod-year" class="mb-2">Year</label>
							<select id="dod-year" class="form-control w-auto">
								${ new DropDown('y').buildDropdown() }
							</select>
							</li>
							<li class="mr-2">
							<label for="dod-month" class="mb-2">Month</label>
							<select id="dod-month" class="form-control w-auto">
								${ new DropDown("m").buildDropdown() }
							</select>
							</li>
							<li class="mr-2">
							<label for="dod-day" class="mb-2">Day</label>
							<select id="dod-day" class="form-control w-auto">
								${ new DropDown("d").buildDropdown() }
							</select>
							</li>
							</ul>
							</li>
							<li class="form-group">
							<label for="case-status-year" class="mb-2">Case status year</label>
							<select id="case-status-year" class="form-control w-auto">
								${ new DropDown("y").buildDropdown() }
							</select>
							</li>
							<li class="form-group">
							<label for="case-jurisdiction-year" class="mb-2">Case Jurisdiction year</label>
							<select id="case-jurisdiction-year" class="form-control w-auto">
								${ new DropDown("y").buildDropdown() }
							</select>
							</li>
							<!-- TODO: Remove completely once we narrow down direction more -->
							<!--<li class="form-group">
							<label class="mb-2">Filter by Case</label>
							<p class="font-weight-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porttitor tempus purus, mattis pretium nunc condimentum et. Vestibulum id sapien elementum eros consequat convallis quis ut augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed semper dui dolor, vitae varius ipsum consequat vel. Quisque nec ex nec mauris blandit sollicitudin eu quis orci. Etiam scelerisque dui et neque gravida, eu molestie sem bibendum. Donec non arcu est. Nulla luctus quam vel condimentum fermentum. Donec eu accumsan tellus.</p>
							</li>-->
							<li class="form-group">
							<p class="mb-2 font-weight-bold">Personally Identifiable Information (PII):</p>
							<ul class="font-weight-normal list-unstyled">
							<li>
							<input name="pii" id="pii-exclude" class="mr-1" type="checkbox" value="exclude" />
							<label for="pii-exclude" class="mb-0">Exclude PII tagged fields</label>
							</li>
							<li>
							<input name="pii" id="pii-include" class="mr-1" type="checkbox" value="include" />
							<label for="pii-include" class="mb-0">Include PII tagged fields and any data in the field</label>
							</li>
							</ul>
							</li>
						</ul>
					</li>
				</ol>
			</div>
		</div>
	`);

	result.push("<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />");


	result.push("<h3>Make your export choices:</h3>")
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

	result.push("2. What export/grantee name do you want to add to each case? <input type='text' value=''/><br/>");

	result.push("3. Would you like to password protect the file? ");
	result.push("<input type='radio' name='two' value='no'  two_click(this.value)' ");
	if(answer_summary[1] == 'no')
	{
	result.push(" checked='true' /> no ");
	}
	else
	{
		result.push(" /> no ");
	}
	result.push("<input type='radio' name='two' value='yes' two_click(this.value)' ");
	if(answer_summary[1] == 'yes')
	{
	result.push(" checked='true' /> yes ");
	}
	else
	{
		result.push(" /> yes ");
	}
	result.push(" encryption key: <input type='text' value='");
	result.push(answer_summary[3])
	result.push("' />");

	result.push("<br/>");


	result.push("4. Are you sending this file to CDC? ");
	result.push("<input type='radio' name='two' value='no'  two_click(this.value)' ");
	if(answer_summary[1] == 'no')
	{
	result.push(" checked='true' /> no ");
	}
	else
	{
		result.push(" /> no ");
	}
	result.push("<input type='radio' name='two' value='yes' two_click(this.value)' ");
	if(answer_summary[1] == 'yes')
	{
	result.push(" checked='true' /> yes ");
	}
	else
	{
		result.push(" /> yes ");
	}
	result.push("<- if yes your file will be password encrypted using a CDC keyion key.");

	result.push("<br/>");
	result.push("5. What fields do you want to de-identify? ");
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


	result.push("6. What filters do you want to apply? (Add filter to export by day, month, year of death)");
	result.push("<ul>");

	result.push("<li>Date of death: <ul><li>year  <select><option>Any</option></select></li><li>month year <select><option>Any</option></select></li><li> day year <select><option>Any</option></select></li></ul></li>");
	result.push("<li>Case Status year <select><option>Any</option></select></li>");
	result.push("<li>Case jurisdiction year <select><option>All</option></select></li>");
	result.push("<li>Filter by Case</li>");
	result.push("<li><input type='checkbox' value=''/> exclude PII tagged fields </li>");
	result.push("<li><input type='checkbox' value=''/> include PII tagged fields and any data in the field </li>");
	result.push("</ul>");





	result.push("<br/>");
	result.push("<hr/><h3>Summary of your choices:</h3>");
	result.push("<div id='answer_summary'>");
	result.push("You choose to: ");
	result.push("You selected to export " + answer_summary[0] + " data.");
	result.push("You selected export format of " + answer_summary[1]);
	result.push("You selected to de-identifiey " +  answer_summary[2] + " fields");
	result.push("<br/>");
	result.push("</div>");
	//result.push("<input type='button' value='confirm' /> | ");
	result.push("<input type='button' value='confirm and start export' />");


	result.push("<hr/>");



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
				//console.log(item);

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
						result.push(`<td class="td"><input type='button' value='Confirm' onclick='confirm_export_item("${item._id}")' /> | <input type='button' value='Cancel' onclick='cancel_export_item("${item._id}")' /></td>`);
					}
					else if(item.status == "Download")
					{
						result.push(`<td class="td"><input type='button' value='Download' onclick='download_export_item("${item._id}")' /></td>`);
					}
					else if(item.status == "Downloaded")
					{
						result.push(`<td class="td"><input type='button' value='Download' onclick='download_export_item("${item._id}")' /> | <input type='button' value='Delete' onclick='delete_export_item("${item._id}")' /></td>`);
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