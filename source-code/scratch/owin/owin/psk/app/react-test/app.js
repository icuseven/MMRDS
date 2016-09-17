var AppComponent = React.createClass({
	displayName: "AppComponent",
	getInitialState: function() 
	{
		
		var url = location.protocol + '//' + location.host + '/meta-data/00/prenata_care.json';
		var AJAX = new AJAX_();
		var Meta_Data_Renderer = new Meta_Data_Renderer_();
		
		var meta_data = AJAX.GetResponse(url, function(metadata)
		{
			//ready_this.CreateFromMetaData(document, ready_this, metadata, parent);
			console.log("metadata\n", metadata);
		}
		
		);
		
		
		//return { email: this.props.initialEmail, password: this.props.initialPassword };
		return { };
	},
	render: function render() 
	{
		return React.createElement('div', {},
			React.createElement('img',{ src:"../images/mmria-secondary.svg", height:75, width:100}),
			React.createElement('h1',{},'App Element: MMRIA'),
			React.createElement('div',{ id:'profile_content_id'},'App Element: MMRIA'),
			React.createElement('div',{ id:'page_content_id'},
			React.createElement('p',{},'The Maternal Mortality Review Information App (MMRIA) is a public health software tool created to collect, store, analyze and summarize information relevant to maternal deaths. The MMRIA serves 2 purposes: first to provide complete, detailed, and organized medical and social information that can be used by medical review committees to investigate individual maternal deaths; and second to provide a standardized cumulative database for future research and analysis on maternal mortality.')
			)
		);
	},
	profile_login_changed:function(e) 
	{
		var profile = document.querySelector('#mmrds_profile');
	
        profile.isLoggedIn = e.detail.is_logged_in;
		profile.auth_session = e.detail.auth_session;
		profile.user_name = e.detail.user_name;
		profile.user_roles = e.detail.user_roles;
		if(profile.isLoggedIn)
		{
			var minutes_14 = 14;
			var current_date_time = new Date();
			var new_date_time = new Date(current_date_time.getTime() + minutes_14 * 60000);
			
			document.cookie = "AuthSession=" + profile.auth_session + "; expires=" + new_date_time.toGMTString() + "; path=/";
			app.route.path = '/summary';
		}
		else
		{
			document.cookie = "AuthSession=" + profile.auth_session + "; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";		
			app.route.path = '/home';
		}
		
		
		
		var abstractor_menu = app.querySelector('#abstractor_menu')
		if(profile.user_roles.indexOf('abstractor') > -1)
		{
			abstractor_menu.style.display = "block";
			
		}
		else
		{
			abstractor_menu.style.display = "none";
			
		}
		
	}
	
});