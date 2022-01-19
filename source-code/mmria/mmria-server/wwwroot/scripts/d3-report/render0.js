function render0()
{
    return `
    ${render_header()}

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

    if(next_index < 13)
    {
        return `
        <nav role="navigation" aria-label="Previous and Next Pages" class="tp-multipage">
            <ul class="d-flex justify-content-between">
                <li class="tp-mp-prev tp-mp-arrow">
                    <a href="#${previous_index}" title="Previous Page"><span class="d-lg-none">Prev</span><span class="d-none d-lg-inline">${previous_tab_name}</span></a>
                </li>
                <li style="margin-top:15px;">
                    <select onchange="nav_dropdown_change(this.value)">
                        ${list_options.join()}
                    </select>
                </li>
                <li class="tp-mp-next tp-mp-arrow">
                    <a href="#${next_index}" title="Next Page"><span class="d-lg-none">Next</span><span class="d-none d-lg-inline">${next_tab_name}</span></a>
                </li>
            </ul>
        </nav>

    `;
    }
    else
    {
        return `
        <nav role="navigation" aria-label="Previous and Next Pages" class="tp-multipage">
            <ul class="d-flex justify-content-between">
                <li class="tp-mp-prev tp-mp-arrow">
                    <a href="#${previous_index}" title="Previous Page"><span class="d-lg-none">Prev</span><span class="d-none d-lg-inline">${previous_tab_name}</span></a>
                </li>
                <li style="margin-top:15px;">
                    <select onchange="nav_dropdown_change(this.value)">
                        ${list_options.join()}
                    </select>
                </li>
                <li>
                    &nbsp;
                </li>
            </ul>
        </nav>

    `;
    }

}

function nav_dropdown_change(p_value)
{
    window.location = "#" + p_value;
}


function render_table(p_metadata, p_data, p_totals, p_total)
{
    return `<table class="table rounded-0 mb-0" style="width:50%">
    <thead class="thead">
    <tr style="background-color:#e3d3e4">
        <th>${p_metadata.title}</th>
        <th align=right style="width:25%">Number of deaths</th>
    </tr>
    </thead>
    <tbody>
        ${p_data.join("")}
    </tbody>
    <tfoot>
        <tr style="background-color:#e3d3e4"><td><strong>Total</strong></td>
        <td align=right><strong>${p_total}</strong></td></tr>
    </tfoot>
    </table>
    <p><strong>Number of deaths with missing (blank) values:</strong> ${p_totals.get(p_metadata.blank_field_id)} </p>
    `
}