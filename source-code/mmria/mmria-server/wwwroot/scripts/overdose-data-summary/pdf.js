const bc = new BroadcastChannel('overdose_pdf_channel');
bc.onmessage = (message_data) => {


    console.log(`reportType: ${message_data.data.reportType}`);
    console.log(`report_index: ${message_data.data.report_index}`);
    console.log(`view_or_print: ${message_data.data.view_or_print}`);
    
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
    return {
        layout: 'lightLines', // optional
        margin: [ 180, 5, 180, 5],
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          
          widths: [ '*', 'auto'],
  
          body: [
            [ 'Report Page', 'Page Number' ],
            [ 'Pregnancy-Relatedness', { text:'2', alignment: 'right' } ],
            [ 'Timing of Death', { text:'3', alignment: 'right' } ],
            [ 'Race / Ethnicity', { text:'4', alignment: 'right' } ],
            [ 'Age', { text:'5', alignment: 'right' } ],
            [ 'Education', { text:'6', alignment: 'right' } ],
            [ 'Substance Use', { text:'7', alignment: 'right' } ],
            [ 'Toxicology', { text:'9', alignment: 'right' } ],
            [ 'Committee Determinations', { text:'10', alignment: 'right' } ],
            [ 'Treatment History', { text:'11', alignment: 'right' } ],
            [ 'Emotional Stress', { text:'12', alignment: 'right' } ],
            [ 'Living Arrangements', { text:'13', alignment: 'right' } ],
            [ 'Incarceration History', { text:'15', alignment: 'right' } ]
            
          ]
        }
      };
}

function render()
{
    var doc = {
        pageOrientation: 'landscape',
        footer: { 
            text: 'This data has been taken directly from the MMRIA database and is not a final report.',
            style: {italics:true },
            alignment: 'center'
        },
        content: [
            { text: 'Overview'.padEnd(240, ' '), style: header_style },
            '\n\n',
            'The Overdose report in MMRIA grew out of the Rapid Maternal Overdose Review initiative. This initiative ensures the MMRC scope is inclusive of full abstraction and review of all overdose deaths during and within one year of the end of pregnancy; the MMRC is multidisciplinary and representative of maternal mental health, substance use disorder prevention, and addiction medicine; and the team determines contributing factors and recommendations, regardless of whether the death is determined to be pregnancy-related\n\n',
            'This report only includes deaths where the Means of Fatal Injury was “Poisoning/Overdose” in the Manner of Death section of the MMRIA Committee Decisions Form. The committee should be documenting means of fatal injury for all pregnancy-associated deaths, but if the committee is not consistently doing this the number of pregnancy-associated overdose deaths reviewed could be underestimated in the report.\n\n',
            'The Overdose Report can be used to look at broad categories of overdose deaths within MMRIA but should not replace more specific analysis. For example, the Overdose Report is only able to show race/ethnicity as non-Hispanic Black, non-Hispanic White, Hispanic, and Other while an individual jurisdiction can look at other race/ethnicity groupings after downloading the data. The Overdose Report can provide quick analysis for questions asked by committees or team leadership and provide areas to consider more thoroughly during analysis.\n\n',
            { text: 'Report Pages'.padEnd(240, ' '), style: header_style },
            get_report_page_table()
            

        ]
        
    }

    window.setTimeout
		(
			//async function () { await pdfMake.createPdf(doc).open(window); },
			 async function () { await pdfMake.createPdf(doc).open(); },
			3000
		);
}