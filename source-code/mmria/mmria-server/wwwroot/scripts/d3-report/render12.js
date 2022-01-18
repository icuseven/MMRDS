async function render12(p_post_html)
{
    const metadata = indicator_map.get(12);
    return `
    ${render_header()}

${render_navigation_strip(12)}
<div>
<h3>${metadata.title}</h3>
<p>${metadata.description}</p>
<ul style="align:center;">
    <li style="display: inline-block;float:left;width:48%">
        <div align=center>${await render121_chart(p_post_html)}</div>
        <br/>
        <div align=center>${await render121_table()}</div>
        </div>

    </li>

    <li style="display: inline-block;float:right;width:48%">
        <div align=center>${await render122_chart(p_post_html)}</div>
        <br/>
        <div align=center>${await render122_table()}</div>
        </div>

    </li>
</ul>

<br style="clear:both;"/>
${render_navigation_strip(12)}
`;


}


async function render121_chart(p_post_html)
{

    const metadata = indicator_map.get(12);
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
        
    `var chart1 = c3.generate({
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
            //  left: 375
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
          bindto: '#chart1',
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
        <h4 class="h5">${metadata.title}</h4>
        </div>
        <div class="card-body">
            <div id="chart1"></div>
        </div>
    </div>
    
    `
}

async function render122_chart(p_post_html)
{

    const metadata = indicator_map.get(13);
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
        
    `var chart2 = c3.generate({
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
            //  left: 375
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
          bindto: '#chart2',
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
        <h4 class="h5">${metadata.title}</h4>
        </div>
        <div class="card-body">
            <div id="chart2"></div>
        </div>
    </div>
    
    `
}

async function render121_table()
{

    const metadata = indicator_map.get(12);
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
    <tr style="background-color:#e3d3e4">
        <th>${metadata.title}</th>
        <th align=right style="width:25%">Number of deaths</th>
    </tr>
    </thead>
    <tbody>
        ${data.join("")}
    </tbody>
    <tfoot>
        <tr style="background-color:#e3d3e4"><td><strong>Total</strong></td>
        <td align=right><strong>${total}</strong></td></tr>
    </tfoot>
    </table>
    <p><strong>Number of deaths with missing (blank) values:</strong> ${totals.get(metadata.blank_field_id)} </p>
    
    `
}

async function render122_table()
{

    const metadata = indicator_map.get(13);
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
    <tr style="background-color:#e3d3e4">
        <th>${metadata.title}</th>
        <th align=right style="width:25%">Number of deaths</th>
    </tr>
    </thead>
    <tbody>
        ${data.join("")}
    </tbody>
    <tfoot>
        <tr style="background-color:#e3d3e4"><td><strong>Total</strong></td>
        <td align=right><strong>${total}</strong></td></tr>
    </tfoot>
    </table>
    <p><strong>Number of deaths with missing (blank) values:</strong> ${totals.get(metadata.blank_field_id)} </p>
    
    `
}