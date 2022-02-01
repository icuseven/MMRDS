function data_quality_report_render(p_quarters) {
	var result = [];
	var data_quality_report_quarters_list = render_data_quality_report_quarters( p_quarters );
	let selectedQuarter = p_quarters[0];

	result.push(`
		<div class="row">
			<div class="col">
				<div class="font-weight-bold pl-3">
					<div class="mb-4">
					<p id="quarter_msg" class="mb-3">${ selectedQuarter } is the currently selected quarter that will be used to compare to the previous 4 quarters.</p>
					<label for="quarters-data" class="mb-0 font-weight-normal mr-2">Select Export Type</label>
					<select 
						name="quarters-data"
						id="quarters-data"
						onchange="updateQuarter(event)"
					>	
						${ data_quality_report_quarters_list }
					</select>
					</div>
				</div>
				<div class="card-footer bg-gray-13">
					<button 
						id="quarter_btn" 
						class="btn btn-primary btn-lg w-100" 
						onclick="download_data_quality_report_pdf( '${selectedQuarter}'  )"
					>
						Export ${ selectedQuarter }
					</button>
				</div>
			</div>
		</div>
	`);

	return result;
}

function updateQuarter(e) 
{
	console.log('updateQuarter: ', e.target.value);
	selectedQuarter = e.target.value;
	renderQuarterInfo();
}

function download_data_quality_report_pdf( sq )
{
	console.log('Download the PDF: ');
	// create_data_quality_report_download('Data Goes Here', sq);
}

function renderQuarterInfo() {
	// Update the message to show the currently selected quarter
  document.getElementById('quarter_msg').innerHTML = 
		`${ selectedQuarter } is the currently selected quarter that will be used to compare to the previous 4 quarters.`;
	
	// Update the button to show the currently selected quarter
	document.getElementById('quarter_btn').innerHTML = 
		`Download ${ selectedQuarter } as PDF`;
}

function render_data_quality_report_quarters()
{
	const result = [];

	// Build the dropdown list
	g_quarters.map( (value, index) =>
	{
		result.push(`<option value='${ value }' ${(index == 0) ? ' selected' : ''}>${ value }</option>`)
	});

	return result.join("");
}
