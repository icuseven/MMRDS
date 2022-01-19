async function render(p_index)
{
    let index = -1;
    if(p_index == null)
    {
        const url = window.location.href;

        

        const url_array = url.split('#');

        if(url_array.length > 1)
        {
            index = parseInt(url_array[1]);
        }
    }
    else
    {
        index = p_index;
    }

    const post_html = [];
    switch(index)
    {
        case 1:
            document.getElementById('output').innerHTML = await render1(post_html);
            eval(post_html.join(""));
            break;
        case 2:
            document.getElementById('output').innerHTML = await render2(post_html);
            eval(post_html.join(""));
            break;
        case 3:
            document.getElementById('output').innerHTML = await render3(post_html);
            eval(post_html.join(""));
            break;
        case 4:
            document.getElementById('output').innerHTML = await render4(post_html);
            eval(post_html.join(""));
            break;
        case 5:
            document.getElementById('output').innerHTML = await render5(post_html);
            eval(post_html.join(""));
            break;
        case 6:
            document.getElementById('output').innerHTML = await render6(post_html);
            eval(post_html.join(""));
            break;
        case 7:
            document.getElementById('output').innerHTML = await render7(post_html);
            eval(post_html.join(""));
            break;
        case 8:
            document.getElementById('output').innerHTML = await render8(post_html);
            eval(post_html.join(""));
            break;
        case 9:
            document.getElementById('output').innerHTML = await render9(post_html);
            eval(post_html.join(""));
            break;
    
        case 10:
            document.getElementById('output').innerHTML = await render10(post_html);
            eval(post_html.join(""));
            break;
                    
        case 11:
            document.getElementById('output').innerHTML = await render11(post_html);
            eval(post_html.join(""));
            break;

        case 12:
            document.getElementById('output').innerHTML = await render12(post_html);
            eval(post_html.join(""));
            break;
        case 1:
            document.getElementById('output').innerHTML = await render1(post_html);
            eval(post_html.join(""));
            break;
        case -1:
        default:
            document.getElementById('output').innerHTML = render0();
    }

    return;
}


function pad_number(n) 
{
    n = n + '';
    return n.length >= 2 ? n : new Array(2 - n.length + 1).join("0") + n;
}

function formatDate(p_value)
{
    const result= pad_number(p_value.getMonth() + 1) + '/' + pad_number(p_value.getDate()) + '/' +  p_value.getFullYear();

    return result;
}

function ControlFormatDate(p_value)
{
    const result= p_value.getFullYear() + '-' + pad_number(p_value.getMonth() + 1) + '-' + pad_number(p_value.getDate());

    return result;
}

function render_header()
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
    `;
}

function render_filter_summary()
{
    let el  = document.getElementById("filter-summary");
    
    el.innerHTML = `
    <p><strong>Reporting State:</strong> ${g_filter.reporting_state} <span style="float:right"><button class="btn btn-secondary" onclick="show_filter_dialog()">Filter</button></span></p>
    <p><strong>Pregnancy-Relatedness:</strong> All</p>
    <p><strong>Review Dates:</strong> ${formatDate(g_filter.date_of_review.begin)} - ${formatDate(g_filter.date_of_review.end)}</p>
    <p><strong>Dates of Death:</strong> ${formatDate(g_filter.date_of_death.begin)} - ${formatDate(g_filter.date_of_death.begin)}</p>
    `;
}

function show_filter_dialog()
{
    let el  = document.getElementById("filter-dialog");
    
    el.innerHTML = `
 <div class="ui-dialog-titlebar modal-header bg-primary ui-widget-header ui-helper-clearfix">
        <span id="ui-id-1" class="ui-dialog-title">Filter</span>
        <button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close" title="×" onclick="close_filter()"><span class="ui-button-icon ui-icon ui-icon-closethick"></span><span class="ui-button-icon-space"> </span>×</button>
    </div>
    <div style="margin:15px;width:500px;">
        <p><strong>Reporting State: </strong> ${g_filter.reporting_state}</p>
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
                <tr><td><input id="review_begin_date" type="date" value="${ControlFormatDate(g_filter.date_of_review.begin)}" onchange="review_begin_date_change(this.value)" /></td><td><input  id="review_end_date" type="date" value="${ControlFormatDate(g_filter.date_of_review.end)}" onchange="review_end_date_change(this.value)" /></td></tr>
            </table>
        </p>
        <p><strong>Dates of Death:</strong> 
            <table>
                <tr><th>Begin</th><th>End</th></tr>
                <tr><td><input id="death_begin_date" type="date" value="${ControlFormatDate(g_filter.date_of_death.begin)}" onchange="death_begin_date_change(this.value)" /></td><td><input  id="death_end_date" type="date" value="${ControlFormatDate(g_filter.date_of_death.end)}" onchange="death_end_date_change(this.value)" /></td></tr>
            </table>
        </p>
    
        <p align="center">
        <button class="btn btn-secondary" onclick="close_filter()">Close</button>
        <!--button class="btn " onclick="close_filter()">Cancel</button-->
        </p>
    </div>
`;

    el.showModal();

}

function close_filter()
{
    let el = document.getElementById("filter-dialog");
    el.close();
    
    render_filter_summary();
}



