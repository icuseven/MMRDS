let g_data = null;
let g_current;
let g_writeText;
let g_quarter;

$(function () {//http://www.w3schools.com/html/html_layout.asp
	'use strict';

	//profile.initialize_profile();

});

async function create_data_quality_report_download(p_data, p_quarter)
{
	g_data = p_data;
	g_quarter = p_quarter;

	let p_ctx = {
		data: p_data,
		quarter: p_quarter,
	};

	// console.log(' let p_ctx = ', p_ctx);
	
	try {
		// initialize_print_pdf(ctx);
		document.title = getHeaderName();
		await print_pdf(p_ctx);
	}
	catch (ex) {
		console.log('ERR: ', ex);
		let profile_content_id = document.getElementById("profile_content_id");
		{
			profile_content_id.innerText = `
An error has occurred generating PDF for ${getHeaderName()}.
 
Please email mmriasupport@cdc.gov the ERROR DETAILS regarding this Print-PDF issue.

Error Details (Print PDF):

Summary: ${ex}

Stack: ${ex.stack}

            `;
		}

	}
}

async function print_pdf(ctx) {
	g_writeText = '';

	// Get unique PDF name
	let pdfName = createNamePDF();

	// Get the PDF Header Title
	let pdfTitle = getHeaderName();

	// Get the logoUrl for Header
	let logoUrl = await getBase64ImageFromURL("/images/mmria-secondary.png");

	// Format the content
	let retContent = formatContent(ctx);

	// console.log('retContent: ', retContent);
	let doc = {
		pageOrientation: 'portrait',
		pageMargins: [20, 80, 20, 20],
		info: {
			title: pdfTitle,
		},
		header: (currentPage, pageCount) => {
			console.log( 'currentPage: ', currentPage );
			console.log('pageCount: ', pageCount);
			console.log( 'doc: ', doc );
			console.log('ctx: ', ctx);
			let recLenArr = [];
			let startPage = 0;
			let endPage = 0;
			let header = '***';
			console.log('doc.content.length: ', doc.content.length);
			console.log('*** content: ', doc.content);
			for (let i = 0; i < doc.content.length; i++) {
				console.log('*** pageNumber: ', i, ' - ', doc.content[i].positions[0].pageNumber);
				startPage = doc.content[i].positions[0].pageNumber;
				endPage = doc.content[i].positions[doc.content[i].positions.length - 1].pageNumber;
				header = (doc.content[i].stack[0].table.body[0][0].pageHeaderText !== undefined) ? doc.content[i].stack[0].table.body[0][0].pageHeaderText : header;
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
							text: pdfTitle,
							alignment: 'center',
							style: 'pageHeader'
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
		styles: {
			pageHeader: {
				fontSize: 12,
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
				fillColor: '#dedede',
			},
			blueFill: {
				fillColor: '#cce6ff',
			},
			lightBlueFill: {
				fillColor: '#f0f8ff',
			},
			subHeader: {
				margin: [0, 10, 0, 0],
				fontSize: 11,
				color: '#000080',
				bold: true,
			},
			gridHeader: {
				fontSize: 11,
				color: '#000080',
				bold: true,
			},
			tableLargeLabel: {
				color: '#000000',
				fontSize: 10,
			},
			tableLabel: {
				color: '#1010dd',
				fontSize: 9,
				bold: true,
			},
			tableDetail: {
				color: '#000000',
				fontSize: 9,
			},
			narrativeDetail: {
				color: '#000000',
				fontSize: 8,
			},
			labelDetail: {
				color: '#ff0000',
				fontSize: 9,
				bold: true,
				margin: [0, 5, 0, 0],
			},
		},
		defaultStyle: {
			fontSize: 12,
		},
		content: retContent,
	};
	// Create the download file
	pdfMake.createPdf( doc ).download( pdfName );
}

// ************************************************************************
// ************************************************************************
//
// Begin - Generic Functions
//
// ************************************************************************
// ************************************************************************

// getBase64ImageFromURL
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

// create a unique PDF name based on datetime
function createNamePDF() {
	let today = new Date();
	let yy = today.getFullYear() + ':';
	let mm = fmt2Digits(today.getMonth() + 1) + ':';
	let dd = fmt2Digits(today.getDate()) + '_';
	let hh = fmt2Digits(today.getHours()) + ':';
	let mn = fmt2Digits(today.getMinutes()) + ':';
	let ss = fmt2Digits(today.getSeconds()) + '.pdf';

	return 'DQR_mmria_' + yy + mm + dd + hh + mn + ss;
}

// check field for null
function chkNull(val) {
	if (val == null) return '';
	return val;
}

// create a unique PDF name based on datetime
function getTodayFormatted() {
	let today = new Date();
	let mm = today.toLocaleString('default', { month: 'short' });
	let yy = today.getFullYear();
	let dd = fmt2Digits(today.getDate());

	return `${dd} ${mm} ${yy}`;
}

// Format the month or day to always have 2 digits
function fmt2Digits(val) {
	if (val === null || val === '9999') return '  ';
	return ((val < 10) ? '0' : '') + val;
}

// Format the year to always have 4 digits, check for 9999
function fmtYear(val) {
	return (val === null || val === '9999') ? '    ' : val;
}

// Reformat date - from YYYY/MM/DD to MM/DD/YYYY
function reformatDate(dt) {
	if (dt === null || dt.length === 0 || dt === '0001-01-01T00:00:00') return '  /  /    ';
	let date = new Date(dt);
	return (!isNaN(date.getTime())) ? `${fmt2Digits(date.getMonth() + 1)}/${fmt2Digits(date.getDate())}/${fmtYear(date.getFullYear())}` : '';
}

// Format date from data and return mm/dd/yyyy or blank if it contains 9999's
function fmtDataDate(dt) {
	if (dt.year === null || dt.year === '9999' || dt.year === '') {
		return '  /  /  ';
	}
	return `${fmt2Digits(dt.month)}/${fmt2Digits(dt.day)}/ {fmtYear(dt.year)}`;
}

// Format date by field (day, month, year)
function fmtDateByFields(dt) {
	let mm = (dt.month === null || dt.month === '9999' || dt.month === '') ? '  ' : fmt2Digits(dt.month);
	let dd = (dt.day === null || dt.day === '9999' || dt.day === '') ? '  ' : fmt2Digits(dt.day);
	let yy = (dt.year === null || dt.year === '9999' || dt.year === '') ? '    ' : dt.year;
	return `${mm}/${dd}/${yy}`;
}

// Format date and time string with mm/dd/yyyy hh:mm (military time)
function fmtDateTime(dt) {
	if (dt === null || dt.length === 0 || dt === '0001-01-01T00:00:00') return '  /  /    ';
	let fDate = new Date(dt);
	let hh = fDate.getHours();
	let mn = fDate.getMinutes();
	let strTime = `${fmt2Digits(hh)}:${fmt2Digits(mn)}`;
	strTime = (strTime === '00:00') ? '' : strTime;
	return `${fmt2Digits(fDate.getMonth() + 1)}/${fmt2Digits(fDate.getDate())}/${fmtYear(fDate.getFullYear())} ${strTime}`;
}

// Reformat date from data string and return mm/dd/yyyy 
function fmtStrDate(dt) {
	if (dt === null || dt.length === 0) {
		return ' / / ';
	}
	let dtParts = dt.split('-');
	return `${fmt2Digits(dtParts[1])}/${fmt2Digits(dtParts[2])}/${fmtYear(dtParts[0])}`;
}

// Get the header name
function getHeaderName() {
	let headerStr = `Data Quality Report for: All Jurisdictions`;
	return headerStr;
}


// ************************************************************************
// ************************************************************************
//
// End - Generic Functions
//
// ************************************************************************
// ************************************************************************

// ************************************************************************
// ************************************************************************
//
// Start - Build the record based on what kind it is
//
// ************************************************************************
// ************************************************************************
function formatContent( ctx ) 
{
	let retContent = [];
	let body = [];

	// Build summary page 1 & 2
	// body = dqr_summary( ctx );
	// console.log('body: ', body);
	// retContent.push([
	// 	{
	// 		layout: {
	// 			defaultBorder: false,
	// 			paddingLeft: function (i, node) { return 1; },
	// 			paddingRight: function (i, node) { return 1; },
	// 			paddingTop: function (i, node) { return 2; },
	// 			paddingBottom: function (i, node) { return 1; },
	// 		},
	// 		id: 'DQR',
	// 		width: '*',
	// 		table: {
	// 			headerRows: 0,
	// 			widths: ['*'],
	// 			body: body,
	// 		},
	// 	},
	// ]);
	body = [];

	// Add the notes
	body = dqr_notes(ctx);
	retContent.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 1; },
			},
			id: 'DQR',
			width: '*',
			table: {
				headerRows: 0,
				widths: ['*'],
				body: body,
			},
		},
	]);

	console.log('retContent: ', retContent);
	return retContent;
}

