
var g_policy_values = null;
var g_jurisdiction_tree = null;
var g_user_role_jurisdiction = null;
var g_current_u_id = null;
var g_jurisdiction_list = [];
var g_current_user_id = null;
var g_form_name = '';

var g_first_index  = 0;
var g_last_index = 10;
var g_current_page_number = 1;
var g_total_users = 0;
var g_total_users_per_page = 10;


let g_managed_jurisdiction_set = {}

g_user_set = new Set();


var g_user = null;
var g_current_user_role_jurisdiction = null;


const g_ui = { 
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
      let test = value.match(/^\d+-\d+-\d+T\d+:\d+:\d+.\d+Z$/);
      return (test)? true : false;
    }
    else
    {
        return false;
    }
  },
  add_new_user: function(p_name, p_password)
  {
	  return {
		"_id": "org.couchdb.user:" + p_name,
		"password": p_password,
		"iterations": 10,
		"name": p_name,
		"roles": [  ],
		"type": "user",
		"derived_key": "a1bb5c132df5b7df7654bbfa0e93f9e304e40cfe",
		"salt": "510427706d0deb511649021277b2c05d"
		};
  }
};



window.onload = main;

async function main()
{
  'use strict';
	window.onhashchange = on_hash_change;
	await load_values();
}


async function on_hash_change(e)
{
    if(e.isTrusted)
    {
        var new_url = e.newURL || window.location.href;
        g_ui.url_state = url_monitor.get_url_state(new_url);
        //console.log(g_ui.url_state);
        g_render();
    }
}


async function load_values()
{

    $('#form_content_id').html(
        `
        <span class="spinner-container spinner-content spinner-active">
            <span class="spinner-body text-primary">
                <span class="spinner"></span>
                <span class="spinner-info">Loading...</span>
            </span>
        </span>
  `
    );
    //window.location.href = set_url_hash(``);
    const get_initial_data_response = await $.ajax({
        url: location.protocol + '//' + location.host + '/manage-users/GetInitialData',
    });

    //onsole.log(get_initial_data_response);


    g_policy_values = get_initial_data_response.policy_values;

    for(let i = 0; i < get_initial_data_response.my_roles.rows.length; i++)
    {
        
        let value = get_initial_data_response.my_roles.rows[i].value;
        g_current_u_id = value.user_id
        break;
    }

    
    g_jurisdiction_list = []
    for(let i in get_initial_data_response.my_roles.rows)
    {

        var current_date = new Date();
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

        var value = get_initial_data_response.my_roles.rows[i].value;

        var diffDays = 0;
        var effective_start_date = "";
        var effective_end_date = "never";

        if(value.effective_start_date && value.effective_start_date != "")
        {
            effective_start_date = value.effective_start_date.split('T')[0];
        }

        if(value.effective_end_date && value.effective_end_date != "")
        {
            effective_end_date = value.effective_end_date.split('T')[0];
            diffDays = Math.round((new Date(value.effective_end_date).getTime() - current_date.getTime())/(oneDay));
        }

        

        if(diffDays < 0)
        {
            //role_list_html.push("<td class='td'>false</td>");
        }
        else
        {
            g_jurisdiction_list.push(value);
            if
            (
                value.role_name == "jurisdiction_admin" 
            )
            {
                g_managed_jurisdiction_set[value.jurisdiction_id] = true;
            }
            else if
            (
                value.role_name == "installation_admin"
            )
            {
                if(value.jurisdiction_id == null)
                {
                    g_managed_jurisdiction_set["/"] = true;
                }
                else
                {
                    g_managed_jurisdiction_set[value.jurisdiction_id] = true;
                }
            }
        }


    }  
    

    g_jurisdiction_tree = get_initial_data_response.jurisdiction_tree;

    g_user_role_jurisdiction = [];

    //g_user_role_jurisdiction = get_initial_data_response.user_role_jurisdiction;
    for(let i = 0; i < get_initial_data_response.user_role_jurisdiction.rows.length; i++)
    {
        g_user_role_jurisdiction.push(get_initial_data_response.user_role_jurisdiction.rows[i].value);
    }

    

    let temp = [];
    for(let i = 0; i < get_initial_data_response.user_list.rows.length; i++)
    {
        temp.push(get_initial_data_response.user_list.rows[i].doc);
    }

    g_ui.user_summary_list = temp;
    
    
/*
    let temp = [];
    for(let i = 0; i < get_initial_data_response.user_role_jurisdiction.rows.length; i++)
    {
        const item = get_initial_data_response.user_role_jurisdiction.rows[i].value;
        if(item.user_id != null)
        {
            temp.push(item);
            g_user_set.add(item.user_id) 
        }
        
    }

    g_ui.user_summary_list = temp;
*/
    g_ui.url_state = url_monitor.get_url_state(window.location.href);


    //document.getElementById('form_content_id').innerHTML = user_render(g_ui, g_current_u_id).join("");
    g_render();

}




