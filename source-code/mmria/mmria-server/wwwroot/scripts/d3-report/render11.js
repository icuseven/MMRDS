async function render11(p_post_html)
{
    const metadata = indicator_map.get(11);
    return `
    ${render_header()}

${render_navigation_strip(11)}
<div>
<h3>${metadata.title}</h3>
<p>${metadata.description}</p>
<div align=center>${await render11_chart(p_post_html)}</div>
<div align=center>${await render11_table()}</div>
</div>

${render_navigation_strip(11)}
`;


}


async function render11_chart(p_post_html)
{

    const metadata = indicator_map.get(11);
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
              left: 375
        },
        axis: {
            rotated: false, 
            
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
        //size: {
        //    height: 600, 
        //    width: 600
        //  },
          transition: {
            duration: null
          },
          bindto: '#chart',
          onrendered: function()
          {
            d3.select('#chart svg').selectAll('g.c3-axis.c3-axis-x > g.tick > text')
              .attr('transform', 'rotate(325)translate(-25,0)');
          }
        }); ` 
    );

    return `<div id="chart"></div>`
}

async function render11_table()
{

    const metadata = indicator_map.get(11);
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