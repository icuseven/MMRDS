var g_data =  null;
var g_filter = null;
var g_host_site = sanitize_encodeHTML(window.location.host.split("-")[0]);
var g_logoUrl = null;


const bc = new BroadcastChannel('overdose_pdf_channel');
bc.onmessage = (message_data) => {


    console.log(`reportType: ${message_data.data.reportType}`);
    console.log(`report_index: ${message_data.data.report_index}`);
    console.log(`view_or_print: ${message_data.data.view_or_print}`);
    

    g_filter = message_data.data.g_filter;

    pre_render(message_data.data);
    
  /*
  message_data = {
        reportType: g_reportType,
        report_index: g_report_index,
        view_or_print: g_view_or_print
    }
*/
}

const header_style = { background:'#CCCCCC', bold:true };

function get_report_page_table()
{
    const result =  {
        layout: 'lightLines',
        margin: [ 5, 5, 5, 5],
        fontSize: 10,
        table: {
          headerRows: 1,
          widths: [ '*', 'auto'],
          body: [
            [ 'Report Page', 'Page Number' ],
          ]
        }
      };

    for(const [key, metadata] of indicator_map)
    {
    result.table.body.push([ metadata.title, { text: '0', aligment: 'right'}]);
    }

    return result;
}



let indicator_id_to_data = new Map();

async function pre_render(msg)
{

    g_logoUrl = await getBase64ImageFromURL("/images/mmria-secondary.png");

    indicator_id_to_data = new Map();

    for(const [key, metadata] of indicator_map)
    {
        await get_indicator_values(metadata.indicator_id);
        const totals = new Map();

        const categories = [];
        const category_data = [];
        for(var i = 0; i < metadata.field_id_list.length; i++)
        {
            const item = metadata.field_id_list[i];
            if(item.name != metadata.blank_field_id)
            {
                categories.push(`${item.title}`);
            }
            totals.set(item.name, 0);
        }
    
        for(var i = 0; i < g_data.data.length; i++)
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
            if(key != metadata.blank_field_id)
            {
                category_data.push(value);
            }
            data.push(value);
        });

        const colorOne = '#b890bb';
        const colorTwo = '#FFFF00';
       const optData = {
            labels: categories,
            datasets: [
                {
                    label: metadata.x_axis_title,
                    data: category_data,
                    backgroundColor: colorOne,
                    //borderColor: colorTwo,
                    //borderWidth: 1
                    
                }
            ]
        };


        indicator_id_to_data.set
        (
            key,
            {
                metadata: metadata,
                totals: totals
            }

        );

       const retImg = create_chart(metadata.indicator_id, optData, metadata.chart_title);
    }


    window.setTimeout(render, 1000);
}


