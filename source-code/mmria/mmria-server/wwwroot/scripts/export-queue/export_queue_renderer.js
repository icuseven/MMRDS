
function export_queue_render(p_queue_data, p_answer_summary, p_filter)
{
	var result = [];

	let de_identified_search_result = [];
	render_de_identified_search_result(de_identified_search_result, p_answer_summary, p_filter);

	let selected_de_identified_list = [];
	render_selected_de_identified_list(selected_de_identified_list, p_answer_summary)
	
	let selected_case_list = [];
	render_selected_case_list(selected_case_list, p_answer_summary)

	let pagination_html = [];
	render_pagination(pagination_html, g_case_view_request);
	

	let filter_decending = "";

	if(g_case_view_request.descending)
	{
		filter_decending = "checked=true";
	}
	result.push(`
		<div class="row">
			<div class="col">
				<ol class="font-weight-bold pl-3">
					<li class="mb-4">
						<label for="grantee-name" class="mb-3">The grantee name that will be added to each exported case is:</label>
						<input id="grantee-name"
							 class="form-control w-auto"
							 type="text"
							 value="${p_answer_summary.grantee_name}"
							 disabled
							 readonly="true" />
					</li>				
					<li class="mb-4">
						<p class="mb-3">Do you want to export <u>all data</u> or only <u>core data</u>? <small class="d-block mt-1">The zip file will be downloaded directly to the “Downloads” folder in the local environment of your computer.</small></p>
						<input name="export-type"
											 id="all-data"
											 type="radio"
											 value="all"
											 data-prop="all_or_core"
											 ${ p_answer_summary['all_or_core'] == 'all' ? 'checked=true' : '' }
											 onchange="setAnswerSummary(event).then(renderSummarySection(this))" />
						<label for="all-data" class="mb-0 font-weight-normal mr-2">All</label>
						<input name="export-type"
											 id="core-data"
											 type="radio"
											 value="core"
											 data-prop="all_or_core"
											 ${ p_answer_summary['all_or_core'] == 'core' ? 'checked=true' : '' }
											 onchange="setAnswerSummary(event).then(renderSummarySection(this))" />
						<label for="core-data" class="mb-0 font-weight-normal">Core</label>
					</li>

					<li class="mb-4">
						<p class="mb-3">Would you like to password protect the file?</p>
						<input name="password-protect"
											 id="password-protect-no"
											 type="radio"
											 value="no"
											 data-prop="is_encrypted"
											 ${ p_answer_summary['is_encrypted'] == 'no' ? 'checked=true' : '' }
											 onchange="setAnswerSummary(event).then(handleElementDisplay(event, 'none')).then(renderSummarySection(this))" />
						<label for="password-protect-no" class="mb-0 font-weight-normal mr-2">No</label>
						<input name="password-protect"
											 id="password-protect-yes"
											 type="radio"
											 value="yes"
											 data-prop="is_encrypted"
											 ${ p_answer_summary['is_encrypted'] == 'yes' ? 'checked' : '' }
											 onchange="setAnswerSummary(event).then(handleElementDisplay(event, 'block')).then(renderSummarySection(this))" />
						<label for="password-protect-yes" class="mb-0 font-weight-normal">Yes</label>
						<div class="mt-2" data-show="is_encrypted"  style="display: ${ p_answer_summary['is_encrypted'] == 'yes' ? 'block' : 'none' };">
							<label for="encryption-key" class="mb-2">Add encryption key</label>
							<input id="encryption-key"
										 class="form-control w-auto"
										 type="text"
										 value="${p_answer_summary.encryption_key}" onchange="encryption_key_changed(this.value)" />
						</div>
					</li>

					<li class="mb-4">
						<p class="mb-3">What fields do you want to de-identify?</p>
						<input name="de-identify"
											 id="de-identify-none"
											 type="radio"
											 value="none"
											 data-prop="de_identified_selection_type"
											 ${ p_answer_summary.de_identified_selection_type == 'none' ? 'checked=true' : '' }
											 onchange="de_identify_filter_type_click(this).then(renderSummarySection(this))" /> 
						<label for="de-identify-none" class="mb-0 font-weight-normal mr-2">None</label>
						<input name="de-identify"
											 id="de-identify-standard"
											 type="radio"
											 value="standard"
											 data-prop="de_identified_selection_type"
											 ${ p_answer_summary.de_identified_selection_type == 'standard' ? 'checked=true' : '' }
											 onchange="de_identify_filter_type_click(this).then(renderSummarySection(this))" />
						<label for="de-identify-standard" class="mb-0 font-weight-normal mr-2">Standard</label>
						<input name="de-identify"
											 id="de-identify-custom"
											 type="radio"
											 value="custom"
											 data-prop="de_identified_selection_type"
											 ${ p_answer_summary.de_identified_selection_type == 'custom' ? 'checked=true' : '' }
											 onchange="de_identify_filter_type_click(this).then(renderSummarySection(this))" />
						<label for="de-identify-custom" class="mb-0 font-weight-normal">Custom</label>
						<div id="de_identify_filter_standard" class="p-3 mt-3 bg-gray-l3" data-prop="de_identified_selection_type" style="display: ${p_answer_summary.de_identified_selection_type == 'standard' ? 'block' : 'none'}; border: 1px solid #bbb;">
							<div class="" style="border: 1px solid #bbbbbb; overflow:hidden; overflow-y: auto; max-height: 346px;">
								<table class="table rounded-0 mb-0">
									<thead class="thead">
										<tr class="tr bg-tertiary">
											<th class="th" colspan="2">
												<span class="row no-gutters justify-content-between">
													<span>Standard fields that will be de-identified</span>
												</span>
											</th>
										</tr>
									</thead>
									<tbody class="tbody">
										<tr class="tr">
											<td class="td">
												<table class="table rounded-0 mb-0">
													<tbody class="tbody">
														${render_standard_de_identify_fields(g_standard_de_identified_list)}
													</tbody>
												</table>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div id="de_identify_filter" class="p-3 mt-3 bg-gray-l3" data-prop="de_identified_selection_type" style="display: ${p_answer_summary.de_identified_selection_type == 'custom' ? 'block' : 'none'}; border: 1px solid #bbb;">
							<p class="font-weight-bold">To customize, please search/choose your options below and check the resulting fields you want to de-identify from the list.</p>
							<div class="form-inline mb-2">
								<label for="de_identify_search_text" class="mr-2"> Search for:</label>
								<input type="text"
											 class="form-control mr-2"
											 id="de_identify_search_text"
											 value="" onchange="de_identify_search_text_change(this.value)"/>
								<select id="de_identify_form_filter" class="custom-select mr-2">
									${render_de_identify_form_filter(p_filter)}
								</select>
								<button type="button" class="btn btn-tertiary" alt="clear search" onclick="de_identified_search_click()">Search</button>
							</div>
							<div class="form-group form-check mb-0">
								<input type="checkbox" class="form-check-input" id="include_pii" onchange="de_identify_standard_fields_change(this.checked)" ${ p_answer_summary.is_de_identify_standard_fields == true ? 'checked=true': ''} >
								<label class="form-check-label font-weight-normal" for="include_pii">De-identify standard fields</label>
							</div>
							
							<div class="mt-3" style="border: 1px solid #bbbbbb; overflow:hidden; overflow-y: auto; max-height: 346px;">
								<table class="table rounded-0 mb-0">
									<thead class="thead">
										<tr class="tr bg-tertiary">
											<th class="th" colspan="2">
												<span class="row no-gutters justify-content-between">
													<span>Fields to de-identify</span>
												</span>
											</th>
										</tr>
									</thead>
									<tbody class="tbody" id="de_identify_search_result_list">
										${de_identified_search_result.join("")}
									</tbody>
								</table>
							</div>

							<div class="mt-3" style="border: 1px solid #bbbbbb; overflow:hidden; overflow-y: auto; max-height: 346px;">
								<table class="table rounded-0 mb-0">
									<thead class="thead">
										<tr class="tr bg-tertiary">
											<th class="th" colspan="2">
												<span class="row no-gutters justify-content-between">
													<span id="de_identified_count">Fields that have been de-identified (${p_answer_summary.de_identified_field_set.length})</span>
												</span>
											</th>
										</tr>
									</thead>
									<tbody class="tbody" id="selected_de_identified_field_list">
										${selected_de_identified_list.join("")}
									</tbody>
								</table>
							</div>
						</div>
					</li>

					<li class="mb-4">
						<p class="mb-3">Please select which cases you want to include in the export?</p>
						<label for="case_filter_type_all" class="font-weight-normal mr-2">
							<input id="case_filter_type_all"
										 type="radio"
										 name="case_filter_type"
										 value="all"
										 data-prop="case_filter_type"
										 ${ p_answer_summary['case_filter_type'] == 'all' ? 'checked=true' : '' }
										 onclick="case_filter_type_click(this)" /> All
						</label>
						<label for="case_filter_type_custom" class="font-weight-normal">
							<input id="case_filter_type_custom"
										 type="radio"
										 name="case_filter_type"
										 value="custom"
										 data-prop="case_filter_type"
										 ${ p_answer_summary['case_filter_type'] == 'custom' ? 'checked=true' : '' }
										 onclick="case_filter_type_click(this)" /> Custom
						</label>
						<ul class="font-weight-bold list-unstyled mt-3" id="custom_case_filter" style="display:${ p_answer_summary['case_filter_type'] == 'custom' ? 'block' : 'none' }">
							<li class="mb-4" >
								<div class="form-inline mb-2">
									<label for="filter_search_text" class="font-weight-normal mr-2">Search for:</label>
									<input type="text"
												 class="form-control mr-2"
												 id="filter_search_text"
												 value=""
												 onchange="filter_serach_text_change(this.value)">
									<button type="button" class="btn btn-secondary" alt="search" onclick="apply_filter_button_click()">Apply Filters</button>
								</div>

								<div class="form-inline mb-2">
									<label for="filter_sort_by" class="font-weight-normal mr-2">Sort by:</label>
									<select id="filter_sort_by" class="custom-select" ><option selected="">date_created</option><option>jurisdiction_id</option><option>last_name</option><option>first_name</option><option>middle_name</option><option>state_of_death</option><option>record_id</option><option>year_of_death</option><option>month_of_death</option><option>committee_review_date</option><option>agency_case_id</option><option>created_by</option><option>last_updated_by</option><option>date_last_updated</option></select>
								</div>

								<div class="form-inline mb-2">
									<label for="filter_records_perPage" class="font-weight-normal mr-2">Records per page:</label>
									<select id="filter_records_perPage" class="custom-select" ><option>25</option><option>50</option><option selected="">100</option><option>250</option><option>500</option></select>
								</div>

								<div class="form-inline mb-2">
									<label for="filter_decending" class="font-weight-normal mr-2">Descending order:</label>
									<input id="filter_decending" type="checkbox" ${filter_decending}/>
								</div>
							</li>

							<li class="mb-3" style="overflow:hidden; overflow-y: auto; height: 360px; border: 1px solid #ced4da;">
								<div id='case_result_pagination' class='table-pagination row align-items-center no-gutters pt-1 pb-1 pl-2 pr-2'>
									${pagination_html.join("")}
								</div>
								<table class="table rounded-0 m-0">
									<thead class="thead">
										<tr class="tr bg-tertiary">
											<th class="th" colspan="14">
												<span class="row no-gutters justify-content-between">
													<span>Filtered Cases</span>
													<!--button class="anti-btn" onclick="fooBarSelectAll()">Select All</button-->
												</span>
											</th>
										</tr>
									</thead>
									<thead class="thead">
										<tr class="tr">
											<th class="th" width="38"></th>
											<th class="th">Date last updated <br/>Last updated by</th>
											<th class="th">Name [Jurisdiction ID]</th>
											<th class="th">Record ID</th>
											<th class="th">Date of death</th>
											<th class="th">Committee review date</th>
											<th class="th">Agency case ID</th>
											<th class="th">Date created<br/>Created by</th>
										</tr>
									</thead>
									<tbody id="search_result_list" class="tbody">
										<!-- items get dynamically generated -->
									</tbody>
								</table>
							</li>

							<li class="" style="overflow:hidden; overflow-y: auto; height: 360px; border: 1px solid #ced4da;">
								<table class="table rounded-0 mb-0">
									<thead class="thead">
										<tr class="tr bg-tertiary">
											<th class="th" colspan="14">
												<span class="row no-gutters justify-content-between">
													<span id="exported_cases_count">Cases to be included in export (${p_answer_summary.case_set.length}):</span>
													<!--button class="anti-btn" onclick="fooBarSelectAll()">Deselect All</button-->
												</span>
											</th>
										</tr>
									</thead>
									<thead class="thead">
										<tr class="tr">
											<th class="th" width="38"></th>
											<th class="th">Date last updated <br/>Last updated by</th>
											<th class="th">Name [Jurisdiction ID]</th>
											<th class="th">Record ID</th>
											<th class="th">Date of death</th>
											<th class="th">Committee review date</th>
											<th class="th">Agency case ID</th>
											<th class="th">Date created<br/>Created by</th>
										</tr>
									</thead>
									<tbody id="selected_case_list" class="tbody">
										${selected_case_list.join("")}
									</tbody>
								</table>
							</li>
						</ul>
					</li>
				</ol>
			</div>
		</div>
	`);
/*
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

*/

	// result.push("<ul>");
	// 	result.push("<li><input type='button' value='Export Core Data to CSV format.' onclick='add_new_core_export_item()'/>");
	// 	result.push("<br/>Click on Export Core Data to CSV format to produce a zip file that contains your core data export plus a data dictionary. The zip file will be downloaded directly to the “Downloads” folder in the local environment of your computer.<br/>Contains 2 Files<ul><li>core_export.csv</li><li>data-dictionary.csv <p>Details of the data dictionary format can be found here: <a target='_data_dictionary' href='/data-dictionary'>data-dictionary-format</a></p></li></ul></li>");
	// 	result.push("<li><input type='button' value='Export All Data to  CSV format.' onclick='add_new_all_export_item()'/>");
	// 	result.push("<br/>Click on Export All Data to CSV format to produce a zip file that contains 59 case data files plus a data dictionary. The zip file will be downloaded directly to the “Downloads” folder in the local environment of your computer.<br/>Contains a total of 60 files:<ul><li>59 *.csv</li><li>data-dictionary.csv <p>Details of the data dictionary format can be found here: <a target='_data_dictionary' href='/data-dictionary'>data-dictionary-format</a></p></li></ul></li>");
	// 	//result.push("<li><input type='button' value='Export All Data to  Deidentified CDC CSV format.' onclick='add_new_cdc_export_item()'/></li>");
	// 	//result.push("<li><input type='button' value='All Data to MMRIA JSON format.' onclick='add_new_json_export_item()'/></li>");
	// result.push("</ul>");

	result.push(`
		<div class="row">
			<div class="col">
				${export_queue_comfirm_render(p_answer_summary)}
			</div>
		</div>
	`);

	result.push('<table class="table mt-4">');
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
			for(var i = 0; i < p_queue_data.length; i++)
			{
				var item = p_queue_data[i];

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

function renderSummarySection(el) {
	let val = capitalizeFirstLetter(el.value);
	let prop = el.dataset.prop;
	const props = document.querySelectorAll(`#answer-summary-card [data-prop="${prop}"]`);

	props.forEach((el) =>
	{
		el.innerText = capitalizeFirstLetter(val);
	})

	var summary_of_de_identified_fields = document.getElementById("summary_of_de_identified_fields");
	summary_of_de_identified_fields.innerHTML = render_summary_de_identified_fields(answer_summary);
	
	var summary_of_selected_cases = document.getElementById("summary_of_selected_cases");
	summary_of_selected_cases.innerHTML = render_summary_of_selected_cases(answer_summary);
}


function export_queue_comfirm_render(p_answer_summary)
{
	var result = `
		<div id="answer-summary-card" class="card">
			<div class="card-header bg-gray-l3">
				<h2 class="h5 font-weight-bold">Summary of your Export Data choices</h2>
			</div>
			<div class="card-body bg-gray-l3">
				<ul>
					<li>
						Export/Grantee name: ${p_answer_summary.grantee_name}
					</li>

					<li>
						Export <span data-prop="all_or_core">${capitalizeFirstLetter(p_answer_summary.all_or_core)}</span> data
						<ul>
							<li>
								Exporting <span data-prop="all_or_core">${capitalizeFirstLetter(p_answer_summary.all_or_core)}</span> data and a <a href="/data-dictionary" target="_blank">data dictionary</a>
							</li>
						</ul>
					</li>

					<li>
						Password protected: <span data-prop="is_encrypted">${capitalizeFirstLetter(p_answer_summary.is_encrypted)}</span>
					</li>

					<li>
						De-identify fields: <span data-prop="de_identified_selection_type">${capitalizeFirstLetter(p_answer_summary.de_identified_selection_type)}</span>
						<div id="summary_of_de_identified_fields" class="" style="max-height:120px; overflow:auto">
							${render_summary_de_identified_fields(p_answer_summary)}
						</div>
					</li>
					
					<li>
						Filter by: <span data-prop="case_filter_type">${capitalizeFirstLetter(p_answer_summary.case_filter_type)}</span>
						<div id="summary_of_selected_cases" class="" style="max-height:120px; overflow:auto">
							${render_summary_of_selected_cases(p_answer_summary)}
						</div>
					</li>
				</ul>
			</div>
			<div class="card-footer bg-gray-l3">
				<button class="btn btn-primary btn-lg w-100" onclick="add_new_all_export_item()">Confirm & Start Export</button>
			</div>
		</div>
	`;

	return result;
}


// Grabs first letter and captilizes
function capitalizeFirstLetter(str) {
	// if str exists
	if (str) {
		// Grab first letter and upperCase it then lowerCase the rest and return
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}
}



// Function returned after promise to update/set answer_summary to new value
function updateSummarySection(event)
{
	const tar = event.target;
	const prop = tar.dataset.prop;
	const val = tar.value;
	const el = document.querySelectorAll(`#answer-summary-card [data-prop='${prop}']`);
	let path;

		// if prop doesn't have path
	if (prop.indexOf('/') < 0) 
	{
		el.forEach((i) =>
		{
			i.innerText = capitalizeFirstLetter(val);
		});
	}
	else
	{
		path = prop.split('/');
		switch(path[1]) {
			case 'case_status':
				const cs_opts = tar.options;
				let cs_html = '';
				for (let i = 0; i < cs_opts.length; i++) {
					if (cs_opts[i].selected) {
						cs_html += '<li>';
						cs_html += cs_opts[i].text;
						cs_html += '</li>';
					}
				}
				el[0].innerHTML = cs_html;
				break;

			case 'case_jurisdiction':
				const cj_opts = tar.options;
				let cj_html = '';
				for (let i = 0; i < cj_opts.length; i++) {
					if (cj_opts[i].selected) {
						cj_html += '<li>';
						cj_html += cj_opts[i].text;
						cj_html += '</li>';
					}
				}
				el[0].innerHTML = cj_html;
				break;
			default:
				el.forEach((i) =>
				{
					i.innerText = capitalizeFirstLetter(val);
				});
				break;
		}
	}
}

// Function returned after promise to update/set answer_summary to new value
function handleElementDisplay(event, str)
{
	const prop = event.target.dataset.prop;
	const tars = document.querySelectorAll(`[data-show='${prop}']`);

	return new Promise ((resolve, reject) =>
	{
		if (!isNullOrUndefined(tars)) {
			for (let i = 0; i < tars.length; i++) {
				if (tars[i].style.display === 'none') {
					tars[i].style.display = str;
				} else {
					tars[i].style.display = 'none';
				}
			}
		} else {
			// target doesn't exist, reject
			reject('Target(s) do not exist');
		}
	})

	// tars.forEach((el) =>
	// {
	// 	if (el.style.display == 'none') {
	// 		el.style.display == str;
	// 		console.log('a');
	// 	} else {
	// 		el.style.display == 'none';
	// 		console.log('b');
	// 	}
	// });
}

// Class to dynamically create a new 'numeric' dropdown
class NumericDropdown
{
	constructor(type)
	{
		this.type = type;
		this.iterator = 1;
		this.condition = 1;
		this.opts = '<option value="all" selected>All</option>'; // options should be 'All' by default
	}

	buildNumericDropdown()
	{
		// based on case type, we change iterator and/or condition
		switch (this.type)
		{
			case "y":
			case "year":
				this.iterator = new Date().getFullYear() - 119;
				this.condition = new Date().getFullYear();
				break;
			case "m":
			case "month":
				this.condition = 12;
				break;
			case "d":
			case "day":
				this.condition = 31;
				break;
		}

		// iterate through iterator and condition to build the options
		for (let i = this.iterator; i <= this.condition; i++)
		{
			this.opts += `<option value='${i}'>`;
			this.opts += i;
			this.opts += "</option>";
		}
		return this.opts;
	}
}

function apply_filter_button_click()
{
	var filter_search_text = document.getElementById("filter_search_text");
	var filter_sort_by = document.getElementById("filter_sort_by");
	var filter_records_perPage = document.getElementById("filter_records_perPage");
	var filter_decending = document.getElementById("filter_decending");

	/*
	g_case_view_request.total_rows = 0,
	g_case_view_request.page = 1,
	g_case_view_request.skip = 0,
	*/

	g_case_view_request.take = filter_records_perPage.value;
	g_case_view_request.sort = filter_sort_by.value;
	g_case_view_request.search_key = filter_search_text.value;
	g_case_view_request.descending = filter_decending.checked;
	
	get_case_set();
}

function result_checkbox_click(p_checkbox)
{
	let value = p_checkbox.value;

	if(p_checkbox.checked)
	{

		if(answer_summary.case_set.indexOf(value) < 0)
		{
			answer_summary.case_set.push(value)
		}
	}
	else
	{
		let index = answer_summary.case_set.indexOf(value);
		if(index > -1)
		{
			answer_summary.case_set.splice(index,1)
		}
	}

	let el = document.getElementById('selected_case_list');

	let result = []
	render_selected_case_list(result, answer_summary);
	el.innerHTML = result.join("");

	el = document.getElementById('exported_cases_count');
	el.innerHTML = `Cases to be included in export (${answer_summary.case_set.length}):`;


	el = document.getElementById('case_result_pagination');
	result = [];
	render_pagination(result, g_case_view_request);
	el.innerHTML = result.join("");


	var summary_of_selected_cases = document.getElementById("summary_of_selected_cases");
	summary_of_selected_cases.innerHTML = render_summary_of_selected_cases(answer_summary);

}

var g_case_view_request = {
    total_rows: 0,
    page :1,
    skip : 0,
    take : 100,
    sort : "by_date_last_updated",
    search_key : null,
    descending : true,
    get_query_string : function(){
      var result = [];
      result.push("?skip=" + (this.page - 1) * this.take);
      result.push("take=" + this.take);
      result.push("sort=" + this.sort);
  
      if(this.search_key)
      {
        result.push("search_key=\"" + this.search_key.replace(/"/g, '\\"').replace(/\n/g,"\\n") + "\"");
      }
  
      result.push("descending=" + this.descending);
  
      return result.join("&");
    }
  };


function get_case_set()
{
	var case_view_url = location.protocol + '//' + location.host + '/api/case_view' + g_case_view_request.get_query_string();

	$.ajax
	(
		{
			url: case_view_url,
		}
	)
	.done
	(
		function(case_view_response) 
		{
			let el = document.getElementById('search_result_list');
			let html = [];
			//html.push("<li><input type='checkbox' /> select all</li>");
			g_case_view_request.total_rows = case_view_response.total_rows;
			g_case_view_request.respone_rows = case_view_response.rows;
			//g_case_view_request.page = case_view_response.page;
			
			for(let i = 0; i < case_view_response.rows.length; i++)
			{


				let item = case_view_response.rows[i];
				let value_list = item.value;

				selected_dictionary[item.id] = value_list;

				let checked = "";

				let index = answer_summary.case_set.indexOf(item.id);
				if(index > -1)
				{
					checked = "checked=true"
				}

				// Items generated after user applies filters
				html.push(`
					<tr class="tr font-weight-normal">
						<td class="td" data-type="date_created" width="38" align="center">
							<input id=${escape(item.id)}
										 type="checkbox"
										 value=${escape(item.id)}
										 type="checkbox"
										 onclick="result_checkbox_click(this)" ${checked} />
							<label for="" class="sr-only">${escape(item.id)}</label>
						</td>
						<td class="td" data-type="date_last_updated">
							${escape(value_list.date_last_updated).replace(/%20/g," ").replace(/%3A/g,"-")} <br/> ${escape(value_list.last_updated_by)}
						</td>
						<td class="td" data-type="jurisdiction_id">
							${escape(value_list.last_name).replace(/%20/g," ").replace(/%3A/g,"-")}, ${escape(value_list.first_name).replace(/%20/g," ").replace(/%3A/g,"-")} ${escape(value_list.middle_name).replace(/%20/g," ").replace(/%3A/g,"-")} [${escape(value_list.jurisdiction_id)}]  
						</td>
						<td class="td" data-type="record_id">
							${escape(value_list.record_id).replace(/%20/g," ").replace(/%3A/g,"-")}
						</td>
						<td class="td" data-type="date_of_death">
						${(value_list.date_of_death_year != null)? escape(value_list.date_of_death_year): "" }-${(value_list.date_of_death_month != null)? escape(value_list.date_of_death_month) : ""}
						</td>
						<td class="td" data-type="committee_review_date">
						${(value_list.committee_review_date!=null)? escape(value_list.committee_review_date): "N/A"}
						</td>
						<td class="td" data-type="agency_case_id">
							${escape(value_list.agency_case_id).replace(/%20/g," ").replace(/%3A/g,"-")}
						</td>
						<td class="td" data-type="date_last_updated">
							${escape(value_list.date_last_updated).replace(/%20/g," ").replace(/%3A/g,"-")}<br/>
							${escape(value_list.created_by).replace(/%20/g," ").replace(/%3A/g,"-")}
						</td>
					</tr>
				`);
				// html.push(`<li class="foo"><input value=${escape(item.id)} type="checkbox" onclick="result_checkbox_click(this)" ${checked} /> ${escape(value_list.jurisdiction_id)} ${escape(value_list.last_name)},${escape(value_list.first_name)} ${escape(value_list.date_of_death_year)}/${escape(value_list.date_of_death_month)} ${escape(value_list.date_last_updated)} ${escape(value_list.last_updated_by)} agency_id:${escape(value_list.agency_case_id)} rc_id:${escape(value_list.record_id)}</li>`);
			}

			el.innerHTML = html.join("");

			el = document.getElementById('case_result_pagination');
			html = [];
			render_pagination(html, g_case_view_request);
			el.innerHTML = html.join("");
		
		}
	)
};

function render_selected_case_list(p_result, p_answer_summary)
{

	//html.push("<li><input type='checkbox' /> select all</li>");
	for(let i = 0; i < p_answer_summary.case_set.length; i++)
	{
		let item_id = p_answer_summary.case_set[i];
		let value_list = selected_dictionary[item_id];

		// Items generated after user ADDS applied filters
		//html.push(`<li class="baz"><input value=${item_id} type="checkbox" onclick="result_checkbox_click(this)" checked="true" /> ${value_list.jurisdiction_id} ${value_list.last_name},${value_list.first_name} ${value_list.date_of_death_year}/${value_list.date_of_death_month} ${value_list.date_last_updated} ${value_list.last_updated_by} agency_id:${value_list.agency_case_id} rc_id:${value_list.record_id}</li>`);

		let checked = "";

		let index = p_answer_summary.case_set.indexOf(item_id);
		if(index > -1)
		{
			checked = "checked=true"
		}

		// Items generated after user applies filters
		p_result.push(`
			<tr class="tr font-weight-normal">
				<td class="td" data-type="date_created" width="38" align="center">
					<input id=${escape(item_id)}
								 type="checkbox"
								 value=${escape(item_id)}
								 type="checkbox"
								 onclick="result_checkbox_click(this)" ${checked} />
					<label for="" class="sr-only">${escape(item_id)}</label>
				</td>
				<td class="td" data-type="date_last_updated">
					${escape(value_list.date_last_updated).replace(/%20/g," ").replace(/%3A/g,"-")} <br/> ${escape(value_list.last_updated_by)}
				</td>
				<td class="td" data-type="jurisdiction_id">
					${escape(value_list.last_name).replace(/%20/g," ").replace(/%3A/g,"-")}, ${escape(value_list.first_name).replace(/%20/g," ").replace(/%3A/g,"-")} ${escape(value_list.middle_name).replace(/%20/g," ").replace(/%3A/g,"-")} [${escape(value_list.jurisdiction_id)}]  
				</td>
				<td class="td" data-type="record_id">
					${escape(value_list.record_id).replace(/%20/g," ").replace(/%3A/g,"-")}
				</td>
				<td class="td" data-type="date_of_death">
				${(value_list.date_of_death_year != null)? escape(value_list.date_of_death_year): "" }-${(value_list.date_of_death_month != null)? escape(value_list.date_of_death_month) : ""}
				</td>
				<td class="td" data-type="committee_review_date">
				${(value_list.committee_review_date!=null)? escape(value_list.committee_review_date): "N/A"}
				</td>
				<td class="td" data-type="agency_case_id">
					${escape(value_list.agency_case_id).replace(/%20/g," ").replace(/%3A/g,"-")}
				</td>
				<td class="td" data-type="date_last_updated">
					${escape(value_list.date_last_updated).replace(/%20/g," ").replace(/%3A/g,"-")}<br/>
					${escape(value_list.created_by).replace(/%20/g," ").replace(/%3A/g,"-")}
				</td>
			</tr>
		`);
	}


}




function de_identified_search_click()
{
	g_filter.selected_form = document.getElementById("de_identify_form_filter").value;

	let de_identify_search_result_list = document.getElementById("de_identify_search_result_list");

	let result = [];
	render_de_identified_search_result(result, answer_summary, g_filter);

	de_identify_search_result_list.innerHTML = result.join("");
	
}

function render_de_identified_search_result(p_result, p_answer_summary, p_filter)
{

	render_de_identified_search_result_item(p_result, g_metadata, "", p_filter.selected_form, p_filter.search_text);

	
}

function render_de_identified_search_result_item(p_result, p_metadata, p_path, p_selected_form, p_search_text)
{

	switch(p_metadata.type.toLowerCase())
	{
		case "form":
				if(p_selected_form== null || p_selected_form=="")
				{
					for(let i = 0; i < p_metadata.children.length; i++)
					{
						let item = p_metadata.children[i];
						render_de_identified_search_result_item(p_result, item, p_path + "/" + item.name, p_selected_form, p_search_text);
					}
				}
				else
				{
					if(p_metadata.name.toLowerCase() == p_selected_form.toLowerCase())
					{
						for(let i = 0; i < p_metadata.children.length; i++)
						{
							let item = p_metadata.children[i];
							render_de_identified_search_result_item(p_result, item, p_path + "/" + item.name, p_selected_form, p_search_text);
						}
					}
				}
				
				break;
		case "app":
		case "group":
		case "grid":
			for(let i = 0; i < p_metadata.children.length; i++)
			{
				let item = p_metadata.children[i];
				render_de_identified_search_result_item(p_result, item, p_path + "/" + item.name, p_selected_form, p_search_text);
			}
			break;
		default:

		if(p_search_text != null && p_search_text !="")
		{
			if
			(
				!(
					p_metadata.name.indexOf(p_search_text) > -1 ||
					p_metadata.prompt.indexOf(p_search_text) > -1 
				)
			
			)
			{
				return;
			}
		}

		//let item_id = (p_path + "-" + p_metadata.name).replace(/\//g,"-");
		let item_id = (p_path).replace(/\//g,"-");
		selected_metadata_dictionary[item_id] = p_metadata;
		let checked = "";
		let index = answer_summary.de_identified_field_set.indexOf(item_id);

		if(index > -1)
		{
			checked = "checked=true"
		}

		p_result.push(`
			<tr class="tr">
				<td class="td text-center" width="38">
					<input id="unique_id_1" type="checkbox" onclick="de_identified_result_checkbox_click(this)" value="${item_id}"  ${checked} />
					<label for="unique_id_1" class="sr-only">unique_id_1</label>
				</td>
				<td class="td">
					<table class="table rounded-0 mb-0">
						<thead class="thead">
							<tr class="tr">
								<th class="th" colspan="4">
									<button class="anti-btn w-100 row no-gutters align-items-center justify-content-between"
													data-prop="search--${p_path}"
													onclick="handleElementDisplay(event, 'table-row', 'none')">
										<span class="pointer-none"><strong>Path:</strong> ${p_path}</span>
									</button>
								</th>
							</tr>
						</thead>
						<thead class="thead">
							<tr class="tr bg-white" data-show="search--${p_path}" style="display: none">
								<th class="th">Name</th>
								<th class="th">Type</th>
								<th class="th">Prompt</th>
								<th class="th">Values</th>
							</tr>
						</thead>
						<tbody class="tbody">
							<tr class="tr" data-show="search--${p_path}" style="display: none">
								<td class="td">${p_metadata.name}</td>
								<td class="td">${p_metadata.type}</td>
								<td class="td">${p_metadata.prompt}</td>
								<td class="td"></td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		`);
		break;
	}
}

function render_standard_de_identify_fields(p_paths)
{
	let result = '';

	for (let i = 0; i < p_paths.paths.length; i++) {
		let path = p_paths.paths[i];
		result += `
			<tr class="tr">
				<td class="td">
					<strong>Path:</strong> ${path}
				</td>
			</tr>
		`;
	}

	return result;
}

function render_de_identify_form_filter(p_filter)
{
	let result = [];

	result.push(`<option value="">(Any Form)</option>`)

	for(let i = 0; i < g_metadata.children.length; i++)
	{
		let item = g_metadata.children[i];

		if(item.type.toLowerCase() == "form")
		{

			if(p_filter.selected_form == item.name)
			{
				result.push(`<option value="${item.name}" selected>${item.prompt}</option>`)
			}
			else
			{
				result.push(`<option value="${item.name}">${item.prompt}</option>`)
			}
			
		}
		
	}

	return result.join("");
}


function de_identified_result_checkbox_click(p_checkbox)
{
	let value = p_checkbox.value;

	if(p_checkbox.checked)
	{

		if(answer_summary.de_identified_field_set.indexOf(value) < 0)
		{
			answer_summary.de_identified_field_set.push(value)
		}
	}
	else
	{
		let index = answer_summary.de_identified_field_set.indexOf(value);
		if(index > -1)
		{
			answer_summary.de_identified_field_set.splice(index,1)
		}
	}

	let el = document.getElementById('selected_de_identified_field_list');
	let result = [];
	render_selected_de_identified_list(result, answer_summary);

	el.innerHTML = result.join("");

	let de_identify_search_result_list = document.getElementById("de_identify_search_result_list");

	render_de_identified_search_result(result, answer_summary, g_filter);

	de_identify_search_result_list.innerHTML = result.join("");

	el = document.getElementById('de_identified_count');
	el.innerHTML = `Fields that have been de-identified (${answer_summary.de_identified_field_set.length})`;

	renderSummarySection(p_checkbox);

}


function render_selected_de_identified_list(p_result, p_answer_summary)
{
	//let el = document.getElementById('selected_de_identified_field_list');

	//html.push("<li><input type='checkbox' /> select all</li>");
	for(let i = 0; i < p_answer_summary.de_identified_field_set.length; i++)
	{
		let item_id = p_answer_summary.de_identified_field_set[i];
		let value_list = selected_metadata_dictionary[item_id];

		// Items generated after user ADDS applied filters
		//html.push(`<li class="baz"><input value=${item_id} type="checkbox" onclick="result_checkbox_click(this)" checked="true" /> ${value_list.jurisdiction_id} ${value_list.last_name},${value_list.first_name} ${value_list.date_of_death_year}/${value_list.date_of_death_month} ${value_list.date_last_updated} ${value_list.last_updated_by} agency_id:${value_list.agency_case_id} rc_id:${value_list.record_id}</li>`);

		let checked = "";

		let index = p_answer_summary.de_identified_field_set.indexOf(item_id);
		if(index > -1)
		{
			checked = "checked=true"
		}

		p_result.push(`
		<tr class="tr">
			<td class="td text-center" width="38">
				<input id="unique_id_1" type="checkbox" onclick="de_identified_result_checkbox_click(this)" value="${item_id}"  ${checked} />
				<label for="unique_id_1" class="sr-only">unique_id_1</label>
			</td>
			<td class="td">
				<table class="table rounded-0 mb-0">
					<thead class="thead">
						<tr class="tr">
							<th class="th" colspan="4">
								<button class="anti-btn w-100 row no-gutters align-items-center justify-content-between"
												data-prop="selected--${item_id.replace(/-/g,"/")}"
												onclick="handleElementDisplay(event, 'table-row', 'none')">
									<span class="pointer-none"><strong>Path:</strong> ${item_id.replace(/-/g,"/")}</span>
								</button>
							</th>
						</tr>
					</thead>
					<thead class="thead">
						<tr class="tr bg-white" data-show="selected--${item_id.replace(/-/g,"/")}" style="display: none;">
							<th class="th">Name</th>
							<th class="th">Type</th>
							<th class="th">Prompt</th>
							<th class="th">Values</th>
						</tr>
					</thead>
					<tbody class="tbody">
						<tr class="tr" data-show="selected--${item_id.replace(/-/g,"/")}" style="display: none;">
							<td class="td">${(value_list != null) ? value_list.name : '' }</td>
							<td class="td">${(value_list != null) ? value_list.type : ''}</td>
							<td class="td">${(value_list != null) ? value_list.prompt : ''}</td>
							<td class="td"></td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
		`);
	}

	//el.innerHTML = html.join("");
}


function case_filter_type_click(p_value)
{

	answer_summary.case_filter_type = p_value.value.toLowerCase()

	var custom_case_filter = document.getElementById("custom_case_filter");
	if(p_value.value.toLowerCase() == "custom")
	{
		custom_case_filter.style.display = "block";
	}
	else
	{
		custom_case_filter.style.display = "none";
	}


	renderSummarySection(p_value)

}

function de_identify_filter_type_click(p_value)
{
	var de_identify_filter_standard = document.getElementById("de_identify_filter_standard");
	var de_identify_filter = document.getElementById("de_identify_filter");
	/*
		setAnswerSummary(event).then(updateSummarySection(event)).then(handleElementDisplay(event, 'block'))
	*/
	// Making this a promise so I can return a 'then' method
	return new Promise((resolve, reject) => {
		if (true)
		{
			if (p_value.value.toLowerCase() == "standard") {
				de_identify_filter.style.display = "none";
				de_identify_filter_standard.style.display = "block";
			} else if (p_value.value.toLowerCase() == "custom") {
				de_identify_filter_standard.style.display = "none";
				de_identify_filter.style.display = "block";
			} else {
				de_identify_filter_standard.style.display = "none";
				de_identify_filter.style.display = "none";
			}
			answer_summary.de_identified_selection_type = p_value.value.toLowerCase()
			resolve();
		}
		else
		{
			reject();
		}


		// if (!isNullOrUndefined(de_identify_filter)) {
		// 	if(p_value.value.toLowerCase() == "custom")
		// 	{
		// 		de_identify_filter.style.display = "block";
		// 	}
		// 	else
		// 	{
		// 		de_identify_filter.style.display = "none";
		// 	}

		// 	answer_summary.de_identified_selection_type = p_value.value.toLowerCase()

		// 	resolve();
		// }
		// else
		// {
		// 	reject();
		// }
	})
}

function de_identify_search_text_change(p_value)
{
	g_filter.search_text = p_value;
}


function filter_serach_text_change(p_value)
{
	g_case_view_request.search_key = p_value;
}


function de_identify_standard_fields_change(p_value)
{
	answer_summary.is_de_identify_standard_fields = p_value;
}


function render_pagination(p_result, p_case_view_request)
{
    //p_result.push("<div id='case_result_pagination' class='table-pagination row align-items-center no-gutters'>");
        p_result.push("<div class='col'>");
            p_result.push("<div class='row no-gutters'>");
                p_result.push("<p class='mb-0'>Total Records: ");
                    p_result.push("<strong>" + p_case_view_request.total_rows + "</strong>");
                p_result.push("</p>");
                p_result.push("<p class='mb-0 ml-2 mr-2'>|</p>");
                p_result.push("<p class='mb-0'>Viewing Page(s): ");
                    p_result.push("<strong>" + p_case_view_request.page + "</strong> ");
                    p_result.push("of ");
                    p_result.push("<strong>" + Math.ceil(p_case_view_request.total_rows / p_case_view_request.take) + "</strong>");
                p_result.push("</p>");
            p_result.push("</div>");
        p_result.push("</div>");
        p_result.push("<div class='col row no-gutters align-items-center justify-content-end'>");
            p_result.push("<p class='mb-0'>Select by page:</p>");
            for(let current_page = 1; (current_page - 1) * p_case_view_request.take < p_case_view_request.total_rows; current_page++)
            {
                p_result.push("<button type='button' class='table-btn-link btn btn-link' alt='select page " + current_page + "' onclick='g_ui.case_view_request.page=");
                    p_result.push(current_page);
                    p_result.push(";get_case_set();'>");
                    p_result.push(current_page);
                p_result.push("</button>");
            }
        p_result.push("</div>");
    //p_result.push("</div>");
}


function render_summary_de_identified_fields(p_answer_summary)
{
	let result = [];

	switch(p_answer_summary.de_identified_selection_type.toLowerCase())
	{
		case "none":

			break;
		case "standard":
			result.push("<table class='bg-white mt-1 w-100'>")

			for (let i = 0; i < g_standard_de_identified_list.paths.length; i++) 
			{
				let path = g_standard_de_identified_list.paths[i];
				result.push(`
					<tr class="tr">
						<td class="td">
							<strong>Path:</strong> ${path}
						</td>
					</tr>
				`);
			}
			result.push("</table>");
			break;

		case "custom":
				result.push("<table>");
	
				for (let i = 0; i < p_answer_summary.de_identified_field_set.length; i++) 
				{
					let path = p_answer_summary.de_identified_field_set[i];
					result.push(`
						<tr class="tr">
							<td class="td">
								<strong>Path:</strong> ${path}
							</td>
						</tr>
					`);
				}
				result.push("</table>")
				break;
		

	}
	
	return result.join("");
}


function render_summary_of_selected_cases(p_answer_summary)
{
	let result = [];

	switch(p_answer_summary.case_filter_type.toLowerCase())
	{
		case "all":

			break;


		case "custom":
				result.push("<table>");
	
				

				for (let i = 0; i < p_answer_summary.case_set.length; i++) 
				{

					let value_list = selected_dictionary[p_answer_summary.case_set[i]];
					//let path = p_answer_summary.case_set[i];

					let text_value = escape(value_list.date_last_updated).replace(/%20/g," ").replace(/%3A/g,"-") + "<br/>" + escape(value_list.last_updated_by) + " " + escape(value_list.last_name).replace(/%20/g," ").replace(/%3A/g,"-") + ", " + escape(value_list.first_name).replace(/%20/g," ").replace(/%3A/g,"-") + " " + escape(value_list.middle_name).replace(/%20/g," ").replace(/%3A/g,"-") + " [" + escape(value_list.jurisdiction_id) + "]";
					result.push(`
						<tr class="tr">
							<td class="td">
							${text_value}
							</td>
						</tr>
					`);
				}
				result.push("</table>")
				break;
	}
	
	return result.join("");
}
