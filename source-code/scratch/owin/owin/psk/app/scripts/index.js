'use strict';

//http://www.w3schools.com/css/css3_flexbox.asp

var g_metadata = null;
var g_data = null;

var g_ui = {
  url_state: {
    selected_form_name: null,
    "selected_id": null,
    "selected_child_id": null,
    "path_array" : []
  },
  data_list : [],
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


    var url = location.protocol + '//' + location.host + '#/' + result._id + '/home_record';
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
    g_ui.url_state = url_monitor.get_url_state(e.newURL);

    document.getElementById('navigation_id').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");

    document.getElementById('form_content_id').innerHTML = page_render(g_metadata, g_data, g_ui).join("");


    if(g_ui.url_state.path_array && g_ui.url_state.path_array.length > 0 && $$.is_id(g_ui.url_state.path_array[0]))
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
			url: location.protocol + '//' + location.host + '/meta-data/01/home_record.json',
			data: {foo: 'bar'}
	}).done(function(response) {
			g_metadata = response;
			g_data = create_default_object(g_metadata, {});

      g_ui.url_state = url_monitor.get_url_state(window.location.href);

			document.getElementById('navigation_id').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");

			document.getElementById('form_content_id').innerHTML = page_render(g_metadata, g_data, g_ui).join("");

      window.onhashchange ({ isTrusted: true, newURL : window.location.href });

	});
});
