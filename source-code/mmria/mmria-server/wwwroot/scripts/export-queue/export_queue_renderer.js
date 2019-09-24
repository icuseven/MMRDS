// Grabs first letter and captilizes
function capitalizeFirstLetter(str) {
	// if str exists
	if (str) {
		// Grab first letter and upperCase it then lowerCase the rest and return
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}
}

// Promise that sets and updates answer_summary json obj
function setAnswerSummary(event) {
	return new Promise((resolve, reject) => {
		const target = event.target,
					val = target.value,
					prop = target.dataset.prop;
			let path; // variable to split props into

		console.log(target, val, prop);
		
		if (prop) 
		{
			if (prop.indexOf('/') < 0) 
			{
				answer_summary[prop] = val;
			}
			else 
			{
				path = prop.split('/');
				switch(path[1])
				{
					case 'date_of_death':
						switch(path[2]) 
						{
							case 'year':
								answer_summary['filter']['date_of_death']['year'][0] = val;
								break;
							case 'month':
								answer_summary['filter']['date_of_death']['month'][0] = val;
								break;
							case 'day':
								answer_summary['filter']['date_of_death']['day'][0] = val;
								break;
						}
						break;
					case 'case_status':
						let case_opts = target.options;
						let statuses = [];
						for (let i = 0; i< case_opts.length; i++) {
							if (case_opts[i].selected) {
								// push each selected option into statuses arr
								statuses.push(case_opts[i].value);
								
								// // Below we push obj into temp 'statuses' array for later manipulation
								// let s = {};
								// s['value'] = case_opts[i].value;
								// s['text'] = case_opts[i].text;
								// statuses.push(status);
							}
						}
						// set answer_summary to new statuses
						answer_summary['filter']['case_status'] = statuses;
						break;
					case 'case_jurisdiction':
							let jurisdiction_opts = target.options;
							let jurisdictions = [];
							for (let i = 0; i< jurisdiction_opts.length; i++) {
								if (jurisdiction_opts[i].selected) {
									// push each selected option into jurisdictions arr
									jurisdictions.push(jurisdiction_opts[i].value);
									
									// let j = {};
									// // Below we push obj into temp 'jurisdictions' array for later manipulation
									// j['value'] = jurisdiction_opts[i].value;
									// j['text'] = jurisdiction_opts[i].text;
									// jurisdictions.push(j);
								}
							}
							// set answer_summary to new jurisdictions
							answer_summary['filter']['case_jurisdiction'] = jurisdictions;
						break;
				}
			}
			console.log('Updating... ', answer_summary);
			resolve();
		}
		else
		{
			reject('Error');
		}
	});
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

	tars.forEach((i) =>
	{
		i.style.display = str;
	});
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

function export_queue_render(p_queue_data)
{
	var result = [];

	result.push(`
		<div class="row">
			<div class="col-4 fancy-sidebar">
				<div id="answer-summary-card" class="card">
					<div class="card-header bg-gray-l3">
					<h2 class="h5 font-weight-bold">Summary of your Export Data choices</h2>
					</div>
					<div class="card-body bg-gray-l3">
					<ul>
						<li>
							Export <span data-prop="all_or_core">${capitalizeFirstLetter(answer_summary.all_or_core)}</span> data
							<ul>
								<li>
									Exporting <span data-prop="all_or_core">${capitalizeFirstLetter(answer_summary.all_or_core)}</span> data and a <a href="/data-dictionary" target="_blank">data dictionary</a>
								</li>
							</ul>
						</li>
						<li>
							Export/Grantee name: ${answer_summary.grantee_name}
						</li>
						<!-- <li>You have selected to export in JSON format</li> -->
						<li>
							Password protected: <span data-prop="is_encrypted">${capitalizeFirstLetter(answer_summary.is_encrypted)}</span>
						</li>
						<li>
							Send file to CDC: <span data-prop="is_for_cdc">${capitalizeFirstLetter(answer_summary.is_for_cdc)}</span>
						</li>
						<li>
							De-identify fields: <span data-prop="de_identified_selection_type">${capitalizeFirstLetter(answer_summary.de_identified_selection_type)}</span>
							<ul data-show="de_identified_selection_type" style="display: none">
								<li>
									<button class="btn btn-link p-0" data-toggle="modal" data-target="#custom-fields">View selection</button>
								</li>
							</ul>
						</li>
						<li>
							Filter by:
							<ul>
								<li>
									Date of Death:
									<ul>
										<li>
											From: <span data-prop="filter/date_range/from">${capitalizeFirstLetter(answer_summary.filter.date_range[0].from)}</span>
											,
											To: <span data-prop="filter/date_range/to">${capitalizeFirstLetter(answer_summary.filter.date_range[0].to)}</span>
										</li>
									</ul>
								</li>
								<!--
								<li>
									Date of Death:
									<ul>
										<li>Year: <span data-prop="filter/date_of_death/year">${capitalizeFirstLetter(answer_summary.filter.date_of_death.year[0])}</span></li>
										<li>Month: <span data-prop="filter/date_of_death/month">${capitalizeFirstLetter(answer_summary.filter.date_of_death.month[0])}</span></li>
										<li>Day: <span data-prop="filter/date_of_death/day">${capitalizeFirstLetter(answer_summary.filter.date_of_death.day[0])}</span></li>
									</ul>
								</li>
								-->
								<li>
									Case status(s):
									<ul data-prop="filter/case_status">
										<li>${capitalizeFirstLetter(answer_summary.filter.case_status[0])}</span></li>
									</ul>
								</li>
								<li>
									Case jurisdiction(s):
									<ul data-prop="filter/case_jurisdiction">
										<li>${capitalizeFirstLetter(answer_summary.filter.case_jurisdiction[0])}</span></li>
									</ul>
								</li>
							</ul>
						</li>
					</ul>
					</div>
					<div class="card-footer bg-gray-l3">
						<button class="btn btn-secondary w-100">Confirm & Start Export</button>
					</div>
				</div>
			</div>

			<div class="col-8">
				<ol class="font-weight-bold">
					<li class="mb-4">
						<p class="mb-3">Export all data or only core data? <small class="d-block mt-1">The zip file will be downloaded directly to the “Downloads” folder in the local environment of your computer.</small></p>
						<ul class="font-weight-normal list-unstyled" style="padding-left: 0px;">
							<li>
								<input name="export-type"
											 id="all-data"
											 class="mr-1"
											 data-prop="all_or_core"
											 type="radio"
											 value="all"
											 checked onchange="setAnswerSummary(event).then(updateSummarySection(event))" />
								<label for="all-data" class="mb-0">All</label>
							</li>
							<li>
								<input name="export-type"
											 id="core-data"
											 class="mr-1"
											 data-prop="all_or_core"
											 type="radio"
											 value="core"
											 onchange="setAnswerSummary(event).then(updateSummarySection(event))" />
								<label for="core-data" class="mb-0">Core</label>
							</li>
						</ul>
					</li>

					<li class="mb-4">
						<label for="grantee-name" class="mb-3">What export or grantee name do you want to add to each case?</label>
						<input id="grantee-name"
									 class="form-control w-auto"
									 type="text"
									 value="${answer_summary.grantee_name}"
									 disabled
									 readonly="true" />
					</li>

					<li class="mb-4">
						<p class="mb-3">Would you like to password protect the file?</p>
						<ul class="font-weight-normal list-unstyled" style="padding-left: 0px;">
							<li>
								<input name="password-protect"
											 id="password-protect-no"
											 class="mr-1"
											 data-prop="is_encrypted"
											 type="radio"
											 value="no"
											 checked
											 onchange="setAnswerSummary(event).then(updateSummarySection(event)).then(handleElementDisplay(event, 'none'))" />
								<label for="password-protect-no" class="mb-0">No</label>
							</li>
							<li>
								<input name="password-protect"
											 id="password-protect-yes"
											 class="mr-1"
											 data-prop="is_encrypted"
											 type="radio"
											 value="yes"
											 onchange="setAnswerSummary(event).then(updateSummarySection(event)).then(handleElementDisplay(event, 'block'))" />
								<label for="password-protect-yes" class="mb-0">Yes</label>
								<div class="mt-2" data-show="is_encrypted" style="display:none">
									<label for="encryption-key" class="mb-2">Add encryption key</label>
									<!-- TODO: Add logic to show dynamically input if user selects corresponding control -->
									<input id="encryption-key"
												class="form-control w-auto"
												type="text"
												value="${answer_summary.encryption_key}" />
								</div>
							</li>
						</ul>
					</li>

					<li class="mb-4">
						<p class="mb-3">Are you sending this file to CDC? <small class="d-block mt-1">If Yes, your file will be password encrypted using a CDC keyion key.</small></p>
						<ul class="font-weight-normal list-unstyled" style="padding-left: 0px;">
							<li>
								<input name="cdc"
											 id="cdc-no"
											 class="mr-1"
											 data-prop="is_for_cdc"
											 type="radio"
											 value="no"
											 checked
											 onchange="setAnswerSummary(event).then(updateSummarySection(event))" />
								<label for="cdc-no" class="mb-0">No</label>
							</li>
							<li>
								<input name="cdc"
											 id="cdc-yes"
											 class="mr-1"
											 data-prop="is_for_cdc"
											 type="radio"
											 value="yes"
											 onchange="setAnswerSummary(event).then(updateSummarySection(event))" />
								<label for="cdc-yes" class="mb-0">Yes</label>
							</li>
						</ul>
					</li>
						
					<li class="mb-4">
						<p class="mb-3">What fields do you want to de-identify?</p>
						<ul class="font-weight-normal list-unstyled" style="padding-left: 0px;">
							<li>
								<input name="de-identify"
											 id="de-identify-none"
											 class="mr-1"
											 data-prop="de_identified_selection_type"
											 type="radio"
											 value="none"
											 checked
											 onchange="setAnswerSummary(event).then(updateSummarySection(event)).then(handleElementDisplay(event, 'none'))" /> 
								<label for="de-identify-none" class="mb-0">None</label>
							</li>
							<li>
								<input name="de-identify"
											 id="de-identify-standard"
											 class="mr-1"
											 data-prop="de_identified_selection_type"
											 type="radio"
											 value="standard"
											 onchange="setAnswerSummary(event).then(updateSummarySection(event)).then(handleElementDisplay(event, 'none'))" />
								<label for="de-identify-standard" class="mb-0">Standard</label>
							</li>
							<li>
								<input name="de-identify"
											 id="de-identify-custom"
											 class="mr-1"
											 data-prop="de_identified_selection_type"
											 type="radio"
											 value="custom"
											 onchange="setAnswerSummary(event).then(updateSummarySection(event)).then(handleElementDisplay(event, 'block'))" />
								<label for="de-identify-custom" class="mb-0">Custom</label>
								<!-- TODO: Add logic to show dynamically input if user selects corresponding control -->
								<div class="mt-2" data-show="de_identified_selection_type" style="display:none">
									<button class="btn btn-secondary" data-toggle="modal" data-target="#custom-fields">Select custom selection</button>
								</div>
							</li>
						</ul>
					</li>

					<li class="mb-4">
						<p class="mb-3">What filters do you want to apply?</p>
						<ul class="font-weight-bold list-unstyled">
							<li class="mb-4">
								<p class="mb-3 font-weight-bold">Date of death <small class="d-block mt-1">You can also add multiple date ranges</small></p>
								<form class="row no-gutters mb-3">
									<div class="form-inline mr-2 mb-0">
										<label for="date-from" class="mr-2">From:</label>
										<input id="date-from"
													 class="form-control w-auto"
													 type="text"
													 value="All"
													 data-provide="datepicker"
													 data-date-format="yyyy/mm/dd"
													 data-prop="filter/date_range/from"
													 onchange="setAnswerSummary(event)" />
									</div>
									<div class="form-inline mr-2 mb-0">
										<label for="date-to" class="mr-2">To:</label>
										<input id="date-to"
													 class="form-control w-auto"
													 type="text"
													 value="All"
													 data-provide="datepicker"
													 data-date-format="yyyy/mm/dd"
													 data-prop="filter/date_range/to"
													 onchange="setAnswerSummary(event)" />
									</div>
									<div class="form-inline mb-0">
										<button type="submit" class="btn btn-secondary">Add</button>
									</div>
								</form>
								<ol class="font-weight-normal pl-3">
									<li>Hello darkness my old friend! <button class="anti-btn"><span class="sr-only">Delete date range</span><span class="x18 fill-p cdc-icon-times"></span></button></li>
									<li>Hello darkness my old friend! <button class="anti-btn"><span class="sr-only">Delete date range</span><span class="x18 fill-p cdc-icon-times"></span></button></li>
									<li>Hello darkness my old friend! <button class="anti-btn"><span class="sr-only">Delete date range</span><span class="x18 fill-p cdc-icon-times"></span></button></li>
									<li>Hello darkness my old friend! <button class="anti-btn"><span class="sr-only">Delete date range</span><span class="x18 fill-p cdc-icon-times"></span></button></li>
								</ol>
							</li>

							<!--
							<li class="mb-4">
								<p class="mb-2 font-weight-bold">Date of death:</p>
								<ul class="font-weight-normal row list-unstyled pl-3">
									<li class="mr-2">
										<label for="dod-year" class="mb-2">Year</label>
										<select id="dod-year"
														class="form-control w-auto"
														data-prop="filter/date_of_death/year"
														onchange="setAnswerSummary(event).then(updateSummarySection(event))">
											${ new NumericDropdown('y').buildNumericDropdown() }
										</select>
									</li>
									<li class="mr-2">
										<label for="dod-month" class="mb-2">Month</label>
										<select id="dod-month"
														class="form-control w-auto"
														data-prop="filter/date_of_death/month"
														onchange="setAnswerSummary(event).then(updateSummarySection(event))">
											${ new NumericDropdown("m").buildNumericDropdown() }
										</select>
									</li>
									<li class="mr-2">
										<label for="dod-day" class="mb-2">Day</label>
										<select id="dod-day"
														class="form-control w-auto"
														data-prop="filter/date_of_death/day"
														onchange="setAnswerSummary(event).then(updateSummarySection(event))">
											${ new NumericDropdown("d").buildNumericDropdown() }
										</select>
									</li>
								</ul>
							</li>
							-->

							<li class="mb-4">
								<label for="case-status" class="mb-3">Case status <small class="d-block mt-1">Click and drag or hold down the Ctrl (windows) / Command (Mac) button to select multiple options.</small></label>
								<select id="case-status"
												class="form-control mb-3"
												multiple
												data-prop="filter/case_status"
												onchange="setAnswerSummary(event).then(updateSummarySection(event))"
												style="width: 300px">
									<!-- TODO: These opts need to be wired up dynamically -->
									<option value="-9" selected>All</option>
									<option value="0">Not Started</option>
									<option value="1">In Progress</option>
									<option value="2">Completed</option>
									<option value="3">Not Available</option>
									<option value="4">Not Applicable</option>
								</select>
							</li>

							<li class="mb-4">
								<label for="case-jurisdiction" class="mb-3">Case Jurisdiction <small class="d-block mt-1">Click and drag or hold down the Ctrl (windows) / Command (Mac) button to select multiple options.</small></label>
								<select id="case-jurisdiction"
												class="form-control mb-3"
												multiple
												data-prop="filter/case_jurisdiction"
												onchange="setAnswerSummary(event).then(updateSummarySection(event))"
												style="width: 300px">
									<!-- TODO: These opts need to be wired up dynamically -->
									<option value="/all" selected>/all</option>
									<option value="/2017">/2017</option>
									<option value="/2018">/2018</option>
									<option value="/2019">/2019</option>
									<option value="/north_ga">/north_ga</option>
									<option value="/south_ga">/south_ga</option>
									<option value="/ga">/ga</option>
									<option value="/nc">/nc</option>
									<option value="/sc">/sc</option>
									</select>
							</li>

							<!-- TODO: Remove completely once we narrow down direction more -->
							<!--<li class="mb-4">
								<label class="mb-2">Filter by Case</label>
								<p class="font-weight-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porttitor tempus purus, mattis pretium nunc condimentum et. Vestibulum id sapien elementum eros consequat convallis quis ut augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed semper dui dolor, vitae varius ipsum consequat vel. Quisque nec ex nec mauris blandit sollicitudin eu quis orci. Etiam scelerisque dui et neque gravida, eu molestie sem bibendum. Donec non arcu est. Nulla luctus quam vel condimentum fermentum. Donec eu accumsan tellus.</p>
							</li>-->
						</ul>
					</li>
				</ol>
			</div>
		</div>

		<!-- One modal approach -->
		<!-- TODO: hook up dynamic HTML -->
		<div class="modal fade" id="custom-fields" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLongTitle">De-identify custom fields</h5>
						<button type="button" class="close p-0 bg-transparent" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true" class="x24 fill-p cdc-icon-close"></span>
						</button>
					</div>
					<div class="modal-body">
						<label for="custom-a" class="row no-gutters align-items-baseline"><input id="custom-a" class="mr-2" type="checkbox" style="flex:0" /> <span style="flex:1">Exclude PII tagged fields</span></label>
						<label for="custom-b" class="row no-gutters align-items-baseline"><input id="custom-b" class="mr-2" type="checkbox" style="flex:0" /> <span style="flex:1">Include PII tagged fields and any data in the field</span></label>
						<label for="custom-1" class="row no-gutters align-items-baseline"><input id="custom-1" class="mr-2" type="checkbox" style="flex:0" /> <span style="flex:1">date_created</span></label>
						<label for="custom-2" class="row no-gutters align-items-baseline"><input id="custom-2" class="mr-2" type="checkbox" style="flex:0" /> <span style="flex:1">created_by</span></label>
						<label for="custom-3" class="row no-gutters align-items-baseline"><input id="custom-3" class="mr-2" type="checkbox" style="flex:0" /> <span style="flex:1">date_last_updated</span></label>
						<label for="custom-4" class="row no-gutters align-items-baseline"><input id="custom-4" class="mr-2" type="checkbox" style="flex:0" /> <span style="flex:1">last_updated_by</span></label>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
						<button type="button" class="btn btn-primary">Save changes</button>
					</div>
				</div>
			</div>
		</div>
	`);

	result.push("<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />");

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
