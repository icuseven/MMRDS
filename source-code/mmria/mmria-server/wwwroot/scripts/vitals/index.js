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

    "Init",
    "InProcess",
    "NewCaseAdded",
    "ExistingCaseSkipped",
    "ImportFailed"
];

var batch_status = [
    "Init",
    "InProcess",
    "Finished"
];


window.onload = get_release_version();

function get_release_version()
{
	$.ajax({
		url: location.protocol + '//' + location.host + `/api/ije_message`
	}).done(function(response) {
        g_batch_list = response;
        
        render_batch_list()

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
            html_builder.push(`<li>${batch_status[item.status]} ${item.importDate} ${item.reporting_state} ${item.mor_file_name} <input type="button" value="view report" onclick="render_report_click(${i})" /></li>`);
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
    <th colspan=9>
    Import File=${batch.mor_file_name}</td>
    Reporting State=${batch.reporting_state}</td>
    Import Date=${batch.importDate}</td>
    </th>
    </tr>
        <tr>
        <th>Status</th>
        <th>CDCUniqueID</th>
        <th>StateOfDeathRecord</th>
        <th>DateOfDeath</th>
        <th>DateOfBirth</th>
        <th>LastName</th>
        <th>FirstName</th>
        <th>MMRIARecordID</th>
        <th>StatusDetail</th>
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
mmriaRecordID: null
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
            <tr>
            <td>${batch_item_status[item.status]}</td>
            <td>${item.cdcUniqueID}</td>
            <td>${item.stateOfDeathRecord}</td>
            <td>${item.dateOfDeath}</td>
            <td>${item.dateOfBirth}</td>
            <td>${item.lastName}</td>
            <td>${item.firstName}</td>
            <td>${item.mmriaRecordID}</td>
            <td>${item.statusDetail}</td>
            </tr>
        `);
    }
    html_builder.push("</table>");
    let el = document.getElementById("report");
    el.innerHTML = html_builder.join("");
}


function get_version_sepecification(p_version_name)
{
	$.ajax({
		url: `${location.protocol}//${location.host}/api/metadata/version_specification-${p_version_name}`
	}).done(function(response) {
		g_release_version_specification = response;
		load_metadata();
	});
}


function load_metadata()
{
	var metadata_url = location.protocol + '//' + location.host + '/api/metadata';

	$.ajax({
		url: metadata_url
	}).done(function(response) {
		g_metadata = response;
		get_available_versions()
	});
}

function get_available_versions()
{
  $.ajax
  ({
		url: location.protocol + '//' + location.host + '/api/version/list',
  })
  .done(function(response) 
  {

        g_version_list = response;

        update_list("list-one", g_list_one_selected_item);
        update_list("list-two", g_list_two_selected_item);
        
        let h2_element = document.getElementById("list-one-h2");
        h2_element.innerText = g_list_one_selected_item;

        h2_element = document.getElementById("list-two-h2");
        h2_element.innerText = g_list_one_selected_item;
	});


}

function set_is_inline(p_value)
{
    if(p_value != g_is_inline)
    {
        g_view_type_is_dirty = true;
    }

    if(p_value== 1)
    {
        g_is_inline = 1;
    }
    else
    {
        g_is_inline = 0;
    }
}

function update_list(p_id, p_selected_version)
{
    let list_element = document.getElementById(p_id);
    let result = []

    for(let i = 0; i < g_version_list.length; i++)
    {
        let item = g_version_list[i];
        let is_selected = "";

        if(item.name == p_selected_version)
        {
            is_selected = "selected=true"
        }

        if(item._id.indexOf("_design/auth") < 0 && item.name!= null)
        {
            result.push(`<option value="${item._id}" ${is_selected}>${item.name}</option>`)
        }
    }
    list_element.innerHTML = result.join("");
}


function source_list_changed(p_control)
{
    let h2_element = document.getElementById(p_control.id + "-h2");
    h2_element.innerText = p_control.selectedOptions[0].innerText;

    if(p_control.id == "list-one")
    {
        if(g_list_one_selected_item != p_control.selectedOptions[0].innerText)
        {
            g_view1_is_dirty = true;
        }
        
        g_list_one_selected_item = p_control.selectedOptions[0].innerText;
    }
    else if(p_control.id == "list-two")
    {
        if(g_list_two_selected_item != p_control.selectedOptions[0].innerText)
        {
            g_view2_is_dirty = true;
        }
        g_list_two_selected_item = p_control.selectedOptions[0].innerText;
    }
}

