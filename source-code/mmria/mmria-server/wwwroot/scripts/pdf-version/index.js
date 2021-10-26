let g_md = null;
let g_metadata = null;
let g_d = null;
let g_section_name;
let g_current;
let g_writeText;
let g_metadata_summary = {};
let g_record_number;

$(function () {//http://www.w3schools.com/html/html_layout.asp
	'use strict';

	//profile.initialize_profile();

	//load_metadata();
});


//: MMRIA#:<RecordID>/<Form Name
let TitleMap = {
	"home_record": "Home",
	"death_certificate": "DC",
	"birth_fetal_death_certificate_parent": "BCDC-P",
	"birth_certificate_infant_fetal_section": "BCDC-I",
	"autopsy_report": "Autopsy",
	"prenatal": "PreNatal",
	"er_visit_and_hospital_medical_records": "ER",
	"other_medical_office_visits": "OfficeVisits",
	"medical_transport": "Transport",
	"social_and_environmental_profile": "SEP",
	"mental_health_profile": "MentalHealth",
	"informant_interviews": "Interview",
	"case_narrative": "Narrative",
	"committee_review": "Decision",
	"all": "ALL",
	"core-summary": "Core",
};

async function create_print_version
	(
		p_metadata,
		p_data,
		p_section,
		p_number,
		p_metadata_summary
	) {

	g_md = null;
	g_metadata = null;
	g_d = null;
	g_section_name = null;
	g_current = null;
	g_writeText = null;
	g_metadata_summary = {};
	g_record_number = null;

	g_md = p_metadata;
	g_metadata = p_metadata;
	g_d = p_data;
	g_section_name = p_section;
	g_metadata_summary = p_metadata_summary;
	g_record_number = p_number;

	let p_ctx = {
		metadata: p_metadata,
		data: p_data,
		lookup: p_metadata.lookup,
		mmria_path: "",
		content: [],
		section_name: g_section_name,
		record_number: p_number,
		is_grid_item: false,
		createdBy: p_data.created_by,
		groupLevel: 0,
	};

	console.log(' let p_ctx = ', p_ctx);

	try {
		// initialize_print_pdf(ctx);
		document.title = getHeaderName();
		await print_pdf(p_ctx);
	}
	catch (ex) {
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
	// let pdfName = createNamePDF();

	// Get the PDF Header Title
	let pdfTitle = getHeaderName();

	// Get report tab name
	let reportTabName = `MMRIA #:  ${g_d.home_record.record_id}/${TitleMap[ctx.section_name]}`;

	// Get the logoUrl for Header
	let logoUrl = await getBase64ImageFromURL("/images/mmria-secondary.png");

	// Create map of name and index of the g_md array children
	let arrMap = getArrayMap();

	// Format the content
	let retContent = await formatContent(ctx, arrMap);

	let doc = {
		pageOrientation: 'landscape',
		pageMargins: [20, 80, 20, 20],
		// background: () => {
		// 	return {
		// 		canvas: [
		// 			{
		// 				type: 'rect',
		// 				x: 0, y: 0, h: 595.28, w: 841.89,
		// 				color: '#00BFFF'
		// 			},
		// 		],
		// 	};
		// },
		info: {
			title: reportTabName,
		},
		header: (currentPage, pageCount) => {
			// // console.log( 'currentPage: ', currentPage );
			// // console.log( 'doc: ', doc );
			if (ctx.section_name === 'all') {
				let recLenArr = [];
				let startPage = 0;
				let endPage = 0;
				let title = '';
				for (let i = 0; i < doc.content.length; i++) {
					startPage = doc.content[i].positions[0].pageNumber;
					endPage = doc.content[i].positions[doc.content[i].positions.length - 1].pageNumber;
					recLenArr.push({ s: startPage, e: endPage });
				}

				let index = recLenArr.findIndex(item => ((currentPage >= item.s) && (currentPage <= item.e)));
				for (let l = 0; l < doc.content[index].stack.length; l++) {
					g_writeText = (doc.content[index].stack[l].pageHeaderText !== undefined) ? doc.content[index].stack[l].pageHeaderText : g_writeText;
				}
			}
			else if (g_section_name === 'core-summary') {
				g_writeText = 'CORE SUMMARY';
			} else {
				g_writeText = getSectionTitle(ctx.section_name);
			}
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
										{ text: 'Printed:', style: ['headerPageDate', 'isBold'], alignment: 'right' },
										{ text: getTodayFormatted(), style: 'headerPageDate' },
									],
								],
							},
						},
					],
				},
				{
					margin: [10, 0, 10, 5],
					layout: 'noBorders',
					table: {
						widths: '*',
						body: [
							[
								{ text: g_writeText, style: ['formHeader', 'isBold', 'lightFill'], }
							],
						],
					},
				},
			];
			return headerObj;
		},
		styles: {
			pageHeader: {
				fontSize: 14,
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
				fontSize: 14,
				color: '#0000ff',
				margin: [0, 10, 0, 5]
			},
			isBold: {
				bold: true,
			},
			fgBlue: {
				color: '#000080',
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
	// pdfMake.createPdf( doc ).download( pdfName );


	window.setTimeout
		(
			// async function () { await pdfMake.createPdf(doc).open(window); },
			async function () { await pdfMake.createPdf(doc).open(); },
			3000
		);



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

	return 'mmria_' + yy + mm + dd + hh + mn + ss;
}

// check field for null
function chkNull(val) {
	if (val === undefined || val === null) return '';
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
	let date = new Date(dt);
	return (!isNaN(date.getTime())) ? `${fmt2Digits(date.getMonth() + 1)}/${fmt2Digits(date.getDate())}/${fmtYear(date.getFullYear())}` : '';
}

// Format date from data and return mm/dd/yyyy or blank if it contains 9999's
function fmtDataDate(dt) {
	if (dt.year === null || dt.year === '9999') {
		return '  /  /  ';
	}
	return `${fmt2Digits(dt.month)}/${fmt2Digits(dt.day)}/ {fmtYear(dt.year)}`;
}

// Format date by field (day, month, year)
function fmtDateByFields(dt) {
	let mm = (dt.month === null || dt.month === '9999') ? '  ' : fmt2Digits(dt.month);
	let dd = (dt.day === null || dt.day === '9999') ? '  ' : fmt2Digits(dt.day);
	let yy = (dt.year === null || dt.year === '9999') ? '    ' : dt.year;
	return `${mm}/${dd}/${yy}`;
}

// Format date and time string with mm/dd/yyyy hh:mm (military time)
function fmtDateTime(dt) {
	if (dt === null || dt.length === 0) return '  ';
	let fDate = new Date(dt);
	let hh = fDate.getHours();
	let mn = fDate.getMinutes();
	let strTime = `${fmt2Digits(hh)}:${fmt2Digits(mn)}`
	return `${fmt2Digits(fDate.getMonth())}/${fmt2Digits(fDate.getDate())}/${fmtYear(fDate.getFullYear())} ${strTime}`;
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
	let headerStr = `MMRIA Record ID#:  ${g_d.home_record.record_id}\t--\t` +
		`Agency ID#: ${g_d.home_record.agency_case_id}`;
	return headerStr;
}

// Get Report Tab Name
function getReportTabName(section) {
	let nm = '';
	switch (section) {
		case 'home_record':
			nm = 'Home Record'
			break;
		case 'death_certificate':
			nm = 'Death Certificate';
			break;
		case 'birth_fetal_death_certificate_parent':
			nm = 'Birth/Fetal Death Certificate - Parent Section';
			break;
		case 'birth_certificate_infant_fetal_section':
			nm = 'Birth/Fetal Death Certificate - Infant/Fetal Section';
			break;
		case 'autopsy_report':
			nm = 'Autopsy Report';
			break;
		case 'prenatal':
			nm = 'Prenatal Care Record';
			break;
		case 'er_visit_and_hospital_medical_records':
			nm = 'ER Visits and Hospitalizations';
			break;
		case 'other_medical_office_visits':
			nm = 'Other Medical Office Visits';
			break;
		case 'medical_transport':
			nm = 'Medical Transport';
			break;
		case 'social_and_environmental_profile':
			nm = 'Social and Environmental Profile';
			break;
		case 'mental_health_profile':
			nm = 'Mental Health Profile';
			break;
		case 'informant_interviews':
			nm = 'Informant Interviews';
			break;
		case 'case_narrative':
			nm = 'Case Narrative';
			break;
		case 'committee_review':
			nm = 'Committee Review';
			break;
		case 'core-summary':
			nm = 'Core Elements Only';
			break;
		case 'all':
			nm = 'All Case Forms';
			break;
	}

	return nm;
}
// Get the array for record selected
function getArrayMap() {
	let arr = [];

	for (let i = 0; i < g_md.children.length; i++) {
		arr.push({ name: `${g_md.children[i].name}`, index: i });
	}

	return arr;
}

// Generic Find from global lookup array
function lookupGlobalArr(lookup, val, pathReference) {
	// See if val is null
	if (val === null) return '';
	// Make sure val is a string
	let valStr = `${val}`;
	// See if val is blank
	if (valStr === '') return valStr;

	// Get the path_reference name
	let luIdx = pathReference.indexOf('/') + 1;
	let lookupName = pathReference.substr(luIdx);

	// Find the correct lookup table index
	let lookupIndex = lookup.findIndex((s) => s.name === lookupName);

	// Return the display value from the lookup array
	let arr = lookup[lookupIndex].values;
	let idx = arr.findIndex((s) => s.value === valStr);
	idx = (idx === -1) ? 0 : idx;   // This fixes bad data coming in
	return (arr[idx].display === '(blank)') ? ' ' : arr[idx].display;
}

// Generic Look up display by value
function lookupFieldArr(val, arr) {
	// See if val is null
	if (val === null) return '';
	// Make sure val is a string
	let valStr = `${val}`;

	// See if val is blank or array is empty
	if (valStr === '' || arr.length === 0) return valStr;

	let idx = arr.findIndex((s) => s.value === valStr);
	idx = (idx === -1) ? 0 : idx;   // This fixes bad data coming in
	return (arr[idx].display === '(blank)') ? ' ' : arr[idx].display;
}

// // Return all races a person might be
// function lookupRaceArr(val) {
// 	// See if val is null
// 	if (val === null) return '';
// 	// Return field with all races
// 	let strRace = '';

// 	if (val.length > 0) {
// 		for (let i = 0; i < val.length; i++) {
// 			strRace += lookupGlobalArr(val[i], 'race') + ', ';
// 		}
// 		let idx = strRace.lastIndexOf(', ');
// 		strRace = (idx === -1) ? strRace : strRace.substring(0, idx);
// 	}
// 	return strRace;
// }

// Return all global choices
function lookupGlobalMultiChoiceArr(lookup, val, pathReference) 
{
	// See if val is null
	if (val === null) return '';

	// Get the path_reference name
	let luIdx = pathReference.indexOf('/') + 1;
	let lookupName = pathReference.substr(luIdx);

	// Find the correct lookup table index
	let lookupIndex = lookup.findIndex((s) => s.name === lookupName);

	// Return field with all choices
	let strChoice = '';
	let arr = lookup[lookupIndex].values;
	let idx;
	for (let i = 0; i < val.length; i++) 
    {
		idx = arr.findIndex((s) => s.value === val[i]);
        if(idx != -1)
        {
		    strChoice += arr[idx].display + ', ';
        }
	}
	idx = strChoice.lastIndexOf(', ');
	strChoice = (idx === -1) ? strChoice : strChoice.substring(0, idx);

	return strChoice;
}

// Return all field choices
function lookupFieldMultiChoiceArr(val, arr) 
{
	// See if val is null
	if (val === null) return '';

	// Return field with all choices
	let strChoice = '';
	let idx;
	for (let i = 0; i < val.length; i++) 
    {
		idx = arr.findIndex((s) => s.value === val[i]);
        if(idx != -1)
        {
		    strChoice += arr[idx].display + ', ';
        }

      
	}
	idx = strChoice.lastIndexOf(', ');
	strChoice = (idx === -1) ? strChoice : strChoice.substring(0, idx);

	return strChoice;
}

// getLookupField - either global or field - single or multi
function getLookupField(lookup, data, metadata) {
	// **************************************************************************
	// *** See what kind of lookup will be used
	// ***
	// *** The 1st if will see if is_multiselect exists and set to true
	// ***		Then check to see if  path_reference exist and if it exists
	// ***		then call lookupGlobalMultiChoiceArr else call
	// ***		lookupFieldMultiChoiceArr - both will return a list of
	// ***		display values or just return what is in the field in case
	// ***		there is a problem
	// ***
	// *** The 2nd if will check to see if path_reference exists and then call
	// *** lookupGlobalArr and return the display value
	// ***
	// *** The 3rd if will check to see if the values array has length and then
	// *** call lookupFieldArr and return the display value
	// ***
	// *** Else just return the data value - just in case there is a problem
	// **************************************************************************

	// return string
	let retStr = '';

	if (metadata.hasOwnProperty('is_multiselect') && metadata.is_multiselect === true) {
		// console.log('multiselect is true');
		if (metadata.hasOwnProperty('path_reference') && metadata.path_reference.length > 0) {
			// console.log('path_reference is true');
			retStr = lookupGlobalMultiChoiceArr(lookup, data, metadata.path_reference);
		} else if (metadata.values.length > 0) {
			// console.log('path_reference is false and values length: ', metadata.values.length);
			retStr = lookupFieldMultiChoiceArr(data, metadata.values);
		} else {
			// console.log('values has 0 length');
			retStr = chkNull(data);
		}
	} else if (metadata.hasOwnProperty('path_reference') && metadata.path_reference.length > 0) {
		// console.log('multiselect does not exist and path_reference is true');
		retStr = lookupGlobalArr(lookup, data, metadata.path_reference);
	} else if (metadata.values.length > 0) {
		// console.log('path_reference is false and values length is: ', metadata.values.length);
		retStr = lookupFieldArr(data, metadata.values);
	} else {
		// console.log('default');
		retStr = chkNull(data);
	}

	return retStr;
}

// Find section prompt name
function getSectionTitle(name) {
	if (name === 'all') {
		// console.log('title: ', g_current);
	}

	let idx = g_md.children.findIndex((s) => s.name === name);
	idx = (idx === -1) ? 0 : idx;		// fixes bad data coming in
	return g_md.children[idx].prompt.toUpperCase();
}

async function doChart2(p_id_prefix, chartData) {
	let wrapper_id = `${p_id_prefix}chartWrapper`;
	let container = document.getElementById(wrapper_id)

	if (container != null) {
		container.remove();
	}

	container = document.createElement('div')
	container.id = wrapper_id;
	document.body.appendChild(container);

	let canvas_id = `${p_id_prefix}myChart`;
	let canvas = document.createElement('canvas');
	canvas.id = canvas_id;
	//canvas.setAttribute('height', '150');
	canvas.setAttribute('width', '800px');
	container.appendChild(canvas);



	const config = {
		type: 'line',
		data: chartData,
		options: {
			maintainAspectRatio: false,
			responsive: true,
			animation: null,
			animate: false,
			scales: {
				y: {
					beginAtZero: true
				}
			},
		},
	};


	let myImgChart = await new Chart(canvas.getContext('2d'), config);
	//const width = 300; //px
	//const height = 150; //px
	//const canvasRenderService = new CanvasRenderService(width, height);
	myImgChart.draw();
	myImgChart.render();

	return myImgChart.toBase64Image();
	//return canvas.toDataURL();
}

function done(img) {
	return new Promise((resolve, reject) => {
		// console.log('In done');
		if (img) {
			// console.log('img is there', img.length)
			resolve(img);
		}
		reject(console.log('Image load error: ', error));
	});
}

// ************************************************************************
// ************************************************************************
//
// End - Generic Functions
//
// ************************************************************************
// ************************************************************************

// ************************************************************************
// Global variables for the charts
// ************************************************************************

// ER Visits and Hospitalizations Template
let chartArrTemplateER = {
	bloodPressure: {
		chartLabels: [],
		chartData: [[], []],
	},
	heartRate: {
		chartLabels: [],
		chartData: [],
	},
	respiration: {
		chartLabels: [],
		chartData: [],
	},
	temperature: {
		chartLabels: [],
		chartData: [],
	},
};
// Prenatal Care Record Template
let chartArrTemplatePrenatal = {
	bloodPressure: {
		chartLabels: [],
		chartData: [[], []],
	},
	weightGain: {
		chartLabels: [],
		chartData: [],
	},
	hematocrit: {
		chartLabels: [],
		chartData: [],
	},
};


// ************************************************************************
// ************************************************************************
//
// Start - Build the record based on what kind it is
//
// ************************************************************************
// ************************************************************************
async function formatContent(p_ctx, arrMap) {
	let retContent = [];
	let arrIndex;
	let sectionName = p_ctx.section_name;
	let ctx;

	switch (sectionName) {
		case 'home_record':
			arrIndex = arrMap.findIndex((s) => s.name === 'home_record');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.home_record };
			retContent.push(await home_record(ctx));
			break;
		case 'death_certificate':
			arrIndex = arrMap.findIndex((s) => s.name === 'death_certificate');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.death_certificate };
			retContent.push(await death_certificate(ctx, false));
			break;
		case 'birth_fetal_death_certificate_parent':
			arrIndex = arrMap.findIndex((s) => s.name === 'birth_fetal_death_certificate_parent');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.birth_fetal_death_certificate_parent };
			retContent.push(await birth_fetal_death_certificate_parent(ctx, false));
			break;
		case 'birth_certificate_infant_fetal_section':
			arrIndex = arrMap.findIndex((s) => s.name === 'birth_certificate_infant_fetal_section');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.birth_certificate_infant_fetal_section };
			retContent.push(await birth_certificate_infant_fetal_section(ctx, false));
			break;
		case 'autopsy_report':
			arrIndex = arrMap.findIndex((s) => s.name === 'autopsy_report');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.autopsy_report };
			retContent.push(await autopsy_report(ctx, false));
			break;
		case 'prenatal':
			arrIndex = arrMap.findIndex((s) => s.name === 'prenatal');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.prenatal };
			retContent.push(await prenatal(ctx, false));
			break;
		case 'er_visit_and_hospital_medical_records':
			arrIndex = arrMap.findIndex((s) => s.name === 'er_visit_and_hospital_medical_records');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.er_visit_and_hospital_medical_records };
			retContent.push(await er_visit_and_hospital_medical_records(ctx, false));
			break;
		case 'other_medical_office_visits':
			arrIndex = arrMap.findIndex((s) => s.name === 'other_medical_office_visits');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.other_medical_office_visits };
			retContent.push(await other_medical_office_visits(ctx, false));
			break;
		case 'medical_transport':
			arrIndex = arrMap.findIndex((s) => s.name === 'medical_transport');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.medical_transport };
			retContent.push(await medical_transport(ctx, false));
			break;
		case 'social_and_environmental_profile':
			arrIndex = arrMap.findIndex((s) => s.name === 'social_and_environmental_profile');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.social_and_environmental_profile };
			retContent.push(await social_and_environmental_profile(ctx, false));
			break;
		case 'mental_health_profile':
			arrIndex = arrMap.findIndex((s) => s.name === 'mental_health_profile');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.mental_health_profile };
			retContent.push(await mental_health_profile(ctx, false));
			break;
		case 'informant_interviews':
			arrIndex = arrMap.findIndex((s) => s.name === 'informant_interviews');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.informant_interviews };
			retContent.push(await informant_interviews(ctx, false));
			break;
		case 'case_narrative':
			arrIndex = arrMap.findIndex((s) => s.name === 'case_narrative');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.case_narrative };
			retContent.push(await case_narrative(ctx, false));
			break;
		case 'committee_review':
			arrIndex = arrMap.findIndex((s) => s.name === 'committee_review');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.committee_review };
			retContent.push(await committee_review(ctx, false));
			break;
		case 'core-summary':
			retContent.push(await core_summary());
			break;
		case 'all':
			// home_record
			g_current = 'home_record';
			arrIndex = await arrMap.findIndex((s) => s.name === 'home_record');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.home_record };
			retContent.push(await home_record(ctx));
			// death_certificate
			g_current = 'death_certificate';
			arrIndex = await arrMap.findIndex((s) => s.name === 'death_certificate');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.death_certificate };
			retContent.push(await death_certificate(ctx, true));
			// birth_fetal_death_certificate_parent
			g_current = 'birth_fetal_death_certificate_parent';
			arrIndex = await arrMap.findIndex((s) => s.name === 'birth_fetal_death_certificate_parent');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.birth_fetal_death_certificate_parent };
			retContent.push(await birth_fetal_death_certificate_parent(ctx, true));
			// birth_certificate_infant_fetal_section
			g_current = 'birth_certificate_infant_fetal_section';
			arrIndex = await arrMap.findIndex((s) => s.name === 'birth_certificate_infant_fetal_section');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.birth_certificate_infant_fetal_section };
			retContent.push(await birth_certificate_infant_fetal_section(ctx, true));
			// autopsy_report
			g_current = 'autopsy_report';
			arrIndex = await arrMap.findIndex((s) => s.name === 'autopsy_report');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.autopsy_report };
			retContent.push(await autopsy_report(ctx, true));
			// prenatal
			g_current = 'prenatal';
			arrIndex = await arrMap.findIndex((s) => s.name === 'prenatal');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.prenatal };
			retContent.push(await prenatal(ctx, true));
			// er_visit_and_hospital_medical_records
			g_current = 'er_visit_and_hospital_medical_records';
			arrIndex = await arrMap.findIndex((s) => s.name === 'er_visit_and_hospital_medical_records');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.er_visit_and_hospital_medical_records };
			retContent.push(await er_visit_and_hospital_medical_records(ctx, true));
			// other_medical_office_visits
			g_current = 'other_medical_office_visits';
			arrIndex = await arrMap.findIndex((s) => s.name === 'other_medical_office_visits');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.other_medical_office_visits };
			retContent.push(await other_medical_office_visits(ctx, true));
			// medical_transport
			g_current = 'medical_transport';
			arrIndex = await arrMap.findIndex((s) => s.name === 'medical_transport');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.medical_transport };
			retContent.push(await medical_transport(ctx, true));
			// social_and_environmental_profile
			g_current = 'social_and_environmental_profile';
			arrIndex = await arrMap.findIndex((s) => s.name === 'social_and_environmental_profile');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.social_and_environmental_profile };
			retContent.push(await social_and_environmental_profile(ctx, true));
			// mental_health_profile
			g_current = 'mental_health_profile';
			arrIndex = await arrMap.findIndex((s) => s.name === 'mental_health_profile');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.mental_health_profile };
			retContent.push(await mental_health_profile(ctx, true));
			// informant_interviews
			g_current = 'informant_interviews';
			arrIndex = await arrMap.findIndex((s) => s.name === 'informant_interviews');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.informant_interviews };
			retContent.push(await informant_interviews(ctx, true));
			// case_narrative
			g_current = 'case_narrative';
			arrIndex = await arrMap.findIndex((s) => s.name === 'case_narrative');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.case_narrative };
			retContent.push(await case_narrative(ctx, true));
			// committee_review
			g_current = 'committee_review';
			arrIndex = await arrMap.findIndex((s) => s.name === 'committee_review');
			ctx = { ...p_ctx, metadata: g_md.children[arrIndex], data: g_d.committee_review };
			retContent.push(await committee_review(ctx, true));
			break;
		default:
			// let a = info.fields[ 0 ].prompt;
			// // console.log( 'xxx: ', a );
			retContent = [
				{ text: "Not done", bold: true, }
			];
	}

	return retContent;
}

