function render0()
{
    return `
    ${render_header()}
<h3><strong>Overview</strong></h3>
<p>The Interactive Aggregate Report can provide quick analysis for questions asked by committees or team leadership and provide areas to consider more thoroughly during analysis. This report can be used to look at broad categories of pregnancy-associated deaths within MMRIA but should not replace more specific analysis. For example, this report is only able to show race/ethnicity as non-Hispanic Black, non-Hispanic White, Hispanic, and Other while an individual jurisdiction can look at other race/ethnicity groupings after downloading the data.</p>

<p>Select a page in the table below</p>

<table class="table table-header-light table-striped table-hover table-hover-light nein-scroll">

<thead class="thead-dark">
<tr bgcolor=silver><th>Report Number</th><th><strong>Report Page</strong></th><th><strong>Description</strong></th></tr>
</thead>

<tbody>

<tr onclick="window.location='#1'" style="cursor: pointer;">
<td><strong>1</strong></td>
<td><strong><a href="#1">Primary Underlying Causes of Death</a></strong></td>
<td>Underlying cause of death categories are created using the primary underlying cause of death PMSS-MM codes selected by the committee. Since these PMSS-MM underlying cause of death codes are only selected for deaths determined to be pregnancy-related, please use the filter function to restrict the data to pregnancy-related deaths.</td>
</tr>



<tr bgcolor=CCCCCC onclick="window.location='#2'" style="cursor: pointer;">
<td><strong>2</strong></td>
<td><strong><a href="#2">Pregnancy-Relatedness</a></strong></td>
<td>Determined by Pregnancy-Relatedness entered on Committee Decisions form.</td>
</tr>



<!--tr onclick="window.location='#3'" style="cursor: pointer;">
<td><strong>3</strong></td>
<td><strong>Preventability</strong></td>
<td>Deaths are considered preventable if the committee selected ‘yes’ for the question ‘Was this death preventable?’ on the Committee Decisions form or selected ‘some chance’ or ‘good chance’ for the ‘Chance to alter outcome’ field on the Committee Decisions form.</td>
</tr-->



<tr bgcolor=CCCCCC onclick="window.location='#4'" style="cursor: pointer;">
<td><strong>4</strong></td>
<td><strong><a href="#4">Timing of Death</a></strong></td>
<td>The timing of death is determined by calculating the length of time between the date of death on the Home Record and the date of delivery on the Birth/Fetal Death Certificate form. If any elements of either date are missing (month, day, or year), the abstractor-assigned timing of death fields on the Home Record are used to assign the timing. If timing of death is still missing, the pregnancy checkbox on the Death Certificate form is used to assign timing of death in relation to pregnancy</td>
</tr>



<!--tr onclick="window.location='#5'" style="cursor: pointer;">
<td><strong>5</strong></td>
<td><strong>OMB race recode</strong></td>
<td>Priority is given to data entered on the Birth/Fetal Death Certificate because it is more likely to be self-reported, and if that is missing or incomplete, race is ascertained from the Death Certificate.</td>
</tr>



<tr bgcolor=CCCCCC onclick="window.location='#6'" style="cursor: pointer;">
<td><strong>6</strong></td>
<td><strong>Race</strong></td>
<td>Priority is given to data entered on the Birth/Fetal Death Certificate because it is more likely to be self-reported, and if that is missing or incomplete, race is ascertained from the Death Certificate. Decedents may have more than one race specified. Race categories do not sum to total number of deaths.</td>
</tr>



<tr onclick="window.location='#7'" style="cursor: pointer;">
<td><strong>7</strong></td>
<td><strong>Race/Ethnicity</strong></td>
<td>To be included in one of these categories, both the race and Hispanic origin variables must be completed on the Birth/Fetal Death Certificate or Death Certificate. Priority is given to data entered on the Birth/Fetal Death Certificate because it is more likely to be self-reported, and if that is missing or incomplete, race/ethnicity is ascertained from the Death Certificate.</td>
</tr>



<tr bgcolor=CCCCCC onclick="window.location='#8'" style="cursor: pointer;">
<td><strong>8</strong></td>
<td><strong>Age</strong></td>
<td>Age is calculated using the date of death on the Home Record and the date of birth on the Death Certificate form. If this data is not available, age is calculated using the date of death on the Home Record and the date of mother’s birth from the Birth/Fetal Death Certificate- Parent Section form.</td>
</tr>



<tr onclick="window.location='#9'" style="cursor: pointer;">
<td><strong>9</strong></td>
<td><strong>Education</strong></td>
<td>Add To be included in one of these categories, education must be completed on the Birth/Fetal Death Certificate or Death Certificate. Priority is given to data entered on the Birth/Fetal Death Certificate because it is self-reported, and if that is missing or incomplete, education level is pulled from the Death Certificate.</td>
</tr>



<tr bgcolor=CCCCCC onclick="window.location='#10'" style="cursor: pointer;">
<td><strong>10</strong></td>
<td><strong>Committee Determinations</strong></td>
<td>This table is based on committee determination of factors surrounding the death from the first page of Committee Decisions form, including whether obesity, discrimination, mental health conditions and/or substance use disorder contributed to the death, and whether the death was a suicide or homicide.</td>
</tr>



<tr onclick="window.location='#11'" style="cursor: pointer;">
<td><strong>11</strong></td>
<td><strong>Emotional Stress</strong></td>
<td>History of social and emotional stress is determined using the corresponding variable on the Social and Environmental Profile. Each person can have multiple stressors entered, and the graph reflects the number of persons with each stressor selected.</td>
</tr-->



<tr bgcolor=CCCCCC onclick="window.location='#12'" style="cursor: pointer;">
<td><strong>12</strong></td>
<td><strong><a href="#12">Living Arrangements</a></strong></td>
<td>Living arrangements at time of death and history of homelessness are determined using the corresponding variables on the Social and Environmental Profile. For both variables, each person can be placed into only one category.</td>
</tr>
</tbody>
</table>
`;

}


