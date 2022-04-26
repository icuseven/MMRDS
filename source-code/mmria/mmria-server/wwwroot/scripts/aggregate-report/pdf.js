const bc = new BroadcastChannel('aggregate_pdf_channel');
bc.onmessage = (message_data) => {

    console.log(`reportType: ${message_data.data.reportType}`);
    console.log(`report_index: ${message_data.data.report_index}`);
    console.log(`view_or_print: ${message_data.data.view_or_print}`);
//    console.log(`document: ${message_data.data.document}`);

    //render_pdf(message_data.data.report_index);
    //create_pdf(message_data.data.report_index);
    aggregate_pdf(message_data.data.report_index);
  /*
  message_data = {
        reportType: g_reportType,
        report_index: g_report_index,
        view_or_print: g_view_or_print
    }
*/
}

function render_pdf(report_index)
{
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
        1000
    );
    
    //pdfMake.createPdf(doc).open();
}

// async function create_pdf(report_index)
// {
// 	// let today = new Date();
// 	// let curYear = today.getFullYear();
// 	// let curQuarter = Math.floor((today.getMonth() + 3) / 3);
//     let curQuarter = 1;
//     let curYear = today.getFullYear();


//     let quarter = `Q${ curQuarter }-${ curYear }`;

//     let headers = {
//         title: `Data Quality Report for: Unknown`,
//         subtitle: `Reporting Period: ${ quarter }`,
//     };

//     let detail_data = {
//         questions: [
//             /*{
//                 qid: 39,
//                 typ: 'Current Quarter, Missing',
//                 detail: [
//                     {
//                         num: 114,
//                         rec_id: 'WI-2016-8592',
//                         dt_death: '10/11/2016',
//                         dt_com_rev: '05/14/2021',
//                         ia_id: '6d632b47-4950-a4d1-fa17-e7368eaeefe',
//                     },
//                     {
//                         num: 115,
//                         rec_id: 'WI-2017-0052',
//                         dt_death: '10/02/2017',
//                         dt_com_rev: '11/20/2020',
//                         ia_id: '7e632b47-4950-a4d1-fa17-e7368eaeefe',
//                     },
//                     {
//                         num: 116,
//                         rec_id: 'WI-2017-4726',
//                         dt_death: '10/17/2017',
//                         dt_com_rev: '05/14/2021',
//                         ia_id: '6d632b47-4950-a4d1-fa17-e7368eaeefe',
//                     },
//                 ],
//             },
//             {
//                 qid: 39,
//                 typ: 'Current Quarter, Unknown',
//                 detail: [],
//             },
//             {
//                 qid: 39,
//                 typ: 'Previous 4 Quarters, Missing',
//                 detail: [
//                     {
//                         num: 314,
//                         rec_id: 'WI-2016-8592',
//                         dt_death: '10/11/2016',
//                         dt_com_rev: '05/14/2021',
//                         ia_id: '6d632b47-4950-a4d1-fa17-e7368eaeefe',
//                     },
//                     {
//                         num: 315,
//                         rec_id: 'WI-2017-0052',
//                         dt_death: '10/02/2017',
//                         dt_com_rev: '11/20/2020',
//                         ia_id: '7e632b47-4950-a4d1-fa17-e7368eaeefe',
//                     },
//                     {
//                         num: 316,
//                         rec_id: 'WI-2017-4726',
//                         dt_death: '10/17/2017',
//                         dt_com_rev: '05/14/2021',
//                         ia_id: '6d632b47-4950-a4d1-fa17-e7368eaeefe',
//                     },
//                 ],
//             },
//             {
//                 qid: 39,
//                 typ: 'Previous 4 Quarters, Unknown',
//                 detail: [],
//             },
//             {
//                 qid: 40,
//                 typ: 'Current Quarter, Missing',
//                 detail: [
//                     {
//                         num: 1,
//                         rec_id: 'OR-2019-4806',
//                         dt_death: '05/27/2009',
//                         dt_com_rev: '07/19/2021',
//                         ia_id: 'd1632b47-4950-a4d1-fa17-e7368eaeefe',
//                     },
//                     {
//                         num: 2,
//                         rec_id: 'TN-2020-4226',
//                         dt_death: '01/10/2019',
//                         dt_com_rev: '08/31/2021',
//                         ia_id: '2c632b47-4950-a4d1-fa17-e7368eaeefe',
//                     },
//                 ],
//             },
//         */],
//         cases: [/*
//             {
//                 rec_id: 'WI-2017-7951',
//                 ab_case_id: '',
//                 dt_death: '06/10/2017',
//                 dt_com_rev: '09/11/2020',
//                 ia_id: '2c632b47-4950-a4d1-fa17-e7368eaeefe',
//                 detail: [
//                     {
//                         qid: 19,
//                         typ: 'Previous 4 Quarters, Missing',
//                     },
//                     {
//                         qid: 29,
//                         typ: 'Previous 4 Quarters, Missing',
//                     },
//                     {
//                         qid: 32,
//                         typ: 'Previous 4 Quarters, Missing',
//                     },
//                     {
//                         qid: 39,
//                         typ: 'Previous 4 Quarters, Unknown',
//                     },
//                 ]
//             },
//             {
//                 rec_id: 'WV-2019-1760',
//                 ab_case_id: '2019EleH',
//                 dt_death: '01/15/2019',
//                 dt_com_rev: '09/09/2021',
//                 ia_id: '8f032b47-4950-a4d1-fa17-e7368eaeefe',
//                 detail: [
//                     {
//                         qid: 19,
//                         typ: 'Current Quarter, Unknown',
//                     },
//                     {
//                         qid: 38,
//                         typ: 'Current Quarter, Missing',
//                     },
//                     {
//                         qid: 39,
//                         typ: 'Current Quarter, Unknown',
//                     },
//                 ]
//             },
//         */],
//         total: 667,
//     };

