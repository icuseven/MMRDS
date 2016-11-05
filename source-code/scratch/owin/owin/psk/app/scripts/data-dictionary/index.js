'use strict';

var g_metadata = null;

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



