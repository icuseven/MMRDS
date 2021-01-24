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
    if(g_batch_list.length > 0)
    {
        for(let i = 0; i < g_batch_list.length; i++)
        {
            let item = g_batch_list[i];
            html_builder.push(`<li><strong>${item.mor_file_name}</strong> (${batch_status[item.status]}) -  ${item.importDate} <input type="button" value="view report" onclick="render_report_click(${i})" /> |  <input type="button" value="refresh" onclick="refresh_click(${i})" /></li>`);
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
    let html_builder = [];
    html_builder.push("<table>");
    let batch = g_batch_list[p_index];

    html_builder.push
    (`
    <tr align="center">
    <th colspan=9>
    ${batch.mor_file_name} - (${batch_status[batch.status]})
    <br/>Import Date=${batch.importDate}
    </th>
    </tr>

        <tr align="center">
        <th>#</th>
        <th>Status</th>
        <th>CDC<br/>Unique<br/>ID</th>
        <th>State<br/>Of<br/>Death<br/>Record</th>
        <th>Date<br/>Of<br/>Death</th>
        <th>Date<br/>Of<br/>Birth</th>
        <th>Last<br/>Name</th>
        <th>First<br/>Name</th>
        <th>_id</th>
        <th>MMRIA<br/>RecordID</th>
        <th>Status<br/>Detail</th>
        </tr>
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

    for(let i = 0; i < batch.record_result.length; i++)
    {
        let item = batch.record_result[i];
        html_builder.push
        (`
            <tr bgcolor=${ i % 2 == 0? "FFFFFF": "CCCCCC"}>
            <td>${i+1}</td>
            <td>${batch_item_status[item.status]}</td>
            <td>${item.cdcUniqueID}</td>
            <td>${item.stateOfDeathRecord}</td>
            <td>${item.dateOfDeath}</td>
            <td>${item.dateOfBirth}</td>
            <td>${item.lastName}</td>
            <td>${item.firstName}</td>
            <td>${item.mmria_id != null ? item.mmria_id : "&nbsp;"}</td>
            <td>${item.mmria_record_id != null ? item.mmria_record_id : "&nbsp;"}</td>
            <td>${item.statusDetail != null ? item.statusDetail: "currently processing"}</td>
            </tr>
        `);
    }
    html_builder.push("</table><br/>");
    let el = document.getElementById("report");
    el.innerHTML = html_builder.join("");
}


function refresh_click(p_index)
{

}