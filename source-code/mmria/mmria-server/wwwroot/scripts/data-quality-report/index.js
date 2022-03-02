var g_release_version = null;
var g_quarters = new Array();
var g_jurisdiction_list = [];
var g_user_role_jurisdiction_list = [];
var g_jurisdiction_tree = [];

var g_model = {
    reportType: "Summary",
    selectedQuarter: "",
    includedCaseFolder: []
};

$(async function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';
	document.getElementById('form_content_id').innerHTML = '';
	await main();

	// Display the page
	display_page();
});

async function main()
{

    const release_version = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/version/release-version`,
    });
      
    g_release_version = release_version;

    const metadata_url = `${location.protocol}//${location.host}/api/jurisdiction_tree`;

    const jurisdiction_tree = await $.ajax
    ({
        url: metadata_url,
    });


    g_jurisdiction_tree = jurisdiction_tree;

    const my_user_response = await $.ajax
    ({
        url: location.protocol + '//' + location.host + '/api/user/my-user',
    });

    
    g_user_name = my_user_response.name;


    const my_role_list_response = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/user_role_jurisdiction_view/my-roles`, //&search_key=' + g_uid,
    });
    
    g_user_role_jurisdiction_list = [];
    for (let i in my_role_list_response.rows) 
    {
        let value = my_role_list_response.rows[i].value;
        if(value.role_name=="abstractor")
        {
            g_user_role_jurisdiction_list.push(value.jurisdiction_id);
        }
    }

    create_jurisdiction_list(g_jurisdiction_tree);

    g_model.includedCaseFolder = [...g_jurisdiction_list];

}

// Display the page
function display_page() 
{
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
	let cutoffYear = 2019;	// The last quarter will be Q1 of this year

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

	return quarters;
}


function render()
{
	document.getElementById('form_content_id').innerHTML = data_quality_report_render(
		g_quarters
	).join('');

    render_jurisdiction_include_list();
}


function create_jurisdiction_list(p_data) 
{
  for (var i = 0; i < g_user_role_jurisdiction_list.length; i++) 
  {
    var jurisdiction_regex = new RegExp('^' + g_user_role_jurisdiction_list[i]);
    var match = p_data.name.match(jurisdiction_regex);

    if (match) 
    {
      g_jurisdiction_list.push(p_data.name);
      break;
    }
  }

  if (p_data.children != null) 
  {
    for (var i = 0; i < p_data.children.length; i++) 
    {
      var child = p_data.children[i];

      create_jurisdiction_list(child);
    }
  }
}




