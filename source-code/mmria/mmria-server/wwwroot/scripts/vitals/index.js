'use strict';

var g_batch_list = [];
var g_release_version = null;
var g_release_version_specification = null;
var g_selected_version = null;
var g_version_list = null;
var g_list_one_selected_item = "";
var g_list_two_selected_item = "";
var g_is_inline = 0;
var g_view_type_is_dirty = false;
var g_view1_is_dirty = true;
var g_view2_is_dirty = true;
var g_opcode_dictionary = {};

var batch_item_status = [
    //_0
    "Validating",
    //_1
    "InProcess",
    //_2
    "NewCaseAdded",
    //_3
    "ExistingCaseSkipped",
    //_4
    "ImportFailed"
];

var batch_item_status_display = [
    //_0
    "Validating",
    //_1
    "InProcess",
    //_2
    "New Case Added",
    //_3
    "Existing Case Skipped",
    //_4
    "Import Failed"
];

var batch_status = [
    "Validating",
    "InProcess",
    "Finished"
];


window.onload = function()
{
    get_release_version();
    document.getElementById("clear_data").onclick = clear_all_data_click;
} 

function get_release_version()
{
	$.ajax({
		url: location.protocol + '//' + location.host + `/api/ije_message`
	}).done(function(response) {
        g_batch_list = response;
        
        render_batch_list()

	});
}


function clear_all_data_click()
{
	$.ajax({
        type: "DELETE",
		url: location.protocol + '//' + location.host + `/api/ije_message`
	}).done(function(response) {
        g_batch_list = [];
        
        render_batch_list()
        document.getElementById("report").innerHTML = "";

	});
}

var g_current_state_batch = '';

function render_batch_list()
{
    let html_builder = [];

    // html_builder.push("<ul>");
    if(g_batch_list == null)
    {
        html_builder.push(`
            <div class="card-body bg-tertiary set-radius">
                <p class="mb-0">Unable to connect to vitals service. Please reload the page or come back later.</p>
            </div>
        `);
        // html_builder.push(`<li>Unable to connect to vitals service.</li>`);
    }
    else if(g_batch_list.length > 0)
    {
        //empty array to hold all the different state variations
        let batchedStateOptions = [];

        for (let j = 0; j < g_batch_list.length; j++) {
            let item = g_batch_list[j];
            let itemState = item.reporting_state;
            
            if (batchedStateOptions.indexOf(itemState) === -1) {
                batchedStateOptions.push(itemState)
            }
        }
        batchedStateOptions.sort();

        //Render the State options dynamica
        //Render the begining Date options
        if (batchedStateOptions.length > 0) {
            html_builder.push(`
                <div class="form-inline">
                    <label class="justify-content-start" style="width: 110px" for="batch-by-state"><strong>State:</strong></label>
                    <select id="batch-by-state" class="form-control" onchange="javascript:renderReportByState(this.value, () => renderStateImportDateOptions(this.value))">
                        <option value="">Select State</option>
                        <option value="all">All</option>
                        ${batchedStateOptions.map(state => `<option value="${state}">${state}</option>`)}
                    </select>
                </div>

                <div class="form-inline mt-3">
                    <label class="justify-content-start" style="width: 110px" for="batch-by-state-date"><strong>Import Date:</strong></label>
                    <select id="batch-by-state-date" class="form-control" disabled onchange="javascript:renderReportByStateImportDate(this.value)">
                        <option value="">Select Date</option>
                        <option value="all">All</option>
                    </select>
                </div>
            `);
        }
        
        // //Original code that was working
        // //Keeping for legacy and reference
        // for(let i = 0; i < g_batch_list.length; i++)
        // {
        //     let item = g_batch_list[i];
        //     html_builder.push(`
        //         <li>
        //             <strong>${item.mor_file_name}</strong> (${batch_status[item.status]}) - ${item.importDate}
        //             <button class="btn btn-outline" onclick="render_report_click(${i})">View</button>
        //             <button class="btn btn-outline" onclick="refresh_click(${i})">Refresh</button>
        //         </li>
        //     `);
        // }
    }
    else
    {
        html_builder.push(`
            <div class="card-body bg-tertiary set-radius">
                <p class="mb-0">No history of IJE uploads found. Please use the <a href="./vitals/FileUpload">IJE Uploader</a> to load a set of IJE files.</p>
            </div>
        `);
        // html_builder.push(`<li>No history of IJE uploads found. Please use the <a href="./vitals/FileUpload">IJE Uploader</a> to load a set of IJE files.</li>`);
    }
    // html_builder.push("</ul>");

    let el = document.getElementById("batch_list");
    el.innerHTML = html_builder.join("");
}

function renderReportByState(p_value, callback)
{
    let batchedStates = [];

    g_current_state_batch = p_value;
    p_value === 'all' ? batchedStates = g_batch_list : batchedStates.push(g_batch_list.filter(item => item.reporting_state === p_value));
    
    for (let i = 0; i < batchedStates.length; i++) {
        render_report_click(batchedStates, i)
    }

    if (callback) {
        callback();
    }
}

