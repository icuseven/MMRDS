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
    "Validating",
    "InProcess",
    "NewCaseAdded",
    "ExistingCaseSkipped",
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
    var batch_items_status_0 = [];
    var batch_items_status_1 = [];
    var batch_items_status_2 = [];
    var batch_items_status_3 = [];
    var batch_items_status_4 = [];
    let html_builder = [];

    if (batch) {
        for (let i = 0; i < batch.record_result.length; i++) {
            let item = batch.record_result[i];
            switch(item.status) {
                case 0:
                    batch_items_status_0.push(item)
                    break;
                case 1:
                    batch_items_status_1.push(item)
                    break;
                case 2:
                    batch_items_status_2.push(item)
                    break;
                case 3:
                    batch_items_status_3.push(item)
                    break;
                case 4:
                    batch_items_status_4.push(item)
                    break;
            }
        }
    }

    html_builder.push(`<p><strong>State:</strong> ${batch.reporting_state}</p>`);
    html_builder.push(`
        <p>
            <strong>Import Date:</strong>
            ${(new Date(batch.importDate).getMonth()+1).toString().length < 2 ? `0${(new Date(batch.importDate).getMonth()+1)}` : new Date(batch.importDate).getMonth()+1}/${(new Date(batch.importDate).getDay()+1).toString().length < 2 ? `0${(new Date(batch.importDate).getDay())}` : new Date(batch.importDate).getDay()+1}/${new Date(batch.importDate).getFullYear()}
        </p>
    `);
    html_builder.push(`<p><strong>Import File Name:</strong> ${batch.mor_file_name}</p>`);

    for (let i = 0; i < batch_item_status.length; i++) {
        if (i = 0) {
            if (batch_items_status_0.length > 0) {
                renderTableGroup(i, batch_items_status_0);
            }
        }
        if (i = 1) {
            if (batch_items_status_1.length > 0) {
                renderTableGroup(i, batch_items_status_1);
            }
        }
        if (i = 2) {
            if (batch_items_status_2.length > 0) {
                renderTableGroup(i, batch_items_status_2);
            }
        }
        if (i = 3) {
            if (batch_items_status_3.length > 0) {
                renderTableGroup(i, batch_items_status_3);
            }
        }
        if (i = 4) {
            if (batch_items_status_4.length > 0) {
                renderTableGroup(i, batch_items_status_4);
            }
        }

    }

    function renderTableGroup(index, batchette) {
        // html_builder.push(`<p><strong>State:</strong> ${batchette.reporting_state}</p>`);
        // html_builder.push(`
        //     <p>
        //         <strong>Import Date:</strong>
        //         ${(new Date(batchette.importDate).getMonth()+1).toString().length < 2 ? `0${(new Date(batchette.importDate).getMonth()+1)}` : new Date(batchette.importDate).getMonth()+1}/${(new Date(batchette.importDate).getDay()+1).toString().length < 2 ? `0${(new Date(batchette.importDate).getDay())}` : new Date(batchette.importDate).getDay()+1}/${new Date(batchette.importDate).getFullYear()}
        //     </p>
        // `);
        // html_builder.push(`<p><strong>Import File Name:</strong> ${batchette.mor_file_name}</p>`);

        html_builder.push(`<div class="report-section">`);
            html_builder.push(`<p>Total Records: <strong>${batchette.length}</strong></p>`);
            html_builder.push(`<table class="table">`);
                html_builder.push(`
                    <thead class="thead">
                        <tr class="tr bg-tertiary">
                            <th class="th" colspan="99" scope="colgroup">
                                <h4 class="m-0">${batch_item_status[index]}</h4>
                                <!--
                                <h4 class="m-0">${batchette.mor_file_name}</h4>
                                Status: ${batch_status[batchette.status]} | Import Date: ${batchette.importDate}
                                -->
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

                            <!--
                            <th class="th">#</th>
                            <th class="th">Status</th>
                            <th class="th">CDC<br/>Unique<br/>ID</th>
                            <th class="th">State<br/>Of<br/>Death<br/>Record</th>
                            <th class="th">Date<br/>Of<br/>Death</th>
                            <th class="th">Date<br/>Of<br/>Birth</th>
                            <th class="th">Last<br/>Name</th>
                            <th class="th">First<br/>Name</th>
                            <th class="th">_id</th>
                            <th class="th">MMRIA<br/>RecordID</th>
                            <th class="th">Status<br/>Detail</th>
                            -->
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

                for(let i = 0; i < batchette.length; i++)
                {
                    let item = batchette[i];
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

                            <!--
                            <td class="td">${i+1}</td>
                            <td class="td">${batch_item_status[item.status]}</td>
                            <td class="td">${item.cdcUniqueID}</td>
                            <td class="td">${item.stateOfDeathRecord}</td>
                            <td class="td">${item.dateOfDeath}</td>
                            <td class="td">${item.dateOfBirth}</td>
                            <td class="td">${item.lastName}</td>
                            <td class="td">${item.firstName}</td>
                            <td class="td">${item.mmria_id != null ? item.mmria_id : "&nbsp;"}</td>
                            <td class="td">${item.mmria_record_id != null ? item.mmria_record_id : "&nbsp;"}</td>
                            <td class="td">${item.statusDetail != null ? item.statusDetail: "currently processing"}</td>
                            -->
                        </tr>
                    `);
                }
                html_builder.push("</tbody>");
            html_builder.push("</table>");
            html_builder.push(`<p>Total Records: <strong>${batchette.length}</strong></p>`);
        html_builder.push(`</div>`);
    }
        

    let el = document.getElementById("report");
    el.innerHTML = html_builder.join("");
}

function refresh_click(p_index)
{

}
