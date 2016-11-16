'use strict';


//http://www.w3schools.com/css/css3_flexbox.asp

var g_metadata = null;
var g_data = null;
var g_metadata_path = [];
var g_validator_map = [];
var g_validation_description_map = [];

function g_set_data_object_from_path(p_object_path, p_metadata_path, value)
{
  var current_value = eval(p_object_path);
  if(current_value != value)
  {

    

    if(g_validator_map[p_metadata_path])
    {
      if(g_validator_map[p_metadata_path](value))
      {
        var metadata = eval(p_metadata_path);
        eval(p_object_path + ' = "' + value.replace('"', '\"') + '"');
        document.getElementById(p_object_path).innerHTML = page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path).join("");
      }
      else
      {
        console.log("didn't pass validation");
      }

      
    }
    else
    {
      var metadata = eval(p_metadata_path);
      eval(p_object_path + ' = "' + value.replace('"', '\"') + '"');
      document.getElementById(p_object_path).innerHTML = page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path).join("");
    }
    
  }
  

  
}

function g_add_grid_item(p_object_path, p_metadata_path)
{
  var metadata = eval(p_metadata_path);
  var new_line_item = create_default_object(metadata, {});
  eval(p_object_path).push(new_line_item[metadata.name][0]);

  document.getElementById(p_metadata_path).innerHTML = page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path).join("");
  
}

function g_delete_grid_item(p_object_path, p_metadata_path)
{
  var metadata = eval(p_metadata_path);
  var index = p_object_path.match(new RegExp("\\[\\d+\\]$"))[0].replace("[","").replace("]","");
  var object_string = p_object_path.replace(new RegExp("(\\[\\d+\\]$)"), "");
  eval(object_string).splice(index, 1);

  document.getElementById(p_metadata_path).innerHTML = page_render(metadata, eval(object_string), g_ui, p_metadata_path, object_string).join("");
  
}



var g_ui = {
  url_state: {
    selected_form_name: null,
    "selected_id": null,
    "selected_child_id": null,
    "path_array" : []

  },
  data_list : [],
  set_value: function(p_path, p_value)
  {
    console.log("g_ui.set_value: ", p_path, p_value);
    console.log("value: ", p_value.value);
    console.log("get_eval_string(p_path): ", g_ui.get_eval_string(p_path));

    eval(g_ui.get_eval_string(p_path + ' = "' + p_value.value.replace('"', '\\"')  + '"'));

    //var target = eval(g_ui.get_eval_string(p_path));
  },
  get_eval_string: function (p_path)
  {
  	var result = "g_data" + p_path.replace(new RegExp('/','gm'),".").replace(new RegExp('\\.(\\d+)\\.','g'),"[$1]\\.").replace(new RegExp('\\.(\\d+)$','g'),"[$1]");
    //return an  array with 2 parts.
      // g_data['attribute'].attribute...

  	return result;

  },
  add_new_case: function()
	{

    var result = create_default_object(g_metadata, {});

    result.home_record.last_name = "new-last-name";
    result.home_record.first_name = "new-first-name";
		var new_data = [];

		for(var i in g_ui.data_list)
		{
			new_data.push(g_ui.data_list[i]);
		}

		var new_record_id = new Date().toISOString();
		new_data.push
		(
      result
		);

		g_ui.data_list = new_data;

    g_data = result;

		g_ui.selected_record_id = result._id;
		g_ui.selected_record_index = g_ui.data_list.length -1;


    var url = location.protocol + '//' + location.host + '#/' + g_ui.selected_record_index + '/home_record';
    window.location = url;

    return result;
	}
};
var $$ = {


 is_id: function(value){
   // 2016-06-12T13:49:24.759Z
    if(value)
    {
      var test = value.match(/^\d+-\d+-\d+T\d+:\d+:\d+.\d+Z$/);
      return (test)? true : false;
    }
    else
    {
        return false;
    }
  }
};

$(function ()
{

window.onhashchange = function(e)
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

    var new_url = e.newURL || window.location.href;

    g_ui.url_state = url_monitor.get_url_state(new_url);

    document.getElementById('navigation_id').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");

    document.getElementById('form_content_id').innerHTML = page_render(g_metadata, g_data, g_ui, "g_metadata", "g_data").join("");
    apply_tool_tips();

    if(g_ui.url_state.path_array && g_ui.url_state.path_array.length > 0 && (parseInt(g_ui.url_state.path_array[0]) >= 0))
    {


      /*
      selected_form_name: form,
      "selected_id": selected_id,
      "selected_child_id": selected_child_id*/
  		var section_list = document.getElementsByTagName("section");
  		for(var i = 0; i < section_list.length; i++)
  		{
  			var section = section_list[i];
  			if(section.id == g_ui.url_state.path_array[1] + "_id")
  			{
  					section.style.display = "block";
  			}
  			else
  			{
  					section.style.display = "none";
  			}
      }
		}
    else
    {
      var section_list = document.getElementsByTagName("section");
        for(var i = 0; i < section_list.length; i++)
        {
          var section = section_list[i];
          if(section.id == "app_summary")
          {
              section.style.display = "block";
          }
          else
          {
              section.style.display = "none";
          }
      }

    }

  }
  else
  {
    // do nothing for now
  }
};

	profile.initialize_profile();

	$.ajax({
			url: location.protocol + '//' + location.host + '/api/metadata',
			data: {foo: 'bar'}
	}).done(function(response) {
			g_metadata = response;
			g_data = create_default_object(g_metadata, {});

      create_validator_map(g_validator_map, g_validation_description_map, g_metadata, "g_metadata");

      g_ui.url_state = url_monitor.get_url_state(window.location.href);
/*
			document.getElementById('navigation_id').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");

			document.getElementById('form_content_id').innerHTML = page_render(g_metadata, g_data, g_ui).join("");
      apply_tool_tips();
      */
      window.onhashchange ({ isTrusted: true, newURL : window.location.href });

	});
});


function show_print_version()
{
  window.open("./print-version", "_print_version");
}

function show_data_dictionary()
{
  window.open("./data-dictionary", "_data_diction");
}


function apply_tool_tips()
{
		$('[data-tooltip]').addClass('tooltip');
		$('.tooltip').each(function() 
    {  
			$(this).append('<span class="tooltip-content">' + $(this).attr('data-tooltip') + '</span>');  
		});
}