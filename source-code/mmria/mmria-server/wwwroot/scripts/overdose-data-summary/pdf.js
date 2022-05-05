var g_data =  null;
var g_filter = null;

const bc = new BroadcastChannel('overdose_pdf_channel');
bc.onmessage = (message_data) => {


    console.log(`reportType: ${message_data.data.reportType}`);
    console.log(`report_index: ${message_data.data.report_index}`);
    console.log(`view_or_print: ${message_data.data.view_or_print}`);
    

    g_filter = message_data.data.g_filter;

    render(message_data.data);
    
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
        margin: [ 180, 5, 180, 5],
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

async function render()
{
    var doc = {
        pageOrientation: 'landscape',
        footer: { 
            text: 'This data has been taken directly from the MMRIA database and is not a final report.',
            style: {italics:true },
            alignment: 'center'
        },
        content: [
            { text: 'Overview'.padEnd(240 - 'Overview'.length, ' '), style: header_style },
            '\n\n',
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
            margin: [ 180, 5, 180, 5],
            table: {
              headerRows: 1,
              widths: [ 'auto', 'auto'],
              body: [
                [ `${p_metadata.table_title.trim()}`, 'Number of deaths' ],                
              ]
            }
          };

          for(const item of p_metadata.field_id_list)
          {
            if(item.name != p_metadata.blank_field_id)
            {
                result.table.body.push([ item.title.trim(), { text: p_totals.get(item.name), alignment: 'right'}]);
            }
          }

          return result;
    }

    for(const [key, metadata] of indicator_map)
    {
        doc.content.push({ text: '', pageBreak: 'after'});
        doc.content.push({ text: metadata.title.padEnd(240 - metadata.title.length, ' '), style: header_style });
        doc.content.push({ text: '\n\n' });
        doc.content.push({ text: metadata.description });
        doc.content.push({ text: '\n\n' });
        const result = await get_indicator_values(metadata.indicator_id);

        const totals = new Map();

        const categories = [];
        const category_data = [];
        for(var i = 0; i < metadata.field_id_list.length; i++)
        {
            const item = metadata.field_id_list[i];
            if(item.name != metadata.blank_field_id)
            {
                categories.push(`"${item.title}"`);
            }
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
            if(key != metadata.blank_field_id)
            {
                category_data.push(value);
            }
            data.push(value);
        });

        const colorOne = '#FFFFFF';
        const colorTwo = '#FFFF00';
       const optData = {
            labels: categories,
            datasets: [
                {
                    label: metadata.x_axis_title,
                    fill: false,
                    backgroundColor: colorOne,
                    borderColor: colorOne,
                    data: category_data,
                },
                {
                    label: metadata.y_axis_title,
                    fill: false,
                    backgroundColor: colorTwo,
                    borderColor: colorTwo,
                    data: categories,
                },
            ]
        };


       const retImg = doChart2(metadata.indicator_id, optData, metadata.chart_title);

        doc.content.push
        ([
            { image: retImg, width: 550, alignment: 'center', }
        ]);
        doc.content.push({ text: '\n\n' });
        doc.content.push(CreateIndicatorTable(metadata, totals))
        doc.content.push({ text: '\n\n' });
        doc.content.push({ text: `Number of deaths with missing (blank) values: ${totals.get(metadata.blank_field_id)}`, alignment: 'center'})


    }


    window.setTimeout
		(
			//async function () { await pdfMake.createPdf(doc).open(window); },
			 async function () { await pdfMake.createPdf(doc).open(); },
			3000
		);
}

function doChart2(p_id_prefix, chartData, chartTitle) 
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
			plugins: {
				title: {
					display: true,
					text: chartTitle,
					color: '#1010dd',
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

	return myImgChart.toBase64Image();

}