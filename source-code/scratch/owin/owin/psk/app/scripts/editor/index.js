var g_metadata = null;
var g_data = null;
var g_copy_clip_board = null;
var g_delete_value_clip_board = null;
var g_delete_attribute_clip_board = null;
var g_delete_node_clip_board = null;

var g_ui = { is_collapsed : [] };


var md = {
/*

required:
	name
	prompt	
	type

optional:
is_core_summary
is_required

regex_pattern
validation
onblur

max_value
min_value
control_style
radio
checkbox


controls:
	label
	button

*/
	create_app: function(p_user_name)
	{
		var date = new Date().toISOString(); 
		return {
			"_id": date,
			"_rev": null,
			"name":"mmria",
			"type":"app",
			"date_created": date,
			"created_by": p_user_name,
			"date_last_updated": date,
			"last_updated_by": p_user_name,
			"children":[]
			}
	},
	create_form: function(			
			p_name,
			p_prompt,
			p_cardinality)
	{
		return {
			"name": p_name,
			"prompt": p_prompt,
			"cardinality":p_cardinality,
			"type": "form",
			"children": []
		}

	},
	create_group: function(p_name, p_prompt, p_type, p_style)
	{
		if(p_style)
		{
			return {
				"name": p_name,
				"prompt": p_prompt,
				"type": "group",
				"children": []
			}
		}
		else
		{
return {
				"name": p_name,
				"prompt": p_prompt,
				"type": "group",
				"children": []
			}
		}
	},
	create_value_list: function(p_name, p_prompt, p_type)
	{
		return {
			"name": p_name,
			"prompt": p_prompt,
			"type": p_type,
			"values": []
		}
	},
	create_value: function(p_name, p_prompt, p_type)
	{
		return {
			"name": p_name,
			"prompt": p_prompt,
			"type": p_type,
			"values": []
		}
	}

};

var $$ = {


 is_id: function(value){
   // 2016-06-12T13:49:24.759Z
    if(value)
    {
      var test = value.match(/^\d+-\d+-\d+T\d+:\d+:\d+.\d+Z$/);
      return (test)? true : false;
    }
    else
    {
        return false;
    }
  }
};

var metadata_changed_event = new Event('metadata_changed');

window.addEventListener('metadata_changed', function (e) 
{ 
	console.log("metadata_change");
	var json_data = { 'def': "momentum"};
	var current_auth_session = profile.get_auth_session_cookie();

$.ajax({
			url: location.protocol + '//' + location.host + '/api/current_edit',
			//contentType: 'application/x-www-form-urlencoded',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(g_metadata),
			type: "POST",
			beforeSend: function (request)
			{
				request.setRequestHeader("AuthSession", current_auth_session);
			}//,
			//processData: false
	}).done(function(response) {
			console.log("metadata sent");

	});



}, false);


$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';

  	profile.initialize_profile();

	  load_metadata();



});


function load_metadata()
{
	//var metadata_url = location.protocol + '//' + location.host + '/meta-data/01/home_record.json';
	var metadata_url = location.protocol + '//' + location.host + '/api/metadata';

	$.ajax({
			url: metadata_url
	}).done(function(response) {
			g_metadata = JSON.parse(response);
			g_data = create_default_object(g_metadata, {});
			g_ui.url_state = url_monitor.get_url_state(window.location.href);

			//document.getElementById('navigation_id').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");

			document.getElementById('form_content_id').innerHTML = editor_render(g_metadata, "", g_ui).join("");

	});
}

function metadata_save()
{

	console.log("metadata_change");
	var json_data = { 'def': "momentum"};
	var current_auth_session = profile.get_auth_session_cookie();

	if(current_auth_session)
	{ 
		$.ajax({
					url: location.protocol + '//' + location.host + '/api/metadata',
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					data: JSON.stringify(g_metadata),
					type: "POST",
					beforeSend: function (request)
					{
						request.setRequestHeader("AuthSession", current_auth_session);
					}//,
			}).done(function(response) 
			{


						var response_obj = eval(response);
						if(response_obj.ok)
						{
							g_metadata._rev = response_obj.rev; 
							document.getElementById('form_content_id').innerHTML = editor_render(g_metadata, "", g_ui).join("");
						}
						//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
					console.log("metadata sent", response);
			});
	}

}