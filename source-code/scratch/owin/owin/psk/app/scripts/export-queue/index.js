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
	update_queue_interval_id = window.setInterval(update_queue_task, 10000);
});

function load_values()
{
	$.ajax({
			url: location.protocol + '//' + location.host + '/api/values',
	}).done(function(response) {
			g_couchdb_url = response.couchdb_url;
			load_data($mmria.getCookie("uid"), $mmria.getCookie("pwd"));
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
			
			g_data = [];
			for(var i = 0; i < response.length; i++)
			{
				if
				(
					(response[i].status != "Deleted") &&
					(response[i].status != "expunged")
				)
				{
					g_data.push(response[i]);
				}
			}
			

			render();

			//document.getElementById('generate_report_button').disabled = false;
			//process_rows();
			//document.getElementById('navigation_id').innerHTML = navigation_render(g_user_list, 0, g_ui).join("");

			//document.getElementById('form_content_id').innerHTML = aggregate_report_render(g_ui, "", g_ui).join("");

	});
}


function render()
{

	g_data.sort(function(a, b){return b.date_created-a.date_created});
	document.getElementById('form_content_id').innerHTML = export_queue_render(g_data).join("");
}

function create_queue_item(p_export_type)
{
	var new_date = new Date().toISOString();
	var result = {
			_id: new_date.replace(/:/g, "-") + ".zip",
			date_created: new_date,
			created_by: $mmria.getCookie("uid"),
			date_last_updated: new_date,
			last_updated_by: $mmria.getCookie("uid"),
			file_name: new_date.replace(/:/g, "-") + ".zip",
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

function add_new_core_export_item()
{
	g_data.push(create_queue_item('Core CSV'));
	render();
}

function add_new_all_export_item()
{
	g_data.push(create_queue_item('All CSV'));
	render();

}


function find_export_item(p_id)
{
	var result = null;
	for(var i = 0; i < g_data.length; i++)
	{
		if(g_data[i]._id == p_id)
		{
			result = g_data[i];
			break;	
		}
	}

	return result;
}

function add_new_json_export_item()
{
	g_data.push(create_queue_item('ALL JSON'));
	render();
}

function confirm_export_item(p_id)
{
	// submit queue item
	var item = find_export_item(p_id);
	if(item)
	{
		item.status = "In Queue...";
		item.date_last_updated = new Date().toISOString();
		item.last_updated_by = $mmria.getCookie("uid");

		var export_queue_url = location.protocol + '//' + location.host + '/api/export_queue';

		$.ajax({
				url: export_queue_url,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(item),
				type: "POST",
				beforeSend: function (request)
				{
					request.setRequestHeader("AuthSession", $mmria.getCookie("AuthSession"));
				}//,
		}).done(function(response) {
				g_metadata = response;
				load_data($mmria.getCookie("uid"), $mmria.getCookie("pwd"));
		});
	}
	
}

function cancel_export_item(p_id)
{
	for(var i = 0; i < g_data.length; i++)
	{
		if(g_data[i]._id == p_id)
		{
			g_data.splice(i, 1);
			break;	
		}
	}
	render();
}

function download_export_item(p_id)
{
	var item = find_export_item(p_id);
	if(item)
	{
		var download_url = location.protocol + '//' + location.host + '/api/zip/' + p_id;
		window.open(download_url, "_zip");
	}
	render();
}

function delete_export_item(p_id)
{
	var item = find_export_item(p_id);
	if(item)
	{
		item.status = "Deleted";
		item.date_last_updated = new Date().toISOString();
		item.last_updated_by = $mmria.getCookie("uid");
		//item._deleted = true;
		var export_queue_url = location.protocol + '//' + location.host + '/api/export_queue';

		$.ajax({
				url: export_queue_url,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(item),
				type: "POST",
				beforeSend: function (request)
				{
					request.setRequestHeader("AuthSession", $mmria.getCookie("AuthSession"));
				}//,
		}).done(function(response) {
				g_metadata = response;
				load_data($mmria.getCookie("uid"), $mmria.getCookie("pwd"));
		});
	}
}



var update_queue_interval_id = null;

function update_queue_task()
{

	
	var temp = [];
	for(var i = 0; i < g_data.length; i++)
	{
		if(g_data[i].status == "Need Confirmation")
		{
			temp.push(g_data[i]);
		}
	}

	var url =  location.protocol + '//' + location.host + '/api/export_queue?' + $mmria.getCookie("uid");

	$.ajax({
			url: url
	}).done(function(response) {
			
			g_data = [];
			for(var i = 0; i < response.length; i++)
			{
				if
				(
					(response[i].status != "Deleted") &&
					response[i].status != "expunged"
				)
				{
					g_data.push(response[i]);
				}
			}
			
			for(var i = 0; i < temp.length; i++)
			{
				g_data.push(temp[i]);
			}


			render();

			//document.getElementById('generate_report_button').disabled = false;
			//process_rows();
			//document.getElementById('navigation_id').innerHTML = navigation_render(g_user_list, 0, g_ui).join("");

			//document.getElementById('form_content_id').innerHTML = aggregate_report_render(g_ui, "", g_ui).join("");

	});




	

}