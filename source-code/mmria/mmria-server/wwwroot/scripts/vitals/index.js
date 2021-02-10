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

function render_batch_list()
{
    let html_builder = [];
    html_builder.push("<ul>");
    if(g_batch_list == null)
    {
        html_builder.push(`<li>Unable to connect to vitals service.</li>`);
    }
    else if(g_batch_list.length > 0)
    {
        for(let i = 0; i < g_batch_list.length; i++)
        {
            let item = g_batch_list[i];
            html_builder.push(`
                <li>
                    <strong>${item.mor_file_name}</strong> (${batch_status[item.status]}) - ${item.importDate}
                    <button class="btn btn-outline" onclick="render_report_click(${i})">View</button>
                    <!--<input type="button" value="view report" onclick="render_report_click(${i})" />-->
                    <!--|-->
                    <button class="btn btn-outline" onclick="refresh_click(${i})">Refresh</button>
                    <!--<input type="button" value="refresh" onclick="refresh_click(${i})" />-->
                </li>
            `);
        }
    }
    else
    {
        html_builder.push(`<li>No history of IJE uploads found. Please use the <a href="./vitals/FileUpload">IJE Uploader</a> to load a set of IJE files.</li>`);
    }
    html_builder.push("</ul>");

    let el = document.getElementById("batch_list");
    el.innerHTML = html_builder.join("");
}

function render_report_click(p_index)
{
    let batch = g_batch_list[p_index];
    let html_builder = [];

    /* START Report intro section */
    html_builder.push(`<p><strong>State:</strong> ${batch.reporting_state}</p>`);
    html_builder.push(`
        <p>
            <strong>Import Date:</strong>
            ${(new Date(batch.importDate).getMonth()+1).toString().length < 2 ? `0${(new Date(batch.importDate).getMonth()+1)}` : new Date(batch.importDate).getMonth()+1}/${(new Date(batch.importDate).getDay()+1).toString().length < 2 ? `0${(new Date(batch.importDate).getDay())}` : new Date(batch.importDate).getDay()+1}/${new Date(batch.importDate).getFullYear()}
        </p>
    `);
    html_builder.push(`<p><strong>Import File Name:</strong> ${batch.mor_file_name}</p>`);
    /* END Report intro section */
    
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

    function renderVitalsReportTable(index, items) {
        html_builder.push(`<div class="report-section">`);
            html_builder.push(`<p>Total Records: <strong>${items.length}</strong></p>`);
            html_builder.push(`<table class="table">`);
                html_builder.push(`
                    <thead class="thead">
                        <tr class="tr bg-tertiary">
                            <th class="th" colspan="99" scope="colgroup">
                                <h4 class="m-0">${batch_item_status[index]}</h4>
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

                for(let i = 0; i < items.length; i++)
                {
                    let item = items[i];
                    html_builder.push
                    (`
                        <tr class="tr">
                            <td class="td">${i+1}</td>
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
            html_builder.push(`<p>Total Records: <strong>${items.length}</strong></p>`);
        html_builder.push(`</div>`);
    }

    let el = document.getElementById("report");
    el.innerHTML = html_builder.join("");
}

function refresh_click(p_index)
{

}