function server_save(p_user)
{
	console.log("server save");
	//var current_auth_session = profile.get_auth_session_cookie();

	if(current_auth_session)
	{ 
		$.ajax({
					url: location.protocol + '//' + location.host + '/api/user',
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					data: JSON.stringify(p_user),
					type: "POST"
			}).done(function(response) 
			{


						var response_obj = eval(response);
						if(response_obj.ok)
						{
							g_user_list._rev = response_obj.rev; 
							document.getElementById('form_content_id').innerHTML = editor_render(g_user_list, "").join("");
						}
						//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
					console.log("metadata sent", response);
			});
	}

}

function add_new_user_click()
{
    g_user = {
        "_id": "org.couchdb.user:new_user",
        "iterations": 10,
        "name": "new_user",
        "roles": [],
        "type": "user",
        "derived_key": "eb257ea6d2195f72b3f48b3802d7118220ad1d6a",
        "salt": "78b006be78ba51262287320a123e61f0",
        "is_active": false,
        "is_enabled": false,
        "app_prefix_list": {
          "__no_prefix__": true
        },
        "password_scheme": "pbkdf2"
      };

    g_current_user_role_jurisdiction = [
        {
            "_id": null,
            "_rev": null,
            "parent_id": null,
            "role_name": "vital_importer",
            "user_id": "new_user",
            "jurisdiction_id": "/",
            "application_namespace": null,
            "effective_start_date": "2024-03-27T04:00:00Z",
            "effective_end_date": null,
            "is_active": true,
            "date_created": "2024-03-27T10:32:17.043Z",
            "created_by": "user1",
            "date_last_updated": "2024-03-27T10:32:17.043Z",
            "last_updated_by": "user1",
            "data_type": "user_role_jurisdiction"
        }
    ]
    //console.log("add new user clicked");
    window.location.href = set_url_hash('add-new-user');
}

function export_user_list_click()
{
    console.log("export user list clicked");
    //window.location.href = set_url_hash('view-user');
}

function view_audit_log_click()
{
    console.log("view audit log clicked");
    //window.location.href = set_url_hash('add-new-user');
}

function view_user_click(p_user_id)
{
    console.log(`view ${p_user_id} clicked`);
    //console.log(`edit ${p_user_id} clicked`);
    window.location.href = set_url_hash(`view-user?${p_user_id}`);
}

function edit_user_click(p_user_id)
{
    console.log(`edit ${p_user_id} clicked`);
    window.location.href = set_url_hash(`edit-user?${p_user_id}`);
}