//
// Build home_record
// 	ctx contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//

async function home_record(ctx) {
	let body = [];
	let retPage = [];

	console.log('p: ', ctx.metadata);
	console.log('d: ', ctx.data);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	console.log('home ctx: ', ctx);

	// Loop thru the metadata for home_record
	body = print_pdf_render_content(ctx);
	console.log('body: ', body);

	// Show the table
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			id: 'home_record',
			width: 'auto',
			table: {
				headerRows: 0,
				widths: [250, 'auto'],
				body: body,
			},
		},
	]);

	return retPage;
}

// Build death_certificate record
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function death_certificate(ctx, pg_break) {
	let body = [];
	let retPage = [];

	console.log('p: ', ctx.metadata);
	console.log('d: ', ctx.data);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	console.log('death certificate ctx: ', ctx);

	// Loop thru the metadata for death_certificate
	body = print_pdf_render_content(ctx);
	console.log('body: ', body);

	// Show the table
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			id: 'death_certificate',
			width: 'auto',
			table: {
				headerRows: 0,
				widths: [250, 'auto'],
				body: body,
			},
		},
	]);

	return retPage;
}

// Build birth_fetal_death_certificate_parent record
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function birth_fetal_death_certificate_parent(ctx, pg_break) {
	let body = [];
	let retPage = [];

	console.log('birth_fetal_death_certificate_parent ctx: ', ctx);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Loop thru the metadata for birth_fetal_death_certificate_parent
	body = print_pdf_render_content(ctx);
	console.log('body: ', body);

	// Show the table
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			id: 'birth_fetal_death_certificate_parent',
			width: 'auto',
			table: {
				headerRows: 0,
				widths: [250, 'auto'],
				body: body,
			},
		},
	]);

	return retPage;
}

