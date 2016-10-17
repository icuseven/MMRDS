'use strict';

//http://www.w3schools.com/css/css3_flexbox.asp

var g_metadata = null;
var g_data = null;
var g_ui = {};
var $$ = {


 is_id: function(value){
   // 2016-06-12T13:49:24.759Z
    var test = value.match(new RegExp("^\d+-\d+-\d+T\d+:\d+:\d+.\d+Z$"));
    return (test)? true : false;
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
    var url_state = url_monitor.get_url_state(e.newURL);

    if($$.is_id(url_state.path_array[0]))
    {
      /*
      selected_form_name: form,
      "selected_id": selected_id,
      "selected_child_id": selected_child_id*/
  		var section_list = document.getElementsByTagName("section");
  		for(var i = 0; i < section_list.length; i++)
  		{
  			var section = section_list[i];
  			if(section.id == url_state.path_array[1] + "_id")
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



			document.getElementById('navigation_id').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");

			document.getElementById('form_content_id').innerHTML = page_render(g_metadata, g_data, g_ui).join("");

      window.onhashchange ({ isTrusted: true, newURL : window.location.href });

	});
});
