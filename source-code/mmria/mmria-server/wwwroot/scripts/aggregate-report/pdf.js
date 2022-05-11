var g_data =  null;
var g_filter = null;
var g_host_site = sanitize_encodeHTML(window.location.host.split("-")[0]);
var g_logoUrl = null;
var g_view_or_print = 'view';
var g_report_type = null;
var g_report_index = null;


const bc = new BroadcastChannel('aggregate_pdf_channel');
bc.onmessage = (message_data) => {

    g_filter = message_data.data.g_filter;

    g_view_or_print = message_data.data.view_or_print;

    g_report_type = message_data.data.reportType;
    g_report_index = message_data.data.report_index;

    pre_render(message_data.data);
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
            [ { text:'Report Page', bold:true }, { text:'Page Number', bold:true} ],
          ]
        }
      };

      for(const [key, metadata] of indicator_map)
      {
        result.table.body.push([ { text:metadata.title.replace(/&apos;/g, '\''), alignment: 'left' }, { text: `${indicator_to_page.get(metadata.indicator_id).page_number}`, aligment: 'right'}]);
      }

      return result;
}



const indicator_to_page = new Map();
indicator_to_page.set('mUndCofDeath', { page_number: 2, margin:[ 0,0,0,0]});
indicator_to_page.set('mPregRelated', { page_number: 3, margin:[ 0,0,0,0]});
indicator_to_page.set('mDeathPrevent', { page_number: 4, margin:[ 0,0,0,0]});
indicator_to_page.set('mTimingofDeath', { page_number: 5, margin:[ 0,0,0,0]});
indicator_to_page.set('mOMBRaceRcd', { page_number: 6, margin:[ 0,0,0,0]});
indicator_to_page.set('mDeathbyRace', { page_number: 7, margin:[ 0,0,0,0]});
indicator_to_page.set('mDeathsbyRaceEth', { page_number: 8, margin:[ 0,0,0,0]});
indicator_to_page.set('mAgeatDeath', { page_number: 9, margin:[ 0,0,0,0]});
indicator_to_page.set('mEducation', { page_number: 10, margin:[ 0,0,0,0]});
indicator_to_page.set('mDeathCause', { page_number: 11, margin:[ 0,0,0,0]});
indicator_to_page.set('mHxofEmoStress', { page_number: 12, margin:[ 0,0,0,0]});
indicator_to_page.set('mLivingArrange', { page_number: 13, margin:[ 0,0,0,0]});
indicator_to_page.set('mHomeless', { page_number: 14, margin:[ 0,0,0,0]});



let indicator_id_to_data = new Map();

async function pre_render(msg)
{
    g_logoUrl = await getBase64ImageFromURL("/images/mmria-secondary.png");

    indicator_id_to_data = new Map();

    for(const [key, metadata] of indicator_map)
    {
        if(g_report_type=='Detail' && key != g_report_index)
        {
            continue;
        }
        
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
                    label: metadata.x_axis_title.replace(/&apos;/g, '\''),
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

       const retImg = create_chart(metadata.indicator_id, optData, metadata.chart_title.replace(/&apos;/g, '\''));
    }


    window.setTimeout(render, 1000);
}