function delete_user_click(p_user_id, p_rev)
{
    console.log(`delete user ${p_user_id} clicked with rev: ${p_rev}`);
    if(p_user_id && p_rev)
        { 
            $.ajax({
                url: location.protocol + '//' + location.host + '/api/user_role_jurisdiction?_id=' + p_user_id + '&rev=' + p_rev,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                type: "DELETE"
            }).done(function(response) 
            {
                $mmria.confirm_user_delete_dialog_close();
                if(response.ok)
                {
                    for(var i in g_ui.user_summary_list)
                    {
                        if(g_ui.user_summary_list[i]._id == response.id)
                        {
                            g_ui.user_summary_list.splice(i,1)
                            break;
                        }
                    }
                    g_render();
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error("Delete failed: ", textStatus, errorThrown);
                alert("Failed to delete user. Please try again.");
            });
        }
}

function set_roles_inactive_for_user_click(p_user_id)
{
    console.log(`set roles inactive for ${p_user_id} clicked`);
    //window.location.href = set_url_hash('add-new-user');
}

function back_to_landing_clicked()
{
    window.location.href = set_url_hash(`summary`);
}

function set_url_hash(new_hash)
{
    const current_url = new URL(window.location.href);
    current_url.hash = new_hash;
    return current_url;
}

function show_hide_user_management_back_button(shouldShow)
{
    if(shouldShow)
    {
        $("#navigate_back_to_landing").html(
            `
                <button class="btn btn-link pl-0" onclick="back_to_landing_clicked()">
                    <span class="x16 cdc-icon-chevron-circle-left"></span> Back to user Management
                </button>
            `
        )
    }
    else
    {
        $("#navigate_back_to_landing").html("");
    }
}


function add_new_user_save()
{
	var new_user_name = document.getElementById('new_user_name').value.trim();
	var new_user_password = null;
	var new_user_verify= null;

	if(g_policy_values.sams_is_enabled.toLowerCase() == "True".toLowerCase())
	{
		new_user_password = $mmria.get_new_guid().replace("-","");
		new_user_verify = new_user_password;
	}
	else
	{
		new_user_password = document.getElementById('new_user_password').value;
		new_user_verify= document.getElementById('new_user_verify').value;
	}
	var user_id = null;
	if(is_valid_user_name(new_user_name))
	{
		if
		(
			new_user_password == new_user_verify &&
			is_valid_password(new_user_password)
		)
		{
            check_if_existing_user(new_user_name, new_user_password);
		}
		else
		{
			create_status_warning("invalid password.<br/>be sure that verify and password match,<br/> minimum length is: " + g_policy_values.minimum_length + " and should only include characters [a-zA-Z0-9!@#$%?* ]", "new_user");
		}
	}
	else
	{
		create_status_warning("invalid user name. user name should be unique and at least 5 characters long. ", "new_user");
		console.log("got nothing.");
	}
}


function check_if_existing_user(p_user_id, p_new_user_password)
{
    $.ajax({
        url: location.protocol + '//' + location.host + '/api/user/check-user/org.couchdb.user:' + p_user_id,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET"
    }).done(function(user_check_response) 
    {
        if(user_check_response)
        {
            let user = eval(user_check_response);
            let is_found = false;

            for(var i = 0; i < g_ui.user_summary_list.length; i++)
            {
                if(g_ui.user_summary_list[i]._id == user._id)
                {
                    is_found = true;
                    break;
                }
            }

            if(!is_found)
            {
                g_ui.user_summary_list.push(user);

                save_user(user._id);

                //document.getElementById('form_content_id').innerHTML = user_render(g_ui, g_current_u_id).join("");
                //create_status_message("existing user has been added to this mmria instance.", user._id);
            }


        }
        else
        {
			var new_user = $$.add_new_user(p_user_id.toLowerCase(), p_new_user_password);
			user_id = new_user._id;
			g_ui.user_summary_list.push(new_user);
	
			$.ajax({
				url: location.protocol + '//' + location.host + '/api/user',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(new_user),
				type: "POST"
			}).done(function(response) 
			{
				var response_obj = eval(response);
				if(response_obj.ok)
				{
					for(var i = 0; i < g_ui.user_summary_list.length; i++)
					{
						if(g_ui.user_summary_list[i]._id == response_obj.id)
						{
							g_ui.user_summary_list[i]._rev = response_obj.rev; 
							break;
						}
					}
	
					//document.getElementById('form_content_id').innerHTML = user_render(g_ui, g_current_u_id).join("");
                    g_render();
					create_status_message("new user has been added.", "new_user");
	
				}
				//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
				
			});
/*


            document.getElementById('form_content_id').innerHTML = user_render(g_ui, g_current_u_id).join("");
            create_status_message("new user has been added.", "new_user");
*/
        }
        //{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
        
    });
}

function change_password_user_click(p_user_id)
{
	
	var new_user_password = document.querySelector('[role="confirm_1"][path="' + p_user_id + '"]').value;
	var new_confirm_password = document.querySelector('[role="confirm_2"][path="' + p_user_id + '"]').value;

	var user_index = -1;
	var user_list = g_ui.user_summary_list;
	var user = null;
	for(var i = 0; i < user_list.length; i++)
	{
		if(user_list[i]._id == p_user_id)
		{
			user = user_list[i];
			break;
		}
	}


	if(
		new_user_password == new_confirm_password &&
		is_valid_password(new_user_password)
	)
	{



		if(user)
		{
			user.password = new_user_password;

			//var current_auth_session = profile.get_auth_session_cookie();

			//if(current_auth_session)
			//{ 
				$.ajax({
					url: location.protocol + '//' + location.host + '/api/user',
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					data: JSON.stringify(user),
					type: "POST"/*,
					beforeSend: function (request)
					{
						request.setRequestHeader("AuthSession", current_auth_session);
					}*/
				}).done(function(response) 
				{
					var response_obj = eval(response);
					if(response_obj.ok)
					{
						for(let i = 0; i < g_ui.user_summary_list.length; i++)
						{
							if(g_ui.user_summary_list[i]._id == response_obj.id)
							{
								g_ui.user_summary_list[i]._rev = response_obj.rev; 
								break;
							}
						}

						if(response_obj.auth_session)
						{
							//profile.auth_session = response_obj.auth_session;
							$mmria.addCookie("AuthSession", response_obj.auth_session);
						}

						//document.getElementById('form_content_id').innerHTML = user_render(g_ui, g_current_u_id).join("");
						create_status_message("user information saved", convert_to_jquery_id(user._id));
						console.log("password saved sent", response);


					}
					//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
					
				});
			//}
		}
		else
		{
			//document.getElementById('form_content_id').innerHTML = user_render(g_ui, g_current_u_id).join("");
			g_render();
		}
	}
	else
	{

		create_status_warning("invalid password.<br/>be sure that verify and password match,<br/>  minimum length is: " + g_policy_values.minimum_length + " and should only include characters [a-zA-Z0-9!@#$%?* ]", convert_to_jquery_id(user._id));
		//create_status_warning("invalid password and confirm", convert_to_jquery_id(user._id));
		console.log("got nothing.");
	}
}


function is_valid_user_name(p_value)
{
	var result = true;

	if(
		p_value && 
		p_value.length > 4
	)
	{
		//console.log("greatness awaits.");
	}
	else
	{
		result = false;
	}


	for(var i in g_ui.user_summary_list)
	{
		if(g_ui.user_summary_list[i]._id.toLowerCase() == "org.couchdb.user:" + p_value.toLowerCase())
		{
			result = false;
			break;
		}
	}

	return result;
}

function is_valid_password(p_value)
{
	var result = true;

    var valid_character_re = /^[a-zA-Z0-9!@#$\%\?\* \-]+$/g;


	if(
		p_value &&
		p_value.length >= g_policy_values.minimum_length &&
		p_value.match(valid_character_re)
	)
	{
		//console.log("greatness awaits.");
	}
	else
	{
		result = false;
	}

	return result;
	
}

function save_user(p_user_id)
{
	var user_index = -1;
	var user_list = g_ui.user_summary_list;

	for(var i = 0; i < user_list.length; i++)
	{
		if(user_list[i]._id == p_user_id)
		{
			user_index = i;
			break;
		}
	}

	if(user_index > -1)
	{
		var user = user_list[user_index];
 
        $.ajax({
            url: location.protocol + '//' + location.host + '/api/user',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(user),
            type: "POST"
        }).done(function(response) 
        {
            var response_obj = eval(response);
            if(response_obj.ok)
            {
                for(var i = 0; i < g_ui.user_summary_list.length; i++)
                {
                    if(g_ui.user_summary_list[i]._id == response_obj.id)
                    {
                        g_ui.user_summary_list[i]._rev = response_obj.rev; 
                        break;
                    }
                }

                //document.getElementById('form_content_id').innerHTML = user_render(g_ui, g_current_u_id).join("");
                g_render();
                create_status_message("user information saved", convert_to_jquery_id(user._id));
                console.log("password saved sent", response);


            }
            //{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
            
        });
        
	}
}

function add_role(p_user_id, p_created_by)
{
	var user_index = -1;
	var user_list = g_ui.user_summary_list;
	for(var i = 0; i < user_list.length; i++)
	{
		if(user_list[i]._id == p_user_id)
		{
			user_index = i;
			break;
		}
	}

	if(user_index > -1)
	{

		var user = user_list[user_index];

		var temp_user_role = user_role_jurisdiction_add
		(
			"",
			user.name,
			"",
			new Date(new Date().setHours(0,0,0,0)),
			g_policy_values.default_days_in_effective_date_interval != null && parseInt(g_policy_values.default_days_in_effective_date_interval) >0? new Date(new Date().getTime() + parseInt(g_policy_values.default_days_in_effective_date_interval)*24*60*60*1000).setHours(0,0,0,0) : "",
			true,
			p_created_by
		);

		g_user_role_jurisdiction.push(temp_user_role);

		var role_list_for_ = document.getElementById("role_list_for_" + user.name);


		var opt = document.createElement('option');
		var option_text = [];
		option_text.push(temp_user_role.user_id);
		option_text.push(" ");
		option_text.push(temp_user_role.role_name);
		option_text.push(" ");
		option_text.push(temp_user_role.jurisdiction_id);
		option_text.push(" ");

		if(temp_user_role.effective_start_date instanceof Date)
		{
			option_text.push(temp_user_role.effective_start_date.toISOString());
		}
		else
		{
			option_text.push(temp_user_role.effective_start_date);
		}
		
		option_text.push(" ");
		if(temp_user_role.effective_end_date instanceof Date)
		{
			if(user_role.effective_end_date != "Invalid Date")
			{
				option_text.push(temp_user_role.effective_end_date.toISOString());
			}
			else
			{
				option_text.push(temp_user_role.effective_end_date);
			}
			
		}
		else
		{
			option_text.push(temp_user_role.effective_end_date);
		}		
		option_text.push(" ");
		option_text.push(temp_user_role.is_active);

		opt.value = temp_user_role._id;
		opt.selected = true;
		opt.innerHTML = option_text.join("");

		role_list_for_.appendChild(opt);

	
		var render_result = user_role_edit_render(user, temp_user_role, p_created_by);
		var selected_user_role_for_ = document.getElementById("selected_user_role_for_" + user.name);
		selected_user_role_for_.outerHTML = render_result.join("");

	}

}


function update_role(p_user_role_jurisdiction_id, p_user_id)
{


	var user_role_index = -1;
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		if(g_user_role_jurisdiction[i]._id == p_user_role_jurisdiction_id)
		{
			user_role_index = i;
			break;
		}
	}



	if(user_role_index > -1)
	{
		var user_index = -1;
		var user_list = g_ui.user_summary_list;
		for(var i = 0; i < user_list.length; i++)
		{
			if(user_list[i].name ==  g_user_role_jurisdiction[user_role_index].user_id)
			{
				user_index = i;
				break;
			}
		}

		if(user_index > -1)
		{

			
		
			var user_role = g_user_role_jurisdiction[user_role_index];
			var user = user_list[user_index];


			

			var selected_user_role_for_ = null;
			var role = document.getElementById("selected_user_role_for_" + user_role.user_id + "_role");
			var jurisdiction = document.getElementById("selected_user_role_for_" + user_role.user_id+ "_jurisdiction");
			var effective_start_date = document.getElementById("selected_user_role_for_" + user_role.user_id + "_effective_start_date");
			var effective_end_date = document.getElementById("selected_user_role_for_" + user_role.user_id + "_effective_end_date");
			var is_active = document.getElementById("selected_user_role_for_" + user_role.user_id + "_is_active");

			user_role.role_name = role.value;
			user_role.jurisdiction_id = jurisdiction.value;
			user_role.effective_start_date = new Date(effective_start_date.value);
			if(effective_end_date.value != null && effective_end_date.value != "")
			{
				user_role.effective_end_date = new Date(effective_end_date.value);
			}
			else
			{
				user_role.effective_end_date = null;
			}
			
			user_role.is_active = (is_active.value == "true")? true: false;
			user_role.last_updated_by = p_user_id;

			if(user_role.jurisdiction_id && user_role.role_name)
			{
				document.getElementById(convert_to_jquery_id(user._id) + "_status_area").innerHTML = "";
				document.getElementById("selected_user_role_for_" + user_role.user_id).innerHTML = '';
				save_user_role_jurisdiction(user_role, user, p_user_id);
			}
			else
			{
				create_status_warning("invalid jusidiction or role name", convert_to_jquery_id(user._id));
			}

		}
	}
}

function remove_role(p_user_role_id)
{
	var user_role_index = -1;
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		if(g_user_role_jurisdiction[i]._id == p_user_role_id)
		{
			user_role_index = i;
			break;
		}
	}

	if(user_role_index > -1)
	{
		var user_role = g_user_role_jurisdiction[user_role_index];

		var retVal = null
		
		if(user_role._rev)
		{
			retVal = prompt("Confirm role removal for user " + user_role.user_id + " by entering [" + user_role.role_name + "]: ", "enter role name here");
		}

		if(retVal && retVal.toLocaleLowerCase() == user_role.role_name && user_role._rev)
		{ 
			$.ajax({
				url: location.protocol + '//' + location.host + '/api/user_role_jurisdiction?_id=' + user_role._id + '&rev=' + user_role._rev,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				type: "DELETE"
			}).done(function(response) 
			{
				if(response.ok)
				{
					g_user_role_jurisdiction.splice(user_role_index, 1);

					
					for(let i = 0; i < g_ui.user_summary_list.length; i++)
					{
						if(g_ui.user_summary_list[i].name == user_role.user_id)
						{
							let escaped_id =  convert_to_jquery_id(g_ui.user_summary_list[i]._id);
							$( "#" + escaped_id).replaceWith( user_entry_render(g_ui.user_summary_list[i], i, g_current_u_id).join("") );
							break;
						}
					}
					document.getElementById("selected_user_role_for_" + user_role.user_id).innerHTML = '';
					document.getElementById(convert_to_jquery_id("org.couchdb.user:" + user_role.user_id) + "_status_area").innerHTML = "";
				}
			});
		}
		else
		{
				
			

		}
	}
}

