
var config = null;
var config_master = null;

window.onload = main;

async function main()
{
    config = await get_config();
    config_master = await get_config_master();

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


function render_prefix_control()
{
    const result = [];

    result.push('<select id="prefix" size=5><option value="">(select value)</option>');

    for (const key in Object.values(config_master.configuration_set)) 
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
        <th colspan=3>global name value list</th>
    </tr>
    <tr>
        <th colspan=3>
            ${render_prefix_control()}
        </th>
        
    </tr>
    <tr>
        <th colspan=3>installation information</th>
    </tr>
</table>
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