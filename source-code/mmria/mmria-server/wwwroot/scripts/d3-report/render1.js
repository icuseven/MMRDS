function render1(p_post_html)
{
    return `
    ${render_header()}

${render_navigation_strip(1)}
<div">
<div align=center>${render1_chart(p_post_html)}</div>
<div align=center>${render1_table()}</div>
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

function nav_dropdown_change(p_value)
{
    window.location = "#" + p_value;
}

function render1_chart(p_post_html)
{

    const values = get_indicator_values(indicator_map.get(1).indicator_id);

    p_post_html.push
    (
        
    `var chart = c3.generate({
        data: {
            columns: [
                ['data1', 246, 220, 175, 85, 147, 7, 181, 23, 22, 
                8, 466, 116, 303, 47, 38, 7, 73,32, 25,566, 98
                 ],
            ],
            types: {
                data1: 'bar',
        
            },
            labels: true 
        },
        padding: {
              left: 375
        },
        axis: {
            rotated: true,        
            x: {
                tick: {
                    multiline: false,
                },
                type: 'category',
                categories: [
                'Hemorrhage (Excludes Aneurysms or CVA)',
                'Infection',
                'Embolism - Thrombotic (Non-Cerebral)',
                'Amniotic Fluid Embolism',
                'Hyperensive Disorders of Pregnancy',
                'Aneshesia Complications',
                'Cardiomyopathy',
                'Hemtologic',
                'Collagen Vascular/Autoimmune Diseases',
                'Conditions Unique to Pregnacy' ,
                'Injury',
                'Cancer',
                'Cardiovascular Conditions',
                'Pulmonary Conditions (Excludes ARDS)',
                'Neourologic/Neurvascular Conditions (Excluding CVA)',
                'Renal Diseases',
                'Cerebrovascular Accident not Secondary to Hypertensive Disorders of Pregnancy',
                'Metabolic/Endocrine',
                'Gastrointestinal Disorders',
                'Mental Health Conditions',
                'Unknown Cause of Death'
                ],
            },
        }
        }); ` 
    );

    return `<div id="chart"></div>`
}

function render1_table()
{
    return `<table>
    
    
    </table>`
}