function change_password(p_user_id, p_role)
{
	var user_index = -1;
	var user_list = g_ui.user_summary_list;
	var escaped_id =  convert_to_jquery_id(p_user_id);
	for(var i = 0; i < user_list.length; i++)
	{
		if(user_list[i]._id == p_user_id)
		{
			user_index = i;
			break;
		}
	}

	if(user_index > -1)
	{
		var user = user_list[user_index];
		var role_index = user.roles.indexOf(p_role);
		if(role_index > -1)
		{
			user.roles.splice(role_index, 1);
			g_ui.user_summary_list[user_index] = user;
			$( "#" + escaped_id).replaceWith( user_entry_render(user,  0, g_current_u_id).join("") );
			create_status_message("user information saved", convert_to_jquery_id(user._id));
		}
	}
}

function convert_to_jquery_id(p_value)
{
	return p_value.replace('@', 'ATT').replace(':','COL').replace(/\./g,'DOT');
}

function create_status_message(p_message, p_div_id)
{
	var result = [];

	//result.push('<div class="alert alert-success alert-dismissible">');
	result.push('<div>');
	//result.push('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
	// result.push('<strong>Info!</strong> ');
	result.push(p_message);
	result.push('</div>');

	document.getElementById(p_div_id + "_status_area").innerHTML = result.join("");

	window.setTimeout(clear_status, 30000);
}

