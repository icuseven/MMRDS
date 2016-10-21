var g_metadata = null;
var g_data = null;

var g_ui = { is_collapsed : [] };


var md = {
/*

required:
	name
	prompt	
	type

optional:
is_core_summary
is_required

regex_pattern
validation
onblur

max_value
min_value
control_style
radio
checkbox


controls:
	label
	button

*/
	create_app: function(p_user_name)
	{
		var date = new Date().toISOString(); 
		return {
			"_id": date,
			"_rev": null,
			"name":"mmria",
			"type":"app",
			"date_created": date,
			"created_by": p_user_name,
			"date_last_updated": date,
			"last_updated_by": p_user_name,
			"children":[]
			}
	},
	create_form: function(			
			p_name,
			p_prompt,
			p_cardinality)
	{
		return {
			"name": p_name,
			"prompt": p_prompt,
			"cardinality":p_cardinality,
			"type": "form",
			"children": []
		}

	},
	create_group: function(p_name, p_prompt, p_type, p_style)
	{
		if(p_style)
		{
			return {
				"name": p_name,
				"prompt": p_prompt,
				"type": "group",
				"children": []
			}
		}
		else
		{
return {
				"name": p_name,
				"prompt": p_prompt,
				"type": "group",
				"children": []
			}
		}
	},
	create_value_list: function(p_name, p_prompt, p_type)
	{
		return {
			"name": p_name,
			"prompt": p_prompt,
			"type": p_type,
			"values": []
		}
	},
	create_value: function(p_name, p_prompt, p_type)
	{
		return {
			"name": p_name,
			"prompt": p_prompt,
			"type": p_type,
			"values": []
		}
	}

};


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

			document.getElementById('form_content_id').innerHTML = editor_render(g_metadata, "", g_ui).join("");

	});



});
