var EditorComponent = React.createClass({
	form_metadata:[],
	form_set: [],
	navigation_set:{},
	record_data:[],
	displayName: "EditorComponent",
	
	getInitialState: function() 
	{
		window.onhashchange = this.url_has_changed;

		
		var url_state = this.get_url_state(window.location.href);
		//return { email: this.props.initialEmail, password: this.props.initialPassword };
		return url_state;
	},
	get_url_state: function(url)
	{
		var result = null;
		var form = null;
		var selected_id = null;
		var selected_child_id = null;
			
		var url_array = url.split('#');
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
			
			result = {
				selected_form_name: form,
				"selected_id": selected_id,
				"selected_child_id": selected_child_id
			};
		}
		
		return result;
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
			var url_state = this.get_url_state(e.newURL);
			
			if(
				url_state.selected_id != null && 
				url_state.selected_id != this.state.selected_id
			)
			{
				if(this.state.record_data.length > 0)
				{
					var data_access = new Data_Access("http://localhost:5984");
					data_access.get_data(url_state.selected_id,
						function(doc) 
						{
						  this.load_record(doc);
						  this.setState(url_state);
						}.bind(this)
					);
				}
				else
				{
					this.setState(url_state);
				}
			}
			else
			{
				this.setState(url_state);
			}
		}
		else
		{
			// do nothing for now
		}
	},
	set_record_data: function(p_record_data)
	{
		this.setState({ record_data: p_record_data });
	},
	get_record_data: function()
	{
		return this.state.record_data;
	},
	componentWillMount : function ()
	{

	},
	componentDidMount : function ()
	{
		
		//var url = location.protocol + '//' + location.host + '/meta-data/00/prenata_care.json';
		var url = location.protocol + '//' + location.host + '/meta-data/01/home_record.json';
		var AJAX = new AJAX_();

		this.navigation_set["summary"] = "#/summary";
		
		var meta_data = AJAX.GetResponse(url, function(metadata)
		{
			//ready_this.CreateFromMetaData(document, ready_this, metadata, parent);
			console.log("metadata\n", metadata);
			this.form_metadata.push(metadata);
		/*
			var Meta_Data_Renderer = new Meta_Data_Renderer_();
			var section_id = document.querySelector("#section_id");
			var form = Meta_Data_Renderer.CreateFromMetaData(this.form_metadata[0], record_to_load);
			this.form_set.push(form);
			*/
			this.navigation_set[this.form_metadata[0].name] = "#/" + this.form_metadata[0].url_route;
			

		}.bind(this)
		
		);		
	},
	load_record:function(record_to_load)
	{
			console.log('load_record called');
			var Meta_Data_Renderer = new Meta_Data_Renderer_();
			var section_id = document.querySelector("#section_id");
			var form = Meta_Data_Renderer.CreateFromMetaData(this.form_metadata[0], record_to_load);
			this.form_set.push(form);
	},
	create_tree: function(metadata)
	{
		var result = null;
		
		if(metadata && Array.isArray(metadata))
		{
			result = [];
			for(var i = 0; i < metadata.length; i++)
			{
				result.push(this.create_tree(metadata[i]));
			}	
			return result;
		}
		else if(metadata && metadata.type)
		{
			switch(metadata.type.toLowerCase())
			{
				case 'boolean':
				case 'date':
				case 'number':
				case 'string':
				case 'time':
					result = React.createElement('li',{}, metadata.name, ' : ', metadata.type);
					return result;
					break;			
				// container field
				case 'form':
				case 'group':
				case 'address':			
					result = React.createElement('li',{}, metadata.name, ' : ', metadata.type,
						React.createElement('ul',null,
						this.create_tree(metadata.children))
						);
					
					return result;
					break;
				// list field
				case 'radio':
				case 'list':
				case 'yes_no':
				case 'race':
					result = React.createElement('li',{}, metadata.name, ' : ', metadata.type,
						React.createElement('ul',null,
						this.create_tree(metadata.values))
						);
					
					return result;
					break;
				// grid field //key: metadata.name
				case 'grid':
					result = React.createElement('li',{}, metadata.name, ' : ', metadata.type,
						React.createElement('ul',null,
						this.create_tree(metadata.children))
						);
					return result;
					break;				
				default:
					console.log("meta_navigator unimplemented", metadata.type);
					result = React.createElement('li',{  }, metadata.name, ' : ', metadata.type);
					return result;
					break;
				
			}
		}
		else
		{
			
			console.log("meta_navigator metadata node without type", metadata);
		}
	},
	
	render: function render() 
	{
		var result = null;
		
		if(this.state && this.state.profile && this.state.profile.isLoggedIn)
		{
			

			var item = this.create_tree(this.form_metadata[0]);
			//meta_navigator.navigate(this.form_metadata[0]);
			var root = React.createElement('ul',{ id:'root_tree_id'}, item);

			 result = React.createElement('div', {},
				React.createElement('img',{ src:"../images/mmria-secondary.svg", height:75, width:100}),
				React.createElement('h1',{},'App Element: MMRIA'),
				React.createElement('div',{ id:'profile_content_id'},'App Element: MMRIA'),
				React.createElement('div',{ id:'page_content_id'},
					React.createElement('p',{},''),
					React.createElement('div',{ id:'navigation_id'}),
					React.createElement('div',{ id:'form_content_id'},
						root
					)
				));
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
	get_profile: function ()
	{
		return this.state.profile;
	},  
	profile_login_changed:function( info ) 
	{
		console.log("profile_login_changed", info);

		this.setState({ 
			profile: {
				isLoggedIn: info.is_logged_in,
				auth_session: info.auth_session,
				user_name: info.user_name,
				user_roles: info.user_roles
			}
		});

		
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