function create_status_warning(p_message, p_div_id)
{
	var result = [];

	//result.push('<div class="alert alert-danger">');
	result.push('<div>');
	//result.push('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
	result.push('<strong>Warning!</strong> ');
	result.push(p_message);
	result.push('</div>');

	document.getElementById(p_div_id + "_status_area").innerHTML = result.join("");

	window.setTimeout(clear_status, 30000);
}

function clear_status()
{
	document.getElementById("status_area").innerHTML = "<div>&nbsp;</div>";
}

function jurisdiction_add_child_click(p_parent_id, p_name, p_user_id)
{
	var parent = get_jurisdiction(p_parent_id, g_jurisdiction_tree);
	var new_child  = null;

	if(parent)
	{
		if(parent.name == "/")
		{
			new_child  = jurisdiction_add(p_parent_id, "/" + p_name, p_user_id);
		}
		else
		{
			new_child  = jurisdiction_add(p_parent_id, parent.name + "/" + p_name, p_user_id);
		}
		
	}
	else
	{
		new_child  = jurisdiction_add(p_parent_id, p_name, p_user_id);
	}
	
	
	if
	(
		p_name != null && 
		p_name != "" && 
		p_name.match(/\W/) == null && 
		get_jurisdiction(new_child.id, g_jurisdiction_tree) == null
	)
	{
		var node_to_add_to = get_jurisdiction(p_parent_id, g_jurisdiction_tree);
		if(node_to_add_to)
		{
			node_to_add_to.children.push(new_child);
			g_jurisdiction_tree.date_last_updated = new Date();
			g_jurisdiction_tree.last_updated_by = p_user_id;
			var x = jurisdiction_render(node_to_add_to);

			var y=document.getElementById(p_parent_id.replace("/","_"));

			y.outerHTML = x.join("");
			
		}

	}
	
}