async function render()
{
    var doc = {
        pageOrientation: 'landscape',
        pageSize: 'A4',
        width: 841.28,
        defaultStyle: {
			fontSize: 10,
		},
        pageMargins: [20, 35, 20, 20],
        header: { 
            margin: 10,
            columns: [
                {
                    image: `${g_logoUrl}`,
                    width: 30,
                    margin: [0, 0, 0, 10]
                },
                { 
                    width: '*',
                    text: `${g_host_site}-MMRIA Overdose Data Summary`, 
                    alignment: 'center'
                },
                { 
                    width: 110,
                    text:[ 
                        { text: 'Page:', bold:true },
                        '1 ',
                        'of ',
                        '15'                 
                    ], 
                    alignment: 'right'
                }
            ]
        },
        footer: { 
            text: 'This data has been taken directly from the MMRIA database and is not a final report.',
            style: {italics:true },
            alignment: 'center'
        },
        content: [
            { text: 'Overview'.padEnd(240 - 'Overview'.length, ' '), style: header_style },
            '\n',
            'The Overdose report in MMRIA grew out of the Rapid Maternal Overdose Review initiative. This initiative ensures the MMRC scope is inclusive of full abstraction and review of all overdose deaths during and within one year of the end of pregnancy; the MMRC is multidisciplinary and representative of maternal mental health, substance use disorder prevention, and addiction medicine; and the team determines contributing factors and recommendations, regardless of whether the death is determined to be pregnancy-related\n\n',
            'This report only includes deaths where the Means of Fatal Injury was “Poisoning/Overdose” in the Manner of Death section of the MMRIA Committee Decisions Form. The committee should be documenting means of fatal injury for all pregnancy-associated deaths, but if the committee is not consistently doing this the number of pregnancy-associated overdose deaths reviewed could be underestimated in the report.\n\n',
            'The Overdose Report can be used to look at broad categories of overdose deaths within MMRIA but should not replace more specific analysis. For example, the Overdose Report is only able to show race/ethnicity as non-Hispanic Black, non-Hispanic White, Hispanic, and Other while an individual jurisdiction can look at other race/ethnicity groupings after downloading the data. The Overdose Report can provide quick analysis for questions asked by committees or team leadership and provide areas to consider more thoroughly during analysis.\n\n',
            { text: 'Report Pages'.padEnd(240 - 'Report Pages'.length, ' '), style: header_style },
            get_report_page_table(),
            
            

        ]
        
    }


    function CreateIndicatorTable(p_metadata, p_totals)
    {
        const result =  {
            layout: 'lightLines',
            margin: [ 5, 5, 5, 5],
            fontSize: 10,
            table: {
              headerRows: 1,
              widths: [ 'auto', 'auto'],
              body: [
                [ { text:`${p_metadata.table_title.trim()}`, bold:true, fillColor:'#CCCCCC'}, { text:'Number of deaths', bold:true, fillColor:'#CCCCCC'} ],                
              ]
            }
          };

          for(const item of p_metadata.field_id_list)
          {
            if(item.name != p_metadata.blank_field_id)
            {
                result.table.body.push([ { text:item.title, alignment: 'left' }, { text: p_totals.get(item.name), alignment: 'right'}]);
            }
          }

          return result;
    }

    for(const [key, metadata] of indicator_map)
    {
        doc.content.push({ text: '', pageBreak: 'after'});
        doc.content.push({ text: metadata.title.padEnd(240 - metadata.title.length, ' '), style: header_style });
        doc.content.push({ text: '\n' });
        doc.content.push({ text: metadata.description });
        doc.content.push({ text: '\n' });

        const totals = indicator_id_to_data.get(key).totals;


        if(metadata.indicator_id == 'mDeathCause')
        {
            const result_array = render_committee_determination_table(metadata, totals);
            for(const item of result_array)
            {
                doc.content.push(item);
            }
        }
        else
        {
            const retImg = get_chart_image(metadata.indicator_id);

            doc.content.push
            ([
                { image: retImg, width: 550, alignment: 'center', margin: [ 5, 5, 5, 5]}
            ]);
            doc.content.push({ text: '\n' });
            doc.content.push(CreateIndicatorTable(metadata, totals))
            doc.content.push({ text: '\n' });
            doc.content.push({ text: `Number of deaths with missing (blank) values: ${totals.get(metadata.blank_field_id)}`, alignment: 'center'})
        }

    }


    window.setTimeout
		(
			//async function () { await pdfMake.createPdf(doc).open(window); },
			 async function () { await pdfMake.createPdf(doc).open(); },
			3000
		);
}

function create_chart(p_id_prefix, chartData, chartTitle) 
{
	let wrapper_id = `${p_id_prefix}chartWrapper`;
	let container = document.getElementById(wrapper_id);

	if (container != null) 
    {
		container.remove();
	}

	container = document.createElement('div')
	container.id = wrapper_id;
	document.body.appendChild(container);

	let canvas_id = `myChart${p_id_prefix}`;
	let canvas = document.createElement('canvas');
	canvas.id = canvas_id;

	canvas.setAttribute('width', '800');
	container.appendChild(canvas);

	const config = {
        
		type: 'bar',
		data: chartData,
		options: {
            indexAxis: 'y',
			plugins: {
				title: {
					display: true,
					text: chartTitle,
					color:
                     '#1010dd',
					font: {
						weight: 'bold',
						size: 36
					}
				}
			},
			maintainAspectRatio: false,
			responsive: true,
			animation: null,
			animate: false,
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						font: {
							size: 20,
						}
					}
				},
				x: {
					ticks: {
						font: {
							size: 26,
						}
					}
				}
			},
		},
	};


	let myImgChart = new Chart(canvas.getContext('2d'), config);

	myImgChart.draw();
	myImgChart.render();

}

function get_chart_image(p_indicator_id) 
{
    let canvas_id = `myChart${p_indicator_id}`;
	const result = document.getElementById(canvas_id);

	return result.toDataURL();
}

function sanitize_encodeHTML(s) 
{
	let result = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    return result;
}


function getBase64ImageFromURL(url) {
	return new Promise((resolve, reject) => {
		let img = new Image();
		img.setAttribute("crossOrigin", "anonymous");
		img.onload = () => {
			let canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			let ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			let dataURL = canvas.toDataURL("image/png");
			resolve(dataURL);
		};
		img.onerror = error => {
			reject(error);
		};
		img.src = url;
	});
}