//     await create_data_quality_report_pdf( 'Detail', detail_data, quarter, headers );
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
// 		//await print_pdf(p_ctx);
//         aggregate_pdf(1);
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

async function aggregate_pdf(report_index)
{
    let today = new Date();
    let curQuarter = 1;
    let curYear = today.getFullYear();

    let quarter = `Q${ curQuarter }-${ curYear }`;

    let headers = {
        title: `Data Quality Report for: Unknown`,
        subtitle: `Reporting Period: ${ quarter }`,
    };

        let detail_data = {
        questions: [
            /*{
                qid: 39,
                typ: 'Current Quarter, Missing',
                detail: [
                    {
                        num: 114,
                        rec_id: 'WI-2016-8592',
                        dt_death: '10/11/2016',
                        dt_com_rev: '05/14/2021',
                        ia_id: '6d632b47-4950-a4d1-fa17-e7368eaeefe',
                    },
                    {
                        num: 115,
                        rec_id: 'WI-2017-0052',
                        dt_death: '10/02/2017',
                        dt_com_rev: '11/20/2020',
                        ia_id: '7e632b47-4950-a4d1-fa17-e7368eaeefe',
                    },
                    {
                        num: 116,
                        rec_id: 'WI-2017-4726',
                        dt_death: '10/17/2017',
                        dt_com_rev: '05/14/2021',
                        ia_id: '6d632b47-4950-a4d1-fa17-e7368eaeefe',
                    },
                ],
            },
            {
                qid: 39,
                typ: 'Current Quarter, Unknown',
                detail: [],
            },
            {
                qid: 39,
                typ: 'Previous 4 Quarters, Missing',
                detail: [
                    {
                        num: 314,
                        rec_id: 'WI-2016-8592',
                        dt_death: '10/11/2016',
                        dt_com_rev: '05/14/2021',
                        ia_id: '6d632b47-4950-a4d1-fa17-e7368eaeefe',
                    },
                    {
                        num: 315,
                        rec_id: 'WI-2017-0052',
                        dt_death: '10/02/2017',
                        dt_com_rev: '11/20/2020',
                        ia_id: '7e632b47-4950-a4d1-fa17-e7368eaeefe',
                    },
                    {
                        num: 316,
                        rec_id: 'WI-2017-4726',
                        dt_death: '10/17/2017',
                        dt_com_rev: '05/14/2021',
                        ia_id: '6d632b47-4950-a4d1-fa17-e7368eaeefe',
                    },
                ],
            },
            {
                qid: 39,
                typ: 'Previous 4 Quarters, Unknown',
                detail: [],
            },
            {
                qid: 40,
                typ: 'Current Quarter, Missing',
                detail: [
                    {
                        num: 1,
                        rec_id: 'OR-2019-4806',
                        dt_death: '05/27/2009',
                        dt_com_rev: '07/19/2021',
                        ia_id: 'd1632b47-4950-a4d1-fa17-e7368eaeefe',
                    },
                    {
                        num: 2,
                        rec_id: 'TN-2020-4226',
                        dt_death: '01/10/2019',
                        dt_com_rev: '08/31/2021',
                        ia_id: '2c632b47-4950-a4d1-fa17-e7368eaeefe',
                    },
                ],
            },
        */],
        cases: [/*
            {
                rec_id: 'WI-2017-7951',
                ab_case_id: '',
                dt_death: '06/10/2017',
                dt_com_rev: '09/11/2020',
                ia_id: '2c632b47-4950-a4d1-fa17-e7368eaeefe',
                detail: [
                    {
                        qid: 19,
                        typ: 'Previous 4 Quarters, Missing',
                    },
                    {
                        qid: 29,
                        typ: 'Previous 4 Quarters, Missing',
                    },
                    {
                        qid: 32,
                        typ: 'Previous 4 Quarters, Missing',
                    },
                    {
                        qid: 39,
                        typ: 'Previous 4 Quarters, Unknown',
                    },
                ]
            },
            {
                rec_id: 'WV-2019-1760',
                ab_case_id: '2019EleH',
                dt_death: '01/15/2019',
                dt_com_rev: '09/09/2021',
                ia_id: '8f032b47-4950-a4d1-fa17-e7368eaeefe',
                detail: [
                    {
                        qid: 19,
                        typ: 'Current Quarter, Unknown',
                    },
                    {
                        qid: 38,
                        typ: 'Current Quarter, Missing',
                    },
                    {
                        qid: 39,
                        typ: 'Current Quarter, Unknown',
                    },
                ]
            },
        */],
        total: 667,
    };

    //await working_aggregate_pdf('Detail', detail_data, quarter, headers, report_index);
    await stage_aggregate_pdf('Detail', detail_data, quarter, headers, report_index);
}