function render_table(p_metadata, p_data, p_totals, p_total)
{
    return `<table class="table rounded-0 mb-0" style="width:50%"
    title="${p_metadata.table_title_508 != null ? p_metadata.table_title_508.replace("'", ""): ""}"
    >
    
    <thead class="thead">
    <tr style="background-color:#e3d3e4;">
        <th>${p_metadata.table_title}</th>
        <th style="width:25%" align=right>Number of deaths</th>
    </tr>
    </thead>
    <tbody>
        ${p_data.join("")}
    </tbody>
    <tfoot>
        <tr style="background-color:#e3d3e4"><td><strong>Total</strong></td>
        <td align=right><strong>${p_total}</strong></td></tr>
    </tfoot>
    </table><br/>
    <p><strong>Number of deaths with missing (blank) values:</strong> ${p_totals.get(p_metadata.blank_field_id)}</p>
    <br/>
    <p>This data has been taken directly from the MMRIA database and is not a final report</p>
    <br/>
    `
}


function render_chart_508_description(p_metadata, p_data, p_totals)
{
    let i = 0;
    const html = [];

    p_totals.forEach((value, key) =>
    {
        if(key != p_metadata.blank_field_id)
        {
            html.push(`${value} for ${p_metadata.field_id_list[i].title}`);
            i++;
         }
    });
    

    return `Bar chart  shows ${html.join(",")} See the table view for additional details.`;

    /*
    return `<table class="table rounded-0 mb-0" style="width:50%">
    <thead class="thead">
    <tr style="background-color:#e3d3e4;">
        <th>${p_metadata.table_title}</th>
        <th style="width:25%" align=right>Number of deaths</th>
    </tr>
    </thead>
    <tbody>
        ${p_data.join("")}
    </tbody>
    <tfoot>
        <tr style="background-color:#e3d3e4"><td><strong>Total</strong></td>
        <td align=right><strong>${p_total}</strong></td></tr>
    </tfoot>
    </table><br/>
    <p><strong>Number of deaths with missing (blank) values:</strong> ${p_totals.get(p_metadata.blank_field_id)} </p>
    `*/
}