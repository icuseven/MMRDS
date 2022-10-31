'use strict';

var message_history = [];
var g_data = {};


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
    render();
}

function render()
{
    const el = document.getElementById("output");



    const result = [];

    result.push(render_transfer_status());
    
    result.push(`<p id='message-area-id'>${render_messages()} </p>`)
    
    result.push("<p style='text-align:right'>")
    result.push(render_save_button());
    result.push(render_submit_button());
    result.push("</p>")
    result.push(render_table());

    el.innerHTML = result.join("");
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
                <th>Prefix</th>
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

    let is_diabled = '';
    if(g_data.transfer_status_number === 1)
    {
        is_diabled = 'disabled="disabled"';
    }

    for(let i = 0; i < g_data.state_list.length; i++)
    {
        const item = g_data.state_list[i];
        const number = i + 1;
        result.push(`
            <tr>
                <td>${number}</td>
                <td style='text-align:center'><input type=checkbox value=${i} onclick='checkbox_clicked(${i})' ${item.is_included == true ? "checked":""} ${is_diabled}/></td>
                <td style='text-align:left'><input type=text value=${item.prefix} onchange='prefix_changed(${i}, this.value)' ${is_diabled}/></td>
                <td style='text-align:left'><input type=text value=${item.name} onchange='name_changed(${i}, this.value)' ${is_diabled}/></td>
            </tr>
        `);
    }

    return result.join("");
}

function render_messages()
{
    if(message_history.length > 0)
    {
        return message_history[message_history.length - 1];
    }
    else return "";
}


async function save_selections_button_click()
{

	const response = await $.ajax
    (
        {
				url: location.protocol + '//' + location.host + '/api/populate_cdc_instance',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(g_data),
				type: "POST"
		}
    );
        

    let response_obj = eval(response);
    if(response_obj.ok)
    {
        g_data._rev = response_obj.rev; 
        message_history.push(`Save successful.  ${new Date()}`);
        render();
    }
    else
    {
        message_history.push(`Problem saving!  Data NOT saved to database. ${new Date()}`);
        render();
    }
		
		
}

function sanitize_encodeHTML(s) 
{
	let result = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    return result;
}

async function checkbox_clicked(i)
{
    g_data.state_list[i].is_included = !g_data.state_list[i].is_included;
}

async function prefix_changed(i, value)
{
    g_data.state_list[i].prefix = value;
}

async function name_changed(i, value)
{
    g_data.state_list[i].name = value;
}