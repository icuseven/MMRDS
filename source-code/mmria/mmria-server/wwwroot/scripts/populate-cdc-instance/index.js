'use strict';

var g_batch_list = [];
var g_batch_item_list = [];
var g_state_list = [];
var g_state_date_list = {};
var g_date_list = [];

var g_data = {
_id: "populate-cdc-intance",
    //"_rev": "22-755420131f3f91efa0bb10a3fb8816c6",
transfer_result : "",
transfer_status_number: 0,

state_list : [
{ is_included:true, name:"aa - " },
{ is_included:false, name:"afd - " },
{ is_included:false, name:"ak - " },
{ is_included:false, name:"al - " },
{ is_included:false, name:"anthc - " },
{ is_included:false, name:"ar - " },
{ is_included:false, name:"az - " },
{ is_included:false, name:"ca - " },
{ is_included:false, name:"cat - " },
//{ is_included:false, name:"cdc - " },
{ is_included:true, name:"chickasaw - " },
{ is_included:false, name:"co - " },
{ is_included:false, name:"ct - " },
{ is_included:false, name:"dc - " },
{ is_included:false, name:"de - " },
{ is_included:false, name:"demo - " },
{ is_included:false, name:"fl - " },
{ is_included:false, name:"ga - " },
{ is_included:false, name:"gl - " },
{ is_included:false, name:"gp - " },
{ is_included:false, name:"gu - " },
{ is_included:false, name:"hi - " },
{ is_included:false, name:"ia - " },
{ is_included:false, name:"ica - " },
{ is_included:false, name:"id - " },
{ is_included:false, name:"il - " },
{ is_included:false, name:"in - " },
{ is_included:false, name:"ks - " },
{ is_included:false, name:"ky - " },
{ is_included:false, name:"la - " },
{ is_included:false, name:"ma - " },
{ is_included:false, name:"md - " },
{ is_included:false, name:"me - " },
{ is_included:false, name:"mi - " },
{ is_included:false, name:"mn - " },
{ is_included:false, name:"mo - " },
{ is_included:false, name:"ms - " },
{ is_included:false, name:"mt - " },
{ is_included:false, name:"nc - " },
{ is_included:false, name:"nd - " },
{ is_included:false, name:"ne - " },
{ is_included:false, name:"nh - " },
{ is_included:false, name:"nj - " },
{ is_included:false, name:"nm - " },
{ is_included:false, name:"nn - " },
{ is_included:false, name:"nv - " },
{ is_included:false, name:"nwp - " },
{ is_included:false, name:"ny - " },
{ is_included:false, name:"oh - " },
{ is_included:false, name:"ok - " },
{ is_included:false, name:"or - " },
{ is_included:false, name:"pa - " },
{ is_included:false, name:"pr - " },
{ is_included:false, name:"ri - " },
{ is_included:false, name:"rm - " },
{ is_included:false, name:"sc - " },
{ is_included:false, name:"sd - " },
{ is_included:false, name:"sp - " },
{ is_included:false, name:"tn - " },
{ is_included:false, name:"tx - " },
{ is_included:false, name:"uset - " },
{ is_included:false, name:"ut - " },
{ is_included:false, name:"va - " },
{ is_included:false, name:"vt - " },
{ is_included:false, name:"wa - " },
{ is_included:false, name:"wi - " },
{ is_included:false, name:"wv - " },
{ is_included:false, name:"wy - " }

]


};

var batch_item_status = [
    "Validating",
    "InProcess",
    "NewCaseAdded",
    "ExistingCaseSkipped",
    "ImportFailed",
    "BatchRejected"
];


var batch_item_status_display = [
    "Validating",
    "In Process",
    "New Case Added",
    "Existing Case Skipped",
    "Import Failed",
    "Batch Rejected - Import Failed"
];

var batch_status = [
    "Validating",
    "InProcess",
    "Finished",
    "FinishedSynchronized",
    "Deleted",
    "DeletedSynchronized",
    "BatchRejected"
];


