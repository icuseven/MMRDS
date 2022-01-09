function render()
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
            <tr><td><input id="review_begin_date" type="date" value="2000-08-19"/></td><td><input  id="review_end_date" type="date" value="2021-11-26"/></td></tr>
        </table>
    </p>
    <p><strong>Dates of Death:</strong> 
        <table>
            <tr><th>Begin</th><th>End</th></tr>
            <tr><td><input id="death_begin_date" type="date" value="2000-08-19"/></td><td><input  id="death_end_date" type="date" value="2021-11-26"/></td></tr>
        </table>
    </p>

    <div align="center">
    <button class="btn btn-secondary">Close</button>
    <!--button class="btn ">Cancel</button-->
    </div>

</dialog>
<br/><br/>

<table class="table table-header-light table-striped table-hover table-hover-light nein-scroll">


<h3><strong>Overview</strong></h3>
<p>The Interactive Aggregate Report can provide quick analysis for questions asked by committees or team leadership and provide areas to consider more thoroughly during analysis. This report can be used to look at broad categories of pregnancy-associated deaths within MMRIA but should not replace more specific analysis. For example, this report is only able to show race/ethnicity as non-Hispanic Black, non-Hispanic White, Hispanic, and Other while an individual jurisdiction can look at other race/ethnicity groupings after downloading the data.</p>

<p>Select a page in the table below</p>

<thead class="thead-dark">
    <tr bgcolor=silver><th><strong>Report Page</strong></th><th><strong>Description</strong></th></tr>
</thead>

<tbody>

<tr onclick="window.location='#1'">
<td><strong>1. Primary Underlying Cause of Death</strong></td>
<td>Underlying cause of death categories are created using the primary underlying cause of death PMSS-MM codes selected by the committee. Since these PMSS-MM underlying cause of death codes are only selected for deaths determined to be pregnancy-related, please use the filter function to restrict the data to pregnancy-related deaths.</td>
</tr>



<tr bgcolor=CCCCCC onclick="window.location='#2'">
<td><strong>2. Pregnancy Relatedness</strong></td>
<td>Determined by Pregnancy-Relatedness entered on Committee Decisions form.</td>
</tr>



<tr onclick="window.location='#3'">
<td><strong>3. Preventability</strong></td>
<td>Deaths are considered preventable if the committee selected ‘yes’ for the question ‘Was this death preventable?’ on the Committee Decisions form or selected ‘some chance’ or ‘good chance’ for the ‘Chance to alter outcome’ field on the Committee Decisions form.</td>
</tr>



<tr bgcolor=CCCCCC onclick="window.location='#4'">
<td><strong>4. Timing of Death</strong></td>
<td>The timing of death is determined by calculating the length of time between the date of death on the Home Record and the date of delivery on the Birth/Fetal Death Certificate form. If any elements of either date are missing (month, day, or year), the abstractor-assigned timing of death fields on the Home Record are used to assign the timing. If timing of death is still missing, the pregnancy checkbox on the Death Certificate form is used to assign timing of death in relation to pregnancy</td>
</tr>



<tr onclick="window.location='#5'">
<td><strong>5. OMB race recode</strong></td>
<td>Priority is given to data entered on the Birth/Fetal Death Certificate because it is more likely to be self-reported, and if that is missing or incomplete, race is ascertained from the Death Certificate.</td>
</tr>



<tr bgcolor=CCCCCC onclick="window.location='#6'">
<td><strong>6. Race</strong></td>
<td>Priority is given to data entered on the Birth/Fetal Death Certificate because it is more likely to be self-reported, and if that is missing or incomplete, race is ascertained from the Death Certificate. Decedents may have more than one race specified. Race categories do not sum to total number of deaths.</td>
</tr>



<tr onclick="window.location='#7'">
<td><strong>7. Race/Ethnicity</strong></td>
<td>To be included in one of these categories, both the race and Hispanic origin variables must be completed on the Birth/Fetal Death Certificate or Death Certificate. Priority is given to data entered on the Birth/Fetal Death Certificate because it is more likely to be self-reported, and if that is missing or incomplete, race/ethnicity is ascertained from the Death Certificate.</td>
</tr>



<tr bgcolor=CCCCCC onclick="window.location='#8'">
<td><strong>8. Age</strong></td>
<td>Age is calculated using the date of death on the Home Record and the date of birth on the Death Certificate form. If this data is not available, age is calculated using the date of death on the Home Record and the date of mother’s birth from the Birth/Fetal Death Certificate- Parent Section form.</td>
</tr>



