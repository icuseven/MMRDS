

var g_ui = { 
	user_summary_list:[],
	user_list:[],
	data:null,
	url_state: {
    selected_form_name: null,
    selected_id: null,
    selected_child_id: null,
    path_array : []

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



$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';

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

	load_users();

	window.onhashchange = function(e)
	{
		if(e.isTrusted)
		{
			var new_url = e.newURL || window.location.href;

			g_ui.url_state = url_monitor.get_url_state(new_url);
		}
	};
});



function load_users()
{
	var metadata_url = location.protocol + '//' + location.host + '/api/user';

	$.ajax({
			url: metadata_url
	}).done(function(response) {
			g_ui.user_summary_list = response[0].rows;
			console.log(g_ui.user_summary_list);
			g_ui.url_state = url_monitor.get_url_state(window.location.href);

			//document.getElementById('navigation_id').innerHTML = navigation_render(g_user_list, 0, g_ui).join("");

			document.getElementById('form_content_id').innerHTML = user_render(g_ui, "", g_ui).join("");

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
		{var metadata_changed_event = new Event('metadata_changed');

window.addEventListener('metadata_changed', function (e) 
{ 

	if(preview_window)
	{
		//preview_window.metadata_changed(g_user_list);

		if(last_preview_update)
		{
			var diff = new Date().getTime() - last_preview_update.getTime();

			if(diff > 1000)
			{
				preview_window.metadata_changed(g_user_list);
				last_preview_update = new Date();
			}
		}
		else
		{
			preview_window.metadata_changed(g_user_list);
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
			preview_window.metadata_changed(g_user_list);
			last_preview_update = new Date();
		}, 3000);



	}


}

			var child = p_metadata.children[i];
			convert_value_to_object(child);
		}
	}
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
					data: JSON.stringify(g_user_list),
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
							g_user_list._rev = response_obj.rev; 
							document.getElementById('form_content_id').innerHTML = editor_render(g_user_list, "", g_ui).join("");
						}
						//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
					console.log("metadata sent", response);
			});
	}

}