function jurisdiction_remove_child_click(p_parent_id, p_node_id, p_user_id)
{

	if(p_node_id != "jurisdiction_tree")
	{
		remove_jurisdiction(p_node_id, g_jurisdiction_tree)
		g_jurisdiction_tree.date_last_updated = new Date();
		g_jurisdiction_tree.last_updated_by = p_user_id;
		var node_to_add_to = get_jurisdiction(p_parent_id, g_jurisdiction_tree);
		if(node_to_add_to)
		{
			var x = jurisdiction_render(node_to_add_to);

			var y=document.getElementById(p_parent_id.replace("/","_"));

			y.outerHTML = x.join("");
			
		}

	}
	
}

function get_jurisdiction(p_search_id, p_node)
{
	var result = null;

	if(p_node._id && p_node._id == p_search_id)
	{
		return p_node;
	}

	if(p_node.id && p_node.id == p_search_id)
	{
		return p_node;
	}

	if(p_node.children != null)
	{
		for(var i = 0; i < p_node.children.length; i++)
		{
			var child = p_node.children[i];
			result = get_jurisdiction(p_search_id, child);
			if(result != null)
			{
				return result;
			}
		}
	}

	return result;
}

function remove_jurisdiction(p_search_id, p_node)
{
	if(p_node._id && p_node._id == p_search_id)
	{
		return;
	}

	if(p_node.children != null)
	{
		for(var i = 0; i < p_node.children.length; i++)
		{
			var child = p_node.children[i];
			if(p_node.children[i].id == p_search_id)
			{
				p_node.children.splice(i, 1);
				return;
			}
			else
			{
				remove_jurisdiction(p_search_id, child)
			}
		}
	}

	return;
}

