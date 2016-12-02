'use strict';


//http://www.w3schools.com/css/css3_flexbox.asp

var g_metadata = null;
var g_data = null;
var g_metadata_path = [];
var g_validator_map = [];
var g_validation_description_map = [];
var g_selected_index = null;
var g_selected_delete_index = null;


var default_object = null;

var g_data_access = new Data_Access("http://localhost:5984/mmrds");

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
        else if(metadata.type.toLowerCase() == "boolean")
        {
          eval(p_object_path + ' = ' + value);
        }
        else
        {
          eval(p_object_path + ' = "' + value.replace(/"/g, '\"').replace(/\n/g,"\\n") + '"');
        }

        document.getElementById(p_object_path).innerHTML = page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path).join("");
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
      }
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
      }
      else if(metadata.type.toLowerCase() == "boolean")
      {
        eval(p_object_path + ' = ' + value);
      }
      else
      {
        eval(p_object_path + ' = "' + value.replace(/"/g, '\"').replace(/\n/g,"\\n") + '"');
      }
      
      //document.getElementById(p_object_path).innerHTML = page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path).join("");
      $("#" + p_object_path).replaceWith(page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path).join(""));
    }

    apply_validation();
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
    load_documents();

window.onhashchange = function(e)
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
      var db = new PouchDB('mmrds');
      var selected_record_id = g_data._id;
      if($.isNumeric())
      {
          g_selected_index = parseInt(g_ui.url_state.path_array[0]);
      }
      else //if(g_ui.data_list.length > 0)
      {
        g_selected_index = g_ui.data_list.length - 1;
      }

			db.put(g_data).then(function()
			{
				db.get(selected_record_id).then(function (doc) 
				{
					for(var i = 0; i < g_ui.data_list.length; i++)
          {
            if(g_ui.data_list[i]._id == selected_record_id)
            {
                g_ui.data_list[i]._rev = doc._rev;
                console.log('save finished');
                console.log(doc);
                break;
            }
          }
          
          if(e.isTrusted)
          {

            var new_url = e.newURL || window.location.href;
            g_ui.url_state = url_monitor.get_url_state(new_url);

            if(g_ui.url_state.path_array && g_ui.url_state.path_array.length > 0 && (parseInt(g_ui.url_state.path_array[0]) >= 0))
            {
              g_data = g_ui.data_list[parseInt(g_ui.url_state.path_array[0])];

              document.getElementById('navbar').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");
              document.getElementById('form_content_id').innerHTML = page_render(g_metadata, g_data, g_ui, "g_metadata", "g_data").join("");
              apply_tool_tips();


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
              
              g_data = null;
              document.getElementById('navbar').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");
              document.getElementById('form_content_id').innerHTML = page_render(g_metadata, default_object, g_ui, "g_metadata", "default_object").join("");
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
        });
			});
    
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
      document.getElementById('form_content_id').innerHTML = page_render(g_metadata, g_data, g_ui, "g_metadata", "g_data").join("");
      apply_tool_tips();


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
      
      g_data = null;

      document.getElementById('navbar').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");

      document.getElementById('form_content_id').innerHTML = page_render(g_metadata, default_object, g_ui, "g_metadata", "default_object").join("");
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

	profile.initialize_profile();

	$.ajax({
			url: location.protocol + '//' + location.host + '/api/metadata',
	}).done(function(response) {
			g_metadata = response;
      default_object =  create_default_object(g_metadata, {});
			//g_data = create_default_object(g_metadata, {});

      create_validator_map(g_validator_map, g_validation_description_map, g_metadata, "g_metadata");

      g_ui.url_state = url_monitor.get_url_state(window.location.href);
/*
			document.getElementById('navbar').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");

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

function show_user_administration()
{
  window.open("./_users", "_users");
}


function apply_tool_tips()
{
		$('[data-tooltip]').addClass('tooltip');
		$('.tooltip').each(function() 
    {  
			$(this).append('<span class="tooltip-content">' + $(this).attr('data-tooltip') + '</span>');  
		});

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
    var db = new PouchDB('mmrds');
    g_selected_delete_index = null;
    db.get(g_ui.data_list[p_index]._id).then(function (doc) {
      doc._deleted = true;
      return db.put(doc).then(function(){ load_documents() });
    });
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


function load_documents()
{
  var db = new PouchDB('mmrds');
  db.allDocs(
      {
        include_docs: true,
        attachments: true
      }).then(function (result) 
      {
        console.log(result);
        g_ui.data_list = [];
        for(var i = 0; i < result.rows.length; i++)
        {
          g_ui.data_list.push(result.rows[i].doc);
        }

        document.getElementById('navbar').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");
        document.getElementById('form_content_id').innerHTML = page_render(g_metadata, default_object, g_ui, "g_metadata", "default_object").join("");
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

        //res.json({"users": result.rows});
      }).catch(function (err) 
      {
        console.log(err);
      });
}