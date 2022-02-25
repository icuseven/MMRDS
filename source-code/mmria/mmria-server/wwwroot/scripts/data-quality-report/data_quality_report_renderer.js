// Data Quality Report
var selectedQuarter;
var reportType;
var jurisdiction;
var jurisdictionExclude;

function data_quality_report_render(p_quarters) 
{
	var result = [];
	var data_quality_report_quarters_list = render_data_quality_report_quarters(p_quarters);
	selectedQuarter = p_quarters[0];
	reportType = 'Summary';
	jurisdiction = 'New York';
	jurisdictionExclude = '';

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
						<label for="quarters-list" class="mb-0 font-weight-bold mr-2">Select Quarter:</label>
						<select 
							name="quarters-list"
							id="quarters-list"
							onchange="updateQuarter(event)"
						>	
							${data_quality_report_quarters_list}
						</select>
					</div>
					<div class="mb-4">
						<label for="report-type" class="mb-0 font-weight-bold mr-2">Select Report Type:</label>
						<select
							name="report-type"
							id="report-type"
							onchange="updateReportType(event)"
						>
							<option value="Summary">Summary Report</option>
							<option value="Detail">Detail Report</option>
							<option value="Summary & Detail">Summary & Detail Report</option>
						</select>
					</div>
					<div class="mb-4">
						<label for="jurisdiction" class="mb-0 font-weight-bold mr-2">Select Jurisdiction:</label>
						<select
							name="jurisdiction"
							id="jurisdiction"
							onchange="updateJurisdiction(event)"
						>
							<option value="New York">New York</option>
							<option value="New York City">New York City</option>
							<option value="Brooklyn">Brooklyn</option>
						</select>
					</div>
					<div class="mb-4">
						<label for="jurisdiction-exclude" class="mb-0 font-weight-bold mr-2">Select Jurisdiction to Exclude:</label>
						<select
							name="jurisdiction-exclude"
							id="jurisdiction-exclude"
							onchange="updateJurisdictionExclude(event)"
						>
						<option value="None">None</option>
						<option value="New York City">New York City</option>
						<option value="Brooklyn">Brooklyn</option>
					</select>
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
	selectedQuarter = e.target.value;
	renderQuarterInfo();
}

function updateReportType(e)
{
	reportType = e.target.value;
	renderQuarterInfo();
}

function updateJurisdiction(e)
{
	jurisdiction = e.target.value;
	renderQuarterInfo();
}

function updateJurisdictionExclude(e)
{
	jurisdictionExclude = ( e.target.value == 'None' ) ? '' : e.target.value;
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
	let result = [];

	// Build the dropdown list
	g_quarters.map((value, index) => {
		result.push(`<option value='${value}' ${(index == 0) ? ' selected' : ''}>${value}</option>`)
	});

	return result.join("");
}


