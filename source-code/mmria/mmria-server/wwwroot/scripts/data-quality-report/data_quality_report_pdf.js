var g_current;
var g_writeText;
var g_jurisdiction;


$(function () {//http://www.w3schools.com/html/html_layout.asp
	'use strict';

	//profile.initialize_profile();

});

async function create_data_quality_report_download(p_data, p_quarter, p_jurisdiction) {
	g_jurisdiction = p_jurisdiction;
	let p_ctx = {
		data: p_data,
		quarter: p_quarter,
	};

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
		pageMargins: [10, 50, 10, 50],
		info: {
			title: pdfTitle,
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
			for (let i = 0; i < doc.content.length; i++) {
				// console.log('*** pageNumber: ', i, ' - ', doc.content[i].positions[0].pageNumber);
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
										{ text: `Reporting Period: ${ ctx.quarter }`, alignment: 'center', style: 'pageSubHeader' },
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
			var tbl_footer = '*The denominator for this indicator is limited to pregnancy-related deaths with a completed ';
			tbl_footer += 'Birth/Fetal Death Certificate - Parent Section according to the Form Status on the Home Record [hrcpr_bcp_secti = 2].';
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
				fillColor: '#dedede',
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
	// Create the download file
	pdfMake.createPdf(doc).download(pdfName);
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
	let headerStr = `Data Quality Report for: ${g_jurisdiction}`;
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
function formatContent(ctx) {
	let retContent = [];
	let body = [];

	// Build summary page 1 & 2
	body = dqr_summary(ctx);

	console.log('body: ', body);
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
function add_page_break() {
	let row = new Array();

	row.push([{ text: '', pageBreak: 'before' }]);

	return row;
}

// Format summary pages
function dqr_summary(ctx) {
	let retPage = [];
	let body = [];

	body = format_summary_pages(ctx);

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

function format_summary_pages(ctx) {
	let retPage = [];

	// First table - 01) thru 05)
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 1; },
			},
			width: '*',
			table: {
				headerRows: 0,
				widths: [350, '*'],
				body: [
					[
						{
							text: `Summary of ALL Deaths Entered into MMRIA as of ${ctx.quarter}`,
							style: ['tableLabel', 'lightFill'],
							border: [true, true, false, true],
						},
						{
							text: `N (as of ${ctx.quarter})`,
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [false, true, true, true],
						},
					],
					[
						{
							text: '01) Deaths entered into MMRIA',
							style: ['tableDetail'],
						},
						{
							text: '7930',
							style: ['tableDetail'],
							alignment: 'center',
						},
					],
					[
						{
							text: '02) Deaths Missing Case Identification Method',
							style: ['tableDetail'],
						},
						{
							text: '1648',
							style: ['tableDetail'],
							alignment: 'center',
						},
					],
					[
						{
							text: '03) Case Status',
							style: ['tableDetail'],
							border: [true, true, true, false],
						},
						{
							text: '',
							style: ['tableDetail'],
							alignment: 'center',
							border: [true, true, true, false],
						},
					],
					[
						{
							text: '            Abstracting (incomplete)',
							style: ['tableDetail'],
							border: [true, false, true, false],
							preserveLeadingSpaces: true,
						},
						{
							text: '1316',
							style: ['tableDetail'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: '            Abstraction Complete',
							style: ['tableDetail'],
							border: [true, false, true, false],
							preserveLeadingSpaces: true,
						},
						{
							text: '737',
							style: ['tableDetail'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: '            Ready for Review',
							style: ['tableDetail'],
							border: [true, false, true, false],
							preserveLeadingSpaces: true,
						},
						{
							text: '583',
							style: ['tableDetail'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: '            Review Complete and Decisions Entered',
							style: ['tableDetail'],
							border: [true, false, true, false],
							preserveLeadingSpaces: true,
						},
						{
							text: '566',
							style: ['tableDetail'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: '            Out of Scope and Death Certificate Entered',
							style: ['tableDetail'],
							border: [true, false, true, false],
							preserveLeadingSpaces: true,
						},
						{
							text: '88',
							style: ['tableDetail'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: '            False Positive and Death Certificate Entered',
							style: ['tableDetail'],
							border: [true, false, true, false],
							preserveLeadingSpaces: true,
						},
						{
							text: '231',
							style: ['tableDetail'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: '            Vitals Import',
							style: ['tableDetail'],
							border: [true, false, true, false],
							preserveLeadingSpaces: true,
						},
						{
							text: '146',
							style: ['tableDetail'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: '            Missing',
							style: ['tableDetail'],
							border: [true, false, true, true],
							preserveLeadingSpaces: true,
						},
						{
							text: '4263',
							style: ['tableDetail'],
							alignment: 'center',
							border: [true, false, true, true],
						},
					],
					[
						{
							text: '04) Reviewed Deaths',
							style: ['tableDetail'],
						},
						{
							text: '4694',
							style: ['tableDetail'],
							alignment: 'center',
						},
					],
					[
						{
							text: '05) Reviewed Deaths Determined to be Pregnancy-Related',
							style: ['tableDetail'],
						},
						{
							text: '1571',
							style: ['tableDetail'],
							alignment: 'center',
						},
					],
				],
			},
		},
	]);

	// Second table - 06) thru 09)
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 1; },
			},
			width: '*',
			table: {
				headerRows: 0,
				widths: [350, '*'],
				body: [
					[
						{
							text: `Summary of Deaths included in this ${ctx.quarter} Report`,
							style: ['tableLabel', 'lightFill'],
							border: [true, true, false, true],
						},
						{
							text: `N (as of ${ctx.quarter})`,
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [false, true, true, true],
						},
					],
					[
						{
							text: `06) Pregnancy-Related Deaths Reviewed in ${ctx.quarter}`,
							style: ['tableDetail'],
						},
						{
							text: '132',
							style: ['tableDetail'],
							alignment: 'center',
						},
					],
					[
						{
							text: '07) Had a Linked BC/FDC (per Home Record Form Status)(subset of deaths in #06)',
							style: ['tableDetail'],
						},
						{
							text: '92',
							style: ['tableDetail'],
							alignment: 'center',
						},
					],
					[
						{
							text: '08) Pregnancy-Related Deaths Reviewed in previous 4 Quarters',
							style: ['tableDetail'],
						},
						{
							text: '520',
							style: ['tableDetail'],
							alignment: 'center',
						},
					],
					[
						{
							text: '09) Had a Linked BC/FDC (per Home Record Form Status)(subset of deaths in #08)',
							style: ['tableDetail'],
						},
						{
							text: '352',
							style: ['tableDetail'],
							alignment: 'center',
						},
					],
				],
			},
		},
	]);

	// Third table - 10) thru 34)
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 1; },
			},
			width: '*',
			table: {
				headerRows: 5,
				widths: [350, '*', '*'],
				body: [
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, true, false, false],
						},
						{
							text: 'Deaths Reviewed in',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, true, true, false],
						},
						{
							text: 'Deaths Reviewed in',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, true, true, false],
						},
					],
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, false, true, false],
						},
						{
							text: `${ctx.quarter}, N = 132`,
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
						{
							text: 'Previous 4 Qtrs, N = 520',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: '',
							style: ['tableLabelSmall', 'lightFill'],
							border: [true, false, true, false],
						},
						{
							text: 'How your data looks',
							style: ['tableLabelSmall', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
						{
							text: 'How your data looked',
							style: ['tableLabelSmall', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, false, true, false],
						},
						{
							text: 'Missing          Unknown',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
						{
							text: 'Missing          Unknown',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: 'Key Characteristics of Reviewed Pregnancy-Related Deaths',
							style: ['tableLabel', 'lightFill'],
							border: [true, false, true, true],
						},
						{
							text: 'N       %            N          %',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, true],
						},
						{
							text: 'N       %            N          %',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, true],
						},
					],
					[
						{
							text: `10) Timing of Death: Abstractor's Overall Assessment of Timing (from Home Record)`,
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '23', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '17.4%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '0', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 4, text: '', style: ['tableDetail'], },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '260', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '50.2%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '0', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 4, text: '', style: ['tableDetail'], },
								],
						},
					],
					[
						{
							text: '11) Timing of Death: Date of Death (from DC)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '0', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '0', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '12) Timing of Death: Date of Death (from DC)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '1', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.1%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '11', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '3.1%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '13) Timing of Death: Pregnancy Checkbox (from DC)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '11', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '8.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '14', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '10.6%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '26', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '5.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '44', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '8.5%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '14) Race/Ethnicity (from BC/FDC)*',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '8', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '8.7%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '39', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '11.1%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '15) Race/Ethnicity (from DC)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '8', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '6.1%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '20', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '3.8%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '16) Age at Death (from DC)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '2', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.5%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '2', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.4%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '17) Education (from BC/FDC)*',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '7', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '7.6%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '3', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '3.3%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '29', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '8.2%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '16', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '4.5%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '18) Education (from DC)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '3', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '2.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '1', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.8%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '4', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.8%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '15', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '2.9%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '19) Emotional Stressors (from SEP)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '35', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '26.5%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '13', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '9.8%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '109', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '21.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '34', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '6.5%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '20) Living Arrangements (from SEP)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '57', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '43.2%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '26', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '19.7%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '195', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '37.5%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '144', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '27.7%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '21) Distance Between Residence and Place of Death (from DC)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '37', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '28.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '92', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '17.7%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '22) Distance Between Residence and Place of Delivery (from BC/FDC)*',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '25', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '27.2%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '89', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '25.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '23) Urbanicity of Place of Death (from DC)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '29', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '22.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '2', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.5%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '89', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '17.1%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '9', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.7%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '24) Urbanicity of Place of Last Residence (from DC)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '19', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '14.4%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '2', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.5%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '64', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '12.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '1', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.2%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '25) Urbanicity of Place of Delivery (from BC/FDC)*',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '19', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '20.7%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '10', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '10.9%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '75', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '21.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '29', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '8.2%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '26) Urbanicity of Place of Residence (from BC/FDC)*',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '15', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '16.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '2', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '2.2%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '56', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '15.9%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '15', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.3%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '27) Was Autopsy Performed? (from DC)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '5', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '3.8%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '1', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.8%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '14', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '2.7%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '9', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.7%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '28) What Type of Autopsy or Examination was Performed? (from Autopsy Report)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '44', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '33.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '3', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '2.3%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '163', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '31.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '0', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.0%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '29) Principal Source of Payment for Prenatal Care (from PCR)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '36', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '27.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '6', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '4.5%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '158', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '30.4%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '21', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '4.0%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '30) Principal Source of Payment for this Delivery (from BC/FDC)*',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '4', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '4.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '0', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.0%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '29', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '8.2%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '4', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.1%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '31) Any Prenatal Care (from SEP)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '43', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '32.6%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '4', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '3.0%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '185', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '35.6', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '11', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '2.1%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '32) Documented Barriers to Healthcare Access (from SEP)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '38', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '28.8%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '25', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '18.9%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '125', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '24.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '118', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '22.7%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '33) Was There Documented Substance Use (from SEP)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '38', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '28.8%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '3', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '2.3%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '118', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '22.7%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '6', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.2%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '34) Were There Documented Preexisting Mental Health Conditions (from MHP)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '41', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '31.1%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '2', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.5%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '129', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '24.8%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '16', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '3.1%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
				],
			},
		},
	]);

	// Fourth table - 35) thru 43)
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 1; },
			},
			width: '*',
			table: {
				headerRows: 4,
				widths: [350, '*', '*'],
				body: [
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, true, false, false],
						},
						{
							text: 'Deaths Reviewed in',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, true, true, false],
						},
						{
							text: 'Deaths Reviewed in',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, true, true, false],
						},
					],
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, false, true, false],
						},
						{
							text: `${ctx.quarter}, N = 132`,
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
						{
							text: 'Previous 4 Qtrs, N = 520',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, false, true, false],
						},
						{
							text: 'Missing          Unknown',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
						{
							text: 'Missing          Unknown',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: 'Key Characteristics of Reviewed Pregnancy-Related Deaths',
							style: ['tableLabel', 'lightFill'],
							border: [true, false, true, true],
						},
						{
							text: 'N       %            N        %',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, true],
						},
						{
							text: 'N       %            N        %',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, true],
						},
					],
					[
						{
							text: '35) Committee Determination of Primary Underlying Cause of Death (PMSS-MM)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '0', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '1', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.8%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '7', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '16', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '3.1%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '36) Was this Death Preventable?',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '6', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '4.5%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '19', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '3.7%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '37) Chance to Alter Outcome',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '7', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '5.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '5', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '3.8%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '14', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '2.7%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '32', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '6.2%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '38) Did Obesity Contribute to the Death?',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '4', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '3.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '5', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '3.8%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '0', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '21', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '4.0%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '39) Did Discrimination Contribute to the Death?',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '7', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '5.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '22', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '16.7%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '44', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '8.5%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '116', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '22.3%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '40) Did Mental Health Cond. Other than Substance Use Disorder Contribute to Death?',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '2', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.5%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '14', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '10.6%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '2', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.4%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '49', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '9.4%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '41) Did Substance Use Disorder Contribute to the Death?',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '2', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.5%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '14', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '10.6%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '2', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.4%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '49', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '9.4%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '42) Was this Death a Suicide?',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '2', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.5%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '10', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '7.6%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '1', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.2%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '24', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '4.6%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '43) Was this Death a Homicide?',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 20, text: '3', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '2.3%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '1', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '0.8%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 20, text: '5', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '1.0%', style: ['tableDetail'], alignment: 'right', },
									{ width: 20, text: '6', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '31.2%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
				],
			},
		},
	]);

	// Fifth table - 44) thru 45)
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 1; },
			},
			width: '*',
			table: {
				headerRows: 4,
				widths: [350, '*', '*'],
				body: [
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, true, false, false],
						},
						{
							text: 'Deaths Reviewed in',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, true, true, false],
						},
						{
							text: 'Deaths Reviewed in',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, true, true, false],
						},
					],
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, false, true, false],
						},
						{
							text: `${ctx.quarter}, N = 132`,
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
						{
							text: 'Previous 4 Qtrs, N = 520',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, false, true, false],
						},
						{
							text: 'Total    Passed Logic Chk',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
						{
							text: 'Total    Passed Logic Chk',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: 'Logic Checks for Reviewed Pregnancy-Related Deaths',
							style: ['tableLabel', 'lightFill'],
							border: [true, false, true, true],
						},
						{
							text: '  N              N        %',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, true],
							preserveLeadingSpaces: true,
						},
						{
							text: '  N              N        %',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, true],
							preserveLeadingSpaces: true,
						},
					],
					[
						{
							text: '44) Analyst Able to Assign Yes/No Preventability',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 30, text: '132', style: ['tableDetail'], alignment: 'right', },
									{ width: 40, text: '126', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '95.5%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 30, text: '520', style: ['tableDetail'], alignment: 'right', },
									{ width: 40, text: '502', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '96.5%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '45) Preventability Aligns with Chance to Alter Outcome',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 30, text: '132', style: ['tableDetail'], alignment: 'right', },
									{ width: 40, text: '130', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '98.5%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 30, text: '520', style: ['tableDetail'], alignment: 'right', },
									{ width: 40, text: '518', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '99.6%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
				],
			},
		},
	]);

	// Sixth table - 46) thru 49)
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 1; },
			},
			width: '*',
			table: {
				headerRows: 5,
				widths: [350, '*', '*'],
				body: [
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, true, false, false],
						},
						{
							text: 'Preventable Deaths',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, true, true, false],
						},
						{
							text: 'Preventable Deaths',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, true, true, false],
						},
					],
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, true, false, false],
						},
						{
							text: 'Reviewed in',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, true, true, false],
						},
						{
							text: 'Reviewed in',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, true, true, false],
						},
					],
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, false, true, false],
						},
						{
							text: `${ctx.quarter}, N = 132`,
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
						{
							text: 'Previous 4 Qtrs, N = 520',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: '',
							style: ['tableLabel', 'lightFill'],
							border: [true, false, true, false],
						},
						{
							text: 'Total    Passed Logic Chk',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
						{
							text: 'Total    Passed Logic Chk',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, false],
						},
					],
					[
						{
							text: 'Logic Checks for Reviewed Preventable Pregnancy-Related Deaths',
							style: ['tableLabel', 'lightFill'],
							border: [true, false, true, true],
						},
						{
							text: '  N              N        %',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, true],
							preserveLeadingSpaces: true,
						},
						{
							text: '  N              N        %',
							style: ['tableLabel', 'lightFill'],
							alignment: 'center',
							border: [true, false, true, true],
							preserveLeadingSpaces: true,
						},
					],
					[
						{
							text: '46) If Discrimination checkbox marked \'Yes\' or \'Probably\', did the Committee also select at least 1 of the \'Discrimination\', \'Interpersonal Racism\', or \'Structural Racism\' CFs?',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 30, text: '43', style: ['tableDetail'], alignment: 'right', },
									{ width: 40, text: '18', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '44.2%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 30, text: '140', style: ['tableDetail'], alignment: 'right', },
									{ width: 40, text: '91', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '65.0%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '47) If Mental Health Conditions checkbox marked \'Yes\' or \'Probably\', did the Committee also select \'Mental Health Conditions\' as a CF?',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 30, text: '48', style: ['tableDetail'], alignment: 'right', },
									{ width: 40, text: '23', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '47.9%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 30, text: '162', style: ['tableDetail'], alignment: 'right', },
									{ width: 40, text: '75', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '46.3%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '48) If Substance Use Disorder checkbox marked \'Yes\' or \'Probably\', did the Committee also select \'Substance Use Disorder - alcohol, illicit/prescription drugs\' as a CF?',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 30, text: '38', style: ['tableDetail'], alignment: 'right', },
									{ width: 40, text: '23', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '60.5%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 30, text: '123', style: ['tableDetail'], alignment: 'right', },
									{ width: 40, text: '47', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '38.2%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
					[
						{
							text: '49) Contributing Factor, Description of Issue, and Recommendation all completed (denominator is the # of CF-recommended action rows across all reviewed preventable pregnancy-related deaths)',
							style: ['tableDetail'],
						},
						{
							columns:
								[
									{ width: 30, text: '852', style: ['tableDetail'], alignment: 'right', },
									{ width: 40, text: '770', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '90.4%', style: ['tableDetail'], alignment: 'right', },
								],
						},
						{
							columns:
								[
									{ width: 30, text: '2961', style: ['tableDetail'], alignment: 'right', },
									{ width: 40, text: '2621', style: ['tableDetail'], alignment: 'right', },
									{ width: 30, text: '88.5%', style: ['tableDetail'], alignment: 'right', },
								],
						},
					],
				],
			},
		},
	]);

	return retPage;
}

// Build note pages
function dqr_notes(ctx) {
	let retPage = [];
	let body = [];
	let row = new Array();

	// Add a page break
	body.push(add_page_break());

	// Add the notes
	dqr_notes_list.map((note, index) => {
		row = new Array();
		row.push([
			{
				text: [
					{
						text: `${note.num} `,
						style: ['noteDetail'],
					},
					{
						text: `${note.title} `,
						style: ['noteLabel'],
					},
					{
						text: `${note.desc}`,
						style: ['noteDetail'],
					},
				],
			},
		]);
		body.push(row);
	});

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
