var AppComponent = React.createClass({
	form_metadata:[],
	form_set: [],
	navigation_set:{},
	displayName: "AppComponent",
	
	getInitialState: function() 
	{
		window.onhashchange = this.url_has_changed;
		var form = null;
		var selected_id = null;
		var selected_child_id = null;
		
		var url_array = window.location.href.split('#');
		if(url_array.length > 1)
		{

			var trimmed_string = url_array[1].replace(/^\/+|\/+$/g, '');

			var path_array = trimmed_string.split('/');
			
			if(path_array.length > 0)
			{
				form = path_array[0];
				console.log("selected form: " + form);
			}
			
			if(path_array.length > 1)
			{
				selected_id = path_array[1];
				console.log("selected id: " + selected_id);
			}
			
			if(path_array.length > 2)
			{
				selected_child_id = path_array[2];
				console.log("selected child id: " + selected_child_id);
			}
		}
		
		//return { email: this.props.initialEmail, password: this.props.initialPassword };
		return {
				selected_form_name: form,
				"selected_id": selected_id,
				"selected_child_id": selected_child_id };
	},
	url_has_changed: function(e)
	{
		/*
		e = HashChangeEvent 
		{
			isTrusted: true,
			oldURL: "http://localhost:12345/react-test/#/",
			newURL: "http://localhost:12345/rea
		}*/
		if(e.isTrusted)
		{
			var url_array = e.newURL.split('#');
			if(url_array.length > 1)
			{
				var form = null;
				var selected_id = null;
				var selected_child_id = null;

				var trimmed_string = url_array[1].replace(/^\/+|\/+$/g, '');

				var path_array = trimmed_string.split('/');
				
				if(path_array.length > 0)
				{
					form = path_array[0];
					console.log("selected form: " + form);
				}
				
				if(path_array.length > 1)
				{
					selected_id = path_array[1];
					console.log("selected id: " + selected_id);
				}
				
				if(path_array.length > 2)
				{
					selected_child_id = path_array[2];
					console.log("selected child id: " + selected_child_id);
				}
				
				this.setState({
					selected_form_name: form,
					"selected_id": selected_id,
					"selected_child_id": selected_child_id}
				);

			}
		}
	},
	componentWillMount : function ()
	{

	},
	componentDidMount : function ()
	{
		
		//var url = location.protocol + '//' + location.host + '/meta-data/00/prenata_care.json';
		var url = location.protocol + '//' + location.host + '/meta-data/00/home_record.json';
		var AJAX = new AJAX_();

		this.navigation_set["summary"] = "#/summary";
		
		var meta_data = AJAX.GetResponse(url, function(metadata)
		{
			//ready_this.CreateFromMetaData(document, ready_this, metadata, parent);
			console.log("metadata\n", metadata);
			this.form_metadata.push(metadata);
		
			var Meta_Data_Renderer = new Meta_Data_Renderer_();
			var section_id = document.querySelector("#section_id");
			var form = Meta_Data_Renderer.CreateFromMetaData(this.form_metadata[0], {});
			this.form_set.push(form);
			
			this.navigation_set[this.form_metadata[0].name] = "#/" + this.form_metadata[0].url_route;
			

		}.bind(this)
		
		);		
	},
	render: function render() 
	{
		var result = null;
		if(this.state.isLoggedIn)
		{
			if(this.state.selected_form_name == null ||this.state.selected_form_name == '' || this.state.selected_form_name=='summary' || this.state.selected_id == null)
			{
			 result = React.createElement('div', {},
				React.createElement('img',{ src:"../images/mmria-secondary.svg", height:75, width:100}),
				React.createElement('h1',{},'App Element: MMRIA'),
				React.createElement('div',{ id:'profile_content_id'},'App Element: MMRIA'),
				React.createElement('div',{ id:'page_content_id'},
					React.createElement('p',{},''),
					React.createElement('div',{ id:'navigation_id'}),
					React.createElement('div',{ id:'form_content_id'},
							React.createElement(SummaryComponent,{})
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
					React.createElement('p',{},''),
					React.createElement('div',{ id:'navigation_id'},
						React.createElement('a',{href:'#/summary'},'summary')//,
						//' ',
						//React.createElement('a',{href:'#/home-record' + this.state.selected_id},'home-record')
					),
					React.createElement('div',{ id:'form_content_id'},
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
		
		if(info.is_logged_in)
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
			//var url = location.protocol + '//' + location.host + '/'
			var url_array = window.location.href.split('#');
			if(url_array.length > 1)
			{
				window.location.href = url_array[0];
			}
		}
		
	}
	
});