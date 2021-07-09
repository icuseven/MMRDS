var g_md = null;        // global metadata
var g_d = null;         // global data
var section_name;       // section name
var g_current;          // current report printing
var writeText;          // record header field

async function print_pdf(section) {
	g_md = g_metadata;
	g_d = g_data;
	section_name = section;
	// g_pdf_need_page_break = false;

	console.log('g_md: ', g_md);
	console.log('g_d: ', g_d);
	console.log('section_name: ', section_name);
    writeText = 'Happy';

	// Get unique PDF name
	// let pdfName = createNamePDF();

	// Get the PDF Header Title
	let pdfTitle = getHeaderName();

	// Get the logoUrl for Header
	let logoUrl = await getBase64ImageFromURL("/images/mmria-secondary.png");

	// Create map of name and index of the g_md array children
	let arrMap = getArrayMap();

	// Format the content
	let retContent = formatContent(section_name, arrMap);

	let doc = {
		pageOrientation: 'landscape',
		pageMargins: [20, 80, 20, 20],
		info: {
			title: pdfTitle,
		},
		header: (currentPage, pageCount) => {
            // console.log( 'currentPage: ', currentPage );
            // console.log( 'doc: ', doc );
            if ( section_name === 'all' )
            {
                let recLenArr = [];
                let startPage = 0;
                let endPage = 0;
                let title = '';
                for ( let i = 0; i < doc.content.length; i++ )
                {
                    startPage = doc.content[i].positions[0].pageNumber;
                    endPage = doc.content[i].positions[doc.content[i].positions.length - 1].pageNumber;
                    recLenArr.push( { s: startPage, e: endPage } );
                }

                let index = recLenArr.findIndex( item => ( ( currentPage >= item.s ) && ( currentPage <= item.e ) ) );
                for ( let l = 0; l < doc.content[index].stack.length; l++ )
                {
                    writeText = ( doc.content[index].stack[l].pageHeaderText !== undefined ) ? doc.content[index].stack[l].pageHeaderText : writeText;
                }
            }
            else
            { 
                writeText = getSectionTitle(section_name);
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
                                { text: writeText, style: ['formHeader', 'isBold', 'lightFill'], }
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
				color: '#000000',
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
	}
	// pdfMake.createPdf( doc ).download( pdfName );
	pdfMake.createPdf(doc).open();

	console.log("done: ", retContent);
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
		var img = new Image();
		img.setAttribute("crossOrigin", "anonymous");
		img.onload = () => {
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			var dataURL = canvas.toDataURL("image/png");
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

// Format the date to always have 2 digits
function fmt2Digits(val) {
	return ((val < 10) ? '0' : '') + val;
}

// Reformat date - from YYYY/MM/DD to MM-DD-YYYY
function reformatDate(dt) {
	let date = new Date(dt);
	return (!isNaN(date.getTime())) ? `${fmt2Digits(date.getMonth() + 1)}-${fmt2Digits(date.getDate())}-${date.getFullYear()}` : '';
}

// Format date from data and return mm / dd / yyyy or blank if it contains 9999's
function fmtDataDate(dt) {
    if ( dt.year === '9999' ) {
        return '  /  /  ';
    }
    return `${fmt2Digits(dt.month)} / ${fmt2Digits(dt.day)} / ${dt.year}`;
}

// Format date and time string with mm/dd/yyyy hh:mm am
function fmtDateTime(dt) {
	let fDate = new Date(dt);
	console.log( 'dt: ', dt );
	console.log( 'fDate: ', fDate );
	let hh = fDate.getHours();
	let mn = fDate.getMinutes();
	let ampm = hh > 12 ? 'pm' : 'am';
	hh = hh % 12;
	hh = hh ? hh : 12;		// change the hour 0 to 12
	let strTime = `${fmt2Digits(hh)}:${fmt2Digits(mn)} ${ampm}`
	return `${fmt2Digits(fDate.getMonth())}/${fmt2Digits(fDate.getDate())}/${fDate.getFullYear()} ${strTime}`
}

// Reformat date from data string and return mm/dd/yyyy 
function fmtStrDate(dt) {
	if ( dt.length === 0 ) {
		return ' / / ';
	}
    let dtParts = dt.split( '-' );
    return `${fmt2Digits(dtParts[1])}/${fmt2Digits(dtParts[2])}/${dtParts[0]}`;
}

// Get the header name
function getHeaderName() {
	return 'MMRIA Record ID#: ' + g_d.home_record.record_id;
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
	// Find the correct lookup table index
	let lookupIndex = g_md.lookup.findIndex((s) => s.name === lookupName);

	// Return the full state name from the lookup array
	let arr = g_md.lookup[lookupIndex].values;
	let idx = arr.findIndex((s) => s.value === val);
	idx = (idx === -1) ? arr.findIndex((s) => parseInt(s.value, 10) === val) : idx;   // This fixes bad data coming in
	return arr[idx].display;
}

// Generic Look up display by value
function lookupFieldArr(val, arr) {
	let idx = arr.findIndex((s) => s.value === val);
	idx = (idx === -1) ? 0 : idx;   // This fixes bad data coming in
	return arr[idx].display;
}

// Return all races a person might be
function lookupRaceArr(val) {
    // Return field with all races
    let strRace = '';

    if ( val.length > 0 )
    {
        for (let i = 0; i < val.length; i++)
        {
            strRace += lookupGlobalArr( val[i], 'race') + ', ';
        }
        let idx = strRace.lastIndexOf(', ');
        strRace = ( idx === -1 ) ? strRace : strRace.substring(0,idx);
    }
    return strRace;
}

// Return all choices
function lookupMultiChoiceArr(val, arr) {
    // Return field with all choices
    let strChoice = '';

    if ( val.length > 0 )
    {
        for (let i = 0; i < val.length; i++)
        {
            strChoice += lookupFieldArr( val[i], arr) + ', ';
        }
        let idx = strChoice.lastIndexOf(', ');
        strChoice = ( idx === -1 ) ? strChoice : strChoice.substring(0,idx);
    }
    return strChoice;
}

// Find section prompt name
function getSectionTitle(name) {
    if ( name === 'all' )
    {
        console.log( 'title: ', g_current );
    }
    
	let idx = g_md.children.findIndex((s) => s.name === name);
	idx = (idx === -1) ? 0 : idx;		// fixes bad data coming in
	return g_md.children[idx].prompt.toUpperCase();
}

// Draw Line Chart
function drawLineChart(name, cols) {
	console.log( 'drawLineChart: ', name, ' - ', cols );
	var chartDefinition = {
		data: {
			columns: [
				['data1', 30, 200, 100, 400, 150, 250],
				['data2', 50, 20, 10, 40, 15, 25]
			]
		}
	};

	const chart = c3.generate(chartDefinition);
	console.log('chart: ', chart);

	

	return chart;
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
function formatContent(sectionName, arrMap) {
	let retContent = [];
	let arrIndex;

	switch (sectionName) {
		case 'home_record':
			arrIndex = arrMap.findIndex((s) => s.name === 'home_record');
			retContent.push(home_record(g_md.children[arrIndex], g_d.home_record));
			break;
		case 'death_certificate':
			arrIndex = arrMap.findIndex((s) => s.name === 'death_certificate');
			retContent.push(death_certificate(g_md.children[arrIndex], g_d.death_certificate, false));
			break;
		case 'birth_fetal_death_certificate_parent':
			arrIndex = arrMap.findIndex((s) => s.name === 'birth_fetal_death_certificate_parent');
			retContent.push(birth_fetal_death_certificate_parent(g_md.children[arrIndex], g_d.birth_fetal_death_certificate_parent, false));
			break;
		case 'birth_certificate_infant_fetal_section':
			arrIndex = arrMap.findIndex((s) => s.name === 'birth_certificate_infant_fetal_section');
			retContent.push(birth_certificate_infant_fetal_section(g_md.children[arrIndex], g_d.birth_certificate_infant_fetal_section, false));
			break;
		case 'autopsy_report':
			arrIndex = arrMap.findIndex((s) => s.name === 'autopsy_report');
			retContent.push(autopsy_report(g_md.children[arrIndex], g_d.autopsy_report, false));
			break;
		case 'prenatal':
			arrIndex = arrMap.findIndex((s) => s.name === 'prenatal');
			retContent.push(prenatal(g_md.children[arrIndex], g_d.prenatal, false));
			break;
		case 'er_visit_and_hospital_medical_records':
			arrIndex = arrMap.findIndex((s) => s.name === 'er_visit_and_hospital_medical_records');
			retContent.push(er_visit_and_hospital_medical_records(g_md.children[arrIndex], g_d.er_visit_and_hospital_medical_records, false));
			break;
		case 'other_medical_office_visits':
			arrIndex = arrMap.findIndex((s) => s.name === 'other_medical_office_visits');
			retContent.push(other_medical_office_visits(g_md.children[arrIndex], g_d.other_medical_office_visits, false));
			break;
		case 'medical_transport':
			arrIndex = arrMap.findIndex((s) => s.name === 'medical_transport');
			retContent.push(medical_transport(g_md.children[arrIndex], g_d.medical_transport, false));
			break;
		case 'social_and_environmental_profile':
			arrIndex = arrMap.findIndex((s) => s.name === 'social_and_environmental_profile');
			retContent.push(social_and_environmental_profile(g_md.children[arrIndex], g_d.social_and_environmental_profile, false));
			break;
		case 'mental_health_profile':
			arrIndex = arrMap.findIndex((s) => s.name === 'mental_health_profile');
			retContent.push(mental_health_profile(g_md.children[arrIndex], g_d.mental_health_profile, false));
			break;
		case 'informant_interviews':
			arrIndex = arrMap.findIndex((s) => s.name === 'informant_interviews');
			retContent.push(informant_interviews(g_md.children[arrIndex], g_d.informant_interviews, false));
			break;
		case 'case_narrative':
			arrIndex = arrMap.findIndex((s) => s.name === 'case_narrative');
			retContent.push(case_narrative(g_md.children[arrIndex], g_d.case_narrative, false));
			break;
		case 'committee_review':
			arrIndex = arrMap.findIndex((s) => s.name === 'committee_review');
			retContent.push(committee_review(g_md.children[arrIndex], g_d.committee_review, false));
			break;
		case 'core-summary':
		case 'all':
            // home_record
            g_current = 'home_record';
			arrIndex = arrMap.findIndex((s) => s.name === 'home_record');
			retContent.push(home_record(g_md.children[arrIndex], g_d.home_record));
            // death_certificate
            g_current = 'death_certificate';
            arrIndex = arrMap.findIndex((s) => s.name === 'death_certificate');
			retContent.push(death_certificate(g_md.children[arrIndex], g_d.death_certificate, true));
            // birth_fetal_death_certificate_parent
			arrIndex = arrMap.findIndex((s) => s.name === 'birth_fetal_death_certificate_parent');
			retContent.push(birth_fetal_death_certificate_parent(g_md.children[arrIndex], g_d.birth_fetal_death_certificate_parent, true));
		    // birth_certificate_infant_fetal_section
			arrIndex = arrMap.findIndex((s) => s.name === 'birth_certificate_infant_fetal_section');
			retContent.push(birth_certificate_infant_fetal_section(g_md.children[arrIndex], g_d.birth_fetal_death_certificate_parent, true));
			// autopsy_report
			arrIndex = arrMap.findIndex((s) => s.name === 'autopsy_report');
			retContent.push(autopsy_report(g_md.children[arrIndex], g_d.autopsy_report, true));
		    // prenatal
			arrIndex = arrMap.findIndex((s) => s.name === 'prenatal');
			retContent.push(prenatal(g_md.children[arrIndex], g_d.prenatal, true));
		    // er_visit_and_hospital_medical_records
			arrIndex = arrMap.findIndex((s) => s.name === 'er_visit_and_hospital_medical_records');
			retContent.push(er_visit_and_hospital_medical_records(g_md.children[arrIndex], g_d.er_visit_and_hospital_medical_records, true));
		    // other_medical_office_visits
			arrIndex = arrMap.findIndex((s) => s.name === 'other_medical_office_visits');
			retContent.push(other_medical_office_visits(g_md.children[arrIndex], g_d.other_medical_office_visits, true));
		    // medical_transport
			arrIndex = arrMap.findIndex((s) => s.name === 'medical_transport');
			retContent.push(medical_transport(g_md.children[arrIndex], g_d.medical_transport, true));
		    // social_and_environmental_profile
			arrIndex = arrMap.findIndex((s) => s.name === 'social_and_environmental_profile');
			retContent.push(social_and_environmental_profile(g_md.children[arrIndex], g_d.social_and_environmental_profile, true));
		    // mental_health_profile
			arrIndex = arrMap.findIndex((s) => s.name === 'mental_health_profile');
			retContent.push(mental_health_profile(g_md.children[arrIndex], g_d.mental_health_profile, true));
		    // informant_interviews
			arrIndex = arrMap.findIndex((s) => s.name === 'informant_interviews');
			retContent.push(informant_interviews(g_md.children[arrIndex], g_d.informant_interviews, true));
		    // case_narrative
			arrIndex = arrMap.findIndex((s) => s.name === 'case_narrative');
			retContent.push(case_narrative(g_md.children[arrIndex], g_d.case_narrative, true));
		    // committee_review
			arrIndex = arrMap.findIndex((s) => s.name === 'committee_review');
			retContent.push(committee_review(g_md.children[arrIndex], g_d.committee_review, true));
            break;
		default:
			// let a = info.fields[ 0 ].prompt;
			// console.log( 'xxx: ', a );
			retContent = [
				{ text: "Not done", bold: true, }
			];
	}

	return retContent;
}

//
// Build home_record - p is the field name & d is the data
//

function home_record(p, d) {
	// Name table
	let index = 0;
	let subIndex = 0;
	let retPage = [];

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

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
				widths: [200, 'auto'],
				body: [
					[
						{ text: 'Case Identification', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.first_name, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.middle_name, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.last_name, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: fmtDataDate(d.date_of_death), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.state_of_death_record, 'state'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.record_id, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.agency_case_id, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 7].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.how_was_this_death_identified, p.children[index + 7].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 8].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.specify_other_multiple_sources, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 9].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: (d.primary_abstractor), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 10].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.jurisdiction_id, style: ['tableDetail'], },
					],
				],
			}
		}
	]);

	// Overall Case Status
	index = 11;
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
				widths: [200, '*'],
				body: [
					[
						{ text: 'Overall Case Status', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.case_status.overall_case_status, p.children[index].children[subIndex + 1].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(d.case_status.abstraction_begin_date), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(d.case_status.abstraction_complete_date), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(d.case_status.projected_date), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(d.case_status.committee_review_date), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}:`, style: ['tableLabel'], alignment: 'right', },
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
				widths: [300, '*'],
				body: [
					[
						{ text: 'Overall Assessment of the Timing of Death', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.overall_assessment_of_timing_of_death.abstrator_assigned_status, p.children[index].children[subIndex + 1].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.overall_assessment_of_timing_of_death.number_of_days_after_end_of_pregnancey || 0}`, style: ['tableDetail'], },
					],
				],
			}
		}
	]);

	// Case Progress Status
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
				widths: [200, '*', 200, '*'],
				body: [
					[
						{ text: 'Case Progress Status', style: ['subHeader'], colSpan: '4', },
						{}, {}, {},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.death_certificate, 'case_progress'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.other_medical_visits, 'case_progress'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.autopsy_report, 'case_progress'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 7].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.medical_transport, 'case_progress'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.birth_certificate_parent_section, 'case_progress'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 8].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.social_and_psychological_profile, 'case_progress'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.birth_certificate_infant_or_fetal_death_section, 'case_progress'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 9].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.mental_health_profile, 'case_progress'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.prenatal_care_record, 'case_progress'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 10].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.informant_interviews, 'case_progress'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.er_visits_and_hospitalizations, 'case_progress'), style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 11].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.case_narrative, 'case_progress'), style: ['tableDetail'], },
					],
					[
						{},
						{},
						{ text: `${p.children[index].children[subIndex + 12].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.case_progress_report.committe_review_worksheet, 'case_progress'), style: ['tableDetail'], },
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
				widths: [200, '*'],
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
function death_certificate(p, d, pg_break) {
	// Name table
	let index = 0;
    let subIndex = 0;
	let retPage = [];

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
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
				widths: [200, '*', 200, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '4', },
						{}, {}, {},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.certificate_identification.time_of_death, style: ['tableDetail'], },
                        {}, {},
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.local_file_number, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.state_file_number, style: ['tableDetail'], },
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
				widths: [200, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 2].prompt}, ${p.children[index].children[subIndex + 3].prompt}, ${p.children[index].children[subIndex + 5].prompt}:`,
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
                            text: `${p.children[index].children[subIndex + 6].prompt}:`,
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
                            text: `${p.children[index].children[subIndex + 9].prompt}:`,
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
                            text: `${p.children[index].children[subIndex + 14].prompt}:`,
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
                            text: `${p.children[index].children[subIndex + 15].prompt}:`,
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
                            text: `${p.children[index].children[subIndex + 20].prompt}:`,
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
				widths: [200, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex].prompt}: ${p.children[index].children[subIndex].children[0].prompt} / ` +
                                `${p.children[index].children[subIndex].children[1].prompt} / ${p.children[index].children[subIndex].children[2].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 1].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 2].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 3].prompt}:`, 
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
                                `${lookupGlobalArr( d.demographics.country_of_birth, 'country')}`,
                            style: ['tableDetail'], 
                        },
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex + 7].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 8].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 9].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{
                            text: lookupFieldArr(d.demographics.ever_in_us_armed_forces, p.children[index].children[subIndex + 9].values ),
                            style: ['tableDetail'], 
                        },
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex + 10].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{
                            text: lookupGlobalArr(d.demographics.is_of_hispanic_origin, 'ethnicity' ),
                            style: ['tableDetail'], 
                        },
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex + 11].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 12].prompt}:`, 
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
                            text: `${p.children[index + 1].prompt}:`, 
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
				widths: [200, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 5].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{
                            text: lookupGlobalArr(d.race.omb_race_recode, 'omb_race_recode'),
                            style: ['tableDetail'], 
                        },
					],
                ],
            },
        },
    ], );

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
				widths: [200, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex].prompt}: ${p.children[index].children[subIndex].children[0].prompt} / ` +
                            `${p.children[index].children[subIndex].children[1].prompt} / ${p.children[index].children[subIndex].children[2].prompt}:`,
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{ text: fmtDataDate(d.injury_associated_information.date_of_injury), style: ['tableDetail'], },
					],
					[ 
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.injury_associated_information.time_of_injury, style: ['tableDetail'], },
					],
					[ 
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.injury_associated_information.place_of_injury, style: ['tableDetail'], },
					],
					[ 
						{ text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ 
                            text: lookupFieldArr(d.injury_associated_information.was_injury_at_work, p.children[index].children[subIndex + 3].values), 
                            style: ['tableDetail'], 
                        },
					],
					[ 
						{ text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ 
                            text: lookupFieldArr(d.injury_associated_information.transportation_related_injury, p.children[index].children[subIndex + 4].values),
                            style: ['tableDetail'], 
                        },
					],
					[ 
						{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.injury_associated_information.transport_related_other_specify, style: ['tableDetail'], },
					],
					[ 
						{ text: `${p.children[index].children[subIndex + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ 
                            text: lookupFieldArr(d.injury_associated_information.were_seat_belts_in_use, p.children[index].children[subIndex + 6].values),
                            style: ['tableDetail'], 
                        },
					],
                ],
            },
        },
    ], );

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
                widths: [200, '*'],
                body: [
                    [
                        { text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
                        {},
                    ],
                    [ 
                        { 
                            text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}:`, 
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
                                `${p.children[index].children[subIndex + 4].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
                        {
                            text: `${d.address_of_injury.city}, ${d.address_of_injury.state} ${d.address_of_injury.zip_code}`,
                            style: ['tableDetail'], 
                        },
                    ],
                    [ 
                        { 
                            text: `${p.children[index].children[subIndex + 5].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 9].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 14].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 15].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 20].prompt}:`, 
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
    ], );

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
                widths: [200, '*'],
                body: [
                    [
                        { text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
                        {},
                    ],
					[ 
						{ 
                            text: `${p.children[index].children[subIndex].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 1].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 2].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 3].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 4].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 5].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 6].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 7].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{
                            text: lookupFieldArr(d.death_information.did_tobacco_contribute_to_death, p.children[index].children[subIndex + 7].values),
                            style: ['tableDetail'], 
                        },
					],
					[ 
						{ 
                            text: `${p.children[index].children[subIndex + 2].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{
                            text: d.death_information.other_death_outside_of_hospital,
                            style: ['tableDetail'], 
                        },
					],
                ],
            },
        },
    ], );

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
                widths: [200, '*'],
                body: [
                    [
                        { text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
                        {},
                    ],
					[ 
						{ 
                            text: `${p.children[index].children[subIndex].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 1].prompt} / ${p.children[index].children[subIndex + 2].prompt}:`, 
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
                                `${p.children[index].children[subIndex + 5].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{
                            text: `${d.address_of_death.city}, ${d.address_of_death.state} ${d.address_of_death.zip_code}`,
                            style: ['tableDetail'], 
                        },
					],
					[ 
						{ 
                            text: `${p.children[index].children[subIndex + 6].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 9].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 14].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 15].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 20].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 24].prompt}:`, 
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
    ], );

    // Causes of Death
	index += 1;
    subIndex = 0;
 	lenArr = d.causes_of_death.length;
	startArr = 0;
	endArr = lenArr;
    body = [];
    row = new Array();

    row.push( { text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', }, {}, {}, {}, {}, {}, );
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

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '2', }, {}, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) 
        {
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
                widths: ['auto'],
                body: [
                    [ { text: p.children[index].prompt, style: ['subHeader'], }, ],
					[ { text: d.reviewer_note, style: ['tableDetail'], }, ],
                ],
            },
        },
    ], );

	return retPage;
}

// Build birth_fetal_death_certificate_parent record - p is the field name & d is the data & pg_break is true/false if need page break
function birth_fetal_death_certificate_parent(p, d, pg_break) {
	// Name table
	let index = 0;
    let subIndex = 0;
	let retPage = [];

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
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
                                `${p.children[index].children[subIndex].children[1].prompt} / ${p.children[index].children[subIndex].children[2].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{ text: fmtDataDate(d.facility_of_delivery_demographics.date_of_delivery), style: ['tableDetail'], colSpan: 5, },
                        {}, {}, {}, {},
					],
                    [
                        { text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right' },
                        { text: lookupFieldArr(d.facility_of_delivery_demographics.type_of_place, p.children[index].children[subIndex + 1].values), style: ['tableDetail'], },
                        { text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right' },
                        { text: lookupGlobalArr(d.facility_of_delivery_demographics.was_home_delivery_planned, 'yes_no'), style: ['tableDetail'], colSpan: 2, },
                        {}, {},
                    ],
                    [
                        { text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right' },
                        { text: lookupFieldArr(d.facility_of_delivery_demographics.maternal_level_of_care, p.children[index].children[subIndex + 3].values), style: ['tableDetail'], },
                        { text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right' },
                        { text: d.facility_of_delivery_demographics.other_maternal_level_of_care, style: ['tableDetail'], },
                        { text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right' },
                        { text: d.facility_of_delivery_demographics.facility_npi_number, style: ['tableDetail'], },
                    ],
                    [
                        { text: `${p.children[index].children[subIndex + 6].prompt}:`, style: ['tableLabel'], alignment: 'right' },
                        { text: d.facility_of_delivery_demographics.facility_name, style: ['tableDetail'], },
                        { text: `${p.children[index].children[subIndex + 7].prompt}:`, style: ['tableLabel'], alignment: 'right' },
                        { text: lookupFieldArr(d.facility_of_delivery_demographics.attendant_type, p.children[index].children[subIndex + 7].values), style: ['tableDetail'], },
                        { text: `${p.children[index].children[subIndex + 8].prompt}:`, style: ['tableLabel'], alignment: 'right' },
                        { text: d.facility_of_delivery_demographics.other_attendant_type, style: ['tableDetail'], },
                    ],
                    [
                        { text: `${p.children[index].children[subIndex + 9].prompt}:`, style: ['tableLabel'], alignment: 'right' },
                        { text: d.facility_of_delivery_demographics.attendant_npi, style: ['tableDetail'], },
                        { text: `${p.children[index].children[subIndex + 10].prompt}:`, style: ['tableLabel'], alignment: 'right' },
                        { text: lookupGlobalArr(d.facility_of_delivery_demographics.was_mother_transferred, 'yes_no'), style: ['tableDetail'], },
                        { text: `${p.children[index].children[subIndex + 11].prompt}:`, style: ['tableLabel'], alignment: 'right' },
                        { text: d.facility_of_delivery_demographics.transferred_from_where, style: ['tableDetail'], },
                    ],
                ],
            },
        },
    ],);

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
				widths: [150, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{}, 
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}:`, 
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
                                `${p.children[index].children[subIndex + 4].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{ 
                            text: `${d.facility_of_delivery_location.city}, ${d.facility_of_delivery_location.state} ` +
                                `${d.facility_of_delivery_location.zip_code}`, 
                            style: ['tableDetail'], 
                        },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.facility_of_delivery_location.county}`, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.facility_of_delivery_location.feature_matching_geography_type}`, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 13].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.facility_of_delivery_location.naaccr_census_tract_certainty_code}`, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 14].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.facility_of_delivery_location.naaccr_census_tract_certainty_type}`, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 15].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.facility_of_delivery_location.urban_status}`, style: ['tableDetail'], },
					],
                ],
            },
        },
    ],);

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
				widths: [150, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{}, 
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex].children[0].prompt} / ` +
                                `${p.children[index].children[subIndex].children[1].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{ 
                            text: `${d.demographic_of_father.date_of_birth.month} / ${d.demographic_of_father.date_of_birth.year}`, 
                            style: ['tableDetail'], 
                        },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.age, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.demographic_of_father.education_level, p.children[index].children[subIndex + 2].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.city_of_birth, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_father.state_of_birth, 'state'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_father.father_country_of_birth, 'country'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.primary_occupation, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.occupation_business_industry, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 8].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_father.is_father_of_hispanic_origin, 'ethnicity'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 9].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_father.is_father_of_hispanic_origin_other_specify, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].children[0].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupRaceArr(d.demographic_of_father.race.race_of_father), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].children[5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_father.race.omb_race_recode, 'omb_race_recode'), style: ['tableDetail'], },
					],
                ],
            },
        },
    ],);

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
				widths: [150, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{}, 
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 2].prompt} / ${p.children[index].children[subIndex + 3].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{ 
                            text: `${d.record_identification.last_name} / ${d.record_identification.maiden_name}`, 
                            style: ['tableDetail'], 
                        },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: `${d.record_identification.medical_record_number}`, style: ['tableDetail'], },
					],
                ],
            },
        },
    ],);

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
				widths: [150, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{}, 
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex].prompt}: ${p.children[index].children[subIndex].children[0].prompt} / ` +
                                `${p.children[index].children[subIndex].children[1].prompt} / ${p.children[index].children[subIndex].children[2].prompt}:` ,
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{ 
                            text: fmtDataDate(d.demographic_of_mother.date_of_birth), 
                            style: ['tableDetail'], 
                        },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_mother.age, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_mother.mother_married, 'yes_no'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ 
                            text: lookupGlobalArr(d.demographic_of_mother.If_mother_not_married_has_paternity_acknowledgement_been_signed_in_the_hospital, 'yes_no'), 
                            style: ['tableDetail'], 
                        },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_mother.city_of_birth, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_mother.state_of_birth, 'state'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_mother.country_of_birth, 'country'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_mother.primary_occupation, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 8].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_mother.occupation_business_industry, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 9].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_mother.ever_in_us_armed_forces, 'yes_no'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.demographic_of_mother.is_of_hispanic_origin, 'ethnicity'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 11].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.demographic_of_mother.is_of_hispanic_origin_other_specify, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 12].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.demographic_of_mother.education_level,p.children[index].children[subIndex + 12].values ), style: ['tableDetail'], },
					],
                ],
            },
        },
    ],);

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
				widths: [150, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{}, 
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}:`,
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
                                `${p.children[index].children[subIndex + 4].prompt}:`,
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{ 
                            text: `${d.location_of_residence.city}, ${lookupGlobalArr(d.location_of_residence.state, 'state')} ${d.location_of_residence.zip_code} `, 
                            style: ['tableDetail'], 
                        },
					],
                    [
                        { text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                        { text: d.location_of_residence.county, style: ['tableDetail'], },
                    ],
                    [
                        { text: `${p.children[index].children[subIndex + 8].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                        { text: d.location_of_residence.feature_matching_geography_type, style: ['tableDetail'], },
                    ],
                    [
                        { text: `${p.children[index].children[subIndex + 13].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                        { text: d.location_of_residence.naaccr_census_tract_certainty_code, style: ['tableDetail'], },
                    ],
                    [
                        { text: `${p.children[index].children[subIndex + 14].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                        { text: d.location_of_residence.naaccr_census_tract_certainty_type, style: ['tableDetail'], },
                    ],
                    [
                        { text: `${p.children[index].children[subIndex + 19].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                        { text: d.location_of_residence.urban_status, style: ['tableDetail'], },
                    ],
                    [
                        { text: `${p.children[index].children[subIndex + 23].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                        { text: d.location_of_residence.estimated_distance_from_residence, style: ['tableDetail'], },
                    ],
                ],
            },
        },
    ],);

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
				widths: [150, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{}, 
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupRaceArr(d.race.race_of_mother), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.race.omb_race_recode, 'omb_race_recode'), style: ['tableDetail'], },
					],
                ],
            },
        },
    ],);

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
				widths: [150, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{}, 
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: fmtDataDate(d.pregnancy_history.date_of_last_live_birth), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.live_birth_interval, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.number_of_previous_live_births, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex +3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.now_living, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.now_dead, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.other_outcomes, style: ['tableDetail'], },
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex + 6].prompt}:`,
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{ 
                            text: fmtDataDate(d.pregnancy_history.date_of_last_other_outcome), 
                            style: ['tableDetail'], 
                        },
					],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.pregnancy_interval, style: ['tableDetail'], },
					],
                ],
            },
        },
    ],);

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
				widths: [150, '*', 150, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '4', },
						{}, {}, {},
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{ 
                            text: `${d.maternal_biometrics.height_feet} / ${d.maternal_biometrics.height_inches}`, 
                            style: ['tableDetail'], 
                        },
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.maternal_biometrics.pre_pregnancy_weight, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.maternal_biometrics.weight_at_delivery, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.maternal_biometrics.weight_gain, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.maternal_biometrics.bmi, style: ['tableDetail'], },
                        {}, {},
					],
                ],
            },
        },
    ],);

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
				widths: [300, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{}, 
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: fmtDataDate(d.prenatal_care.date_of_last_normal_menses), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: fmtDataDate(d.prenatal_care.date_of_1st_prenatal_visit), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: fmtDataDate(d.prenatal_care.date_of_last_prenatal_visit), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care.calculated_gestation, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care.calculated_gestation_days, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care.obsteric_estimate_of_gestation, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.prenatal_care.plurality, p.children[index].children[subIndex + 6].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care.specify_if_greater_than_3, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 8].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.prenatal_care.was_wic_used, 'yes_no'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 9].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.prenatal_care.principal_source_of_payment_for_this_delivery, p.children[index].children[subIndex + 9].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 10].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care.specify_other_payor, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 11].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.prenatal_care.trimester_of_1st_prenatal_care_visit, p.children[index].children[subIndex + 11].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 12].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care.number_of_visits, style: ['tableDetail'], },
					],
                ],
            },
        },
    ],);

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
				widths: [300, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{}, 
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.cigarette_smoking.prior_3_months_type, p.children[index].children[subIndex + 1].values),style: ['tableDetail'], },
					],
					[
						{ 
                            text: `${p.children[index].children[subIndex + 2].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 4].prompt}:`, 
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
                            text: `${p.children[index].children[subIndex + 6].prompt}:`, 
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
                        { text: `${p.children[index].children[subIndex + 8].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                        { text: lookupFieldArr(d.cigarette_smoking.none_or_not_specified, p.children[index].children[subIndex + 8].values), style: ['tableDetail'], },
                    ],
                ],
            },
        },
    ],);

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
				widths: [300, '*'],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{}, 
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.risk_factors.risk_factors_in_this_pregnancy, p.children[index].children[subIndex].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.risk_factors.number_of_c_sections, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.infections_present_or_treated_during_pregnancy, p.children[index + 1].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.specify_other_infection, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.onset_of_labor, p.children[index + 3].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.obstetric_procedures, p.children[index + 4].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.characteristics_of_labor_and_delivery, p.children[index + 5].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupMultiChoiceArr(d.maternal_morbidity, p.children[index + 6].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 7].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.length_between_child_birth_and_death_of_mother, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 10].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.reviewer_note, style: ['tableDetail'], },
					],
                ],
            },
        },
    ],);

	return retPage;
}

