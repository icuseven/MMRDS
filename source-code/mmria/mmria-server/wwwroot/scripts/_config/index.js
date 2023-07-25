
var config = null;
var config_master = null;
var selected_config = "shared";
var applied_config_master = null;

window.onload = main;

async function main()
{
    config = await get_config();
    config_master = await get_config_master();
    applied_config_master = await get_applied_config_master();

    const boolean_keys =  Object.values(config_master.boolean_keys);

    if(boolean_keys.length == 0)
    {

        config_master.boolean_keys = applied_config_master.boolean_keys;
    }

    const integer_keys =  Object.values(config_master.integer_keys);

    if(integer_keys.length == 0)
    {
        config_master.integer_keys = applied_config_master.integer_keys;
        
    }


    const string_keys =  Object.values(config_master.string_keys);

    if(string_keys.length == 0)
    {
        config_master.string_keys = applied_config_master.string_keys;
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

async function get_applied_config_master()
{
    const url = `${location.protocol}//${location.host}/_config/GetAppliedConfiguration`;

    const result = await $.ajax
    ({
        url: url,
    });

    return result;
}



function render_boolean_keys2()
{
    const result = [];

    

    for (const key in config_master.name_value) 
    {
        const value = config_master.name_value[key];
        const size = typeof(value) === "string" ? value.length + 3: value.toString().length + 3;

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


function render_config_select(value)
{
    const result = [];

    result.push('<select id="prefix" size=5 onchange="prefix_selection_changed(this.value)">');

    for (const key in config_master.string_keys) 
    {
        if(key == value)
        {
            result.push(`<option value="${key}" selected>${key}</option>`);
        }
        else
        {
            result.push(`<option value="${key}">${key}</option>`);
        }
    }

    result.push('</select>');

    return result.join('');
}

async function render()
{

    const result = []

    result.push(
   `
   <br/> 
<div id="select">${render_config_select(selected_config)}</div>
<hr/>
<div id="boolean_keys">${render_boolean_keys()}</div>
<hr/>
<div id="integer_keys">${render_integer_keys()}</div>
<hr/>
<div id="string_keys">${render_string_keys()}</div>
    `
    );

    return result;
}

function render_boolean_keys()
{
    const result = [];
    if(selected_config == null) 
        selected_config = "shared";

    const val = config_master.boolean_keys[selected_config];

    if(val == null) return "";

    result.push(
        ` <table>
        <tr>
            <th colspan=3>boolean keys [${selected_config}]</th>
        </tr>        
        `
    )

    
    for (const key in val) 
    {
        const value = val[key];
        const size = typeof(value) === "string" ? value.length + 3: value.toString().length + 3;

        if(typeof(value) === 'object')
        {


        }
        else
        {
            const id = `detail-${selected_config}-${key}`;
            result.push(`<tr><td colspan=3><label><b>${key}</b> <input id="${id}" type="text" value="${value}" size="${size}"></input></label>`);
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

    result.push("</table>");

    return result.join("");

}

function render_integer_keys()
{
    const result = [];
    if(selected_config == null) 
        selected_config = "shared";

    const val = config_master.integer_keys[selected_config];

    if(val == null) return "";

    result.push(
        ` <table>
        <tr>
            <th colspan=3>integer keys [${selected_config}]</th>
        </tr>        
        `
    )

    
    for (const key in val) 
    {
        const value = val[key];
        const size = typeof(value) === "string" ? value.length + 3: value.toString().length + 3;

        if(typeof(value) === 'object')
        {


        }
        else
        {
            const id = `detail-${selected_config}-${key}`;
            result.push(`<tr><td colspan=3><label><b>${key}</b> <input id="${id}" type="text" value="${value}" size="${size}"></input></label>`);
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

    result.push("</table>");

    return result.join("");

}

function render_string_keys()
{
    const result = [];
    if(selected_config == null) 
        selected_config = "shared";

    const val = config_master.string_keys[selected_config];

    if(val == null) return "";

    result.push(
        ` <table>
        <tr>
            <th colspan=3>string keys [${selected_config}]</th>
        </tr>        
        `
    )

    
    for (const key in val) 
    {
        const value = val[key];
        const size = typeof(value) === "string" ? value.length + 3: value.toString().length + 3;

        if(typeof(value) === 'object')
        {


        }
        else
        {
            const id = `detail-${selected_config}-${key}`;
            result.push(`<tr><td colspan=3><label><b>${key}</b> <input id="${id}" type="text" value="${value}" size="${size}"></input></label>`);
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
    el.innerHTML = render_string_keys();
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