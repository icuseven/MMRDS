'use strict';


//http://www.w3schools.com/css/css3_flexbox.asp

var g_metadata = null;
var g_data = null;
var g_metadata_path = [];
var g_validator_map = [];
var g_event_map = [];
var g_validation_description_map = [];
var g_selected_index = null;
var g_selected_delete_index = null;
var g_couchdb_url = null;
var g_localDB = null;
var g_remoteDB = null;
var g_metadata_summary = [];


var default_object = null;

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
        /*
        if(metadata.type.toLowerCase() == "datetime")
        {
          var input_list = document.getElementById(p_object_path);
          var value_set = [];
          for(var i = 0; i < input_list.children.length; i++)
          {
            if(input_list.children[i].nodeName.toLocaleLowerCase() == "input")
            {
              value_set.push(input_list.children[i].value);
            }
          }
          for(var i = 0; i < p_metadata.children.length; i++)
          {
            var child = p_metadata.children[i];
            Array.prototype.push.apply(result,navigation_render(child, p_level + 1, p_ui));
          }
          if(value_set[0] == "")
          {
              value_set[0] = "2016-01-01";
          }

          if(value_set[1] == "")
          {
            value_set[1] = "00:00:00.000";
          }

          eval(p_object_path + ' = new Date("' + value_set.join("T") + 'Z")');
        }
        else*/ if(metadata.type.toLowerCase() == "boolean")
        {
          eval(p_object_path + ' = ' + value);
        }
        else
        {
          eval(p_object_path + ' = "' + value.replace(/"/g, '\"').replace(/\n/g,"\\n") + '"');
        }

        document.getElementById(p_object_path).innerHTML = page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path, false, 0, 0, 0).join("");
        if(g_ui.broken_rules[p_object_path])
        {
          g_ui.broken_rules[p_object_path] = false;
        } 
      }
      else
      {
        g_ui.broken_rules[p_object_path] = true;
        console.log("didn't pass validation");

      }
    }
    else
    {
      var metadata = eval(p_metadata_path);
      if(metadata.type.toLowerCase() == "list" && metadata['is_multiselect'] && metadata.is_multiselect == true)
      {
        var item = eval(p_object_path);
        if(item.indexOf(value) > -1)
        {
          item.splice(item.indexOf(value), 1);
        }
        else
        {
          item.push(value);
        }
    }/*
      else if(metadata.type.toLowerCase() == "datetime")
      {
        var input_list = document.getElementById(p_object_path);
        var value_set = [];
        for(var i = 0; i < input_list.children.length; i++)
        {
          if(input_list.children[i].nodeName.toLocaleLowerCase() == "input")
          {
            value_set.push(input_list.children[i].value);
          }
          
        }

        if(value_set[0] == "")
        {
            value_set[0] = "2016-01-01";
        }

        if(value_set[1] == "")
        {
          value_set[1] = "00:00:00.000";
        }

        eval(p_object_path + ' = new Date("' + value_set.join("T") + 'Z")');
    }*/
      else if(metadata.type.toLowerCase() == "boolean")
      {
        eval(p_object_path + ' = ' + value);
      }
      else
      {
        eval(p_object_path + ' = "' + value.replace(/"/g, '\"').replace(/\n/g,"\\n") + '"');
      }
      
      //document.getElementById(p_object_path).innerHTML = page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path, false, 0, 0, 0).join("");
      $("#" + p_object_path).replaceWith(page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path, false, 0, 0, 0).join(""));
    }

    apply_validation();
  }
}

function g_add_grid_item(p_object_path, p_metadata_path)
{
  var metadata = eval(p_metadata_path);
  var new_line_item = create_default_object(metadata, {});
  eval(p_object_path).push(new_line_item[metadata.name][0]);

  document.getElementById(p_metadata_path).innerHTML = page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path, false, 0, 0, 0).join("");
  
}