window.onload = async function()
{

    g_data = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/populate_cdc_instance`,
    });
    

    main();



}


function main()
{
    const el = document.getElementById("output");

    el.innerHTML = render();
}

function render()
{
    const result = [];

    result.push(render_transfer_status());
    result.push("<p style='text-align:right'>")
    result.push(render_save_button());
    result.push(render_submit_button());
    result.push("</p>")
    result.push(render_table());

    return result.join("");
}

function render_save_button()
{
    return `
<button id="generate_btn" class="btn btn-primary btn-lg " onclick="save_selections_button_click()">
Save Selections
</button>`;
}

function render_submit_button()
{
    return `
<button id="generate_btn" class="btn btn-primary btn-lg " onclick="submit_button_click()">
Submit
</button>`;

}

function render_transfer_status()
{
    const result = [];

    switch(g_data.transfer_status_number)
    {

        case 1:
            result.push(`
                <p><img src=${location.protocol}//${location.host}/img/TransferInProgress.svg />
                Transfer in progress (Submitted 09/28/2022 at 10:04:00). Please check again later for completion status.
                </p>
            `);
            break;
        case 2:
            result.push(`
            <p><img src=${location.protocol}//${location.host}/img/TransferError.svg />
        Transfer could not be completed ( Time to transfer: 2 min | Submitted 09/28/2022 at 10:04:00| Failed 09/28/2022 at 10:06:00).

        Please contact your system administrator for assistance.Transfer complete. Time to transfer: 2 hrs 14 min | Submitted 09/28/2022 at 10:04:00 | Completed 09/28/2022 at 12:18:00
            </p>
        `);
            break;
        case 0:
        default:
            result.push(`
            <p><img src=${location.protocol}//${location.host}/img/TransferComplete.svg />
            Transfer complete. Time to transfer: 2 hrs 14 min | Submitted 09/28/2022 at 10:04:00 | Completed 09/28/2022 at 12:18:00
            </p>
            `);
            break;
    }

    return result.join("");
}

function render_table()
{
    const result = [];
    result.push(`
    <table>
        <thead>
            <tr style="background-color:#b890bb;">
                <th>#</th>
                <th>Transfer to Central MMRIA Instance</th>
                <th>MMRIA Site Name</th>
            </tr>
        </thead>
        ${rendert_state_list()}
    </table>
    `);

    return result.join("");
}


function rendert_state_list()
{
    const result = [];
    for(let i = 0; i < g_data.state_list.length; i++)
    {
        const item = g_data.state_list[i];
        const number = i + 1;
        result.push(`
            <tr>
                <td>${number}</td>
                <td style='text-align:center'><input type=checkbox value=${i} ${item.is_included == true ? "checked":""}/></td>
                <td>${item.name}</td>
            </tr>
        `);
    }

    return result.join("");
}
function get_batch_set()
{
    let el = document.getElementById("batch_list");
    el.innerHTML = `
    <div class="card-body bg-tertiary set-radius">
        <p class="mb-0">Fetching data...</p>
    </div>
    `
    let current_host_state = sanitize_encodeHTML(window.location.host.split("-")[0]).toUpperCase();


	$.ajax
    (
        {
		    url: location.protocol + '//' + location.host + `/api/ije_message`
	    }
    ).done
    (
        function(response) 
        {
            g_batch_list = [];
            for(let i = 0; i < response.rows.length; i++)
            {
                let item = response.rows[i].doc;

                let reporting_state = item.reporting_state.toUpperCase();

                if(reporting_state == current_host_state)
                {
                    if(g_state_list.indexOf(reporting_state) < 0)
                    {
                        g_state_list.push(reporting_state);
                    }

                    
                    if(g_state_date_list[reporting_state] == null)
                    {
                        g_state_date_list[reporting_state] = [];
                    }

                    let import_date = `${item.importDate.substr(5, 2)}/${item.importDate.substr(8, 2)}/${item.importDate.substr(0, 4)}`

                    if( g_state_date_list[reporting_state].indexOf(import_date) < 0)
                    {
                        g_state_date_list[reporting_state].push(import_date);
                    }

                    function compare_dates(a, b)
                    {
                        const a_arr = a.split("/");
                        const a_year = parseInt(a_arr[2]);
                        const a_month = parseInt(a_arr[0]);
                        const a_day = parseInt(a_arr[1]);
        
                        const b_arr = b.split("/");
                        const b_year = parseInt(b_arr[2]);
                        const b_month = parseInt(b_arr[0]);
                        const b_day = parseInt(b_arr[1]);
        
                        if(b_year == a_year)
                        {
                            if(b_month == a_month)
                            {
                                return b_day - a_day;
                            }
                            else
                            {
                                return b_month - a_month;
                            }
                        }
                        else
                        {
                            return b_year - a_year;
                        }
                        
                    }

                    g_date_list.sort(compare_dates);
                    
                    
                    if(g_date_list.indexOf(import_date) < 0)
                    {
                        g_date_list.push(import_date);
                    }

                    item.import_date = import_date;
                    item.reporting_state = reporting_state;

                    let is_batch_rejected  = false;
                    if(item.status == 6)
                    {
                        is_batch_rejected = true;
                    }

                    for(let j = 0; j < item.record_result.length; j++)
                    {
                        let batch_item = item.record_result[j];

                        batch_item.import_date = import_date;
                        batch_item.reporting_state = reporting_state;

                        if(is_batch_rejected)
                        {
                            batch_item.status = 5;
                            batch_item.statusDetail = "Whole batch rejected";
                        }

                        g_batch_item_list.push(batch_item);
                    }
                    
                    if(item.record_result.length > 0)
                    {
                        g_batch_list.push(item);
                    }
                }

            }

            initialize_ui();
        }
    );
}


function initialize_ui()
{

    let el = document.getElementById("batch_list");
    el.innerHTML =`
    <div class="card-body bg-tertiary set-radius">
        <p class="mb-0">Data retrieved initializing UI...</p>
    </div>
    `;

    render_batch_list()
}



var g_current_state_batch = '';

function render_batch_list()
{
    let html_builder = [];

    if(g_batch_list == null)
    {
        html_builder.push(`
            <div class="card-body bg-tertiary set-radius">
                <p class="mb-0">Unable to connect to vitals service. Please reload the page or come back later.</p>
            </div>
        `);
    }

    else if(g_batch_list.length > 0)
    {
        let batchedStateOptions = [];

        for (let j = 0; j < g_batch_list.length; j++) 
        {

            let item = g_batch_list[j];

            let itemState = item.reporting_state;

            if (batchedStateOptions.indexOf(itemState) === -1) 
            {
                batchedStateOptions.push(itemState)
            }
        }

        g_state_list.sort();


        html_builder.push(`
            <div class="form-inline">
                <label class="justify-content-start" style="width: 130px" for="state-list"><strong>State:</strong></label>
                <select id="state-list" class="form-control" style="width: 300px" onchange="javascript:state_list_onchange(this.value)">
                    <option value="">Select State</option>
                    <option value="all">All</option>
                    ${g_state_list.map(state => `<option value="${state}">${state}</option>`)}
                </select>
            </div>

            <div class="form-inline mt-3">
                <label class="justify-content-start" style="width: 130px" for="date-list"><strong>Import Date:</strong></label>
                <select id="date-list" class="form-control" style="width: 300px" onchange="javascript:date_list_onchange(this.value)">
                    <option value="all" selected>All</option>
                    ${g_date_list.map(date => `<option value="${date}">${date}</option>`)}
                </select>
            </div>
        `);
    }
    else
    {

            html_builder.push(`
            <div class="card-body bg-tertiary set-radius">
                <p class="mb-0">No history of IJE uploads found.</p>
            </div>
        `);
        
    }


    let el = document.getElementById("batch_list");
    el.innerHTML = html_builder.join("");
}

function state_list_onchange(p_value)
{
    let el = document.getElementById('date-list');
    let html = [];
    
    html.push(`<option value="all">All</option>`);

    if(p_value == 'all')
    { 
        for (let i = 0; i < g_date_list.length; i++) 
        {
            let item = g_date_list[i];
            html.push(`<option value="${item}">${item}</option>`);
        }
    }
    else
    {
        let list = g_state_date_list[p_value];
        for (let i = 0; i < list.length; i++) 
        {
            let item = list[i];
            html.push(`<option value="${item}">${item}</option>`);
        }
    }

    el.innerHTML = html.join("");
    prepare_batch();

}



function date_list_onchange(p_value) 
{

    prepare_batch();

}

function prepare_batch()
{
    let state_value = document.getElementById('state-list').value;
    let date_value = document.getElementById('date-list').value;

    let batch = [];
    for (let i = 0; i < g_batch_item_list.length; i++) 
    {
        let item = g_batch_item_list[i];

        let is_valid_state = false;
        let is_valid_date = false;

        if(state_value == "all")
        {
            is_valid_state = true;
        }
        else if(item.reporting_state == state_value)
        {
            is_valid_state = true;
        }


        if(date_value == "all")
        {
            is_valid_date = true;
        }
        else if(item.import_date == date_value)
        {
            is_valid_date = true;
        }

        if(is_valid_state && is_valid_date)
        {
            batch.push(item);
        }

        
    }


    render_batch(batch);
}


function render_batch(p_batch)
{
    let html_builder = [];

    if (p_batch.length < 1) 
    {
        html_builder.push("");
    } 
    else 
    {
        
        const batchedItemsByStatus = {};

        for (let i = 0; i < batch_item_status.length; i++) 
        {
            batchedItemsByStatus[`batch_item_status_${i}`] = [];
        }
        
        for (let i = 0; i < p_batch.length; i++) 
        {

            let item = p_batch[i];
            for (let k = 0; k < batch_item_status.length; k++) 
            {
                if (item.status === k) 
                {
                    batchedItemsByStatus[`batch_item_status_${k}`].push(item);
                }
            }
            
        }

       for (let i = 0; i < batch_item_status.length; i++) 
        {
            if (batchedItemsByStatus[`batch_item_status_${i}`].length > 0) 
            {
                renderVitalsReportTable(i, batchedItemsByStatus[`batch_item_status_${i}`]);
            }
        }
    }

    let el = document.getElementById("report");
    el.innerHTML = html_builder.join("");

    function renderVitalsReportTable(index, items) 
    {

        const sortedItems = items.slice().sort((a,b) => new Date(b.importDate) - new Date(a.importDate));
        //Build out the table
        html_builder.push(`<div class="report-section">`);
            html_builder.push(`<p>Total Records: <strong>${sortedItems.length}</strong></p>`);
            html_builder.push(`<table class="table">`);
                html_builder.push(`
                    <thead class="thead">
                        <tr class="tr bg-tertiary">
                            <th class="th" colspan="99" scope="colgroup">
                                <h4 class="m-0">${batch_item_status_display[index]}</h4>
                            </th>
                        </tr>
                    </thead>
                    <thead class="thead">
                        <tr class="tr" align="center">
                            <th class="th" width=65px>#</th>
                            <th class="th">MMRIA Record ID</th>
                            <th class="th">CDC Unique ID</th>
                            <th class="th">Last Name</th>
                            <th class="th">First Name</th>
                            <th class="th" width=120px>Date of Birth</th>
                            <th class="th" width=120px>Date of Death</th>
                            <th class="th">Reporting State</th>
                            <th class="th">State of<br/>Death Record</th>
                            <th class="th">Status Detail</th>
                        </tr>
                    </thead>
                    <tbody class="tbody">
                `);
                


                for(let i = 0; i < sortedItems.length; i++)
                {
                    let item = sortedItems[i];
                    html_builder.push
                    (`
                        <tr class="tr" data-import-state="${item.reportingState}" data-import-date="${item.importDate}">
                            <td class="td text-align-center">${i+1}</td>
                            <td class="td">${item.mmria_record_id == null? "": item.mmria_record_id}</td>
                            <td class="td">${item.cdcUniqueID}</td>
                            <td class="td">${item.lastName}</td>
                            <td class="td">${item.firstName}</td>
                            <td class="td">
                                ${item.dateOfBirth.split('-')[1]}/${item.dateOfBirth.split('-')[2]}/${item.dateOfBirth.split('-')[0]}
                            </td>
                            <td class="td">
                                ${item.dateOfDeath.split('-')[1]}/${item.dateOfDeath.split('-')[2]}/${item.dateOfDeath.split('-')[0]}
                            </td>
                            <td class="td">${item.reportingState}</td>
                            <td class="td">${item.stateOfDeathRecord}</td>
                            <td class="td"><span title="${item.statusDetail==null?"": item.statusDetail}">${item.statusDetail == null ? "" : item.statusDetail.substring(0,20)}</span></td>
                        </tr>
                    `);
                }
                html_builder.push("</tbody>");
            html_builder.push("</table>");
            html_builder.push(`<p>Total Records: <strong>${sortedItems.length}</strong></p>`);
        html_builder.push(`</div>`);
    }
}

function sanitize_encodeHTML(s) 
{
	let result = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    return result;
}
