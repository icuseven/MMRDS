const bc = new BroadcastChannel('aggregate_pdf_channel');
bc.onmessage = (message_data) => {

    console.log(`reportType: ${message_data.data.reportType}`);
    console.log(`report_index: ${message_data.data.report_index}`);
    console.log(`view_or_print: ${message_data.data.view_or_print}`);
//    console.log(`document: ${message_data.data.document}`);

    render(message_data.data.report_index, message_data.data.document);
    
  /*
  message_data = {
        reportType: g_reportType,
        report_index: g_report_index,
        view_or_print: g_view_or_print
    }
*/
}

function render(report_index)
{
    //const metadata = indicator_map.get(report_index);
    // // await delay(2000); // KCLTODO
    // const data_list = await get_indicator_values(metadata.indicator_id);

    var doc = {
        content: [
            'First paragraph of Report ' + report_index,
            'Another paragraph, this <h3>time a little bit longer</h3> to make sure, this line will be divided into at least two lines'
        ]    
    }

    window.setTimeout
		(
			//async function () { await pdfMake.createPdf(doc).open(window); },
			 async function () { await pdfMake.createPdf(doc).open(); },
			3000
		);
}

// async function create_pdf( headers )
// {
// 	let today = new Date();
// 	let curYear = today.getFullYear();
// 	let curQuarter = Math.floor((today.getMonth() + 3) / 3);

//     let quarter = `Q${ curQuarter }-${ curYear }`;

//     let headers = {
//         title: `Data Quality Report for: Unknown`,
//         subtitle: `Reporting Period: ${ quarter }`,
//     };

//     await create_data_quality_report_pdf( 'Detail', null, quarter, headers );
// }

// async function create_data_quality_report_pdf(p_report_type, p_data, p_quarter, p_headers) {
// 	let p_ctx = {
// 		report_type: p_report_type,
// 		data: p_data,
// 		quarter: p_quarter,
// 		headers: p_headers
// 	};
// 	// console.log('in create_data_quality_report_pdf: ', p_ctx);

// 	try {
// 		// initialize_print_pdf(ctx);
// 		document.title = p_headers.title;
// 		await print_pdf(p_ctx);
// 	}
// 	catch (ex) {
// 		// console.log('ERR: ', ex);
// 		let profile_content_id = document.getElementById("profile_content_id");
// 		{
// 			profile_content_id.innerText = `
// An error has occurred generating PDF for ${p_headers.title}.
 
// Please email mmriasupport@cdc.gov the ERROR DETAILS regarding this Print-PDF issue.

// Error Details (Print PDF):

// Summary: ${ex}

// Stack: ${ex.stack}

//             `;
// 		}

// 	}
// }

// async function print_pdf(ctx) {
// 	g_writeText = '';

// 	// Get unique PDF name
// 	let pdfName = createNamePDF();

// 	// Get the PDF Header Title & Subtitle
// 	let pdfTitle = ctx.headers.title;
// 	let pdfSubtitle = ctx.headers.subtitle;

// 	// Get the logoUrl for Header
// 	let logoUrl = await getBase64ImageFromURL("/images/mmria-secondary.png");

// 	// Format the content
// 	let retContent = formatContent(ctx);

// 	// console.log('retContent: ', retContent);
// 	let doc = {
// 		pageOrientation: 'portrait',
// 		pageMargins: [10, 50, 10, 50],
// 		info: {
// 			title: pdfTitle,
// 			author: 'MMRIA',
// 			subject: 'Data Quality Report',
// 		},
// 		header: (currentPage, pageCount) => {
// 			// console.log( 'currentPage: ', currentPage );
// 			// console.log('pageCount: ', pageCount);
// 			// console.log( 'doc: ', doc );
// 			// console.log('header ctx: ', ctx);
// 			let recLenArr = [];
// 			let startPage = 0;
// 			let endPage = 0;
// 			let header = '***';
// 			// console.log('doc.content.length: ', doc.content.length);
// 			// console.log('*** content: ', doc.content);
// 			for (let i = 0; i < doc.content.length; i++) 
//             {
// 				// console.log('*** pageNumber: ', i, ' - ', doc.content[i].positions[0].pageNumber);
// 				startPage = doc.content[i].positions[0].pageNumber;
// 				endPage = doc.content[i].positions[doc.content[i].positions.length - 1].pageNumber;
// 				header = (doc.content[i].stack[0].table.body[0][0].pageHeaderText != undefined) ? doc.content[i].stack[0].table.body[0][0].pageHeaderText : header;
// 				recLenArr.push({ s: startPage, e: endPage, p: header });
// 			}