function g_delete_grid_item(p_object_path, p_metadata_path)
{
  var metadata = eval(p_metadata_path);
  var index = p_object_path.match(new RegExp("\\[\\d+\\]$"))[0].replace("[","").replace("]","");
  var object_string = p_object_path.replace(new RegExp("(\\[\\d+\\]$)"), "");
  eval(object_string).splice(index, 1);

  document.getElementById(p_metadata_path).innerHTML = page_render(metadata, eval(object_string), g_ui, p_metadata_path, object_string, false, 0, 0, 0).join("");
  
}



var g_ui = {
  url_state: {
    selected_form_name: null,
    "selected_id": null,
    "selected_child_id": null,
    "path_array" : []

  },
  data_list : [],
  broken_rules : [],
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

	console.log($mmria.getCookie("uid"));
	console.log($mmria.getCookie("pwd"));
  console.log($mmria.getCookie("AuthSession"));

  load_values();
});


function load_profile()
{

  if($mmria.getCookie("AuthSession"))
  {
    profile.initialize_profile();
  }
  else
	{



				profile.user_name = $mmria.getCookie("uid");
				profile.password = $mmria.getCookie("pwd");

				var url =  location.protocol + '//' + location.host + "/api/session";
				var post_data = { "userid" : $mmria.getCookie("uid") , "password": $mmria.getCookie("pwd") };
				$.ajax({
					"url": url,
					data: post_data
				}).done(profile.login_response).fail(function(response) {
						console.log("fail bubba");console.log(response);
				});

  }
/*
    profile.on_login_call_back = function ()
    {

      get_metadata();
      get_case_set();
      
      //load_documents();

    };*/


  	
}

function load_values()
{
	$.ajax({
			url: location.protocol + '//' + location.host + '/api/values',
	}).done(function(response) {
			g_couchdb_url = response.couchdb_url;
      load_profile();

	});

}


function get_case_set()
{
	$.ajax({
			url: location.protocol + '//' + location.host + '/api/case',
	}).done(function(response) 
  {
        g_ui.data_list = [];
        for(var i = 0; i < response.rows.length; i++)
        {
          g_ui.data_list.push(response.rows[i].doc);
        }

        document.getElementById('navbar').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");
        document.getElementById('form_content_id').innerHTML = page_render(g_metadata, default_object, g_ui, "g_metadata", "default_object", false, 0, 0, 0).join("");
        
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


  }).fail(function(response){ console.log("fail get_case_set", response)});

}


function get_metadata()
{
  	$.ajax({
			url: location.protocol + '//' + location.host + '/api/metadata',
	}).done(function(response) {
			g_metadata = response;
      metadata_summary(g_metadata_summary, g_metadata, "g_metadata", 0, 0);
      default_object =  create_default_object(g_metadata, {});
      //create_validator_map(g_validator_map, g_validation_description_map, g_metadata, "g_metadata");

      g_ui.url_state = url_monitor.get_url_state(window.location.href);
      if(window.onhashchange)
      {
        window.onhashchange ({ isTrusted: true, newURL : window.location.href });
      }
      else
      {
        window.onhashchange = window_on_hash_change;
        window.onhashchange ({ isTrusted: true, newURL : window.location.href });
      }
	});
}

