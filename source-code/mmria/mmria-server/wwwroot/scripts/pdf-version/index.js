let g_md = null;
let g_metadata = null; 
let g_d = null;
let g_section_name;
let g_current;
let g_writeText;
let g_metadata_summary = {};
let g_record_number;

$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';

  	//profile.initialize_profile();

	  //load_metadata();
});


//: MMRIA#:<RecordID>/<Form Name
let TitleMap = {
"home_record":"Home",
"death_certificate":"DC",
"birth_fetal_death_certificate_parent":"BCDC-P",
"birth_certificate_infant_fetal_section":"BCDC-I",
"autopsy_report":"Autopsy",
"prenatal":"PreNatal",
"er_visit_and_hospital_medical_records":"ER",
"other_medical_office_visits":"OfficeVisits",
"medical_transport":"Transport",
"social_and_environmental_profile":"SEP",
"mental_health_profile":"MentalHealth",
"informant_interviews":"Interview",
"case_narrative":"Narrative",
"committee_review":"Decision",
"all":"ALL",
"core-summary":"Core",
};

async function create_print_version
(      
    p_metadata,
    p_data,
    p_section,
    p_number,
    p_metadata_summary
)
{

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

    let ctx = { 
        metadata: p_metadata, 
        data: p_data, 
        mmria_path: "",
        content: []
    };
    //initialize_print_pdf(ctx);
    document.title = getHeaderName();
    await print_pdf(p_section);
}

function create_pdf_version(p_ctx) 
{
    let ctx = { metadata: p_ctx.metadata, data: p_ctx.data, content: []};
    render_content(ctx)
}


async function print_pdf(section) 
{
	g_writeText = '';

	// Get unique PDF name
	// let pdfName = createNamePDF();

	// Get the PDF Header Title
	let pdfTitle = getHeaderName();

	// Get report tab name
	let reportTabName = getReportTabName(section);

	// Get the logoUrl for Header
	let logoUrl = await getBase64ImageFromURL("/images/mmria-secondary.png");

	// Create map of name and index of the g_md array children
	let arrMap = getArrayMap();

	// Format the content
	let retContent = await formatContent(g_section_name, arrMap);

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
			if (g_section_name === 'all') {
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
				g_writeText = getSectionTitle(g_section_name);
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
				fontSize: 18,
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
		},
		defaultStyle: {
			fontSize: 12,
		},
		content: retContent,
	};
	// pdfMake.createPdf( doc ).download( pdfName );

	    
    window.setTimeout
    (
        async function(){await pdfMake.createPdf(doc).open(window);}, 
        //async function(){ await pdfMake.createPdf(doc).open();}, 
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
	if (val === '9999') return '  ';
	return ((val < 10) ? '0' : '') + val;
}

// Format the year to always have 4 digits, check for 9999
function fmtYear(val) {
	return (val === '9999') ? '    ' : val;
}

// Reformat date - from YYYY/MM/DD to MM-DD-YYYY
function reformatDate(dt) {
	let date = new Date(dt);
	return (!isNaN(date.getTime())) ? `${fmt2Digits(date.getMonth() + 1)}-${fmt2Digits(date.getDate())}-${fmtYear(date.getFullYear())}` : '';
}

// Format date from data and return mm / dd / yyyy or blank if it contains 9999's
function fmtDataDate(dt) {
	if (dt.year === '9999') {
		return '  /  /  ';
	}
	return `${fmt2Digits(dt.month)} / ${fmt2Digits(dt.day)} / ${fmtYear(dt.year)}`;
}

// Format date by field (day, month, year)
function fmtDateByFields(dt) {
	let mm = dt.month === '9999' ? '  ' : fmt2Digits(dt.month);
	let dd = dt.day === '9999' ? '  ' : fmt2Digits(dt.day);
	let yy = dt.year === '9999' ? '    ' : dt.year;
	return `${mm}/${dd}/${yy}`;
}

// Format date and time string with mm/dd/yyyy hh:mm (military time)
function fmtDateTime(dt) {
	if (dt.length === 0) return '  ';
	let fDate = new Date(dt);
	let hh = fDate.getHours();
	let mn = fDate.getMinutes();
	let strTime = `${fmt2Digits(hh)}:${fmt2Digits(mn)}`
	return `${fmt2Digits(fDate.getMonth())}/${fmt2Digits(fDate.getDate())}/${fmtYear(fDate.getFullYear())} ${strTime}`;
}

// Reformat date from data string and return mm/dd/yyyy 
function fmtStrDate(dt) {
	if (dt.length === 0) {
		return ' / / ';
	}
	let dtParts = dt.split('-');
	return `${fmt2Digits(dtParts[1])}/${fmt2Digits(dtParts[2])}/${fmtYear(dtParts[0])}`;
}

