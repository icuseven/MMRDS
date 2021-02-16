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

//This array serves no purpose other than to map out the correct "display" value of the above 'batch_item_status' array
var batch_item_status_display = [
    //_0
    "Validating",
    //_1
    "In Process",
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

    //if no batch objects, serve up error
    if(g_batch_list == null)
    {
        html_builder.push(`
            <div class="card-body bg-tertiary set-radius">
                <p class="mb-0">Unable to connect to vitals service. Please reload the page or come back later.</p>
            </div>
        `);
    }
    //if batch items exist
    else if(g_batch_list.length > 0)
    {
        //Create empty array to hold all the different 'batch_item_status' state variations
        //This array will be used to render the state options in the select dropdown
        let batchedStateOptions = [];
        //Loop through all the batches
        for (let j = 0; j < g_batch_list.length; j++) {
            //Then get each batch
            let item = g_batch_list[j];
            //and that batch's reporting state
            let itemState = item.reporting_state;
            //If that state doesn't exist in the array yet, add it
            //We only want one instance of each state
            if (batchedStateOptions.indexOf(itemState) === -1) {
                batchedStateOptions.push(itemState)
            }
        }
        //Sort it alphabetically...
        batchedStateOptions.sort();

        //Render the State options dynamicaly
        //Render the initial state of Date options (we will render these dynamically later)
        if (batchedStateOptions.length > 0) {
            html_builder.push(`
                <div class="form-inline">
                    <label class="justify-content-start" style="width: 130px" for="batch-by-state"><strong>State:</strong></label>
                    <select id="batch-by-state" class="form-control" style="width: 300px" onchange="javascript:renderReportByState(this.value, () => renderStateImportDateOptions(this.value))">
                        <option value="">Select State</option>
                        <option value="all">All</option>
                        ${batchedStateOptions.map(state => `<option value="${state}">${state}</option>`)}
                    </select>
                </div>

                <div class="form-inline mt-3">
                    <label class="justify-content-start" style="width: 130px" for="batch-by-state-date"><strong>Import Date:</strong></label>
                    <select id="batch-by-state-date" class="form-control" style="width: 300px" disabled onchange="javascript:renderReportByStateImportDate(this.value)">
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
        //No batch uploads exists, serve up message
        html_builder.push(`
            <div class="card-body bg-tertiary set-radius">
                <p class="mb-0">No history of IJE uploads found. Please use the <a href="./vitals/FileUpload">IJE Uploader</a> to load a set of IJE files.</p>
            </div>
        `);
    }

    //Render the html
    let el = document.getElementById("batch_list");
    el.innerHTML = html_builder.join("");
}

//Function used to render the reports by state
//p_value should be state value (ie. KS, GA, etc)
function renderReportByState(p_value, callback)
{
    //Empty local scoped array to hold state batch information
    let batchedStates = [];
    //Set global batch state variable to our local p_value
    g_current_state_batch = p_value;
    //Ternary
    //If p_value(state) is 'all', push all items that exist
    //Or items to local array, filtered by our current state selected
    p_value === 'all' ? batchedStates.push(g_batch_list) : batchedStates.push(g_batch_list.filter(item => item.reporting_state === p_value));
    
    //Loop through all items in our local scoped array
    for (let i = 0; i < batchedStates.length; i++) {
        //get each batched state item
        let batchedStateItem = batchedStates[i];
        //render the report based on the information in local scoped 'batchedStates' array
        //TODO, may not need to pass 'i' variable
        render_report_click(batchedStateItem, i)
    }

    //Optional callback if needed
    //Callback needs to be truthy and be of function type
    if (callback && typeof(callback) === 'function') {
        callback();
    }
}

//Function used to render the reports filtered by date
//p_value should be date value (ie. 2021-02-12, etc)
function renderReportByStateImportDate(p_value, callback) {
    //Empty local scoped array to hold date batch information
    let batchedDates = [];
    //Ternary
    //If p_value(date) is 'all' or 'empty', push all items that match the current state
    //Or items to local array that match our current state selected, filtered by the p_value(date)
    p_value === 'all' || p_value === '' ?
        batchedDates.push(g_batch_list.filter(item => item.reporting_state === g_current_state_batch))
        :
        batchedDates.push(g_batch_list.filter(item => item.reporting_state === g_current_state_batch && item.importDate.split('T')[0] === p_value))
    
    //Loop through all items in our local scoped array
    //However it should be just one item with children
    //Only pass in the first (index of 0)
    for (let i = 0; i < batchedDates.length; i++) {
        //Get the first item (also only item, see comments above)
        let batchedDateItem = batchedDates[0];
        //Render the report based on our date filtering
        //TODO, may not need to pass 'i' variable
        render_report_click(batchedDateItem, i)
    }

    //Optional callback if needed
    //Callback needs to be truthy and be of function type
    if (callback) {
        callback();
    }
}

//Function used to render Dates options dynamically
//This was handle this way because at any given moment, our dates may change
//AND we want to show various reports IF they were imported on the same day
function renderStateImportDateOptions(p_value)
{
    //Get the date dropdown so we can disable if needed
    const dateElement = $('#batch-by-state-date');
    //Create an empty array to hold all the different date variations
    let batchedDateOptions = [];
    //Since dates will need to be generated dynamically
    //we want to always clear out the options
    //However we want to leave the first 2 options '' and 'all', hence the slice() method
    dateElement.find('option').slice(2).remove();

    //IF p_value is all or empty, disable our date dropdown
    if (p_value === 'all' || p_value ==='') {
        dateElement.prop('disabled', true)
    }
    //ELSE enable the date drop
    else {
        dateElement.prop('disabled', false);

        //Loop through the global batch list
        for (let j = 0; j < g_batch_list.length; j++) {
            //Get each batch
            let item = g_batch_list[j];
            //and each batch's importDate value
            let itemImportDate = item.importDate;
            
            //IF that date does not exist in our local scoped array
            if (batchedDateOptions.indexOf(itemImportDate) === -1) {
                //Get everything before the UTC's 'T' dateTime format (YYYY-MM-DDTHH:MM:SS)
                itemImportDate = itemImportDate.split('T')[0];
                //Then push it to our local scoped array
                batchedDateOptions.push(itemImportDate);

                //Get the month for displaying
                let mm = itemImportDate.split('-')[1];
                //Get the dat for displaying
                let dd = itemImportDate.split('-')[2];
                //Get the month for displaying
                let yyyy = itemImportDate.split('-')[0];
                //Set the date for displaying in mm/dd/yyyy format
                let dateDisplay = `${mm}/${dd}/${yyyy}`;

                //append each option to our date dropdown
                dateElement.append(`<option value="${itemImportDate}">${dateDisplay}</option>`);
            }
        }
    }
}

//Function to render the report
function render_report_click(p_batch, p_index)
{
    //Empty array to push our HTML we want to render
    let html_builder = [];

    //Empty out the html if our batch contains no items
    //This only happens when the user selects nothing in our state dropdown
    if (p_batch.length < 1) {
        html_builder.push("");
    } else {
        //get our global batch list
        //TODO: May not need this since refactoring has made it not necessary, leaving for reference sakes
        // let batch = g_batch_list[p_index];

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
        
        //Create a local scoped 'Object'
        //This will be used to dynamically generate arrays to contain our different statuses
        //For now they will be empty arrays, helps get clean renders every time when calling render_report_click() function
        //These props are mapped based on Jame's 'batch_item_status' global array
        const batchedItemsByStatus = {};
        //Loop through each statue
        for (let i = 0; i < batch_item_status.length; i++) {
            //and create each group dynamically using bracket notation
            batchedItemsByStatus[`batch_item_status_${i}`] = [];
        }
        
        //Loop through the batch we passed
        //It needs to be an array
        for (let i = 0; i < p_batch.length; i++) {
            //Get each child of the batch
            //Can contain more than one because the same state can upload more than one
            let newBatchGroup = p_batch[i];

            //Push batch items to appropriate already generated arrays in batchedItemsByStatus object
            for (let j = 0; j < newBatchGroup.record_result.length; j++) {
                let newBatchItem = newBatchGroup.record_result[j];

                for (let k = 0; k < batch_item_status.length; k++) {
                    if (newBatchItem.status === k) {
                        batchedItemsByStatus[`batch_item_status_${k}`].push(newBatchItem);
                    }
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

    let el = document.getElementById("report");
    el.innerHTML = html_builder.join("");

    //Function to render the tables dynamically
    //This function is locally scoped only because we want to utilize the 'html_builder' declaration
    //TODO: Move it outside to clean up logic
    function renderVitalsReportTable(index, items) {
        //Lets sort our batched items by descending order by importDate (this is a requirement)
        //https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
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
                        <tr class="tr" data-import-state="${item.reportingState}" data-import-date="${item.importDate}">
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
}

function refresh_click(p_index)
{
    //code goes here
}