function window_on_hash_change(e)
{
  /*
  e = HashChangeEvent
  {
    isTrusted: true,
    oldURL: "http://localhost:12345/react-test/#/",
    newURL: "http://localhost:12345/rea
  }*/

  if(g_data)
  {
      var selected_record_id = g_data._id;
      if($.isNumeric(g_ui.url_state.path_array[0]))
      {
          g_selected_index = parseInt(g_ui.url_state.path_array[0]);
      }
      else //if(g_ui.data_list.length > 0)
      {
        g_selected_index = g_ui.data_list.length - 1;
      }
          
        if(e.isTrusted)
        {

          var new_url = e.newURL || window.location.href;
          g_ui.url_state = url_monitor.get_url_state(new_url);

          if(g_ui.url_state.path_array && g_ui.url_state.path_array.length > 0 && (parseInt(g_ui.url_state.path_array[0]) >= 0))
          {
            if(g_data._id != g_ui.data_list[parseInt(g_ui.url_state.path_array[0])]._id)
            {
                save_queue.push(g_data._id);
            }

            g_data = g_ui.data_list[parseInt(g_ui.url_state.path_array[0])];

            document.getElementById('navbar').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");
            document.getElementById('form_content_id').innerHTML = page_render(g_metadata, g_data, g_ui, "g_metadata", "g_data", false, 0, 0, 0).join("");
            apply_tool_tips();


            var section_list = document.getElementsByTagName("section");


            if(g_ui.url_state.path_array.length > 2 && (parseInt(g_ui.url_state.path_array[0]) >= 0))
            {
              for(var i = 0; i < section_list.length; i++)
              {
                var section = section_list[i];
                if(section.id == g_ui.url_state.path_array[1])
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

          }
          else
          {
            if(g_data && !(save_queue.indexOf(g_data._id) > -1))
            {
              save_queue.push(g_data._id);
            }
            g_data = null;
            document.getElementById('navbar').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");
            document.getElementById('form_content_id').innerHTML = page_render(g_metadata, default_object, g_ui, "g_metadata", "default_object", false, 0, 0, 0).join("");
            apply_tool_tips();

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
      
    
   // g_data_access.set_data(g_data);
			
  }
  else if(e.isTrusted)
  {

    var new_url = e.newURL || window.location.href;

    g_ui.url_state = url_monitor.get_url_state(new_url);


    if(g_ui.url_state.path_array && g_ui.url_state.path_array.length > 0 && (parseInt(g_ui.url_state.path_array[0]) >= 0))
    {
      g_data = g_ui.data_list[parseInt(g_ui.url_state.path_array[0])];

      document.getElementById('navbar').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");
      document.getElementById('form_content_id').innerHTML = page_render(g_metadata, g_data, g_ui, "g_metadata", "g_data", false, 0, 0, 0).join("");
      apply_tool_tips();


  		var section_list = document.getElementsByTagName("section");
      if(g_ui.url_state.path_array.length > 2 && (parseInt(g_ui.url_state.path_array[0]) >= 0))
      {
        for(var i = 0; i < section_list.length; i++)
        {
          var section = section_list[i];
          if(section.id == g_ui.url_state.path_array[1])
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
		}
    else
    {

      if(g_data && !(save_queue.indexOf(g_data._id) > -1))
      {
        save_queue.push(g_data._id);
      }
              
      g_data = null;

      document.getElementById('navbar').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");
                                                            //page_render(p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_is_grid_context, p_row, p_column)
      document.getElementById('form_content_id').innerHTML = page_render(g_metadata, default_object, g_ui, "g_metadata", "default_object", false, 0, 0, 0).join("");
      apply_tool_tips();

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


function show_print_version()
{
  window.open("./print-version", "_print_version");
}

function show_data_dictionary()
{
  window.open("./data-dictionary", "_data_dictionary");
}

function show_user_administration()
{
  window.open("./_users", "_users");
}


function apply_tool_tips()
{
  $('[rel=tooltip]').tooltip();
  $( ".time" ).datetimepicker({ format: 'LT'});
//$( "[metadata_type='date']" ).datetimepicker();

flatpickr(" .date", {
	utc: true,
	//defaultDate: "2016-12-27T00:00:00.000Z",
	enableTime: false,
});

$( ".datetime" ).datetimepicker();

$("input.number").TouchSpin({
                verticalbuttons: true,
                min: 0,
                max: 10000,
                step: 1,
                maxboostedstep: 10
            });

$("input.number").mask("#,##0.00", {reverse: true});

    apply_validation();


}




function apply_validation()
{
    for(var i in g_ui.broken_rules)
    {
      var element = document.getElementById(i);
      if(g_ui.broken_rules[i] == true)
      {
        
        if
        (
          element &&
          element.className.indexOf('failed-validation') < 0
        )
        {
         element.className += ' failed-validation';
         /*
         var validation_text = element.getAttribute('validation-tooltip');
         if(validation_text)
         {
          var span_node = document.createElement("span");
          span_node.setAttribute('class', 'tooltip-content');
          span_node.innerText = element.getAttribute('validation-tooltip');
          element.appendChild(span_node);
         }
         */

        }
      }
      else
      {
        
        if
        (
          element &&
          element.className.indexOf('failed-validation') > 0
        )
        {
          var class_array = element.className.split(' ');
          class_array.splice(class_array.indexOf('failed-validation'),1);
          element.className = class_array.join(' ');
        }
        
      }
    }
}

function delete_record(p_index)
{
  if(p_index == g_selected_delete_index)
  {
    g_ui.data_list[p_index]._deleted = true;
    save_queue.push(g_ui.data_list[p_index]._id);
  }
  else
  {
      if(g_selected_delete_index)
      {
          var old_id = g_ui.data_list[g_selected_delete_index]._id;
          $("div[path='" +old_id + "']").removeClass("selected-for-delete");
      }

      g_selected_delete_index = p_index;
      var id = g_ui.data_list[p_index]._id;
      $("div[path='" + id + "']").addClass("selected-for-delete");
      
  }
}


var save_interval_id = null;
var save_queue = [];

function save_change_task()
{
  var url =  location.protocol + '//' + location.host + "/api/case";

  if(save_queue.length > 0)
  {

    var data_item = null;

    var selected_record_id = save_queue.pop();

    var found_index = -1;
    for(var i = 0; i < g_ui.data_list.length; i++)
    {
      if(selected_record_id == g_ui.data_list[i]._id)
      {
        data_item = g_ui.data_list[i];
        found_index = i;
        break;
      }
    }
    
    if(found_index < 0)
    {
        return;
    }

    var auth_cookie = profile.get_auth_session_cookie();

    $.ajax({
      url: url,
      contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data_item),
        type: "POST",
        beforeSend: function (request)
        {
          request.setRequestHeader("AuthSession", auth_cookie);
        }
    }).done(function(response) 
    {
        var response_obj = eval(response);
          if(response_obj.ok)
          {
            var found_index = -1;
            for(var i = 0; i < g_ui.data_list.length; i++)
            {
              if(selected_record_id == g_ui.data_list[i]._id)
              {
                found_index = i;
                break;
              }
            }

            if(found_index > -1)
            {
              var obj = g_ui.data_list[found_index]._rev = response_obj.rev; 

            }
            
          
          }
          //{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
        console.log("autosave sent", response);

    }).fail(function(response) {

      save_queue.push(selected_record_id); 
      console.log("failed:", response);}
    );
      

  }

}

	window.setInterval(save_change_task, 10000);	

function open_print_version(p_section)
{

	var print_window = window.open('./print-version','_print_version',null,false);

	window.setTimeout(function()
	{
		print_window.create_print_version(g_metadata, g_data, p_section)
	}, 1000);	
}


function open_core_summary(p_section)
{

	var print_window = window.open('./core-elements','_core_summary',null,false);

	window.setTimeout(function()
	{
		print_window.create_print_version(g_metadata, g_data, p_section)
	}, 1000);	
}


function open_blank_version(p_section)
{

	var blank_window = window.open('./print-version','_blank_version',null,false);

	window.setTimeout(function()
	{
		blank_window.create_print_version(g_metadata, default_object, p_section)
	}, 1000);	
}

function add_new_form_click(p_metadata_path, p_object_path)
{
  console.log("add_new_form_click: " + p_metadata_path + " , " + p_object_path);
  var metadata = eval(p_metadata_path);
  var form_array = eval(p_object_path);

  var new_form = create_default_object(metadata, {});
  var item = new_form[metadata.name][0];
  form_array.push(item);

  document.getElementById(metadata.name + "_id").innerHTML = page_render(metadata, form_array, g_ui, p_metadata_path, p_object_path, false, 0, 0, 0).join("");

}