function jurisdiction_add(p_parent_id, p_name, p_user_id)
{
	var result = {
		id: p_parent_id + "/" + p_name,
		name: p_name,
		date_created: new Date(),
		created_by: p_user_id,
		date_last_updated: new Date(),
		last_updated_by: p_user_id,
		is_active: true,
		is_enabled: true,
		children:[],
		parent_id: p_parent_id
	}

	return result;
}

function jurisdiction_update()
{
	
}


function jurisdiction_delete()
{
	
}


function user_role_jurisdiction_add
(
	p_role_name,
	p_user_id,
	p_jurisdiction_id,
	p_effective_start_date,
	p_effective_end_date,
	p_is_active,
	p_created_by
)
{
	var result = {
		_id: $mmria.get_new_guid(),
		role_name : p_role_name,
		user_id: p_user_id,
		jurisdiction_id: p_jurisdiction_id,

		effective_start_date: p_effective_start_date,
		effective_end_date: p_effective_end_date,
		is_active: p_is_active,
		date_created: new Date(),
		created_by: p_created_by,
		date_last_updated: new Date(),
		last_updated_by: p_created_by,
		data_type:"user_role_jursidiction"
	}

	return result;
}

function g_render()
{
    set_current_page_state();
    switch(g_form_name)
    {
        case "view-user":
            view_user_renderer();
            break;
        case "edit-user":
            edit_user_renderer();
            break;
        case "add-new-user":
            add_new_user_render();
            break;
        case "summary":
        default:
            summary_render();
    }
}

function set_current_page_state()
{
    g_form_name = g_ui.url_state.selected_form_name;
    let path_array = [];
    if(g_form_name != null && g_form_name.indexOf("?") > -1)
    {
        path_array = g_ui.url_state.path_array[0].split("?");
        g_form_name = path_array[0];
    }
    g_current_user_id = path_array[1] ? path_array[1] : null; 
}

function set_page_title(p_title)
{
    document.getElementById('manage_user_label').innerHTML = p_title;
}

function set_all_roles_active_state(p_user_id)
{
    const user_roles = g_user_role_jurisdiction.filter(user => user.user_id === p_user_id);
    user_roles.forEach(user_role => {
        user_role.last_updated_by = p_user_id;
        user_role.is_active = !user_role.is_active;
        
    });
    $(`#role_results_${p_user_id}`).html(function(_, html) {
        return html.replace(/Active/g, 'Inactive');
    });
    $(`#set_role_active_state_button_${p_user_id}`).attr('aria-disabled', true);
    $(`#set_role_active_state_button_${p_user_id}`).prop('disabled', true);
    bulk_save_user_role_jurisdiction(user_roles, p_user_id);

    console.log(user_roles);
}

function update_role(p_user_role_jurisdiction_id, p_user_id)
{
	var user_role_index = -1;
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		if(g_user_role_jurisdiction[i]._id == p_user_role_jurisdiction_id)
		{
			user_role_index = i;
			break;
		}
	}
	if(user_role_index > -1)
	{
		var user_index = -1;
		var user_list = g_ui.user_summary_list;
		for(var i = 0; i < user_list.length; i++)
		{
			if(user_list[i].name ==  g_user_role_jurisdiction[user_role_index].user_id)
			{
				user_index = i;
				break;
			}
		}
		if(user_index > -1)
		{
			var user_role = g_user_role_jurisdiction[user_role_index];
			var user = user_list[user_index];
			var selected_user_role_for_ = null;
			var role = document.getElementById("selected_user_role_for_" + user_role.user_id + "_role");
			var jurisdiction = document.getElementById("selected_user_role_for_" + user_role.user_id+ "_jurisdiction");
			var effective_start_date = document.getElementById("selected_user_role_for_" + user_role.user_id + "_effective_start_date");
			var effective_end_date = document.getElementById("selected_user_role_for_" + user_role.user_id + "_effective_end_date");
			var is_active = document.getElementById("selected_user_role_for_" + user_role.user_id + "_is_active");
			user_role.role_name = role.value;
			user_role.jurisdiction_id = jurisdiction.value;
			user_role.effective_start_date = new Date(effective_start_date.value);
			if(effective_end_date.value != null && effective_end_date.value != "")
			{
				user_role.effective_end_date = new Date(effective_end_date.value);
			}
			else
			{
				user_role.effective_end_date = null;
			}
			user_role.is_active = (is_active.value == "true")? true: false;
			user_role.last_updated_by = p_user_id;
			if(user_role.jurisdiction_id && user_role.role_name)
			{
				document.getElementById(convert_to_jquery_id(user._id) + "_status_area").innerHTML = "";
				document.getElementById("selected_user_role_for_" + user_role.user_id).innerHTML = '';
				save_user_role_jurisdiction(user_role, user, p_user_id);
			}
			else
			{
				create_status_warning("invalid jusidiction or role name", convert_to_jquery_id(user._id));
			}
		}
	}
}

