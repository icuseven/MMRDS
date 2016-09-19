var SummaryComponent = React.createClass({
	displayName: "SummaryComponent",
	getInitialState: function() 
	{
		var ctx = this;
		var new_array = [];
		var data_access = new Data_Access("http://localhost:5984");
		
		data_access.db.allDocs({ include_docs: true }).then(function (info) 
		{
			for(var i in info.rows)
			{
				//new_array.push(info.rows[i].doc);
				var item = info.rows[i].doc;
				new_array.push({
					'_id': item._id,
					'last_name':item.last_name,
					'first_name':item.first_name,
					'middle_name':item.middle_name,
					'record_id':item.record_id
				});
				//console.log(info.rows[i].doc._id);
				console.log(info.rows[i].doc);

				//{{item.last_name}}, {{item.first_name}} {{item.middle_name}} {{item.record_id}}				
				
			}
			this.setState( { bound_data: new_array});
		}.bind(ctx));
		
		return { };
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