// Add a Page Break
function add_page_break()
{
	let body = [];
	let row = new Array();

	row.push([{ text: '', pageBreak: 'before' }]);	
	body.push(row);

	return body;
}

// Format summary page 1 & 2
// function dqr_summary( ctx ) 
// {
// 	let retPage = [];
// 	let body = [];

// 	body = format_summary_page_one( ctx );


// 	body = [];
// 	row = new Array();
// 	row.push([{ text: '', pageBreak: 'before' }]);	
// 	body.push(row);
// 	row = new Array();
// 		row.push([
// 		{ text: 'This is a test' },
// 	]);
// 	body.push(row);

// 	retPage.push([
// 		{
// 			layout: {
// 				defaultBorder: false,
// 				paddingLeft: function (i, node) { return 1; },
// 				paddingRight: function (i, node) { return 1; },
// 				paddingTop: function (i, node) { return 2; },
// 				paddingBottom: function (i, node) { return 1; },
// 			},
// 			width: '*',
// 			table: {
// 				headerRows: 0,
// 				widths: ['*'],
// 				body: body,
// 			},
// 		},
// 	]);
	

// 	return retPage;
// }

// format_summary_page_one( ctx )
// {
// 	let retPage = [];
// 	let colPrompt = [];
// 	let colData = [];
	
