
var change_detection_map = {};
var interval_ids = null;

function monitor_changes()
{
  var url =  location.protocol + '//' + location.host + "/api/current_edit";

  $.ajax({
    url: url,
    method: 'GET'
  }).done(function(response) {
    // this will be run when the AJAX request succeeds

    var initial_setup = false;

    for(var i = 0; i < response.length; i++)
    {
      var item = response[i];


      if(item.edit_type=="json")
      {

        if(!change_detection_map["json"])
        {
          change_detection_map["json"] = item;
          initial_setup = true;
        }
        else if(change_detection_map["json"].id != item.id)
        {

          change_detection_map["json"] = item;
          console.log('metadata item changed');
          console.log(new Date().toISOString());
          console.log(item);

          /*
          g_metadata = JSON.parse(item.metadata);

          document.getElementById('navigation_id').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");
          document.getElementById('form_content_id').innerHTML = page_render(g_metadata, g_data, g_ui).join("");  
          */

        }
      }
      else if(!change_detection_map[item.metadata])
      {
        change_detection_map[item.metadata] = item;
        initial_setup = true;
      }
      else if(change_detection_map[item.metadata].id != item.id)
      {

        change_detection_map[item.metadata].id = item.id;
        console.log('javascript item changed');
        console.log(new Date().toISOString());
        console.log(item);

        if(item.metadata=="scripts/profile.js")
        {
          var script_name =  location.protocol + '//' + location.host + '/' + item.metadata;
          reload_js(script_name, function(){
            profile.initialize_profile();
          });
        }
        else if(item.metadata=="scripts/editor/navigation_renderer.js")
        {
          var script_name =  location.protocol + '//' + location.host + '/' + item.metadata;
          reload_js(script_name, function(){
            document.getElementById('navigation_id').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");
            window.onhashchange ({ isTrusted: true, newURL : window.location.href });
          });
        }
        else if(item.metadata=="scripts/editor/page_renderer.js")
        {
          var script_name =  location.protocol + '//' + location.host + '/' + item.metadata;
          reload_js(script_name, function(){
            document.getElementById('form_content_id').innerHTML = page_render(g_metadata, g_data, g_ui).join("");
            window.onhashchange ({ isTrusted: true, newURL : window.location.href });
          });
        }
        else if(item.metadata=="scripts/create_default_object.js")
        {
          var script_name =  location.protocol + '//' + location.host + '/' + item.metadata;
          reload_js(script_name, function(){
            g_data = create_default_object(g_metadata, {});
            console.log("behold thine object", g_data);
          });
        }
        else if(item.metadata=="styles/mmria.css")
        {
          var script_name =  location.protocol + '//' + location.host + '/' + item.metadata;
          reload_css(script_name, function(){
            //document.getElementById('form_content_id').innerHTML = editor_render(g_metadata, "", g_ui).join("");
            return;
          });
        }
        else if(item.metadata=="scripts/index.js" || item.metadata=="scripts/editor/preview.js"  || item.metadata=="scripts/editor/index.js")
        {
          var script_name =  location.protocol + '//' + location.host + '/' + item.metadata;
          reload_js(script_name, function(){
            window.onhashchange ({ isTrusted: true, newURL : window.location.href });
          });
        }



      }
    }

/*

[
{"id":"","edit_type":"json","metadata":null},
{"id":"691a8194e2dcb8d0be248381e8a51593","edit_type":"javascript","metadata":"scripts/app.js"},
{"id":"9bfe081c511cd92b2df43f6308f9edff","edit_type":"javascript","metadata":"scripts/data_access.js"},
{"id":"e071abda8fe61194711cfc2ab99fe104","edit_type":"javascript","metadata":"scripts/jquery-3.1.1.min.js"},
{"id":"b5af69f54ad79831b58f541b0525fefa","edit_type":"javascript","metadata":"scripts/profile.js"},
{"id":"1d4375d962ccde7364cef5f9855b85e8","edit_type":"javascript","metadata":"scripts/editor/editor.js"},
{"id":"371139b07850f44fa07b6f3fb2c1378c","edit_type":"javascript","metadata":"scripts/editor/page_renderer.js"},
{"id":"009f6d333c375e15e57bd679b368f639","edit_type":"javascript","metadata":"scripts/editor/teeview.js"},
{"id":"51df4194c5fce9d68ad8a46554d2aab3","edit_type":"javascript","metadata":"scripts/editor/tree_node.js"}
]

*/
    if(initial_setup)
    {
      console.log('initial setup');
      console.log(new Date().toISOString());
      console.log(change_detection_map);
    }

  }).fail(function(response) {

    window.clearInterval(interval_id);
    console.log("failed:", response);}
  );
}

interval_id = window.setInterval(monitor_changes, 10000);