// Build birth_certificate_infant_fetal_section record - p is the field name & d is the data & pg_break is true/false if need page break
function birth_certificate_infant_fetal_section(p, d, pg_break) {
	// Global fields
	let index = 0;
    let subIndex = 0;
	let retPage = [];
    uArr = window.location.href.split("/");
    let allRecs = (uArr[uArr.length -1] === 'birth_certificate_infant_fetal_section' || pg_break) ? true : false;
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

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
        retPage.push({ text: '', pageBreak: 'before' });
    }

    // Are there any records
    if (lenArr === 0) {
        retPage.push({ text: 'No records entered', style: ['tableDetail'], }, );
    } else {
        if (!allRecs) {
            startArr = parseInt(uArr[uArr.length - 1], 10);
            endArr = startArr + 1;
        }

        // Display record(s)
        for ( let curRec = startArr; curRec < endArr; curRec++ ) {
            index = 0;
            subIndex = 0;

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
                                { text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: lookupFieldArr(d[curRec].record_type, p.children[index].values), style: ['tableDetail', 'lightFill'], },
                            ],
                            [
                                { text: `${p.children[index + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: lookupGlobalArr(d[curRec].is_multiple_gestation, 'yes_no'), style: ['tableDetail'], },
                            ],
                            [
                                { text: `${p.children[index + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].birth_order, style: ['tableDetail', 'lightFill'], },
                            ],
                        ],
                    },
                },
            ],);

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
                                { text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].record_identification.state_file_number, style: ['tableDetail'], },
                                { text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].record_identification.local_file_number, style: ['tableDetail'], },
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].record_identification.newborn_medical_record_number, style: ['tableDetail'], colSpan: '3',},
                                {}, {},
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].record_identification.date_of_delivery, style: ['tableDetail'], },
                                { text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].record_identification.time_of_delivery, style: ['tableDetail'], },
                            ],
                        ],
                    },
                },
            ],);

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
                                { text: `${p.children[index].children[subIndex].children[0].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { 
                                    text: lookupFieldArr(d[curRec].biometrics_and_demographics.birth_weight.unit_of_measurement, 
                                        p.children[index].children[subIndex].children[0].values),
                                    style: ['tableDetail'], 
                                    colSpan: '3', 
                                },
                                {}, {},
                            ],
                            [
                                { text: `${p.children[index].children[subIndex].children[1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].biometrics_and_demographics.birth_weight.grams_or_pounds, style: ['tableDetail'], },
                                { text: `${p.children[index].children[subIndex].children[2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].biometrics_and_demographics.birth_weight.ounces, style: ['tableDetail'], },
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { 
                                    text: lookupFieldArr(d[curRec].biometrics_and_demographics.gender, p.children[index].children[subIndex + 1].values),
                                    style: ['tableDetail'], 
                                    colSpan: '3', 
                                },
                                {}, {},
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 2].children[0].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].biometrics_and_demographics.apgar_scores.minute_5, style: ['tableDetail'], colSpan: '3', },
                                {}, {},
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 2].children[1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].biometrics_and_demographics.apgar_scores.minute_10, style: ['tableDetail'], colSpan: '3', },
                                {}, {},
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { 
                                    text: lookupFieldArr(d[curRec].biometrics_and_demographics.is_infant_living_at_time_of_report, 
                                        p.children[index].children[subIndex + 3].values),
                                    style: ['tableDetail'], 
                                    colSpan: '3', 
                                },
                                {}, {},
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { 
                                    text: lookupGlobalArr(d[curRec].biometrics_and_demographics.is_infant_being_breastfed_at_discharge, 'yes_no'),
                                    style: ['tableDetail'], 
                                    colSpan: '3', 
                                },
                                {}, {},
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { 
                                    text: lookupGlobalArr(d[curRec].biometrics_and_demographics.was_infant_transferred_within_24_hours, 'yes_no'),
                                    style: ['tableDetail'], 
                                    colSpan: '3', 
                                },
                                {}, {},
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].biometrics_and_demographics.facility_city_state, style: ['tableDetail'], colSpan: '3', },
                                {}, {},
                            ],
                        ],
                    },
                },
            ],);

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
                                { text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { 
                                    text: lookupGlobalArr(d[curRec].method_of_delivery.was_delivery_with_forceps_attempted_but_unsuccessful, 'yes_no'), 
                                    style: ['tableDetail'], 
                                },
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { 
                                    text: lookupGlobalArr(d[curRec].method_of_delivery.was_delivery_with_vacuum_extration_attempted_but_unsuccessful, 'yes_no'), 
                                    style: ['tableDetail'], 
                                },
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { 
                                    text: lookupFieldArr(d[curRec].method_of_delivery.fetal_delivery, p.children[index].children[subIndex + 2].values), 
                                    style: ['tableDetail'], 
                                },
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].method_of_delivery.other_presentation, style: ['tableDetail'], },
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { 
                                    text: lookupFieldArr(d[curRec].method_of_delivery.final_route_and_method_of_delivery, 
                                        p.children[index].children[subIndex + 4].values), 
                                    style: ['tableDetail'], 
                                },
                            ],
                            [
                                { text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { 
                                    text: lookupGlobalArr(d[curRec].method_of_delivery.was_delivery_with_vacuum_extration_attempted_but_unsuccessful, 
                                        'no_yes_not_applicable_unknown'), 
                                    style: ['tableDetail'], 
                                },
                            ],
                            [
                                { text: `${p.children[index + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { 
                                    text: lookupMultiChoiceArr(d[curRec].abnormal_conditions_of_newborn, p.children[index + 1].values),
                                    style: ['tableDetail'], 
                                },
                            ],
                            [
                                { text: `${p.children[index + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { 
                                    text: lookupMultiChoiceArr(d[curRec].congenital_anomalies, p.children[index + 2].values),
                                    style: ['tableDetail'], 
                                },
                            ],
                            [
                                { text: `${p.children[index + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                                { text: d[curRec].icd_version, style: ['tableDetail'], },
                            ],
                        ],
                    },
                },
            ],);

            // Add some space between last row and table
            retPage.push([ { text: '', margin: [0, 0, 0, 15],},],);

            // Causes of death
            index += 4;
            deathIndex = 0;
            deathLenArr = d[curRec].causes_of_death.length;
            deathStartArr = 0;
            deathEndArr = deathLenArr;
        
            body = [];
            row = new Array();

            row.push( { text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '6', }, {}, {}, {}, {}, {}, );
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

            console.log( 'deathStartArr: ', deathStartArr );
            console.log( 'deathEndArr: ', deathEndArr );
            console.log( 'deathLenArr: ', deathLenArr );

            // Are there any fetal death records?
            if (deathLenArr === 0) {
                row = new Array();
                row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, {}, {}, {}, {}, {}, );
                body.push(row);
            } else {
                // Build the table detail
                for (let deathCurRec = deathStartArr; deathCurRec < deathEndArr; deathCurRec++) 
                {
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
                    console.log( 'deathCurRec: ', deathCurRec );
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
            ],);

            // See if we need a page break
            if ( allRecs && (startArr !== endArr) && (curRec < endArr - 1) ) {
                retPage.push([ { text: '', pageBreak: 'before' }, ],);
            }
        }
    }


	return retPage;
}

