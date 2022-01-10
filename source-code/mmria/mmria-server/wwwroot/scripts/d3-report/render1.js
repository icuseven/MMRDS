function render1()
{
    return `
    ${render_header()}

${render_navigation_strip(1)}
<div">
<div align=center>chart goes here</div>
<div align=center>table goes here</div>
</div>

${render_navigation_strip(1)}
`;

}


function render_navigation_strip(p_current_index)
{
    if(p_current_index < 1)
    {
        return "";
    }

    const previous_index = p_current_index - 1;
    const next_index = p_current_index + 1;

    const previous_tab_name = g_nav_map.get(previous_index);
    const next_tab_name = g_nav_map.get(next_index);

    let list_options = [];

    g_nav_map.forEach
    (
        (value, index) =>
        {

            if(index == p_current_index)
            {
                list_options.push(`<option selected value=${index}>${value}</option>`)
            }
            else
            {
                list_options.push(`<option value=${index}>${value}</option>`)
            }
        }
    );

    return `
    <div  style="background:#CCCCCC;">
<table width=100%>
    <tr>
        <td valign=center><span style="font-size:18pt;">&lt; <a href="#${previous_index}">${previous_tab_name}</a></span></td>
        <td align=center>
            <select>
                ${list_options.join()}
            </select>
        </td>
        <td align=right><span style="font-size:18pt;"><a href="#${next_index}">${next_tab_name}</a> &gt;</span></td>
    </tr>
</table>
</div>`;

}