function compare_versions_click()
{
    if(! (g_view_type_is_dirty || g_view1_is_dirty || g_view2_is_dirty)) return;

    let v1 = null;
    let v2 = null;

    if(g_view1_is_dirty || g_view2_is_dirty)
    for(let i = 0; i < g_version_list.length; i++)
    {
        let item = g_version_list[i];
        let is_selected = "";

        if(item.name == g_list_one_selected_item)
        {
            v1 = item;
        }

        if(item.name == g_list_two_selected_item)
        {
            v2 = item;
        }
    }

    if
    (
        v1 != null &&
        v2 != null &&
        v1.name != v2.name
    )
    {
        //e1.value = JSON.stringify(v1, null, '\t');
        //e2.value = JSON.stringify(v2, null, '\t');

        //e1.value = v1.metadata;
        //e2.value = v2.metadata;
        if(g_view1_is_dirty)
        {
            let e1 = document.getElementById("baseText");
            //e1.value = JSON.stringify(JSON.parse(v1.metadata), null, '\t');
            let v1_result = [];
            const cv1 = JSON.parse(v1.metadata);
            GetPath(cv1, JSON.parse(v1.metadata), "", v1_result);
            e1.value = v1_result.join("\n");
        }

        if(g_view2_is_dirty)
        {
            let e2 = document.getElementById("newText");
            //e2.value = JSON.stringify(JSON.parse(v2.metadata), null, '\t');
            let v2_result = [];
            const cv2 = JSON.parse(v2.metadata);
            GetPath(cv2, JSON.parse(v2.metadata), "", v2_result);
            e2.value = v2_result.join("\n");
        }

        diffUsingJS(g_is_inline);

        g_view_type_is_dirty = false;
        g_view1_is_dirty = false;
        g_view2_is_dirty = false;

    }
}

function diffUsingJS(viewType) 
{
	"use strict";
	var byId = function (id) { return document.getElementById(id); },
		base = difflib.stringAsLines(byId("baseText").value),
		newtxt = difflib.stringAsLines(byId("newText").value),
		sm = new difflib.SequenceMatcher(base, newtxt),
		opcodes = sm.get_opcodes(),
		diffoutputdiv = byId("diffoutput"),
		contextSize = byId("contextSize").value;


    let change_log_list = [];
    let mmria_path_set = {};
    let deleted_mmria_path_set = {};

    g_opcode_dictionary = {};
    for (let opcode_index = 0; opcode_index < opcodes.length; opcode_index++)
    { 
        let change = opcodes[opcode_index]; 

        let code = change[0]; 
        let b = change[1];
        let be = change[2];
        let n = change[3];
        let ne = change[4];
        let rowcnt = Math.max(be - b, ne - n);

        switch(code)
        {
            case "equal":
                break;
            case "insert":
                change_log_list.push("Added:\t" + newtxt[n]);
/*
                let mmria_path = convert_change_text_to_mmria_path(newtxt[n]);
                if(mmria_path!=null)
                {
                    mmria_path_set[mmria_path] = true;
                }
*/
                break;
            case "delete":
                change_log_list.push("Removed:\t" + newtxt[n]);
                /*
                let mmria_path = convert_change_text_to_mmria_path(newtxt[n]);
                if(mmria_path!=null)
                {
                    mmria_path_set[mmria_path] = true;
                }*/

                break;
            case "replace":
                let b_diff = be - b;
                let n_diff = ne - n;
                change_log_list.push(`Replaced:`);
                if(b_diff == n_diff)
                {
                    for(let i = 0; i < b_diff; i++)
                    {
                        change_log_list.push(`\t${base[b + i]} => ${newtxt[n + i]}`);
                    }
                }
                else if(b_diff == 1)
                {
                    for(let i = 0; i < n_diff; i++)
                    {
                        change_log_list.push(`\t${base[b + i]} => ${newtxt[n + i]}`);
                    }
                }
                else
                {
                    for(let i = 0; i < n_diff; i++)
                    {
                        change_log_list.push(`\t${base[b + i]} => ${newtxt[n + i]}`);
                    }
                }
/*
                let mmria_path = convert_change_text_to_mmria_path(newtxt[n]);
                if(mmria_path!=null)
                {
                    mmria_path_set[mmria_path] = true;
                }

                mmria_path = convert_change_text_to_mmria_path(base[b]);
                if(mmria_path!=null)
                {
                    mmria_path_set[mmria_path] = true;
                }
*/
                break;
        }
    }

    let v1_text = document.getElementById("list-one").value;
    let v2_text = document.getElementById("list-two").value;
    document.getElementById("change_log").value = `comparing versions: ${v1_text.replace("version_specification-", "")} => ${v2_text.replace("version_specification-", "")}\nnumber of changes = ${change_log_list.length}\n${change_log_list.join("\n")}`;

	diffoutputdiv.innerHTML = "";
	contextSize = contextSize || null;

	diffoutputdiv.appendChild(diffview.buildView({
		baseTextLines: base,
		newTextLines: newtxt,
		opcodes: opcodes,
		baseTextName: "Base Text",
		newTextName: "New Text",
		contextSize: contextSize,
		viewType: viewType
	}));
}

