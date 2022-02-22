// Data Quality Report
var selectedQuarter;
var reportType;

function data_quality_report_render(p_quarters) 
{
	var result = [];
	var data_quality_report_quarters_list = render_data_quality_report_quarters(p_quarters);
	selectedQuarter = p_quarters[0];
	reportType = 'Summary';

	result.push(`
		<div class="row">
			<div class="col">
				<div class="font-weight-bold pl-3">
					<div class="mb-4">
						<div id="quarter_msg" class="mb-3">
							${selectedQuarter} is the currently selected quarter that will be used to compare to the previous 4 quarters.
						</div>
					</div>
					<div class="mb-4">
						<label for="quarters-list" class="mb-0 font-weight-bold mr-2">Select Export Quarter:</label>
						<select 
							name="quarters-list"
							id="quarters-list"
							onchange="updateQuarter(event)"
						>	
							${data_quality_report_quarters_list}
						</select>
					</>
					</div>
					<div class="mb-4">
						<div>Select Report Type:</div>
						<div>
							<input type="radio" id="summary-report" name="report-type" value="Summary" onclick="updateReportType(event)" checked>
							<label for="summary-report" class="mb-0 font-weight-normal mr-2">Summary Report</label>
						</div>
						<div>
							<input type="radio" id="detail-report" name="report-type" value="Detail" onclick="updateReportType(event)">
							<label for="detail-report" class="mb-0 font-weight-normal mr-2">Detail Report</label>
						</div>
						<div>
							<input type="radio" id="summary-detail-report" name="report-type" value="Summary & Detail" onclick="updateReportType(event)">
							<label for="summary-detail-report" class="mb-0 font-weight-normal mr-2">Summary & Detail Report</label>
						</div>
					</div>
				</div>
				<div class="card-footer bg-gray-13">
					<button 
						id="quarter_btn" 
						class="btn btn-primary btn-lg w-100" 
						onclick="download_data_quality_report_button_click()"
					>
						Generate ${reportType} Report for ${selectedQuarter}
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

function updateReportType(e)
{
	console.log('updateReportType: ', e.target.value);
	reportType = e.target.value;
	renderQuarterInfo();
}

function renderQuarterInfo() 
{
	// Update the message to show the currently selected quarter
	document.getElementById('quarter_msg').innerHTML =
		`${selectedQuarter} is the currently selected quarter that will be used to compare to the previous 4 quarters.`;

	// Update the button to show the currently selected quarter
	document.getElementById('quarter_btn').innerHTML =
		`Generate ${reportType} Report for ${selectedQuarter}`;
}

function render_data_quality_report_quarters() 
{
	const result = [];

	console.log('in render_data_quality_report_quarters');

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
    // const selected_quarter = "Q3-2021";

    // 2021.5

    const arr = selected_quarter.split("-");
    const quarter_number = parseFloat(`${arr[1].trim('"')}.${((parseInt(arr[0].replace("Q","")) - 1) * .25).toString().replace("0.","")}`);

    const dqr_detail_data = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/dqr-detail/${selected_quarter}`,
    });
      

    const summary_data = {
        n01:  0,
        n02 : 0,
        n03 : [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        n04 : 0,
        n05 : 0,
        n06 : 0,
        n07 : 0,
        n08 : 0,
        n09 : 0,
				n10: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n11: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n12: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n13: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n14: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n15: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n16: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n17: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n18: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n19: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n20: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n21: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n22: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n23: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n24: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n25: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n26: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n27: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n28: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n29: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n30: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n31: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n32: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n33: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n34: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n35: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n36: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n37: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n38: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n39: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n40: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n41: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n42: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n43: {
					s: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
					p: { mn: 0, mp: 0.0, un: 0, up: 0.0 },
				},
				n44: {
					s: { tn: 0, pn: 0, pp: 0.0 },
					p: { tn: 0, pn: 0, pp: 0.0 },
				},
				n45: {
					s: { tn: 0, pn: 0, pp: 0.0 },
					p: { tn: 0, pn: 0, pp: 0.0 },
				},
				n46: {
					s: { tn: 0, pn: 0, pp: 0.0 },
					p: { tn: 0, pn: 0, pp: 0.0 },
				},
				n47: {
					s: { tn: 0, pn: 0, pp: 0.0 },
					p: { tn: 0, pn: 0, pp: 0.0 },
				},
				n48: {
					s: { tn: 0, pn: 0, pp: 0.0 },
					p: { tn: 0, pn: 0, pp: 0.0 },
				},
				n49: {
					s: { tn: 0, pn: 0, pp: 0.0 },
					p: { tn: 0, pn: 0, pp: 0.0 },
				},
    }


    for(let i = 0; i < dqr_detail_data.docs.length; i++)
    {
        const item = dqr_detail_data.docs[i];

        // console.log('*** quarter: ', item.quarter_name);
        if ( item.add_quarter_number <= quarter_number ) 
        {
            //console.log('****** FOUND ONE: ', item.quarter_name);
            // Table One
            summary_data.n01 += item.n01;

            summary_data.n02 += item.n02;

            summary_data.n03[0] += item.n03[0];
            summary_data.n03[1] += item.n03[1];
            summary_data.n03[2] += item.n03[2];
            summary_data.n03[3] += item.n03[3];
            summary_data.n03[4] += item.n03[4];
            summary_data.n03[5] += item.n03[5];
            summary_data.n03[6] += item.n03[6];
            summary_data.n03[7] += item.n03[7];

            
            summary_data.n04 += item.n04;
            summary_data.n05 += item.n05;

            

        }
        
        if 
        ( 
            item.add_quarter_number == quarter_number && 
            item.n05 == 1
        ) 
        {
            summary_data.n06 += item.n06;
            summary_data.n07 += item.n07;
        }
        else if 
        ( 
            item.add_quarter_number < quarter_number &&
            item.add_quarter_number >= quarter_number - 1
        ) 
        {
            summary_data.n08 += item.n06;
            summary_data.n09 += item.n07;
        }


        if(item.add_quarter_number == quarter_number )
        {

        }
        else if
        (
            item.add_quarter_number < quarter_number &&
            item.add_quarter_number >= quarter_number - 1)
        {

        }



    }

				// This is just some test data to see if it works, and yep it works

				summary_data.n10.s.mn += 39;
				summary_data.n10.s.mp += 4.1;
				summary_data.n10.s.un += 21;
				summary_data.n10.s.up += 6.1;
				
				summary_data.n10.p.mn += 109;
				summary_data.n10.p.mp += 32.1;
				summary_data.n10.p.un += 88;
				summary_data.n10.p.up += 45.9;
				

		console.log('dqr_detail_data: ', dqr_detail_data);
		console.log('summary_data: ', summary_data);

    create_data_quality_report_download
    (
        summary_data, 
        selected_quarter, 
        'All Jurisdictions'
    );

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
	create_data_quality_report_download
    (
        {  n01:  7930 }, 
        selQuar, 
        jurisdiction
    );
}

