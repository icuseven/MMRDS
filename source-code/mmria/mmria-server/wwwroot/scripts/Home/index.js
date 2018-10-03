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

  $.datetimepicker.setLocale('en');


  load_user_role_jurisdiction();
  
  
});


function load_user_role_jurisdiction()
{

  /*            int skip = 0,
            int take = 25,
            string sort = "by_date_created",
            string search_key = null,
            bool descending = false
            */



	$.ajax({
			url: location.protocol + '//' + location.host + '/api/user_role_jurisdiction_view?skip=0&take=25&sort=by_user_id&search_key=' + $mmria.getCookie("uid"),
	}).done(function(response) {

      g_jurisdiction_list = []

      var role_list_html = [];

      role_list_html.push("<p>[ " + $mmria.getCookie("uid") + " ] Your password will expire in X days.</p>");
      role_list_html.push("<table border=1>");
      role_list_html.push("<tr bgcolor='#CCCCCC'><th colspan=7>Role assignment list</th></tr>");
      role_list_html.push("<tr bgcolor='#CCCCCC'>");
      role_list_html.push("<th>Role Name</th>");
      role_list_html.push("<th>Jurisdiction</th>");
      role_list_html.push("<th>Is Active</th>");
      role_list_html.push("<th>Start Date</th>");
      role_list_html.push("<th>End Date</th>");
      role_list_html.push("<th>Days Till<br/>Role Expires</th>");
      role_list_html.push("<th>Jurisdiction<br/>Admin</th>");
      role_list_html.push("</tr>");
      for(var i in response.rows)
      {

          var current_date = new Date();
          var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

          var value = response.rows[i].value;
          if(value.user_id == $mmria.getCookie("uid"))
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
              diffDays = Math.round(Math.abs((new Date(value.effective_end_date).getTime() - current_date.getTime())/(oneDay)));
              
            }

            if(i % 2 == 0)
            {
              role_list_html.push("<tr>");
              
            }
            else
            {
              role_list_html.push("<tr bgcolor='silver'>");
            }
            
            role_list_html.push("<td>" + value.role_name + "</td>");
            role_list_html.push("<td>" + value.jurisdiction_id + "</td>");
            role_list_html.push("<td>" + value.is_active + "</td>");
            role_list_html.push("<td>" + effective_start_date + "</td>");
            role_list_html.push("<td>" + effective_end_date + "</td>");
            role_list_html.push("<td align='right'>" + diffDays + "</td>");
            role_list_html.push("<td>" + value.last_updated_by + "</td>");
            role_list_html.push("</tr>");
          }
          
      }

      role_list_html.push("</table>");
      

      document.getElementById("role_list").innerHTML = role_list_html.join("");
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
      $("#root").removeClass("header");
      get_metadata();
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


      var url = location.protocol + '//' + location.host + '/';
      window.location.href = url;
    };


  	profile.initialize_profile();
}




