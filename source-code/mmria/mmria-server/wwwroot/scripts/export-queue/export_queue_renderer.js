
function export_queue_render(p_queue_data)
{
	var result = [];

	result.push(`
		<div class="row">
			<div class="col">
				<ol class="font-weight-bold pl-3">
					<li class="mb-4">
						<label for="grantee-name" class="mb-3">The grantee name that will be added to each exported case is:</label>
						<input id="grantee-name"
							 class="form-control w-auto"
							 type="text"
							 value="${answer_summary.grantee_name}"
							 disabled
							 readonly="true" />
					</li>				
					<li class="mb-4">
						<p class="mb-3">Do you want to export <u>all data</u> or only <u>core data</u>? <small class="d-block mt-1">The zip file will be downloaded directly to the “Downloads” folder in the local environment of your computer.</small></p>
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
									<input id="encryption-key"
												class="form-control w-auto"
												type="text"
												value="${answer_summary.encryption_key}" />
								</div>
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
											 onchange="de_identify_filter_type_click(this)"  /> 
								<label for="de-identify-none" class="mb-0">None</label>
							</li>
							<li>
								<input name="de-identify"
											 id="de-identify-standard"
											 class="mr-1"
											 data-prop="de_identified_selection_type"
											 type="radio"
											 value="standard"
											 onchange="de_identify_filter_type_click(this)"  />
								<label for="de-identify-standard" class="mb-0">Standard</label>
							</li>
							<li>
								<input name="de-identify"
											 id="de-identify-custom"
											 class="mr-1"
											 data-prop="de_identified_selection_type"
											 type="radio"
											 value="custom"
											 onchange="de_identify_filter_type_click(this)" />
								<label for="de-identify-custom" class="mb-0">Custom</label>
								<div id="de_identify_filter" class="p-3 mt-2 bg-gray-l3" data-show="de_identified_selection_type" style="display: none; border: 1px solid #bbb;">
									<p class="font-weight-bold">To customize, please search/choose your options below and check the resulting fields you want to de-identify from the list.</p>
									<div class="form-inline mb-2">
										<label for="de_identify_search_text" class="mr-2"> Search for:</label>
										<input type="text"
														class="form-control mr-2"
														id="de_identify_search_text"
														
														value="">
										<select id="de_identify_form_filter">
											<option selected>select form</option>
											<option>any</option>
											<option>home record</option>
											<option>death certificate parent section</option>
										</select>&nbsp;
										<button type="button" class="btn btn-tertiary" alt="clear search" onclick="render_de_identified_search_result()">Search</button>
									</div>
									<div class="form-group form-check mb-1">
										<input type="checkbox" class="form-check-input" id="exclude_pii">
										<label class="form-check-label" for="exclude_pii">Exclude PII tagged fields</label>
									</div>
									<div class="form-group form-check mb-0">
										<input type="checkbox" class="form-check-input" id="include_pii">
										<label class="form-check-label" for="include_pii">De-identify standard fields</label>
									</div>
									
									<div class="mt-3" style="border: 1px solid #bbbbbb; overflow:hidden; overflow-y: auto; max-height: 346px;">
										<table class="table table--plain mb-0">
											<thead class="thead">
												<tr class="tr bg-tertiary">
													<th class="th" colspan="2">
														<span class="row no-gutters justify-content-between">
															<span>Fields to de-identify</span>
															<button class="anti-btn" onclick="fooBarSelectAll()">Select All</button>
														</span>
													</th>
												</tr>
											</thead>
											<tbody class="tbody" id="de_identify_search_result_list">
												<tr class="tr">
													<td class="td text-center" width="38">
														<input id="unique_id_1" type="checkbox" checked />
														<label for="unique_id_1" class="sr-only">unique_id_1</label>
													</td>
													<td class="td">
														<table class="table table--plain mb-0">
															<thead class="thead">
																<tr class="tr">
																	<th class="th" colspan="4">Path: <span class="font-weight-normal">date_of_death</span></th>
																</tr>
															</thead>
															<thead class="thead">
																<tr class="tr bg-white">
																	<th class="th">Name</th>
																	<th class="th">Type</th>
																	<th class="th">Prompt</th>
																	<th class="th">Values</th>
																</tr>
															</thead>
															<tbody class="tbody">
																<tr class="tr">
																	<td class="td">date_created</td>
																	<td class="td">date</td>
																	<td class="td">date_created</td>
																	<td class="td"></td>
																</tr>
															</tbody>
														</table>
													</td>
												</tr>
												<tr class="tr">
													<td class="td text-center" width="38">
														<input id="unique_id_2" type="checkbox" />
														<label for="unique_id_2" class="sr-only">unique_id_2</label>
													</td>
													<td class="td">
														<table class="table table--plain mb-0">
															<thead class="thead">
																<tr class="tr">
																	<th class="th" colspan="4">Path: <span class="font-weight-normal">home_record/case_progress_report/birth_certificate_infant_or_fetal_death_section</span></th>
																</tr>
															</thead>
															<thead class="thead">
																<tr class="tr bg-white">
																	<th class="th">Name</th>
																	<th class="th">Type</th>
																	<th class="th">Prompt</th>
																	<th class="th">Values</th>
																</tr>
															</thead>
															<tbody class="tbody">
																<tr class="tr">
																	<td class="td">birth_certificate_infant_or_fetal_death_section</td>
																	<td class="td">list</td>
																	<td class="td">Birth/Fetal Death Certificate- Infant/Fetal Section</td>
																	<td class="td">
																		<table class="table table--plain mb-0">
																			<thead class="thead">
																				<tr class="tr">
																					<th class="th">Value</th>
																					<th class="th">Description</th>
																				</tr>
																			</thead>
																			<tbody class="tbody">
																				<tr class="tr">
																					<td class="td">9999</td>
																					<td class="td">(blank)</td>
																				</tr>
																				<tr class="tr">
																					<td class="td">1</td>
																					<td class="td">In Progress</td>
																				</tr>
																				<tr class="tr">
																					<td class="td">2</td>
																					<td class="td">Completed</td>
																				</tr>
																				<tr class="tr">
																					<td class="td">3</td>
																					<td class="td">Not Available</td>
																				</tr>
																				<tr class="tr">
																					<td class="td">4</td>
																					<td class="td">Not Applicable</td>
																				</tr>
																			</tbody>
																		</table>
																	</td>
																</tr>
															</tbody>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</div>

									<div class="mt-3" style="border: 1px solid #bbbbbb; overflow:hidden; overflow-y: auto; max-height: 346px;">
										<table class="table table--plain mb-0">
											<thead class="thead">
												<tr class="tr bg-tertiary">
													<th class="th" colspan="2">
														<span class="row no-gutters justify-content-between">
															<span id="de_identified_count">Fields that have been de-identified (${answer_summary.de_identified_field_set.length})</span>
															<button class="anti-btn" onclick="fooBarDeselectAll()">Deselect All</button>
														</span>
													</th>
												</tr>
											</thead>
											<tbody class="tbody" id="selected_de_identified_field_list">
												<tr class="tr">
													<td class="td text-center" width="38">
														<input id="unique_id_1" type="checkbox" checked />
														<label for="unique_id_1" class="sr-only"></label>
													</td>
													<td class="td">
														<table class="table table--plain mb-0">
															<thead class="thead">
																<tr class="tr">
																	<th class="th" colspan="4">Path: <span class="font-weight-normal">date_of_death</span></th>
																</tr>
															</thead>
															<thead class="thead">
																<tr class="tr bg-white">
																	<th class="th">Name</th>
																	<th class="th">Type</th>
																	<th class="th">Prompt</th>
																	<th class="th">Values</th>
																</tr>
															</thead>
															<tbody class="tbody">
																<tr class="tr">
																	<td class="td">date_created</td>
																	<td class="td">date</td>
																	<td class="td">date_created</td>
																	<td class="td"></td>
																</tr>
															</tbody>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</li>
						</ul>
					</li>

					<li class="mb-4">
						<p class="mb-3">Please select which cases you want to include in the export?</p>
						<p>
							<label><input id="case_filter_type_all" checked="true" type="radio" name="case_filter_type" value="all" onclick="case_filter_type_click(this)" /> All<label>
							<label><input id="case_filter_type_custom" type="radio" name="case_filter_type" value="custom" onclick="case_filter_type_click(this)" /> Custom</label>
						</p>
						<ul class="font-weight-bold list-unstyled" id="custom_case_filter" style="display:none">
							<li class="mb-4" >

								<div class="form-inline mb-2">
									<label for="filter_search_text" class="font-weight-normal mr-2">Search for:</label>
									<input type="text" class="form-control mr-2" id="filter_search_text"  value=""><button type="button" class="btn btn-tertiary" alt="clear search">Clear</button>
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
									<input id="filter_decending" type="checkbox"  checked="true">
								</div>

								<div class="form-inline mt-4">
									<button type="button" class="btn btn-secondary" alt="search" onclick="apply_filter_button_click()">Apply Filters</button>
								</div>

								<!-- <p class="mb-3 font-weight-bold">Date of death <small class="d-block mt-1">You can also add multiple date ranges</small></p>
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
										<button type="button" class="btn btn-secondary" onclick="apply_filter_button_click()">search</button>
									</div>
								</form> -->
							</li>

							<li class="mb-3" style="overflow:hidden; overflow-y: auto; height: 260px; border: 1px solid #ced4da;">
								<div class="table-pagination row align-items-center no-gutters pl-2 pr-2 pt-1 pb-1">
									<div class="col">
										<div class="row no-gutters">
											<p class="mb-0">Total Records: <strong>3</strong></p>
											<p class="mb-0 ml-2 mr-2">|</p>
											<p class="mb-0">Viewing Page(s): <strong>1</strong> of <strong>1</strong></p>
										</div>
									</div>
									<div class="col row no-gutters align-items-center justify-content-end">
										<p class="mb-0">Select by page:</p>
										<button type="button" class="table-btn-link btn btn-link" alt="select page 1" onclick="g_ui.case_view_request.page=1;get_case_set();">1</button>
										<button type="button" class="table-btn-link btn btn-link" alt="select page 2" onclick="g_ui.case_view_request.page=2;get_case_set();">2</button>
										<button type="button" class="table-btn-link btn btn-link" alt="select page 3" onclick="g_ui.case_view_request.page=3;get_case_set();">3</button>
									</div>
								</div>
								<table class="table table--plain m-0">
									<thead class="thead">
										<tr class="tr bg-tertiary">
											<th class="th" colspan="14">
												<span class="row no-gutters justify-content-between">
													<span>Filtered Cases</span>
													<button class="anti-btn" onclick="fooBarSelectAll()">Select All</button>
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
								<!-- <ul class="row no-gutters list-unstyled pl-0">
									<li class="m-0 mr-2">
										<button class="link" >Select all</button>
									</li>
								</ul> -->
								<!-- <ul id="search_result_list" class="zebra-list list-unstyled"></ul> -->
							</li>

							<li class="" style="overflow:hidden; overflow-y: auto; height: 260px; border: 1px solid #ced4da;">
								<table class="table table--plain mb-0">
									<thead class="thead">
										<tr class="tr bg-tertiary">
											<th class="th" colspan="14">
												<span class="row no-gutters justify-content-between">
													<span id="exported_cases_count">Cases to be included in export (${answer_summary.case_set.length}):</span>
													<button class="anti-btn" onclick="fooBarSelectAll()">Deselect All</button>
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
										<!-- items get dynamically generated -->
										${render_selected_case_list()}
									</tbody>
								</table>
								<!-- <nav class="row no-gutters align-items-end justify-content-between p-2 bg-quaternary" style="border-bottom: 1px solid #ced4da;">
									<h3 class="h5 m-0 mr-2">Cases to be included in export:</h3>
									<ul class="row no-gutters list-unstyled pl-0">
										<li class="m-0 mr-2">
											<button class="link" >Remove all</button>
										</li>
									</ul>
								</nav>
								<ul id="selected_case_list" class="zebra-list list-unstyled">
									${render_selected_case_list()}
								</ul> -->
							</li>

						</ul>
					</li>
				</ol>
			</div>
		</div>

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
		
		<div class="row">
			${export_queue_comfirm_render(p_queue_data)}		
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



function export_queue_comfirm_render(p_queue_data)
{
	var result = `
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
								From: <span data-prop="filter/date_range/from">${capitalizeFirstLetter(g_filter.date_range[0].from)}</span>
								,
								To: <span data-prop="filter/date_range/to">${capitalizeFirstLetter(g_filter.date_range[0].to)}</span>
							</li>
						</ul>
					</li>
					<!--
					<li>
						Date of Death:
						<ul>
							<li>Year: <span data-prop="filter/date_of_death/year">${capitalizeFirstLetter(g_filter.date_of_death.year[0])}</span></li>
							<li>Month: <span data-prop="filter/date_of_death/month">${capitalizeFirstLetter(g_filter.date_of_death.month[0])}</span></li>
							<li>Day: <span data-prop="filter/date_of_death/day">${capitalizeFirstLetter(g_filter.date_of_death.day[0])}</span></li>
						</ul>
					</li>
					-->
					<li>
						Case status(s):
						<ul data-prop="filter/case_status">
							<li>${capitalizeFirstLetter(g_filter.case_status[0])}</span></li>
						</ul>
					</li>
					<li>
						Case jurisdiction(s):
						<ul data-prop="filter/case_jurisdiction">
							<li>${capitalizeFirstLetter(g_filter.case_jurisdiction[0])}</span></li>
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
</div>`;

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

	render_selected_case_list2();
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

			g_case_view_request.respone_rows = case_view_response.rows;
			
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
					<tr class="tr">
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
		
		}
	)
};


function render_selected_case_list()
{
	let result = [];
	//result.push("<li><input type='checkbox' /> select all</li>");
	for(let i = 0; i < answer_summary.case_set.length; i++)
	{
		let item_id = answer_summary.case_set[i];
		let value_list = selected_dictionary[item_id];

		result.push(`<li class="bar"><input value=${item_id} type="checkbox" onclick="result_checkbox_click(this)" checked="true" /> ${value_list.jurisdiction_id} ${value_list.last_name},${value_list.first_name} ${value_list.date_of_death_year}/${value_list.date_of_death_month} ${value_list.date_last_updated} ${value_list.last_updated_by} agency_id:${value_list.agency_case_id} rc_id:${value_list.record_id}</li>`);
	}

	return result.join("");
}


function render_selected_case_list2()
{
	let el = document.getElementById('selected_case_list');
	let html = [];
	//html.push("<li><input type='checkbox' /> select all</li>");
	for(let i = 0; i < answer_summary.case_set.length; i++)
	{


		let item_id = answer_summary.case_set[i];


		let value_list = selected_dictionary[item_id];

		// Items generated after user ADDS applied filters
		//html.push(`<li class="baz"><input value=${item_id} type="checkbox" onclick="result_checkbox_click(this)" checked="true" /> ${value_list.jurisdiction_id} ${value_list.last_name},${value_list.first_name} ${value_list.date_of_death_year}/${value_list.date_of_death_month} ${value_list.date_last_updated} ${value_list.last_updated_by} agency_id:${value_list.agency_case_id} rc_id:${value_list.record_id}</li>`);

		let checked = "";

		let index = answer_summary.case_set.indexOf(item_id);
		if(index > -1)
		{
			checked = "checked=true"
		}

		// Items generated after user applies filters
		html.push(`
			<tr class="tr">
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

	el.innerHTML = html.join("");
}


function render_de_identified_search_result()
{
	let de_identify_search_result_list = document.getElementById("de_identify_search_result_list");
	let de_identify_form_filter = document.getElementById("de_identify_form_filter");

	let de_identify_search_text = document.getElementById("de_identify_search_text");

	let selected_form = de_identify_form_filter.value;
	let result = []

	render_de_identified_search_result_item(result, g_metadata, "", selected_form, de_identify_search_text.value);

	de_identify_search_result_list.innerHTML = result.join("");
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

		let item_id = (p_path + "-" + p_metadata.name).replace(/\//g,"-");
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
			<table class="table table--plain mb-0">
				<thead class="thead">
					<tr class="tr">
						<th class="th" colspan="4">Path: <span class="font-weight-normal">${p_path}</span></th>
					</tr>
				</thead>
				<thead class="thead">
					<tr class="tr bg-white">
						<th class="th">Name</th>
						<th class="th">Type</th>
						<th class="th">Prompt</th>
						<th class="th">Values</th>
					</tr>
				</thead>
				<tbody class="tbody">
					<tr class="tr">
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

function render_de_identify_form_filter()
{
	let de_identify_form_filter = document.getElementById("de_identify_form_filter");

	let result = [];

	result.push(`<option value="">(Any Form)</option>`)

	for(let i = 0; i < g_metadata.children.length; i++)
	{
		let item = g_metadata.children[i];

		if(item.type.toLowerCase() == "form")
		{
			result.push(`<option value="${item.name}">${item.prompt}</option>`)
		}
		
	}

	de_identify_form_filter.innerHTML = result.join("");
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

	render_selected_de_identified_list();
	render_de_identified_search_result();
}


function render_selected_de_identified_list()
{
	let el = document.getElementById('selected_de_identified_field_list');
	let html = [];
	//html.push("<li><input type='checkbox' /> select all</li>");
	for(let i = 0; i < answer_summary.de_identified_field_set.length; i++)
	{


		let item_id = answer_summary.de_identified_field_set[i];


		let value_list = selected_metadata_dictionary[item_id];

		// Items generated after user ADDS applied filters
		//html.push(`<li class="baz"><input value=${item_id} type="checkbox" onclick="result_checkbox_click(this)" checked="true" /> ${value_list.jurisdiction_id} ${value_list.last_name},${value_list.first_name} ${value_list.date_of_death_year}/${value_list.date_of_death_month} ${value_list.date_last_updated} ${value_list.last_updated_by} agency_id:${value_list.agency_case_id} rc_id:${value_list.record_id}</li>`);

		let checked = "";

		let index = answer_summary.de_identified_field_set.indexOf(item_id);
		if(index > -1)
		{
			checked = "checked=true"
		}



		html.push(`
		<tr class="tr">
		<td class="td text-center" width="38">
			<input id="unique_id_1" type="checkbox" onclick="de_identified_result_checkbox_click(this)" value="${item_id}"  ${checked} />
			<label for="unique_id_1" class="sr-only">unique_id_1</label>
		</td>
		<td class="td">
			<table class="table table--plain mb-0">
				<thead class="thead">
					<tr class="tr">
						<th class="th" colspan="4">Path: <span class="font-weight-normal">${item_id.replace(/-/g,"/")}</span></th>
					</tr>
				</thead>
				<thead class="thead">
					<tr class="tr bg-white">
						<th class="th">Name</th>
						<th class="th">Type</th>
						<th class="th">Prompt</th>
						<th class="th">Values</th>
					</tr>
				</thead>
				<tbody class="tbody">
					<tr class="tr">
						<td class="td">${value_list.name}</td>
						<td class="td">${value_list.type}</td>
						<td class="td">${value_list.prompt}</td>
						<td class="td"></td>
					</tr>
				</tbody>
			</table>
		</td>
		</tr>
		`);
	}

	el.innerHTML = html.join("");
}


function case_filter_type_click(p_value)
{
	var custom_case_filter = document.getElementById("custom_case_filter");


	if(p_value.value.toLowerCase() == "custom")
	{
		custom_case_filter.style.display = "block";
	}
	else
	{
		custom_case_filter.style.display = "none";
	}
}

function de_identify_filter_type_click(p_value)
{
	var de_identify_filter = document.getElementById("de_identify_filter");
/*

setAnswerSummary(event).then(updateSummarySection(event)).then(handleElementDisplay(event, 'block'))

*/
	if(p_value.value.toLowerCase() == "custom")
	{
		de_identify_filter.style.display = "block";
	}
	else
	{
		de_identify_filter.style.display = "none";
	}
}