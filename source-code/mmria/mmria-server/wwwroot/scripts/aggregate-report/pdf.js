var g_data =  null;
var g_filter = null;

const bc = new BroadcastChannel('aggregate_pdf_channel');
bc.onmessage = (message_data) => {

    console.log(`reportType: ${message_data.data.reportType}`);
    console.log(`report_index: ${message_data.data.report_index}`);
    console.log(`view_or_print: ${message_data.data.view_or_print}`);


    g_filter = message_data.data.g_filter;
//    console.log(`document: ${message_data.data.document}`);

    //render_pdf(message_data.data.report_index);
    //create_pdf(message_data.data.report_index);
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

async function render(msg)
{
    var doc = {
        pageOrientation: 'landscape',
        footer: { 
            text: 'This data has been taken directly from the MMRIA database and is not a final report.',
            style: {italics:true },
            alignment: 'center'
        },
        content: [
            { text: 'Overview'.padEnd(240 -'Overview'.length, ' '), style: header_style },
            '\n\n',
            'The Aggregate Report can provide quick analysis for questions asked by committees or team leadership and provide areas to consider more thoroughly during analysis. This report can be used to look at broad categories of pregnancy-associated deaths within MMRIA but should not replace more specific analysis. For example, this report is only able to show race/ethnicity as non-Hispanic Black, non-Hispanic White, Hispanic, and Other while an individual jurisdiction can look at other race/ethnicity groupings after downloading the data.\n\n',
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
                [ `${p_metadata.table_title}`, 'Number of deaths' ],                
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
        for(var i = 0; i < metadata.field_id_list.length; i++)
        {
            const item = metadata.field_id_list[i];
            if(item.name != metadata.blank_field_id)
            {
                categories.push(`"${item.title}"`);
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
            data.push(value);
        });
     

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
