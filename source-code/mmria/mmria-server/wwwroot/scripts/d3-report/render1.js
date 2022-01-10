function render1()
{
    return `
    <div id="filter-summary"
    style="width:415px;padding: 10px;border: 2px solid #000;border-radius: 15px;-moz-border-radius: 15px;"
    >
    <p><strong>Reporting State:</strong> ${g_filter.reporting_state} <span style="float:right"><button class="btn btn-secondary" onclick="show_filter_dialog()">Filter</button></span></p>
    <p><strong>Pregnancy-Relatedness:</strong> All</p>
    <p><strong>Review Dates:</strong> ${formatDate(g_filter.date_of_review.begin)} - ${formatDate(g_filter.date_of_review.end)}</p>
    <p><strong>Dates of Death:</strong> ${formatDate(g_filter.date_of_death.begin)} - ${formatDate(g_filter.date_of_death.begin)}</p>
    </div>
<button class="btn btn-secondary" style="float:right;">Print All / Save as PDF</button>
<dialog  id="filter-dialog" style="top:50%" class="p-0 set-radius">
    <p><strong>Reporting State: </strong> Georgia</p>
    <p>
    <strong>Pregnancy-Relatedness:</strong> All
    <ul>
        <li><input type="checkbox" /> All</li>
        <li><input type="checkbox" /> Pregnancy related</li>
        <li><input type="checkbox" /> Pregnancy-Associated, but NOT-Related</li>
        <li><input type="checkbox" /> Pregnancy-Associated, but unable to Determine Pregnancy-Relatedness</li>
        <li><input type="checkbox" /> Not Pregnancy-Related or -Associated (i.e. Fals Positive</li>
    </ul>    
    </p>
    <p>
        <strong>Review Dates:</strong> 
        <table>
            <tr><th>Begin</th><th>End</th></tr>
            <tr><td><input id="review_begin_date" type="date" value="2000-08-19" onchange="review_begin_date_change(this.value)" /></td><td><input  id="review_end_date" type="date" value="2021-11-26" onchange="review_end_date_change(this.value)"/></td></tr>
        </table>
    </p>
    <p><strong>Dates of Death:</strong> 
        <table>
            <tr><th>Begin</th><th>End</th></tr>
            <tr><td><input id="death_begin_date" type="date" value="2000-08-19" onchange="death_begin_date_change(this.value)"/></td><td><input  id="death_end_date" type="date" value="2021-11-26" onchange="death_end_date_change(this.value)"/></td></tr>
        </table>
    </p>

    <div align="center">
    <button class="btn btn-secondary">Close</button>
    <!--button class="btn ">Cancel</button-->
    </div>

</dialog>
<br/><br/>

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