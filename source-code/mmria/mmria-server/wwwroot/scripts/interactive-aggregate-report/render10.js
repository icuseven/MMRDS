async function render10(p_post_html)
{
    const metadata = indicator_map.get(10);
    const data_list = await get_indicator_values(metadata.indicator_id);

    return `
    ${render_header()}

${render_navigation_strip(10)}
<div">
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
        
        if(item.title.indexOf("(blank)") < 0)
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
    const p_chart_name = "chart";
    /*
    p_post_html.push
    (
        `var ${p_chart_name} = c3.generate({
            legend: {
                show: false
            },
            data: {
                columns: [
                    ["${p_metadata.indicator_id}", ${data.join(",")}
                     ],
                ],
                type: 'bar',
                names: {
                    ${p_metadata.indicator_id}: "${p_metadata.x_axis_title}",
                },
                labels: true,
            },
            padding: {
                  //left: 375
            },
            axis: {
                rotated: true, 
                
                x: {
                    label: {
                    text: '${p_metadata.x_axis_title}',
                    position: 'outer-middle'  
                    },
                    tick: {
                        multiline: false,
                        culling: false,
                        outer: false
                    },
                    type: 'category',
                    categories: [${categories}],
                },
                y: {
                    label: {
                        text: '${p_metadata.y_axis_title}',
                        position: 'outer-center' 
                    },
                }
            },
            //size: {
            //    height: 600, 
            //    width: 600
            //  },
              transition: {
                duration: null
              },
              bindto: '#${p_chart_name}',
              
              onrendered: function()
              {
                const title_element = document.createElement("title");
                title_element.innerText = '${p_metadata.chart_title_508}';

                const description_element = document.createElement("desc");
                description_element.innerText = '${render_chart_508_description(p_metadata, data, totals)}';

                const svg_char = document.querySelector('#${p_chart_name} svg');

                if(svg_char != null)
                {
                    const test_title = document.querySelector('#${p_chart_name} svg title');
                    const test_desc = document.querySelector('#${p_chart_name} svg desc');

                    if(test_title == null)
                    {
                        svg_char.appendChild(title_element);
                    }

                    if(test_desc == null)
                    {
                        svg_char.appendChild(description_element);
                    }
                }
                
              }
            }); ` 
    );*/

    return ``;
    /*
    <div class="card">
        <div class="card-header bg-secondary">
        <h4 class="h5">${p_metadata.chart_title}</h4>
        </div>
        <div class="card-body">
            <div id="chart"></div>
        </div>
    </div>
    
    `*/
}

async function render10_table(p_metadata, p_data_list)
{
    const totals = new Map();
    const name_to_title = new Map();

    const categories = [];
    for(var i = 0; i < p_metadata.field_id_list.length; i++)
    {
        const item = p_metadata.field_id_list[i];
        if(item.title.indexOf("(blank)") < 0)
        {
            categories.push(`"${item.title}"`);
        }
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
    


    return `<table class="table rounded-0 mb-0" style="width:50%"
    title="${p_metadata.table_title_508 != null ? p_metadata.table_title_508.replace("'", ""): ""}"
    >
    
    <thead class="thead">
    <tr style="background-color:#e3d3e4;">
        <th>${p_metadata.table_title}</th>
        <th align=right>Yes</th>
        <th align=right>No</th>
        <th align=right>Probably</th>
        <th align=right>Unknown</th>
    </tr>
    </thead>
    <tbody>
        <tr>
            <td>Obesity</td>
            <td align=right>${totals.get("MCauseD16")}</td>
            <td align=right>${totals.get("MCauseD17")}</td>
            <td align=right>${totals.get("MCauseD18")}</td>
            <td align=right>${totals.get("MCauseD19")}</td>
        </tr>
        <tr>
            <td>Discrimination</td>
            <td align=right>${totals.get("MCauseD21")}</td>
            <td align=right>${totals.get("MCauseD22")}</td>
            <td align=right>${totals.get("MCauseD23")}</td>
            <td align=right>${totals.get("MCauseD24")}</td>
        </tr>

        <tr>
            <td>Mental health conditions</td>
            <td align=right>${totals.get("MCauseD1")}</td>
            <td align=right>${totals.get("MCauseD2")}</td>
            <td align=right>${totals.get("MCauseD3")}</td>
            <td align=right>${totals.get("MCauseD4")}</td>
        </tr>


        <tr>
            <td>Substance use disorder</td>
            <td align=right>${totals.get("MCauseD6")}</td>
            <td align=right>${totals.get("MCauseD7")}</td>
            <td align=right>${totals.get("MCauseD8")}</td>
            <td align=right>${totals.get("MCauseD9")}</td>
        </tr>

        <tr>
            <td>Suicide</td>
            <td align=right>${totals.get("MCauseD11")}</td>
            <td align=right>${totals.get("MCauseD12")}</td>
            <td align=right>${totals.get("MCauseD13")}</td>
            <td align=right>${totals.get("MCauseD14")}</td>
        </tr>


        <tr>
            <td>Homicide</td>
            <td align=right>${totals.get("MCauseD26")}</td>
            <td align=right>${totals.get("MCauseD27")}</td>
            <td align=right>${totals.get("MCauseD28")}</td>
            <td align=right>${totals.get("MCauseD29")}</td>
        </tr>
    </tbody>

    </table><br/>
    <p><strong>Obesity - Number of deaths with missing (blank) values:</strong> ${totals.get("MCauseD20")}</p>
    <p><strong>Discrimination - Number of deaths with missing (blank) values:</strong> ${totals.get("MCauseD25")}</p>
    <p><strong>Mental health conditions - Number of deaths with missing (blank) values:</strong> ${totals.get("MCauseD5")}</p>
    <p><strong>Substance use disorder - Number of deaths with missing (blank) values:</strong> ${totals.get("MCauseD10")}</p>
    <p><strong>Suicide - Number of deaths with missing (blank) values:</strong> ${totals.get("MCauseD15")}</p>
    <p><strong>Homicide - Number of deaths with missing (blank) values:</strong> ${totals.get("MCauseD30")}</p>
    <br/>
    <p>This data has been taken directly from the MMRIA database and is not a final report.</p>
    <br/>
    `;
}