// Data Quality Report

function data_quality_report_render(p_quarters) 
{
	var result = [];
	var data_quality_report_quarters_list = render_data_quality_report_quarters(p_quarters);
	g_model.selectedQuarter = p_quarters[0];
	g_model.reportType = 'Summary';

	result.push(`
        <div class="row">
            <div class="col">                    
                    <div class="mb-4">
                        <div><strong>Select Report Type:</strong></div>
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

            <div class="col">
                <div class="mb-4">
                    <label for="quarters-list" class="mb-0 font-weight-bold mr-2">Select Quarter:</label><br>
                    <select size=10 style="width:160px"
                        name="quarters-list"
                        id="quarters-list"
                        onchange="updateQuarter(event)"
                    >	
                        ${data_quality_report_quarters_list}
                    </select>
                </div>
                <div id="quarter_msg" class="mb-3">
                ${g_model.selectedQuarter} is the currently selected quarter that will be used to compare to the previous 4 quarters.
                </div>
            </div>
						<div class="col">   
								<div class="mb-4" id="jurisdiction"></div>
						</div>
        </div>

        <div class="row">
				<div class="card-footer bg-gray-13"  style="width:100%">
					<button 
						id="generate_btn" 
						class="btn btn-primary btn-lg w-100" 
						onclick="download_data_quality_report_button_click()"
					>
						Generate ${g_model.reportType} Report for ${g_model.selectedQuarter}
					</button>
				</div>
			</div>
		</div>
	`);

	return result;
}

function has_multiple_jurisdiction()
{
	return (g_jurisdiction_list.length > 1) ? true : false;
}

function render_jurisdiction_include_list()
{
  const el = document.getElementById("jurisdiction");
  const html_array = [];

	// Only run this if there is more than 1 jurisdiction
	if ( has_multiple_jurisdiction() )
	{
		//  Add title
		html_array.push("<div class='mb-0 font-weight-bold mr-2' >Select Cases From:</div>");

    for(var i = 0; i < g_jurisdiction_list.length; i++)
    {
        var child = g_jurisdiction_list[i];
				html_array.push("<div>")
				html_array.push("<input value='");
				html_array.push(child.replace(/'/g, "&#39;"));
				html_array.push("' ");
				html_array.push("type='checkbox' ");
				html_array.push("name='jurisdiction_checkbox' ");
				html_array.push("onchange='updateJurisdiction(event)' ");
				html_array.push("checked> ");
				html_array.push(`${ (child == "/") ? "Top Folder" : child}`);
				html_array.push("</div>")        
    }

    el.innerHTML = html_array.join("");
	}
	else
	{
		el.style.display = "none";
	}
}

function updateQuarter(e) 
{
	g_model.selectedQuarter = e.target.value;
	renderQuarterInfo();
}

function updateReportType(e)
{
	g_model.reportType = e.target.value;
	renderQuarterInfo();
}

function updateJurisdiction(e)
{
	var included_case_folder = [];

	var checkboxes = document.getElementsByName('jurisdiction_checkbox');

	for ( var checkbox of checkboxes )
	{
		if ( checkbox.checked )
		{
			included_case_folder.push(checkbox.value);

		}
	}


	// Replace the case folder with checked items
	g_model.includedCaseFolder = [...included_case_folder];
	renderQuarterInfo();
}

function renderQuarterInfo() 
{
	// Update the message to show the currently selected quarter
	document.getElementById('quarter_msg').innerHTML =
		`${g_model.selectedQuarter} is the currently selected quarter that will be used to compare to the previous 4 quarters.`;

	// Update the button to show the currently selected quarter
	document.getElementById('generate_btn').innerHTML =
		`Generate ${g_model.reportType} Report for ${g_model.selectedQuarter}`;

	// Get the Generate button id - disable if no jurisdiction items in array
	document.getElementById('generate_btn').disabled = ( g_model.includedCaseFolder.length == 0 ) ? true : false;

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
					summary_data[fld].s.pp = (summary_data[fld].s.pn / summary_data[fld].s.tn) * 100;
				}
				if ( summary_data[fld].p.pn > 0 && summary_data[fld].p.tn > 0 )
				{
					summary_data[fld].p.pp = (summary_data[fld].p.pn / summary_data[fld].p.tn) * 100;
				}
			}
		}

		// Get the case folder info for header display
		function getCaseFolder()
		{
			var case_folder_display = '/';
			var case_folder_exclude = ' - Exclude: ';

			// If only a single case folder then just return it
			if ( g_jurisdiction_list.length == 1 )
			{
				case_folder_display = '/';
				return case_folder_display;
			}

			// If g_jurisdiction_list.length is equal to g_model.includedCaseFolder.length - return Top Folder ('/')
			if ( g_jurisdiction_list.length == g_model.includedCaseFolder.length )
			{
				case_folder_display = '/';
				return case_folder_display;
			}

			// Now check to see if Top Folder is selected and other options are unselected
			if ( g_model.includedCaseFolder[0] == '/' )
			{
				// Add the Top Folder
				case_folder_display = '/';

				// Loop thru and add the excluded jurisdictions
				g_jurisdiction_list.map( (j, i) => {
					if ( j != '/' )
					{
						case_folder_exclude += ( g_model.includedCaseFolder.indexOf(j) > -1 ) ? '' : j + ', ';
					}
				});

				// Append excluded jursisdiction to case_folder_display
				case_folder_display += case_folder_exclude.substring(0, (case_folder_exclude.length - 2));
				
				return case_folder_display;
			}

			// If not Top Folder, then display what has been checked
			case_folder_display = '';
			g_model.includedCaseFolder.map( (j, i) => {
				if ( i > 0 )
				{
					case_folder_display += ', ';
				}
				case_folder_display += j;
			});

			return case_folder_display;
		}

		// Get the previous 4 quarters based on the selected quarter
		function getPreviousFourQuarters()
		{
			let qStr = '';

			let arr = g_model.selectedQuarter.split("-");
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

			return qStr;
		}

		calculate_summary_percentages();

		console.log('dqr_detail_data: ', dqr_detail_data);
		console.log('summary_data: ', summary_data);

		let jurisdiction = '*****';

		// Create Summary Report if reportType is Summary or Summary & Detail
		if ( g_model.reportType == 'Summary' || g_model.reportType == 'Summary & Detail')
		{
			let headers = {
				title: `Data Quality Report for: ${ getCaseFolder() }`,
				subtitle: `Reporting Period: ${ g_model.selectedQuarter }`,
			};

			await create_pdf(
				'Summary', summary_data, g_model.selectedQuarter, headers );
		}

		// Create Detail Report if reportType is Detail or Summary & Detail
		if ( g_model.reportType == 'Detail' || g_model.reportType == 'Summary & Detail')
		{
			let headers = {
				title: `Data Quality Report Details for: ${ getCaseFolder() }`,
				subtitle: `Reporting Period: ${ g_model.selectedQuarter } - Previous 4 Periods: ${ getPreviousFourQuarters()}`,
			};
			


			// Test for empty detail
			// let detail_data2 = {
			// 	questions: [],
			// 	cases: [],
			// 	total: 0,
			// };



			await create_pdf( 'Detail', detail_data, g_model.selectedQuarter, headers );
		}
}

// Function to call the pdfMake stuff
async function create_pdf( report_type, data, quarter, headers )
{
	// Call to pdfMake
	await create_data_quality_report_pdf( report_type, data, quarter, headers );
}
