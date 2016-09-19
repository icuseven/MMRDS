var AppComponent = React.createClass({
	form_metadata:[],
	form_set: [],
	displayName: "AppComponent",
	
	getInitialState: function() 
	{
		

		
		
		//return { email: this.props.initialEmail, password: this.props.initialPassword };
		return { };
	},
	componentWillMount : function ()
	{

	},
	componentDidMount : function ()
	{
		
		//var url = location.protocol + '//' + location.host + '/meta-data/00/prenata_care.json';
		var url = location.protocol + '//' + location.host + '/meta-data/00/home_record.json';
		var AJAX = new AJAX_();

		var meta_data = AJAX.GetResponse(url, function(metadata)
		{
			//ready_this.CreateFromMetaData(document, ready_this, metadata, parent);
			console.log("metadata\n", metadata);
			this.form_metadata.push(metadata);
		
			var Meta_Data_Renderer = new Meta_Data_Renderer_();
			var section_id = document.querySelector("#section_id");
			var form = Meta_Data_Renderer.CreateFromMetaData(this.form_metadata[0], {});
			this.form_set.push(form);

		}.bind(this)
		
		);		
	},
	render: function render() 
	{
		var result = null;
		if(this.state.isLoggedIn)
		{
			 result = React.createElement('div', {},
				React.createElement('img',{ src:"../images/mmria-secondary.svg", height:75, width:100}),
				React.createElement('h1',{},'App Element: MMRIA'),
				React.createElement('div',{ id:'profile_content_id'},'App Element: MMRIA'),
				React.createElement('div',{ id:'page_content_id'},
					React.createElement('p',{},'The Maternal Mortality Review Information App (MMRIA) is a public health software tool created to collect, store, analyze and summarize information relevant to maternal deaths. The MMRIA serves 2 purposes: first to provide complete, detailed, and organized medical and social information that can be used by medical review committees to investigate individual maternal deaths; and second to provide a standardized cumulative database for future research and analysis on maternal mortality.'),
					React.createElement('div',{ id:'navigation_id'}),
					React.createElement('div',{ id:'form_content_id'},
							React.createElement(SummaryComponent,{}),
							React.createElement('div', {id:"section_id"},
								React.createElement('section', { 'data-route':'home-record', tabindex:"-1"},
									React.createElement('h2',null, 'home-record'),
									this.form_set[0]
								)
							)
					)
				)
			);
		}
		else
		{
			 result = React.createElement('div', {},
				React.createElement('img',{ src:"../images/mmria-secondary.svg", height:75, width:100}),
				React.createElement('h1',{},'App Element: MMRIA'),
				React.createElement('div',{ id:'profile_content_id'},'App Element: MMRIA'),
				React.createElement('div',{ id:'page_content_id'},
				React.createElement('p',{},'The Maternal Mortality Review Information App (MMRIA) is a public health software tool created to collect, store, analyze and summarize information relevant to maternal deaths. The MMRIA serves 2 purposes: first to provide complete, detailed, and organized medical and social information that can be used by medical review committees to investigate individual maternal deaths; and second to provide a standardized cumulative database for future research and analysis on maternal mortality.'),
				React.createElement('div',{ id:'navigation_id'}),
				React.createElement('div',{ id:'form_content_id'}))
				)
			
		}
		
		
		return result;
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