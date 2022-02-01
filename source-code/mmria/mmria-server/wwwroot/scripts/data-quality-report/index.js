var g_release_version = null;
var g_quarters = new Array();

$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';
	document.getElementById('form_content_id').innerHTML = '';
	get_release_version();

	// Display the page
	display_page();
});

function get_release_version()
{

    const release_version = $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/version/release-version`,
    });
      
    g_release_version = release_version;
}

// Display the page
function display_page() {
	// Load the select list array
	g_quarters = load_quarters();

	// Render the page
	render();
}

function load_quarters()
{
	let today = new Date();
	let curYear = today.getFullYear();
	let curQuarter = Math.floor((today.getMonth() + 3) / 3);
	let quarters = new Array();
	let cutoffYear = 2018;	// The last quarter will be Q1 of this year

	// Create the Quarters list for the dropdown
	// Add all quarters from now, decending
	while ( curQuarter > 0 )
	{
		quarters.push( `Q${ curQuarter }-${ curYear }` );
		curQuarter--;
	}

	// Now let's put all of the quarters from the current year 
	curYear--;
	while ( curYear >= cutoffYear )
	{
		quarters.push( `Q4-${ curYear }`);
		quarters.push( `Q3-${ curYear }`);
		quarters.push( `Q2-${ curYear }`);
		quarters.push( `Q1-${ curYear }`);
		curYear--;
	}
	console.log('quarters: ', quarters);

	return quarters;
}

function AlertName(name)
{
	alert(name + ' clicked');
}

function render() {
	document.getElementById('form_content_id').innerHTML = data_quality_report_render(
		g_quarters
	).join('');
}