// 	// First table on page 1
// 	retPage.push([
// 		{
// 			layout: {
// 				defaultBorder: true,
// 				paddingLeft: function (i, node) { return 1; },
// 				paddingRight: function (i, node) { return 1; },
// 				paddingTop: function (i, node) { return 2; },
// 				paddingBottom: function (i, node) { return 1; },
// 			},
// 			width: '*',
// 			table: {
// 				headerRows: 0,
// 				widths: [350, '*'],
// 				body: [
// 					[
// 						{ 
// 							text: `Summary of ALL Deaths Entered into MMRIA as of ${ ctx.quarter }`,
// 							style: ['tableLabel', 'lightFill'],
// 							border: [true, true, false, true],
// 						},
// 						{
// 							text: `N (as of ${ ctx.quarter })`,
// 							style: ['tableLabel', 'lightFill'],
// 							alignment: 'center',
// 							border: [false, true, true, true],
// 						},			
// 					],
// 					[
// 						{
// 							text: '01) Deaths entered into MMRIA',
// 							style: ['tableDetail']
// 						},
// 						{
// 							text: '7930',
// 							style: ['tableDetail'],
// 							alignment: 'center'
// 						},	
// 					],
// 					[
// 						{
// 							text: '02) Deaths Missing Case Identification Method',
// 							style: ['tableDetail']
// 						},
// 						{
// 							text: '1648',
// 							style: ['tableDetail'],
// 							alignment: 'center'
// 						},
// 					],

// 				],
// 			},
// 		},
// 	]);

	
	

// 	return 
// }


function dqr_notes( ctx ) 
{
	let retPage = [];
	let body = [];
	let row = new Array();

	row.push([{ text: '', pageBreak: 'before' }]);	
	body.push(row);

	row = new Array();
	row.push([
		{ text: 'This is a test 2' },
	]);

	body.push(row);

	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 1; },
			},
			width: '*',
			table: {
				headerRows: 0,
				widths: ['*'],
				body: body,
			},
		},
	]);

	return retPage;
}