// 			// Set the header title
// 			let index = recLenArr.findIndex(item => ((currentPage >= item.s) && (currentPage <= item.e)));
// 			g_writeText = recLenArr[index].p;
// 			let headerObj = [
// 				{
// 					margin: 10,
// 					columns: [
// 						{
// 							image: `${logoUrl}`,
// 							width: 30,
// 							margin: [0, 0, 0, 10]
// 						},
// 						{
// 							width: '*',
// 							layout: {
// 								defaultBorder: false,
// 							},
// 							table: {
// 								widths: '*',
// 								body: [
// 									[
// 										{ text: pdfTitle, alignment: 'center', style: 'pageHeader', },
// 									],
// 									[
// 										{ text: pdfSubtitle, alignment: 'center', style: 'pageSubHeader' },
// 									],
// 								],									
// 							},
// 						},
// 						{
// 							width: 110,
// 							layout: {
// 								defaultBorder: false,
// 							},
// 							table: {
// 								widths: [40, 60],
// 								body: [
// 									[
// 										{ text: 'Page:', style: ['headerPageDate', 'isBold'], alignment: 'right' },
// 										{ text: currentPage + ' of ' + pageCount, style: 'headerPageDate' },
// 									],
// 									[
// 										{ text: 'On:', style: ['headerPageDate', 'isBold'], alignment: 'right' },
// 										{ text: getTodayFormatted(), style: 'headerPageDate' },
// 									],
// 								],
// 							},
// 						},
// 					],
// 				},
// 			];
// 			return headerObj;
// 		},
// 		footer: (currentPage, pageCount) => {
// 			var tbl_footer = '';
// 			if ( ctx.report_type == 'Summary' )
// 			{
// 				tbl_footer = '*The denominator for this indicator is limited to pregnancy-related deaths with a completed ';
// 				tbl_footer += 'Birth/Fetal Death Certificate - Parent Section according to the Form Status on the Home Record [hrcpr_bcp_secti = 2].';
// 			}
// 			else
// 			{
// 				tbl_footer = '';
// 			}
// 			if (currentPage < 3) {
// 				return {
// 					margin: [20, 0, 20, 0],
// 					height: 20,
// 					columns: [
// 						{ text: tbl_footer, },
// 					]
// 				};
// 			}
// 		},
// 		styles: {
// 			pageHeader: {
// 				fontSize: 12,
// 				color: '#000080',
// 			},
// 			pageSubHeader: {
// 				fontSize: 10,
// 				color: '#000080',
// 			},
// 			headerPageDate: {
// 				fontSize: 9,
// 			},
// 			formHeader: {
// 				fontSize: 12,
// 				color: '#000080',
// 				margin: [2, 2, 2, 2],
// 			},
// 			coreHeader: {
// 				fontSize: 12,
// 				color: '#0000ff',
// 				margin: [0, 10, 0, 5]
// 			},
// 			isBold: {
// 				bold: true,
// 			},
// 			isItalics: {
// 				italics: true,
// 			},
// 			fgBlue: {
// 				color: '#000080',
// 			},
// 			fgRed: {
// 				color: '#990000',
// 			},
// 			isUnderlined: {
// 				decoration: 'underline',
// 			},
// 			lightFill: {
// 				fillColor: '#eeeeee',
// 			},
// 			blueFill: {
// 				fillColor: '#cce6ff',
// 			},
// 			lightBlueFill: {
// 				fillColor: '#f0f8ff',
// 			},
// 			tableLabel: {
// 				color: '#000080',
// 				fontSize: 9,
// 				bold: true,
// 			},
// 			tableLabelSmall: {
// 				color: '#000080',
// 				fontSize: 6,
// 				bold: true,
// 			},
// 			tableDetail: {
// 				color: '#000000',
// 				fontSize: 9,
// 			},
// 			noteLabel: {
// 				color: '#000080',
// 				fontSize: 10,
// 				bold: true,
// 			},
// 			noteDetail: {
// 				color: '#000000',
// 				fontSize: 10,
// 			},
// 		},
// 		defaultStyle: {
// 			fontSize: 8,
// 		},
// 		content: retContent,
// 	};
// 	// Create the pdf file
// 	// pdfMake.createPdf(doc).download(pdfName);
// 	pdfMake.createPdf(doc).open();

// }