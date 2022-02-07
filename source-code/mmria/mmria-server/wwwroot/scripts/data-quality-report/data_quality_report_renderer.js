// Data Quality Report

function data_quality_report_render(p_quarters) 
{
	var result = [];
	var data_quality_report_quarters_list = render_data_quality_report_quarters(p_quarters);
	let selectedQuarter = p_quarters[0];

	result.push(`
		<div class="row">
			<div class="col">
				<div class="font-weight-bold pl-3">
					<div class="mb-4">
						<p id="quarter_msg" class="mb-3">${selectedQuarter} is the currently selected quarter that will be used to compare to the previous 4 quarters.</p>
						<label for="quarters-list" class="mb-0 font-weight-normal mr-2">Select Export Quarter</label>
						<select 
							name="quarters-list"
							id="quarters-list"
							onchange="updateQuarter(event)"
						>	
							${data_quality_report_quarters_list}
						</select>
					</div>
					<div class="mb-4">
						<input type="checkbox" id="quarter-details" name="quarter-details">
						<label for="quarter-details" class="mb-0 font-weight-normal mr-2">Check for Detail Report</label>
					</div>
				</div>
				<div class="card-footer bg-gray-13">
					<button 
						id="quarter_btn" 
						class="btn btn-primary btn-lg w-100" 
						onclick="download_data_quality_report_button_click()"
					>
						Export ${selectedQuarter}
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

function renderQuarterInfo() 
{
	// Update the message to show the currently selected quarter
	document.getElementById('quarter_msg').innerHTML =
		`${selectedQuarter} is the currently selected quarter that will be used to compare to the previous 4 quarters.`;

	// Update the button to show the currently selected quarter
	document.getElementById('quarter_btn').innerHTML =
		`Export ${selectedQuarter}`;
}

function render_data_quality_report_quarters() 
{
	const result = [];

	console.log('in render_data_quality_report_quarters');

	console.log('dqr_notes_list: ', dqr_notes_list);

	// Build the dropdown list
	g_quarters.map((value, index) => {
		result.push(`<option value='${value}' ${(index == 0) ? ' selected' : ''}>${value}</option>`)
	});

	return result.join("");
}


async function download_data_quality_report_button_click()
{

	console.log('in download_data_quality_report_button_click');

    const selected_quarter = document.getElementById('quarters-list').value;

    const dqr_detail_data = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/dqr-detail/${selected_quarter}`,
    });
      

    console.log('dqr_detail_data: ', dqr_detail_data);

}
// This function will call the pdf function
function download_data_quality_report_pdf(selQuar) 
{
	// Find out if need details for the quarter report is needed
	let needDetails = document.getElementById('quarter-details');
	console.log('needDetails: ', needDetails.checked);

	// TODO: Figure out where to get the jurisdiction 
	let jurisdiction = 'All Jurisdictions';
	console.log('Download the PDF: ');
	create_data_quality_report_download('Data Goes Here', selQuar, jurisdiction, dqr_notes_list);
}