// Build autopsy_report record - p is the field name & d is the data & pg_break is true/false if need page break
function autopsy_report(p, d, pg_break) {
	// Name table
	let index = 0;
    let subIndex = 0;
	let body = [];
	let retPage = [];

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
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
				widths: [250, 'auto', ],
				body: [
					[
						{ text: 'Autopsy Information', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.was_there_an_autopsy_referral, 'yes_no_with_unknown'), style: ['tableDetail'], },
                    ],
                    [
						{ text: `${p.children[index + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.type_of_autopsy_or_examination, p.children[index + 1].values), style: ['tableDetail'], },
					],
                    [
						{ text: `${p.children[index + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.is_autopsy_or_exam_report_available, 'no_yes_not_applicable_unknown'), style: ['tableDetail'], },
					],
                    [
						{ text: `${p.children[index + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.was_toxicology_performed, 'no_yes_not_applicable_unknown'), style: ['tableDetail'], },
					],
                    [
						{ text: `${p.children[index + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.is_toxicology_report_available, 'no_yes_not_applicable_unknown'), style: ['tableDetail'], },
					],
                    [
						{ text: `${p.children[index + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
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
				widths: [250, 'auto', ],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.reporter_characteristics.reporter_type, p.children[index].children[subIndex].values), style: ['tableDetail'], },
                    ],
                    [
                        { text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                        { text: d.reporter_characteristics.other_specify, style: ['tableDetail'], },
                    ],
					[
						{ 
                            text: `${p.children[index].children[subIndex + 2].prompt}: ${p.children[index].children[subIndex + 2].children[0].prompt} / ` +
                                `${p.children[index].children[subIndex + 2].children[1].prompt} / ${p.children[index].children[subIndex + 2].children[2].prompt}:`, 
                            style: ['tableLabel'], 
                            alignment: 'right', 
                        },
						{ text: fmtDataDate(d.reporter_characteristics.date_of_autopsy), style: ['tableDetail'], },
                    ],
                    [
                        { text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
                        { text: d.reporter_characteristics.jurisdiction, style: ['tableDetail'], },
                    ],
                ],
            },
        },
    ], );

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
                            text: `${p.children[index].children[subIndex + 1].children[0].prompt}:`,
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
                            text: `${p.children[index].children[subIndex + 1].children[1].prompt}:`,
                            style: ['tableLabel'],
                            alignment: 'right',
                        },
                        { text: d.biometrics.fetus.fetal_length, style: ['tableDetail'], },
                    ],
                    [
                        { 
                            text: `${p.children[index].children[subIndex].prompt} - ${p.children[index].children[subIndex].children[1].prompt}:`,
                            style: ['tableLabel'],
                            alignment: 'right',
                        },
                        { text: d.biometrics.mother.weight, style: ['tableDetail'], },
                        { 
                            text: `${p.children[index].children[subIndex + 1].children[2].prompt}:`,
                            style: ['tableLabel'],
                            alignment: 'right',
                        },
                        { text: d.biometrics.fetus.gestational_age_estimate, style: ['tableDetail'], },
                    ],
                    [
                        { 
                            text: `${p.children[index].children[subIndex].prompt} - ${p.children[index].children[subIndex].children[2].prompt}:`,
                            style: ['tableLabel'],
                            alignment: 'right',
                        },
                        { text: d.biometrics.mother.bmi, style: ['tableDetail'], },
                        {}, {},
                    ],
                ],
            },
        },
    ], );

    // Findings Relevant to Maternal Death
    index += 1;
    retPage.push({ text: p.children[index].prompt, style: ['subHeader'], margin: [0, 20, 0, 5]}, );

	// Gross Findings
	let lenArr = d.relevant_maternal_death_findings.gross_findings.length;
	let startArr = 0;
	let endArr = lenArr;

	// Build Header rows
	let row = new Array();
	row.push(
		{
			text: p.children[index].children[subIndex].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '3',
			border: [true, true, true, false],
		}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], alignment: 'center', },);
	row.push({ text: p.children[index].children[subIndex].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '3', }, );
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
    retPage.push({ text: '', margin: [0, 20, 0, 0], }, );

	// Microscopic Findings
	lenArr = d.relevant_maternal_death_findings.microscopic_findings.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
    body = [];
	row = new Array();
	row.push(
		{
			text: p.children[index].children[subIndex + 1].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '3',
			border: [true, true, true, false],
		}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], alignment: 'center', },);
	row.push({ text: p.children[index].children[subIndex].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '3', }, );
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
				widths: [250, 'auto', ],
				body: [
					[
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', margin: [0, 10, 0, 10], },
						{ text: lookupFieldArr(d.was_drug_toxicology_positive, p.children[index].values), style: ['tableDetail'], margin: [0, 10, 0, 10], },
                    ],
                ],
            },
        },
    ], );

	// Toxicology
    index += 1;
	lenArr = d.toxicology.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
    body = [];
	row = new Array();
	row.push(
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '7',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], alignment: 'center', },);
	row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex + 4].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex + 5].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

    // Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '7', }, );
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
				widths: [250, 'auto', ],
				body: [
					[
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', margin: [0, 10, 0, 10], },
						{ text: d.icd_code_version, style: ['tableDetail'], margin: [0, 10, 0, 10], },
                    ],
                ],
            },
        },
    ], );

	// Coroner/Medical Examiner Causes of Death
    index += 1;
	lenArr = d.causes_of_death.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
    body = [];
	row = new Array();
	row.push(
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '5',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], alignment: 'center', },);
	row.push({ text: p.children[index].children[subIndex].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex + 1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex + 2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex + 3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	body.push(row);

    // Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', }, );
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
				widths: ['auto', ],
				body: [
					[ { text: p.children[index].prompt, style: ['subHeader'], margin: [0, 10, 0, 0], }, ],
					[ { text: d.reviewer_note, style: ['tableDetail'], }, ],
                ],
            },
        },
    ], );

	return retPage;
}

// Build prenatal record - p is the field name & d is the data & pg_break is true/false if need page break
function prenatal(p, d, pg_break) {
	// Name table
	let index = 0;
	let subIndex = 0;
	let retPage = [];

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
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
				widths: [250, 'auto', ],
				body: [
					[
						{ text: 'Record / Facility', style: ['subHeader'], colSpan: '2', },
						{},
					],
					[
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.prenatal_care_record_no, style: ['tableDetail'], },
                    ],
                    [
						{ text: `${p.children[index + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
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
				widths: [250, '*', 150, '*' ],
				body: [
					[
						{ text: p.children[index].prompt, style: ['subHeader'], colSpan: '4', },
						{}, {}, {},
					],
					[
						{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ 
							text: lookupFieldArr(d.primary_prenatal_care_facility.place_type, p.children[index].children[subIndex].values), 
							style: ['tableDetail'], 
						},
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.primary_prenatal_care_facility.other_place_type, style: ['tableDetail'], },
                    ],
                    [
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ 
							text: lookupFieldArr(d.primary_prenatal_care_facility.primary_provider_type, p.children[index].children[subIndex + 2].values), 
							style: ['tableDetail'], 
						},
						{ text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.primary_prenatal_care_facility.specify_other_provider_type, style: ['tableDetail'], },
					],
                    [
						{ text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ 
							text: lookupFieldArr(d.primary_prenatal_care_facility.principal_source_of_payment, p.children[index].children[subIndex + 4].values), 
							style: ['tableDetail'], 
						},
						{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.primary_prenatal_care_facility.other_payment_source, style: ['tableDetail'], },
					],
                    [
						{ text: `${p.children[index].children[subIndex + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
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
							text: `${p.children[index].children[subIndex].prompt} / ${p.children[index].children[subIndex + 1].prompt}:`, 
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
								`${p.children[index].children[subIndex + 4].prompt}:`, 
							style: ['tableLabel'], 
							alignment: 'right', 
						},
						{ 
							text: `${d.location_of_primary_prenatal_care_facility.city}, ${d.location_of_primary_prenatal_care_facility.state} ` +
								`${d.location_of_primary_prenatal_care_facility.zip_code}`, 
							style: ['tableDetail'], 
						},
                    ],
					[
						{ 
							text: `${p.children[index].children[subIndex + 5].prompt}:`, 
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
							text: `${p.children[index].children[subIndex + 8].prompt}:`, 
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
							text: `${p.children[index].children[subIndex + 13].prompt}:`, 
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
							text: `${p.children[index].children[subIndex + 14].prompt}:`, 
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
							text: `${p.children[index].children[subIndex + 19].prompt}:`, 
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
	],);

	// Prior Surgical Procedures Before this Pregnancy
	index += 1;
	let lenArr = d.prior_surgical_procedures_before_pregnancy.length;
	let startArr = 0;
	let endArr = lenArr;

	// Build Header rows
	let body = [];
	let row = new Array();
	row.push(
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '4',
			border: [true, true, true, false],
		}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
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
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.had_pre_existing_conditions, 'yes_no'), style: ['tableDetail'], },
                    ],
				],
			},
		},
	],);

	// Pre-existing Conditions
	index += 1;
	lenArr = d.pre_existing_conditons_grid.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '5',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
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
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.were_there_documented_mental_health_conditions, 'yes_no'), style: ['tableDetail'], },
                    ],
				],
			},
		},
	],);

	// Family Medical History
	index += 1;
	lenArr = d.family_medical_history.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '6',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
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
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.evidence_of_substance_use, 'yes_no'), style: ['tableDetail'], },
                    ],
				],
			},
		},
	],);

	// Evidence of Substance Use
	index += 1;
	lenArr = d.substance_use_grid.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '6',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
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
						{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.gravida, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.para, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.pregnancy_history.abortions, style: ['tableDetail'], },
                    ],
				],
			},
		},
	],);

	// Pregnancy History Details
	subIndex = 3;
	lenArr = d.pregnancy_history.details_grid.length;
	startArr = 0;
	endArr = lenArr;

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '8',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex].children[4].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex].children[5].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[subIndex].children[6].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
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
				widths: [30, '*','*', '*', '*', '*', '*', '*'],
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
								`${p.children[index].children[subIndex].children[1].prompt} / ${p.children[index].children[subIndex].children[2].prompt}:`, 
							style: ['tableLabel'], 
							alignment: 'right', 
						},
						{ 
							text: `${fmt2Digits(d.intendedenes.date_birth_control_was_discontinued.month)} / ` +
								`${fmt2Digits(d.intendedenes.date_birth_control_was_discontinued.day)} / ` +
								`${d.intendedenes.date_birth_control_was_discontinued.year}`, 
							style: ['tableDetail'], 
						},
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.intendedenes.was_pregnancy_planned, p.children[index].children[subIndex + 1].values), style: ['tableDetail'], },
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.intendedenes.was_patient_using_birth_control, p.children[index].children[subIndex + 2].values), style: ['tableDetail'], },
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: d.intendedenes.was_patient_using_birth_control_other_specify, style: ['tableDetail'], },
                    ],
				],
			},
		},
	],);

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
						{ text: `${p.children[index].children[subIndex].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.infertility_treatment.was_pregnancy_result_of_infertility_treatment, 'yes_no'), style: ['tableDetail'], },
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.infertility_treatment.fertility_enhanding_drugs, 'yes_no'), style: ['tableDetail'], },
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 2].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.infertility_treatment.assisted_reproductive_technology, 'yes_no'), style: ['tableDetail'], },
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 3].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.infertility_treatment.art_type, p.children[index].children[subIndex + 3].values), style: ['tableDetail'], },
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 4].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: d.infertility_treatment.specify_other_art_type, style: ['tableDetail'], },
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 5].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: d.infertility_treatment.cycle_number, style: ['tableDetail'], },
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 6].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: d.infertility_treatment.embryos_transferred, style: ['tableDetail'], },
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 7].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: d.infertility_treatment.embryos_growing, style: ['tableDetail'], },
                    ],
				],
			},
		},
	],);

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
								`${p.children[index].children[subIndex].children[1].prompt} / ${p.children[index].children[subIndex].children[2].prompt}:`, 
							style: ['tableLabel'], 
							alignment: 'right', 
						},
						{ 
							text: `${fmt2Digits(d.current_pregnancy.date_of_last_normal_menses.month)} / ` +
								`${fmt2Digits(d.current_pregnancy.date_of_last_normal_menses.day)} / ` +
								`${d.current_pregnancy.date_of_last_normal_menses.year}`, 
							style: ['tableDetail'], 
						},
                    ],
					// Estimated Date of Delivery
					[
						{ 
							text: `${p.children[index].children[subIndex + 1].prompt}: ${p.children[index].children[subIndex + 1].children[0].prompt} / ` +
								`${p.children[index].children[subIndex + 1].children[1].prompt} / ${p.children[index].children[subIndex + 1].children[2].prompt}:`, 
							style: ['tableLabel'], 
							alignment: 'right', 
						},
						{ 
							text: `${fmt2Digits(d.current_pregnancy.estimated_date_of_confinement.month)} / ` +
								`${fmt2Digits(d.current_pregnancy.estimated_date_of_confinement.day)} / ` +
								`${d.current_pregnancy.estimated_date_of_confinement.year}`, 
							style: ['tableDetail'], 
						},
                    ],
					[
						{ 
							text: `${p.children[index].children[subIndex + 1].children[3].prompt}:`, 
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
								`${p.children[index].children[subIndex + 2].children[1].prompt} / ${p.children[index].children[subIndex + 2].children[2].prompt}:`, 
							style: ['tableLabel'], 
							alignment: 'right', 
						},
						{ 
							text: `${fmt2Digits(d.current_pregnancy.date_of_1st_prenatal_visit.month)} / ` +
								`${fmt2Digits(d.current_pregnancy.date_of_1st_prenatal_visit.day)} / ` +
								`${d.current_pregnancy.date_of_1st_prenatal_visit.year}`, 
							style: ['tableDetail'], 
						},
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 2].children[3].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.date_of_1st_prenatal_visit.gestational_age_weeks, style: ['tableDetail'], },
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 2].children[4].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.date_of_1st_prenatal_visit.gestational_age_days, style: ['tableDetail'], },
                    ],
					// Date of First Ultrasound
					[
						{ 
							text: `${p.children[index].children[subIndex + 3].prompt}: ${p.children[index].children[subIndex + 3].children[0].prompt} / ` +
								`${p.children[index].children[subIndex + 3].children[1].prompt} / ${p.children[index].children[subIndex + 3].children[2].prompt}:`, 
							style: ['tableLabel'], 
							alignment: 'right', 
						},
						{ 
							text: `${fmt2Digits(d.current_pregnancy.date_of_1st_ultrasound.month)} / ` +
								`${fmt2Digits(d.current_pregnancy.date_of_1st_ultrasound.day)} / ` +
								`${d.current_pregnancy.date_of_1st_ultrasound.year}`, 
							style: ['tableDetail'], 
						},
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 3].children[3].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.date_of_1st_ultrasound.gestational_age_at_first_ultrasound, style: ['tableDetail'], },
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 3].children[4].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.date_of_1st_ultrasound.gestational_age_at_first_ultrasound_days, style: ['tableDetail'], },
                    ],
					// Date of Last Prenatal Visit
					[
						{ 
							text: `${p.children[index].children[subIndex + 4].prompt}: ${p.children[index].children[subIndex + 4].children[0].prompt} / ` +
								`${p.children[index].children[subIndex + 4].children[1].prompt} / ${p.children[index].children[subIndex + 4].children[2].prompt}:`, 
							style: ['tableLabel'], 
							alignment: 'right', 
						},
						{ 
							text: `${fmt2Digits(d.current_pregnancy.date_of_last_prenatal_visit.month)} / ` +
								`${fmt2Digits(d.current_pregnancy.date_of_last_prenatal_visit.day)} / ` +
								`${d.current_pregnancy.date_of_last_prenatal_visit.year}`, 
							style: ['tableDetail'], 
						},
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 4].children[3].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.date_of_last_prenatal_visit.gestational_age_at_last_prenatal_visit, style: ['tableDetail'], },
                    ],
					[
						{ text: `${p.children[index].children[subIndex + 4].children[4].prompt}:`,style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.date_of_last_prenatal_visit.gestational_age_at_last_prenatal_visit_days, style: ['tableDetail'], },
                    ],
				],
			},
		},
	],);

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
								`${p.children[index].children[subIndex + 5].children[1].prompt}:`, 
							style: ['tableLabel'], 
							alignment: 'right', 
						},
						{ text: `${d.current_pregnancy.height.feet} / ${d.current_pregnancy.height.inches}`, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.pre_pregnancy_weight, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 7].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.bmi, style: ['tableDetail'], },
                    ],
					// Weight-First, Weight-Last, Weight-Gain
					[
						{ text: `${p.children[index].children[subIndex + 8].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.weight_at_1st_visit, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 9].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.weight_at_last_visit, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 10].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.weight_gain, style: ['tableDetail'], },
                    ],
				],
			},
		},
	],);

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
						{ text: `${p.children[index].children[subIndex + 11].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.total_number_of_visits, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 12].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.current_pregnancy.trimester_of_first_pnc_visit, p.children[index].children[subIndex + 12].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 13].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.number_of_fetuses, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 14].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.current_pregnancy.was_home_delivery_planned, 'yes_no'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 15].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.current_pregnancy.attended_prenatal_visits_alone, 'yes_no_with_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index].children[subIndex + 16].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.current_pregnancy.intended_birthing_facility, style: ['tableDetail'], },
					],
				],
			},
		},
	],);

	// Routine Monitoring
	index += 1;
	subIndex = 0;
	lenArr = d.routine_monitoring.length;
	startArr = 0;
	endArr = lenArr;

	// Array for Charts
	let chartArr = [];

	// Build Header rows
	body = [];
	row = new Array();
	row.push(
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '4',
			border: [true, true, true, false],
		}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: 'Date', style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: 'Medical Information', style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: 'Comment(s)', style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
			row.push( { text: `${curRec + 1}`, style: ['tableDetail'], }, );
			row.push( { text: fmtStrDate(d.routine_monitoring[curRec].date_and_time), style: ['tableDetail'], }, );
			row.push( { 
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
						{ text: d.routine_monitoring[curRec].gestational_age_weeks, style: ['tableDetail'], },
						{ text: d.routine_monitoring[curRec].gestational_age_days, style: ['tableDetail'], },
						{ text: d.routine_monitoring[curRec].systolic_bp, style: ['tableDetail'], },
						{ text: d.routine_monitoring[curRec].diastolic, style: ['tableDetail'], },
						{ text: d.routine_monitoring[curRec].heart_rate, style: ['tableDetail'], },
						{ text: d.routine_monitoring[curRec].oxygen_saturation, style: ['tableDetail'], },
						{ text: lookupFieldArr(d.routine_monitoring[curRec].urine_protein, p.children[index].children[subIndex + 7].values), style: ['tableDetail'], },
						{ text: lookupFieldArr(d.routine_monitoring[curRec].urine_ketones, p.children[index].children[subIndex + 8].values), style: ['tableDetail'], },
						{ text: lookupFieldArr(d.routine_monitoring[curRec].urine_glucose, p.children[index].children[subIndex + 9].values), style: ['tableDetail'], },
						{ text: d.routine_monitoring[curRec].blood_hematocrit, style: ['tableDetail'], },
						{ text: d.routine_monitoring[curRec].weight, style: ['tableDetail'], },
					],
				],
			 }, );
			row.push( { text: d.routine_monitoring[curRec].comments, style: ['tableDetail'], }, );
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
				widths: [30, 75, 200, '*', ],
				body: body,
			},
		},],
	);


	// Graphs for Routine Monitoring Records (index 16, 17 & 18)
	index += 1;
	subIndex = 0;
	body = [];
	// Save the chart info
	// chartArr.push([
	// 	[
	// 		`'Systolic', 120, 125}`
	// 	],
	// ]);
	// const myTestChart = drawLineChart('Blood Pressure', chartArr);
	// console.log('myTestChart: ', myTestChart );
	// const mySvg = new XMLSerializer().serializeToString(document.querySelector('svg'));
	// console.log( 'mySvg: ', mySvg );
	// const myBase64Data = window.btoa(mySvg);
	// console.log( 'myBase64Data: ', myBase64Data );

	// body.push([{ 
	// 	image: `'data:image/png;base64,${myBase64Data}'`, 
	// 	width: 200, 
	// },],);

	// console.log( 'body: ', body );

	// retPage.push([
	// 	{
	// 		layout: {
	// 			defaultBorder: false,
	// 			paddingLeft: function (i, node) { return 1; },
	// 			paddingRight: function (i, node) { return 1; },
	// 			paddingTop: function (i, node) { return 2; },
	// 			paddingBottom: function (i, node) { return 2; },
	// 		},
	// 		width: 'auto',
	// 		margin: [0, 10, 0, 0],
	// 		table: {
	// 			headerRows: 1,
	// 			widths: ['*'],
	// 			body: body,
	// 		},
	// 	},
	// ],);

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
						{ text: `${p.children[index].prompt}: ${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.highest_blood_pressure.systolic, style: ['tableDetail'], },
						{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.highest_blood_pressure.diastolic, style: ['tableDetail'], },
						{ text: `${p.children[index + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.lowest_hematocrit, style: ['tableDetail'], },
					],
				],
			},
		},
	],);

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
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '7',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[5].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '7', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
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
    retPage.push({ text: '', margin: [0, 20, 0, 0], }, );

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
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '6',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
			row.push({ text: fmtStrDate(d.diagnostic_procedures[curRec].date), style: ['tableDetail'], },);
			row.push({ text: d.diagnostic_procedures[curRec].gestational_age_weeks, style: ['tableDetail'], },);
			row.push({ text: d.diagnostic_procedures[curRec].gestational_age_days, style: ['tableDetail'], },);
			row.push({ text: d.diagnostic_procedures[curRec].procedure, style: ['tableDetail'], },);
			row.push({ text: d.diagnostic_procedures[curRec].results, style: ['tableDetail'], },);
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
				widths: [300, '*'],
				body: [
					[
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.were_there_problems_identified, 'yes_no'), style: ['tableDetail'], },
					],
				],
			},
		},
	],);

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
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '6',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
			row.push({ text: fmtStrDate(d.problems_identified_grid[curRec].date_1st_noted), style: ['tableDetail'], },);
			row.push({ text: d.problems_identified_grid[curRec].gestational_age_weeks, style: ['tableDetail'], },);
			row.push({ text: d.problems_identified_grid[curRec].gestational_age_days, style: ['tableDetail'], },);
			row.push({ text: d.problems_identified_grid[curRec].problems, style: ['tableDetail'], },);
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
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.were_there_adverse_reactions, 'yes_no'), style: ['tableDetail'], },
					],
				],
			},
		},
	],);

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
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '8',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[5].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[6].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
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
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.were_there_pre_delivery_hospitalizations, 'yes_no'), style: ['tableDetail'], },
					],
				],
			},
		},
	],);

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
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '8',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[5].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[6].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
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
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.were_medical_referrals_to_others, 'yes_no'), style: ['tableDetail'], },
					],
				],
			},
		},
	],);

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
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '7',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[5].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
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
    retPage.push({ text: '', margin: [0, 20, 0, 0], }, );

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
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '8',
			border: [true, true, true, false],
		}, {}, {}, {}, {}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[5].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[6].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
			row.push({ text: lookupFieldArr(d.other_sources_of_prenatal_care[curRec].place, p.children[index].children[0].values), style: ['tableDetail'], },);
			row.push({ text: lookupFieldArr(d.other_sources_of_prenatal_care[curRec].provider_type, p.children[index].children[0].values), style: ['tableDetail'], },);
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
						{ text: `${p.children[index].prompt}:`, style: ['subHeader'], },
					],
					[
						{ text: d.reviewer_note, style: ['tableDetail'], },
					],
				],
			},
		},
	],);



	return retPage;
}