// Build birth_certificate_infant_fetal_section record 
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function birth_certificate_infant_fetal_section(ctx, pg_break) {
	// Global fields
	let body = [];
	let retPage = [];
	let allRecs = (typeof ctx.record_number === 'undefined' || pg_break) ? true : false;
	let lenArr = ctx.data.length;
	let startArr = 0;
	let endArr = lenArr;

	console.log('birth_certificate_infant_fetal_section ctx: ', ctx);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Are there any records?
	if (lenArr === 0) {
		retPage.push([
			{ text: 'No records entered', style: ['tableDetail'], colSpan: '2' },
			{},
		]);
	} else {
		if (!allRecs) {
			startArr = ctx.record_number - 1;
			endArr = startArr + 1;
		}

		// Display records
		for (let curRec = startArr; curRec < endArr; curRec++) {
			// Check to see if there are multiple records, if so do a page break, if not first record
			if (allRecs && curRec > 0) {
				retPage.push([
					{ text: '', pageBreak: 'before', colSpan: '2', },
					{},
				]);
			}

			// Display the record number
			retPage.push([
				{ text: `Record #${curRec + 1}`.toUpperCase(), style: ['subHeader'], colSpan: '2', },
				{},
			]);

			// Loop thru the metadata
			body = new Array();
			let new_content = [];
			let new_context = {
				...ctx,
				data: ctx.data[curRec],
				content: new_content,
				record_number: (typeof ctx.current_record === 'undefined') ? curRec + 1 : ctx.record_number,
			};
			body = print_pdf_render_content(new_context);
			// body = body.slice(0, 50);
			// console.log('body: ', body);

			// Show the table
			retPage.push(
				{
					layout: {
						defaultBorder: false,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					id: 'birth_certificate_infant_fetal_section',
					width: 'auto',
					table: {
						headerRows: 0,
						widths: [250, 'auto'],
						body: body,
					},
				},
			);
		}
	}

	return retPage;
}

// Build autopsy_report
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function autopsy_report(ctx, pg_break) {
	let body = [];
	let retPage = [];

	console.log('p: ', ctx.metadata);
	console.log('d: ', ctx.data);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	console.log('autopsy_report ctx: ', ctx);

	// Loop thru the metadata for autopsy_report
	body = print_pdf_render_content(ctx);
	console.log('body: ', body);

	// Show the table
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			id: 'birth_fetal_death_certificate_parent',
			width: 'auto',
			table: {
				headerRows: 0,
				widths: [250, 'auto'],
				body: body,
			},
		},
	]);

	return retPage;
}

// Build prenatal record 
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function prenatal(ctx, pg_break) {
	let body = [];
	let retPage = [];

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	let new_ctx = {
		...ctx,
		chartArr: chartArrTemplatePrenatal,
	};

	console.log('prenatal ctx: ', new_ctx);

	// Loop thru the metadata for home_record
	body = print_pdf_render_content(new_ctx);
	console.log('body: ', body);

	// Show the table
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			id: 'prenatal',
			width: 'auto',
			table: {
				headerRows: 0,
				widths: [250, 'auto'],
				body: body,
			},
		},
	]);

	return retPage;
}

