async function render1(p_post_html)
{
    const metadata = indicator_map.get(1);
    return `
    ${render_header()}

${render_navigation_strip(1)}
<div>
<h3>${metadata.title}</h3>
<p>${metadata.description}</p>
<div align=center>${await render1_chart(p_post_html)}</div>
<br/>
<div align=center>${await render1_table()}</div>
</div>

${render_navigation_strip(1)}
`;


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
              //left: 675
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
        },

        }); ` 
    );

    return `
    <div class="card">
        <div class="card-header bg-secondary">
        <h4 class="h5">${metadata.title}</h4>
        </div>
        <div class="card-body">
            <div id="chart"></div>
        </div>
    </div>
    
    `
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
    

    return render_table(metadata, data, totals, total);
}




