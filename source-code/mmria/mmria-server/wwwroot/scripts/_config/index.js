
var config = null;
var config_master = null;
var selected_config = null;

window.onload = main;

async function main()
{
    config = await get_config();
    config_master = await get_config_master();

    var values =  Object.values(config_master.configuration_set);

    if(values.length == 0)
    {
        for (const key in config.detail_list) 
        {
            const item = config.detail_list[key];
            config_master.configuration_set[key] = {
                couchdb_url : item.url,
                db_prefix : item.prefix,
                web_site_url :"http://*:8080",
                timer_user_name : item.user_name,
                timer_value :item.user_value,
                name_value : {},
                detail_list: {}

            }
    
            //console.log(key);
        }
    }

    const el = document.getElementById("content");

    const result = await render();
    
    el.innerHTML = result.join("");
}

async function get_config()
{
    const url = `${location.protocol}//${location.host}/_config/GetConfiguration`;

    const result = await $.ajax
    ({
        url: url,
    });

    return result;
}

async function get_config_master()
{
    const url = `${location.protocol}//${location.host}/_config/GetConfigurationMaster`;

    const result = await $.ajax
    ({
        url: url,
    });

    return result;
}

function render_global_name_value()
{
    const result = [];

    

    for (const key in config_master.name_value) 
    {
        const value = config_master.name_value[key];
        const size = value.length + 3;

        const id = `g_name_value-${key}`;

        result.push('<tr><td colspan=3>');
        result.push(`<label><b>${key}</b> <input id="${id}" type="text" value="${value}" size="${size}"></input></label>`);
        result.push(` <input type="button" value="copy" onclick="copy_item('${id}')"></input> | <input type="button" value="delete" onclick="delete_item('${id}')"></input>`)
        result.push('</td></tr>');
    }

    result.push(`<tr>
    <td>
    <input type="text" id="add_new_g_name_value" value=""></input>
    <input type="button" value="add" onclick="add_item('add_new_g_name_value')"></input>
    </td>
    <td>
    &nbsp;
    </td>
    <td>
    <input type="button" value="paste" onclick="paste_item('add_new_g_name_value')"></input>
    </td>

</tr>`);
    

    return result.join('');
}



function render_prefix_control()
{
    const result = [];

    result.push('<select id="prefix" size=5 onchange="prefix_selection_changed(this.value)"><option value="">(select value)</option>');

    for (const key in config_master.configuration_set) 
    {
        result.push(`<option value="${key}">${key}</option>`);
    }

    result.push('</select>');

    return result.join('');
}


async function render()
{

    const result = []

    result.push(
    `
 <table>
    <tr>
        <th colspan=3>view configuration settings</th>
    </tr>
    <tr>
    <th colspan=3><hr/></th>
</tr>
    <tr>
        <th colspan=3>global name value list</th>
    </tr>
    ${render_global_name_value()}
    <tr>
        <th colspan=3><hr/></th>
    </tr>
    <tr>
        <th colspan=3>
            ${render_prefix_control()}
        </th>
        
    </tr>
</table>

        <div id="config_detail">${render_config_detail()}</div>
    `
    );


/*
    <tr><td>is_environment_based</td><td>@Html.TextBoxFor(m => m.is_environment_based.Value)</td></tr>

    <tr><td><span title="web_site_url: The only important thing for this setting is the port number. ">web_site_url</span></td><td>@Html.TextBoxFor(m => m.web_site_url, new { @class= "wide" })</td></tr>

    <tr><td>log_directory</td><td>@Html.TextBoxFor(m => m.log_directory, new { @class= "wide" })</td></tr>

    <tr><td>export_directory</td><td>@Html.TextBoxFor(m => m.export_directory, new { @class= "wide" })</td></tr>


    <tr><td colspan=2>&nbsp;</td></tr>
    <tr><td colspan=2 align=center><b>Database Information</b></td></tr>
    
    <tr><td>couchdb_url</td><td>@Html.TextBoxFor(m => m.couchdb_url, new { @class= "wide" })</td></tr>

    <tr><td>timer_user_name</td><td>@Html.TextBoxFor(m => m.timer_user_name)</td></tr>

    <tr><td>timer_value</td><td><span title='@Model.timer_value'>@Html.PasswordFor(m => m.timer_value)</span></td></tr>

    <tr><td>cron_schedule</td><td>@Html.TextBoxFor(m => m.cron_schedule)</td></tr>

    <tr><td colspan=2>&nbsp;</td></tr>
    <tr><td colspan=2 align=center><b>Email Configuration</b></td></tr>

    <tr><td>EMAIL_USE_AUTHENTICATION</td><td>@Html.TextBoxFor(m => m.EMAIL_USE_AUTHENTICATION)</td></tr>

    <tr><td>EMAIL_USE_SSL</td><td>@Html.TextBoxFor(m => m.EMAIL_USE_SSL)</td></tr>

    <tr><td>SMTP_HOST</td><td>@Html.TextBoxFor(m => m.SMTP_HOST)</td></tr>

    <tr><td>SMTP_PORT</td><td>@Html.TextBoxFor(m => m.SMTP_PORT)</td></tr>

    <tr><td>EMAIL_FROM</td><td>@Html.TextBoxFor(m => m.EMAIL_FROM, new { @class= "wide" })</td></tr>

    <tr><td>EMAIL_PASSWORD</td><td><span title='@Model.EMAIL_PASSWORD'>@Html.PasswordFor(m => m.EMAIL_PASSWORD, new { @class= "wide" })</span></td></tr>

    <tr><td colspan=2>&nbsp;</td></tr>
    <tr><td colspan=2 align=center><b>Password Policy</b></td></tr>

    <tr><td>pass_word_minimum_length</td><td>@Html.TextBoxFor(m => m.pass_word_minimum_length)</td></tr>

    <tr><td>pass_word_days_before_expires</td><td>@Html.TextBoxFor(m => m.pass_word_days_before_expires)</td></tr>

    <tr><td>pass_word_days_before_user_is_notified_of_expiration</td><td>@Html.TextBoxFor(m => m.pass_word_days_before_user_is_notified_of_expiration)</td></tr>

  <tr><td colspan=2>&nbsp;</td></tr>
  <tr><td colspan=2 align=center><b>Authentication Policy</b></td></tr>
  <tr><td>default_days_in_effective_date_interval</td><td>@Html.TextBoxFor(m => m.default_days_in_effective_date_interval)</td></tr>

  <tr><td>unsuccessful_login_attempts_number_before_lockout</td><td>@Html.TextBoxFor(m => m.unsuccessful_login_attempts_number_before_lockout)</td></tr>            

  <tr><td>unsuccessful_login_attempts_within_number_of_minutes</td><td>@Html.TextBoxFor(m => m.unsuccessful_login_attempts_within_number_of_minutes)</td></tr>

  <tr><td>unsuccessful_login_attempts_lockout_number_of_minutes</td><td>@Html.TextBoxFor(m => m.unsuccessful_login_attempts_lockout_number_of_minutes)</td></tr>

    </table>
}
<br/>
<p><b>NOTE:</b> To change settings please edit the appsettings.json configuration file and restart the mmria-server or mmria-service.</p>

*/

    return result;
}

