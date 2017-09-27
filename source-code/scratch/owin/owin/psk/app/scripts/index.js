'use strict';


//http://www.w3schools.com/css/css3_flexbox.asp

var g_metadata = null;
var g_data = null;
var g_source_db = null;
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
    if(g_source_db=="de_id")
    {
      return;
    }

  var current_value = eval(p_object_path);
  //if(current_value != value)
  //{
    if(g_validator_map[p_metadata_path])
    {
      if(g_validator_map[p_metadata_path](value))
      {
        var metadata = eval(p_metadata_path);

        if(metadata.type.toLowerCase() == "boolean")
        {
          eval(p_object_path + ' = ' + value);
        }
        else
        {
          eval(p_object_path + ' = "' + value.replace(/"/g, '\\"').replace(/\n/g,"\\n") + '"');
        }
        g_data.date_last_updated = new Date();
        g_data.last_updated_by = profile.user_name;
		
    var post_html_call_back = [];
		document.getElementById(convert_object_path_to_jquery_id(p_object_path)).innerHTML = page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path, "", false, post_html_call_back).join("");
    if(post_html_call_back.length > 0)
    {
      eval(post_html_call_back.join(""));
    }

    if(g_ui.broken_rules[p_object_path])
    {
      g_ui.broken_rules[p_object_path] = false;
    } 

    
/*
	  var db = new PouchDB(g_source_db);
      db.put(g_data).then(function (doc)
      {
          if(g_data && g_data._id == doc.id)
          {
            g_data._rev = doc.rev;
            console.log('set_value save finished');
          }
          else for(var i = 0; i < g_ui.data_list.length; i++)
          {
            if(g_ui.data_list[i]._id == doc.id)
            {
                g_ui.data_list[i]._rev = doc.rev;
                console.log('set_value save finished');
                //console.log(doc);
                break;
            }
          }
      }).catch(function (err) {
  console.log(err);
});*/
		

      }
      else
      {
        g_ui.broken_rules[p_object_path] = true;
        //console.log("didn't pass validation");

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
      else if(metadata.type.toLowerCase() == "boolean")
      {
        eval(p_object_path + ' = ' + value);
      }
      else
      {
        eval(p_object_path + ' = "' + value.replace(/"/g, '\\"').replace(/\n/g,"\\n") + '"');
      }
      g_data.date_last_updated = new Date();
      g_data.last_updated_by = profile.user_name;

      var post_html_call_back = [];
      var new_html = page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path, "", false, post_html_call_back).join("");
      $("#" + convert_object_path_to_jquery_id(p_object_path)).replaceWith(new_html);

      switch(metadata.type.toLowerCase())
      {
        case 'time':

          $("#" + convert_object_path_to_jquery_id(p_object_path) + " .time" ).datetimepicker({ format: 'LT' });
          break;
          case 'date':
          flatpickr("#" + convert_object_path_to_jquery_id(p_object_path) + " .date", {
            utc: true,
            enableTime: false,
            defaultDate: value,
            onChange: function(selectedDates, p_value, instance) {
                g_set_data_object_from_path(p_object_path, p_metadata_path, p_value);
            }
          });

          break;

          case 'datetime':
            $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.datetime").datetimepicker({
                 format:"Y-MM-D H:mm:ss",  
				        defaultDate: value });
          break;

          case 'number':

              //$("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number").numeric();

              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number").numeric();
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number0").numeric({ decimal: false });
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number1").numeric({ decimalPlaces: 1 });
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number2").numeric({  decimalPlaces: 2 });
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number3").numeric({  decimalPlaces: 3 });
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number4").numeric({  decimalPlaces: 4 });
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number5").numeric({  decimalPlaces: 5 });
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number").attr("size", "15");
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number0").attr("size", "15");
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number1").attr("size", "15");
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number2").attr("size", "15");
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number3").attr("size", "15");
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number4").attr("size", "15");
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number5").attr("size", "15");

              /*
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number").TouchSpin({
                              verticalbuttons: true,
                              decimals: 3,
                              min: 0,
                              max: 10000,
                              step: 1,
                              maxboostedstep: 10
                          });*/

              //$("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number").attr("size", "15");
          break;
      }


      if(post_html_call_back.length > 0)
      {
        eval(post_html_call_back.join(""));
      }
      
      
      /*
	  var db = new PouchDB(g_source_db);
      db.put(g_data).then(function (doc)
      {
          if(g_data && g_data._id == doc.id)
          {
            g_data._rev = doc.rev;
            console.log('set_value save finished');
          }
          else for(var i = 0; i < g_ui.data_list.length; i++)
          {
            if(g_ui.data_list[i]._id == doc.id)
            {
                g_ui.data_list[i]._rev = doc.rev;
                console.log('set_value save finished');
                //console.log(doc);
                break;
            }
          }
          
      }).catch(function (err) {
  console.log(err);
});*/
	  
    }

    apply_validation();
  //}
}

