
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
								<div class="mb-4" id="case_folder"></div>
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



function render_case_folder_include_list()
{
  const el = document.getElementById("case_folder");
  const html_array = [];

	// Only run this if there is more than 1 case_folder
	if ( has_multiple_case_folder() )
	{
		//  Add title
		html_array.push("<div class='mb-0 font-weight-bold mr-2' >Select Cases From:</div>");

    for(var i = 0; i < g_case_folder_list.length; i++)
    {
        var child = g_case_folder_list[i];
				html_array.push("<div>")
				html_array.push("<input value='");
				html_array.push(child.replace(/'/g, "&#39;"));
				html_array.push("' ");
				html_array.push("type='checkbox' ");
				html_array.push("name='case_folder_checkbox' ");
				html_array.push("onchange='updatecase_folder(event)' ");
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

function updatecase_folder(e)
{
	var included_case_folder = [];

	var checkboxes = document.getElementsByName('case_folder_checkbox');

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

	// Get the Generate button id - disable if no case_folder items in array
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

    const selected_case_folder_list = get_selected_folder_list();

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

    let summary_data = get_new_summary_data();


    for(let i = 0; i < dqr_detail_data.docs.length; i++)
    {
        let item = dqr_detail_data.docs[i];

        if
        (
            selected_case_folder_list.indexOf("/") < 0 &&
            selected_case_folder_list.indexOf(item.case_folder) < 0
        )
        {
            continue;
        }


        if
        (
            selected_case_folder_list.indexOf("/") > -1 &&
            item.case_folder != "/"
        )
        {
            if
            (           
                g_case_folder_list.indexOf(item.case_folder) < 0 &&
                selected_case_folder_list.indexOf(item.case_folder) < 0
            )
            {

            }
            else
            {
                continue;
            }
        }
        

        if ( item.add_quarter_number <= quarter_number ) 
        {

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
            item.add_quarter_number == quarter_number
        ) 
        {
            summary_data.n06 += item.n06;
            summary_data.n07 += item.n07;


            for(let i = 10; i < 50; i++)
            {
                let fld = `n${i}`;

                // 10-44
                if(i < 45)
                {
                    summary_data[fld].s.mn += item[fld].m;
                    summary_data[fld].s.un += item[fld].u;
                }
                else
                {
                    summary_data[fld].s.tn += item[fld].t;
                    summary_data[fld].s.pn += item[fld].p;
                }
            }
        }

        if 
        ( 
            item.add_quarter_number < quarter_number &&
            item.add_quarter_number >= quarter_number - 1
        ) 
        {
            summary_data.n08 += item.n08;
            summary_data.n09 += item.n09;

            for(let i = 10; i < 50; i++)
            {
                let fld = `n${i}`;

                // 10-44
                if(i < 45)
                {
                    summary_data[fld].p.mn += item[fld].m;
                    summary_data[fld].p.un += item[fld].u;
                }
                else
                {
                    summary_data[fld].p.tn += item[fld].t;
                    summary_data[fld].p.pn += item[fld].p;
                }
            }

        }
    }

    // calculate summary percentages
    let startLoop = 44;
    let endLoop = 49;
    for ( let i = startLoop; i <= endLoop; i++ )
    {

        let fld = 'n' + i;

        if ( summary_data[fld].s.pn > 0 && summary_data[fld].s.tn > 0 )
        {
            summary_data[fld].s.pp = (summary_data[fld].s.pn / summary_data[fld].s.tn) * 100;
        }

        if ( summary_data[fld].p.pn > 0 && summary_data[fld].p.tn > 0 )
        {
            summary_data[fld].p.pp = (summary_data[fld].p.pn / summary_data[fld].p.tn) * 100;
        }
    }

    //console.log('dqr_detail_data: ', dqr_detail_data);
    //console.log('summary_data: ', summary_data);


    if 
    ( 
        g_model.reportType == 'Summary' || 
        g_model.reportType == 'Summary & Detail'
    )
    {
        let headers = {
            title: `Data Quality Report for: ${ getCaseFolder() }`,
            subtitle: `Reporting Period: ${ g_model.selectedQuarter }`,
        };

        await create_pdf(
            'Summary', summary_data, g_model.selectedQuarter, headers );
    }


    if 
    ( 
        g_model.reportType == 'Detail' || 
        g_model.reportType == 'Summary & Detail'
    )
    {
        let headers = {
            title: `Data Quality Report Details for: ${ getCaseFolder() }`,
            subtitle: `Reporting Period: ${ g_model.selectedQuarter } - Previous 4 Periods: ${ getPreviousFourQuarters()}`,
        };
        

        // *****
        // Uncomment the lines below to test for empty detail report that show empty message
        // *****

        // let detail_data2 = {
        // 	questions: [],
        // 	cases: [],
        // 	total: 0,
        // };

        await create_pdf( 'Detail', detail_data, g_model.selectedQuarter, headers );
    }
}



function getCaseFolder()
{
    var case_folder_display = '/';
    var case_folder_exclude = ' - Exclude: ';


    if ( g_case_folder_list.length == 1 )
    {
        case_folder_display = '/';
        return case_folder_display;
    }

    
    if ( g_case_folder_list.length == g_model.includedCaseFolder.length )
    {
        case_folder_display = '/';
        return case_folder_display;
    }

    if ( g_model.includedCaseFolder[0] == '/' )
    {

        case_folder_display = '/';


        g_case_folder_list.map( (j, i) => {
            if ( j != '/' )
            {
                case_folder_exclude += ( g_model.includedCaseFolder.indexOf(j) > -1 ) ? '' : j + ', ';
            }
        });


        case_folder_display += case_folder_exclude.substring(0, (case_folder_exclude.length - 2));
        
        return case_folder_display;
    }


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


function getPreviousFourQuarters()
{
    let qStr = '';

    let arr = g_model.selectedQuarter.split("-");
    let qtr = parseInt(arr[0][1]);
    let yy = parseInt(arr[1]);
    
    for ( let i = 0; i < 4; i++ )
    {
        
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


async function create_pdf( report_type, data, quarter, headers )
{
	await create_data_quality_report_pdf( report_type, data, quarter, headers );
}