<tr onclick="window.location='#9'">
<td><strong>9. Education</strong></td>
<td>Add To be included in one of these categories, education must be completed on the Birth/Fetal Death Certificate or Death Certificate. Priority is given to data entered on the Birth/Fetal Death Certificate because it is self-reported, and if that is missing or incomplete, education level is pulled from the Death Certificate.</td>
</tr>



<tr bgcolor=CCCCCC onclick="window.location='#10'">
<td><strong>10. Committee Determinations</strong></td>
<td>This table is based on committee determination of factors surrounding the death from the first page of Committee Decisions form, including whether obesity, discrimination, mental health conditions and/or substance use disorder contributed to the death, and whether the death was a suicide or homicide.</td>
</tr>



<tr onclick="window.location='#11'">
<td><strong>11. Emotional Stress</strong></td>
<td>History of social and emotional stress is determined using the corresponding variable on the Social and Environmental Profile. Each person can have multiple stressors entered, and the graph reflects the number of persons with each stressor selected.</td>
</tr>



<tr bgcolor=CCCCCC onclick="window.location='#12'">
<td><strong>12. Living Arrangements</strong></td>
<td>Living arrangements at time of death and history of homelessness are determined using the corresponding variables on the Social and Environmental Profile. For both variables, each person can be placed into only one category.</td>
</tr>
</tbody>
</table>



<!--div class="content-intro">
  <div class="row no-gutters align-items-center mb-2">
    <label for="year_of_death" class="font-weight-bold mr-2 mb-0">Year of Death:</label>
    <select id="year_of_death" class="form-control w-auto">
      <option>All</option>
      <option>2020</option>
      <option>2019</option>
      <option>2018</option>
      <option>2017</option>
      <option>2016</option>
      <option>2015</option>
      <option>2014</option>
      <option>2013</option>
      <option>2012</option>
      <option>2011</option>
      <option>2010</option>
      <option>2009</option>
      <option>2008</option>
      <option>2007</option>
      <option>2006</option>
      <option>2005</option>
      <option>2004</option>
      <option>2003</option>
      <option>2002</option>
      <option>2001</option>
      <option>2000</option>
      <option>1999</option>
    </select>
  </div>

  <div class="mb-3">
    <p class="font-weight-bold mb-2">Date of case review: </p>
    <div class="row no-gutters align-items-center">
      <label for="month_of_case_review" class="mr-1 mb-0">Month</label>
      <select id="month_of_case_review" class="form-control mr-3 w-auto">
        <option>All</option>
        <option>01</option>
        <option>02</option>
        <option>03</option>
        <option>04</option>
        <option>05</option>
        <option>06</option>
        <option>07</option>
        <option>08</option>
        <option>09</option>
        <option>10</option>
        <option>11</option>
        <option>12</option>
      </select>
      <label for="year_of_case_review" class="mr-1 mb-0">Year</label>
      <select id="year_of_case_review" class="form-control w-auto">
        <option>All</option>
        <option>2020</option>
        <option>2019</option>
        <option>2018</option>
        <option>2017</option>
        <option>2016</option>
        <option>2015</option>
        <option>2014</option>
        <option>2013</option>
        <option>2012</option>
        <option>2011</option>
        <option>2010</option>
        <option>2009</option>
        <option>2008</option>
        <option>2007</option>
        <option>2006</option>
        <option>2005</option>
        <option>2004</option>
        <option>2003</option>
        <option>2002</option>
        <option>2001</option>
        <option>2000</option>
        <option>1999</option>
      </select>
    </div>
  </div>
  <div class="row no-gutters align-items-center justify-content-start">
    <button class="btn btn-secondary" onclick="init_inline_loader(generate_report_click)">Generate Report</button>
    <span class="spinner-container spinner-inline ml-2"><span class="spinner-body text-primary"><span class="spinner"></span></span></span>
  </div>
</div-->`;
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
                <tr><td><input id="review_begin_date" type="date" value="${ControlFormatDate(g_filter.date_of_review.begin)}"/></td><td><input  id="review_end_date" type="date" value="${ControlFormatDate(g_filter.date_of_review.end)}"/></td></tr>
            </table>
        </p>
        <p><strong>Dates of Death:</strong> 
            <table>
                <tr><th>Begin</th><th>End</th></tr>
                <tr><td><input id="death_begin_date" type="date" value="${ControlFormatDate(g_filter.date_of_death.begin)}"/></td><td><input  id="death_end_date" type="date" value="${ControlFormatDate(g_filter.date_of_death.end)}"/></td></tr>
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