// Get the header name
function getHeaderName() 
{
    //MMRIA#:<RecordID>/<Form Name
	return `MMRIA Record ID#:  ${g_d.home_record.record_id}/${TitleMap[g_section_name]}`;
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
function lookupGlobalArr(val, lookupName) {
	// Make sure val is a string
	let valStr = `${val}`;
	// See if val is blank
	if (valStr === '') return valStr;

	// Find the correct lookup table index
	let lookupIndex = g_md.lookup.findIndex((s) => s.name === lookupName);

	// Return the display value from the lookup array
	let arr = g_md.lookup[lookupIndex].values;
	let idx = arr.findIndex((s) => s.value === valStr);
	idx = (idx === -1) ? 0 : idx;   // This fixes bad data coming in
	return (arr[idx].display === '(blank)') ? ' ' : arr[idx].display;
}

// Generic Look up display by value
function lookupFieldArr(val, arr) {
	// Make sure val is a string
	let valStr = `${val}`;
	// See if val is blank or array is empty
	if (valStr === '' || arr.length === 0) return valStr;

	let idx = arr.findIndex((s) => s.value === valStr);
	idx = (idx === -1) ? 0 : idx;   // This fixes bad data coming in
	return (arr[idx].display === '(blank)') ? ' ' : arr[idx].display;
}

// Return all races a person might be
function lookupRaceArr(val) {
	// Return field with all races
	let strRace = '';

	if (val.length > 0) {
		for (let i = 0; i < val.length; i++) {
			strRace += lookupGlobalArr(val[i], 'race') + ', ';
		}
		let idx = strRace.lastIndexOf(', ');
		strRace = (idx === -1) ? strRace : strRace.substring(0, idx);
	}
	return strRace;
}

// Return all choices
function lookupMultiChoiceArr(val, arr) {
	// Return field with all choices
	let strChoice = '';

	if (val.length > 0) {
		for (let i = 0; i < val.length; i++) {
			strChoice += lookupFieldArr(val[i], arr) + ', ';
		}
		let idx = strChoice.lastIndexOf(', ');
		strChoice = (idx === -1) ? strChoice : strChoice.substring(0, idx);
	}
	return strChoice;
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

async function doChart2(p_id_prefix, chartData) 
{
    let wrapper_id = `${p_id_prefix}chartWrapper`;
	let container = document.getElementById(wrapper_id)

    if(container != null)
    {
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


    let myImgChart =  await new Chart(canvas.getContext('2d'), config);
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

// Draw Line Chart
async function drawLineChart(name, cols) {
	let result = document.createElement("div");
	result.id = "divChart";
	result.width = 325.938;
	result.height = 275.938;

	// console.log("result start: ", result);
	let chart = c3.generate({
		bindto: result,
		size: {
			height: 275.938,
			width: 325.938
		},
		data:
		{
			columns: [
				['data1', 30, 200, 100, 400, 150, 250],
				['data2', 50, 20, 10, 40, 15, 25]
			],
		},
	});

	let chartHeight = result.children[0].getAttribute('height');
	let chartWidth = result.children[0].getAttribute('width');
	// console.log('chart height and width: ', chartHeight, ' - ', chartWidth);

	let container = document.createElement('div');
	container.id = 'contDiv';
	let canvas = document.createElement('canvas');
	canvas.id = 'myChart';
	canvas.setAttribute('width', chartWidth);
	canvas.setAttribute('height', chartHeight);

	container.appendChild(canvas);
	// console.log('container: ', container);
	let ctx = canvas.getContext('2d');
	let svgText = `<svg xmlns="http://www.w3.org/2000/svg" width="${chartWidth}" height="${chartHeight}">`;
	svgText += chart.element.innerHTML;

	// console.log('svgText')

	let png = 'Hello';
	let svgImage = new Image();
	svgImage.onload = () => {
		ctx.drawImage(svgImage, chartWidth, chartHeight);
		png = svgText.toDataURL();
	}

	// let mySvg = '<?xml version="1.0" encoding="utf-8"?>';
	// mySvg += '<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
	// 	'<defs><linearGradient id="fill" x1="0%" y1="0%" x2="0%" y2="100%">' +
	// 	'<stop offset="0%" style="stop-color:rgb(224,224,224);stop-opacity:1"/>' +
	// 	'<stop offset="100%" style="stop-color:rgb(153,153,153);stop-opacity:1"/>' +
	// 	'</linearGradient></defs>' +
	// 	'<path d="M 0 0 L 64 0 L 32 64 z" stroke="colourname" fill="url(#fill)"/></svg>';
	// let mySvg = chart.element.innerHTML;

	// // console.log( 'drawLineChart: ', name, ' - ', cols );
	// let chartDefinition = {
	// 	bindto: result,
	// 	size: {
	// 		height: 275.938, 
	// 		width: 325.938
	// 	},
	// 	transition: {
	// 		duration: null
	// 	},
	// 	onrendered: () => {
	// 		d3.select('div #canvasChart svg').selectAll('g.c3-axis.c3-axis-x > g.tick > text')
	// 			.attr('transform', 'rotate(325) translate(-25,0)');	
	// 	},
	// 	axis: {
	// 		x: {
	// 			type: 'timeseries',
	// 			localtime: false,
	// 			label: {
	// 				position: 'outer-right',
	// 			},
	// 			tick: {
	// 				format: '%m/%d/%Y',
	// 			},
	// 			height: 55
	// 		},
	// 		y: {
	// 			tick: {
	// 				format: d3.format('.0f'),
	// 			},
	// 			min: 0,
	// 			padding: {top: 0, bottom: 0},
	// 		},
	// 	},
	// 	data: {
	// 		x: 'x',
	// 		xFormat: '%Y-%m-%d %H:%M:%S',
	// 		columns: [
	// 			['x','2020-12-3 0:0:0','2020-11-5 0:0:0','2020-10-1 0:0:0'],
	// 			['systolic_bp',129.00,125.00,120.00],
	// 			['diastolic',88.00,84.00,80.00]
	// 		]
	// 	},
	// 	line: {
	// 		connectNull: true
	// 	}
	// };

	// // let mySvg = '';
	// const chart = c3.generate(chartDefinition);

	// set id for svg
	// result.firstElementChild.setAttribute("id", "svgChart");
	// // console.log('chart: ', chart);
	// console.log('result: ', result);

	// let chartHeight = result.children[0].getAttribute('height');
	// let chartWidth = result.children[0].getAttribute('width');
	// // console.log('chart height and width: ', chartHeight, ' - ', chartWidth);

	// let mySvg = '<?xml version="1.0" encoding="utf-8"?>';
	// mySvg += '<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
	// 	'<defs><linearGradient id="fill" x1="0%" y1="0%" x2="0%" y2="100%">' +
	// 	'<stop offset="0%" style="stop-color:rgb(224,224,224);stop-opacity:1"/>' +
	// 	'<stop offset="100%" style="stop-color:rgb(153,153,153);stop-opacity:1"/>' +
	// 	'</linearGradient></defs>' +
	// 	'<path d="M 0 0 L 64 0 L 32 64 z" stroke="colourname" fill="url(#fill)"/></svg>';
	// let mySvg = chart.element.innerHTML;

	// let mySvg = result.children[0];
	// // console.log('mySvg: ', mySvg);
	// let svgString = new XMLSerializer().serializeToString(mySvg);
	// // console.log('svgString: ', svgString);
	// let png;
	// document.addEventListener('DOMContentLoaded', () => {
	// 	// console.log('in addEventListener');
	// 	let canvas = document.getElementById('canvas');
	// 	let ctx = canvas.getContext('2d');
	// 	let DOMURL = self.URL || self.webkitURL || self;
	// 	let img = new Image();
	// 	let svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
	// 	let url = DOMURL.createObjectURL(svg);
	// 	img.onload = () => {
	// 		ctx.drawImage(img, 0, 0);
	// 		png = canvas.toDataURL('image/png');
	// 		// console.log('png: ', png);
	// 	}
	// });

	// let svg = result.querySelector('#divChart svg');
	// // console.log('svg query: ', svg);
	// let svgElement = document.getElementById('')
	// let svgData = new XMLSerializer().serializeToString(svg);
	// // console.log('svgData: ', svgData);
	// let chartHeight = svg.getAttribute('height');
	// let chartWidth = svg.getAttribute('width');
	// // console.log('chart height and width: ', chartHeight, ' - ', chartWidth);
	// let svgURL = 'data:image/svg_xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
	// // console.log('svgURL: ', svgURL);

	// png = window.btoa(svgURL);
	// // console.log('png: ', png);
	// return png;
	// return new Promise((resolve, reject) => {
	// 	let img = new Image();
	// 	img.setAttribute('crossOrigin', 'anonymous');
	// 	img.onload = () => {
	// 		let canvas = document.createElement('canvas');
	// 		canvas.width = chartWidth;
	// 		canvas.height = chartHeight;
	// 		let ctx = canvas.getContext('2d');
	// 		ctx.drawImage(img, 0, 0);
	// 		let dataURL = canvas.toDataURL('image/png');
	// 		// console.log('DataURL onload: ', dataURL);
	// 		resolve(dataURL);
	// 	};
	// 	img.onerror = error => {
	// 		reject(error);
	// 	};
	// 	img.src = svgURL;
	// });

	return png;
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
async function formatContent(sectionName, arrMap) {
	let retContent = [];
	let arrIndex;

	switch (sectionName) {
		case 'home_record':
			arrIndex = arrMap.findIndex((s) => s.name === 'home_record');
			retContent.push(await home_record(g_md.children[arrIndex], g_d.home_record));
			break;
		case 'death_certificate':
			arrIndex = arrMap.findIndex((s) => s.name === 'death_certificate');
			retContent.push(await death_certificate(g_md.children[arrIndex], g_d.death_certificate, false));
			break;
		case 'birth_fetal_death_certificate_parent':
			arrIndex = arrMap.findIndex((s) => s.name === 'birth_fetal_death_certificate_parent');
			retContent.push(await birth_fetal_death_certificate_parent(g_md.children[arrIndex], g_d.birth_fetal_death_certificate_parent, false));
			break;
		case 'birth_certificate_infant_fetal_section':
			arrIndex = arrMap.findIndex((s) => s.name === 'birth_certificate_infant_fetal_section');
			retContent.push(await birth_certificate_infant_fetal_section(g_md.children[arrIndex], g_d.birth_certificate_infant_fetal_section, false));
			break;
		case 'autopsy_report':
			arrIndex = arrMap.findIndex((s) => s.name === 'autopsy_report');
			retContent.push(await autopsy_report(g_md.children[arrIndex], g_d.autopsy_report, false));
			break;
		case 'prenatal':
			arrIndex = arrMap.findIndex((s) => s.name === 'prenatal');
			retContent.push(await prenatal(g_md.children[arrIndex], g_d.prenatal, false));
			break;
		case 'er_visit_and_hospital_medical_records':
			arrIndex = arrMap.findIndex((s) => s.name === 'er_visit_and_hospital_medical_records');
			retContent.push(await er_visit_and_hospital_medical_records(g_md.children[arrIndex], g_d.er_visit_and_hospital_medical_records, false));
			break;
		case 'other_medical_office_visits':
			arrIndex = arrMap.findIndex((s) => s.name === 'other_medical_office_visits');
			retContent.push(await other_medical_office_visits(g_md.children[arrIndex], g_d.other_medical_office_visits, false));
			break;
		case 'medical_transport':
			arrIndex = arrMap.findIndex((s) => s.name === 'medical_transport');
			retContent.push(await medical_transport(g_md.children[arrIndex], g_d.medical_transport, false));
			break;
		case 'social_and_environmental_profile':
			arrIndex = arrMap.findIndex((s) => s.name === 'social_and_environmental_profile');
			retContent.push(await social_and_environmental_profile(g_md.children[arrIndex], g_d.social_and_environmental_profile, false));
			break;
		case 'mental_health_profile':
			arrIndex = arrMap.findIndex((s) => s.name === 'mental_health_profile');
			retContent.push(await mental_health_profile(g_md.children[arrIndex], g_d.mental_health_profile, false));
			break;
		case 'informant_interviews':
			arrIndex = arrMap.findIndex((s) => s.name === 'informant_interviews');
			retContent.push(await informant_interviews(g_md.children[arrIndex], g_d.informant_interviews, false));
			break;
		case 'case_narrative':
			arrIndex = arrMap.findIndex((s) => s.name === 'case_narrative');
			retContent.push(await case_narrative(g_md.children[arrIndex], g_d.case_narrative, false));
			break;
		case 'committee_review':
			arrIndex = arrMap.findIndex((s) => s.name === 'committee_review');
			retContent.push(await committee_review(g_md.children[arrIndex], g_d.committee_review, false));
			break;
		case 'core-summary':
			retContent.push(await core_summary());
			break;
		case 'all':
			// home_record
			g_current = 'home_record';
			arrIndex = await arrMap.findIndex((s) => s.name === 'home_record');
			retContent.push(await home_record(g_md.children[arrIndex], g_d.home_record));
			// death_certificate
			g_current = 'death_certificate';
			arrIndex = await arrMap.findIndex((s) => s.name === 'death_certificate');
			retContent.push(await death_certificate(g_md.children[arrIndex], g_d.death_certificate, true));
			// birth_fetal_death_certificate_parent
			g_current = 'birth_fetal_death_certificate_parent';
			arrIndex = await arrMap.findIndex((s) => s.name === 'birth_fetal_death_certificate_parent');
			retContent.push(await birth_fetal_death_certificate_parent(g_md.children[arrIndex], g_d.birth_fetal_death_certificate_parent, true));
			// birth_certificate_infant_fetal_section
			g_current = 'birth_certificate_infant_fetal_section';
			arrIndex = await arrMap.findIndex((s) => s.name === 'birth_certificate_infant_fetal_section');
			retContent.push(await birth_certificate_infant_fetal_section(g_md.children[arrIndex], g_d.birth_certificate_infant_fetal_section, true));
			// autopsy_report
			g_current = 'autopsy_report';
			arrIndex = await arrMap.findIndex((s) => s.name === 'autopsy_report');
			retContent.push(await autopsy_report(g_md.children[arrIndex], g_d.autopsy_report, true));
			// prenatal
			g_current = 'prenatal';
			arrIndex = await arrMap.findIndex((s) => s.name === 'prenatal');
			retContent.push(await prenatal(g_md.children[arrIndex], g_d.prenatal, true));
			// er_visit_and_hospital_medical_records
			g_current = 'er_visit_and_hospital_medical_records';
			arrIndex = await arrMap.findIndex((s) => s.name === 'er_visit_and_hospital_medical_records');
			retContent.push(await er_visit_and_hospital_medical_records(g_md.children[arrIndex], g_d.er_visit_and_hospital_medical_records, true));
			// other_medical_office_visits
			g_current = 'other_medical_office_visits';
			arrIndex = await arrMap.findIndex((s) => s.name === 'other_medical_office_visits');
			retContent.push(await other_medical_office_visits(g_md.children[arrIndex], g_d.other_medical_office_visits, true));
			// medical_transport
			g_current = 'medical_transport';
			arrIndex = await arrMap.findIndex((s) => s.name === 'medical_transport');
			retContent.push(await medical_transport(g_md.children[arrIndex], g_d.medical_transport, true));
			// social_and_environmental_profile
			g_current = 'social_and_environmental_profile';
			arrIndex = await arrMap.findIndex((s) => s.name === 'social_and_environmental_profile');
			retContent.push(await social_and_environmental_profile(g_md.children[arrIndex], g_d.social_and_environmental_profile, true));
			// mental_health_profile
			g_current = 'mental_health_profile';
			arrIndex = await arrMap.findIndex((s) => s.name === 'mental_health_profile');
			retContent.push(await mental_health_profile(g_md.children[arrIndex], g_d.mental_health_profile, true));
			// informant_interviews
			g_current = 'informant_interviews';
			arrIndex = await arrMap.findIndex((s) => s.name === 'informant_interviews');
			retContent.push(await informant_interviews(g_md.children[arrIndex], g_d.informant_interviews, true));
			// case_narrative
			g_current = 'case_narrative';
			arrIndex = await arrMap.findIndex((s) => s.name === 'case_narrative');
			retContent.push(await case_narrative(g_md.children[arrIndex], g_d.case_narrative, true));
			// committee_review
			g_current = 'committee_review';
			arrIndex = await arrMap.findIndex((s) => s.name === 'committee_review');
			retContent.push(await committee_review(g_md.children[arrIndex], g_d.committee_review, true));
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
// Build home_record - p is the field name & d is the data
//

async function home_record(p, d) {
	// Name table
	let index = 0;
	let subIndex = 0;
	let retPage = [];

	// console.log('p: ', p);
	// console.log('d: ', d);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });

	// Case Identification
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
				headerRows: 1,
				widths: [250, 'auto'],
				body: [
					[
						{ text: 'Case Identification', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.first_name, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.middle_name, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.last_name, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: fmtDataDate(d.date_of_death), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.state_of_death_record, 'state'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.record_id, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.agency_case_id, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.how_was_this_death_identified, p.children[index + 7].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.specify_other_multiple_sources, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 9].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: (d.primary_abstractor), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 10].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.jurisdiction_id, style: ['tableDetail'], },
					],
				],
			}
		}
	]);

	// Overall Case Status
	index = 11;
	subIndex = 0;

	// console.log('overall case status: ', lookupFieldArr(d.case_status.overall_case_status, p.children[index].children[subIndex + 1].values));

	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: 'Overall Case Status', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.case_status.overall_case_status, p.children[index].children[subIndex + 1].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(d.case_status.abstraction_begin_date), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(d.case_status.abstraction_complete_date), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(d.case_status.projected_review_date), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(g_d.committee_review.date_of_review), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(d.case_status.case_locked_date), style: ['tableDetail'], },
					],
				],
			}
		}
	]);

	// Overall Assessment of the Timing of Death
	index = 12;
	subIndex = 0;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: 'Overall Assessment of the Timing of Death', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.overall_assessment_of_timing_of_death.abstrator_assigned_status, p.children[index].children[subIndex + 1].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.overall_assessment_of_timing_of_death.number_of_days_after_end_of_pregnancey || 0}`, style: ['tableDetail'], },
					],
				],
			}
		}
	]);

	// Add a page break - per Gyan
	retPage.push({ text: '', pageBreak: 'before' });

	// Form Status
	index = 13;
	subIndex = 0;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*', 200, '*'],
				body: [
					[
						{ text: 'Form Status', style: ['subHeader'], colSpan: '4', },
						{}, {}, {},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.death_certificate, 'case_progress'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.autopsy_report, 'case_progress'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.birth_certificate_parent_section, 'case_progress'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.birth_certificate_infant_or_fetal_death_section, 'case_progress'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.prenatal_care_record, 'case_progress'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.er_visits_and_hospitalizations, 'case_progress'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.other_medical_visits, 'case_progress'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.medical_transport, 'case_progress'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.social_and_psychological_profile, 'case_progress'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 9].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.mental_health_profile, 'case_progress'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.informant_interviews, 'case_progress'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 11].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.case_narrative, 'case_progress'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 12].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.committe_review_worksheet, 'case_progress'), style: ['tableDetail'], },
						{},
						{},
					],
				],
			}
		}
	]);

	// Audit Information
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: 'Audit Information', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: 'Date Record Created:', style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(g_d.date_created), style: ['tableDetail'], },
					],
					[
						{ text: 'Record Created By:', style: ['tableLabel'], alignment: 'right', },
						{ text: g_d.created_by, style: ['tableDetail'], },
					],
					[
						{ text: 'Date Record Updated:', style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(g_d.date_last_updated), style: ['tableDetail'], },
					],
					[
						{ text: 'Record Updated By:', style: ['tableLabel'], alignment: 'right', },
						{ text: g_d.last_updated_by, style: ['tableDetail'], },
					],
					[
						{ text: 'Host State:', style: ['tableLabel'], alignment: 'right', },
						{ text: g_d.host_state, style: ['tableDetail'], },
					],
					[
						{ text: 'MMRIA Version:', style: ['tableLabel'], alignment: 'right', },
						{ text: g_d.version, style: ['tableDetail'], },
					],
				],
			}
		}
	]);

	return retPage;
}

// Build death_certificate record - p is the field name & d is the data & pg_break is true/false if need page break
async function death_certificate(p, d, pg_break) {
	// Name table
	let index = 0;
	let subIndex = 0;
	let retPage = [];

	// console.log('p: ', p);
	// console.log('d: ', d);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Maternal Death Certificate Identification
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{}, 
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.certificate_identification.time_of_death, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.certificate_identification.local_file_number, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.certificate_identification.state_file_number, style: ['tableDetail'], },
					],
				],
			}
		}
	]);

	// Place of Last Residence
	index += 1;
	subIndex = 0;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.place_of_last_residence.street} / ${d.place_of_last_residence.apartment}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 2].prompt}, ${p.children[index].children[subIndex + 3].prompt}, ${p.children[index].children[subIndex + 5].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.place_of_last_residence.city} / ${lookupGlobalArr(d.place_of_last_residence.state, 'state')} / ${d.place_of_last_residence.zip_code}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 6].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.place_of_last_residence.county,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 4].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupGlobalArr(d.place_of_last_residence.country_of_last_residence, 'country'),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 9].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.place_of_last_residence.feature_matching_geography_type,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 14].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.place_of_last_residence.naaccr_census_tract_certainty_code,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 15].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.place_of_last_residence.naaccr_census_tract_certainty_type,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 20].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.place_of_last_residence.urban_status,
							style: ['tableDetail'],
						},
					],
				],
			}
		}
	]);

	// Demographics
	index += 1;
	subIndex = 0;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt}: ${p.children[index].children[subIndex].children[0].prompt} / ` +
								`${p.children[index].children[subIndex].children[1].prompt} / ${p.children[index].children[subIndex].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: fmtDataDate(d.demographics.date_of_birth),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.demographics.age,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.demographics.age_on_death_certificate,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 3].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupFieldArr(d.demographics.marital_status, p.children[index].children[subIndex + 3].values),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: 'Birth: City / State / Country:',
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.demographics.city_of_birth} / ${lookupGlobalArr(d.demographics.state_of_birth, 'state')} / ` +
								`${lookupGlobalArr(d.demographics.country_of_birth, 'country')}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 7].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.demographics.primary_occupation,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 8].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.demographics.occupation_business_industry,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 9].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupFieldArr(d.demographics.ever_in_us_armed_forces, p.children[index].children[subIndex + 9].values),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 10].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupGlobalArr(d.demographics.is_of_hispanic_origin, 'ethnicity'),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 11].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.demographics.is_of_hispanic_origin_other_specify,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 12].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupFieldArr(d.demographics.education_level, p.children[index].children[subIndex + 12].values),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index + 1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupGlobalArr(d.citizen_of_what_country, 'country'),
							style: ['tableDetail'],
						},
					],
				],
			}
		}
	]);

	// Race
	index += 2;
	subIndex = 0;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupRaceArr(d.race.race),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.race.other_race,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.race.other_asian,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 3].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.race.other_pacific_islander,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 4].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.race.principle_tribe,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 5].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupGlobalArr(d.race.omb_race_recode.toString(), 'omb_race_recode'),
							style: ['tableDetail'],
						},
					],
				],
			},
		},
	]);

	// Injury Associated Info
	index += 1;
	subIndex = 0;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt}: ${p.children[index].children[subIndex].children[0].prompt} / ` +
								`${p.children[index].children[subIndex].children[1].prompt} / ${p.children[index].children[subIndex].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{ text: fmtDataDate(d.injury_associated_information.date_of_injury), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.injury_associated_information.time_of_injury, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.injury_associated_information.place_of_injury, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupFieldArr(d.injury_associated_information.was_injury_at_work, p.children[index].children[subIndex + 3].values),
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupFieldArr(d.injury_associated_information.transportation_related_injury, p.children[index].children[subIndex + 4].values),
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.injury_associated_information.transport_related_other_specify, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupFieldArr(d.injury_associated_information.were_seat_belts_in_use, p.children[index].children[subIndex + 6].values),
							style: ['tableDetail'],
						},
					],
				],
			},
		},
	]);

	// Location Where Injury Occurred
	index += 1;
	subIndex = 0;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.address_of_injury.street} / ${d.address_of_injury.apartment}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 2].prompt}, ${p.children[index].children[subIndex + 3].prompt}, ` +
								`${p.children[index].children[subIndex + 4].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.address_of_injury.city}, ${lookupGlobalArr(d.address_of_injury.state, 'state')} ${d.address_of_injury.zip_code}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 5].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.address_of_injury.county,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 9].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.address_of_injury.feature_matching_geography_type,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 14].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.address_of_injury.naaccr_census_tract_certainty_code,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 15].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.address_of_injury.naaccr_census_tract_certainty_type,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 20].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.address_of_injury.urban_status,
							style: ['tableDetail'],
						},
					],
				],
			},
		},
	]);

	// Death Information
	index += 1;
	subIndex = 0;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupFieldArr(d.death_information.death_occured_in_hospital, p.children[index].children[subIndex].values),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupFieldArr(d.death_information.death_outside_of_hospital, p.children[index].children[subIndex + 1].values),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.death_information.other_death_outside_of_hospital,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 3].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupFieldArr(d.death_information.manner_of_death, p.children[index].children[subIndex + 3].values),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 4].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupFieldArr(d.death_information.was_autopsy_performed, p.children[index].children[subIndex + 4].values),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 5].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupFieldArr(d.death_information.was_autopsy_used_for_death_coding, p.children[index].children[subIndex + 5].values),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 6].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupFieldArr(d.death_information.pregnancy_status, p.children[index].children[subIndex + 6].values),
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 7].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupFieldArr(d.death_information.did_tobacco_contribute_to_death, p.children[index].children[subIndex + 7].values),
							style: ['tableDetail'],
						},
					],
				],
			},
		},
	]);

	// Location Where Death Occurred
	index += 1;
	subIndex = 0;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.address_of_death.place_of_death,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 1].prompt} / ${p.children[index].children[subIndex + 2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.address_of_death.street} / ${d.address_of_death.apartment}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 3].prompt}, ${p.children[index].children[subIndex + 4].prompt} ` +
								`${p.children[index].children[subIndex + 5].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.address_of_death.city}, ${lookupGlobalArr(d.address_of_death.state, 'state')} ${d.address_of_death.zip_code}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 6].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.address_of_death.county,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 9].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.address_of_death.feature_matching_geography_type,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 14].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.address_of_death.naaccr_census_tract_certainty_code,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 15].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.address_of_death.naaccr_census_tract_certainty_type,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 20].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.address_of_death.urban_status,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 24].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: d.address_of_death.estimated_death_distance_from_residence,
							style: ['tableDetail'],
						},
					],
				],
			},
		},
	]);

	// Causes of Death
	index += 1;
	subIndex = 0;
	lenArr = d.causes_of_death.length;
	startArr = 0;
	endArr = lenArr;
	body = [];
	row = new Array();

	row.push(
		{
			text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6',
		},
		{}, {}, {}, {}, {});
	body.push(row);

	row = new Array();
	row.push(
		{ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },
		{ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], },
		{ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },
		{ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },
		{ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },
		{ text: p.children[index].children[subIndex + 4].prompt, style: ['tableLabel', 'blueFill'], },
	);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, {}, {}, {}, {}, {},);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push(
				{ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center' },
				{ text: lookupFieldArr(d.causes_of_death[curRec].cause_type, p.children[index].children[subIndex].values), style: ['tableDetail'], },
				{ text: d.causes_of_death[curRec].cause_descriptive, style: ['tableDetail'], },
				{ text: d.causes_of_death[curRec].icd_code, style: ['tableDetail'], },
				{ text: d.causes_of_death[curRec].interval, style: ['tableDetail'], },
				{ text: lookupFieldArr(d.causes_of_death[curRec].interval_unit, p.children[index].children[subIndex + 4].values), style: ['tableDetail'], },
			);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 250, '*', '*', 'auto', '*'],
				body: body,
			},
		},],
	);

	// Reviewer's Notes About the Death Certificate
	index += 1;
	subIndex = 0;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: ['auto'],
				body: [
					[{ text: p.children[index].prompt, style: ['subHeader'], },],
					[{ text: d.reviewer_note, style: ['tableDetail'], },],
				],
			},
		},
	]);

	return retPage;
}

// Build birth_fetal_death_certificate_parent record - p is the field name & d is the data & pg_break is true/false if need page break
async function birth_fetal_death_certificate_parent(p, d, pg_break) {
	// Name table
	let index = 0;
	let subIndex = 0;
	let retPage = [];

	// console.log('p: ', p);
	// console.log('d: ', d);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Facility of Delivery Demographics
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [150, '*', 150, '*', 150, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '6', },
						{}, {}, {}, {}, {},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt}: ${p.children[index].children[subIndex].children[0].prompt} / ` +
								`${p.children[index].children[subIndex].children[1].prompt} / ${p.children[index].children[subIndex].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{ text: fmtDataDate(d.facility_of_delivery_demographics.date_of_delivery), style: ['tableDetail'], colSpan: 5, },
						{}, {}, {}, {},
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right' },
						{ text: lookupFieldArr(d.facility_of_delivery_demographics.type_of_place, p.children[index].children[subIndex + 1].values), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right' },
						{ text: lookupGlobalArr(d.facility_of_delivery_demographics.was_home_delivery_planned, 'yes_no'), style: ['tableDetail'], colSpan: 2, },
						{}, {},
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right' },
						{ text: lookupFieldArr(d.facility_of_delivery_demographics.maternal_level_of_care, p.children[index].children[subIndex + 3].values), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right' },
						{ text: d.facility_of_delivery_demographics.other_maternal_level_of_care, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right' },
						{ text: d.facility_of_delivery_demographics.facility_npi_number, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right' },
						{ text: d.facility_of_delivery_demographics.facility_name, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right' },
						{ text: lookupFieldArr(d.facility_of_delivery_demographics.attendant_type, p.children[index].children[subIndex + 7].values), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 8].prompt}: `, style: ['tableLabel'], alignment: 'right' },
						{ text: d.facility_of_delivery_demographics.other_attendant_type, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 9].prompt}: `, style: ['tableLabel'], alignment: 'right' },
						{ text: d.facility_of_delivery_demographics.attendant_npi, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 10].prompt}: `, style: ['tableLabel'], alignment: 'right' },
						{ text: lookupGlobalArr(d.facility_of_delivery_demographics.was_mother_transferred, 'yes_no'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 11].prompt}: `, style: ['tableLabel'], alignment: 'right' },
						{ text: d.facility_of_delivery_demographics.transferred_from_where, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Facility of Delivery Location
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.facility_of_delivery_location.street} / ${d.facility_of_delivery_location.apartment}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 2].prompt}, ${p.children[index].children[subIndex + 3].prompt} ` +
								`${p.children[index].children[subIndex + 4].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.facility_of_delivery_location.city}, ${lookupGlobalArr(d.facility_of_delivery_location.state, 'state')} ` +
								`${d.facility_of_delivery_location.zip_code}`,
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.facility_of_delivery_location.county}`, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.facility_of_delivery_location.feature_matching_geography_type}`, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 13].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.facility_of_delivery_location.naaccr_census_tract_certainty_code}`, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 14].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.facility_of_delivery_location.naaccr_census_tract_certainty_type}`, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 15].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.facility_of_delivery_location.urban_status}`, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Father's Demographics
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex].children[0].prompt} / ` +
								`${p.children[index].children[subIndex].children[1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${fmt2Digits(d.demographic_of_father.date_of_birth.month)} / ${fmtYear(d.demographic_of_father.date_of_birth.year)}`,
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.age, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.demographic_of_father.education_level, p.children[index].children[subIndex + 2].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.city_of_birth, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_father.state_of_birth, 'state'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_father.father_country_of_birth, 'country'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.primary_occupation, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.occupation_business_industry, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_father.is_father_of_hispanic_origin, 'ethnicity'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 9].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.is_father_of_hispanic_origin_other_specify, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].children[0].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupRaceArr(d.demographic_of_father.race.race_of_father), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].children[1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.race.other_race, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].children[2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.race.other_asian, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].children[3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.race.other_pacific_islander, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].children[4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.race.principle_tribe, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].children[5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_father.race.omb_race_recode.toString(), 'omb_race_recode'), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Maternal Record Identification
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.record_identification.first_name} / ${d.record_identification.middle_name}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 2].prompt} / ${p.children[index].children[subIndex + 3].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.record_identification.last_name} / ${d.record_identification.maiden_name}`,
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.record_identification.medical_record_number}`, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Mother's Demographics
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt}: ${p.children[index].children[subIndex].children[0].prompt} / ` +
								`${p.children[index].children[subIndex].children[1].prompt} / ${p.children[index].children[subIndex].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: fmtDataDate(d.demographic_of_mother.date_of_birth),
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_mother.age, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_mother.mother_married, 'yes_no'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupGlobalArr(d.demographic_of_mother.If_mother_not_married_has_paternity_acknowledgement_been_signed_in_the_hospital, 'yes_no'),
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_mother.city_of_birth, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_mother.state_of_birth, 'state'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_mother.country_of_birth, 'country'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_mother.primary_occupation, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_mother.occupation_business_industry, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 9].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_mother.ever_in_us_armed_forces, 'yes_no'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_mother.is_of_hispanic_origin, 'ethnicity'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 11].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_mother.is_of_hispanic_origin_other_specify, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 12].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.demographic_of_mother.education_level, p.children[index].children[subIndex + 12].values), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Location of Residence
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.location_of_residence.street} / ${d.location_of_residence.apartment}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 2].prompt}, ${p.children[index].children[subIndex + 3].prompt} ` +
								`${p.children[index].children[subIndex + 4].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.location_of_residence.city}, ${lookupGlobalArr(d.location_of_residence.state, 'state')} ${d.location_of_residence.zip_code} `,
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.location_of_residence.county, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.location_of_residence.feature_matching_geography_type, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 13].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.location_of_residence.naaccr_census_tract_certainty_code, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 14].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.location_of_residence.naaccr_census_tract_certainty_type, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 19].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.location_of_residence.urban_status, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 23].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.location_of_residence.estimated_distance_from_residence, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Mother's Race
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupRaceArr(d.race.race_of_mother), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.race.other_race, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.race.other_asian, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.race.other_pacific_islander, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.race.principle_tribe, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.race.omb_race_recode.toString(), 'omb_race_recode'), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Pregnancy History
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: fmtDataDate(d.pregnancy_history.date_of_last_live_birth), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.live_birth_interval, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.number_of_previous_live_births, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.now_living, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.now_dead, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.other_outcomes, style: ['tableDetail'], },
					],
					[
						{
							text: `${p.children[index].children[subIndex + 6].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: fmtDataDate(d.pregnancy_history.date_of_last_other_outcome),
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.pregnancy_interval, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Maternal Biometrics
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*', 150, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '4', },
						{}, {}, {},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.maternal_biometrics.height_feet} / ${d.maternal_biometrics.height_inches}`,
							style: ['tableDetail'],
						},
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.maternal_biometrics.pre_pregnancy_weight, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.maternal_biometrics.weight_at_delivery, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.maternal_biometrics.weight_gain, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.maternal_biometrics.bmi, style: ['tableDetail'], },
						{}, {},
					],
				],
			},
		},
	]);

	// Prenatal Care
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: fmtDataDate(d.prenatal_care.date_of_last_normal_menses), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: fmtDataDate(d.prenatal_care.date_of_1st_prenatal_visit), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: fmtDataDate(d.prenatal_care.date_of_last_prenatal_visit), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care.calculated_gestation, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care.calculated_gestation_days, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care.obsteric_estimate_of_gestation, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.prenatal_care.plurality, p.children[index].children[subIndex + 6].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care.specify_if_greater_than_3, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.prenatal_care.was_wic_used, 'yes_no'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 9].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.prenatal_care.principal_source_of_payment_for_this_delivery, p.children[index].children[subIndex + 9].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care.specify_other_payor, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 11].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.prenatal_care.trimester_of_1st_prenatal_care_visit, p.children[index].children[subIndex + 11].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 12].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care.number_of_visits, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Cigarette Smoking
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ 
							text: `${d.cigarette_smoking.prior_3_months} ` +
								`${lookupFieldArr(d.cigarette_smoking.prior_3_months_type, p.children[index].children[subIndex + 1].values)}`, 
							style: ['tableDetail'], 
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.cigarette_smoking.trimester_1st} ` +
								`${lookupFieldArr(d.cigarette_smoking.trimester_1st_type, p.children[index].children[subIndex + 3].values)}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 4].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.cigarette_smoking.trimester_2nd} ` +
								`${lookupFieldArr(d.cigarette_smoking.trimester_2nd_type, p.children[index].children[subIndex + 5].values)}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 6].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.cigarette_smoking.trimester_3rd} ` +
								`${lookupFieldArr(d.cigarette_smoking.trimester_3rd_type, p.children[index].children[subIndex + 7].values)}`,
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.cigarette_smoking.none_or_not_specified, p.children[index].children[subIndex + 8].values), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Maternal Risk Factors
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.risk_factors.risk_factors_in_this_pregnancy, p.children[index].children[subIndex].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.risk_factors.number_of_c_sections, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.infections_present_or_treated_during_pregnancy, p.children[index + 1].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.specify_other_infection, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.onset_of_labor, p.children[index + 3].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.obstetric_procedures, p.children[index + 4].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.characteristics_of_labor_and_delivery, p.children[index + 5].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.maternal_morbidity, p.children[index + 6].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.length_between_child_birth_and_death_of_mother, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 10].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.reviewer_note, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	return retPage;
}

