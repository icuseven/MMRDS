var g_metadata = null;
var g_data = null;

$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';

  	profile.initialize_profile();

	$.ajax({
			url: location.protocol + '//' + location.host + '/meta-data/01/home_record.json',
			data: {foo: 'bar'}
	}).done(function(response) {
			g_metadata = response;
			g_data = create_default_object(g_metadata, {});

			//document.getElementById('navigation_id').innerHTML = navigation_render(g_metadata, 0).join("");

			document.getElementById('form_content_id').innerHTML = editor_render(g_metadata, "").join("");

	});

/*
	var app = document.querySelector('#root');

	var data_access = new Data_Access("http://localhost:5984");


	console.log('Our app is ready to rock!');


	//ReactDOM.render(React.createElement(LoginComponent, {  }), app);
	var app_reference = ReactDOM.render(React.createElement(EditorComponent, {  }), app);
	var profile_content_id = document.querySelector('#profile_content_id');
	ReactDOM.render(React.createElement(ProfileComponent, { profile_login_changed:app_reference.profile_login_changed }), profile_content_id);
	//ReactDOM.render(React.createElement(TodoApp), app);





	window.addEventListener('profile_login_changed', function(e)
	{

	});

	window.addEventListener('onItemChanged', function(path, value)
	{

	});

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }*/

});
