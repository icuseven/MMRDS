function remove_js_file(script_name)
{
    var script_list = document.getElementsByTagName("script")
    var url_host =  location.protocol + '//' + location.host;
    var search_text = script_name.replace(url_host, "");
    for (var i = script_list.length; i >= 0; i--)
    {
      if
      (
        script_list[i] &&
        script_list[i].getAttribute("src")!=null &&
        script_list[i].getAttribute("src").indexOf(search_text)!=-1
      )
      {
        script_list[i].parentNode.removeChild(script_list[i]);
        break;
      }
    }
}

function reload_js(script_name, callback)
{
  remove_js_file(script_name);

  var document_head = document.getElementsByTagName("head")[0];
  var dynamic_script = document.createElement("script");
  dynamic_script.type = "text/javascript";
  dynamic_script.src = script_name;
  if(callback)
  {
    dynamic_script.addEventListener("load", callback);interval_id
  }
  document_head.appendChild(dynamic_script);
}


function remove_css_file(sheet_name)
{
    var script_list = document.getElementsByTagName("link")
    var url_host =  location.protocol + '//' + location.host;
    var search_text = sheet_name.replace(url_host, "");
    for (var i = script_list.length; i >= 0; i--)
    {
      if
      (
        script_list[i] &&
        script_list[i].getAttribute("href")!=null &&
        script_list[i].getAttribute("href").indexOf(search_text)!=-1
      )
      {
        script_list[i].parentNode.removeChild(script_list[i]);
        break;
      }
    }
}

function reload_css(sheet_name, callback)
{
  remove_css_file(sheet_name);

  var document_head = document.getElementsByTagName("head")[0];
  var dynamic_link = document.createElement("LINK");
  dynamic_link.rel = "stylesheet";
  dynamic_link.type = "text/css";
  dynamic_link.href = sheet_name;
  if(callback)
  {
    dynamic_link.addEventListener("load", callback);
  }
  document_head.appendChild(dynamic_link);
}


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
        else if(item.metadata=="styles/data-dictionary.css")
        {
          var script_name =  location.protocol + '//' + location.host + '/' + item.metadata;
          reload_css(script_name, function(){
            //document.getElementById('form_content_id').innerHTML = editor_render(g_metadata, "", g_ui).join("");
            return;
          });
        }
        else if
        (
          item.metadata=="scripts/data-dictionary/index.js" || 
          item.metadata=="scripts/data-dictionary/dictionary_renderer.js"  ||
          item.metadata=="scripts/data-dictionary/feedback.js"
          )
        {
          var script_name =  location.protocol + '//' + location.host + '/' + item.metadata;
          reload_js(script_name, function(){
            
            document.getElementById('form_content_id').innerHTML = dictionary_render(g_metadata, "", g_ui).join("");
          });
        }



      }
    }

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

interval_id = window.setInterval(monitor_changes, 1000);