async function working_aggregate_pdf(p_report_type, p_data, p_quarter, p_headers, p_report_index)
{
    let p_ctx = {
        report_type: p_report_type,
        	data: p_data,
        	quarter: p_quarter,
        	headers: p_headers,
            index: p_report_index
        };

    var doc = {
        content: [
            'First paragraph of Report ' + p_ctx.index,
            'Another paragraph, this <h3>time a little bit longer</h3> to make sure, this line will be divided into at least two lines'
        ]    
    }

    window.setTimeout
    (
        //async function () { await pdfMake.createPdf(doc).open(window); },
            async function () { await pdfMake.createPdf(doc).open(); },
        1000
    );
    
    //pdfMake.createPdf(doc).open();
}

async function stage_aggregate_pdf(p_report_type, p_data, p_quarter, p_headers, p_report_index)
{
    let p_ctx = {
        report_type: p_report_type,
        	data: p_data,
        	quarter: p_quarter,
        	headers: p_headers,
            index: p_report_index
        };

    await print_aggregate_pdf(p_ctx);
}

async function print_aggregate_pdf(ctx)
{
    g_writeText = '';

	// // Get unique PDF name
	//let pdfName = createNamePDF();

	// Get the PDF Header Title & Subtitle
	let pdfTitle = ctx.headers.title;
	let pdfSubtitle = ctx.headers.subtitle;

	// Get the logoUrl for Header
	let logoUrl = await getBase64ImageFromURL("/images/mmria-secondary.png");

    var doc = {
        content: [
            'First paragraph of Report ' + ctx.index,
            'Another paragraph, this <h3>time a little bit longer</h3> to make sure, this line will be divided into at least two lines'
        ]    
    }

    window.setTimeout
    (
        //async function () { await pdfMake.createPdf(doc).open(window); },
            async function () { await pdfMake.createPdf(doc).open(); },
        1000
    );
    
    //pdfMake.createPdf(doc).open();
}

