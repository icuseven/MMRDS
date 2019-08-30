'use strict';

var g_jurisdiction_list = [];
var g_metadata = null;
var default_object = null;

$(function ()
{
	$(document).keydown(function(evt){
		if (evt.keyCode==90 && (evt.ctrlKey)){
			evt.preventDefault();
			undo_click();
		}

	});

  //set_session_warning_interval();
  //$.datetimepicker.setLocale('en');
  get_metadata();
});

function get_metadata()
{
  $.ajax({
		url: location.protocol + '//' + location.host + '/api/metadata',
	}).done(function(response) {
    g_metadata = response;
    default_object =  create_default_object(g_metadata, {});
    load_user_role_jurisdiction();
	});
}

function load_user_role_jurisdiction()
{

  /*            int skip = 0,
            int take = 25,
            string sort = "by_date_created",
            string search_key = null,
            bool descending = false
            */



	$.ajax({
      url: location.protocol + '//' + location.host + '/api/user_role_jurisdiction_view?skip=0&take=25&sort=by_user_id&search_key=' + g_uid,
      headers: {          
        Accept: "text/plain; charset=utf-8",         
        "Content-Type": "text/plain; charset=utf-8"   
      } 
	}).done(function(response) {

      g_jurisdiction_list = []

      var role_list_html = [];

      //role_list_html.push("<p>[ " + g_uid + " ] ");
      role_list_html.push("<p>");
        if(g_sams_is_enabled.toLowerCase() != "true" && g_config_days_before_expires > 0)
        {
          if(g_days_til_expires >= 0)
          {
            role_list_html.push("Your password will expire in " + g_days_til_expires + " day(s).");
          }
          else
          {
            role_list_html.push("Your password expired " + (-1 * g_days_til_expires) + " day(s) ago.");
          }
        }
      role_list_html.push("</p>");
      role_list_html.push("<table class='table'>");
        role_list_html.push("<thead class='thead'>");
        role_list_html.push("<tr class='tr bg-tertiary'>");
        role_list_html.push("<th class='th h4' colspan='7'>Role assignment list for " + g_uid + "</th>");
        role_list_html.push("</tr>");
        role_list_html.push("</thead>");
        role_list_html.push("<thead class='thead'>");
        role_list_html.push("<tr class='tr'>");
        role_list_html.push("<th class='th'>Role Name</th>");
        role_list_html.push("<th class='th'>Jurisdiction</th>");
        role_list_html.push("<th class='th'>Is Active</th>");
        role_list_html.push("<th class='th'>Start Date</th>");
        role_list_html.push("<th class='th'>End Date</th>");
        role_list_html.push("<th class='th'>Days Till<br/>Role Expires</th>");
        role_list_html.push("<th class='th'>Jurisdiction<br/>Admin</th>");
        role_list_html.push("</tr>");
        role_list_html.push("</thead>");
        
        role_list_html.push("<tbody class='tbody'>");
          if(response)
          {
            for(var i in response.rows)
            {

              var current_date = new Date();
              var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

              var value = response.rows[i].value;
              if(value.user_id == g_uid)
              {
                g_jurisdiction_list.push(value);

                var diffDays = 0;

                var effective_start_date = "";
                var effective_end_date = "never";

                if(value.effective_start_date && value.effective_start_date != "")
                {
                  effective_start_date = value.effective_start_date.split('T')[0];
                }

                if(value.effective_end_date && value.effective_end_date != "")
                {
                  effective_end_date = value.effective_end_date.split('T')[0];
                  diffDays = Math.round((new Date(value.effective_end_date).getTime() - current_date.getTime())/(oneDay));
                  
                }

                if(i % 2 == 0)
                {
                  role_list_html.push("<tr class='tr'>");
                  
                }
                else
                {
                  role_list_html.push("<tr class='tr'>");
                }
                
                role_list_html.push("<td class='td'>" + escape(value.role_name) + "</td>");
                role_list_html.push("<td class='td'>" + escape(value.jurisdiction_id) + "</td>");
                if(diffDays < 0)
                {
                  role_list_html.push("<td class='td'>false</td>");
                }
                else
                {
                  role_list_html.push("<td class='td'>" + escape(value.is_active) + "</td>");
                }
                
                role_list_html.push("<td class='td'>" + escape(effective_start_date) + "</td>");
                role_list_html.push("<td class='td'>" + escape(effective_end_date) + "</td>");
                role_list_html.push("<td class='td'>" + diffDays + "</td>");
                role_list_html.push("<td class='td'>" + escape(value.last_updated_by) + "</td>");
                role_list_html.push("</tr>");
              }
            }
              
          }
        
        role_list_html.push("</tbody>");
      role_list_html.push("</table>");
      
      document.getElementById("role_list").innerHTML = role_list_html.join("");
      //load_profile();
	});

}

function load_profile()
{
    /*
    profile.on_login_call_back = function ()
    {
      $("#landing_page").hide();
      $("#logout_page").hide();
      $("#footer").hide();
      $("#root").removeClass("header");
    };

    profile.on_logout_call_back = function (p_user_name, p_password)
    {
      if(update_session_timer_interval_id != null)
      {
        window.clearInterval(update_session_timer_interval_id);
        update_session_timer_interval_id = null;
      }

      //$("#landing_page").show();
      $("#root").addClass("header");
      $("#footer").show();

      document.getElementById('navbar').innerHTML = "";
      document.getElementById('form_content_id').innerHTML ="";


      var url = location.protocol + '//' + location.host + '/';
      window.location.href = url;
    };

    
  	profile.initialize_profile();*/
}

function open_blank_version(p_section)
{

	var blank_window = window.open('./print-version','_blank_version',null,false);

	window.setTimeout(function()
	{
		blank_window.create_print_version(g_metadata, default_object, p_section)
	}, 1000);	
}