// Build birth_certificate_infant_fetal_section record - p is the field name & d is the data & pg_break is true/false if need page break
async function birth_certificate_infant_fetal_section(p, d, pg_break) {
	// Global fields
	let index = 0;
	let subIndex = 0;
	let retPage = [];
	let allRecs = (typeof g_record_number === 'undefined' || pg_break) ? true : false;
	let lenArr = d.length
	let startArr = 0;
	let endArr = lenArr;

	// For the Causes of Fetal Death loop
	let deathIndex = 0;
	let deathStartArr = 0;
	let deathEndArr = 0;
	let deathLenArr = 0;
	let body = [];
	let row = new Array();

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Are there any records
	if (lenArr === 0) {
		retPage.push({ text: 'No records entered', style: ['tableDetail'], },);
	} else {
		if (!allRecs) {
			startArr = g_record_number - 1;
			endArr = startArr + 1;
		}
	
		// Display record(s)
		for (let curRec = startArr; curRec < endArr; curRec++) {
			index = 0;
			subIndex = 0;

			// Check to see if there are multiple records, if so do a page break
			if ( allRecs && curRec > 0 ) {
				retPage.push({ text: '', pageBreak: 'before' });
			}

			// Record Type, Multiple Gestations, Birth Order
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
						widths: [250, 'auto'],
						headerRows: 1,
						body: [
							[
								{ text: `Record #${curRec + 1}`.toUpperCase(), style: ['subHeader'], colSpan: '2', },
								{},
							],
							[
								{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: lookupFieldArr(d[curRec].record_type, p.children[index].values), style: ['tableDetail', 'lightFill'], },
							],
							[
								{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: lookupGlobalArr(d[curRec].is_multiple_gestation, 'yes_no'), style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].birth_order, style: ['tableDetail', 'lightFill'], },
							],
						],
					},
				},
			]);

			// Newborn (Fetus) Record Identification
			index += 3;
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
						widths: [250, '*', 250, '*'],
						headerRows: 1,
						body: [
							[
								{ text: `${p.children[index].prompt}`, style: ['subHeader'], colSpan: '4', margin: [0, 10, 0, 0], },
								{}, {}, {},
							],
							[
								{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].record_identification.state_file_number, style: ['tableDetail'], },
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].record_identification.local_file_number, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].record_identification.newborn_medical_record_number, style: ['tableDetail'], colSpan: '3', },
								{}, {},
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].record_identification.date_of_delivery, style: ['tableDetail'], },
								{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].record_identification.time_of_delivery, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Newborn (Fetus) Biometrics and Demographics
			index += 1;
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
						widths: [250, '*', 250, '*'],
						headerRows: 1,
						body: [
							[
								{ text: `${p.children[index].prompt}`, style: ['subHeader'], colSpan: '4', margin: [0, 10, 0, 0], },
								{}, {}, {},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[0].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].biometrics_and_demographics.birth_weight.unit_of_measurement,
										p.children[index].children[subIndex].children[0].values),
									style: ['tableDetail'],
									colSpan: '3',
								},
								{}, {},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].biometrics_and_demographics.birth_weight.grams_or_pounds, style: ['tableDetail'], },
								{ text: `${p.children[index].children[subIndex].children[2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].biometrics_and_demographics.birth_weight.ounces, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].biometrics_and_demographics.gender, p.children[index].children[subIndex + 1].values),
									style: ['tableDetail'],
									colSpan: '3',
								},
								{}, {},
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].children[0].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].biometrics_and_demographics.apgar_scores.minute_5, style: ['tableDetail'], colSpan: '3', },
								{}, {},
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].children[1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].biometrics_and_demographics.apgar_scores.minute_10, style: ['tableDetail'], colSpan: '3', },
								{}, {},
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].biometrics_and_demographics.is_infant_living_at_time_of_report,
										p.children[index].children[subIndex + 3].values),
									style: ['tableDetail'],
									colSpan: '3',
								},
								{}, {},
							],
							[
								{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupGlobalArr(d[curRec].biometrics_and_demographics.is_infant_being_breastfed_at_discharge, 'yes_no'),
									style: ['tableDetail'],
									colSpan: '3',
								},
								{}, {},
							],
							[
								{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupGlobalArr(d[curRec].biometrics_and_demographics.was_infant_transferred_within_24_hours, 'yes_no'),
									style: ['tableDetail'],
									colSpan: '3',
								},
								{}, {},
							],
							[
								{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].biometrics_and_demographics.facility_city_state, style: ['tableDetail'], colSpan: '3', },
								{}, {},
							],
						],
					},
				},
			]);

			// Method of Delivery
			index += 1;
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
						widths: [250, '*'],
						headerRows: 1,
						body: [
							[
								{ text: `${p.children[index].prompt}`, style: ['subHeader'], colSpan: '2', margin: [0, 10, 0, 0], },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupGlobalArr(d[curRec].method_of_delivery.was_delivery_with_forceps_attempted_but_unsuccessful, 'yes_no'),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupGlobalArr(d[curRec].method_of_delivery.was_delivery_with_vacuum_extration_attempted_but_unsuccessful, 'yes_no'),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].method_of_delivery.fetal_delivery, p.children[index].children[subIndex + 2].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].method_of_delivery.other_presentation, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].method_of_delivery.final_route_and_method_of_delivery,
										p.children[index].children[subIndex + 4].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupGlobalArr(d[curRec].method_of_delivery.was_delivery_with_vacuum_extration_attempted_but_unsuccessful,
										'no_yes_not_applicable_unknown'),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupMultiChoiceArr(d[curRec].abnormal_conditions_of_newborn, p.children[index + 1].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupMultiChoiceArr(d[curRec].congenital_anomalies, p.children[index + 2].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].icd_version, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Add some space between last row and table
			retPage.push([{ text: '', margin: [0, 0, 0, 15], },],);

			// Causes of death
			index += 4;
			deathIndex = 0;
			deathLenArr = d[curRec].causes_of_death.length;
			deathStartArr = 0;
			deathEndArr = deathLenArr;

			body = [];
			row = new Array();

			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', }, {}, {}, {}, {}, {});
			body.push(row);

			row = new Array();
			row.push(
				{ text: 'Rec #', style: ['tableLabel', 'blueFill'] },
				{ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], },
				{ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },
				{ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },
				{ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },
				{ text: p.children[index].children[subIndex + 4].prompt, style: ['tableLabel', 'blueFill'], },
			);
			body.push(row);

			// Are there any fetal death records?
			if (deathLenArr === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, {}, {}, {}, {}, {},);
				body.push(row);
			} else {
				// Build the table detail
				for (let deathCurRec = deathStartArr; deathCurRec < deathEndArr; deathCurRec++) {
					row = new Array();
					row.push(
						{ text: `${deathCurRec + 1}`, style: ['tableDetail'], alignment: 'center', },
						{ text: d[curRec].causes_of_death[deathCurRec].type, style: ['tableDetail'], },
						{ text: d[curRec].causes_of_death[deathCurRec].class, style: ['tableDetail'], },
						{ text: d[curRec].causes_of_death[deathCurRec].complication_subclass, style: ['tableDetail'], },
						{ text: d[curRec].causes_of_death[deathCurRec].other_specify, style: ['tableDetail'], },
						{ text: d[curRec].causes_of_death[deathCurRec].icd_code, style: ['tableDetail'], },
					);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, '*', '*', '*', '*', '*'],
						body: body,
					},
				},],
			);

			// Reviewer Note
			index += 1;
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
						widths: ['auto'],
						headerRows: 1,
						body: [
							[
								{ text: `${p.children[index].prompt}`, style: ['subHeader'], margin: [0, 10, 0, 0], },
							],
							[
								{ text: d[curRec].reviewer_note, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

		}
	}


	return retPage;
}

// Build autopsy_report record - p is the field name & d is the data & pg_break is true/false if need page break
async function autopsy_report(p, d, pg_break) {
	// Name table
	let index = 0;
	let subIndex = 0;
	let body = [];
	let retPage = [];

	// console.log('p: ', p);
	// console.log('d: ', d);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Autopsy Information
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, 'auto',],
				body: [
					[
						{ text: 'Autopsy Information', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.was_there_an_autopsy_referral, 'yes_no_with_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.type_of_autopsy_or_examination, p.children[index + 1].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.is_autopsy_or_exam_report_available, 'no_yes_not_applicable_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.was_toxicology_performed, 'no_yes_not_applicable_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.is_toxicology_report_available, 'no_yes_not_applicable_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.completeness_of_autopsy_information, p.children[index + 5].values), style: ['tableDetail'], },
					],
				],
			}
		}
	]);

	// Reporter Characteristics
	index += 6
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, 'auto',],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.reporter_characteristics.reporter_type, p.children[index].children[subIndex].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.reporter_characteristics.other_specify, style: ['tableDetail'], },
					],
					[
						{
							text: `${p.children[index].children[subIndex + 2].prompt}: ${p.children[index].children[subIndex + 2].children[0].prompt} / ` +
								`${p.children[index].children[subIndex + 2].children[1].prompt} / ${p.children[index].children[subIndex + 2].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{ text: fmtDateByFields(d.reporter_characteristics.date_of_autopsy), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.reporter_characteristics.jurisdiction, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Biometrics
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, 'auto', 250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '4', },
						{}, {}, {},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt} - ${p.children[index].children[subIndex].children[0].prompt} (` +
								`${p.children[index].children[subIndex].children[0].children[0].prompt}):`,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{ text: d.biometrics.mother.height.feet, style: ['tableDetail'], },
						{
							text: `${p.children[index].children[subIndex + 1].children[0].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{ text: d.biometrics.fetus.fetal_weight, style: ['tableDetail'], },
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt} - ${p.children[index].children[subIndex].children[0].prompt} (` +
								`${p.children[index].children[subIndex].children[0].children[1].prompt}):`,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{ text: d.biometrics.mother.height.inches, style: ['tableDetail'], },
						{
							text: `${p.children[index].children[subIndex + 1].children[1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{ text: d.biometrics.fetus.fetal_length, style: ['tableDetail'], },
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt} - ${p.children[index].children[subIndex].children[1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{ text: d.biometrics.mother.weight, style: ['tableDetail'], },
						{
							text: `${p.children[index].children[subIndex + 1].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{ text: d.biometrics.fetus.gestational_age_estimate, style: ['tableDetail'], },
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt} - ${p.children[index].children[subIndex].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{ text: d.biometrics.mother.bmi, style: ['tableDetail'], },
						{}, {},
					],
				],
			},
		},
	]);

	// Findings Relevant to Maternal Death
	index += 1;
	retPage.push({ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 20, 0, 5] },);

	// Gross Findings
	let lenArr = d.relevant_maternal_death_findings.gross_findings.length;
	let startArr = 0;
	let endArr = lenArr;

	// Build Header rows
	let row = new Array();
	row.push(
		{ text: p.children[index].children[subIndex].prompt, style: ['subHeader', 'blueFill'], colSpan: '3', },
		{}, {},
	);
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[subIndex].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '3', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: d.relevant_maternal_death_findings.gross_findings[curRec].finding, style: ['tableDetail'], },);
			row.push({ text: d.relevant_maternal_death_findings.gross_findings[curRec].comment, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, '*', '*'],
				body: body,
			},
		},],
	);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	// Microscopic Findings
	lenArr = d.relevant_maternal_death_findings.microscopic_findings.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].children[subIndex + 1].prompt, style: ['subHeader', 'blueFill'], colSpan: '3', },
		{}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[subIndex].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '3', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: d.relevant_maternal_death_findings.microscopic_findings[curRec].finding, style: ['tableDetail'], },);
			row.push({ text: d.relevant_maternal_death_findings.microscopic_findings[curRec].comment, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, '*', '*'],
				body: body,
			},
		},],
	);

	// Was Toxicology Positive for Drugs?
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 0,
				widths: [250, 'auto',],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', margin: [0, 10, 0, 10], },
						{ text: lookupFieldArr(d.was_drug_toxicology_positive, p.children[index].values), style: ['tableDetail'], margin: [0, 10, 0, 10], },
					],
				],
			},
		},
	]);

	// Toxicology
	index += 1;
	lenArr = d.toxicology.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '7', },
		{}, {}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex + 4].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex + 5].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '7', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: d.toxicology[curRec].substance, style: ['tableDetail'], },);
			row.push({ text: d.toxicology[curRec].substance_other, style: ['tableDetail'], },);
			row.push({ text: d.toxicology[curRec].concentration, style: ['tableDetail'], },);
			row.push({ text: d.toxicology[curRec].unit_of_measure, style: ['tableDetail'], },);
			row.push({ text: `${lookupFieldArr(d.toxicology[curRec].level, p.children[index].children[subIndex + 4].values)}`, style: ['tableDetail'], },);
			row.push({ text: d.toxicology[curRec].comment, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 'auto', 150, '*', '*', '*', 250],
				body: body,
			},
		},],
	);

	// ICD Code Version
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 0,
				widths: [250, 'auto',],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', margin: [0, 10, 0, 10], },
						{ text: d.icd_code_version, style: ['tableDetail'], margin: [0, 10, 0, 10], },
					],
				],
			},
		},
	]);

	// Coroner/Medical Examiner Causes of Death
	index += 1;
	lenArr = d.causes_of_death.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '5', },
		{}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: lookupFieldArr(d.causes_of_death[curRec].type, p.children[index].children[subIndex].values), style: ['tableDetail'], },);
			row.push({ text: d.causes_of_death[curRec].cause, style: ['tableDetail'], },);
			row.push({ text: d.causes_of_death[curRec].icd_code, style: ['tableDetail'], },);
			row.push({ text: d.causes_of_death[curRec].comment, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 'auto', 200, '*', 250],
				body: body,
			},
		},],
	);

	// Reviewer's Notes
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 0,
				widths: ['auto',],
				body: [
					[{ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 10, 0, 0], },],
					[{ text: d.reviewer_note, style: ['tableDetail'], },],
				],
			},
		},
	]);

	return retPage;
}

// Build prenatal record - p is the field name & d is the data & pg_break is true/false if need page break
async function prenatal(p, d, pg_break) {
	// Name table
	let index = 0;
	let subIndex = 0;
	let retPage = [];

	// console.log('p: ', p);
	// console.log('d: ', d);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Record / Facility
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, 'auto',],
				body: [
					[
						{ text: 'Record / Facility', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care_record_no, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.number_of_pnc_sources, p.children[index + 1].values), style: ['tableDetail'], },
					],
				],
			}
		}
	]);

	// Primary Prenatal Care Facility
	index += 2;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*', 150, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '4', },
						{}, {}, {},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupFieldArr(d.primary_prenatal_care_facility.place_type, p.children[index].children[subIndex].values),
							style: ['tableDetail'],
						},
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.primary_prenatal_care_facility.other_place_type, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupFieldArr(d.primary_prenatal_care_facility.primary_provider_type, p.children[index].children[subIndex + 2].values),
							style: ['tableDetail'],
						},
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.primary_prenatal_care_facility.specify_other_provider_type, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupFieldArr(d.primary_prenatal_care_facility.principal_source_of_payment, p.children[index].children[subIndex + 4].values),
							style: ['tableDetail'],
						},
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.primary_prenatal_care_facility.other_payment_source, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupGlobalArr(d.primary_prenatal_care_facility.is_use_wic, 'yes_no'),
							style: ['tableDetail'],
						},
						{}, {},
					],
				],
			}
		}
	]);

	// Location of Primary Prenatal Care Facility
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.location_of_primary_prenatal_care_facility.street} / ${d.location_of_primary_prenatal_care_facility.apartment}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 2].prompt}, ${p.children[index].children[subIndex + 3].prompt} ` +
								`${p.children[index].children[subIndex + 4].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.location_of_primary_prenatal_care_facility.city}, ${lookupGlobalArr(d.location_of_primary_prenatal_care_facility.state, 'state')} ` +
								`${d.location_of_primary_prenatal_care_facility.zip_code}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 5].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.location_of_primary_prenatal_care_facility.county}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 8].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.location_of_primary_prenatal_care_facility.feature_matching_geography_type}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 13].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.location_of_primary_prenatal_care_facility.naaccr_census_tract_certainty_code}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 14].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.location_of_primary_prenatal_care_facility.naaccr_census_tract_certainty_type}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 19].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${d.location_of_primary_prenatal_care_facility.urban_status}`,
							style: ['tableDetail'],
						},
					],
				],
			},
		},
	]);

	// Prior Surgical Procedures Before this Pregnancy
	index += 1;
	let lenArr = d.prior_surgical_procedures_before_pregnancy.length;
	let startArr = 0;
	let endArr = lenArr;

	// Build Header rows
	let body = [];
	let row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '4', },
		{}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: fmtStrDate(d.prior_surgical_procedures_before_pregnancy[curRec].date), style: ['tableDetail'], },);
			row.push({ text: d.prior_surgical_procedures_before_pregnancy[curRec].procedure, style: ['tableDetail'], },);
			row.push({ text: d.prior_surgical_procedures_before_pregnancy[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 200, '*'],
				body: body,
			},
		},],
	);

	// Were there Documented Preexisting Medical Conditions?
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.had_pre_existing_conditions, 'yes_no'), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Pre-existing Conditions
	index += 1;
	lenArr = d.pre_existing_conditons_grid.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '5', },
		{}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: lookupFieldArr(d.pre_existing_conditons_grid[curRec].condition, p.children[index].children[0].values), style: ['tableDetail'], },);
			row.push({ text: d.pre_existing_conditons_grid[curRec].other, style: ['tableDetail'], },);
			row.push({ text: d.pre_existing_conditons_grid[curRec].duration, style: ['tableDetail'], },);
			row.push({ text: d.pre_existing_conditons_grid[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 200, 100, '*'],
				body: body,
			},
		},],
	);

	// Were there Documented Mental Medical Conditions?
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.were_there_documented_mental_health_conditions, 'yes_no'), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Family Medical History
	index += 1;
	lenArr = d.family_medical_history.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', },
		{}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: lookupFieldArr(d.family_medical_history[curRec].relation, p.children[index].children[0].values), style: ['tableDetail'], },);
			row.push({ text: d.family_medical_history[curRec].condition, style: ['tableDetail'], },);
			row.push({ text: lookupGlobalArr(d.family_medical_history[curRec].is_living, 'yes_no'), style: ['tableDetail'], },);
			row.push({ text: d.family_medical_history[curRec].age_at_death, style: ['tableDetail'], },);
			row.push({ text: d.family_medical_history[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 150, 100, 100, '*'],
				body: body,
			},
		},],
	);

	// Was there Evidence of Substance Use?
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.evidence_of_substance_use, 'yes_no'), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Evidence of Substance Use
	index += 1;
	lenArr = d.substance_use_grid.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', },
		{}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: lookupGlobalArr(d.substance_use_grid[curRec].substance, 'substance'), style: ['tableDetail'], },);
			row.push({ text: d.substance_use_grid[curRec].substance_other, style: ['tableDetail'], },);
			row.push({ text: lookupGlobalArr(d.substance_use_grid[curRec].screening, 'yes_no'), style: ['tableDetail'], },);
			row.push({ text: lookupGlobalArr(d.substance_use_grid[curRec].couseling_education, 'yes_no'), style: ['tableDetail'], },);
			row.push({ text: d.substance_use_grid[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 150, 100, 100, '*'],
				body: body,
			},
		},],
	);

	// Pregnancy History
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [100, '*', 100, '*', 100, '*'],
				body: [
					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.gravida, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.para, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.abortions, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Pregnancy History Details
	subIndex = 3;
	lenArr = d.pregnancy_history.details_grid.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '8', },
		{}, {}, {}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[subIndex].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex].children[5].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex].children[6].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '8', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: fmtStrDate(d.pregnancy_history.details_grid[curRec].date_ended), style: ['tableDetail'], },);
			row.push(
				{
					text: lookupFieldArr(d.pregnancy_history.details_grid[curRec].outcome, p.children[index].children[subIndex].children[1].values),
					style: ['tableDetail'],
				},
			);
			row.push({ text: d.pregnancy_history.details_grid[curRec].gestational_age, style: ['tableDetail'], },);
			row.push({ text: d.pregnancy_history.details_grid[curRec].birth_weight, style: ['tableDetail'], },);
			row.push({ text: d.pregnancy_history.details_grid[curRec].method_of_delivery, style: ['tableDetail'], },);
			row.push({ text: d.pregnancy_history.details_grid[curRec].complications, style: ['tableDetail'], },);
			row.push({ text: lookupGlobalArr(d.pregnancy_history.details_grid[curRec].is_now_living, 'yes_no'), style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, '*', '*', '*', '*', '*', '*', '*'],
				body: body,
			},
		},],
	);

	// Intendednes (Sentinel Pregnancy)
	index += 1;
	subIndex = 0;

	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{
							text: `${p.children[index].children[subIndex].prompt}: ${p.children[index].children[subIndex].children[0].prompt} / ` +
								`${p.children[index].children[subIndex].children[1].prompt} / ${p.children[index].children[subIndex].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${fmtDateByFields(d.intendedenes.date_birth_control_was_discontinued)}`,
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.intendedenes.was_pregnancy_planned, p.children[index].children[subIndex + 1].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.intendedenes.was_patient_using_birth_control, p.children[index].children[subIndex + 2].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.intendedenes.was_patient_using_birth_control_other_specify, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Infertility Treatment (Sentinel Pregnancy)
	index += 1;
	subIndex = 0;

	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.infertility_treatment.was_pregnancy_result_of_infertility_treatment, 'yes_no'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.infertility_treatment.fertility_enhanding_drugs, 'yes_no'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.infertility_treatment.assisted_reproductive_technology, 'yes_no'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.infertility_treatment.art_type, p.children[index].children[subIndex + 3].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.infertility_treatment.specify_other_art_type, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.infertility_treatment.cycle_number, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.infertility_treatment.embryos_transferred, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.infertility_treatment.embryos_growing, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Sentinel Pregnancy - Part 1 (2 columns)
	index += 1;
	subIndex = 0;

	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					// Date of Last Normal Menses
					[
						{
							text: `${p.children[index].children[subIndex].prompt}: ${p.children[index].children[subIndex].children[0].prompt} / ` +
								`${p.children[index].children[subIndex].children[1].prompt} / ${p.children[index].children[subIndex].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${fmtDateByFields(d.current_pregnancy.date_of_last_normal_menses)}`,
							style: ['tableDetail'],
						},
					],
					// Estimated Date of Delivery
					[
						{
							text: `${p.children[index].children[subIndex + 1].prompt}: ${p.children[index].children[subIndex + 1].children[0].prompt} / ` +
								`${p.children[index].children[subIndex + 1].children[1].prompt} / ${p.children[index].children[subIndex + 1].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${fmtDateByFields(d.current_pregnancy.estimated_date_of_confinement)}`,
							style: ['tableDetail'],
						},
					],
					[
						{
							text: `${p.children[index].children[subIndex + 1].children[3].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: lookupFieldArr(d.current_pregnancy.estimated_date_of_confinement.estimate_based_on, p.children[index].children[subIndex + 1].children[3].values),
							style: ['tableDetail'],
						},
					],
					// Date of First Prenatal Visit
					[
						{
							text: `${p.children[index].children[subIndex + 2].prompt}: ${p.children[index].children[subIndex + 2].children[0].prompt} / ` +
								`${p.children[index].children[subIndex + 2].children[1].prompt} / ${p.children[index].children[subIndex + 2].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${fmtDateByFields(d.current_pregnancy.date_of_1st_prenatal_visit)}`,
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].children[3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.date_of_1st_prenatal_visit.gestational_age_weeks, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].children[4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.date_of_1st_prenatal_visit.gestational_age_days, style: ['tableDetail'], },
					],
					// Date of First Ultrasound
					[
						{
							text: `${p.children[index].children[subIndex + 3].prompt}: ${p.children[index].children[subIndex + 3].children[0].prompt} / ` +
								`${p.children[index].children[subIndex + 3].children[1].prompt} / ${p.children[index].children[subIndex + 3].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${fmtDateByFields(d.current_pregnancy.date_of_1st_ultrasound)}`,
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].children[3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.date_of_1st_ultrasound.gestational_age_at_first_ultrasound, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].children[4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.date_of_1st_ultrasound.gestational_age_at_first_ultrasound_days, style: ['tableDetail'], },
					],
					// Date of Last Prenatal Visit
					[
						{
							text: `${p.children[index].children[subIndex + 4].prompt}: ${p.children[index].children[subIndex + 4].children[0].prompt} / ` +
								`${p.children[index].children[subIndex + 4].children[1].prompt} / ${p.children[index].children[subIndex + 4].children[2].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{
							text: `${fmtDateByFields(d.current_pregnancy.date_of_last_prenatal_visit)}`,
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].children[3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.date_of_last_prenatal_visit.gestational_age_at_last_prenatal_visit, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].children[4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.date_of_last_prenatal_visit.gestational_age_at_last_prenatal_visit_days, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Sentinel Pregnancy - Part 2 (6 columns)
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [150, '*', 150, '*', 100, '*'],
				body: [
					// Height, Pre-Preg Weight, BMI
					[
						{
							text: `${p.children[index].children[subIndex + 5].prompt} - ${p.children[index].children[subIndex + 5].children[0].prompt} / ` +
								`${p.children[index].children[subIndex + 5].children[1].prompt}: `,
							style: ['tableLabel'],
							alignment: 'right',
						},
						{ text: `${d.current_pregnancy.height.feet} / ${d.current_pregnancy.height.inches}`, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.pre_pregnancy_weight, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.bmi, style: ['tableDetail'], },
					],
					// Weight-First, Weight-Last, Weight-Gain
					[
						{ text: `${p.children[index].children[subIndex + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.weight_at_1st_visit, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 9].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.weight_at_last_visit, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 10].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.weight_gain, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Sentinel Pregnancy - Part 3 (back to 2 columns)
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					// Total Prenatal Visits, Trimester First Visit, # of Fetuses, Home Delivery? Attended Prenatal Alone, City & State of Birthing Facility
					[
						{ text: `${p.children[index].children[subIndex + 11].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.total_number_of_visits, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 12].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.current_pregnancy.trimester_of_first_pnc_visit, p.children[index].children[subIndex + 12].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 13].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.number_of_fetuses, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 14].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.current_pregnancy.was_home_delivery_planned, 'yes_no'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 15].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.current_pregnancy.attended_prenatal_visits_alone, 'yes_no_with_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 16].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.intended_birthing_facility, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	// Routine Monitoring
	index += 1;
	subIndex = 0;
	lenArr = d.routine_monitoring.length;
	startArr = 0;
	endArr = lenArr;

	// Arrays for Charts
	let chartArr = {
		bloodPressure: {
			chartLabels: [],
			chartData: [[],[]],
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

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '4', },
		{}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: 'Date', style: ['tableLabel', 'blueFill'], },);
	row.push({ text: 'Medical Information', style: ['tableLabel', 'blueFill'], },);
	row.push({ text: 'Comment(s)', style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: fmtStrDate(d.routine_monitoring[curRec].date_and_time), style: ['tableDetail'], },);
			row.push({
				columns: [
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${p.children[index].children[subIndex + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${p.children[index].children[subIndex + 9].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${p.children[index].children[subIndex + 10].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: `${p.children[index].children[subIndex + 11].prompt}: `, style: ['tableLabel'], alignment: 'right', },
					],
					[
						{ text: `${d.routine_monitoring[curRec].gestational_age_weeks || ' '}`, style: ['tableDetail'], },
						{ text: `${d.routine_monitoring[curRec].gestational_age_days || ' '}`, style: ['tableDetail'], },
						{ text: `${d.routine_monitoring[curRec].systolic_bp || ' '}`, style: ['tableDetail'], },
						{ text: `${d.routine_monitoring[curRec].diastolic || ' '}`, style: ['tableDetail'], },
						{ text: `${d.routine_monitoring[curRec].heart_rate || ' '}`, style: ['tableDetail'], },
						{ text: `${d.routine_monitoring[curRec].oxygen_saturation || ' '}`, style: ['tableDetail'], },
						{ text: lookupFieldArr(d.routine_monitoring[curRec].urine_protein, p.children[index].children[subIndex + 7].values), style: ['tableDetail'], },
						{ text: lookupFieldArr(d.routine_monitoring[curRec].urine_ketones, p.children[index].children[subIndex + 8].values), style: ['tableDetail'], },
						{ text: lookupFieldArr(d.routine_monitoring[curRec].urine_glucose, p.children[index].children[subIndex + 9].values), style: ['tableDetail'], },
						{ text: `${d.routine_monitoring[curRec].blood_hematocrit || ' '}`, style: ['tableDetail'], },
						{ text: `${d.routine_monitoring[curRec].weight || ' '}`, style: ['tableDetail'], },
					],
				],
			});
			row.push({ text: d.routine_monitoring[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
			// Prepare arrays to display graphs
			chartArr.bloodPressure.chartLabels.unshift(fmtStrDate(d.routine_monitoring[curRec].date_and_time));
			chartArr.weightGain.chartLabels.unshift(fmtStrDate(d.routine_monitoring[curRec].date_and_time));
			chartArr.hematocrit.chartLabels.unshift(fmtStrDate(d.routine_monitoring[curRec].date_and_time));
			chartArr.bloodPressure.chartData[0].unshift(+d.routine_monitoring[curRec].systolic_bp);
			chartArr.bloodPressure.chartData[1].unshift(+d.routine_monitoring[curRec].diastolic);
			chartArr.weightGain.chartData.unshift(+d.routine_monitoring[curRec].weight);
			chartArr.hematocrit.chartData.unshift(+d.routine_monitoring[curRec].blood_hematocrit);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 75, 200, '*',],
				body: body,
			},
		},
	],);

	// Graphs for Routine Monitoring Records (index 16, 17 & 18)
	index += 1;
	subIndex = 0;
	body = [];

	// Build configuration for Blood Pressure
	let bpData = {
		labels: chartArr.bloodPressure.chartLabels,
		datasets: [
			{
				label: 'Systolic',
				fill: false,
				backgroundColor: 'rgb(0, 0, 255)',
				borderColor: 'rgb(0, 0, 255)',
				data: chartArr.bloodPressure.chartData[0],
			},
			{
				label: 'Diastolic',
				fill: false,
				backgroundColor: 'rgb(255, 0, 0)',
				borderColor: 'rgb(255, 0, 0)',
				data: chartArr.bloodPressure.chartData[1],
			},
		]
	};

	// Add Blood Pressure header
	body.push([
		{ text: p.children[index].prompt, style: ['tableLabel'], alignment: 'center', },
	],);

	// Get the Blood Pressure chart and push to pdf
	let bpImg = await doChart2('bpData', bpData);
	body.push([
		{ image: bpImg, width: 800, alignment: 'center', },
	],);

	// console.log('bpImg: ', bpImg);

	// Now push it to the full PDF
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: ['*'],
				body: body,
			},
		},
	]);

	// Build configuration for Weight Gain
	body = [];
	let wgData = {
		labels: chartArr.weightGain.chartLabels,
		datasets: [
			{
				label: 'Weight Gain',
				fill: false,
				backgroundColor: 'rgb(0, 0, 255)',
				borderColor: 'rgb(0, 0, 255)',
				data: chartArr.weightGain.chartData,
			},
		]
	};
	
	// Add Weight header
	body.push([
		{ text: p.children[index + 1].prompt, style: ['tableLabel'], alignment: 'center', },
	],);

	// Get the Weight Gain chart and push to pdf
	let wgImg = await doChart2('wgData', wgData);
	body.push([
		{ image: wgImg, width: 800, alignment: 'center', },
	],);

	// Now push it to the full PDF
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: ['*'],
				body: body,
			},
		},
	]);

	// Build configuration for Hematocrit
	body = [];
	let hData = {
		labels: chartArr.hematocrit.chartLabels,
		datasets: [
			{
				label: 'Blood Hematocrit',
				fill: false,
				backgroundColor: 'rgb(0, 0, 255)',
				borderColor: 'rgb(0, 0, 255)',
				data: chartArr.hematocrit.chartData,
			},
		]
	};
	
	// Add Blood Hematocrit header
	body.push([
		{ text: p.children[index + 2].prompt, style: ['tableLabel'], alignment: 'center', },
	],);

	// Get the Blood Hematocrit chart and push to pdf
	let hImg = await doChart2('hData', hData);
	body.push([
		{ image: hImg, width: 800, alignment: 'center', },
	],);

	retPage.push([
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
			table: {
				headerRows: 1,
				widths: ['*'],
				body: body,
			},
		},
	]);

	// Highest Blood Pressure
	index += 3;
	subIndex = 0;

	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*', 100, '*', 100, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: ${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.highest_blood_pressure.systolic, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.highest_blood_pressure.diastolic, style: ['tableDetail'], },
						{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.lowest_hematocrit, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Other Laboratory Tests
	index += 2;
	subIndex = 0;
	lenArr = d.other_lab_tests.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '7', },
		{}, {}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[5].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '7', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: fmtStrDate(d.other_lab_tests[curRec].date_and_time), style: ['tableDetail'], },);
			row.push({ text: d.other_lab_tests[curRec].gestational_age_weeks, style: ['tableDetail'], },);
			row.push({ text: d.other_lab_tests[curRec].gestational_age_days, style: ['tableDetail'], },);
			row.push({ text: d.other_lab_tests[curRec].test_or_procedure, style: ['tableDetail'], },);
			row.push({ text: d.other_lab_tests[curRec].results, style: ['tableDetail'], },);
			row.push({ text: d.other_lab_tests[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 50, 50, 150, 100, '*'],
				body: body,
			},
		},],
	);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	// Diagnostic Procedures
	index += 1;
	subIndex = 0;
	lenArr = d.diagnostic_procedures.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', },
		{}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: fmtStrDate(d.diagnostic_procedures[curRec].date), style: ['tableDetail'], },);
			row.push({ text: d.diagnostic_procedures[curRec].gestational_age_weeks, style: ['tableDetail'], },);
			row.push({ text: d.diagnostic_procedures[curRec].gestational_age_days, style: ['tableDetail'], },);
			row.push({ text: d.diagnostic_procedures[curRec].procedure, style: ['tableDetail'], },);
			row.push({ text: d.diagnostic_procedures[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 50, 50, 150, '*'],
				body: body,
			},
		},],
	);

	// Problems Identified during Sentinel Pregnancy (yes/no)
	index += 1;
	subIndex = 0;

	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.were_there_problems_identified, 'yes_no'), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Problems Identified during Sentinel Pregnancy
	index += 1;
	subIndex = 0;
	lenArr = d.problems_identified_grid.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', },
		{}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: fmtStrDate(d.problems_identified_grid[curRec].date_1st_noted), style: ['tableDetail'], },);
			row.push({ text: d.problems_identified_grid[curRec].gestational_age_weeks, style: ['tableDetail'], },);
			row.push({ text: d.problems_identified_grid[curRec].gestational_age_days, style: ['tableDetail'], },);
			row.push({ text: d.problems_identified_grid[curRec].problem, style: ['tableDetail'], },);
			row.push({ text: d.problems_identified_grid[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 50, 50, 150, '*'],
				body: body,
			},
		},],
	);

	// Were there any Adverse Reactions
	index += 1;
	subIndex = 0;

	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.were_there_adverse_reactions, 'yes_no'), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Prescribed Medications/Drugs
	index += 1;
	subIndex = 0;
	lenArr = d.medications_and_drugs_during_pregnancy.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '8', },
		{}, {}, {}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[5].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[6].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '8', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: fmtStrDate(d.medications_and_drugs_during_pregnancy[curRec].date), style: ['tableDetail'], },);
			row.push({ text: d.medications_and_drugs_during_pregnancy[curRec].gestational_age_weeks, style: ['tableDetail'], },);
			row.push({ text: d.medications_and_drugs_during_pregnancy[curRec].gestational_age_days, style: ['tableDetail'], },);
			row.push({ text: d.medications_and_drugs_during_pregnancy[curRec].medication, style: ['tableDetail'], },);
			row.push({ text: d.medications_and_drugs_during_pregnancy[curRec].dose_frequency_duration, style: ['tableDetail'], },);
			row.push({ text: d.medications_and_drugs_during_pregnancy[curRec].reason, style: ['tableDetail'], },);
			row.push({ text: lookupGlobalArr(d.medications_and_drugs_during_pregnancy[curRec].is_adverse_reaction, 'yes_no'), style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 50, 50, 100, 150, '*', 100],
				body: body,
			},
		},],
	);

	// Were there Pre-Delivery Hospitalizations?
	index += 1;
	subIndex = 0;

	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.were_there_pre_delivery_hospitalizations, 'yes_no'), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Pre-Delivery Hospitalization Details
	index += 1;
	subIndex = 0;
	lenArr = d.pre_delivery_hospitalizations_details.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '8', },
		{}, {}, {}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[5].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[6].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '8', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: fmtStrDate(d.pre_delivery_hospitalizations_details[curRec].date), style: ['tableDetail'], },);
			row.push({ text: d.pre_delivery_hospitalizations_details[curRec].gestational_age_weeks, style: ['tableDetail'], },);
			row.push({ text: d.pre_delivery_hospitalizations_details[curRec].gestational_age_days, style: ['tableDetail'], },);
			row.push({ text: d.pre_delivery_hospitalizations_details[curRec].facility, style: ['tableDetail'], },);
			row.push({ text: d.pre_delivery_hospitalizations_details[curRec].duration, style: ['tableDetail'], },);
			row.push({ text: d.pre_delivery_hospitalizations_details[curRec].reason, style: ['tableDetail'], },);
			row.push({ text: d.pre_delivery_hospitalizations_details[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 50, 50, 50, 100, 150, '*'],
				body: body,
			},
		},],
	);

	// Were there Referrals to Other Medical Specialist?
	index += 1;
	subIndex = 0;

	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.were_medical_referrals_to_others, 'yes_no'), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Medical Referral Details
	index += 1;
	subIndex = 0;
	lenArr = d.medical_referrals.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '7', },
		{}, {}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[5].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '7', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: fmtStrDate(d.medical_referrals[curRec].date), style: ['tableDetail'], },);
			row.push({ text: d.medical_referrals[curRec].gestational_age_weeks, style: ['tableDetail'], },);
			row.push({ text: d.medical_referrals[curRec].gestational_age_days, style: ['tableDetail'], },);
			row.push({ text: d.medical_referrals[curRec].type_of_specialist, style: ['tableDetail'], },);
			row.push({ text: d.medical_referrals[curRec].reason, style: ['tableDetail'], },);
			row.push({ text: lookupGlobalArr(d.medical_referrals[curRec].was_appointment_kept, 'yes_no'), style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 50, 50, 150, '*', 100],
				body: body,
			},
		},],
	);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	// Sources of Prenatal Care, Other than Primary Provider
	index += 1;
	subIndex = 0;
	lenArr = d.other_sources_of_prenatal_care.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '8', },
		{}, {}, {}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[5].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[6].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '8', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: lookupFieldArr(d.other_sources_of_prenatal_care[curRec].place, p.children[index].children[0].values), style: ['tableDetail'], },);
			row.push({ text: lookupFieldArr(d.other_sources_of_prenatal_care[curRec].provider_type, p.children[index].children[1].values), style: ['tableDetail'], },);
			row.push({ text: d.other_sources_of_prenatal_care[curRec].city, style: ['tableDetail'], },);
			row.push({ text: lookupGlobalArr(d.other_sources_of_prenatal_care[curRec].state, 'state'), style: ['tableDetail'], },);
			row.push({ text: fmtStrDate(d.other_sources_of_prenatal_care[curRec].begin_date), style: ['tableDetail'], },);
			row.push({ text: fmtStrDate(d.other_sources_of_prenatal_care[curRec].end_date), style: ['tableDetail'], },);
			row.push({ text: d.other_sources_of_prenatal_care[curRec].pregrid_comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 75, 75, 100, 100, 100, 100, '*'],
				body: body,
			},
		},],
	);

	// Reviewer's Notes
	index += 1;
	subIndex = 0;

	retPage.push([
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
			table: {
				headerRows: 1,
				widths: ['*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['subHeader'], },
					],
					[
						{ text: d.reviewer_note, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	return retPage;
}

// Build er_visit_and_hospital_medical_records record - p is the field name & d is the data & pg_break is true/false if need page break
async function er_visit_and_hospital_medical_records(p, d, pg_break) {
	// Name table
	let index = 0;
	let body = [];
	let retPage = [];
	let allRecs = (typeof g_record_number === 'undefined' || pg_break) ? true : false;
	let lenArr = d.length;
	let startArr = 0;
	let endArr = lenArr;
	let chartRecs = [];
	let chartArr;
	let chartArrTemplate = {
		bloodPressure: {
			chartLabels: [],
			chartData: [[],[]],
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

	// console.log('p: ', p);
	// console.log('d: ', d);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Are there any records
	if (lenArr === 0) {
		retPage.push({ text: 'No ER Visits and Hospitalization records entered', style: ['tableDetail'], },);
	} else {
		if (!allRecs) {
			startArr = g_record_number - 1;
			endArr = startArr + 1;
		}

		// Display record(s)
		for (let curRec = startArr; curRec < endArr; curRec++) {
			index = 0;
			subIndex = 0;

			// Check to see if there are multiple records, if so do a page break
			if ( allRecs && curRec > 0 ) {
				retPage.push({ text: '', pageBreak: 'before' });
			}

			// Record # & Medical Record Number
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
						widths: [250, '*'],
						headerRows: 1,
						body: [
							[
								{ text: `Record #${curRec + 1}`.toUpperCase(), style: ['subHeader'], colSpan: '2' },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].maternal_record_identification.medical_record_no, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Date of Arrival at Hospital/ER
			index += 1;
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
						widths: [250, 60, '*'],
						headerRows: 1,
						body: [
							[
								{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['subHeader'], margin: [0, 20, 0, 0], colSpan: '3', },
								{}, {},
							],
							[
								{
									text: `${p.children[index].children[subIndex].children[0].prompt} / ${p.children[index].children[subIndex].children[1].prompt} / ` +
										`${p.children[index].children[subIndex].children[2].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${fmtDateByFields(d[curRec].basic_admission_and_discharge_information.date_of_arrival)}`,
									style: ['tableDetail', 'lightFill'],
								},
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_arrival.time_of_arrival, style: ['tableDetail'] },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_arrival.gestational_age_weeks, style: ['tableDetail'] },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_arrival.gestational_age_days, style: ['tableDetail'] },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_arrival.days_postpartum, style: ['tableDetail'] },
								{},
							],
						],
					},
				},
			]);

			// Date of Admission to Hospital/ER
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
						widths: [250, 60, '*'],
						headerRows: 1,
						body: [
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['subHeader'], margin: [0, 20, 0, 0], },
								{}, {},
							],
							[
								{
									text: `${p.children[index].children[subIndex + 1].children[0].prompt} / ` +
										`${p.children[index].children[subIndex + 1].children[1].prompt} / ` +
										`${p.children[index].children[subIndex + 1].children[2].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${fmtDateByFields(d[curRec].basic_admission_and_discharge_information.date_of_hospital_admission)}`,
									style: ['tableDetail'],
								},
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].children[3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_admission.time_of_admission, style: ['tableDetail'] },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].children[4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_admission.gestational_age_weeks, style: ['tableDetail'] },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].children[5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_admission.gestational_age_days, style: ['tableDetail'] },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].children[6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_admission.days_postpartum, style: ['tableDetail'] },
								{},
							],
						],
					},
				},
			]);

			// Admission Stuff
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
						widths: [250, '*'],
						headerRows: 0,
						body: [
							[
								{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].basic_admission_and_discharge_information.admission_condition, p.children[index].children[subIndex + 2].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].basic_admission_and_discharge_information.admission_status, p.children[index].children[subIndex + 3].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: d[curRec].basic_admission_and_discharge_information.admission_status_other,
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].basic_admission_and_discharge_information.admission_reason, p.children[index].children[subIndex + 5].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.admission_reason_other, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].basic_admission_and_discharge_information.principle_source_of_payment,
										p.children[index].children[subIndex + 7].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.principle_source_of_payment_other_specify, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 9].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupGlobalArr(d[curRec].basic_admission_and_discharge_information.was_recieved_from_another_hospital, 'yes_no'),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 10].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.from_where, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 11].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupGlobalArr(d[curRec].basic_admission_and_discharge_information.was_transferred_to_another_hospital, 'yes_no'),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 12].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.to_where, style: ['tableDetail'], },
							],
							[
								{
									text: `${p.children[index].children[subIndex + 13].children[0].prompt} / ` +
										`${p.children[index].children[subIndex + 13].children[1].prompt} / ` +
										`${p.children[index].children[subIndex + 13].children[2].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${fmtDateByFields(d[curRec].basic_admission_and_discharge_information.date_of_hospital_discharge)}`,
									style: ['tableDetail'],
								},
							],
						],
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Discharge Stuff
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
						widths: [250, '*'],
						headerRows: 1,
						body: [
							[
								{ text: `${p.children[index].children[subIndex + 13].prompt}: `, style: ['subHeader'], margin: [0, 20, 0, 0], },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 13].children[3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_discharge.time_of_discharge, style: ['tableDetail'] },
							],
							[
								{ text: `${p.children[index].children[subIndex + 13].children[4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_discharge.gestational_age_weeks, style: ['tableDetail'] },
							],
							[
								{ text: `${p.children[index].children[subIndex + 13].children[5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_discharge.gestational_age_days, style: ['tableDetail'] },
							],
							[
								{ text: `${p.children[index].children[subIndex + 13].children[6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_discharge.days_postpartum, style: ['tableDetail'] },
							],
							[
								{ text: `${p.children[index].children[subIndex + 14].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].basic_admission_and_discharge_information.discharge_pregnancy_status,
										p.children[index].children[subIndex + 14].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 15].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupGlobalArr(d[curRec].basic_admission_and_discharge_information.deceased_at_discharge, 'yes_no'),
									style: ['tableDetail'],
								},
							],
						],
					},
				},
			]);

			// Name and Location of Facility
			index += 1;
			subIndex = 0;
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
						widths: [250, '*'],
						headerRows: 0,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', margin: [0, 20, 0, 0], },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.facility_name, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: `${lookupFieldArr(d[curRec].name_and_location_facility.type_of_facility, p.children[index].children[subIndex + 1].values)}`,
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.type_of_facility_other_specify, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.facility_npi_no, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: `${lookupFieldArr(d[curRec].name_and_location_facility.maternal_level_of_care, p.children[index].children[subIndex + 4].values)}`,
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.other_maternal_level_of_care, style: ['tableDetail'], },
							],
							[
								{
									text: `${p.children[index].children[subIndex + 6].prompt} / ${p.children[index].children[subIndex + 7].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${d[curRec].name_and_location_facility.street} / ${d[curRec].name_and_location_facility.apartment}`,
									style: ['tableDetail'],
								},
							],
							[
								{
									text: `${p.children[index].children[subIndex + 8].prompt} / ${p.children[index].children[subIndex + 9].prompt} / ` +
										`${p.children[index].children[subIndex + 10].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${d[curRec].name_and_location_facility.city} / ` +
										`${lookupGlobalArr(d[curRec].name_and_location_facility.state, 'state')} / ` +
										`${d[curRec].name_and_location_facility.zip_code}`,
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 11].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.county, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 14].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.feature_matching_geography_type, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 19].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.naaccr_census_tract_certainty_code, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 20].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.naaccr_census_tract_certainty_type, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 25].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.urban_status, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Travel Time
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
						widths: [250, '*'],
						headerRows: 0,
						body: [
							[
								{ text: 'Travel Time', style: ['subHeader'], colSpan: '2', margin: [0, 20, 0, 0], },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 29].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: `${lookupFieldArr(d[curRec].name_and_location_facility.mode_of_transportation_to_facility,
										p.children[index].children[subIndex + 29].values)}`,
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 30].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.mode_of_transportation_to_facility_other, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 31].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: `${lookupFieldArr(d[curRec].name_and_location_facility.origin_of_travel, p.children[index].children[subIndex + 31].values)}`,
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 32].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.origin_of_travel_other, style: ['tableDetail'], },
							],
							[
								{
									text: `${p.children[index].children[subIndex + 33].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${d[curRec].name_and_location_facility.travel_time_to_hospital.value} ` +
										`${lookupFieldArr(d[curRec].name_and_location_facility.travel_time_to_hospital.unit,
											p.children[index].children[subIndex + 33].children[1].values)}`,
									style: ['tableDetail'],
								},
							],
						],
					},
				},
			]);

			// Internal Transfers
			index += 1;
			let lenArr2 = d[curRec].internal_transfers.length;
			let startArr2 = 0;
			let endArr2 = lenArr2;

			// Build Header rows
			body = [];
			let row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '5', },
				{}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({ text: fmtDateTime(d[curRec].internal_transfers[curRec2].date_and_time), style: ['tableDetail'], },);
					row.push({ text: d[curRec].internal_transfers[curRec2].from_unit, style: ['tableDetail'], },);
					row.push({ text: d[curRec].internal_transfers[curRec2].to_unit, style: ['tableDetail'], },);
					row.push({ text: d[curRec].internal_transfers[curRec2].comments, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, 100, 100, '*'],
						body: body,
					},
				},],
			);

			// Maternal Biometrics
			index += 1;
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
						widths: [150, '*', 150, '*', 150, '*'],
						headerRows: 0,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '6', margin: [0, 20, 0, 0], },
								{}, {}, {}, {}, {},
							],
							[
								{
									text: `${p.children[index].children[subIndex].prompt} - ${p.children[index].children[subIndex].children[0].prompt} / ` +
										`${p.children[index].children[subIndex].children[1].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{ text: `${d[curRec].maternal_biometrics.height.feet} / ${d[curRec].maternal_biometrics.height.inches}`, style: ['tableDetail'], },
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].maternal_biometrics.admission_weight}`, style: ['tableDetail'], },
								{ text: `${p.children[index].children[subIndex].children[2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].maternal_biometrics.height.bmi}`, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Physical Examinations and Evaluations
			index += 1;
			lenArr2 = d[curRec].physical_exam_and_evaluations.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', },
				{}, {}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({ text: fmtDateTime(d[curRec].physical_exam_and_evaluations[curRec2].date_and_time), style: ['tableDetail'], },);
					row.push({ text: d[curRec].physical_exam_and_evaluations[curRec2].exam_evaluation, style: ['tableDetail'], },);
					row.push({
						text: lookupFieldArr(d[curRec].physical_exam_and_evaluations[curRec2].body_system, p.children[index].children[2].values),
						style: ['tableDetail'],
					});
					row.push({ text: d[curRec].physical_exam_and_evaluations[curRec2].findings, style: ['tableDetail'], },);
					row.push({ text: d[curRec].physical_exam_and_evaluations[curRec2].performed_by, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, 200, 100, 200, '*'],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Psychological Examinations and Assessments
			index += 1;
			lenArr2 = d[curRec].psychological_exam_and_assesments.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '5', },
				{}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({ text: fmtDateTime(d[curRec].psychological_exam_and_assesments[curRec2].date_and_time), style: ['tableDetail'], },);
					row.push({ text: d[curRec].psychological_exam_and_assesments[curRec2].exam_assessments, style: ['tableDetail'], },);
					row.push({ text: d[curRec].psychological_exam_and_assesments[curRec2].findings, style: ['tableDetail'], },);
					row.push({ text: d[curRec].psychological_exam_and_assesments[curRec2].performed_by, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, 200, 200, '*'],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Laboratory Tests
			index += 1;
			lenArr2 = d[curRec].labratory_tests.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '7', },
				{}, {}, {}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[5].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '7', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({ text: fmtDateTime(d[curRec].labratory_tests[curRec2].date_and_time), style: ['tableDetail'], },);
					row.push({ text: d[curRec].labratory_tests[curRec2].specimen, style: ['tableDetail'], },);
					row.push({ text: d[curRec].labratory_tests[curRec2].test_name, style: ['tableDetail'], },);
					row.push({ text: d[curRec].labratory_tests[curRec2].result, style: ['tableDetail'], },);
					row.push({
						text: lookupFieldArr(d[curRec].labratory_tests[curRec2].diagnostic_level, p.children[index].children[4].values),
						style: ['tableDetail'],
					});
					row.push({ text: d[curRec].labratory_tests[curRec2].comments, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, 100, 100, 100, 100, '*'],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Pathology
			index += 1;
			lenArr2 = d[curRec].pathology.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '5', },
				{}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({ text: fmtDateTime(d[curRec].pathology[curRec2].date_and_time), style: ['tableDetail'], },);
					row.push({ text: d[curRec].pathology[curRec2].specimen, style: ['tableDetail'], },);
					row.push({ text: d[curRec].pathology[curRec2].exam_type, style: ['tableDetail'], },);
					row.push({ text: d[curRec].pathology[curRec2].findings, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, 100, 100, '*'],
						body: body,
					},
				},],
			);

			// Onset of Labor - Date of Onset of Labor
			index += 1;
			subIndex = 0;
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
						widths: [250, '*', 250, '*'],
						headerRows: 0,
						body: [
							[
								{ text: p.children[index].children[subIndex].prompt, style: ['subHeader'], colSpan: '4', margin: [0, 20, 0, 0], },
								{}, {}, {},
							],
							[
								{
									text: `${p.children[index].children[subIndex].prompt} - ` +
										`${p.children[index].children[subIndex].children[0].prompt} / ` +
										`${p.children[index].children[subIndex].children[1].prompt} / ` +
										`${p.children[index].children[subIndex].children[2].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${fmtDateByFields(d[curRec].onset_of_labor.date_of_onset_of_labor)}`,
									style: ['tableDetail'],
								},
								{},
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].onset_of_labor.date_of_onset_of_labor.time_of_onset_of_labor, style: ['tableDetail'], },
								{ text: `${p.children[index].children[subIndex].children[6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].onset_of_labor.date_of_onset_of_labor.duration_of_labor_prior_to_arrival, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Onset of Labor - Date of Rupture of Membranes
			subIndex = 1;
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
						widths: [250, '*', 250, '*'],
						headerRows: 0,
						body: [
							[
								{ text: p.children[index].children[subIndex].prompt, style: ['subHeader'], colSpan: '4', margin: [0, 20, 0, 0], },
								{}, {}, {},
							],
							[
								{
									text: `${p.children[index].children[subIndex].prompt} - ` +
										`${p.children[index].children[subIndex].children[0].prompt} / ` +
										`${p.children[index].children[subIndex].children[1].prompt} / ` +
										`${p.children[index].children[subIndex].children[2].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${fmtDateByFields(d[curRec].onset_of_labor.date_of_rupture)}`,
									style: ['tableDetail'],
								},
								{},
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].onset_of_labor.date_of_rupture.time_of_rupture, style: ['tableDetail'], },
								{},
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].onset_of_labor.date_of_rupture.time_of_rupture, style: ['tableDetail'], },
								{},
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].onset_of_labor.final_delivery_route, p.children[index].children[subIndex + 1].values),
									style: ['tableDetail'],
								},
								{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].onset_of_labor.onset_of_labor_was, p.children[index].children[subIndex + 2].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupGlobalArr(d[curRec].onset_of_labor.multiple_gestation, 'yes_no'),
									style: ['tableDetail'],
								},
								{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].onset_of_labor.pregnancy_outcome, p.children[index].children[subIndex + 6].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].onset_of_labor.pregnancy_outcome_other_specify, style: ['tableDetail'], },
								{},
								{},
							],
						],
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Vital Signs
			index += 1;
			lenArr2 = d[curRec].vital_signs.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '9', },
				{}, {}, {}, {}, {}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[5].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[6].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[7].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Initialize graph object for each record
			chartArr = JSON.parse(JSON.stringify(chartArrTemplate));

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '9', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({ text: fmtDateTime(d[curRec].vital_signs[curRec2].date_and_time), style: ['tableDetail'], },);
					row.push({ text: d[curRec].vital_signs[curRec2].temperature, style: ['tableDetail'], },);
					row.push({ text: d[curRec].vital_signs[curRec2].pulse, style: ['tableDetail'], },);
					row.push({ text: d[curRec].vital_signs[curRec2].respiration, style: ['tableDetail'], },);
					row.push({ text: d[curRec].vital_signs[curRec2].bp_systolic, style: ['tableDetail'], },);
					row.push({ text: d[curRec].vital_signs[curRec2].bp_diastolic, style: ['tableDetail'], },);
					row.push({ text: d[curRec].vital_signs[curRec2].oxygen_saturation, style: ['tableDetail'], },);
					row.push({ text: d[curRec].vital_signs[curRec2].comments, style: ['tableDetail'], },);
					body.push(row);

					// Prepare array to display graphs
					chartArr.bloodPressure.chartLabels.unshift(fmtDateTime(d[curRec].vital_signs[curRec2].date_and_time));
					chartArr.heartRate.chartLabels.unshift(fmtDateTime(d[curRec].vital_signs[curRec2].date_and_time));
					chartArr.respiration.chartLabels.unshift(fmtDateTime(d[curRec].vital_signs[curRec2].date_and_time));
					chartArr.temperature.chartLabels.unshift(fmtDateTime(d[curRec].vital_signs[curRec2].date_and_time));
					chartArr.bloodPressure.chartData[0].unshift(+d[curRec].vital_signs[curRec2].bp_systolic || 0);
					chartArr.bloodPressure.chartData[1].unshift(+d[curRec].vital_signs[curRec2].bp_diastolic || 0);
					chartArr.heartRate.chartData.unshift(+d[curRec].vital_signs[curRec2].pulse || 0);
					chartArr.respiration.chartData.unshift(+d[curRec].vital_signs[curRec2].respiration || 0);
					chartArr.temperature.chartData.unshift(+d[curRec].vital_signs[curRec2].temperature || 0);
				}
			}

			// Add to the chartRecs array to keep the # of records straight
			chartRecs.push(chartArr);

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, '*', '*', '*', '*', '*', '*', 250],
						body: body,
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Highest BP
			index += 1;
			subIndex = 0;
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
						widths: [250, '*', 250, '*'],
						headerRows: 0,
						body: [
							[
								{
									text: `${p.children[index].prompt} - ${p.children[index].children[0].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{ text: d[curRec].highest_bp.systolic_bp, style: ['tableDetail'], },
								{ text: `${p.children[index].children[1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].highest_bp.diastolic_bp, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Graphs for Temperature, Heart Rate, Respiration & Blood Pressure (index 12, 13, 14, 15)
			index += 1;
			subIndex = 0;
			body = [];

			// Build configuration for Temperature
			let tData = {
				labels: chartArr.temperature.chartLabels,
				datasets: [
					{
						label: 'Temperature',
						fill: false,
						backgroundColor: 'blue',
						borderColor: 'blue',
						data: chartRecs[curRec].temperature.chartData,
					},
				]
			};

			// Add Temperature header
			body.push([
				{ text: p.children[index].prompt, style: ['tableLabel'], alignment: 'center', },
			],);

			// Get the Temperature chart and push to pdf
			let tImg = await doChart2('tData', tData);
			body.push([
				{ image: tImg, width: 800, alignment: 'center', },
			],);

			// Now push it to the full PDF
			retPage.push([
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
					table: {
						headerRows: 1,
						widths: ['*'],
						body: body,
					},
				},
			]);

			// Build configuration for Heart Rate
			body = [];
			let hrData = {
				labels: chartArr.heartRate.chartLabels,
				datasets: [
					{
						label: 'Heart Rate',
						fill: false,
						backgroundColor: 'rgb(0, 0, 255)',
						borderColor: 'rgb(0, 0, 255)',
						data: chartRecs[curRec].heartRate.chartData,
					},
				]
			};

			// Add Heart Rate header
			body.push([
				{ text: p.children[index + 1].prompt, style: ['tableLabel'], alignment: 'center', },
			],);

			// Get the Heart Rate chart and push to pdf
			let hrImg = await doChart2('hrData', hrData);
			body.push([
				{ image: hrImg, width: 800, alignment: 'center', },
			],);

			// Now push it to the full PDF
			retPage.push([
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
					table: {
						headerRows: 1,
						widths: ['*'],
						body: body,
					},
				},
			]);

			// Build configuration for Respiration
			body = [];
			let rData = {
				labels: chartArr.respiration.chartLabels,
				datasets: [
					{
						label: 'Respiration',
						fill: false,
						backgroundColor: 'rgb(0, 0, 255)',
						borderColor: 'rgb(0, 0, 255)',
						data: chartRecs[curRec].respiration.chartData,
					},
				]
			};

			// Add Respiration header
			body.push([
				{ text: p.children[index + 2].prompt, style: ['tableLabel'], alignment: 'center', },
			],);

			// Get the Respiration chart and push to pdf
			let rImg = await doChart2('rData', rData);
			body.push([
				{ image: rImg, width: 800, alignment: 'center', },
			],);

			// Now push it to the full PDF
			retPage.push([
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
					table: {
						headerRows: 1,
						widths: ['*'],
						body: body,
					},
				},
			]);

			// Build configuration for Blood Pressure
			body = [];
			let bpData = {
				labels: chartArr.bloodPressure.chartLabels,
				datasets: [
					{
						label: 'Systolic',
						fill: false,
						backgroundColor: 'rgb(0, 0, 255)',
						borderColor: 'rgb(0, 0, 255)',
						data: chartRecs[curRec].bloodPressure.chartData[0],
					},
					{
						label: 'Diastolic',
						fill: false,
						backgroundColor: 'rgb(255, 0, 0)',
						borderColor: 'rgb(255, 0, 0)',
						data: chartRecs[curRec].bloodPressure.chartData[1],
					},
				]
			};

			// Add Blood Pressure header
			body.push([
				{ text: p.children[index + 3].prompt, style: ['tableLabel'], alignment: 'center', },
			],);

			// Get the Blooc Pressure chart and push to pdf
			let bpImg = await doChart2('bpData', bpData);
			body.push([
				{ image: bpImg, width: 800, alignment: 'center', },
			],);

			// Now push it to the full PDF
			retPage.push([
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
					table: {
						headerRows: 1,
						widths: ['*'],
						body: body,
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Birth Attendant(s)
			index += 4;
			lenArr2 = d[curRec].birth_attendant.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '4', },
				{}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({
						text: `${lookupFieldArr(d[curRec].birth_attendant[curRec2].title, p.children[index].children[0].values)}`,
						style: ['tableDetail'],
					});
					row.push({ text: d[curRec].birth_attendant[curRec2].specify_other, style: ['tableDetail'], },);
					row.push({ text: d[curRec].birth_attendant[curRec2].npi, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 150, '*', 150],
						body: body,
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Complications from Anesthesia?
			index += 1;
			subIndex = 0;
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
						widths: [250, '*'],
						headerRows: 0,
						body: [
							[
								{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: lookupGlobalArr(d[curRec].were_there_complications_of_anesthesia, 'yes_no'), style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Anesthesia
			index += 1;
			lenArr2 = d[curRec].anesthesia.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '4', },
				{}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({
						text: `${fmtDateTime(d[curRec].anesthesia[curRec2].date_time)}`,
						style: ['tableDetail'],
					});
					row.push({ text: d[curRec].anesthesia[curRec2].method, style: ['tableDetail'], },);
					row.push({ text: d[curRec].anesthesia[curRec2].complications, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, '*', 150],
						body: body,
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Adverse Reactions to Medication??
			index += 1;
			subIndex = 0;
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
						widths: [250, '*'],
						headerRows: 0,
						body: [
							[
								{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: lookupGlobalArr(d[curRec].any_adverse_reactions, 'yes_no'), style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// List of All Medications
			index += 1;
			lenArr2 = d[curRec].list_of_medications.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', },
				{}, {}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({ text: `${fmtDateTime(d[curRec].list_of_medications[curRec2].date_and_time)}`, style: ['tableDetail'], },);
					row.push({ text: d[curRec].list_of_medications[curRec2].medication, style: ['tableDetail'], },);
					row.push({ text: d[curRec].list_of_medications[curRec2].dose_frequency_duration, style: ['tableDetail'], },);
					row.push({ text: d[curRec].list_of_medications[curRec2].adverse_reaction, style: ['tableDetail'], },);
					row.push({ text: d[curRec].list_of_medications[curRec2].comments, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, '*', '*', '*', 250],
						body: body,
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Were Surgical Procedures?
			index += 1;
			subIndex = 0;
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
						widths: [250, '*'],
						headerRows: 0,
						body: [
							[
								{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: lookupGlobalArr(d[curRec].any_surgical_procedures, 'yes_no'), style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Surgical Procedures
			index += 1;
			lenArr2 = d[curRec].surgical_procedures.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', },
				{}, {}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({
						text: `${fmtDateTime(d[curRec].surgical_procedures[curRec2].date_and_time)}`,
						style: ['tableDetail'],
					});
					row.push({ text: d[curRec].surgical_procedures[curRec2].hospital_unit, style: ['tableDetail'], },);
					row.push({ text: d[curRec].surgical_procedures[curRec2].procedure, style: ['tableDetail'], },);
					row.push({ text: d[curRec].surgical_procedures[curRec2].performed_by, style: ['tableDetail'], },);
					row.push({ text: d[curRec].surgical_procedures[curRec2].outcome, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, '*', '*', '*', '*'],
						body: body,
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Any Blood or Blood Product Transfusions?
			index += 1;
			subIndex = 0;
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
						widths: [250, '*', 250, '*'],
						headerRows: 0,
						body: [
							[
								{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: lookupGlobalArr(d[curRec].any_blood_transfusions, 'yes_no'), style: ['tableDetail'], },
								{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].patient_blood_type, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Blood Products
			index += 2;
			lenArr2 = d[curRec].blood_product_grid.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '5', },
				{}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({ text: `${fmtDateTime(d[curRec].blood_product_grid[curRec2].date_and_time)}`, style: ['tableDetail'], },);
					row.push({ text: d[curRec].blood_product_grid[curRec2].product, style: ['tableDetail'], },);
					row.push({ text: d[curRec].blood_product_grid[curRec2].number_of_units, style: ['tableDetail'], },);
					row.push({ text: d[curRec].blood_product_grid[curRec2].reaction_complications, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, '*', '*', 250],
						body: body,
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Diagnostic Imaging & Other Technology
			index += 1;
			lenArr2 = d[curRec].diagnostic_imaging_grid.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '5', },
				{}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({ text: `${fmtDateTime(d[curRec].diagnostic_imaging_grid[curRec2].date_and_time)}`, style: ['tableDetail'], },);
					row.push({ text: d[curRec].diagnostic_imaging_grid[curRec2].procedure, style: ['tableDetail'], },);
					row.push({ text: d[curRec].diagnostic_imaging_grid[curRec2].target, style: ['tableDetail'], },);
					row.push({ text: d[curRec].diagnostic_imaging_grid[curRec2].finding, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, '*', '*', 250],
						body: body,
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Referrals & Consultations
			index += 1;
			lenArr2 = d[curRec].referrals_and_consultations.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '5', },
				{}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({ text: `${fmtStrDate(d[curRec].referrals_and_consultations[curRec2].date)}`, style: ['tableDetail'], },);
					row.push({ text: d[curRec].referrals_and_consultations[curRec2].specialist_type, style: ['tableDetail'], },);
					row.push({ text: d[curRec].referrals_and_consultations[curRec2].reason, style: ['tableDetail'], },);
					row.push({ text: d[curRec].referrals_and_consultations[curRec2].recommendations, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, '*', 200, 200],
						body: body,
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Reviewer's Notes
			index += 1;
			subIndex = 0;
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
						widths: ['*'],
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], },
							],
							[
								{ text: d[curRec].reviewer_note, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

		}
	}

	return retPage;
}

// Build other_medical_office_visits record - p is the field name & d is the data & pg_break is true/false if need page break
async function other_medical_office_visits(p, d, pg_break) {
	// Name table
	let index = 0;
	let retPage = [];
	let allRecs = (typeof g_record_number === 'undefined' || pg_break) ? true : false;
	let lenArr = d.length;
	let startArr = 0;
	let endArr = lenArr;

	// console.log('p: ', p);
	// console.log('d: ', d);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Are there any records
	if (lenArr === 0) {
		retPage.push({ text: 'No Other Medical Office Visits records entered', style: ['tableDetail'], },);
	} else {
		if (!allRecs) {
			startArr = g_record_number -1;
			endArr = startArr + 1;
		}

		// Display record(s)
		for (let curRec = startArr; curRec < endArr; curRec++) {
			index = 0;
			subIndex = 0;

			// Check to see if there are multiple records, if so do a page break
			if ( allRecs && curRec > 0 ) {
				retPage.push({ text: '', pageBreak: 'before' });
			}

			// Record # & Visit
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
						widths: [250, 60, '*'],
						headerRows: 1,
						body: [
							[
								{ text: `Record #${curRec + 1}`.toUpperCase(), style: ['subHeader'], colSpan: '3' },
								{}, {},
							],
							[
								{
									text: `${p.children[index].children[subIndex].prompt}: ` +
										`${p.children[index].children[subIndex].children[0].prompt} / ` +
										`${p.children[index].children[subIndex].children[1].prompt} / ` +
										`${p.children[index].children[subIndex].children[2].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${fmtDateByFields(d[curRec].visit.date_of_medical_office_visit)}`,
									style: ['tableDetail', 'lightFill'],
								},
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].visit.date_of_medical_office_visit.arrival_time, style: ['tableDetail'], colSpan: '2', },
								{},
							],
							[
								{
									text: `${p.children[index].children[subIndex].children[4].prompt} / Days:`,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${d[curRec].visit.date_of_medical_office_visit.gestational_age_weeks} / ` +
										`${d[curRec].visit.date_of_medical_office_visit.gestational_age_days}`,
									style: ['tableDetail'],
								},
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].visit.date_of_medical_office_visit.days_postpartum, style: ['tableDetail'], colSpan: '2', },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].visit.visit_type, p.children[index].children[subIndex + 1].values),
									style: ['tableDetail'],
									colSpan: '2',
								},
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].visit.visit_type_other_specify, style: ['tableDetail'], colSpan: '2', },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].visit.medical_record_no, style: ['tableDetail'], colSpan: '2', },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].visit.reason_for_visit_or_chief_complaint, style: ['tableDetail'], colSpan: '2', },
								{},
							],
						],
					},
				},
			]);

			// Medical Care Facility
			index += 1;
			subIndex = 0;

			// Record # & Visit
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
						widths: [250, '*'],
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2' },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].medical_care_facility.place_type, p.children[index].children[subIndex].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].medical_care_facility.specify_other_place_type, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].medical_care_facility.provider_type, p.children[index].children[subIndex + 2].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].medical_care_facility.specify_other_provider_type, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].medical_care_facility.payment_source, p.children[index].children[subIndex + 4].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].medical_care_facility.other_payment_source, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].medical_care_facility.pregnancy_status, p.children[index].children[subIndex + 6].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupGlobalArr(d[curRec].medical_care_facility.was_this_provider_her_primary_prenatal_care_provider, 'yes_no'),
									style: ['tableDetail'],
								},
							],
						],
					},
				},
			]);

			// Location of Medical Care Facility
			index += 1;
			subIndex = 0;

			// Record # & Visit
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
						widths: [250, '*'],
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2' },
								{},
							],
							[
								{
									text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${d[curRec].location_of_medical_care_facility.street} / ${d[curRec].location_of_medical_care_facility.apartment}`,
									style: ['tableDetail'],
								},
							],
							[
								{
									text: `${p.children[index].children[subIndex + 2].prompt} / ${p.children[index].children[subIndex + 3].prompt} / ` +
										`${p.children[index].children[subIndex + 4].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${d[curRec].location_of_medical_care_facility.city} / ` +
										`${lookupGlobalArr(d[curRec].location_of_medical_care_facility.state, 'state')} / ` +
										`${d[curRec].location_of_medical_care_facility.zip_code}`,
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].location_of_medical_care_facility.city}`, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].location_of_medical_care_facility.feature_matching_geography_type}`, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 13].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].location_of_medical_care_facility.naaccr_census_tract_certainty_code}`, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 14].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].location_of_medical_care_facility.naaccr_census_tract_certainty_type}`, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 19].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].location_of_medical_care_facility.urban_status}`, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Relevant Medical History
			index += 1;
			let lenArr2 = d[curRec].relevant_medical_history.length;
			let startArr2 = 0;
			let endArr2 = lenArr2;

			// Build Header rows
			let body = [];
			let row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '3', },
				{}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '3', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center' },);
					row.push({ text: d[curRec].relevant_medical_history[curRec2].finding, style: ['tableDetail'], },);
					row.push({ text: d[curRec].relevant_medical_history[curRec2].comments, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 250, '*'],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// // Relevant Family History
			index += 1;
			lenArr2 = d[curRec].relevant_family_history.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '3', },
				{}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '3', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center' },);
					row.push({ text: d[curRec].relevant_family_history[curRec2].finding, style: ['tableDetail'], },);
					row.push({ text: d[curRec].relevant_family_history[curRec2].comments, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 250, '*'],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// // Relevant Social History
			index += 1;
			lenArr2 = d[curRec].relevant_social_history.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '3', },
				{}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '3', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center' },);
					row.push({ text: d[curRec].relevant_social_history[curRec2].finding, style: ['tableDetail'], },);
					row.push({ text: d[curRec].relevant_social_history[curRec2].comments, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 250, '*'],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Vital Signs
			index += 1;
			lenArr2 = d[curRec].vital_signs.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '4', },
				{}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: 'Date and Time', style: ['tableLabel', 'blueFill'], },);
			row.push({ text: 'Medical Information', style: ['tableLabel', 'blueFill'], },);
			row.push({ text: 'Comment(s)', style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center' },);
					row.push({ text: fmtDateTime(d[curRec].vital_signs[curRec2].date_and_time), style: ['tableDetail'], },);
					row.push({
						columns: [
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
							],
							[
								{ text: `${d[curRec].vital_signs[curRec2].temperature || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].vital_signs[curRec2].pulse || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].vital_signs[curRec2].respiration || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].vital_signs[curRec2].bp_systolic || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].vital_signs[curRec2].bp_diastolic || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].vital_signs[curRec2].oxygen_saturation || ' '}`, style: ['tableDetail'], },
							],
						],
					});
					row.push({ text: d[curRec].vital_signs[curRec2].comments, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, 250, '*'],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Laboratory Tests
			index += 1;
			lenArr2 = d[curRec].laboratory_tests.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '4', },
				{}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: 'Date and Time', style: ['tableLabel', 'blueFill'], },);
			row.push({ text: 'Medical Information', style: ['tableLabel', 'blueFill'], },);
			row.push({ text: 'Comment(s)', style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center' },);
					row.push({ text: fmtDateTime(d[curRec].laboratory_tests[curRec2].date_and_time), style: ['tableDetail'], },);
					row.push({
						columns: [
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
							],
							[
								{ text: `${d[curRec].laboratory_tests[curRec2].specimen || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].laboratory_tests[curRec2].test_name || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].laboratory_tests[curRec2].result || ' '}`, style: ['tableDetail'], },
								{ 
									text: lookupFieldArr(d[curRec].laboratory_tests[curRec2].diagnostic_level, p.children[index].children[subIndex + 4].values), 
									style: ['tableDetail'], 
								},
							],
						],
					});
					row.push({ text: d[curRec].laboratory_tests[curRec2].comments, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, 250, '*'],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Diagnostic Imaging and Other Technology
			index += 1;
			lenArr2 = d[curRec].diagnostic_imaging_and_other_technology.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '5', },
				{}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center' },);
					row.push({ text: fmtDateTime(d[curRec].diagnostic_imaging_and_other_technology[curRec2].date_and_time), style: ['tableDetail'], },);
					row.push({ text: d[curRec].diagnostic_imaging_and_other_technology[curRec2].procedure, style: ['tableDetail'], },);
					row.push({ text: d[curRec].diagnostic_imaging_and_other_technology[curRec2].target_procedure, style: ['tableDetail'], },);
					row.push({ text: d[curRec].diagnostic_imaging_and_other_technology[curRec2].finding, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, 200, 200, '*'],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Physical Examinations
			index += 1;
			lenArr2 = d[curRec].physical_exam.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '4', },
				{}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center' },);
					row.push({
						text: lookupFieldArr(d[curRec].physical_exam[curRec2].body_system, p.children[index].children[subIndex].values),
						style: ['tableDetail'],
					});
					row.push({ text: d[curRec].physical_exam[curRec2].finding, style: ['tableDetail'], },);
					row.push({ text: d[curRec].physical_exam[curRec2].comment, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 150, 200, '*'],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Referrals and Consultations
			index += 1;
			lenArr2 = d[curRec].referrals_and_consultations.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '5', },
				{}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center' },);
					row.push({ text: fmtStrDate(d[curRec].referrals_and_consultations[curRec2].date), style: ['tableDetail'], },);
					row.push({ text: d[curRec].referrals_and_consultations[curRec2].speciality, style: ['tableDetail'], },);
					row.push({ text: d[curRec].referrals_and_consultations[curRec2].reason, style: ['tableDetail'], },);
					row.push({ text: d[curRec].referrals_and_consultations[curRec2].recommendations, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 70, 100, 150, '*'],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Prescribed Medications/Drugs
			index += 1;
			lenArr2 = d[curRec].medications.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', },
				{}, {}, {}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 4].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center' },);
					row.push({ text: fmtDateTime(d[curRec].medications[curRec2].date_and_time), style: ['tableDetail'], },);
					row.push({ text: d[curRec].medications[curRec2].medication_name, style: ['tableDetail'], },);
					row.push({ text: d[curRec].medications[curRec2].dose_frequeny_duration, style: ['tableDetail'], },);
					row.push({ text: d[curRec].medications[curRec2].adverse_reaction, style: ['tableDetail'], },);
					row.push({ text: d[curRec].medications[curRec2].comments, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, '*', '*', '*', 300],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Visit Summary
			index += 1;
			lenArr2 = d[curRec].new_grid.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '3', },
				{}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], },);
			row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '3', },);
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center' },);
					row.push({ text: d[curRec].new_grid[curRec2].abnormal_findings, style: ['tableDetail'], },);
					row.push({ text: d[curRec].new_grid[curRec2].recommendations_and_action_plans, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 250, '*'],
						body: body,
					},
				},],
			);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			// Reviewer's Notes - last group
			index += 1;
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
						widths: ['*'],
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], },
							],
							[
								{ text: d[curRec].reviewer_note, style: ['tableDetail'], },
							],
						],
					},
				},
			]);
		}
	}

	return retPage;
}

// Build medical_transport record - p is the field name & d is the data & pg_break is true/false if need page break
async function medical_transport(p, d, pg_break) {
	// Name table
	let index = 0;
	let subIndex = 0;
	let retPage = [];
	let allRecs = (typeof g_record_number === 'undefined' || pg_break) ? true : false;
	let lenArr = d.length;
	let startArr = 0;
	let endArr = lenArr;

	// console.log('p: ', p);
	// console.log('d: ', d);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Are there any records
	if (lenArr === 0) {
		retPage.push({ text: 'No medical transports entered', style: ['tableDetail'], },);
	} else {
		if (!allRecs) {
			startArr = g_record_number - 1;
			endArr = startArr + 1;
		}

		// Display record(s)
		for (let curRec = startArr; curRec < endArr; curRec++) {
			index = 0;
			subIndex = 0;

			// Check to see if there are multiple records, if so do a page break
			if ( allRecs && curRec > 0 ) {
				retPage.push({ text: '', pageBreak: 'before' });
			}

			// Date of Transport & GA
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
						widths: [100, 30, 5, 20, 5, 40, 120, 120, 120],
						headerRows: 1,
						body: [
							[
								{ text: `Record #${curRec + 1}`.toUpperCase(), style: ['subHeader'], colSpan: '2' },
								{}, {}, {}, {}, {}, {}, {}, {},
							],
							[
								{ text: p.children[index].prompt, style: ['subHeader'] },
								{ text: p.children[index].children[subIndex].prompt, style: ['tableLabel'], alignment: 'center', },
								{ text: ' ', style: ['tableLabel'], alignment: 'center', },
								{ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel'], alignment: 'center', },
								{ text: ' ', style: ['tableLabel'], alignment: 'center', },
								{ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel'], alignment: 'center', },
								{ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel'], },
								{ text: p.children[index].children[subIndex + 4].prompt, style: ['tableLabel'], },
								{ text: p.children[index].children[subIndex + 5].prompt, style: ['tableLabel'], },
							],
							[
								{ text: '', },
								{ text: `${fmt2Digits(d[curRec].date_of_transport.month)}`, style: ['tableDetail', 'lightFill'], alignment: 'center', },
								{ text: '/', style: ['tableDetail'], alignment: 'center', },
								{ text: `${fmt2Digits(d[curRec].date_of_transport.day)}`, style: ['tableDetail', 'lightFill'], alignment: 'center', },
								{ text: '/', style: ['tableDetail'], alignment: 'center', },
								{ text: `${fmtYear(d[curRec].date_of_transport.year)}`, style: ['tableDetail', 'lightFill'], alignment: 'center', },
								{ text: `${d[curRec].date_of_transport.gestational_age_weeks}`, style: ['tableDetail'], },
								{ text: `${d[curRec].date_of_transport.gestational_age_days}`, style: ['tableDetail'], },
								{ text: `${d[curRec].date_of_transport.days_postpartum}`, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Reason for Transport
			index += 1;
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
						widths: 'auto',
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 10, 0, 0], },
							],
							[
								{ text: d[curRec].reason_for_transport, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Patient Conditions
			index += 1;
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
						widths: 'auto',
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 10, 0, 0], },
							],
							[
								{ text: d[curRec].maternal_conditions, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Transport Information
			index += 1;
			retPage.push([
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
					table: {
						headerRows: 1,
						widths: [250, 'auto',],
						body: [
							[
								{ text: 'Transport Information', style: ['subHeader'], colSpan: '2', },
								{},
							],
							[
								{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: lookupFieldArr(d[curRec].who_managed_the_transport, p.children[index].values), style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].other_transport_manager, style: ['tableDetail'], },
							],

							[
								{ text: `${p.children[index + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: lookupFieldArr(d[curRec].transport_vehicle, p.children[index + 2].values), style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].other_transport_vehicle, style: ['tableDetail'], },
							],
						],
					}
				}
			]);

			// Timing of Transport
			index += 4;
			retPage.push([
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
					table: {
						headerRows: 1,
						widths: [250, '*'],
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 10, 0, 0], colSpan: '2', },
								{},
							],

							[
								{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: fmtDateTime(d[curRec].timing_of_transport.call_received), style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: fmtDateTime(d[curRec].timing_of_transport.depart_for_patient_origin), style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: fmtDateTime(d[curRec].timing_of_transport.arrive_at_patient_origin), style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: fmtDateTime(d[curRec].timing_of_transport.patient_contact), style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: fmtDateTime(d[curRec].timing_of_transport.depart_for_referring_facility), style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: fmtDateTime(d[curRec].timing_of_transport.arrive_at_referring_facility), style: ['tableDetail'], },
							],
						],
					}
				}
			]);

			//08:Grp[c8]    Origin Information  (origin_information)
			/*
			0:Lst[4]    Place of Origin  (place_of_origin)
			1:Str       Specify Other Place of Origin  (place_of_origin_other)
			2:Grp[c24]  Address  (address)
				0:Str   Street  (street)
				1:Str   Apartment or Unit Number  (apartment)
				2:Str   City  (city)
				3:Lst   State  (state)
				4:Lst   Country  (country)
				5:Str   Zip Code  (zip_code)
				6:Str   County  (county)
				9:Str   Matching Geography Type  (feature_matching_geography_type)
				14:Str  Census Tract Certainty Code  (naaccr_census_tract_certainty_code)
				15:Str  Census Tract Certainty Name  (naaccr_census_tract_certainty_type)
				20:Str  Urban Status  (urban_status)
	    
			3:Lst[6]    Enter the Receiving Hospital Trauma Level of Care  (trauma_level_of_care)
			4:Str       Specify Other Trauma Level of Care  (other_trauma_level_of_care)
			5:Lst[7]    Enter the Receiving Hospital Level of Maternal Care  (maternal_level_of_care)
			6:Str       Specify Other Level of Maternal Care  (other_maternal_level_of_care)
			7:TA        Comments  (comments)
			*/
			index += 1;
			subIndex = 0;
			let subSubIndex = 0;
			retPage.push([
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
					table: {
						headerRows: 1,
						widths: [250, '*'],
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].origin_information.place_of_origin, p.children[index].children[subIndex].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].origin_information.place_of_origin_other}`, style: ['tableDetail'], },
							],
							[
								{
									text: `${p.children[index].children[subIndex + 2].children[0].prompt} / ` +
										`${p.children[index].children[subIndex + 2].children[1].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${d[curRec].origin_information.address.street} / ${d[curRec].origin_information.address.apartment}`,
									style: ['tableDetail'],
								},
							],
							[
								{
									text: `${p.children[index].children[subIndex + 2].children[2].prompt}, ` +
										`${p.children[index].children[subIndex + 2].children[3].prompt}, ` +
										`${p.children[index].children[subIndex + 2].children[4].prompt} ` +
										`${p.children[index].children[subIndex + 2].children[5].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${d[curRec].origin_information.address.city}, ${lookupGlobalArr(d[curRec].origin_information.address.state, 'state')}, ` +
										`${lookupGlobalArr(d[curRec].origin_information.address.country, 'country')} ` +
										`${d[curRec].origin_information.address.zip_code}`,
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].children[6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].origin_information.address.county}`, style: ['tableDetail'], },
							],

							[
								{ text: `${p.children[index].children[subIndex + 2].children[9].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].origin_information.address.feature_matching_geography_type}`, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].children[14].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].origin_information.address.naaccr_census_tract_certainty_code}`, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].children[15].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].origin_information.address.naaccr_census_tract_certainty_type}`, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].children[20].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].origin_information.address.urban_status}`, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].origin_information.trauma_level_of_care, p.children[index].children[subIndex + 3].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].origin_information.other_trauma_level_of_care}`, style: ['tableDetail'], },
							],
							[
								{
									text: `${p.children[index].children[subIndex + 5].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: lookupFieldArr(d[curRec].origin_information.maternal_level_of_care, p.children[index].children[subIndex + 5].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].origin_information.other_maternal_level_of_care}`, style: ['tableDetail'], },
							],

							[
								{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].origin_information.comments, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			//09:Text       Procedures Before Transport (Describe)  (procedures_before_transport)
			index += 1;
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
						widths: 'auto',
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 10, 0, 0], },
							],
							[
								{ text: d[curRec].procedures_before_transport, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			//10:Text       Procedures During Transport (Describe)  (procedures_during_transport)
			index += 1;
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
						widths: 'auto',
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 10, 0, 0], },
							],
							[
								{ text: d[curRec].procedures_during_transport, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Give some space
			retPage.push({ text: '', margin: [0, 10, 0, 0], },);

			//11:Grid[c9]   Transport Vital Signs  (transport_vital_signs)    
			/*
			0:DT        Date and Time  (date_and_time)
			1:Num       GA - Weeks  (gestational_weeks)
			2:Num       GA - Days  (gestational_days)
			3:Num       Systolic BP  (systolic_bp)
			4:Num       Diastolic BP  (diastolic_bp)
			5:Num       Heart Rate  (heart_rate)
			6:Num       Oxygen Saturation  (oxygen_saturation)
			7:Num       Blood Sugar  (blood_sugar)  
			8:TA        Comment(s)  (comments)
			*/
			index += 1;
			subIndex = 0;
			let lenArr2 = d[curRec].transport_vital_signs.length;
			let startArr2 = 0;
			let endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '4', },
				{}, {}, {});
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
			row.push({ text: 'Date', style: ['tableLabel', 'blueFill'], },);
			row.push({ text: 'Medical Information', style: ['tableLabel', 'blueFill'], },);
			row.push({ text: 'Comment(s)', style: ['tableLabel', 'blueFill'], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', },);
				body.push(row);
			} else {
				// Build the table detail

				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					// console.log('curRec: ', curRec);
					// console.log('curRec2: ', curRec2);
					// console.log('transport_vital_signs: ', d[curRec].transport_vital_signs);
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], alignment: 'center', },);
					row.push({ text: fmtDateTime(d[curRec].transport_vital_signs[curRec2].date_and_time), style: ['tableDetail'], },);
					row.push({
						columns: [
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
							],
							[
								{ text: `${d[curRec].transport_vital_signs[curRec2].gestational_weeks || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].transport_vital_signs[curRec2].gestational_days || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].transport_vital_signs[curRec2].systolic_bp || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].transport_vital_signs[curRec2].diastolic_bp || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].transport_vital_signs[curRec2].heart_rate || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].transport_vital_signs[curRec2].oxygen_saturation || ' '}`, style: ['tableDetail'], },
								{ text: `${d[curRec].transport_vital_signs[curRec2].blood_sugar || ' '}`, style: ['tableDetail'], },
							],
						],
					});
					row.push({ text: d[curRec].transport_vital_signs[curRec2].comments, style: ['tableDetail'], },);
					body.push(row);
				}
			}

			// Show the table 
			retPage.push([
				{
					layout: {
						defaultBorder: true,
						paddingLeft: function (i, node) { return 1; },
						paddingRight: function (i, node) { return 1; },
						paddingTop: function (i, node) { return 2; },
						paddingBottom: function (i, node) { return 2; },
					},
					table: {
						headerRows: 2,
						widths: [30, 100, 200, '*',],
						body: body,
					},
				},],
			);

			//12:Text       Mental Status of Patient During Transport (Describe)  (mental_status_of_patient_during_transport)
			index += 1;
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
						widths: 'auto',
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 10, 0, 0], },
							],
							[
								{ text: d[curRec].mental_status_of_patient_during_transport, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			//13:Text       Documented Pertinent Oral Statements Made by Patient or Others on Scene  (documented_pertinent_oral_statements_made_by_patient_and_other_on_scene)
			index += 1;
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
						widths: 'auto',
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 10, 0, 0], },
							],
							[
								{ text: d[curRec].documented_pertinent_oral_statements_made_by_patient_and_other_on_scene, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			//14:Grp[c9]    Destination Information  (destination_information)
			/*
			0:Str       Name of Facility  (place_of_destination)
			1:Lst       Place of Destination  (destination_type)
			2:Str       Specify Other Destinatio  (place_of_origin_other)

			3:Grp[c27]  Address  (address)
				0:Str   Street  (street)
				1:Str   Unit Number  (apartment)
				2:Str   City  (city)
				3:Lst   State  (state)
				4:Lst   Country  (country_of_last_residence)
				5:Str   Zip Code  (zip_code)
				9:Str   Matching Geography Type  (feature_matching_geography_type)
				14:Str  Census Tract Certainty Code  (naaccr_census_tract_certainty_code)
				15:Str  Census Tract Certainty Name  (naaccr_census_tract_certainty_type)
				20:Str  Urban Status  (urban_status)
				24:Num  Estimated Distance (Miles) Between Origin and Destination of Medical Transport  (estimated_distance)

			4:Lst[6]    Trauma Level of Care  (trauma_level_of_care)   
			5:Str       Specify Other Trauma Level of Care  (other_trauma_level_of_care)
			6:Lst[7]    Level of Maternal Care  (maternal_level_of_care)
			7:Str       Specify Other Level of Maternal Care  (other_maternal_level_of_care)
			8:Text      Comments  (comments)
			*/
			index += 1;
			subIndex = 0;
			subSubIndex = 0;
			retPage.push([
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
					table: {
						headerRows: 1,
						widths: [250, '*'],
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].destination_information.place_of_destination, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{
									text: lookupFieldArr(d[curRec].destination_information.destination_type, p.children[index].children[subIndex + 1].values),
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].destination_information.place_of_origin_other}}`, style: ['tableDetail'], },
							],
							[
								{
									text: `${p.children[index].children[subIndex + 3].children[0].prompt} / ` +
										`${p.children[index].children[subIndex + 3].children[1].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${d[curRec].destination_information.address.street} / ${d[curRec].destination_information.address.apartment}`,
									style: ['tableDetail'],
								},
							],
							[
								{
									text: `${p.children[index].children[subIndex + 3].children[2].prompt}, ` +
										`${p.children[index].children[subIndex + 3].children[3].prompt}, ` +
										`${p.children[index].children[subIndex + 3].children[4].prompt} ` +
										`${p.children[index].children[subIndex + 3].children[5].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${d[curRec].destination_information.address.city}, ` +
										`${lookupGlobalArr(d[curRec].destination_information.address.state, 'state')}, ` +
										`${lookupGlobalArr(d[curRec].destination_information.address.country_of_last_residence, 'country')} ` +
										`${d[curRec].destination_information.address.zip_code}`,
									style: ['tableDetail'],
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].children[subSubIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].destination_information.address.county}`, style: ['tableDetail'], },
							],

							[
								{ text: `${p.children[index].children[subIndex + 3].children[subSubIndex + 9].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].destination_information.address.feature_matching_geography_type}`, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].children[subSubIndex + 14].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].destination_information.address.naaccr_census_tract_certainty_code}`, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].children[subSubIndex + 15].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].destination_information.address.naaccr_census_tract_certainty_type}`, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].children[subSubIndex + 20].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].destination_information.address.urban_status}`, style: ['tableDetail'], },
							],

							[
								{ text: `${p.children[index].children[subIndex + 3].children[subSubIndex + 24].prompt}: `, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].destination_information.address.estimated_distance}`, style: ['tableDetail'], },
							],

							[
								{
									text: `${p.children[index].children[subIndex + 4].prompt} / ${p.children[index].children[subIndex + 5].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${lookupFieldArr(d[curRec].destination_information.trauma_level_of_care, p.children[index].children[subIndex + 4].values)} / ` +
										`${d[curRec].origin_information.other_trauma_level_of_care}`,
									style: ['tableDetail'],
								},
							],

							[
								{
									text: `${p.children[index].children[subIndex + 6].prompt} / ${p.children[index].children[subIndex + 7].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: `${lookupFieldArr(d[curRec].destination_information.maternal_level_of_care, p.children[index].children[subIndex + 6].values)} / ${d[curRec].origin_information.other_maternal_level_of_care}`,
									// text: `${d[curRec].origin_information.maternal_level_of_care} / ${d[curRec].origin_information.other_maternal_level_of_care}`, 
									style: ['tableDetail'],
								},
							],

							[
								{
									text: `${p.children[index].children[subIndex + 8].prompt}: `,
									style: ['tableLabel'],
									alignment: 'right',
								},
								{
									text: d[curRec].destination_information.comments,
									style: ['tableDetail'],
								},
							],
						],
					},
				},
			]);


			//15:Text      Reviewer's Notes About Medical Transport  (reviewer_note)
			index += 1;
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
						widths: 'auto',
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 10, 0, 0], },
							],
							[
								{ text: d[curRec].reviewer_note, style: ['tableDetail'], },
							],
						],
					},
				},
			]);
		}
	}


	return retPage;
}