function GetPath(p_root_metadata, p_metadata, p_path = "", p_result = [])
{
    switch(p_metadata.type.toLowerCase())
    {
        case 'grid':
        case 'group':
        case 'form':
            for(let i = 0; i < p_metadata.children.length; i++)
			{
				var child = p_metadata.children[i];
				GetPath(p_root_metadata, child, p_path + `/${p_metadata.name}`, p_result);
			}
        break;
        case 'app':
            for(let i = 0; i < p_metadata.lookup.length; i++)
			{
				let child = p_metadata.lookup[i];
				GetPath(p_root_metadata, child, p_path + `/lookup`, p_result);
			}

            for(let i = 0; i < p_metadata.children.length; i++)
			{
				let child = p_metadata.children[i];
				GetPath(p_root_metadata, child, p_path + `/${p_metadata.name}`, p_result);
			}
        break;
        case 'label':
        case 'button':
        case 'boolean':
        case 'date':
        case 'datetime':
        case 'number':
        case 'string':
        case 'time':
        case 'address':
        case 'textarea':
        case 'hidden':
        case 'jurisdiction':
            p_result.push(p_path + `/${p_metadata.name}`);
            p_result.push(p_path + `/${p_metadata.name}:type=${p_metadata.type}`);
            p_result.push(p_path + `/${p_metadata.name}:prompt=${p_metadata.prompt}`);

            render_optional_attributes(p_metadata, p_path, p_result);
        break;
        case 'yes_no':
        case 'race':
        case 'list':
            p_result.push(p_path + `/${p_metadata.name}`);
            p_result.push(p_path + `/${p_metadata.name}:type=${p_metadata.type}`);
            p_result.push(p_path + `/${p_metadata.name}:prompt=${p_metadata.prompt}`);

            if(p_metadata.path_reference && p_metadata.path_reference != "")
            {

                p_result.push(p_path + `/${p_metadata.name}:path_reference=${p_metadata.path_reference}`);
                /*
                metadata_value_list = eval(convert_path_to_lookup_object(p_root_metadata, p_metadata.path_reference));
                if(metadata_value_list == null)	
                {
                    metadata_value_list = p_metadata.values;
                }
                */
            }
            else
            {
                var metadata_value_list = p_metadata.values;
                for(var i = 0; i < metadata_value_list.length; i++)
                {
                    p_result.push(p_path + `/${p_metadata.name}:List Value[${i}]=${metadata_value_list[i].value}, ${metadata_value_list[i].display}`);
                }
            }
            render_optional_attributes(p_metadata, p_path, p_result);
            break;
        case 'chart':
            p_result.push(p_path + `/${p_metadata.name}`);
            p_result.push(p_path + `/${p_metadata.name}:type=${p_metadata.type}`);
            p_result.push(p_path + `/${p_metadata.name}:prompt=${p_metadata.prompt}`);
            render_optional_attributes(p_metadata, p_path, p_result);
            break;		
        default:
                console.log("editor_render not processed", p_metadata);
            break;
    }
}


function convert_path_to_lookup_object(p_root_metadata, p_path)
{
	let result = null;
	let lookup_list = p_root_metadata.lookup;

    let key_name = p_path.replace("lookup/", "");
	for(var i = 0; i < lookup_list.length; i++)
	{
		if(lookup_list[i].name == key_name)
		{
			result = lookup_list[i].values;
			break;
		}
	}


	return result;
}

function render_optional_attributes(p_metadata, p_path, p_result)
{
	for(var prop in p_metadata)
	{
		var name_check = prop.toLowerCase();
		switch(name_check)
		{
            case "name":
            case "type":
            case "prompt":
            case "values":
                break;
            default:
                p_result.push(p_path + `/${p_metadata.name}:${name_check}=${p_metadata[prop]}`);
            break;
        }

    }

}



function convert_change_text_to_mmria_path(p_value)
{

}