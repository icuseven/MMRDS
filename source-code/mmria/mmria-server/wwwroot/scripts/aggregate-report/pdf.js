const bc = new BroadcastChannel('aggregate_pdf_channel');
bc.onmessage = (message_data) => {

    console.log(`reportType: ${message_data.data.reportType}`);
    console.log(`report_index: ${message_data.data.report_index}`);
    console.log(`view_or_print: ${message_data.data.view_or_print}`);
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

    function CreateIndicatorTable(p_metadata, p_data)
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
            result.table.body.push([ item.title.trim(), { text: '0', alignment: 'right'}]);
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

        doc.content.push(CreateIndicatorTable(metadata, g_data))
        doc.content.push({ text: '\n\n' });
        doc.content.push({ text: `Number of deaths with missing (blank) values: 0`, alignment: 'center'})


    }

    window.setTimeout
		(
			//async function () { await pdfMake.createPdf(doc).open(window); },
			 async function () { await pdfMake.createPdf(doc).open(); },
			3000
		);
}