function g_add_grid_item(p_object_path, p_metadata_path)
{
  var metadata = eval(p_metadata_path);
  var new_line_item = create_default_object(metadata, {});
  eval(p_object_path).push(new_line_item[metadata.name][0]);

  var post_html_call_back = [];
  document.getElementById(p_metadata_path).innerHTML = page_render(metadata, eval(p_object_path), g_ui, p_metadata_path, p_object_path, "", false, post_html_call_back).join("");
  apply_tool_tips();
  if(post_html_call_back.length > 0)
  {
    eval(post_html_call_back.join(""));
  }
}

function g_delete_grid_item(p_object_path, p_metadata_path)
{
  var metadata = eval(p_metadata_path);
  var index = p_object_path.match(new RegExp("\\[\\d+\\]$"))[0].replace("[","").replace("]","");
  var object_string = p_object_path.replace(new RegExp("(\\[\\d+\\]$)"), "");
  eval(object_string).splice(index, 1);

  var post_html_call_back = [];
  document.getElementById(p_metadata_path).innerHTML = page_render(metadata, eval(object_string), g_ui, p_metadata_path, object_string, "", false, post_html_call_back).join("");
  if(post_html_call_back.length > 0)
  {
    eval(post_html_call_back.join(""));
  }
}

function g_delete_record_item(p_object_path, p_metadata_path)
{
  var metadata = eval(p_metadata_path);
  var index = p_object_path.match(new RegExp("\\[\\d+\\]$"))[0].replace("[","").replace("]","");
  var object_string = p_object_path.replace(new RegExp("(\\[\\d+\\]$)"), "");
  eval(object_string).splice(index, 1);

  var post_html_call_back = [];
  document.getElementById(metadata.name + "_id").innerHTML = page_render(metadata, eval(object_string), g_ui, p_metadata_path, object_string, "", false, post_html_call_back).join("");
  if(post_html_call_back.length > 0)
  {
    eval(post_html_call_back.join(""));
  }
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

    result.date_created = new Date();
    result.created_by = profile.user_name;
    result.date_last_updated = new Date();
    result.last_updated_by = profile.user_name;

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
  },
  case_view_list : [],
   case_view_request : {
    total_rows: 0,
    page :1,
    skip : 0,
    take : 25,
    sort : "by_date_last_updated",
    search_key : null,
    descending : true,
    get_query_string : function(){
      var result = [];
      result.push("?skip=" + (this.page - 1) * this.take);
      result.push("take=" + this.take);
      result.push("sort=" + this.sort);
  
      if(this.search_key)
      {
        result.push("search_key=\"" + this.search_key.replace(/"/g, '\\"').replace(/\n/g,"\\n") + "\"");
      }
  
      result.push("descending=" + this.descending);
  
      return result.join("&");
    }
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
  $.datetimepicker.setLocale('en');

  load_values();




});

function load_values()
{
	$.ajax({
			url: location.protocol + '//' + location.host + '/api/values',
	}).done(function(response) {
			g_couchdb_url = response.couchdb_url;
      load_profile();

 

	});

}


function load_profile()
{
    profile.on_login_call_back = function ()
    {
      $("#landing_page").hide();
      $("#logout_page").hide();
      $("#footer").hide();
      get_metadata();
      if
      (
          g_source_db == "mmrds" &&
          profile.user_roles && profile.user_roles.length > 0 &&
          profile.user_roles.indexOf("_admin") < 0
      )
      {
        window.setInterval(profile.update_session_timer, 120000);
      }
    };

    profile.on_logout_call_back = function (p_user_name, p_password)
    {
      $("#landing_page").show();
      $("#footer").show();
      if
      (
          profile.user_roles && profile.user_roles.length > 0 && 
          profile.user_roles.indexOf("_admin") < 0 &&
          profile.user_roles.indexOf("committee_member") < 0
      )
      {
        //replicate_db_and_log_out(p_user_name, p_password);
      }

       document.getElementById('navbar').innerHTML = "";
      document.getElementById('form_content_id').innerHTML ="";
    };


  	profile.initialize_profile();
}



function get_case_set()
{

  var case_view_url = location.protocol + '//' + location.host + '/api/case_view' + g_ui.case_view_request.get_query_string();
  $.ajax({
    url: case_view_url,
}).done(function(case_view_response) {
    

    //console.log(case_view_response);
    g_ui.case_view_list = [];
    g_ui.case_view_request.total_rows = case_view_response.total_rows;

    for(var i = 0; i < case_view_response.rows.length; i++)
    {
        g_ui.case_view_list.push(case_view_response.rows[i]);
    }

    var post_html_call_back = [];
    document.getElementById('navbar').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");
    document.getElementById('form_content_id').innerHTML ="<h4>Fetching data from database.</h4><h5>Please wait a few moments...</h5>";


    document.getElementById('form_content_id').innerHTML = page_render(g_metadata, default_object, g_ui, "g_metadata", "default_object", "", false, post_html_call_back).join("");
    if(post_html_call_back.length > 0)
    {
      eval(post_html_call_back.join(""));
    }

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
        
          section.style.display = "block";
          //section.style["grid-template-columns"] = "1fr 1fr 1fr";
        
      }
    }
    

});


}