async function print_pdf(ctx) {
	g_writeText = '';

	// Get unique PDF name
	let pdfName = createNamePDF();

	// Get the PDF Header Title & Subtitle
	let pdfTitle = ctx.headers.title;
	let pdfSubtitle = ctx.headers.subtitle;

	// Get the logoUrl for Header
	let logoUrl = await getBase64ImageFromURL("/images/mmria-secondary.png");

	// Format the content
	let retContent = formatContent(ctx);

	// console.log('retContent: ', retContent);
	let doc = {
		pageOrientation: 'portrait',
		pageMargins: [10, 50, 10, 50],
		info: {
			title: pdfTitle,
			author: 'MMRIA',
			subject: 'Data Quality Report',
		},
		header: (currentPage, pageCount) => {
			// console.log( 'currentPage: ', currentPage );
			// console.log('pageCount: ', pageCount);
			// console.log( 'doc: ', doc );
			// console.log('header ctx: ', ctx);
			let recLenArr = [];
			let startPage = 0;
			let endPage = 0;
			let header = '***';
			// console.log('doc.content.length: ', doc.content.length);
			// console.log('*** content: ', doc.content);
			for (let i = 0; i < doc.content.length; i++) 
            {
				// console.log('*** pageNumber: ', i, ' - ', doc.content[i].positions[0].pageNumber);
				startPage = doc.content[i].positions[0].pageNumber;
				endPage = doc.content[i].positions[doc.content[i].positions.length - 1].pageNumber;
				header = (doc.content[i].stack[0].table.body[0][0].pageHeaderText != undefined) ? doc.content[i].stack[0].table.body[0][0].pageHeaderText : header;
				recLenArr.push({ s: startPage, e: endPage, p: header });
			}

			// Set the header title
			let index = recLenArr.findIndex(item => ((currentPage >= item.s) && (currentPage <= item.e)));
			g_writeText = recLenArr[index].p;
			let headerObj = [
				{
					margin: 10,
					columns: [
						{
							image: `${logoUrl}`,
							width: 30,
							margin: [0, 0, 0, 10]
						},
						{
							width: '*',
							layout: {
								defaultBorder: false,
							},
							table: {
								widths: '*',
								body: [
									[
										{ text: pdfTitle, alignment: 'center', style: 'pageHeader', },
									],
									[
										{ text: pdfSubtitle, alignment: 'center', style: 'pageSubHeader' },
									],
								],									
							},
						},
						{
							width: 110,
							layout: {
								defaultBorder: false,
							},
							table: {
								widths: [40, 60],
								body: [
									[
										{ text: 'Page:', style: ['headerPageDate', 'isBold'], alignment: 'right' },
										{ text: currentPage + ' of ' + pageCount, style: 'headerPageDate' },
									],
									[
										{ text: 'On:', style: ['headerPageDate', 'isBold'], alignment: 'right' },
										{ text: getTodayFormatted(), style: 'headerPageDate' },
									],
								],
							},
						},
					],
				},
			];
			return headerObj;
		},
		footer: (currentPage, pageCount) => {
			var tbl_footer = '';
			if ( ctx.report_type == 'Summary' )
			{
				tbl_footer = '*The denominator for this indicator is limited to pregnancy-related deaths with a completed ';
				tbl_footer += 'Birth/Fetal Death Certificate - Parent Section according to the Form Status on the Home Record [hrcpr_bcp_secti = 2].';
			}
			else
			{
				tbl_footer = '';
			}
			if (currentPage < 3) {
				return {
					margin: [20, 0, 20, 0],
					height: 20,
					columns: [
						{ text: tbl_footer, },
					]
				};
			}
		},
		styles: {
			pageHeader: {
				fontSize: 12,
				color: '#000080',
			},
			pageSubHeader: {
				fontSize: 10,
				color: '#000080',
			},
			headerPageDate: {
				fontSize: 9,
			},
			formHeader: {
				fontSize: 12,
				color: '#000080',
				margin: [2, 2, 2, 2],
			},
			coreHeader: {
				fontSize: 12,
				color: '#0000ff',
				margin: [0, 10, 0, 5]
			},
			isBold: {
				bold: true,
			},
			isItalics: {
				italics: true,
			},
			fgBlue: {
				color: '#000080',
			},
			fgRed: {
				color: '#990000',
			},
			isUnderlined: {
				decoration: 'underline',
			},
			lightFill: {
				fillColor: '#eeeeee',
			},
			blueFill: {
				fillColor: '#cce6ff',
			},
			lightBlueFill: {
				fillColor: '#f0f8ff',
			},
			tableLabel: {
				color: '#000080',
				fontSize: 9,
				bold: true,
			},
			tableLabelSmall: {
				color: '#000080',
				fontSize: 6,
				bold: true,
			},
			tableDetail: {
				color: '#000000',
				fontSize: 9,
			},
			noteLabel: {
				color: '#000080',
				fontSize: 10,
				bold: true,
			},
			noteDetail: {
				color: '#000000',
				fontSize: 10,
			},
		},
		defaultStyle: {
			fontSize: 8,
		},
		content: retContent,
	};
	// Create the pdf file
	// pdfMake.createPdf(doc).download(pdfName);
	pdfMake.createPdf(doc).open();

}