// Build social_and_environmental_profile record - p is the field name & d is the data & pg_break is true/false if need page break
function social_and_environmental_profile(p, d, pg_break) {
	// Name table
	let index = 0;
	let subIndex = 0;
	let body = [];
	let retPage = [];

	// console.log('p: ', p);
	// console.log('d: ', d);

	// Record Header
	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	//00:Grp[c13]   Socioeconomic Characteristics  (socio_economic_characteristics)
	/*
	0:Lst[8]    Source of Income  (source_of_income)
	1:Str       Specify Multiple/Other Sources of Income  (source_of_income_other_specify)
	2:Lst[9]    Employment Status  (employment_status)
	3:Str       Specify Multiple/Other Employment Status  (employment_status_other_specify)
	4:Str       Occupation  (occupation)
	5:Str       Religious Preference  (religious_preference)
	6:Lst       Country of Birth  (country_of_birth)    [lookup/country]
	7:Lst[12]   Immigration Status  (immigration_status)
	8:Num       Time in the US  (time_in_the_us)
	9:Lst[7]    Unit (time_in_the_us_units)
	10:Lst[8]   Living Arrangement at Time of Death  (current_living_arrangements)
	11:MsLst[9] Homelessness*  (homelessness)
	12:MsLst[7] Unstable Housing?  (unstable_housing)
	*/
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, 'auto',],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],

					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.socio_economic_characteristics.source_of_income, p.children[index].children[subIndex].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.socio_economic_characteristics.source_of_income_other_specify, style: ['tableDetail'], },
					],

					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.socio_economic_characteristics.employment_status, p.children[index].children[subIndex + 2].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.socio_economic_characteristics.employment_status_other_specify, style: ['tableDetail'], },
					],

					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.socio_economic_characteristics.occupation, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.socio_economic_characteristics.religious_preference, style: ['tableDetail'], },
					],

					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },            // NEED to Fix: lookup/country
						{ text: lookupGlobalArr(d.socio_economic_characteristics.country_of_birth, 'country'), style: ['tableDetail'], },

					],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupFieldArr(d.socio_economic_characteristics.immigration_status, p.children[index].children[subIndex + 7].values),
							style: ['tableDetail'],
						},
					],

					[
						{ text: `${p.children[index].children[subIndex + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.socio_economic_characteristics.time_in_the_us, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 9].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupFieldArr(d.socio_economic_characteristics.time_in_the_us_units, p.children[index].children[subIndex + 9].values),
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupFieldArr(d.socio_economic_characteristics.current_living_arrangements, p.children[index].children[subIndex + 10].values),
							style: ['tableDetail'],
						},
					],


					[
						{ text: `${p.children[index].children[subIndex + 11].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupMultiChoiceArr(d.socio_economic_characteristics.homelessness, p.children[index].children[subIndex + 11].values),
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 12].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupMultiChoiceArr(d.socio_economic_characteristics.unstable_housing, p.children[index].children[subIndex + 12].values),
							style: ['tableDetail'],
						},
					],
				],
			},
		},
	]);


	//01:Grid[c4]   Members of Household  (members_of_household)
	/*
	0:Lst[11]   Relationship  (relationship)
	1:Lst[3]    Gender  (gender)
	2:Str       Age  (age)
	3:Str       Comments  (comments)
	*/

	// Give some space
	retPage.push({ text: '', margin: [0, 20, 0, 0], },);

	index += 1;
	let lenArr = d.members_of_household.length;
	let startArr = 0;
	let endArr = lenArr;

	// Build Header rows
	body = [];
	let row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '5', },
		{}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center' },);                                // Rec #
	row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], },);                      // Relationship
	row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);                      // Gender
	row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);  // Age
	row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },);                      // Comments
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', },);
		body.push(row);
	} else {
		// Build the table detail   ... , alignment: 'center' },);
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: lookupFieldArr(d.members_of_household[curRec].relationship, p.children[index].children[subIndex].values), style: ['tableDetail'], },);
			row.push({ text: lookupFieldArr(d.members_of_household[curRec].gender, p.children[index].children[subIndex + 1].values), style: ['tableDetail'], },);
			row.push({ text: d.members_of_household[curRec].age, style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: d.members_of_household[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 50, 30, '*'],
				body: body,
			},
		},],
	);

	//02:MsLst[8]   Was Decedent Ever Incarcerated?  (previous_or_current_incarcerations)
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 0,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.previous_or_current_incarcerations, p.children[index].values), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	//03:Grid[c5]   Details of Incarcerations  (details_of_incarcerations)
	/*
	0:Date      Date  (date)
	1:Str       Duration  (duration)
	2:Str       Reason  (reason)
	3:Lst[6]    Occurrence  (occurrence)    
	4:Str       Comments  (comments)
	*/

	index += 1;
	lenArr = d.details_of_incarcerations.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', },
		{}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center' },);                                // Rec #
	row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);  // Date  (date)
	row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);                      // Duration  (duration)
	row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },);                      // Reason  (reason)
	row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },);                     // Occurrence  (occurrence) 
	row.push({ text: p.children[index].children[subIndex + 4].prompt, style: ['tableLabel', 'blueFill'], },);                      // Comments  (comments)
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', },);
		body.push(row);
	} else {
		// Build the table detail   ... , alignment: 'center' },);
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: fmtStrDate(d.details_of_incarcerations[curRec].date), style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: d.details_of_incarcerations[curRec].duration, style: ['tableDetail'], },);
			row.push({ text: d.details_of_incarcerations[curRec].reason, style: ['tableDetail'], },);
			row.push({ text: lookupFieldArr(d.details_of_incarcerations[curRec].occurrence, p.children[index].children[subIndex + 3].values), style: ['tableDetail'], },);
			row.push({ text: d.details_of_incarcerations[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 70, 50, '*', 150, '*'],
				body: body,
			},
		},],
	);

	//04:MsLst[7]   Was Decedent Ever Arrested?  (was_decedent_ever_arrested)
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 0,
				widths: [250, 'auto',],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.was_decedent_ever_arrested, p.children[index].values), style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	//05:Grid[c4]   Details of Arrests  (details_of_arrests)
	/*
	0:Date      Date  (date_of_arrest)
	1:Str       Reason  (arest_reason)
	2:Lst[6]    Occurrence  (occurrence)    
	3:Str       Comments  (comments)
	*/
	index += 1;
	lenArr = d.details_of_arrests.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '5', },
		{}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center' },);                                		// Rec #
	row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);  	// Date  (date_of_arrest)
	row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);                   // Reason  (arest_reason)
	row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },);                   // Occurrence  (occurrence) 
	row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },);                   // Comments  (comments)
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', },);
		body.push(row);
	} else {
		// Build the table detail   ... , alignment: 'center' },);
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: fmtStrDate(d.details_of_arrests[curRec].date_of_arrest), style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: d.details_of_arrests[curRec].arest_reason, style: ['tableDetail'], },);
			row.push({ text: lookupFieldArr(d.details_of_arrests[curRec].occurrence, p.children[index].children[subIndex + 2].values), style: ['tableDetail'], },);
			row.push({ text: d.details_of_arrests[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 70, '*', 150, '*'],
				body: body,
			},
		},],
	);

	//06:Grp[c3]    Health Care Access  (health_care_access)
	/*
	0:MsLst[10] Documented Barriers to Health Care Access* (Select All That Apply)  (barriers_to_health_care_access)
	1:Str       Specify Other Barrier to Health Care Access  (barriers_to_health_care_access_other_specify)
	2:TA        Comments  (comments) 
	*/
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, 'auto',],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],

					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupMultiChoiceArr(d.health_care_access.barriers_to_health_care_access, p.children[index].children[subIndex].values),
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.health_care_access.barriers_to_health_care_access_other_specify, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.health_care_access.comments, style: ['tableDetail'], },
					],

				],
			},
		},
	]);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	//07:Grp[c3]    Communications  (communications)
	/*
	0:MsLst[10] Documented Barriers to Communications* (Select All That Apply)  (barriers_to_communications)
	1:Str       Specify Other Barrier to Communications  (barriers_to_communications_other_specify)       
	2:TA        Comments  (comments) 
	*/
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, 'auto',],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],

					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupMultiChoiceArr(d.communications.barriers_to_communications, p.children[index].children[subIndex].values),
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.communications.barriers_to_communications_other_specify, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.communications.comments, style: ['tableDetail'], },
					],

				],
			},
		},
	]);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);


	//08:Grp[c3]    Social or Emotional Stress  (social_or_emotional_stress)
	/*
	0:MsLst[14] Evidence of Social or Emotional Stress* (Select All That Apply)  (evidence_of_social_or_emotional_stress)
	1:Str       Specify Other Evidence of Stress  (specify_other_evidence_stress)
	2:TA        Explain Further  (explain_further)
	*/
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, 'auto',],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],


					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupMultiChoiceArr(d.social_or_emotional_stress.evidence_of_social_or_emotional_stress, p.children[index].children[subIndex].values),
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.social_or_emotional_stress.specify_other_evidence_stress, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.social_or_emotional_stress.explain_further, style: ['tableDetail'], },
					],

				],
			},
		},
	]);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	//09:Grp[c4]    Utilization of Health Care System  (health_care_system)
	/*
	0:Lst[4]    Any Prenatal Care?*  (no_prenatal_care)
	1:MsLst[10] Reasons for Missed Appointments (Select All That Apply)*    (reasons_for_missed_appointments)
	2:Str       Specify Other Reason for Missed Appointments  (specify_other_reason)
	3:TA        Comments  (comments)
	*/
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, 'auto',],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],


					[
						{ text: `${p.children[index].children[subIndex].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.health_care_system.no_prenatal_care, p.children[index].children[subIndex].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupMultiChoiceArr(d.health_care_system.reasons_for_missed_appointments, p.children[index].children[subIndex + 1].values),
							style: ['tableDetail'],
						},
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.health_care_system.specify_other_reason, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.health_care_system.comments, style: ['tableDetail'], },
					],

				],
			},
		},
	]);

	//10:Lst[6]     Military Status at Time of Death  (had_military_service)
	//11:Lst        Is There Documentation of Bereavement Support?  (was_there_bereavement_support) [lookup/yes_no_unknown]
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, 'auto',],
				body: [
					[
						{ text: 'Additional Information', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.had_military_service, p.children[index].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.was_there_bereavement_support, 'yes_no_with_unknown'), style: ['tableDetail'], },
					],
				],
			},
		}
	]);

	// Give some space
	retPage.push({ text: '', margin: [0, 20, 0, 0], },);

	//12:Grid[c7]   Social and Medical Referrals  (social_and_medical_referrals)
	/*
	0:Date      Date  (date)
	1:Str       Referred To  (referred_to)
	2:Str       Specialty  (specialty)
	3:Str       Reason  (reason)
	4:Lst       Adhered?  (compiled)  [lookup/yes_no]      
	5:Str       Reason for Non-Adherence  (reason_for_non_compliance)    
	6:TA        Comment(s)  (comments)    
	*/

	index += 2;
	lenArr = d.social_and_medical_referrals.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '8', },
		{}, {}, {}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center' },);                                // Rec #
	row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);  // Date  (date)
	row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);                      // Referred To  (referred_to)
	row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },);                      // Specialty  (specialty)
	row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },);                      // Reason  (reason)
	row.push({ text: p.children[index].children[subIndex + 4].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);  // Adhered?  (compiled)  [lookup/yes_no] 
	row.push({ text: p.children[index].children[subIndex + 5].prompt, style: ['tableLabel', 'blueFill'], },);                      // Reason for Non-Adherence  (reason_for_non_compliance)  
	row.push({ text: p.children[index].children[subIndex + 6].prompt, style: ['tableLabel', 'blueFill'], },);                      // Comments  (comments)
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '8', },);
		body.push(row);
	} else {
		// Build the table detail   ... , alignment: 'center' },);
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: fmtStrDate(d.social_and_medical_referrals[curRec].date), style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: d.social_and_medical_referrals[curRec].referred_to, style: ['tableDetail'], },);
			row.push({ text: d.social_and_medical_referrals[curRec].specialty, style: ['tableDetail'], },);
			row.push({ text: d.social_and_medical_referrals[curRec].reason, style: ['tableDetail'], },);
			row.push({ text: lookupGlobalArr(d.social_and_medical_referrals[curRec].compiled, 'yes_no'), style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: d.social_and_medical_referrals[curRec].reason_for_non_compliance, style: ['tableDetail'], },);
			row.push({ text: d.social_and_medical_referrals[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 70, '*', '*', '*', 50, '*', 200],
				body: body,
			},
		},
	]);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	//13:Grid[c5]   Sources of Social Services Information for this Record  (sources_of_social_services_information_for_this_record)
	/*
	0:Date      Date  (date)
	1:Lst[11]   Element  (element)          
	2:Str       Specify Other Element  (element_other)
	3:Str       Source Name  (source_name)
	4:TA        Comment(s)  (comments)    
	*/
	index += 1;
	lenArr = d.sources_of_social_services_information_for_this_record.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', },
		{}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center' },);                                		// Rec #
	row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);  	// Date  (date)
	row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);                   // Element  (element)
	row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },);                   // Specify Other Element  (element_other)
	row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },);                   // Source Name  (source_name) 
	row.push({ text: p.children[index].children[subIndex + 4].prompt, style: ['tableLabel', 'blueFill'], },);                   // Comments  (comments)
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', },);
		body.push(row);
	} else {
		// Build the table detail   ... , alignment: 'center' },);
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: fmtStrDate(d.sources_of_social_services_information_for_this_record[curRec].date), style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: lookupFieldArr(d.sources_of_social_services_information_for_this_record[curRec].element, p.children[index].children[subIndex + 1].values), style: ['tableDetail'], },);
			row.push({ text: d.sources_of_social_services_information_for_this_record[curRec].element_other, style: ['tableDetail'], },);
			row.push({ text: d.sources_of_social_services_information_for_this_record[curRec].source_name, style: ['tableDetail'], },);
			row.push({ text: d.sources_of_social_services_information_for_this_record[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 70, '*', '*', '*', '*'],
				body: body,
			},
		},
	]);

	//14:List       Was There Documented Substance Use?*  (documented_substance_use)  [lookup/yes_no]
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: 'Substance Use Information', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.documented_substance_use, 'yes_no'), style: ['tableDetail'], },
					],
				],
			}
		}
	]);

	//15:Grid[c3]   If Yes, Specify Substance(s)  (if_yes_specify_substances)
	/*
	0:Lst       Documented Substance  (substance)  [lookup/substance]
	1:Str       Specify Other Substance  (substance_other)
	2:Lst[5]    Timing of Substance Use  (timing_of_substance_use)
	*/
	index += 1;
	lenArr = d.if_yes_specify_substances.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '4', },
		{}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center' },);                                // Rec #
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);                      // Documented Substance  (substance)  [lookup/substance]
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);                      // Specify Other Substance  (substance_other)
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);                      // Timing of Substance Use  (timing_of_substance_use)
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', },);
		body.push(row);
	} else {
		// Build the table detail   ... , alignment: 'center' },);
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: lookupGlobalArr(d.if_yes_specify_substances[curRec].substance, 'substance'), style: ['tableDetail'], },);
			row.push({ text: d.if_yes_specify_substances[curRec].substance_other, style: ['tableDetail'], },);
			row.push({ 
				text: lookupFieldArr(d.if_yes_specify_substances[curRec].timing_of_substance_use, p.children[index].children[2].values), 
				style: ['tableDetail'], 
			},);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 150, '*', 150],
				body: body,
			},
		},],
	);

	//16:TA         Reviewer's Notes About the Social and Environmental Profile  (reviewer_note)
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: ['*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['subHeader'], },
					],
					[
						{ text: d.reviewer_note, style: ['tableDetail'], margin: [0, 10, 0, 10], },
					],
				],
			},
		},
	]);

	return retPage;
}

// Build mental_health_profile record - p is the field name & d is the data & pg_break is true/false if need page break
async function mental_health_profile(p, d, pg_break) {
	// Name table
	let index = 0;
	let subIndex = 0;
	let body = [];
	let retPage = [];

	// console.log('p: ', p);
	// console.log('d: ', d);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Were There Documented Preexisting Mental Health Conditions?*  [0:lookup/yes_no - were_there_documented_preexisting_mental_health_conditions]
	retPage.push([
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
			table: {
				headerRows: 1,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.were_there_documented_preexisting_mental_health_conditions, 'yes_no'), style: ['tableDetail'], },
					],
				],
			}
		}
	]);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	// Documented Preexisting Mental Health Conditions  [1:Grid - documented_preexisting_mental_health_conditions]
	index += 1;
	let lenArr = d.documented_preexisting_mental_health_conditions.length;
	let startArr = 0;
	let endArr = lenArr;

	// Build Header rows
	body = [];
	let row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '10', },
		{}, {}, {}, {}, {}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center' },);                                // Rec #
	row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], },);                      // Condition
	row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], },);                      // Duration of Condition
	row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },);                      // Treatments
	row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },);                      // Duration of Treatment
	row.push({ text: p.children[index].children[subIndex + 4].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);  // Treatment changed during pregnancy
	row.push({ text: p.children[index].children[subIndex + 5].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);  // Dosage changed during pregnancy
	row.push({ text: p.children[index].children[subIndex + 6].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);  // If yes, mental health provider consuldation during this pregnancy
	row.push({ text: p.children[index].children[subIndex + 7].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);  // Did patient adhere to treatment
	row.push({ text: p.children[index].children[subIndex + 8].prompt, style: ['tableLabel', 'blueFill'], },);                      // Comments
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '10', },);
		body.push(row);
	} else {
		// Build the table detail   ... , alignment: 'center' },);
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center' },);
			row.push(
				{
					text: lookupFieldArr(d.documented_preexisting_mental_health_conditions[curRec].condition, p.children[index].children[subIndex].values),
					style: ['tableDetail'],
				});
			row.push({ text: d.documented_preexisting_mental_health_conditions[curRec].duration_of_condition, style: ['tableDetail'], },);
			row.push({ text: d.documented_preexisting_mental_health_conditions[curRec].treatments, style: ['tableDetail'], },);
			row.push({ text: d.documented_preexisting_mental_health_conditions[curRec].duration_of_tx, style: ['tableDetail'], },);
			row.push(
				{
					text: lookupGlobalArr(d.documented_preexisting_mental_health_conditions[curRec].treatment_changed_during_pregnancy, 'yes_no_with_unknown'),
					style: ['tableDetail'],
					alignment: 'center'
				});
			row.push(
				{
					text: lookupGlobalArr(d.documented_preexisting_mental_health_conditions[curRec].dosage_changed_during_pregnancy, 'yes_no_with_unknown'),
					style: ['tableDetail'],
					alignment: 'center'
				});
			row.push(
				{
					text: lookupGlobalArr(d.documented_preexisting_mental_health_conditions[curRec].if_yes_mental_health_provider_consultation_during_this_pregnancy, 'yes_no_with_unknown'),
					style: ['tableDetail'],
					alignment: 'center'
				});
			row.push(
				{
					text: lookupGlobalArr(d.documented_preexisting_mental_health_conditions[curRec].did_patient_adhere_to_treatment, 'yes_no_with_unknown'),
					style: ['tableDetail'],
					alignment: 'center'
				});
			row.push({ text: d.documented_preexisting_mental_health_conditions[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 50, '*', '*', '*', '*', '*', '*', 200],
				body: body,
			},
		},],
	);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	// Were There Documented Screenings and Referrals for Mental Health Conditions?  [2:Grid - were_there_documented_mental_health_conditions]
	index += 1;
	lenArr = d.were_there_documented_mental_health_conditions.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '10', },
		{}, {}, {}, {}, {}, {}, {}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center' },);
	row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);
	row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);
	row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);
	row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);
	row.push({ text: p.children[index].children[subIndex + 4].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex + 5].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex + 6].prompt, style: ['tableLabel', 'blueFill'], alignment: 'center' },);
	row.push({ text: p.children[index].children[subIndex + 7].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[subIndex + 8].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '10', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: fmtStrDate(d.were_there_documented_mental_health_conditions[curRec].date_of_screening), style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: d.were_there_documented_mental_health_conditions[curRec].gestational_weeks, style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: d.were_there_documented_mental_health_conditions[curRec].gestational_days, style: ['tableDetail'], alignment: 'center' },);
			row.push({ text: d.were_there_documented_mental_health_conditions[curRec].days_postpartum, style: ['tableDetail'], alignment: 'center' },);

			row.push(
				{
					text: `${lookupFieldArr(d.were_there_documented_mental_health_conditions[curRec].screening_tool, p.children[index].children[subIndex + 4].values)}`,
					style: ['tableDetail'],
				});
			row.push({ text: d.were_there_documented_mental_health_conditions[curRec].other_screening_tool, style: ['tableDetail'], },);
			row.push(
				{
					text: lookupGlobalArr(d.were_there_documented_mental_health_conditions[curRec].referral_for_treatment, 'yes_no_with_unknown'),
					style: ['tableDetail'],
					alignment: 'center',
				});
			row.push({ text: d.were_there_documented_mental_health_conditions[curRec].findings, style: ['tableDetail'], },);
			row.push({ text: d.were_there_documented_mental_health_conditions[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 60, 50, 50, 50, 100, '*', '*', '*', 250],
				body: body,
			},
		},],
	);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	// Was the Decedent TREATED for Any of the Following Mental Health Conditions PRIOR TO the Most Recent Pregnancy? (Select All That Apply)*  [3:Multi-Select-List - mental_health_conditions_prior_to_the_most_recent_pregnancy]
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 0,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupMultiChoiceArr(d.mental_health_conditions_prior_to_the_most_recent_pregnancy, p.children[index].values),
							style: ['tableDetail'],
						},
					],
				],
			},
		},
	]);

	// Specify Other  [4:TB - other_prior_to_pregnancy]
	index += 1;
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			width: 'auto',
			margin: [0, 0, 0, 0],
			table: {
				headerRows: 0,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.other_prior_to_pregnancy, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	// Was the Decedent TREATED for Any of the Following Mental Health Conditions DURING the Most Recent Pregnancy? (Select All That Apply)*  [5:Multi-Select-List - mental_health_conditions_during_the_most_recent_pregnancy]
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 0,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.mental_health_conditions_during_the_most_recent_pregnancy, p.children[index].values), style: ['tableDetail'], margin: [0, 10, 0, 10], },
					],
				],
			},
		},
	]);

	// Specify Other  [6:TB - other_during_pregnancy]
	index += 1;
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			width: 'auto',
			margin: [0, 0, 0, 0],
			table: {
				headerRows: 0,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.other_during_pregnancy, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	// Was the Decedent TREATED for Any of the Following Mental Health Conditions AFTER the Most Recent Pregnancy? (Select All That Apply)*  [7:Multi-Select-List - mental_health_conditions_after_the_most_recent_pregnancy]
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 0,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{
							text: lookupMultiChoiceArr(d.mental_health_conditions_after_the_most_recent_pregnancy, p.children[index].values),
							style: ['tableDetail'],
						},
					],
				],
			},
		},
	]);

	// Specify Other  [8:TB - other_after_pregnancy]
	index += 1;
	retPage.push([
		{
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			width: 'auto',
			margin: [0, 0, 0, 0],
			table: {
				headerRows: 0,
				widths: [250, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.other_after_pregnancy, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	// Give some space
	retPage.push({ text: '', margin: [0, 10, 0, 0], },);

	// Reviewer's Notes About the Mental Health Profile  [9:TB - reviewer_note]
	index += 1;
	retPage.push([
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
			table: {
				headerRows: 0,
				widths: ['*'],
				body: [
					[
						{ text: `${p.children[index].prompt}: `, style: ['subHeader'], },
					],
					[
						{ text: d.reviewer_note, style: ['tableDetail'], },
					],
				],
			},
		},
	]);

	return retPage;
}

// Build informant_interviews record - p is the field name & d is the data & pg_break is true/false if need page break
async function informant_interviews(p, d, pg_break) {
	// Name table
	let index = 0;
	let subIndex = 0;
	let retPage = [];
	let allRecs = (typeof g_record_number === 'undefined' || pg_break) ? true : false;
	let lenArr = d.length;
	let startArr = 0;
	let endArr = lenArr;

	// console.log('p: ', p);
	// console.log('d: ', d);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });

	// Need page break, used if print all or core
	if (pg_break) 
    {
		retPage.push({ text: '', pageBreak: 'before' });
	}

	// Are there any records
	if (lenArr === 0) 
    {
		retPage.push({ text: 'No interviews entered', style: ['tableDetail'], },);
	} 
    else 
    {
		if (!allRecs) 
        {
			startArr = g_record_number - 1;
			endArr = startArr + 1;
		}

		// Display record(s)
		for (let curRec = startArr; curRec < endArr; curRec++) 
        {
			index = 0;
			subIndex = 0;

			// Check to see if there are multiple records, if so do a page break
			if ( allRecs && curRec > 0 ) 
            {
				retPage.push({ text: '', pageBreak: 'before' });
			}

			// Date of Interview & Interview Type & Specify Other Type
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
						widths: [100, 30, 5, 20, 5, 30, 200, 'auto'],
						headerRows: 1,
						body: [
							[
								{ text: `Record #${curRec + 1}`.toUpperCase(), style: ['subHeader'], colSpan: '8' },
								{}, {}, {}, {}, {}, {}, {},
							],
							[
								{ text: p.children[index].prompt, style: ['tableLabel'] },
								{ text: p.children[index].children[subIndex].prompt, style: ['tableLabel'], alignment: 'center', },
								{ text: ' ', style: ['tableLabel'], alignment: 'center', },
								{ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel'], alignment: 'center', },
								{ text: ' ', style: ['tableLabel'], alignment: 'center', },
								{ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel'], alignment: 'center', },
								{ text: p.children[index + 1].prompt, style: ['tableLabel'], },
								{ text: p.children[index + 2].prompt, style: ['tableLabel'], },
							],
							[
								{ text: '', },
								{ text: `${fmt2Digits(d[curRec].date_of_interview.month)}`, style: ['tableDetail', 'lightFill'], alignment: 'center', },
								{ text: '/', style: ['tableDetail'], alignment: 'center', },
								{ text: `${fmt2Digits(d[curRec].date_of_interview.day)}`, style: ['tableDetail', 'lightFill'], alignment: 'center', },
								{ text: '/', style: ['tableDetail'], alignment: 'center', },
								{ text: `${fmtYear(d[curRec].date_of_interview.year)}`, style: ['tableDetail', 'lightFill'], alignment: 'center', },
								{ text: `${lookupFieldArr(d[curRec].interview_type, p.children[index + 1].values)}`, style: ['tableDetail', 'lightFill'], },
								{ text: `${d[curRec].other_interview_type}`, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Information about Informant - Age Group, Relationship to Decease, Other Relationship
			index += 3;
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
						widths: [100, 100, 150, 'auto'],
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '4' },
								{}, {}, {},
							],
							[
								{},
								{ text: p.children[index + 1].prompt, style: ['tableLabel'], },
								{ text: p.children[index + 2].prompt, style: ['tableLabel'], },
								{ text: p.children[index + 3].prompt, style: ['tableLabel'], },
							],
							[
								{ text: '', },
								{ text: lookupFieldArr(d[curRec].age_group, p.children[index + 1].values), style: ['tableDetail'], },
								{ text: lookupFieldArr(d[curRec].relationship_to_deceased, p.children[index + 2].values), style: ['tableDetail'], },
								{ text: d[curRec].other_relationship, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Interview Narrative
			index += 4;
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
						widths: 'auto',
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 10, 0, 0], },
							],
							[
								{ text: d[curRec].interview_narrative, style: ['tableDetail'], },
							],
						],
					},
				},
			]);

			// Reviewer's Narrative
			index += 1;
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
						widths: 'auto',
						headerRows: 1,
						body: [
							[
								{ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 10, 0, 0], },
							],
							[
								{ text: d[curRec].reviewer_note, style: ['tableDetail'], },
							],
						],
					},
				},
			]);
		}
	}

	return retPage;
}


