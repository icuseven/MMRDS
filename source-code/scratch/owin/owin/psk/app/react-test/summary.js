var map1 = Immutable.Map({a:1, b:2, c:3});

var SummaryComponent = React.createClass({
	displayName: "SummaryComponent",
	/*shouldComponentUpdate: function(nextProps, nextState) 
	{
		return this.state.value !== nextState.value;
	},*/
	getInitialState: function() 
	{
		var ctx = this;
		var new_array = [];
		var data_access = new Data_Access("http://localhost:5984");
		
		data_access.db.allDocs({ include_docs: true }).then(function (info) 
		{
			for(var i in info.rows)
			{
				var item = info.rows[i].doc;
				new_array.push({
					'_id': item._id,
					'last_name':item.last_name,
					'first_name':item.first_name,
					'middle_name':item.middle_name,
					'record_id':item.record_id
				});
				//console.log(info.rows[i].doc._id);
				//console.log(info.rows[i].doc);
			}
			//this.setState( Immutable.Map({ bound_data: new_array}));
			this.setState( { bound_data: new_array});
		}.bind(ctx));
		
		return { };
	},
	addNewCase: function ()
	{
		var ctx = this;
		var data_access = new Data_Access("http://localhost:5984");
		
		var new_data = [];
			
		for(var i in this.state.bound_data)
		{
			new_data.push(this.state.bound_data[i]);
		}

		var new_record_id = new Date().toISOString();
		
		var new_case = {
			_id : new_record_id,
			date_created: new Date().toISOString(),
			created_by: 'jhaines',
			date_last_updated: new Date().toISOString(),
			last_updated_by: 'jhaines',
			record_id : '',
			first_name : 'New First',
			middle_name : '',
			last_name : 'New Last',
			date_of_death : '2000-01-01',
			state_of_death : '',
			state_of_last_known_residence : '',
			agency_case_id : '',
			is_valid_maternal_mortality_record : false,
			death_certificate:
			{ 
				causes_of_death:[], 
				place_of_last_residence:
				{  
					street:"123 Old US HWY 25",
					city:"Los Angeles",
					state:"California",
					zip_code:"900890255"
				} 
			}
		};
		
		data_access.set_data(new_case, function (error, response) 
		{
			if (error) 
			{
			  console.log(error);
			  return;
			}
			else if(response && response.ok) 
			{
					//console.log('save finished');
					//console.log(doc);
					new_case.rev = response.rev;
					new_data.push(new_case);	 
					this.setState({ bound_data: new_data });
			}
		}.bind(ctx));
	},
	
	componentWillMount:function()
	{
		
	},
	handleLogin : function (e)
	{
		console.log('handle login');
		console.log(e);
		this.login();
	},
	onEmailChange : function()
	{
		console.log(this.refs['email'].value);
	},
	onNoChange : function()
	{
		console.log('on no change');
	},
	onLogin : function()
	{
		this.state.is_logged_in = true;
	},
	onLogout : function()
	{
		document.cookie = "AuthSession=" + this.state.auth_session + "; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";		
		this.setState({ is_logged_in: false	});
		var info = { 
				is_logged_in: false, 
				user_name: '',
				user_roles: [],
				auth_session: ''
			};
		this.props.profile_login_changed(info);
		
		
	},
	render: function render() 
	{
		var child_array = [];
		if(this.state.bound_data)
		{
			for(var i = 0; i < this.state.bound_data.length; i++)
			{
				var item = this.state.bound_data[i];
				var url = "#/home-record/" + item._id;
				var li = React.createElement('li',{ key: item._id, index:i },
					'[ ',
					React.createElement('a',{ 'data-route': 'master', href:url}, 'select'),
					' ] ',
					item.last_name + ', ' + item.first_name + ' ' + item.middle_name + ' (' + item.record_id + ')'
					);
				child_array.push(li)
			}
		}

		var summary_rows = React.createElement('ul',{ id:'summary_row_id'}, child_array);

		var result = React.createElement('form', {},
				React.createElement('fieldset',{},
					React.createElement('legend',{},'select action:'),
					React.createElement('input', {  type:'button', onClick:this.addNewCase, value:'add new mortality case'}), 
					React.createElement('br'),
					React.createElement('hr'),
					'search text: ',
					React.createElement('input', {  type:'text' }),
					' ',
					React.createElement('input', {  type:'button', onClick:this.addNewCase, value:'search'}),
					summary_rows
				)
		);		

		return result;
	}
});