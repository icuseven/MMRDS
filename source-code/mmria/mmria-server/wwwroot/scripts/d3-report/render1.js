async function render1(p_post_html)
{
    return `
    ${render_header()}

${render_navigation_strip(1)}
<div">
<div align=center>${await render1_chart(p_post_html)}</div>
<div align=center>${await render1_table()}</div>
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

async function render1_chart(p_post_html)
{

    const metadata = indicator_map.get(1);
    const values = await get_indicator_values(metadata.indicator_id);
    const totals = new Map();

    const categories = [];
    for(var i = 0; i < metadata.field_id_list.length; i++)
    {
        const item = metadata.field_id_list[i];
        categories.push(`"${item.title}"`);
        totals.set(item.name, 0);
    }

    for(var i = 0; i <g_data.data.length; i++)
    {
        const item = g_data.data[i];
        if(totals.has(item.field_id))
        {
            let val = totals.get(item.field_id);
            totals.set(item.field_id, val + 1);
        }
    }

    const data = [];

    totals.forEach((value, key) =>
    {
        data.push(value);
    });
    

    p_post_html.push
    (
        
    `var chart = c3.generate({
        data: {
            columns: [
                ["${metadata.indicator_id}", ${data.join(",")}
                 ],
            ],
            types: {
                ${metadata.indicator_id}: 'bar',
        
            },
            labels: true 
        },
        padding: {
              left: 675
        },
        axis: {
            rotated: true, 
            
            x: {
                label: {
                text: '${metadata.title}',
                position: 'outer-middle'  
                },
                tick: {
                    multiline: false,
                },
                type: 'category',
                categories: [${categories}],
            },
        }
        }); ` 
    );

    return `<div id="chart"></div>`
}

async function render1_table()
{

    const metadata = indicator_map.get(1);
    const values = await get_indicator_values(metadata.indicator_id);
    const totals = new Map();
    const name_to_title = new Map();

    const categories = [];
    for(var i = 0; i < metadata.field_id_list.length; i++)
    {
        const item = metadata.field_id_list[i];
        categories.push(`"${item.title}"`);
        totals.set(item.name, 0);
        name_to_title.set(item.name, item.title);
    }

    for(var i = 0; i <g_data.data.length; i++)
    {
        const item = g_data.data[i];
        if(totals.has(item.field_id))
        {
            let val = totals.get(item.field_id);
            totals.set(item.field_id, val + 1);
        }
    }

    const data = [];
    let total = 0;

    totals.forEach((value, key) =>
    {
        if(key != metadata.blank_field_id)
        {
            data.push(`<tr><td>${name_to_title.get(key)}</td><td align=right>${value}</td></tr>`);
            total+=value;
        }

    });
    


    return `<table class="table rounded-0 mb-0" style="width:50%">
    <thead class="thead">
    <tr>
        <th>${metadata.title}</th>
        <th align=right style="width:25%">Number of deaths</th>
    </tr>
    </thead>
    <tbody>
        ${data.join("")}
    </tbody>
    <tfoot>
        <tr><td><strong>Total</strong></td>
        <td align=right><strong>${total}</strong></td></tr>
    </tfoot>
    </table>
    <p><strong>Number of deaths with missing (blank) values:</strong> ${totals.get(metadata.blank_field_id)} </p>
    
    `
}