// Build er_visit_and_hospital_medical_records record
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function er_visit_and_hospital_medical_records(ctx, pg_break) {
	// Global fields
	let body = [];
	let retPage = [];
	let allRecs = (typeof ctx.record_number === 'undefined' || pg_break) ? true : false;
	let lenArr = ctx.data.length;
	let startArr = 0;
	let endArr = lenArr;

	console.log('er_visit_and_hospital_medical_records ctx: ', ctx);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	console.log('prenatal ctx: ', ctx);

	// Are there any records?
	if (lenArr === 0) {
		retPage.push([
			{ text: 'No records entered', style: ['tableDetail'], colSpan: '2' },
			{},
		]);
	} else {
		if (!allRecs) {
			startArr = ctx.record_number - 1;
			endArr = startArr + 1;
		}

		// Display records
		for (let curRec = startArr; curRec < endArr; curRec++) {
			// Check to see if there are multiple records, if so do a page break, if not first record
			if (allRecs && curRec > 0) {
				retPage.push([
					{ text: '', pageBreak: 'before', colSpan: '2', },
					{},
				]);
			}

			// Display the record number
			retPage.push([
				{ text: `Record #${curRec + 1}`.toUpperCase(), style: ['subHeader'], colSpan: '2', },
				{},
			]);

			// Loop thru the metadata
			body = new Array();
			let new_content = [];
			let new_context = {
				...ctx,
				data: ctx.data[curRec],
				content: new_content,
				chartArr: chartArrTemplateER,
				record_number: (typeof ctx.current_record === 'undefined') ? curRec + 1 : ctx.record_number,
			};
			body = print_pdf_render_content(new_context);
			console.log('*** body full: ', body);
			// body = body.slice(0, 45);
			// console.log('*** body slice: ', body);

			// Show the table
			retPage.push(
				{
					layout: {
						defaultBorder: false,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					id: 'er_visit_and_hospital_medical_records',
					width: 'auto',
					table: {
						headerRows: 0,
						widths: [250, 'auto'],
						body: body,
					},
				},
			);
		}
	}

	return retPage;
}

// Build other_medical_office_visits record
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function other_medical_office_visits(ctx, pg_break) {
	// Global fields
	let body = [];
	let retPage = [];
	let allRecs = (typeof ctx.record_number === 'undefined' || pg_break) ? true : false;
	let lenArr = ctx.data.length;
	let startArr = 0;
	let endArr = lenArr;

	console.log('other_medical_office_visits ctx: ', ctx);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Are there any records?
	if (lenArr === 0) {
		retPage.push([
			{ text: 'No records entered', style: ['tableDetail'], colSpan: '2' },
			{},
		]);
	} else {
		if (!allRecs) {
			startArr = ctx.record_number - 1;
			endArr = startArr + 1;
		}

		// Display records
		for (let curRec = startArr; curRec < endArr; curRec++) {
			// Check to see if there are multiple records, if so do a page break, if not first record
			if (allRecs && curRec > 0) {
				retPage.push([
					{ text: '', pageBreak: 'before', colSpan: '2', },
					{},
				]);
			}

			// Display the record number
			retPage.push([
				{ text: `Record #${curRec + 1}`.toUpperCase(), style: ['subHeader'], colSpan: '2', },
				{},
			]);

			// Loop thru the metadata
			body = new Array();
			let new_content = [];
			let new_context = {
				...ctx,
				data: ctx.data[curRec],
				content: new_content,
				record_number: (typeof ctx.current_record === 'undefined') ? curRec + 1 : ctx.record_number,
			};
			body = print_pdf_render_content(new_context);
			console.log('*** body full: ', body);
			// body = body.slice(0, 45);
			// console.log('*** body slice: ', body);

			// Show the table
			retPage.push(
				{
					layout: {
						defaultBorder: false,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					id: 'other_medical_office_visits',
					width: 'auto',
					table: {
						headerRows: 0,
						widths: [250, 'auto'],
						body: body,
					},
				},
			);
		}
	}

	return retPage;
}

// Build medical_transport record
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function medical_transport(ctx, pg_break) {
	// Global fields
	let body = [];
	let retPage = [];
	let allRecs = (typeof ctx.record_number === 'undefined' || pg_break) ? true : false;
	let lenArr = ctx.data.length;
	let startArr = 0;
	let endArr = lenArr;

	console.log('other_medical_office_visits ctx: ', ctx);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Are there any records?
	if (lenArr === 0) {
		retPage.push([
			{ text: 'No records entered', style: ['tableDetail'], colSpan: '2' },
			{},
		]);
	} else {
		if (!allRecs) {
			startArr = ctx.record_number - 1;
			endArr = startArr + 1;
		}

		// Display records
		for (let curRec = startArr; curRec < endArr; curRec++) {
			// Check to see if there are multiple records, if so do a page break, if not first record
			if (allRecs && curRec > 0) {
				retPage.push([
					{ text: '', pageBreak: 'before', colSpan: '2', },
					{},
				]);
			}

			// Display the record number
			retPage.push([
				{ text: `Record #${curRec + 1}`.toUpperCase(), style: ['subHeader'], colSpan: '2', },
				{},
			]);

			// Loop thru the metadata
			body = new Array();
			let new_content = [];
			let new_context = {
				...ctx,
				data: ctx.data[curRec],
				content: new_content,
				record_number: (typeof ctx.current_record === 'undefined') ? curRec + 1 : ctx.record_number,
			};
			body = print_pdf_render_content(new_context);
			console.log('*** body full: ', body);
			// body = body.slice(0, 45);
			// console.log('*** body slice: ', body);

			// Show the table
			retPage.push(
				{
					layout: {
						defaultBorder: false,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					id: 'other_medical_office_visits',
					width: 'auto',
					table: {
						headerRows: 0,
						widths: [250, 'auto'],
						body: body,
					},
				},
			);
		}
	}

	return retPage;
}

// Build social_and_environmental_profile record 
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function social_and_environmental_profile(ctx, pg_break) {
	let body = [];
	let retPage = [];

	console.log('p: ', ctx.metadata);
	console.log('d: ', ctx.data);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	console.log('social_and_environmental_profile ctx: ', ctx);

	// Loop thru the metadata for autopsy_report
	body = print_pdf_render_content(ctx);
	console.log('body: ', body);
	// body = body.slice(0, 20);
	// console.log('body: ', body);

	// Show the table
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			id: 'social_and_environmental_profile',
			width: 'auto',
			table: {
				headerRows: 0,
				widths: [250, 'auto'],
				body: body,
			},
		},
	]);

	return retPage;
}

// Build mental_health_profile record 
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function mental_health_profile(ctx, pg_break) {
	let body = [];
	let retPage = [];

	console.log('p: ', ctx.metadata);
	console.log('d: ', ctx.data);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	console.log('mental_health_profile ctx: ', ctx);

	// Loop thru the metadata for autopsy_report
	body = print_pdf_render_content(ctx);
	console.log('body: ', body);
	// body = body.slice(0, 20);
	// console.log('body: ', body);

	// Show the table
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			id: 'mental_health_profile',
			width: 'auto',
			table: {
				headerRows: 0,
				widths: [250, 'auto'],
				body: body,
			},
		},
	]);

	return retPage;
}

// Build informant_interviews record
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function informant_interviews(ctx, pg_break) {
	// Global fields
	let body = [];
	let retPage = [];
	let allRecs = (typeof ctx.record_number === 'undefined' || pg_break) ? true : false;
	let lenArr = ctx.data.length;
	let startArr = 0;
	let endArr = lenArr;

	console.log('informant_interviews ctx: ', ctx);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Are there any records?
	if (lenArr === 0) {
		retPage.push([
			{ text: 'No records entered', style: ['tableDetail'], colSpan: '2' },
			{},
		]);
	} else {
		if (!allRecs) {
			startArr = ctx.record_number - 1;
			endArr = startArr + 1;
		}

		// Display records
		for (let curRec = startArr; curRec < endArr; curRec++) {
			// Check to see if there are multiple records, if so do a page break, if not first record
			if (allRecs && curRec > 0) {
				retPage.push([
					{ text: '', pageBreak: 'before', colSpan: '2', },
					{},
				]);
			}

			// Display the record number
			retPage.push([
				{ text: `Record #${curRec + 1}`.toUpperCase(), style: ['subHeader'], colSpan: '2', },
				{},
			]);

			// Loop thru the metadata
			body = new Array();
			let new_content = [];
			let new_context = {
				...ctx,
				data: ctx.data[curRec],
				content: new_content,
				record_number: (typeof ctx.current_record === 'undefined') ? curRec + 1 : ctx.record_number,
			};
			body = print_pdf_render_content(new_context);
			console.log('*** body full: ', body);
			// body = body.slice(0, 10);
			// console.log('*** body partial: ', body);

			// Show the table
			retPage.push(
				{
					layout: {
						defaultBorder: false,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					id: 'informant_interviews',
					width: 'auto',
					table: {
						headerRows: 0,
						widths: [250, 'auto'],
						body: body,
					},
				},
			);
		}
	}

	// console.log('************** retPage: ', retPage);

	return retPage;
}

// Build case_narrative
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function case_narrative(ctx, pg_break) {
	let body = [];
	let retPage = [];

	console.log('p: ', ctx.metadata);
	console.log('d: ', ctx.data);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	console.log('case_narrative ctx: ', ctx);

	// Loop thru the metadata for autopsy_report
	body = print_pdf_render_content(ctx);
	console.log('body: ', body);
	// body = body.slice(0, 20);
	// console.log('body: ', body);

	// Show the table
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			id: 'case_narrative',
			width: 'auto',
			table: {
				headerRows: 0,
				widths: [250, 'auto'],
				body: body,
			},
		},
	]);

	return retPage;
}

// Build committee_review record
//	ctx: contains the following fields:
//		content[]
//		data
//		metadata
//		lookup
//		mmria_path
//		record_number
//		section_name
//		is_grid_item
//		gridLevel
//	pg_break: a flag to see if a page break is needed before doing the report
//

async function committee_review(ctx, pg_break) {
	let body = [];
	let retPage = [];

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: ctx.metadata.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	console.log('committee_review ctx: ', ctx);

	// Loop thru the metadata for autopsy_report
	body = print_pdf_render_content(ctx);
	console.log('body: ', body);
	// body = body.slice(0, 20);
	// console.log('body: ', body);

	// Show the table
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			id: 'committee_review',
			width: 'auto',
			table: {
				headerRows: 0,
				widths: [250, 'auto'],
				body: body,
			},
		},
	]);

	return retPage;
}

