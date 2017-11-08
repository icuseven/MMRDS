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
    dynamic_script.addEventListener("load", callback);
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

