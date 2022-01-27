var g_release_version = null;

$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';
	/*profile.on_login_call_back = function (){
				load_users();
    };*/
	//profile.initialize_profile();

	console.log('in the main function before load_quarter_data');

	load_quarter_data();

	$(document).keydown(function(evt){
		if (evt.keyCode==83 && (evt.ctrlKey)){
			evt.preventDefault();
			//metadata_save();
		}
	});



	// window.onhashchange = function(e)
	// {
	// 	if(e.isTrusted)
	// 	{
	// 		var new_url = e.newURL || window.location.href;

	// 		g_ui.url_state = url_monitor.get_url_state(new_url);
	// 	}
	// };
});


let quarters = new Array();

async function load_quarter_data()
{

    const release_version = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/version/release-version`,
    });
      
    g_release_version = release_version;

	// Load the Quarters Array
	quarters = load_quarters();

}

function load_quarters()
{
	let today = new Date();
	let curYear = today.getFullYear();
	let curQuarter = Math.floor((today.getMonth() + 3) / 3);

	console.log('curYear: ', curYear);
	console.log('curQuarter: ', curQuarter);

	// Create the Quarters list for the dropdown
	// Add all quarters from now, decending
	while ( curQuarter > 0 )
	{
		quarters.push( `Q${ curQuarter } ${ curYear }` );
		curQuarter--;
	}

	// Now let's put all of the quarters from the current year until 
	// Q1 2019
	curYear--;
	while ( curYear > 2018 )
	{
		quarters.push( `Q4 ${ curYear }`);
		quarters.push( `Q3 ${ curYear }`);
		quarters.push( `Q2 ${ curYear }`);
		quarters.push( `Q1 ${ curYear }`);
		curYear--;
	}
	console.log('quarters: ', quarters);
}

function AlertName(name)
{
	alert(name + ' clicked');
}
