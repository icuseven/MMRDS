function render()
{
    const url = window.location.href;

    let index = -1;

    const url_array = url.split('#');

    if(url_array.length > 1)
    {
        index = parseInt(url_array[1]);
    }

    switch(index)
    {
        case 1:
            document.getElementById('output').innerHTML = render1();
            break;
        case -1:
        default:
            document.getElementById('output').innerHTML = render0();
    }
    console.log("here");
    
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



function aggregate_report_render(p_ui, p_data, p_metadata_path, p_object_path, p_is_grid_context)
{
	var result = [];

	result.push("<div style='clear:both;margin-left:10px;'>");
	result.push("<table border=1><tr style='background:#BBBBBB;'><th colspan=4>user list</th></tr>");
	
	for(var i = 0; i < p_ui.user_summary_list.length; i++)
	{
		var item = p_ui.user_summary_list[i];
		if(item._id != "org.couchdb.user:mmrds")
		{
			Array.prototype.push.apply(result, user_entry_render(item, i));
		}
	}
	
	result.push("<tr><td colspan=4 align=right>&nbsp;</tr>")
	result.push("<tr><td colspan=4 align=right>user name:<input type='text' id='new_user_name' value=''/>password:<input type='text' id='new_user_password' value=''/><input type='button' value='add new user' onclick='add_new_user_click()' /></tr>")
	result.push("</table></div><br/><br/>");

	return result;
}


function create_total_number_of_cases_by_pregnancy_relatedness(p_row_set)
{
	var result = [];
	var count = {
		'':0,
		'Pregnancy Related':0,
		'Pregnancy Associated But NOT Related':0,
		'Not Pregnancy Related or Associated (i.e. False Positive)':0,
		'Unable to Determine if Pregnancy Related or Associated':0
	}

	for(var i = 0; i < p_row_set.length; i++)
	{
		switch(p_row_set.pregnancy_relatedness)
		{
			case 'Pregnancy Related':
			//case 'Pregnancy-Related':
				count['Pregnancy Related']++;
				break;
			case 'Pregnancy Associated But NOT Related':
			//case 'Pregnancy-Associated, but NOT -Related':
				count['Pregnancy-Associated but NOT Related']++;
				break;
			case 'Not Pregnancy Related or Associated (i.e. False Positive)':
				count['Not Pregnancy Related or Associated (i.e. False Positive)']++;
				break;
			case 'Unable to Determine if Pregnancy Related or Associated':
			//case 'Pregnancy-Associated but Unable to Determine Pregnancy-Relatedness':
				count['Unable to Determine if Pregnancy Related or Associated']++;
				break;
			case '':
			default:
				count['']++;
				break;
		}
	}

	result.push("<h3>Total Number of Cases by Pregnancy Relatedness</h3>")
	result.push("<ul>");
		result.push("<li>Pregnancy Related: ");
			result.push(count['Pregnancy Related']);
		result.push('</li>');
		result.push("<li>Pregnancy Associated But NOT Related: ");
			result.push(count['Pregnancy Associated But NOT Related']);
		result.push('</li>');
		result.push("<li>Not Pregnancy Related or Associated (i.e. False Positive): ");
			result.push(count['Not Pregnancy Related or Associated (i.e. False Positive)']);
		result.push('</li>');
		result.push("<li>Unable to Determine if Pregnancy Related or Associated: ");
			result.push(count['Unable to Determine if Pregnancy Related or Associated:']);
		result.push('</li>');
		result.push("<li>Unable to Determine if Pregnancy Related or Associated: ");
			result.push(count['Unable to Determine if Pregnancy Related or Associated:']);
		result.push('</li>');
		result.push("<li>blank: ");
			result.push(count['']);
		result.push('</li>');

		// result.push("<li>Pregnancy Related: ");
		// result.push(count['Pregnancy Related']);
		// result.push("</li><li>Pregnancy Associated But NOT Related: ");
		// result.push(count['Pregnancy Associated But NOT Related']);
		// result.push("</li><li>Not Pregnancy Related or Associated (i.e. False Positive): ");
		// result.push(count['Not Pregnancy Related or Associated (i.e. False Positive)']);
		// result.push("</li><li>Unable to Determine if Pregnancy Related or Associated: ");
		// result.push(count['Unable to Determine if Pregnancy Related or Associated']);
		// result.push("</li><li>blank: ");
		// result.push(count['']);
		// result.push('</li>');
	result.push('</ul>');

	return result;
}

function create_number_of_pregnancy_related_deaths_by_race_ethnicity(p_row_set)
{
	var result = [];
	var count = {
		'': 0,
		'Hispanic': 0,
		'Non-Hispanic Black': 0,
		'Non-Hispanic White': 0,
		'American Indian / Alaska Native': 0,
		'Native Hawaiian': 0,
		'Guamanian or Chamorro': 0,
		'Samoan': 0,
		'Other Pacific Islander': 0,
		'Asian Indian': 0,
		'Filipino': 0,
		'Korean': 0,
		'Other Asian': 0,
		'Chinese': 0,
		'Japanese': 0,
		'Vietnamese': 0,
		'Other': 0
}

/*
committee_review/pregnancy_relatedness = Pregnancy Related; 

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = Yes, Mexican, Mexican American, Chicano + Yes, Puerto Rican + Yes, Cuban + Yes, Other Spanish/Hispanic/Latino +Yes, Origin Unknown

IF NO BC present:
death_certificate/demographics/is_of_hispanic_origin = Yes, Mexican, Mexican American, Chicano + Yes, Puerto Rican + Yes, Cuban + Yes, Other Spanish/Hispanic/Latino +Yes, Origin Unknown
*/

	for(var i = 0; i < p_row_set.length; i++)
	{
		var row = p_row_set[i];
		if(p_row_set.pregnancy_relatedness && p_row_set.pregnancy_relatedness == 'Pregnancy Related')
		{
			if(row.bc_is_of_hispanic_origin && row.bc_is_of_hispanic_origin.indexOf('Yes') > -1)
			{
				count.Hispanic++;
			}
			else if(row.dc_is_of_hispanic_origin && row.dc_is_of_hispanic_origin.indexOf('Yes') > -1)
			{
				count.Hispanic++;
			}
		}
	}

	result.push("<h3>Total Number of Cases by Pregnancy Relatedness</h3>")
	result.push("<ul>");
		result.push("<li>Pregnancy Related: ");
			result.push(count['Pregnancy Related']);
		result.push("</li>");
		result.push("<li>Pregnancy Associated But NOT Related: ");
			result.push(count['Pregnancy Associated But NOT Related']);
		result.push("</li>");
		result.push("<li>Not Pregnancy Related or Associated (i.e. False Positive): ");
			result.push(count['Not Pregnancy Related or Associated (i.e. False Positive)']);
		result.push("</li>");
		result.push("<li>Unable to Determine if Pregnancy Related or Associated: ");
			result.push(count['Unable to Determine if Pregnancy Related or Associated']);
		result.push("</li>");
		result.push("<li>blank: ");
			result.push(count['']);
		result.push("</li>");
	
		// result.push("<li>Pregnancy Related: ");
		// result.push(count['Pregnancy Related']);
		// result.push("</li><li>Pregnancy Associated But NOT Related: ");
		// result.push(count['Pregnancy Associated But NOT Related']);
		// result.push("</li><li>Not Pregnancy Related or Associated (i.e. False Positive): ");
		// result.push(count['Not Pregnancy Related or Associated (i.e. False Positive)']);
		// result.push("</li><li>Unable to Determine if Pregnancy Related or Associated: ");
		// result.push(count['Unable to Determine if Pregnancy Related or Associated']);
		// result.push("</li><li>blank: ");
		// result.push(count['']);
		// result.push('</li>');
	result.push('</ul>');
		
	return result;
}