async function download_data_quality_report_button_click()
{
    let selected_quarter = document.getElementById('quarters-list').value;
    let arr = selected_quarter.split("-");
    let quarter_number = parseFloat(`${arr[1].trim('"')}.${((parseInt(arr[0].replace("Q","")) - 1) * .25).toString().replace("0.","")}`);

    let dqr_detail_data = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/dqr-detail/${selected_quarter}`,
    });
      
		let detail_data = {
			questions: [
				{
					qid: 39,
					typ: 'Current Quarter, Missing',
					detail: [
						{
							num: 114,
							rec_id: 'WI-2016-8592',
							dt_death: '10/11/2016',
							dt_com_rev: '05/14/2021',
							ia_id: '6d632b47-4950-a4d1-fa17-e7368eaeefe',
						},
						{
							num: 115,
							rec_id: 'WI-2017-0052',
							dt_death: '10/02/2017',
							dt_com_rev: '11/20/2020',
							ia_id: '7e632b47-4950-a4d1-fa17-e7368eaeefe',
						},
						{
							num: 116,
							rec_id: 'WI-2017-4726',
							dt_death: '10/17/2017',
							dt_com_rev: '05/14/2021',
							ia_id: '6d632b47-4950-a4d1-fa17-e7368eaeefe',
						},
					],
				},
				{
					qid: 39,
					typ: 'Current Quarter, Unknown',
					detail: [],
				},
				{
					qid: 39,
					typ: 'Previous 4 Quarters, Missing',
					detail: [
						{
							num: 314,
							rec_id: 'WI-2016-8592',
							dt_death: '10/11/2016',
							dt_com_rev: '05/14/2021',
							ia_id: '6d632b47-4950-a4d1-fa17-e7368eaeefe',
						},
						{
							num: 315,
							rec_id: 'WI-2017-0052',
							dt_death: '10/02/2017',
							dt_com_rev: '11/20/2020',
							ia_id: '7e632b47-4950-a4d1-fa17-e7368eaeefe',
						},
						{
							num: 316,
							rec_id: 'WI-2017-4726',
							dt_death: '10/17/2017',
							dt_com_rev: '05/14/2021',
							ia_id: '6d632b47-4950-a4d1-fa17-e7368eaeefe',
						},
					],
				},
				{
					qid: 39,
					typ: 'Previous 4 Quarters, Unknown',
					detail: [],
				},
				{
					qid: 40,
					typ: 'Current Quarter, Missing',
					detail: [
						{
							num: 1,
							rec_id: 'OR-2019-4806',
							dt_death: '05/27/2009',
							dt_com_rev: '07/19/2021',
							ia_id: 'd1632b47-4950-a4d1-fa17-e7368eaeefe',
						},
						{
							num: 2,
							rec_id: 'TN-2020-4226',
							dt_death: '01/10/2019',
							dt_com_rev: '08/31/2021',
							ia_id: '2c632b47-4950-a4d1-fa17-e7368eaeefe',
						},
					],
				},
			],
			cases: [
				{
					rec_id: 'WI-2017-7951',
					ab_case_id: '',
					dt_death: '06/10/2017',
					dt_com_rev: '09/11/2020',
					ia_id: '2c632b47-4950-a4d1-fa17-e7368eaeefe',
					detail: [
						{
							qid: 19,
							typ: 'Previous 4 Quarters, Missing',
						},
						{
							qid: 29,
							typ: 'Previous 4 Quarters, Missing',
						},
						{
							qid: 32,
							typ: 'Previous 4 Quarters, Missing',
						},
						{
							qid: 39,
							typ: 'Previous 4 Quarters, Unknown',
						},
					]
				},
				{
					rec_id: 'WV-2019-1760',
					ab_case_id: '2019EleH',
					dt_death: '01/15/2019',
					dt_com_rev: '09/09/2021',
					ia_id: '8f032b47-4950-a4d1-fa17-e7368eaeefe',
					detail: [
						{
							qid: 19,
							typ: 'Current Quarter, Unknown',
						},
						{
							qid: 38,
							typ: 'Current Quarter, Missing',
						},
						{
							qid: 39,
							typ: 'Current Quarter, Unknown',
						},
					]
				},
			],
			total: 667,
		};

    let summary_data = {
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

		let cnt = 0;

    for(let i = 0; i < dqr_detail_data.docs.length; i++)
    {
        let item = dqr_detail_data.docs[i];

        if ( item.add_quarter_number <= quarter_number ) 
        {
            // Table One - 01) to 05)
						summary_table_01_05( item );

						// Table Two - 06) to 09)
						summary_table_06_09( item );

						// Table Three - 10) to 34)
						summary_table_10_34( item );

						// Table Four - 35) to 43)
						summary_table_35_43( item );

						// Table Five - 44) to 45)
						summary_table_44_45( item );

						// Table Six - 46) to 49)
						summary_table_46_49( item );
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

		// Table One Summary
		function summary_table_01_05( item )
		{
			// Accumulate Table One data
			summary_data.n01 += item.n01;
			summary_data.n02 += item.n02;

			// Special handling for Question 03)
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
			summary_data.n06 += item.n06;
		}

		// Table Two Summary
		function summary_table_06_09( item )
		{
			// Add current quarter
			if 
			( 
					item.add_quarter_number == quarter_number
			) 
			{
					summary_data.n07 += item.n07;
			}
			// Not sure what this does
			if 
			( 
					item.add_quarter_number < quarter_number &&
					item.add_quarter_number >= quarter_number - 1
			) 
			{
					summary_data.n08 += item.n08;
					summary_data.n09 += item.n09;
			}
		}

		// Table Three Summary
		function summary_table_10_34( item )
		{
			// Add line 10) thru 34)
			let startLoop = 10;
			let endLoop = 34;
			for ( let i = startLoop; i <= endLoop; i++ )
			{
				// Build the field name
				let fld = 'n' + i;
				// Check to see if this is current quarter
				if ( item.add_quarter_number == quarter_number )
				{
					summary_data[fld].s.mn += item[fld].m;
					summary_data[fld].s.un += item[fld].u;
				}
				if 
				( 
						item.add_quarter_number < quarter_number &&
						item.add_quarter_number >= quarter_number - 1
				)
				{
					summary_data[fld].p.mn += item[fld].m;
					summary_data[fld].p.un += item[fld].u;
				}
			}
		}

		// Table Four Summary
		function summary_table_35_43( item )
		{
			// console.log('in summary_table_35_43');
		}

		// Table Five Summary
		function summary_table_44_45( item )
		{
			let startLoop = 44;
			let endLoop = 45;
			for ( let i = startLoop; i <= endLoop; i++ )
			{
				// Build the field name
				let fld = 'n' + i;
				// Check to see if this is current quarter
				if ( item.add_quarter_number == quarter_number )
				{
					summary_data[fld].s.tn += item[fld].t;
					summary_data[fld].s.pn += item[fld].p;
				}
				if 
				( 
						item.add_quarter_number < quarter_number &&
						item.add_quarter_number >= quarter_number - 1
				)
				{
					summary_data[fld].p.tn += item[fld].t;
					summary_data[fld].p.pn += item[fld].p;
				}
			}
		}
		
		// Table Six Summary
		function summary_table_46_49( item )
		{
		}

		// Calculate the summary percentages
		function calculate_summary_percentages()
		{
			// This is a test to see if we can correctly calculate the percentages
			let startLoop = 44;
			let endLoop = 45;
			for ( let i = startLoop; i <= endLoop; i++ )
			{
				// Build the field name
				let fld = 'n' + i;

				// Check for zero before doing the divide
				if ( summary_data[fld].s.pn > 0 && summary_data[fld].s.tn > 0 )
				{
					summary_data[fld].s.pp = summary_data[fld].s.pn / summary_data[fld].s.tn;
				}
				if ( summary_data[fld].p.pn > 0 && summary_data[fld].p.tn > 0 )
				{
					summary_data[fld].p.pp = summary_data[fld].p.pn / summary_data[fld].p.tn;
				}
			}
		}

		// Get the previous 4 quarters based on the selected quarter
		function getPreviousFourQuarters( q )
		{
			let qStr = '';

			let arr = selected_quarter.split("-");
			let qtr = parseInt(arr[0][1]);
			let yy = parseInt(arr[1]);
			
			for ( let i = 0; i < 4; i++ )
			{
				// Check qtr to see if it is 1 - if so, then set to 4 and decrement yy
				qtr--;
				if ( qtr == 0 )
				{
					qtr = 4;
					yy--;
				}
				qStr += `Q${qtr}-${yy}`;

				if ( i < 3 ) qStr += ', ';
			}
			// console.log('in getPrev 4 Q: ', arr, ' - ', qStr );

			return qStr;
		}

		calculate_summary_percentages();

		console.log('dqr_detail_data: ', dqr_detail_data);
		console.log('summary_data: ', summary_data);

		// Create Summary Report if reportType is Summary or Summary & Detail
		if ( reportType == 'Summary' || reportType == 'Summary & Detail')
		{
			let headers = {
				title: `Data Quality Report for: ${ jurisdiction }` + `${ ( jurisdictionExclude.length > 0 ? ' - Exclude ' + jurisdictionExclude : '')}`,
				subtitle: `Reporting Period: ${ selected_quarter }`,
			};

			await create_pdf(
				'Summary', summary_data, selected_quarter, headers );
		}

		// Create Detail Report if reportType is Detail or Summary & Detail
		if ( reportType == 'Detail' || reportType == 'Summary & Detail')
		{
			let headers = {
				title: `Data Quality Report Details for: ${ jurisdiction }` + `${ ( jurisdictionExclude.length > 0 ? ' - Exclude ' + jurisdictionExclude : '')}`,
				subtitle: `Reporting Period: ${ selected_quarter } - Previous 4 Periods: ${ getPreviousFourQuarters( selected_quarter )}`,
			};
			
			await create_pdf( 'Detail', detail_data, selected_quarter, headers );
		}
}

// Function to call the pdfMake stuff
async function create_pdf( report_type, data, quarter, headers )
{
	// Call to pdfMake
	await create_data_quality_report_pdf( report_type, data, quarter, headers );
}
