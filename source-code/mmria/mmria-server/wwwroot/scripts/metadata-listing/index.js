'use strict';

var g_metadata = null;

var g_filter = 	{
	date_of_death:
	{
		year: [
			'all'
		],
		month: [
			'all'
		],
		day: [
			'all'
		],
	},
	date_range: [
		{
			from: 'all',
			to:	'all'
		}
	],
	case_status: [
		'all'
	],
	case_jurisdiction: [
		'/all'
	],
	selected_form: "",
	search_text: ""
};


$(function ()
{
	
	load_metadata();
});


function load_metadata()
{
	var metadata_url = location.protocol + '//' + location.host + '/api/metadata';

	$.ajax({
			url: metadata_url
	}).done(function(response) {
			g_metadata = response;
			document.getElementById('form_content_id').innerHTML = dictionary_render(g_metadata, "").join("")  + '<br/>';
	});
}


function de_identify_search_text_change(p_value)
{
	g_filter.search_text = p_value;
}