// Build er_visit_and_hospital_medical_records record - p is the field name & d is the data & pg_break is true/false if need page break
function er_visit_and_hospital_medical_records(p, d, pg_break) {
	// Name table
	let index = 0;
	let retPage = [];
	let uArr = window.location.href.split("/");
	let allRecs = (uArr[uArr.length - 1] === 'er_visit_and_hospital_medical_records' || pg_break) ? true : false;
	let lenArr = d.length;
	let startArr = 0;
	let endArr = lenArr;

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
        retPage.push({ text: '', pageBreak: 'before' });
    }

	// Are there any records
	if (lenArr === 0) {
		retPage.push({ text: 'No ER Visits and Hospitalization records entered', style: ['tableDetail'], },);
	} else {
		if (!allRecs) {
			startArr = parseInt(uArr[uArr.length - 1], 10);
			endArr = startArr + 1;
		}

		// Display record(s)
		for (let curRec = startArr; curRec < endArr; curRec++) {
			index = 0;
			subIndex = 0;

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
								{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].maternal_record_identification.medical_record_no, style: ['tableDetail'], },
							],
						],
					},
				},
			],);

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
								{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['subHeader'], margin: [0, 20, 0, 0], colSpan: '3', },
								{}, {},
							],
							[
								{ 
									text: `${p.children[index].children[subIndex].children[0].prompt} / ${p.children[index].children[subIndex].children[1].prompt} / ` +
										`${p.children[index].children[subIndex].children[2].prompt}:`, 
									style: ['tableLabel'], 
									alignment: 'right', 
								},
								{ 
									text: `${fmt2Digits(d[curRec].basic_admission_and_discharge_information.date_of_arrival.month)} / ` +
										`${fmt2Digits(d[curRec].basic_admission_and_discharge_information.date_of_arrival.day)} / ` +
										`${d[curRec].basic_admission_and_discharge_information.date_of_arrival.year}`, 
									style: ['tableDetail', 'lightFill'], 
								},
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_arrival.time_of_arrival, style: ['tableDetail'] },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_arrival.gestational_age_weeks, style: ['tableDetail'] },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_arrival.gestational_age_days, style: ['tableDetail'] },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex].children[6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_arrival.days_postpartum, style: ['tableDetail'] },
								{},
							],
						],
					},
				},
			],);

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
								{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['subHeader'], margin: [0, 20, 0, 0], },
								{}, {},
							],
							[
								{ 
									text: `${p.children[index].children[subIndex + 1].children[0].prompt} / ` +
										`${p.children[index].children[subIndex + 1].children[1].prompt} / ` +
										`${p.children[index].children[subIndex + 1].children[2].prompt}:`, 
									style: ['tableLabel'], 
									alignment: 'right', 
								},
								{ 
									text: `${fmt2Digits(d[curRec].basic_admission_and_discharge_information.date_of_hospital_admission.month)} / ` +
										`${fmt2Digits(d[curRec].basic_admission_and_discharge_information.date_of_hospital_admission.day)} / ` +
										`${d[curRec].basic_admission_and_discharge_information.date_of_hospital_admission.year}`, 
									style: ['tableDetail'], 
								},
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].children[3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_admission.time_of_admission, style: ['tableDetail'] },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].children[4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_admission.gestational_age_weeks, style: ['tableDetail'] },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].children[5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_admission.gestational_age_days, style: ['tableDetail'] },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].children[6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_admission.days_postpartum, style: ['tableDetail'] },
								{},
							],
						],
					},
				},
			],);

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
								{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: lookupFieldArr(d[curRec].basic_admission_and_discharge_information.admission_condition, p.children[index].children[subIndex + 2].values),
									style: ['tableDetail'], 
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: lookupFieldArr(d[curRec].basic_admission_and_discharge_information.admission_status, p.children[index].children[subIndex + 3].values),
									style: ['tableDetail'], 
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: d[curRec].basic_admission_and_discharge_information.admission_status_other,
									style: ['tableDetail'], 
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: lookupFieldArr(d[curRec].basic_admission_and_discharge_information.admission_reason, p.children[index].children[subIndex + 5].values),
									style: ['tableDetail'], 
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.admission_reason_other, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 7].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: lookupFieldArr(d[curRec].basic_admission_and_discharge_information.principle_source_of_payment, 
										p.children[index].children[subIndex + 7].values),
									style: ['tableDetail'], 
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 8].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.principle_source_of_payment_other_specify, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 9].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: lookupGlobalArr(d[curRec].basic_admission_and_discharge_information.was_recieved_from_another_hospital, 'yes_no'),
									style: ['tableDetail'], 
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 10].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.from_where, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 11].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: lookupGlobalArr(d[curRec].basic_admission_and_discharge_information.was_transferred_to_another_hospital, 'yes_no'),
									style: ['tableDetail'], 
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 12].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.to_where, style: ['tableDetail'], },
							],
							[
								{ 
									text: `${p.children[index].children[subIndex + 13].children[0].prompt} / ` +
										`${p.children[index].children[subIndex + 13].children[1].prompt} / ` +
										`${p.children[index].children[subIndex + 13].children[2].prompt}:`, 
									style: ['tableLabel'], 
									alignment: 'right', 
								},
								{ 
									text: `${fmt2Digits(d[curRec].basic_admission_and_discharge_information.date_of_hospital_discharge.month)} / ` +
										`${fmt2Digits(d[curRec].basic_admission_and_discharge_information.date_of_hospital_discharge.day)} / ` +
										`${d[curRec].basic_admission_and_discharge_information.date_of_hospital_discharge.year}`, 
									style: ['tableDetail'], 
								},
							],
						],
					},
				},
			],);

			// Give some space
			retPage.push({ text: '', margin: [0, 20, 0, 0], }, );

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
								{ text: `${p.children[index].children[subIndex + 13].prompt}:`, style: ['subHeader'], margin: [0, 20, 0, 0], },
								{},
							],
							[
								{ text: `${p.children[index].children[subIndex + 13].children[3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_discharge.time_of_discharge, style: ['tableDetail'] },
							],
							[
								{ text: `${p.children[index].children[subIndex + 13].children[4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_discharge.gestational_age_weeks, style: ['tableDetail'] },
							],
							[
								{ text: `${p.children[index].children[subIndex + 13].children[5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_discharge.gestational_age_days, style: ['tableDetail'] },
							],
							[
								{ text: `${p.children[index].children[subIndex + 13].children[6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].basic_admission_and_discharge_information.date_of_hospital_discharge.days_postpartum, style: ['tableDetail'] },
							],
							[
								{ text: `${p.children[index].children[subIndex + 14].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: lookupFieldArr(d[curRec].basic_admission_and_discharge_information.discharge_pregnancy_status, 
										p.children[index].children[subIndex + 14].values),
									style: ['tableDetail'], 
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 15].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: lookupGlobalArr(d[curRec].basic_admission_and_discharge_information.deceased_at_discharge, 'yes_no'),
									style: ['tableDetail'], 
								},
							],
						],
					},
				},
			],);

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
								{ text: `${p.children[index].children[subIndex].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.facility_name, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: `${lookupFieldArr(d[curRec].name_and_location_facility.type_of_facility, p.children[index].children[subIndex + 1].values)}`, 
									style: ['tableDetail'], 
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.type_of_facility_other_specify, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.facility_npi_no, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: `${lookupFieldArr(d[curRec].name_and_location_facility.maternal_level_of_care, p.children[index].children[subIndex + 4].values)}`, 
									style: ['tableDetail'], 
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.other_maternal_level_of_care, style: ['tableDetail'], },
							],
							[
								{ 
									text: `${p.children[index].children[subIndex + 6].prompt} / ${p.children[index].children[subIndex + 7].prompt}:`, 
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
										`${p.children[index].children[subIndex + 10].prompt}:`, 
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
								{ text: `${p.children[index].children[subIndex + 11].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.county, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 14].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.feature_matching_geography_type, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 19].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.naaccr_census_tract_certainty_code, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 20].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.naaccr_census_tract_certainty_type, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 25].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.urban_status, style: ['tableDetail'], },
							],
						],
					},
				},
			],);

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
								{ text: `${p.children[index].children[subIndex + 29].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: `${lookupFieldArr(d[curRec].name_and_location_facility.mode_of_transportation_to_facility, 
										p.children[index].children[subIndex + 29].values)}`,
									style: ['tableDetail'], 
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 30].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.mode_of_transportation_to_facility_other, style: ['tableDetail'], },
							],
							[
								{ text: `${p.children[index].children[subIndex + 31].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ 
									text: `${lookupFieldArr(d[curRec].name_and_location_facility.origin_of_travel, p.children[index].children[subIndex + 31].values)}`,
									style: ['tableDetail'], 
								},
							],
							[
								{ text: `${p.children[index].children[subIndex + 32].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: d[curRec].name_and_location_facility.origin_of_travel_other, style: ['tableDetail'], },
							],
							[
								{ 
									text: `${p.children[index].children[subIndex + 33].prompt}:`, 
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
			],);

			// Internal Transfers
			index += 1;
			let lenArr2 = d[curRec].internal_transfers.length;
			let startArr2 = 0;
			let endArr2 = lenArr2;

			// Build Header rows
			let body = [];
			let row = new Array();
			row.push(
				{
					text: p.children[index].prompt,
					style: ['subHeader', 'blueFill'],
					colSpan: '5',
					border: [true, true, true, false],
				}, {}, {}, {}, {}, );
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', }, );
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], },);
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
										`${p.children[index].children[subIndex].children[1].prompt}:`, 
									style: ['tableLabel'], 
									alignment: 'right', 
								},
								{ text: `${d[curRec].maternal_biometrics.height.feet} / ${d[curRec].maternal_biometrics.height.inches}`, style: ['tableDetail'], },
								{ text: `${p.children[index].children[subIndex].children[2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].maternal_biometrics.height.bmi}`, style: ['tableDetail'], },
								{ text: `${p.children[index].children[subIndex + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
								{ text: `${d[curRec].maternal_biometrics.admission_weight}`, style: ['tableDetail'], },
							],
						],
					},
				},
			],);

			// Give some space
			retPage.push({ text: '', margin: [0, 20, 0, 0], }, );

			// Physical Examinations and Evaluations
			index += 1;
			lenArr2 = d[curRec].physical_exam_and_evaluations.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{
					text: p.children[index].prompt,
					style: ['subHeader', 'blueFill'],
					colSpan: '6',
					border: [true, true, true, false],
				}, {}, {}, {}, {}, {}, );
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
			row.push({ text: p.children[index].children[4].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '6', }, );
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], },);
					row.push({ text: fmtDateTime(d[curRec].physical_exam_and_evaluations[curRec2].date_and_time), style: ['tableDetail'], },);
					row.push({ text: d[curRec].physical_exam_and_evaluations[curRec2].exam_evaluation, style: ['tableDetail'], },);
					row.push({ text: `${lookupFieldArr(d[curRec].physical_exam_and_evaluations[curRec2].body_system, p.children[index].children[2].values)}`, style: ['tableDetail'], },);
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
			retPage.push({ text: '', margin: [0, 20, 0, 0], }, );

			// Psychological Examinations and Assessments
			index += 1;
			lenArr2 = d[curRec].psychological_exam_and_assesments.length;
			startArr2 = 0;
			endArr2 = lenArr2;

			// Build Header rows
			body = [];
			row = new Array();
			row.push(
				{
					text: p.children[index].prompt,
					style: ['subHeader', 'blueFill'],
					colSpan: '5',
					border: [true, true, true, false],
				}, {}, {}, {}, {}, );
			body.push(row);
			row = new Array();
			row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
			row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
			row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
			row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
			row.push({ text: p.children[index].children[3].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
			body.push(row);

			// Are there any records?
			if (lenArr2 === 0) {
				row = new Array();
				row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '5', }, );
				body.push(row);
			} else {
				// Build the table detail
				for (let curRec2 = startArr2; curRec2 < endArr2; curRec2++) {
					row = new Array();
					row.push({ text: `${curRec2 + 1}`, style: ['tableDetail'], },);
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




		}
	}

	return retPage;
}

// Build other_medical_office_visits record - p is the field name & d is the data & pg_break is true/false if need page break
function other_medical_office_visits(p, d, pg_break) {
	// Name table
	let index = 0;
	let retPage = [];

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
        retPage.push({ text: '', pageBreak: 'before' });
    }

	// Record Header
	retPage.push({ text: 'Work in Progress', style: ['subHeader'] },);

	return retPage;
}

// Build medical_transport record - p is the field name & d is the data & pg_break is true/false if need page break
function medical_transport(p, d, pg_break) {
	// Name table
	let index = 0;
	let retPage = [];

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
        retPage.push({ text: '', pageBreak: 'before' });
    }

	// Record Header
	retPage.push({ text: 'Work in Progress', style: ['subHeader'] },);
	return retPage;
}

// Build social_and_environmental_profile record - p is the field name & d is the data & pg_break is true/false if need page break
function social_and_environmental_profile(p, d, pg_break) {
	// Name table
	let index = 0;
	let retPage = [];

	console.log('p: ', p);
	console.log('d: ', d);

	// Record Header
    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
        retPage.push({ text: '', pageBreak: 'before' });
    }

	// Record Header
	retPage.push({ text: 'Work in Progress', style: ['subHeader'] },);

	return retPage;
}

// Build mental_health_profile record - p is the field name & d is the data & pg_break is true/false if need page break
function mental_health_profile(p, d, pg_break) {
	// Name table
	let index = 0;
	let retPage = [];

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
        retPage.push({ text: '', pageBreak: 'before' });
    }

	// Record Header
	retPage.push({ text: 'Work in Progress', style: ['subHeader'] },);

	return retPage;
}

// Build informant_interviews record - p is the field name & d is the data & pg_break is true/false if need page break
function informant_interviews(p, d, pg_break) {
	// Name table
	let index = 0;
	let subIndex = 0;
	let retPage = [];
	let uArr = window.location.href.split("/");
	let allRecs = (uArr[uArr.length - 1] === 'informant_interviews' || pg_break) ? true : false;
	let lenArr = d.length;
	let startArr = 0;
	let endArr = lenArr;

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
        retPage.push({ text: '', pageBreak: 'before' });
    }

	// Are there any records
	if (lenArr === 0) {
		retPage.push({ text: 'No interviews entered', style: ['tableDetail'], },);
	} else {
		if (!allRecs) {
			startArr = parseInt(uArr[uArr.length - 1], 10);
			endArr = startArr + 1;
		}

		// Display record(s)
		for (let curRec = startArr; curRec < endArr; curRec++) {
			index = 0;
			subIndex = 0;

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
								{ text: `${d[curRec].date_of_interview.year}`, style: ['tableDetail', 'lightFill'], alignment: 'center', },
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


            // See if we need a page break
            if ( allRecs && (startArr !== endArr) && (curRec < endArr - 1) ) {
                retPage.push([ { text: '', pageBreak: 'before' }, ],);
            }
		}
	}

	return retPage;
}

// Build case_narrative record - p is the field name & d is the data & pg_break is true/false if need page break
function case_narrative(p, d, pg_break) {
	// Name table
	let index = 0;
	let len = 0;
	let retPage = [];

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
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
			id: 'case_narative',
			width: 'auto',
			table: {
				headerRows: 1,
				widths: ['auto'],
				body: [
					[
						{ text: 'Case Narrative', style: ['subHeader'], },
					],
					[
						{ text: htmlToPdfmake(d.case_opening_overview), style: ['tableDetail'], },
					],
				],
			},
		},],
	);

	return retPage;
}

// Build committee_review record - p is the field name & d is the data & pg_break is true/false if need page break
function committee_review(p, d, pg_break) {
	// Name table
	let index = 4;      // Start on Committee Review Date
	let retPage = [];

	console.log('p: ', p);
	console.log('d: ', d);

    // Get the title for the Header
    retPage.push( { text: '', pageHeaderText: p.prompt.toUpperCase() } );

    // Need page break, used if print all or core
    if ( pg_break )
    {
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
						{ text: `${p.children[index].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: reformatDate(d.date_of_review), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.pregnancy_relatedness, p.children[index + 1].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.estimate_degree_relevant_information_available, p.children[index + 2].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.does_committee_agree_with_cod_on_death_certificate, p.children[index + 3].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.pmss_mm, p.children[index + 4].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
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
		{
			text: p.children[index].prompt,
			style: ['subHeader', 'blueFill'],
			colSpan: '4',
			border: [true, true, true, false],
		}, {}, {}, {}, );
	body.push(row);
	row = new Array();
    row.push({ text: 'Rec #', style: ['tableLabel', 'blueFill'], border: [true, false, false, true], },);
	row.push({ text: p.children[index].children[0].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[1].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, false, true], },);
	row.push({ text: p.children[index].children[2].prompt, style: ['tableLabel', 'blueFill'], border: [false, false, true, true], },);
	body.push(row);

	// Are there any records?
	if (lenArr === 0) {
		row = new Array();
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '4', }, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) {
			row = new Array();
            row.push({ text: `${curRec + 1}`, style: ['tableDetail'], },);
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
						{ text: `${p.children[index + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.did_obesity_contribute_to_the_death, 'yes_no_probably_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.did_discrimination_contribute_to_the_death, 'yes_no_probably_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.did_mental_health_conditions_contribute_to_the_death, 'yes_no_probably_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
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
						{ text: `${p.children[index + 1].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.was_this_death_a_sucide, 'yes_no_probably_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 2].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupGlobalArr(d.was_this_death_a_homicide, 'yes_no_probably_unknown'), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 3].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.means_of_fatal_injury, p.children[index + 3].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 4].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.specify_other_means_fatal_injury, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 5].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.if_homicide_relationship_of_perpetrator, p.children[index + 5].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 6].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: d.specify_other_relationship, style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 7].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.was_this_death_preventable, p.children[index + 7].values), style: ['tableDetail'], },
					],
					[
						{ text: `${p.children[index + 8].prompt}:`, style: ['tableLabel'], alignment: 'right', },
						{ text: lookupFieldArr(d.chance_to_alter_outcome, p.children[index + 8].values), style: ['tableDetail'], margin: [0, 0, 0, 20], },
					],
				],
			},
		},],
	);

	// Contributing Factors and Reccommendations for Action
	index += 9;
    subIndex = 0;
 	lenArr = d.critical_factors_worksheet.length;
	startArr = 0;
	endArr = lenArr;
    body = [];
    row = new Array();

    row.push( { text: p.children[index].prompt, style: ['subHeader', 'blueFill'], colSpan: '8', }, {}, {}, {}, {}, {}, {}, {}, );
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
		row.push({ text: 'No records entered', style: ['tableDetail'], colSpan: '2', }, {}, );
		body.push(row);
	} else {
		// Build the table detail
		for (let curRec = startArr; curRec < endArr; curRec++) 
        {
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
		},],
	);

	return retPage;
}