function convert_html_to_pdf(p_value) {
	//{ text: d.case_opening_overview, style: ['tableDetail'], },		// TODO: htmlToPdfmake needs to be added when Word data cleaned up
	let result = [];
	let CommentRegex = /<!--\[[^>]+>/gi;

	let node = document.createElement("body");
	node.innerHTML = p_value.replace(CommentRegex, "");

	ConvertHTMLDOMWalker(result, node);

	return result;

}


function convert_attribute_to_pdf(p_node, p_result) {
	//{ text: d.case_opening_overview, style: ['tableDetail'], },		// TODO: htmlToPdfmake needs to be added when Word data cleaned up
	let result = {};

	if (p_result != null) {
		result = p_result;
	}
	/*
	font: string: name of the font
	fontSize: number: size of the font in pt
	fontFeatures: string[]: array of advanced typographic features supported in TTF fonts (supported features depend on font file)
	lineHeight: number: the line height (default: 1)
	bold: boolean: whether to use bold text (default: false)
	italics: boolean: whether to use italic text (default: false)
	alignment: string: (‘left’ or ‘center’ or ‘right’ or ‘justify’) the alignment of the text
	characterSpacing: number: size of the letter spacing in pt
	color: string: the color of the text (color name e.g., ‘blue’ or hexadecimal color e.g., ‘#ff5500’)
	background: string the background color of the text
	markerColor: string: the color of the bullets in a buletted list
	decoration: string: the text decoration to apply (‘underline’ or ‘lineThrough’ or ‘overline’)
	decorationStyle: string: the style of the text decoration (‘dashed’ or ‘dotted’ or ‘double’ or ‘wavy’)
	decorationColor: string: the color of the text decoration, see color
	
	text-align: right;
	font-size: 18px; 
	color: rgb(255, 0, 0); 
	background-color: rgb(0, 255, 0);
	*/


	if (p_node.attributes != null) {


		for (let i = 0; i < p_node.attributes.length; i++) {
			let attr = p_node.attributes[i];

			if (attr.name == "style") {
				let style_array = attr.value.split(';');
				for (let style_index = 0; style_index < style_array.length; style_index++) {
					let kvp = style_array[style_index].split(":");
					switch (kvp[0].trim()) {
						case "text-align":
							result['alignment'] = kvp[1].trim();
							break;
						case "font-size":
							result['fontSize'] = kvp[1].trim().replace("px", "").replace("pt", "").replace("rem", "");
							break;
							//case "bold": 
							//    result['bold']  = kvp[1];
							break;
						case "color":
							result['color'] = `${rgb_to_hex(kvp[1].trim())}`;
							break;
						case "background-color":
							result['background'] = `${rgb_to_hex(kvp[1].trim())}`;
							break;
						default:
							// console.log(`missing style: ${attr.name} = ${attr.value}`);
							break;
					}
				}

				break;
			}
		}
	}


	return result;

}

function rgb_to_hex(p_value) {
	if (p_value.split("(").length < 2) {
		return p_value;
	}
	let a = p_value.split("(")[1].split(")")[0];
	a = a.split(",");
	let b = a.map(function (x) {             //For each array element
		x = parseInt(x).toString(16);      //Convert to a base16 string
		return (x.length == 1) ? "0" + x : x;  //Add zero if we get only one character
	})

	return "#" + b.join("");
}


function GetTableHeader(p_result, p_node) {
	//if(p_result.length > 0) return;

	switch (p_node.nodeName.toUpperCase()) {
		case "TH":
			p_result.push(p_node.textContent.trim());
			break;
		case "TR":
		default:
			for (let i = 0; i < p_node.childNodes.length; i++) {
				let child = p_node.childNodes[i];

				GetTableHeader(p_result, child);
			}
			break;

	}
}

function GetTableDetailRow(p_result, p_node) {
	//if(p_result.length > 0) return;

	switch (p_node.nodeName.toUpperCase()) {
		case "TD":
			p_result.push(p_node.textContent.trim());
			break;
		default:
			for (let i = 0; i < p_node.childNodes.length; i++) {
				let child = p_node.childNodes[i];

				GetTableDetailRow(p_result, child);
			}
			break;

	}
}

function ConvertHTMLDOMWalker(p_result, p_node) {
	//let crlf_regex = /\n/g;

	switch (p_node.nodeName.toUpperCase()) {
		case "TABLE":


			let header = [];
			let widths = [];
			let number_of_header_rows = 2;


			for (let i = 0; i < 1; i++) {
				let child = p_node.childNodes[i];

				GetTableHeader(header, child);
			}

			let body = [];

			body.push(header);

			let tbody = null;
			//let tbody_index = 0;
			for (let i = 0; i < p_node.childNodes.length; i++) {
				if (p_node.childNodes[i].nodeName.toUpperCase() == "TBODY") {
					tbody = p_node.childNodes[i];
					//tbody_index = i;
					break;
				}
			}

			if (tbody != null) {
				for (let i = 0; i < tbody.childNodes.length; i++) {
					let child = tbody.childNodes[i];
					let detail_row = [];
					GetTableDetailRow(detail_row, child);

					if (detail_row.length > 0) {
						if (widths.length == 0) {
							if (header.length > 0) {

								header = detail_row;

								number_of_header_rows = 1;

								for (let col_count = 0; col_count < detail_row.length; col_count++) {
									widths.push("auto");
								}
							}
							else {
								for (let col_count = 0; col_count < detail_row.length; col_count++) {
									widths.push("auto");
								}

								while (header.length < widths.length) {
									header.push("");
								}

								body.push(detail_row);
							}
						}
						else {
							body.push(detail_row);
						}

					}
				}
			}

			if (header.length != widths.length && header.length != max_detail) {
				console.log("here");
			}

			let table = {
				layout: 'lightHorizontalLines', // optional
				table: {
					headerRows: number_of_header_rows,
					widths: widths,

					body: body
				}
			};

			p_result.push(table);
			return;
			break;
		case "#TEXT":
			p_result.push({ text: p_node.textContent.trim().replace("<br>", "\n") });
			return;
			break;
		case "P":
		case "DIV":
			let text_array = [];
			for (let i = 0; i < p_node.childNodes.length; i++) {
				let child = p_node.childNodes[i];

				ConvertHTMLDOMWalker(text_array, child);
			}
			text_array.push({ text: "\n" });
			p_result.push({ text: text_array });
			return;
			break;
		case "SPAN":
			p_result.push({ text: p_node.textContent.trim(), style: convert_attribute_to_pdf(p_node, {}) });
			return;
			break;
		case "STRONG":
			let strong_attr = { bold: true };
			p_result.push({ text: p_node.textContent.trim(), style: convert_attribute_to_pdf(p_node, strong_attr) });
			return;
			break;
		case "BR":
			p_result.push({ text: "\n" });
			return;
			break;
		case "EM":
			let em_attr = { italics: true };
			p_result.push({ text: p_node.textContent.trim(), style: convert_attribute_to_pdf(p_node, em_attr) });
			return;
			break;
		case "UL":
			let ul_array = [];
			for (let i = 0; i < p_node.childNodes.length; i++) {
				let child = p_node.childNodes[i];

				ConvertHTMLDOMWalker(ul_array, child);
			}
			p_result.push({ ul: ul_array });
			return;
			break;

		case "OL":
			let ol_array = [];
			for (let i = 0; i < p_node.childNodes.length; i++) {
				let child = p_node.childNodes[i];

				ConvertHTMLDOMWalker(ol_array, child);
			}
			p_result.push({ ol: ol_array });
			return;
			break;
		case "LI":
			let li_node = { text: p_node.textContent.trim() }
			p_result.push(convert_attribute_to_pdf(p_node, li_node));
			return;
			break;

	}


	for (let i = 0; i < p_node.childNodes.length; i++) {
		let child = p_node.childNodes[i];

		ConvertHTMLDOMWalker(p_result, child);
	}


}

// Core Summary - display all of the core summary fields
async function core_summary() {
	let body = [];
	// let arrMap = getArrayMap();

	// Record Core Fields
	let retPage = [];

	// let arrIndex = arrMap.findIndex((s) => s.name === 'home_record');
	body = core_pdf_summary(g_md, g_d, '/', false, '');

	// Show the table
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 0,
				widths: [250, '*'],
				body: body,
			},
		},
	]);

	return retPage;
}