function remove_role(p_user_role_id)
{
	var user_role_index = -1;
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		if(g_user_role_jurisdiction[i]._id == p_user_role_id)
		{
			user_role_index = i;
			break;
		}
	}
	if(user_role_index > -1)
	{
		var user_role = g_user_role_jurisdiction[user_role_index];
		var retVal = null
		if(user_role._rev)
		{
			retVal = prompt("Confirm role removal for user " + user_role.user_id + " by entering [" + user_role.role_name + "]: ", "enter role name here");
		}
		if(retVal && retVal.toLocaleLowerCase() == user_role.role_name && user_role._rev)
		{ 
			$.ajax({
				url: location.protocol + '//' + location.host + '/api/user_role_jurisdiction?_id=' + user_role._id + '&rev=' + user_role._rev,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				type: "DELETE"
			}).done(function(response) 
			{
				if(response.ok)
				{
					g_user_role_jurisdiction.splice(user_role_index, 1);
					for(let i = 0; i < g_ui.user_summary_list.length; i++)
					{
						if(g_ui.user_summary_list[i].name == user_role.user_id)
						{
							let escaped_id =  convert_to_jquery_id(g_ui.user_summary_list[i]._id);
							$( "#" + escaped_id).replaceWith( user_entry_render(g_ui.user_summary_list[i], i, g_current_u_id).join("") );
							break;
						}
					}
					document.getElementById("selected_user_role_for_" + user_role.user_id).innerHTML = '';
					document.getElementById(convert_to_jquery_id("org.couchdb.user:" + user_role.user_id) + "_status_area").innerHTML = "";
				}
			});
		}
		else
		{

		}
	}
}

function save_user_role_jurisdiction(p_user_role, p_user, p_user_id)
{
	if(p_user_role && p_user_id)
	{ 
		$.ajax({
			url: location.protocol + '//' + location.host + '/api/user_role_jurisdiction',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(p_user_role),
			type: "POST",
		})
		.done(
			function(response) 
			{
				if(response)
				{
					var response_obj = eval(response);
					if(response_obj.ok)
					{
						
						for(var i in g_user_role_jurisdiction)
						{
							if(g_user_role_jurisdiction[i]._id == response_obj.id)
							{
								g_user_role_jurisdiction[i]._rev = response_obj.rev; 
								//document.getElementById('form_content_id').innerHTML = editor_render(g_user_list, "", g_ui).join("");
	
								var render_result = render_role_list_for(p_user, p_user_id);
								var role_list_for_ = document.getElementById("role_list_for_" + p_user.name);
								role_list_for_.outerHTML = render_result.join("");

								break;
							}
						}
					}
						//{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
					console.log("jurisdiction_tree sent", response);
				}
				else
				{
					alert("You are not authorized to make this change.");
				}
			}
		);
	}
}

function bulk_save_user_role_jurisdiction(user_roles, p_user_id) 
{
    if (user_roles && user_roles.length > 0 && p_user_id) 
    {
        if (user_roles && p_user_id) 
        {
            $.ajax({
                url: location.protocol + '//' + location.host + '/api/user_role_jurisdiction/bulk',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(user_roles),
                type: "POST",
            })
            .done(function(response)
            {
                if (response) {
                    response.forEach((response_obj) => {
                        if (response_obj.ok) {
                            var p_user_role = g_user_role_jurisdiction.find(user_role => user_role._id == response_obj.id);
                            if(p_user_role) {
                                p_user_role._rev = response_obj.rev;
                            }
                        }
                    });
						console.log("Bulk save successful", response);
					} else {
						alert("You are not authorized to make this change.");
					}
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					console.error("Bulk save failed: ", textStatus, errorThrown);
				});
			}
		}
}

    function format_date(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }