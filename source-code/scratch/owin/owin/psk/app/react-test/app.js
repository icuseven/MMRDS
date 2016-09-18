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
			React.createElement('p',{},'The Maternal Mortality Review Information App (MMRIA) is a public health software tool created to collect, store, analyze and summarize information relevant to maternal deaths. The MMRIA serves 2 purposes: first to provide complete, detailed, and organized medical and social information that can be used by medical review committees to investigate individual maternal deaths; and second to provide a standardized cumulative database for future research and analysis on maternal mortality.'),
			React.createElement('div',{ id:'navigation_id'}),
			React.createElement('div',{ id:'form_content_id'},React.createElement(SummaryComponent,{}))
			)
		);
	},
	profile_login_changed:function( info ) 
	{
		console.log("profile_login_changed", info);
		this.setState({
        isLoggedIn: info.is_logged_in,
		auth_session: info.auth_session,
		user_name: info.user_name,
		user_roles: info.user_roles
		
		})
		
		if(this.state.isLoggedIn)
		{
			/*
			var abstractor_menu = app.querySelector('#abstractor_menu')
			if(profile.user_roles.indexOf('abstractor') > -1)
			{
				abstractor_menu.style.display = "block";
				
			}
			else
			{
				abstractor_menu.style.display = "none";
				
			}*/
		}
		else
		{

		}
		
	}
	
});