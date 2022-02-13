
var g_value = null;

$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';
	/*profile.on_login_call_back = function (){
				load_users();
    };*/
	//profile.initialize_profile();

	load_user_list();

	$(document).keydown(function(evt){
		if (evt.keyCode==83 && (evt.ctrlKey)){
			evt.preventDefault();
			//metadata_save();
		}
	});



	window.onhashchange = function(e)
	{
		if(e.isTrusted)
		{
			var new_url = e.newURL || window.location.href;

			g_ui.url_state = url_monitor.get_url_state(new_url);
		}
	};
});



function load_user_list()
{

	$.ajax({
		url: location.protocol + '//' + location.host + '/api/user/my-user',
	}).done(function(response) 
	{
		g_value = response;
		
		document.getElementById('output').innerHTML = "<b>" + g_value.alternate_email + "</b>";
	});

}