function render_config_detail()
{
    const result = [];
    if(selected_config == null) return "";

    const val = config_master.configuration_set[selected_config];

    if(val == null) return "";

    result.push(
        ` <table>
        <tr>
            <th colspan=3>configuration detail</th>
        </tr>        
        `
    )

    
    for (const key in val) 
    {
        const value = val[key];
        const size = value.length + 3;

        if(typeof(value) === 'object')
        {


        }
        else
        {
            const id = `detail-${selected_config}-${key}`;
            result.push(`<tr><td colspan=3><label>${key} <input id="${id}" type="text" value="${value}" size="${size}"></input></label>`);
            result.push(` <input type="button" value="copy" onclick="copy_item('${id}')"></input> | 
                        <input type="button" value="delete" onclick="delete_item('${id}')"></input></td></tr>`)

        }
        
    }

    result.push(`<tr>
    <td>
    <input type="text" id="add_new_detail-${selected_config}" value=""></input>
    <input type="button" value="add" onclick="add_item('add_new_detail-${selected_config}')"></input>
    </td>
    <td>
    &nbsp;
    </td>
    <td>
    <input type="button" value="paste" onclick="paste_item('add_new_detail-${selected_config}')"></input>
    </td>

    </tr>`);

    result.push(`<tr><td colspan=3><hr/></td></tr>`)
    result.push(`<tr><th colspan=3>name_value</th></tr>`)
    for (const k in val.name_value) 
    {
        const v = val.name_value[k];
        const s = v.length + 3;

        const id = `name_value-${selected_config}-${k}`;

        result.push('<tr><td colspan=3>');
        result.push(`<label><b>${k}</b> <input type="text" id="${id}" value="${v}" size="${s}"></input></label>`);
        result.push(` <input type="button" value="copy" onclick="copy_item('${id}')"></input> | 
                        <input type="button" value="delete" onclick="delete_item('${id}')"></input>`)
        result.push('</td></tr>');
    }

    result.push(`<tr>
        <td>
        <input type="text" id="add_new_name_value-${selected_config}" value=""></input>
        <input type="button" value="add" onclick="add_item('add_new_name_value-${selected_config}')"></input>
        </td>
        <td>
        &nbsp;
        </td>
        <td>
        <input type="button" value="paste" onclick="paste_item('add_new_name_value-${selected_config}')"></input>
        </td>

    </tr>`);



    result.push(`<tr><td colspan=3><hr/></td></tr>`)
    result.push(`<tr><th colspan=3>detail_list</th></tr>`)
    for (const k in val.detail_list) 
    {
        const v = val.detail_list[k];
        const s = v.length + 3;

        const id = `detail_list-${selected_config}-${k}`;

        result.push('<tr><td colspan=3>');
        result.push(`<label><b>${k}</b> <input type="text" value="${v}" size="${s}"></input></label>`);
        result.push(` <input type="button" value="copy" onclick="copy_item('${id}')"></input> | 
                        <input type="button" value="delete" onclick="delete_item('${id}')"></input>`)
        result.push('</td></tr>');
    }

    result.push(`<tr>
        <td>
        <input type="text" id="add_new_detail_list-${selected_config}" value=""></input>
        <input type="button" value="add" onclick="add_item('add_new_detail_list-${selected_config}')"></input>
        </td>
        <td>
        &nbsp;
        </td>
        <td>
        <input type="button" value="paste" onclick="paste_item('add_new_detail_list-${selected_config}')"></input>
        </td>

    </tr>`);

    result.push("</table>");

    return result.join("");

}

function prefix_selection_changed(value)
{
    const val = config_master.configuration_set[value];
    if(val == null) return;

    selected_config = value;

    //console.log("prefix_selection_changed: " + value);

    const el = document.getElementById("config_detail");
    el.innerHTML = render_config_detail();
}

function copy_item(p_id)
{
    console.log("copy: " + p_id);
}

function delete_item(p_id)
{
    console.log("delete: " + p_id);
}

function add_item(p_id)
{
    console.log("add: " + p_id);
}

function paste_item(p_id)
{
    console.log("paste: " + p_id);
}