async function case_narrative(p, d, pg_break) {
	// Name table
	let index = 0;
	let len = 0;
	let retPage = [];

	retPage.push({ text: '', pageHeaderText: p.prompt.toUpperCase() });


	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

    let details = convert_html_to_pdf(d.case_opening_overview);

    retPage.push(details);

	return retPage;
}

function convert_html_to_pdf(p_value)
{
    //{ text: d.case_opening_overview, style: ['tableDetail'], },		// TODO: htmlToPdfmake needs to be added when Word data cleaned up
    let result = [];
    let CommentRegex = /<!--\[[^>]+>/gi;

    let node = document.createElement("body");
    node.innerHTML = p_value.replace(CommentRegex,"");

    ConvertHTMLDOMWalker(result, node);

    return result;
    
}


function convert_attribute_to_pdf(p_node, p_result)
{
    //{ text: d.case_opening_overview, style: ['tableDetail'], },		// TODO: htmlToPdfmake needs to be added when Word data cleaned up
    let result = {};

    if(p_result!= null)
    {
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


    if(p_node.attributes != null)
    {


        for(let i = 0; i < p_node.attributes.length; i++)
        {
            let attr = p_node.attributes[i];
           
            if(attr.name == "style")
            {
                let style_array = attr.value.split(';');
                for(let style_index = 0; style_index < style_array.length; style_index++)
                {
                    let kvp = style_array[style_index].split(":");
                    switch(kvp[0].trim())
                    {
                        case "text-align":
                                result['alignment']  = kvp[1].trim();
                            break;
                        case "font-size": 
                                result['fontSize']  = kvp[1].trim().replace("px","").replace("pt","");
                            break;
                        //case "bold": 
                        //    result['bold']  = kvp[1];
                        break;  
                        case "color":
                            result['color']  = `${rgb_to_hex(kvp[1].trim())}`;
                            break; 
                        case "background-color": 
                        result['background']  = `${rgb_to_hex(kvp[1].trim())}`;
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

function rgb_to_hex(p_value)
{
    if(p_value.split("(").length < 2)
    {
        return p_value;
    }
    let a = p_value.split("(")[1].split(")")[0];
    a = a.split(",");
    let b = a.map(function(x){             //For each array element
        x = parseInt(x).toString(16);      //Convert to a base16 string
        return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
    })

    return "#" + b.join("");
}




function ConvertHTMLDOMWalker(p_result, p_node)
{
    let crlf_regex = /\n/g;

    switch(p_node.nodeName.toUpperCase())
    {
        case "#TEXT":
            p_result.push({ text: p_node.textContent.replace(crlf_regex,"").trim() });
            return;
            break;
        case "P":
            
                let text_array = [];
                for(let i = 0; i < p_node.childNodes.length; i++)
                {
                    let child = p_node.childNodes[i];
            
                    ConvertHTMLDOMWalker(text_array, child);
                }
                p_result.push({ text: text_array });
                return;
                break; 
        case "SPAN":
            p_result.push({ text: p_node.textContent.replace(crlf_regex,"").trim(), style: convert_attribute_to_pdf(p_node, {})});
            return;
            break;            
        case "STRONG":
                let strong_attr = { bold: true };
                p_result.push({ text: p_node.textContent.replace(crlf_regex,"").trim(), style: convert_attribute_to_pdf(p_node, strong_attr) });
                return;
                break; 
        case "BR":
            p_result.push({ text: "\n"  });
            return;
            break;           
        case "EM":
            let em_attr = { italics: true };
            p_result.push({ text: p_node.textContent.replace(crlf_regex,"").trim(), style: convert_attribute_to_pdf(p_node, em_attr) });
            return;
            break;
        case "UL":
            let ul_array = [];
            for(let i = 0; i < p_node.childNodes.length; i++)
            {
                let child = p_node.childNodes[i];
        
                ConvertHTMLDOMWalker(ul_array, child);
            }
            p_result.push({ ul: ul_array });
            return;
            break; 

        case "OL":
            let ol_array = [];
            for(let i = 0; i < p_node.childNodes.length; i++)
            {
                let child = p_node.childNodes[i];
        
                ConvertHTMLDOMWalker(ol_array, child);
            }
            p_result.push({ ol: ol_array });
            return;
            break;
        case "LI":
            let li_node = { text: p_node.textContent.replace(crlf_regex,"").trim() }
            p_result.push(convert_attribute_to_pdf(p_node, li_node));
            return;
            break;

    }


    for(let i = 0; i < p_node.childNodes.length; i++)
    {
        let child = p_node.childNodes[i];

        ConvertHTMLDOMWalker(p_result, child);
    }


}

// Build committee_review record - p is the field name & d is the data & pg_break is true/false if need page break
async function committee_review(p, d, pg_break) {
	// Name table
	let index = 4;      // Start on Committee Review Date
	let retPage = [];

	// console.log('p: ', p);
	// console.log('d: ', d);

	// Get the title for the Header
	retPage.push({ text: '', pageHeaderText: 'CORE SUMMARY' });

	// Need page break, used if print all or core
	if (pg_break) {
		retPage.push({ text: '', pageBreak: 'before' });
	}

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
				headerRows: 1,
				widths: [400, 'auto'],
				body: [
					[
						{ text: 'Committee Review Information', style: ['subHeader'], colSpan: '2' },
						{},
					],
					[
						{ text: `${p.children[index].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(d.date_of_review), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.pregnancy_relatedness, p.children[index + 1].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.estimate_degree_relevant_information_available, p.children[index + 2].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.does_committee_agree_with_cod_on_death_certificate, p.children[index + 3].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.pmss_mm, p.children[index + 4].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.pmss_mm_secondary, p.children[index + 5].values), style: ['tableDetail'], margin: [0, 0, 0, 20], },
					],
				],
			},
		},],
	);

	// Committee Determination of Cause(s) of Death
	index += 6;

	// Cause of Death array
	let lenArr = d.committee_determination_of_causes_of_death.length;
	let startArr = 0;
	let endArr = lenArr;

	// Build Header rows
	let body = [];
	let row = new Array();
	row.push(
		{ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '4', },
		{}, {}, {});
	body.push(row);
	row = new Array();
	row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], alignment: 'center', },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', },);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push({ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center', },);
			row.push({ text: lookupFieldArr(d.committee_determination_of_causes_of_death[curRec].type, p.children[index].children[0].values), style: ['tableDetail'], },);
			row.push({ text: d.committee_determination_of_causes_of_death[curRec].cause_descriptive, style: ['tableDetail'], },);
			row.push({ text: d.committee_determination_of_causes_of_death[curRec].comments, style: ['tableDetail'], },);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 100, 200, '*'],
				body: body,
			},
		},],
	);

	// Committee Determination on Circumstances Surrounding Death
	index += 1;
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
				headerRows: 1,
				widths: [400, 'auto'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', margin: [0, 20, 0, 0], },
						{},
					],
					[
						{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.did_obesity_contribute_to_the_death, 'yes_no_probably_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.did_discrimination_contribute_to_the_death, 'yes_no_probably_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.did_mental_health_conditions_contribute_to_the_death, 'yes_no_probably_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.did_substance_use_disorder_contribute_to_the_death, 'yes_no_probably_unknown'), style: ['tableDetail'], },
					],
				],
			},
		},],
	);

	// Manner of Death
	index += 5;
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
				headerRows: 1,
				widths: [400, 'auto'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', margin: [0, 20, 0, 0], },
						{},
					],
					[
						{ text: `${p.children[index + 1].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.was_this_death_a_sucide, 'yes_no_probably_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 2].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.was_this_death_a_homicide, 'yes_no_probably_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 3].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.means_of_fatal_injury, p.children[index + 3].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 4].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.specify_other_means_fatal_injury, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 5].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.if_homicide_relationship_of_perpetrator, p.children[index + 5].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 6].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: d.specify_other_relationship, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 7].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.was_this_death_preventable, p.children[index + 7].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 8].prompt}: `, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.chance_to_alter_outcome, p.children[index + 8].values), style: ['tableDetail'], margin: [0, 0, 0, 20], },
					],
				],
			},
		},
	]);

	// Contributing Factors and Reccommendations for Action
	index += 9;
	subIndex = 0;
	lenArr = d.critical_factors_worksheet.length;
	startArr = 0;
	endArr = lenArr;
	body = [];
	row = new Array();

	row.push({ text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '8', }, {}, {}, {}, {}, {}, {}, {},);
	body.push(row);

	row = new Array();
	row.push(
		{ text: 'Rec #', style: ['tableLabel', 'blueFill'] },
		{ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], },
		{ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], },
		{ text: p.children[index].children[subIndex + 0].prompt, style: ['tableLabel', 'blueFill'], },
		{ text: p.children[index].children[subIndex + 5].prompt, style: ['tableLabel', 'blueFill'], },
		{ text: p.children[index].children[subIndex + 6].prompt, style: ['tableLabel', 'blueFill'], },
		{ text: p.children[index].children[subIndex + 7].prompt, style: ['tableLabel', 'blueFill'], },
		{ text: p.children[index].children[subIndex + 8].prompt, style: ['tableLabel', 'blueFill'], },
	);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '8', }, {},);
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push(
				{ text: `${curRec + 1}`, style: ['tableDetail'], alignment: 'center' },
				{ text: lookupFieldArr(d.critical_factors_worksheet[curRec].category, p.children[index].children[3].values), style: ['tableDetail'], },
				{ text: lookupFieldArr(d.critical_factors_worksheet[curRec].class, p.children[index].children[2].values), style: ['tableDetail'], },
				{ text: d.critical_factors_worksheet[curRec].description, style: ['tableDetail'], },
				{ text: d.critical_factors_worksheet[curRec].committee_recommendations, style: ['tableDetail'], },
				{ text: lookupFieldArr(d.critical_factors_worksheet[curRec].recommendation_level, p.children[index].children[6].values), style: ['tableDetail'], },
				{ text: lookupFieldArr(d.critical_factors_worksheet[curRec].prevention, p.children[index].children[7].values), style: ['tableDetail'], },
				{ text: lookupFieldArr(d.critical_factors_worksheet[curRec].impact_level, p.children[index].children[8].values), style: ['tableDetail'], },
			);
			body.push(row);
		}
	}

	// Show the table 
	retPage.push([
		{
			layout: {
				defaultBorder: true,
				paddingLeft: function (i, node) { return 1; },
				paddingRight: function (i, node) { return 1; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; },
			},
			table: {
				headerRows: 2,
				widths: [30, 'auto', 'auto', 200, 200, '*', '*', '*'],
				body: body,
			},
		},
	]);

	return retPage;
}

// Core Summary - display all of the core summary fields
async function core_summary() {
	let body = [];
	// let arrMap = getArrayMap();

	// Record Core Fields
	let retPage = [];

	// let arrIndex = arrMap.findIndex((s) => s.name === 'home_record');
	body = await core_pdf_summary(g_md, g_d, '/', false, '');

	// Show the table
	await retPage.push([
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

function core_pdf_summary(p_metadata, p_data, p_path,  p_is_core_summary, p_metadata_path) 
{
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
							Array.prototype.push.apply(result, core_pdf_summary(child, p_data[child.name], p_path + "." + child.name,  is_core_summary, p_metadata_path + ".children[" + i + "]"));
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
								Array.prototype.push.apply(result, core_pdf_summary(child, form_item[child.name], p_path + "." + child.name,  is_core_summary, p_metadata_path + ".children[" + i + "]"));
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
							Array.prototype.push.apply(result, core_pdf_summary(child, p_data[child.name], p_path + "." + child.name,  is_core_summary, p_metadata_path + ".children[" + i + "]"));
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
										textStr = lookupGlobalArr(p_data[i][child.name], child.path_reference.substring(child.path_reference.indexOf('/')+1));
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
											textStr = lookupGlobalArr(p_data[i][child.name], child.path_reference.substring(child.path_reference.indexOf('/')+1));
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
						Array.prototype.push.apply(result, core_pdf_summary(child, p_data[child.name], p_path + "." + child.name,  is_core_summary, "g_metadata.children[" + i + "]"));
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
						Array.prototype.push.apply(result, core_pdf_summary(child, p_data[child.name], p_path + "." + child.name,  is_core_summary));
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
