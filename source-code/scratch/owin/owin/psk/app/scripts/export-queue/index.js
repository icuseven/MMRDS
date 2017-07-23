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
	document.getElementById('form_content_id').innerHTML = "";
	load_values();
});

function load_values()
{
	$.ajax({
			url: location.protocol + '//' + location.host + '/api/values',
	}).done(function(response) {
			g_couchdb_url = response.couchdb_url;
			load_data($mmria.getCookie("uid"), $mmria.getCookie("pwd"))
	});

}

function load_data(p_uid, p_pwd)
{
	var url =  location.protocol + '//' + location.host + '/api/export_queue?' + p_uid

//	var prefix = 'http://' + p_uid + ":" + p_pwd + '@';
    //var url = prefix + g_couchdb_url.replace('http://','') + '/mmrds/_design/aggregate_report/_view/all';

	$.ajax({
			url: url
	}).done(function(response) {
			
			g_data = response;

			document.getElementById('form_content_id').innerHTML = export_queue_render(g_data).join("");

			//document.getElementById('generate_report_button').disabled = false;
			//process_rows();
			//document.getElementById('navigation_id').innerHTML = navigation_render(g_user_list, 0, g_ui).join("");

			//document.getElementById('form_content_id').innerHTML = aggregate_report_render(g_ui, "", g_ui).join("");

	});
}


function create_queue_item(p_export_type)
{
	var new_date = new Date();
	var result = {
			_id: "id-" + new_date,
			date_created: new_date,
			created_by: $mmria.getCookie("uid"),
			date_last_updated: new_date,
			last_updated_by: $mmria.getCookie("uid"),
			file_name: new_date.toISOString() + ".zip",
			export_type: p_export_type,
			status: "Need Confirmation"	
	}
	
	return result;
	

}

function load_metadata()
{
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