function renderReportByStateImportDate(p_value, callback) {
    let batchedDates = [];

    p_value === 'all' || p_value === '' ?
        batchedDates.push(g_batch_list.filter(item => item.reporting_state === g_current_state_batch))
        :
        batchedDates.push(g_batch_list.filter(item => item.reporting_state === g_current_state_batch && item.importDate.split('T')[0] === p_value))
    
    for (let i = 0; i < batchedDates.length; i++) {
        render_report_click(batchedDates, i)
    }

    if (callback) {
        callback();
    }
}

function renderStateImportDateOptions(p_value)
{
    //empty array to hold all the different date variations
    const dateElement = $('#batch-by-state-date');
    let batchedDateOptions = [];

    dateElement.find('option').slice(2).remove();

    if (p_value === 'all' || p_value ==='') {
        dateElement.prop('disabled', true)
    } else {
        dateElement.prop('disabled', false);

        for (let j = 0; j < g_batch_list.length; j++) {
            let item = g_batch_list[j];
            let itemImportDate = item.importDate;
            
            if (batchedDateOptions.indexOf(itemImportDate) === -1) {
                itemImportDate = itemImportDate.split('T')[0];
                batchedDateOptions.push(itemImportDate);

                let mm = itemImportDate.split('-')[1];
                let dd = itemImportDate.split('-')[2];
                let yyyy = itemImportDate.split('-')[0];
                let dateDisplay = `${mm}/${dd}/${yyyy}`;

                dateElement.append(`<option value="${itemImportDate}">${dateDisplay}</option>`);
            }
        }
    }
}

function render_report_click(p_batch, p_index)
{
    let html_builder = [];

    if (p_batch < 1) {
        html_builder.push("");
    } else {
        let batch = g_batch_list[p_index];

        // html_builder.push(`<p><strong>State:</strong> ${p_state.toUpperCase()}</p>`);
        // if (p_state !== 'all') {
        //     html_builder.push(`
        //         <p>
        //             <strong>Import Date:</strong>
        //             ${(new Date(batch.importDate).getMonth()+1).toString().length < 2 ? `0${(new Date(batch.importDate).getMonth()+1)}` : new Date(batch.importDate).getMonth()+1}/${(new Date(batch.importDate).getDay()+1).toString().length < 2 ? `0${(new Date(batch.importDate).getDay())}` : new Date(batch.importDate).getDay()+1}/${new Date(batch.importDate).getFullYear()}
        //         </p>
        //     `);
        //     html_builder.push(`<p><strong>Import File Name:</strong> ${batch.mor_file_name}</p>`);
        // }
        
        //Create a "Local Scoped Object"
        //This will be used to dynamically generate arrays to contain our different statuses
        //For now they will be empty arrays, helps get clean renders every time when calling render_report_click() function
        const batchedItemsByStatus = {};
        for (let i = 0; i < batch_item_status.length; i++) {
            batchedItemsByStatus[`batch_item_status_${i}`] = [];
        }
        
        //Push batch items to appropriate already generated arrays in batchedItemsByStatus object
        for (let i = 0; i < batch.record_result.length; i++) {
            let item = batch.record_result[i];

            for (let j = 0; j < batch_item_status.length; j++) {
                if (item.status === j) {
                    batchedItemsByStatus[`batch_item_status_${j}`].push(item);
                }
            }
        }

        //Finally we will loop through each array inside batchedItemsByStatus to check if they actually have items
        for (let i = 0; i < batch_item_status.length; i++) {
            //and ONLY render the table if any items exist
            if (batchedItemsByStatus[`batch_item_status_${i}`].length > 0) {
                renderVitalsReportTable(i, batchedItemsByStatus[`batch_item_status_${i}`]);
            }
        }
    }

    function renderVitalsReportTable(index, items) {
        //Lets sort our batched items by descending order
        const sortedItems = items.slice().sort((a,b) => new Date(b.importDate) - new Date(a.importDate));

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
                            <th class="th">#</th>
                            <th class="th">MMRIA Record ID</th>
                            <th class="th">CDC Unique ID</th>
                            <th class="th">Last Name</th>
                            <th class="th">First Name</th>
                            <th class="th">Date of Birth</th>
                            <th class="th">Date of Death</th>
                            <th class="th">Reporting State</th>
                            <th class="th">State of Death Record</th>
                        </tr>
                    </thead>
                    <tbody class="tbody">
                `);
                
                /*
                cdcUniqueID: null
                dateOfBirth: "1989-03-14"
                dateOfDeath: "2018-01-04"
                firstName: "CHRISTIN                                          "
                importDate: "2021-01-14T15:16:01.804638-05:00"
                importFileName: "2020_11_05_KS.MOR"
                lastName: "CANTRELL                                          "
                mmria_id: null
                reportingState: "KS"
                stateOfDeathRecord: "KS"
                status: 0
                statusDetail: null
                */

                for(let i = 0; i < sortedItems.length; i++)
                {
                    let item = sortedItems[i];
                    html_builder.push
                    (`
                        <tr class="tr" data-import-date="${item.importDate}">
                            <td class="td text-align-center">${i+1}</td>
                            <td class="td">${item.mmria_record_id}</td>
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
                        </tr>
                    `);
                }
                html_builder.push("</tbody>");
            html_builder.push("</table>");
            html_builder.push(`<p>Total Records: <strong>${sortedItems.length}</strong></p>`);
        html_builder.push(`</div>`);
    }

    let el = document.getElementById("report");
    el.innerHTML = html_builder.join("");
}

function refresh_click(p_index)
{

}
