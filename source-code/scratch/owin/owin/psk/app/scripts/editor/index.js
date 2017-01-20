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
	create_grid: function(p_name, p_prompt)
	{
		
			return {
				"name": p_name,
				"prompt": p_prompt,
				"type": "grid",
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
			"type": p_type
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

	if(preview_window)
	{
		//preview_window.metadata_changed(g_metadata);

		if(last_preview_update)
		{
			var diff = new Date().getTime() - last_preview_update.getTime();

			if(diff > 1000)
			{
				preview_window.metadata_changed(g_metadata);
				last_preview_update = new Date();
			}
		}
		else
		{
			preview_window.metadata_changed(g_metadata);
			last_preview_update = new Date();
		}
	}
}, false);


var preview_window = null;
var last_preview_update = null;

function open_preview_window()
{
	if(! preview_window)
	{
		preview_window = window.open('./preview.html','_preview',null,false);

		window.setTimeout(function()
		{
			preview_window.metadata_changed(g_metadata);
			last_preview_update = new Date();
		}, 3000);



	}


}


$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';


	profile.on_login_call_back = function (){
			load_metadata();
    };

  	profile.initialize_profile();

	  

	$(document).keydown(function(evt){
		if (evt.keyCode==83 && (evt.ctrlKey)){
			evt.preventDefault();
			metadata_save();
		}

		if (evt.keyCode==80 && (evt.ctrlKey)){
			evt.preventDefault();
			open_preview_window();
		}

		if (evt.keyCode==76 && (evt.ctrlKey)){
			evt.preventDefault();
			profile.initialize_profile();
		}

	});




});




function load_metadata()
{
	var metadata_url = location.protocol + '//' + location.host + '/api/metadata';

	$.ajax({
			url: metadata_url
	}).done(function(response) {
			g_metadata = response;

			convert_value_to_object(g_metadata);

			g_data = create_default_object(g_metadata, {});
			g_ui.url_state = url_monitor.get_url_state(window.location.href);

			//document.getElementById('navigation_id').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");

			document.getElementById('form_content_id').innerHTML = editor_render(g_metadata, "", g_ui, "app").join("");

	});
}


function convert_value_to_object(p_metadata)
{
	if(p_metadata.values)
	{
		for(var i = 0; i < p_metadata.values.length; i++)
		{
			var child = p_metadata.values[i];
			if (typeof child === 'string' || child instanceof String)
			{
				p_metadata.values[i] = { "value": child, "description": ""};
			}
		}
	}

	if(p_metadata.children)
	{
		for(var i = 0; i < p_metadata.children.length; i++)
		{
			var child = p_metadata.children[i];
			convert_value_to_object(child);
		}
	}
}

function metadata_save()
{

	console.log("metadata_change");
	var current_auth_session = profile.get_auth_session_cookie();

	if(current_auth_session)
	{ 
		perform_save(current_auth_session);
	}
	else
	{
		profile.try_session_login(perform_save);
	}

}


function perform_save(current_auth_session)
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
					document.getElementById('form_content_id').innerHTML = editor_render(g_metadata, "", g_ui, "app").join("");

					if(response_obj.auth_session)
					{
						profile.auth_session = response_obj.auth_session;
						profile.set_auth_session_cookie(response_obj.auth_session);
					}



				}
				else
				{
					console.log("failed to save");
				}
				//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
			console.log("metadata sent", response);
	});
}



var path_to_node_map = [];
var path_to_int_map = [];
var path_to_onblur_map = [];
var path_to_onclick_map = [];
var path_to_onfocus_map = [];
var path_to_onchange_map = [];
var path_to_validation = [];
var object_path_to_metadata_path_map = [];

//generate_validation(g_metadata, metadata_list, "", object_list, "", path_to_node_map, path_to_int_map, path_to_onblur_map, path_to_onclick_map, path_to_onfocus_map, path_to_onchange_map, path_to_validation, object_path_to_metadata_path_map);

function generate_validation(p_metadata, p_metadata_list, p_path, p_object_list, p_object_path, p_path_to_node_map, p_path_to_int_map, p_path_to_onblur_map, p_path_to_onclick_map, p_path_to_onfocus_map, p_path_to_onchange_map, p_path_to_validation, p_object_path_to_metadata_path_map)
{
    p_path_to_node_map[p_path] = p_metadata;
    p_path_to_int_map[p_path] = p_metadata_list.length;
	p_metadata_list.push(p_path);
	p_object_list.push(p_object_path);

    p_object_path_to_metadata_path_map[p_object_path] = p_path;

    if(p_metadata.onblur && p_metadata.onblur != "")
    {
         p_path_to_onblur_map[p_path] = p_metadata.onblur;
    }

    if(p_metadata.onclick && p_metadata.onclick != "")
    {
        p_path_to_onclick_map[p_path] = p_metadata.onclick;
    }

    if(p_metadata.onfocus && p_metadata.onfocus != "")
    {
        p_path_to_onfocus_map[p_path] = p_metadata.onfocus;
    }

    if(p_metadata.onchange && p_metadata.onchange != "")
    {
        p_path_to_onchange_map[p_path] = p_metadata.onchange;
    }
 
    if(p_metadata.validation && p_metadata.validation != "")
    {
        p_path_to_validation[p_path] = p_metadata.validation;
    }

	if(p_metadata.children && p_metadata.children.length > 0)
	{		
		for(var i = 0; i < p_metadata.children.length; i++)
		{
			var child = p_metadata.children[i];

 			generate_validation(child, p_metadata_list, p_path + "/children/" + i, p_object_list, p_object_path + "/" + child.name, p_path_to_node_map, p_path_to_int_map, p_path_to_onblur_map, p_path_to_onclick_map, p_path_to_onfocus_map, p_path_to_onchange_map, p_path_to_validation, p_object_path_to_metadata_path_map);


		}
	}

}