function get_metadata()
{
  document.getElementById('form_content_id').innerHTML ="<h4>Fetching data from database.</h4><h5>Please wait a few moments...</h5>";

  	$.ajax({
			url: location.protocol + '//' + location.host + '/api/metadata',
	}).done(function(response) {
			g_metadata = response;
      metadata_summary(g_metadata_summary, g_metadata, "g_metadata", 0, 0);
      default_object =  create_default_object(g_metadata, {});

      //create_validator_map(g_validator_map, g_validation_description_map, g_metadata, "g_metadata");

      //window.location.href = location.protocol + '//' + location.host;
      
      if(profile.user_roles && profile.user_roles.length > 0 && profile.user_roles.indexOf("_admin") < 0)
      {
        get_case_set();
      }
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
    
        if(e.isTrusted)
        {

          var new_url = e.newURL || window.location.href;
          g_ui.url_state = url_monitor.get_url_state(new_url);

          if(g_ui.url_state.path_array && g_ui.url_state.path_array.length > 0 && (parseInt(g_ui.url_state.path_array[0]) >= 0))
          {
            /*
            if(g_data._id != g_ui.data_list[parseInt(g_ui.url_state.path_array[0])]._id)
            {
                save_queue.push(g_data._id);
            }*/
            save_case(g_data);

            get_specific_case(g_ui.case_view_list[parseInt(g_ui.url_state.path_array[0])].id);
            //g_data = g_ui.data_list[parseInt(g_ui.url_state.path_array[0])];

           // g_render();
            

          }
          else
          {
            /*
            if(g_data && !(save_queue.indexOf(g_data._id) > -1))
            {
              save_queue.push(g_data._id);
            }*/
            save_case(g_data);
            g_data = null;
            g_render();
            
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
      if(g_ui.case_view_list.length > 0)
      {
        get_specific_case(g_ui.case_view_list[parseInt(g_ui.url_state.path_array[0])].id); 
              //g_data = g_ui.data_list[parseInt(g_ui.url_state.path_array[0])];
      }
      else
      {
        g_render();
      }
           //      
		}
    else
    {
/*
      if(g_data && !(save_queue.indexOf(g_data._id) > -1))
      {
        save_queue.push(g_data._id);
      }*/
      //save_case(g_data);
      //g_data = null;

      g_render();

    }

  }
  else
  {
    // do nothing for now
  }


};


function get_specific_case(p_id)
{

  $.ajax({
    url: location.protocol + '//' + location.host + '/api/case?case_id=' + p_id,
}).done(function(case_response) {

    g_data = case_response;
    g_render();
});

}

function save_case(p_data)
{

  $.ajax({
    url: location.protocol + '//' + location.host + '/api/case',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: JSON.stringify(p_data),
    type: "POST",
    beforeSend: function (request)
    {
      request.setRequestHeader("AuthSession", profile.get_auth_session_cookie()
    );
    }
}).done(function(case_response) {

    console.log("save_case: success");
    if(g_data && g_data._id == case_response.id)
    {
      g_data._rev = case_response.rev;
      //console.log('set_value save finished');
    }

}).fail(function(xhr, err) { console.log("save_case: failed", err); });

}


function delete_case(p_id, p_rev)
{

  $.ajax({
    url: location.protocol + '//' + location.host + '/api/case?case_id=' + p_id + '&rev=' + p_rev,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    //data: JSON.stringify(p_data),
    type: "DELETE",
    beforeSend: function (request)
    {
      request.setRequestHeader("AuthSession", profile.get_auth_session_cookie()
    );
    }
}).done(function(case_response) {

    console.log("delete_case: success");
    get_case_set();

}).fail(function(xhr, err) { console.log("delete_case: failed", err); });

}



function g_render()
{

  var post_html_call_back = [];

  document.getElementById('navbar').innerHTML = navigation_render(g_metadata, 0, g_ui).join("");
  document.getElementById('form_content_id').innerHTML = page_render(g_metadata, g_data, g_ui, "g_metadata", "g_data", "", false, post_html_call_back).join("");

  apply_tool_tips();

  if(post_html_call_back.length > 0)
  {
    try
    {
      eval(post_html_call_back.join(""));
    }
    catch(ex)
    {
      console.log(ex);
    }
  }

  var section_list = document.getElementsByTagName("section");

  if(g_ui.url_state.path_array[0] == "summary")
  {
    for(var i = 0; i < section_list.length; i++)
    {
      var section = section_list[i];

      if(section.id == "app_summary")
      {
        section.style.display = "block";
        //section.style.display = "grid";
        //section.style["grid-template-columns"] = "1fr 1fr 1fr";
      }
      else
      {
          section.style.display = "none";
      }
    }
  }
  else
  {
    if(g_ui.url_state.path_array.length > 2 && (parseInt(g_ui.url_state.path_array[0]) >= 0))
    {
      for(var i = 0; i < section_list.length; i++)
      {
        var section = section_list[i];
        if(section.id == g_ui.url_state.path_array[1])
        {
          section.style.display = "block";
          //section.style.display = "grid";
          //section.style["grid-template-columns"] = "1fr 1fr 1fr";
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
          //section.style.display = "grid";
          //section.style["grid-template-columns"] = "1fr 1fr 1fr";
        }
        else
        {
            section.style.display = "none";
        }
      }
    }
  }
}



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
  $( ".time" ).datetimepicker({ format: 'LT' });
//$( "[metadata_type='date']" ).datetimepicker();
/*
flatpickr(" .date", {
	utc: true,
	//defaultDate: "2016-12-27T00:00:00.000Z",
	enableTime: false,
  onSelect: function(p_value,evnt) 
  {
                g_set_data_object_from_path(p_object_path, p_metadata_path, p_value);
  }
});*/

//$( ".datetime" ).datetimepicker();


$("input.number").numeric();
$("input.number0").numeric({ decimal: false });
$("input.number1").numeric({ decimalPlaces: 1 });
$("input.number2").numeric({  decimalPlaces: 2 });
$("input.number3").numeric({ decimalPlaces: 3 });
$("input.number4").numeric({ decimalPlaces: 4 });
$("input.number5").numeric({ decimalPlaces: 5 });
$("input.number").attr("size", "15");
$("input.number0").attr("size", "15");
$("input.number1").attr("size", "15");
$("input.number2").attr("size", "15");
$("input.number3").attr("size", "15");
$("input.number4").attr("size", "15");
$("input.number5").attr("size", "15");


/*
$("input.number").TouchSpin({
                verticalbuttons: true,
				decimals: 3,
                min: 0,
                max: 10000,
                step: 1,
                maxboostedstep: 10
            });*/

//$("input.number").mask("#,##0[.00", {reverse: true});

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
    var data = g_ui.case_view_list[p_index];
    g_selected_delete_index = null;
 
    $.ajax({
      url: location.protocol + '//' + location.host + '/api/case?case_id=' + data.id,
  }).done(function(case_response) {
  
      delete_case(case_response._id, case_response._rev);

  });

  }
  else
  {
      if(g_selected_delete_index != null && g_selected_delete_index > -1)
      {
          var old_id = g_ui.case_view_list[g_selected_delete_index].id;
          $("tr[path='" + old_id + "']").css("background", "");
      }

      g_selected_delete_index = p_index;
      var id = g_ui.case_view_list[p_index].id;
      $("tr[path='" + id + "']").css("background", "#BBBBBB");
      
  }
}




var save_interval_id = null;
var save_queue = [];

	

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


function open_aggregate_report_version(p_section)
{

	var report_window = window.open('./aggregate-report','_aggregate_report',null,false);

	window.setTimeout(function()
	{
		report_window.load_data(profile.user_name, profile.password)
	}, 1000);	
}


function open_export_queue()
{

	var export_queue_window = window.open('./export-queue','_export_queue',null,false);

	window.setTimeout(function()
	{
		export_queue_window.load_data(profile.user_name, profile.password)
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

  var post_html_call_back = [];
  document.getElementById(metadata.name + "_id").innerHTML = page_render(metadata, form_array, g_ui, p_metadata_path, p_object_path, "", false, post_html_call_back).join("");
  if(post_html_call_back.length > 0)
  {
    eval(post_html_call_back.join(""));
  }
}