async function render(msg)
{

    const report_datetime = `Report Generated ${document.getElementById('report_datetime').innerText} by ${document.getElementById('uid').innerText}`
    const over_view_layout = get_main_page_layout_table();

    over_view_layout.table.body.push(['', get_filter()]);
     over_view_layout.table.body.push([ '', { text: 'Overview', style: header_style, fillColor:'#CCCCCC' } ]);
     over_view_layout.table.body.push([ '', '\n' ]);
     over_view_layout.table.body.push([ '', 'The Aggregate Report can provide quick analysis for questions asked by committees or team leadership and provide areas to consider more thoroughly during analysis. This report can be used to look at broad categories of pregnancy-associated deaths within MMRIA but should not replace more specific analysis. For example, this report is only able to show race/ethnicity as non-Hispanic Black, non-Hispanic White, Hispanic, and Other while an individual jurisdiction can look at other race/ethnicity groupings after downloading the data.\n\n' ]);
     over_view_layout.table.body.push([ '', { text: 'Report Pages', style: header_style, fillColor:'#CCCCCC' } ]);
     over_view_layout.table.body.push([ '', get_report_page_table() ]);

    var doc = {

        info: {
            title: `${g_host_site}-MMRIA Aggregate Report`,
            author: `${document.getElementById('uid').innerText}`,
            //subject: 'subject of document',
           // keywords: 'keywords for document',
          },
          header: (currentPage, pageCount) => {

            const result = { 
                margin: 10,
                columns: [
                    {
                        image: `${g_logoUrl}`,
                        width: 30,
                        margin: [0, 0, 0, 10]
                    },
                    { 
                        width: '*',
                        text: `${g_host_site}-MMRIA Aggregate Report\n${report_datetime}`, 
                        alignment: 'center'
                    },
                    { 
                        
                        width: 110,
                        text:[ 
                            { text: 'Page: ', bold:true },
                            `${currentPage}`,
                            ' of ',
                            `${pageCount}`                 
                        ], 
                        alignment: 'right'
                    }
                ]
            }
			
			return result;
		},
        pageOrientation: 'portrait',
        pageSize: 'A4',
        width: 594.28,
        defaultStyle: {
			fontSize: 10,
		},
        pageMargins: [20, 35, 20, 20],
        footer: { 
            text: 'This data has been taken directly from the MMRIA database and is not a final report.',
            style: {italics:true },
            alignment: 'center'
        },
        content: [
            
        ]
        
    };

    if(g_report_type!='Detail')
    {
        doc.content.push(over_view_layout)
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
                [ { text:`${p_metadata.table_title.replace(/&apos;/g, '\'')}`, bold:true, fillColor:'#CCCCCC'}, { text:'Number of deaths', bold:true, fillColor:'#CCCCCC'} ],                
              ]
            }
          };

          let total = 0;
          for(const item of p_metadata.field_id_list)
          {
              if(item.name != p_metadata.blank_field_id)
              {
                total += p_totals.get(item.name);
                result.table.body.push([  { text:item.title, alignment: 'left' }, { text: p_totals.get(item.name), alignment: 'right'}]);
              }
          }

          result.table.body.push([  { text:'Total', alignment: 'left', bold:true }, { text: total, alignment: 'right', bold:true}]);
          return result;
    }

    for(const [key, metadata] of indicator_map)
    {
        if(g_report_type=='Detail' && key != g_report_index)
        {
            continue;
        }

        const doc_layout = get_main_page_layout_table();

        if(g_report_type!='Detail')
        { 
            doc_layout.table.body.push(['', { text: '', pageBreak: 'after'}]);
        }
        doc_layout.table.body.push(['', get_filter()]);
        doc_layout.table.body.push(['', { text: metadata.title.replace(/&apos;/g, '\''), bold:true, fillColor:'#CCCCCC' }]);
        doc_layout.table.body.push(['', { text: '\n' }]);
        doc_layout.table.body.push(['', { text: metadata.description }]);
        doc_layout.table.body.push(['', { text: '\n' }]);

        const totals = indicator_id_to_data.get(key).totals;


        if(metadata.indicator_id == 'mDeathCause')
        {
            const result_array = render_committee_determination_table(metadata, totals);
            for(const item of result_array)
            {
                doc_layout.table.body.push(['', item]);
            }
        }
        else
        {
            const retImg = get_chart_image(metadata.indicator_id);

            doc_layout.table.body.push
            (
                [
                    '', 
                    [
                        { image: retImg, width: 550, alignment: 'center', margin: [ 5, 5, 5, 5], }
                    ]
                ]
            );
            doc_layout.table.body.push(['', { text: '\n' }]);
            doc_layout.table.body.push(['', CreateIndicatorTable(metadata, totals)]);
            doc_layout.table.body.push(['', { text: '\n' }]);
            doc_layout.table.body.push(['', { text: `Number of deaths with missing (blank) values: ${totals.get(metadata.blank_field_id)}`, alignment: 'center'}]);
            
        }

        doc.content.push(doc_layout);
    }

    window.setTimeout
		(
			//async function () { await pdfMake.createPdf(doc).open(window); },
			 async function () 
             { 
                if(g_view_or_print == 'print')
                {
                 await pdfMake.createPdf( doc ).download( createNamePDF() );
                }
                else
                {
                 await pdfMake.createPdf(doc).open(); 
                }
            },
			3000
		);
}
function createNamePDF() 
{
	let utcDate = new Date().toISOString();
	return `Overdose-Data-Summary_${utcDate}.pdf`;
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
    const result = [
        { text:p_metadata.chart_title, bold:true, background:'#b890bb', alignment:'center', fontSize:14},
        '\n'
    ];
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
      push_table_text('Did obesity contribute to the death?', 16);
/*
        <td>Did obesity contribute to the death?</td>
        <td align=right>${totals.get("MCauseD16")}</td>
        <td align=right>${totals.get("MCauseD17")}</td>
        <td align=right>${totals.get("MCauseD18")}</td>
        <td align=right>${totals.get("MCauseD19")}</td>
*/
push_table_text('Did discrimination contribute to the death?', 21);
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
push_table_text('Was this death a homicide?', 26);
/*
        <td>Was this death a homicide?</td>
        <td align=right>${totals.get("MCauseD26")}</td>
        <td align=right>${totals.get("MCauseD27")}</td>
        <td align=right>${totals.get("MCauseD28")}</td>
        <td align=right>${totals.get("MCauseD29")}</td>
*/

result.push(table);

result.push('\n');


push_total_text('Obesity - Number of deaths with missing (blank) values:', p_totals.get("MCauseD20"));
push_total_text('Discrimination - Number of deaths with missing (blank) values:', p_totals.get("MCauseD25"));
push_total_text('Mental Health Conditions - Number of deaths with missing (blank) values:', p_totals.get("MCauseD5"));
push_total_text('Substance Use Disorder - Number of deaths with missing (blank) values:', p_totals.get("MCauseD10"));
push_total_text('Suicide - Number of deaths with missing (blank) values:', p_totals.get("MCauseD15"));
push_total_text('Homicide - Number of deaths with missing (blank) values:', p_totals.get("MCauseD30"));


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


function get_main_page_layout_table()
{
    const result =  {
        layout: 'noBorders',
        margin: [ 5, 5, 5, 5],
        fontSize: 10,
        width: 'auto',
        table: {
          headerRows: 0,
          widths: [ 5, 'auto'],
          body: [
            
          ]
        }
      };

    return result;
}

const relatedness_map = new Map();
relatedness_map.set(9999, "(blank)");
relatedness_map.set(1, "Pregnancy-Related");
relatedness_map.set(0, "Pregnancy-Associated, but NOT -Related");
relatedness_map.set(2, "Pregnancy-Associated but Unable to Determine Pregnancy-Relatedness");
relatedness_map.set(99, "Not Pregnancy-Related or -Associated (i.e. False Positive)");

function pad_number(n) 
{
    n = n + '';
    return n.length >= 2 ? n : new Array(2 - n.length + 1).join("0") + n;
}

function formatDate(p_value)
{
    const result= pad_number(p_value.getMonth() + 1) + '/' + pad_number(p_value.getDate()) + '/' +  p_value.getFullYear();

    return result;
}

function get_filter()
{
    const filter_detail =  [ ]

    const result =  {
        layout: 'noBorders',
        margin: [ 5, 5, 5, 5],
        fontSize: 10,
        width: 'auto',
        table: {
          headerRows: 0,
          widths: [ 'auto', '*', '*'],
          body: [
            [ { text:'Pregnancy-Relatedness', bold:true}, { text: 'Date of Review', bold:true},{ text: 'Date of Death', bold:true}],
                filter_detail
          ]
        }
      };

    const reporting_state_element = document.getElementById("reporting_state")
    reporting_state_element.innerHTML = `<strong>Reporting State: </strong> ${g_filter.reporting_state}`;

    const current_datetime = new Date();

    const report_datetime_element = document.getElementById("report_datetime")
    report_datetime_element.innerHTML = `${current_datetime.toDateString().replace(/(\d{2})/, "$1,")} ${current_datetime.toLocaleTimeString()}`;


    const html = { ul: [] };
    

    relatedness_map.forEach
    (
        (value, key) =>
        {

            if(g_filter.pregnancy_relatedness.indexOf(key) > -1)
            {

                html.ul.push(value);
            }
        }
    );
    
    filter_detail.push(html);


    filter_detail.push(`${formatDate(g_filter.date_of_review.begin)} - ${formatDate(g_filter.date_of_review.end)}`);
    filter_detail.push(`${formatDate(g_filter.date_of_death.begin)} - ${formatDate(g_filter.date_of_death.end)}`);


    return result;
}