function render_committee_determination_table(p_metadata, p_totals)
{
    const result = []
    const table =  {
        layout: 'lightLines',
        margin: [ 5, 5, 5, 5],
        fontSize: 10,
        table: {
          headerRows: 1,
          widths: [ '*', 'auto', 'auto', 'auto', 'auto'],
          body: [
            [ 
                { text:`${p_metadata.table_title}`, bold:true, fillColor:'#CCCCCC'}, 
                { text:'Yes', bold:true, fillColor:'#CCCCCC'}, 
                { text:'No', bold:true, fillColor:'#CCCCCC'},
                { text:'Probably', bold:true, fillColor:'#CCCCCC'},
                { text:'Unknown', bold:true, fillColor:'#CCCCCC'},
            ],                
          ]
        }
      };

      /*
      for(const item of p_metadata.field_id_list)
      {
          if(item.name != p_metadata.blank_field_id)
          {
            result.table.body.push([ item.title.trim(), { text: p_totals.get(item.name), alignment: 'right'}]);
          }
      }*/


      function push_total_text(p_text, p_total_value)
      {
        result.push({ text: [{ text: p_text, bold: true}, ` ${p_total_value}`] });
      }

      function push_table_text(p_text, p_start)
      {
        table.table.body.push
        (

            [
            p_text,
            { text:p_totals.get(`MCauseD` + p_start), alignment: 'right' }, 
            { text:p_totals.get(`MCauseD` + (p_start + 1)), alignment: 'right' }, 
            { text:p_totals.get(`MCauseD` + (p_start + 2)), alignment: 'right' }, 
            { text:p_totals.get(`MCauseD` + (p_start + 3)), alignment: 'right' }
            ]
  
        );
      }
      //push_table_text('Did obesity contribute to the death?', 16);
/*
        <td>Did obesity contribute to the death?</td>
        <td align=right>${totals.get("MCauseD16")}</td>
        <td align=right>${totals.get("MCauseD17")}</td>
        <td align=right>${totals.get("MCauseD18")}</td>
        <td align=right>${totals.get("MCauseD19")}</td>
*/
//push_table_text('Did discrimination contribute to the death?', 21);
/*
        <td>Did discrimination contribute to the death?</td>
        <td align=right>${totals.get("MCauseD21")}</td>
        <td align=right>${totals.get("MCauseD22")}</td>
        <td align=right>${totals.get("MCauseD23")}</td>
        <td align=right>${totals.get("MCauseD24")}</td>
*/
push_table_text('Did mental health conditions contribute to the death?', 1);
/*
        <td>Did mental health conditions contribute to the death?</td>
        <td align=right>${totals.get("MCauseD1")}</td>
        <td align=right>${totals.get("MCauseD2")}</td>
        <td align=right>${totals.get("MCauseD3")}</td>
        <td align=right>${totals.get("MCauseD4")}</td>
*/
push_table_text('Did substance use disorder contribute to the death?', 6);
/*
        <td>Did substance use disorder contribute to the death?</td>
        <td align=right>${totals.get("MCauseD6")}</td>
        <td align=right>${totals.get("MCauseD7")}</td>
        <td align=right>${totals.get("MCauseD8")}</td>
        <td align=right>${totals.get("MCauseD9")}</td>
*/
push_table_text('Was this death a suicide?', 11);
/*
        <td>Was this death a suicide?</td>
        <td align=right>${totals.get("MCauseD11")}</td>
        <td align=right>${totals.get("MCauseD12")}</td>
        <td align=right>${totals.get("MCauseD13")}</td>
        <td align=right>${totals.get("MCauseD14")}</td>
*/
//push_table_text('Was this death a homicide?', 26);
/*
        <td>Was this death a homicide?</td>
        <td align=right>${totals.get("MCauseD26")}</td>
        <td align=right>${totals.get("MCauseD27")}</td>
        <td align=right>${totals.get("MCauseD28")}</td>
        <td align=right>${totals.get("MCauseD29")}</td>
*/

result.push(table);
result.push('\n');


//push_total_text('Obesity - Number of deaths with missing (blank) values:', p_totals.get("MCauseD20"));
//push_total_text('Discrimination - Number of deaths with missing (blank) values:', p_totals.get("MCauseD25"));
push_total_text('Mental Health Conditions - Number of deaths with missing (blank) values:', p_totals.get("MCauseD5"));
push_total_text('Substance Use Disorder - Number of deaths with missing (blank) values:', p_totals.get("MCauseD10"));
push_total_text('Suicide - Number of deaths with missing (blank) values:', p_totals.get("MCauseD15"));
//push_total_text('Homicide - Number of deaths with missing (blank) values:', p_totals.get("MCauseD30"));


/*
</table><br/>
<p><strong>Obesity - Number of deaths with missing (blank) values:</strong> ${totals.get("MCauseD20")}</p>
<p><strong>Discrimination - Number of deaths with missing (blank) values:</strong> ${totals.get("MCauseD25")}</p>
<p><strong>Mental Health Conditions - Number of deaths with missing (blank) values:</strong> ${totals.get("MCauseD5")}</p>
<p><strong>Substance Use Disorder - Number of deaths with missing (blank) values:</strong> ${totals.get("MCauseD10")}</p>
<p><strong>Suicide - Number of deaths with missing (blank) values:</strong> ${totals.get("MCauseD15")}</p>
<p><strong>Homicide - Number of deaths with missing (blank) values:</strong> ${totals.get("MCauseD30")}</p>
<br/>
<p>This data has been taken directly from the MMRIA database and is not a final report.</p>
<br/>
*/
    return result;
}