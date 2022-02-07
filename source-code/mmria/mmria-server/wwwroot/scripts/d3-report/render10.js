async function render10(p_post_html)
{
    const metadata = indicator_map.get(10);
    const data_list = await get_indicator_values(metadata.indicator_id);

    return `
    ${render_header()}

${render_navigation_strip(10)}
<div>
<h3>${metadata.title}</h3>
<p>${metadata.description}</p>
<div align=center>${await render10_chart(p_post_html, metadata, data_list)}</div>
<br/>
<div align=center>${await render10_table(metadata, data_list)}</div>
</div>

${render_navigation_strip(10)}
`;


}

async function render10_chart(p_post_html, p_metadata, p_data_list)
{
    const totals = new Map();

    const categories = [];
    for(var i = 0; i < p_metadata.field_id_list.length; i++)
    {
        const item = p_metadata.field_id_list[i];
        if(item.name != p_metadata.blank_field_id)
        {
            categories.push(`"${item.title}"`);
            totals.set(item.name, 0);
        }
    }

    for(var i = 0; i <p_data_list.data.length; i++)
    {
        const item = p_data_list.data[i];
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
        legend: {
            show: false
        },
        data: {
            columns: [
                ["${p_metadata.indicator_id}", ${data.join(",")}
                 ],
            ],
            types: {
                ${p_metadata.indicator_id}: 'bar',
        
            },
            labels: true 
        },
        padding: {
            //  left: 375
        },
        axis: {
            rotated: false, 
            
            x: {
                label: {
                text: '${p_metadata.x_axis_title}',
                position: 'outer-center'  
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

    return `
    <div class="card">
        <div class="card-header bg-secondary">
        <h4 class="h5">${p_metadata.chart_title}</h4>
        </div>
        <div class="card-body">
            <div id="chart"></div>
        </div>
    </div>
    
    `
}

async function render10_table(p_metadata, p_data_list)
{
    const totals = new Map();
    const name_to_title = new Map();

    const categories = [];
    for(var i = 0; i < p_metadata.field_id_list.length; i++)
    {
        const item = p_metadata.field_id_list[i];
        categories.push(`"${item.title}"`);
        totals.set(item.name, 0);
        name_to_title.set(item.name, item.title);
    }

    for(var i = 0; i <p_data_list.data.length; i++)
    {
        const item = p_data_list.data[i];
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
        if(key != p_metadata.blank_field_id)
        {
            data.push(`<tr><td>${name_to_title.get(key)}</td><td align=right>${value}</td></tr>`);
            total+=value;
        }

    });
    


    return render_table(p_metadata, data, totals, total);
}