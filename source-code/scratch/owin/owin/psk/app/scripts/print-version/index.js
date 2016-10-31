var g_metadata = null;
var g_data = null;
var g_copy_clip_board = null;
var g_delete_value_clip_board = null;
var g_delete_attribute_clip_board = null;
var g_delete_node_clip_board = null;

var g_ui = { is_collapsed : [] };




$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';

  	//profile.initialize_profile();

	  load_metadata();
});


function create_print_version()
{
	document.getElementById('form_content_id').innerHTML = print_version_render(g_metadata, g_data, "/", g_ui).join("");
}



function load_metadata()
{
	//var metadata_url = location.protocol + '//' + location.host + '/meta-data/01/home_record.json';
	var metadata_url = location.protocol + '//' + location.host + '/api/metadata';

	$.ajax({
			url: metadata_url
	}).done(function(response) {
			g_metadata = response;
			g_data = create_default_object(g_metadata, {});
			g_ui.url_state = url_monitor.get_url_state(window.location.href);

			create_print_version();
	});
}