function core_pdf_summary(p_metadata, p_data, p_path, p_is_core_summary, p_metadata_path) {
	let is_core_summary = false;

	if (p_is_core_summary) {
		is_core_summary = true;
	}

	let result = [];
	switch (p_metadata.type.toLowerCase()) {
		case 'group':
			if (g_metadata_summary[p_metadata_path].is_core_summary > 0 ||
				p_metadata.is_core_summary && p_metadata.is_core_summary == true) {
				result.push([
					{
						text: `${p_metadata.prompt}: `,
						style: ['subHeader', 'isUnderLine'],
						colspan: '2',
						margin: [5, 0, 0, 0],
					},
					{},
				]);
				if (p_metadata.is_core_summary || p_metadata.is_core_summary == true) {
					is_core_summary = true;
				}

				if (p_metadata.children) {
					for (let i = 0; i < p_metadata.children.length; i++) {
						let child = p_metadata.children[i];
						if (p_data[child.name] != null)
							Array.prototype.push.apply(result, core_pdf_summary(child, p_data[child.name], p_path + "." + child.name, is_core_summary, p_metadata_path + ".children[" + i + "]"));
					}
				}
			}
			break;
		case 'form':
			if (
				g_metadata_summary[p_metadata_path].is_core_summary > 0 &&
				(
					p_metadata.cardinality == "+" || p_metadata.cardinality == "*"
				)
			) {
				result.push([
					{
						text: p_metadata.prompt,
						style: ['coreHeader'],
						colSpan: '2',
						margin: [0, 5, 0, 0],
					},
					{},
				]);
				for (let form_index = 0; form_index < p_data.length; form_index++) {
					let form_item = p_data[form_index];
					result.push([
						{ text: `Record: ${form_index + 1}`.toUpperCase(), style: ['tableLabel'], colSpan: '2', },
						{},
					]);
					if (p_metadata.children) {
						for (let i = 0; i < p_metadata.children.length; i++) {
							let child = p_metadata.children[i];
							if (form_item[child.name] != null)
								Array.prototype.push.apply(result, core_pdf_summary(child, form_item[child.name], p_path + "." + child.name, is_core_summary, p_metadata_path + ".children[" + i + "]"));
						}
					}
				}
			}
			else if (g_metadata_summary[p_metadata_path].is_core_summary > 0) {
				result.push([
					{ text: `${p_metadata.prompt}: `, style: ['coreHeader'], colSpan: '2', },
					{},
				]);
				if (p_metadata.children) {
					for (let i = 0; i < p_metadata.children.length; i++) {
						let child = p_metadata.children[i];
						if (p_data[child.name] != null)
							Array.prototype.push.apply(result, core_pdf_summary(child, p_data[child.name], p_path + "." + child.name, is_core_summary, p_metadata_path + ".children[" + i + "]"));
					}
				}
			}
			break;
		case "grid":
			let body = [];
			let row;
			let colWidths;
			let colspan = 0;
			if (p_metadata.is_core_summary && p_metadata.is_core_summary == true) {
				// Get the number of columns
				colspan = p_metadata.children.length;
				row = new Array();
				row.push({ text: p_metadata.prompt, style: ['tableLabel', 'blueFill'], colSpan: colspan, },);

				// Add the extra {} for the columns so it doesn't break
				for (let j = 1; j < colspan; j++) {
					row.push({},);
				}
				body.push(row);

				// Add the appropriate number of column widths so it will be at 100% across the page
				colWidths = new Array();
				colWidths.push('auto',);
				for (let j = 1; j < colspan; j++) {
					colWidths.push('*',);
				}

				row = new Array();
				for (let j = 0; j < p_metadata.children.length; j++) {
					let child = p_metadata.children[j];
					row.push({ text: child.prompt, style: ['tableLabel', 'blueFill'], },);
				}
				body.push(row);
				row = new Array();
				for (let i = 0; i < p_data.length; i++) {
					if (p_data[i] != null) {
						for (let j = 0; j < p_metadata.children.length; j++) {
							let child = p_metadata.children[j];
							if (p_data[i][child.name] != null) {
								if (child.type === 'list') {
									let textStr;
									if (child.values.length === 0) {
										textStr = lookupGlobalArr(g_md.lookup, p_data[i][child.name], child.path_reference.substring(child.path_reference.indexOf('/') + 1));
									}
									else {
										textStr = lookupFieldArr(p_data[i][child.name], child.values);
									}
									row.push({ text: textStr, style: ['tableDetail'], },);
								}
								else {
									row.push({ text: p_data[i][child.name], style: ['tableDetail'], },);
								}
							}
							else {
								row.push({ text: '', style: ['tableDetail'], },);
							}
						}
						body.push(row);
						row = new Array();
					}
				}
			}
			else if (g_metadata_summary[p_metadata_path].is_core_summary > 0) {
				for (let j = 0; j < p_metadata.children.length; j++) {
					let child = p_metadata.children[j];
					if (child.is_core_summary && child.is_core_summary == true) {
						colspan = colspan + 1;
					}
				}

				// Add the 1st line of the header
				row = new Array();
				row.push({ text: p_metadata.prompt, style: ['tableLabel', 'blueFill'], colSpan: colspan, },);

				// Add the extra {} for the columns so it doesn't break
				for (let j = 1; j < colspan; j++) {
					row.push({},);
				}
				body.push(row);

				// Add the appropriate number of column widths so it will be at 100% across the page
				colWidths = new Array();
				colWidths.push('auto',);
				for (let j = 1; j < colspan; j++) {
					colWidths.push('*',);
				}

				row = new Array();
				for (let j = 0; j < p_metadata.children.length; j++) {
					let child = p_metadata.children[j];
					if (child.is_core_summary && child.is_core_summary == true) {
						row.push({ text: child.prompt, style: ['tableLabel', 'blueFill'], })
					}
				}
				body.push(row);
				row = new Array();
				for (let i = 0; i < p_data.length; i++) {
					if (p_data[i] != null) {
						for (let j = 0; j < p_metadata.children.length; j++) {
							let child = p_metadata.children[j];
							if (child.is_core_summary && child.is_core_summary == true) {
								if (p_data[i][child.name] != null) {
									if (child.type === 'list') {
										let textStr;
										if (child.values.length === 0) {
											textStr = lookupGlobalArr(g_md.lookup, p_data[i][child.name], child.path_reference.substring(child.path_reference.indexOf('/') + 1));
										}
										else {
											textStr = lookupFieldArr(p_data[i][child.name], child.values);
										}
										row.push({ text: textStr, style: ['tableDetail'], },);
									}
									else {
										row.push({ text: p_data[i][child.name], style: ['tableDetail'], },);
									}
								}
								else {
									row.push({ text: '', style: ['tableDetail'], },);
								}
							}
						}
						body.push(row);
						row = new Array();
					}
				}
			}
			// Display the grid table
			if (body.length > 0) {
				result.push([
					{
						table: {
							widths: colWidths,
							headerRows: 2,
							body: body
						},
						colSpan: '2',
					},
					{},
				]);
			}
			break;
		case 'app':
			if (
				(p_metadata.is_core_summary || p_metadata.is_core_summary == true) ||
				is_core_summary == true
			) {
				result.push([
					{ text: `${p_metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
					{ text: p_data[p_metadata.name], style: ['tableDetail'], },
				]);
			}

			if (p_metadata.children) {
				for (let i = 0; i < p_metadata.children.length; i++) {
					let child = p_metadata.children[i];
					if (child.type.toLowerCase() == "form" && p_data[child.name] != null)
						Array.prototype.push.apply(result, core_pdf_summary(child, p_data[child.name], p_path + "." + child.name, is_core_summary, "g_metadata.children[" + i + "]"));
				}
			}
			break;
		case 'list':
			if (
				(p_metadata.is_core_summary || p_metadata.is_core_summary == true) ||
				is_core_summary == true
			) {

				let data_value_list = p_metadata.values;
				let list_lookup = {};

				if (p_metadata.path_reference && p_metadata.path_reference != "") {
					data_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));

					if (data_value_list == null) {
						data_value_list = p_metadata.values;
					}
				}

				for (let list_index = 0; list_index < data_value_list.length; list_index++) {
					let list_item = data_value_list[list_index];
					list_lookup[list_item.value] = list_item.display;
				}

				if (Array.isArray(p_data)) {
					let choiceList = '';
					for (let i = 0; i < p_data.length; i++) {
						if
							(
							(p_data[i] == 9999 || p_data[i] == "9999") &&
							p_data.length > 1
						) {
							continue;
						}
						choiceList += `${list_lookup[p_data[i]]}, `;
					}
					if (choiceList.length > 0) {
						choiceList = choiceList.slice(0, -2);
					}
					result.push([
						{ text: `${p_metadata.prompt}: `, style: ['tableLabel'], alignment: 'right' },
						{ text: `${choiceList}`, style: ['tableDetail'], },
					]);
				}
				else {
					result.push([
						{ text: `${p_metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: list_lookup[p_data], style: ['tableDetail'], },
					]);
				}
			}
			break;
		default:
			if (
				(p_metadata.is_core_summary || p_metadata.is_core_summary == true) ||
				is_core_summary == true
			) {
				result.push([
					{ text: `${p_metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
					{ text: p_data, style: ['tableDetail'], },
				]);
			}

			if (p_metadata.children) {
				for (let i = 0; i < p_metadata.children.length; i++) {
					let child = p_metadata.children[i];
					if (p_data[child.name] != null)
						Array.prototype.push.apply(result, core_pdf_summary(child, p_data[child.name], p_path + "." + child.name, is_core_summary));
				}
			}
			break;
	}

	return result;
}

function convert_dictionary_path_to_lookup_object(p_path) {
	//g_data.prenatal.routine_monitoring.systolic_bp
	let result = null;
	let temp_result = []
	let temp = "g_metadata." + p_path.replace(new RegExp('/', 'gm'), ".").replace(new RegExp('\\.(\\d+)\\.', 'gm'), "[$1].").replace(new RegExp('\\.(\\d+)$', 'g'), "[$1]");
	let index = temp.lastIndexOf('.');
	temp_result.push(temp.substr(0, index));
	temp_result.push(temp.substr(index + 1, temp.length - (index + 1)));

	let lookup_list = eval(temp_result[0]);

	for (let i = 0; i < lookup_list.length; i++) {
		if (lookup_list[i].name == temp_result[1]) {
			result = lookup_list[i].values;
			break;
		}
	}

	return result;
}


// Recursive function to traverse the metadata
function print_pdf_render_content(ctx) {
	// Find the correct type
	console.log('in print_pdf_render_content');
	console.log('ctx: ', ctx);
	switch (ctx.metadata.type.toLowerCase()) {
		case "app":
			console.log('in APP');
			break;
		case "form":
			console.log('*** in FORM: ', ctx.metadata.prompt);
			if (ctx.metadata.cardinality === "1" || ctx.metadata.cardinality === "?") {
				ctx.metadata.children.forEach((child, index) => {
					if ((ctx.data && ctx.data[child.name]) || child.type == 'chart') {
						let new_content = [];
						let new_context = {
							...ctx,
							metadata: child,
							data: ctx.data[child.name],
							mmria_path: ctx.mmria_path + "/" + child.name,
							content: new_content,
						};
						let ret = print_pdf_render_content(new_context);
						ctx.content.push(...ret);
					}
				});
			}
			else // multiform 
			{
				console.log('** Start MULTIFORM **: ');
				ctx.metadata.children.forEach((child, index) => {
					if ((ctx.data && ctx.data[child.name]) || child.type == 'chart') {
						let new_content = [];
						let new_context = {
							...ctx,
							metadata: child,
							data: ctx.data[child.name],
							mmria_path: ctx.mmria_path + "/" + child.name,
							content: new_content,
						};
						let ret = print_pdf_render_content(new_context);
						ctx.content.push(...ret);
					}
				});
			}
			break;
		case "group":
			console.log('*** in GROUP', ctx.metadata.prompt);
			// ****************************************************************
			// *** The 1st if statement will see if the group has 3 children 
			// *** and they are month, day and year
			// ***
			// *** The 2nd if statement will check to see if there are more
			// *** than 3 children and if the first 3 are month, day and year.
			// *** It will then do the date and any other fields that are there.
			// *** 
			// *** The last else statement will just process thru the children
			// *** 
			// ****************************************************************
			if (ctx.metadata.children.length === 3
				&& ctx.metadata.children[0].name === 'month'
				&& ctx.metadata.children[1].name === 'day'
				&& ctx.metadata.children[2].name === 'year'
			) {
				ctx.content.push([
					{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
					{ text: fmtDateByFields(ctx.data), style: ['tableDetail'], },
				]);
			} else if (ctx.metadata.children.length > 3
				&& ctx.metadata.children[0].name === 'month'
				&& ctx.metadata.children[1].name === 'day'
				&& ctx.metadata.children[2].name === 'year'
			) {
				ctx.content.push([
					{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
					{ text: fmtDateByFields(ctx.data), style: ['tableDetail'], },
				]);
				for (let i = 3; i < ctx.metadata.children.length; i++) {
					let child = ctx.metadata.children[i];
					if (ctx.data) {
						let new_content = [];
						let new_context = {
							...ctx,
							metadata: child,
							data: ctx.data[child.name],
							mmria_path: ctx.mmria_path + "/" + child.name,
							content: new_content,
							groupLevel: ctx.groupLevel + 1,
						};
						let ret = print_pdf_render_content(new_context);
						if (ret.length > 0) {
							ctx.content.push(...ret);
						}
					}
				}
			} else {
				// See if the record was imported by CDC Automated Vitals
				// 	If the automated_vitals_group child is NOT the automated user
				//	Then skip it
				let showIt = true;
				if (ctx.metadata.name === 'automated_vitals_group' ||
					ctx.metadata.name === 'vitals_import_group') {
					showIt = ctx.createdBy === 'vitals-import' ? true : false;
				}
				if (showIt) {
					console.log('****************************** groupLevel: ', ctx.groupLevel);
					if (ctx.groupLevel === 0) {
						ctx.content.push([
							{ text: ctx.metadata.prompt, style: ['subHeader'], colSpan: '2', },
							{},
						]);
					}
					ctx.metadata.children.forEach((child, index) => {
						if (ctx.data && showIt) {
							let new_content = [];
							let new_context = {
								...ctx,
								metadata: child,
								data: ctx.data[child.name],
								mmria_path: ctx.mmria_path + "/" + child.name,
								content: new_content,
								groupLevel: ctx.groupLevel + 1,
							};
							let ret = print_pdf_render_content(new_context);
							if (ret.length > 0) {
								ctx.content.push(...ret);
								console.log('****** group 2 ctx: ', ret);
							}
						}
					});
				}
			}
			break;
		case "grid":
			console.log('*** in GRID', ctx.metadata.prompt);
			let gridBody = [];
			let row;
			let colWidths;
			let colspan = 0;

			// Get the number of columns in the grid 
			colspan = ctx.metadata.children.length;

			// If grid is over a certain size, then do something different
			if (ctx.metadata.name === 'transport_vital_signs' ||
				ctx.metadata.name === 'vital_signs' ||
				ctx.metadata.name === 'laboratory_tests' ||
				ctx.metadata.name === 'routine_monitoring'
			) {
				colWidths = new Array();
				colWidths = [30, 100, 200, '*'];
				row = new Array();
				row.push(
					{ text: ctx.metadata.prompt, style: ['gridHeader', 'blueFill'], colSpan: '4', },
					{}, {}, {});
				gridBody.push(row);
				row = new Array();
				row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
				row.push({ text: 'Date', style: ['tableLabel', 'blueFill'], },);
				row.push({ text: 'Medical Information', style: ['tableLabel', 'blueFill'], },);
				row.push({ text: 'Comment(s)', style: ['tableLabel', 'blueFill'], },);
				gridBody.push(row);

				// Are there any records?
				if (ctx.data.length === 0) {
					row = new Array();
					row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', },
						{}, {}, {});
					gridBody.push(row);
				} else {
					// Build the table detail
					let metaChild = ctx.metadata.children;
					ctx.data.forEach((dataChild, dataIndex) => {
						row = new Array();
						row.push({ text: `${dataIndex + 1}`, style: ['tableDetail'], alignment: 'center', },);
						row.push({ text: fmtDateTime(dataChild[metaChild[0].name]), style: ['tableDetail'], },);
						// Create a two column table for the Medical Info column - exclude the first (datetime) and last (comments)  
						let colPrompt = new Array();
						let colData = new Array();
						for (let i = 1; i < metaChild.length - 1; i++) {
							console.log('************ &&&&&&&&&&&&&&&&& ==============: ', metaChild[i].type);
							switch (metaChild[i].type.toLowerCase()) {
								case 'list':
									colPrompt.push({ text: `${metaChild[i].prompt}: `, style: ['tableLabel'], alignment: 'right', },);
									colData.push({ text: getLookupField(ctx.lookup, dataChild[metaChild[i].name], metaChild[i]), style: ['tableDetail'], },);
									break;
								case 'string':
								case 'number':
								case 'time':
								case 'hidden':
									colPrompt.push({ text: `${metaChild[i].prompt}: `, style: ['tableLabel'], alignment: 'right', },);
									colData.push({ text: chkNull(dataChild[metaChild[i].name]), style: ['tableDetail'], },);
									break;
								default:
									colPrompt.push({ text: `${metaChild[i].prompt}: `, style: ['tableLabel'], alignment: 'right', },);
									colData.push({ text: ' DEFAULT', style: ['tableDetail'], },);
									break;
							}
						}

						// Put it into a table
						row.push({ columns: [colPrompt, colData], },);
						row.push({ text: chkNull(dataChild[metaChild[metaChild.length - 1].name]), style: ['tableDetail'], },);
						gridBody.push(row)
						if (colPrompt.length > 0) {
							let idx;
							switch (ctx.metadata.name) {
								case 'routine_monitoring':
									// Blood Pressure Chart
									ctx.chartArr.bloodPressure.chartLabels.unshift(row[1].text);
									idx = colPrompt.findIndex((s) => s.text === 'Systolic BP: ');
									ctx.chartArr.bloodPressure.chartData[0].unshift((idx === -1) ? 0 : +colData[idx].text);
									idx = colPrompt.findIndex((s) => s.text === 'Diastolic BP: ');
									ctx.chartArr.bloodPressure.chartData[1].unshift((idx === -1) ? 0 : +colData[idx].text);
									// Hematocrit Chart
									ctx.chartArr.hematocrit.chartLabels.unshift(row[1].text);
									idx = colPrompt.findIndex((s) => s.text === 'Blood Hematocrit (%): ');
									ctx.chartArr.hematocrit.chartData.unshift((idx === -1) ? 0 : +colData[idx].text);
									// Weight Gain Chart
									ctx.chartArr.weightGain.chartLabels.unshift(row[1].text);
									idx = colPrompt.findIndex((s) => s.text === 'Weight (lbs): ');
									ctx.chartArr.weightGain.chartData.unshift((idx === -1) ? 0 : +colData[idx].text);
									break;
								case 'vital_signs':
									if (ctx.section_name === 'er_visit_and_hospital_medical_records') {
										// Temperature Chart
										ctx.chartArr.temperature.chartLabels.unshift(row[1].text);
										idx = colPrompt.findIndex((s) => s.text === 'Temperature: ');
										ctx.chartArr.temperature.chartData.unshift((idx === -1) ? 0 : +colData[idx].text);
										// Heart Rate Chart
										ctx.chartArr.heartRate.chartLabels.unshift(row[1].text);
										idx = colPrompt.findIndex((s) => s.text === 'Heart Rate: ');
										ctx.chartArr.heartRate.chartData.unshift((idx === -1) ? 0 : +colData[idx].text);
										// Respiration Chart
										ctx.chartArr.respiration.chartLabels.unshift(row[1].text);
										idx = colPrompt.findIndex((s) => s.text === 'Respiration: ');
										ctx.chartArr.respiration.chartData.unshift((idx === -1) ? 0 : +colData[idx].text);
										// Blood Pressure Chart
										ctx.chartArr.bloodPressure.chartLabels.unshift(row[1].text);
										idx = colPrompt.findIndex((s) => s.text === 'Systolic BP: ');
										ctx.chartArr.bloodPressure.chartData[0].unshift((idx === -1) ? 0 : +colData[idx].text);
										idx = colPrompt.findIndex((s) => s.text === 'Diastolic BP: ');
										ctx.chartArr.bloodPressure.chartData[1].unshift((idx === -1) ? 0 : +colData[idx].text);
									}
									break;
								default:
									console.log('ctx.metadata.name not yet setup: ', ctx.metadata.name);
									break;
							}
							console.log('+++++++++++++++++++++++++ colPrompt: ', colPrompt);
							console.log('+++++++++++++++++++++++++ colData: ', colData);
						}
					});
				}
			} else {
				// Get the number of fields
				colWidths = new Array();
				// The 30 is for the record number and the auto is to make it use the whole width
				colWidths.push(30, 'auto',);
				// Do this to make sure auto is the 1st column width and we bypass it in the count
				let jStart = ctx.metadata.children[0].type === 'label' ? 2 : 1;
				for (let j = jStart; j < colspan; j++) {
					// Only add a column if it is NOT a label
					if (ctx.metadata.children[j].type !== 'label') {
						colWidths.push('*',);
					};
				}

				// Do the header row
				row = new Array();
				row.push({ text: ctx.metadata.prompt, style: ['gridHeader', 'blueFill'], colSpan: `${colWidths.length}`, },);
				// Add the extra {} for the columns so it doesn't break
				for (let j = 1; j < colWidths.length; j++) {
					row.push({},);
				}
				gridBody.push(row);

				row = new Array();
				row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
				ctx.metadata.children.forEach((child, index) => {
					// Only add a column if it is NOT a label
					if (child.type !== 'label') {
						row.push({ text: child.prompt, style: ['tableLabel', 'blueFill'], },);
					}
				});
				gridBody.push(row);

				// Do the detail lines
				row = new Array();
				// Check to see if there are records, if not then tell them so
				if (ctx.data.length === 0) {
					row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: `${colWidths.length}`, },);
					for (let i = 1; i < colWidths.length; i++) {
						row.push({},);
					}
					gridBody.push(row);
				} else {
					// Get the fields for each row
					ctx.data.forEach((dataChild, dataIndex) => {
						// Add the record number
						row.push({ text: `${dataIndex + 1}`, style: ['tableDetail'], alignment: 'center', },);
						// get metadata info for each row
						ctx.metadata.children.forEach((metaChild, metaIndex) => {
							switch (metaChild.type.toLowerCase()) {
								case 'list':
									row.push({ text: getLookupField(ctx.lookup, dataChild[metaChild.name], metaChild), style: ['tableDetail'], },);
									break;
								case 'string':
								case 'number':
								case 'time':
								case 'hidden':
									row.push({ text: chkNull(dataChild[metaChild.name]), style: ['tableDetail'], },);
									break;
								case 'textarea':
									row.push({ text: chkNull(dataChild[metaChild.name]), style: ['tableDetail'], },);
									break;
								case 'date':
									row.push({ text: reformatDate(dataChild[metaChild.name]), style: ['tableDetail'] },);
									break;
								case 'datetime':
									row.push({ text: fmtDateTime(dataChild[metaChild.name]), style: ['tableDetail'] },);
									break;
								default:
									break;
							}
						});
						if (row.length > 0) {
							gridBody.push(row);
						}
						row = new Array();
					});
				}
			}

			// Display the grid table
			if (gridBody.length > 0) {
				ctx.content.push([
					{
						colSpan: '2',
						table: {
							widths: colWidths,
							headerRows: 2,
							body: gridBody,
						},
					}, {},
				]);
				// Add a little space before the next thing
				ctx.content.push([{ text: '', margin: [0, 10, 0, 0], colSpan: '2', }, {},],);
			}
			break;
		case "string":
		case "number":
		case "time":
		case "jurisdiction":
		case "hidden":
			console.log('*** in STRING, NUMBER, TIME, JURISDICTION, HIDDEN', ctx.metadata.prompt);
			ctx.content.push([
				{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
				{ text: chkNull(ctx.data), style: ['tableDetail'], },
			]);
			break;
		case "date":
			console.log('*** in DATE', ctx.metadata.prompt);
			ctx.content.push([
				{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
				{ text: reformatDate(ctx.data), style: ['tableDetail'] },
			]);
			break;
		case "datetime":
			console.log('*** in DATETIME', ctx.metadata.prompt);
			ctx.content.push([
				{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
				{ text: fmtDateTime(ctx.data), style: ['tableDetail'] },
			]);
			break;
		case "list":
			console.log('in LIST', ctx.metadata.prompt);
			// **************************************************************************
			// *** The 1st if will see if is_multiselect exists and set to true
			// ***		Then check to see if  path_reference exist and if it exists
			// ***		then call lookupGlobalMultiChoiceArr else call
			// ***		lookupFieldMultiChoiceArr - both will return a list of
			// ***		display values or just return what is in the field in case
			// ***		there is a problem
			// ***
			// *** The 2nd if will check to see if path_reference exists and then call
			// *** lookupGlobalArr and return the display value
			// ***
			// *** The 3rd if will check to see if the values array has length and then
			// *** call lookupFieldArr and return the display value
			// ***
			// *** Else just return the data value - just in case there is a problem
			// **************************************************************************

			if (ctx.metadata.hasOwnProperty('is_multiselect') && ctx.metadata.is_multiselect === true) {
				// console.log('multiselect is true');
				if (ctx.metadata.hasOwnProperty('path_reference') && ctx.metadata.path_reference.length > 0) {
					// console.log('path_reference is true');
					ctx.content.push([
						{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalMultiChoiceArr(ctx.lookup, ctx.data, ctx.metadata.path_reference), style: ['tableDetail'] },
					]);
				} else if (ctx.metadata.values.length > 0) {
					// console.log('path_reference is false and values length: ', ctx.metadata.values.length);
					ctx.content.push([
						{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldMultiChoiceArr(ctx.data, ctx.metadata.values), style: ['tableDetail'] },
					]);
				} else {
					// console.log('values has 0 length');
					ctx.content.push([
						{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: chkNull(ctx.data), style: ['tableDetail'] },
					]);
				}
			} else if (ctx.metadata.hasOwnProperty('path_reference') && ctx.metadata.path_reference.length > 0) {
				// console.log('multiselect does not exist and path_reference is true');
				ctx.content.push([
					{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
					{ text: lookupGlobalArr(ctx.lookup, ctx.data, ctx.metadata.path_reference), style: ['tableDetail'] },
				]);
			} else if (ctx.metadata.values.length > 0) {
				// console.log('path_reference is false and values length is: ', ctx.metadata.values.length);
				ctx.content.push([
					{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
					{ text: lookupFieldArr(ctx.data, ctx.metadata.values), style: ['tableDetail'] },
				]);
			} else {
				// console.log('default');
				ctx.content.push([
					{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
					{ text: chkNull(ctx.data), style: ['tableDetail'] },
				]);
			}
			break;
		case "textarea":
			console.log('*** in TEXTAREA', ctx);
			if (ctx.metadata.name === 'case_opening_overview') {
				let narrative = convert_html_to_pdf(ctx.data);
				ctx.content.push([
					{ text: narrative, style: ['tableDetail'], colSpan: '2' },
					{},
				]);
			} else {
				ctx.content.push([
					{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
					{ text: chkNull(ctx.data), style: ['tableDetail'] },
				]);
			}
			break;
		case "chart":
			console.log('*** in CHART 1a  ***************************************', ctx.metadata.prompt);
			console.log('*** in CHART 1b  ***************************************', ctx.metadata.name);
			// Add the graph header
			let chartBody = [];
			chartBody.push([
				{
					text: `${ctx.metadata.prompt.substring(0, ctx.metadata.prompt.lastIndexOf(' '))}`,
					style: ['tableLabel'],
					alignment: 'center',
				},
			]);
			// Create data object to send to chart
			switch (ctx.metadata.name) {
				case 'temperature_graph':
					let tData = {
						labels: ctx.chartArr.temperature.chartLabels,
						datasets: [
							{
								label: 'Temperature',
								fill: false,
								backgroundColor: 'rgb(0, 0, 255)',
								borderColor: 'rgb(0, 0, 255)',
								data: ctx.chartArr.temperature.chartData,
							},
						]
					};

					// Add the graph
					let tImg = doChart2('tData', tData);
					chartBody.push([
						{ image: tImg, width: 800, alignment: 'center', }
					],);
					console.log('** Temperature: ', tData);
					break;
				case 'pulse_graph':
					let hrData = {
						labels: ctx.chartArr.heartRate.chartLabels,
						datasets: [
							{
								label: 'Heart Rate',
								fill: false,
								backgroundColor: 'rgb(0, 0, 255)',
								borderColor: 'rgb(0, 0, 255)',
								data: ctx.chartArr.heartRate.chartData,
							},
						]
					};

					// Add the graph
					let hrImg = doChart2('hrData', hrData);
					chartBody.push([
						{ image: hrImg, width: 800, alignment: 'center', }
					],);
					console.log('** Heart Rate: ', hrData);
					break;
				case 'respiration_graph':
					let rData = {
						labels: ctx.chartArr.respiration.chartLabels,
						datasets: [
							{
								label: 'Respiration',
								fill: false,
								backgroundColor: 'rgb(0, 0, 255)',
								borderColor: 'rgb(0, 0, 255)',
								data: ctx.chartArr.respiration.chartData,
							},
						]
					};

					// Add the graph
					let rImg = doChart2('rData', rData);
					chartBody.push([
						{ image: rImg, width: 800, alignment: 'center', }
					],);
					console.log('** Respiration: ', rData);
					break;
				case 'blood_pressure_graph':
					let bpData = {
						labels: ctx.chartArr.bloodPressure.chartLabels,
						datasets: [
							{
								label: 'Systolic',
								fill: false,
								backgroundColor: 'rgb(0, 0, 255)',
								borderColor: 'rgb(0, 0, 255)',
								data: ctx.chartArr.bloodPressure.chartData[0],
							},
							{
								label: 'Diastolic',
								fill: false,
								backgroundColor: 'rgb(255, 0, 0)',
								borderColor: 'rgb(255, 0, 0)',
								data: ctx.chartArr.bloodPressure.chartData[1],
							},
						]
					};

					// Add the graph
					let bpImg = doChart2('bpData', bpData);
					chartBody.push([
						{ image: bpImg, width: 800, alignment: 'center', }
					],);
					console.log('** Blood Pressure: ', bpData);
					break;
				case 'hematocrit_graph':
					let hData = {
						labels: ctx.chartArr.hematocrit.chartLabels,
						datasets: [
							{
								label: 'Hematocrit',
								fill: false,
								backgroundColor: 'rgb(0, 0, 255)',
								borderColor: 'rgb(0, 0, 255)',
								data: ctx.chartArr.bloodPressure.chartData,
							},
						]
					};

					// Add the graph
					let hImg = doChart2('hData', hData);
					chartBody.push([
						{ image: hImg, width: 800, alignment: 'center', }
					],);
					console.log('** Hematocrit: ', hData);
					break;
				case 'weight_gain_graph':
					let wgData = {
						labels: ctx.chartArr.weightGain.chartLabels,
						datasets: [
							{
								label: 'Weight Gain',
								fill: false,
								backgroundColor: 'rgb(0, 0, 255)',
								borderColor: 'rgb(0, 0, 255)',
								data: ctx.chartArr.weightGain.chartData,
							},
						]
					};

					// Add the graph
					let wgImg = doChart2('wgData', wgData);
					chartBody.push([
						{ image: wgImg, width: 800, alignment: 'center', }
					],);
					console.log('** Weight Gain: ', wgData);
					break;
				default:
					break;
			}
			// Now push it to the context
			console.log('chartBody: ', chartBody);
			ctx.content.push([
				{
					layout: {
						defaultBorder: false,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					width: 'auto',
					margin: [0, 10, 0, 0],
					colSpan: '2',
					table: {
						headerRows: 0,
						widths: ['*'],
						body: chartBody,
					},
				},
				{},
			],);
			break;
		case "button":
			break;
		case "label":
			ctx.content.push([
				{ text: `${ctx.metadata.prompt}`, style: ['labelDetail'], alignment: 'center', colSpan: '2', },
				{},
			],);
			break;
		default:
			console.log('*** in DEFAULT', ctx.metadata.prompt);
			ctx.content.push([
				{ text: `${ctx.metadata.prompt}: `, style: ['tableLabel'], alignment: 'right', },
				{ text: chkNull(ctx.data), style: ['tableDetail'] },
			],);
			break;
	}

	return ctx.content;
}