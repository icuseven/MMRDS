'use strict';

var g_message_data = {};
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

(async function() {

	window.onload = main;
})()


async function main()
{
    await init_broadcast_messages();
}

async function init_broadcast_messages()
{
    const get_data_response = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/broadcast-message/GetBroadcastMessageList`
    });
    render_broadcast_message(get_data_response.message_one, "broadcast_published_message_one");
    render_broadcast_message(get_data_response.message_two, "broadcast_published_message_two");
    //console.log('hahahah');
}

function render_broadcast_message(p_message, p_message_container_id)
{
    const broadcast_message_container = document.getElementById(p_message_container_id);
    if(p_message.publish_status == 1)
        broadcast_message_container.innerHTML = render_published_version(p_message);
}

function render_published_version(message)
{
    var publishedAlertTypeStyling = [];
    if (message.published.type == "information")
        publishedAlertTypeStyling = ["alert-info", "cdc-icon-alert_01", "btn-info"]
    else if (message.published.type == "warning")
        publishedAlertTypeStyling = ["alert-warning", "cdc-icon-alert_02", "btn-warning"]
    else
        publishedAlertTypeStyling = ["alert-danger", "cdc-icon-close-circle", "btn-danger"]    
    return `
        <div class="alert ${publishedAlertTypeStyling[0]} col-md-12" id="alert_unique_16262b641c316a">
        <div class="row d-flex padding-pagealert align-items-center">
            <div class="flex-grow-0 col">
                <span class="fi ${publishedAlertTypeStyling[1]} " aria-hidden="true"></span>                        
            </div>
            <div class="col">
                <p class="margin-pagealert">
                ${message.published.title}
                </p>		
            </div>
            ${message.published.body.length > 0 ? `<div class="col flex-grow-0"><input class="btn ${publishedAlertTypeStyling[2]}" type="button" onclick="broadcast_message_detail_button_click('${message.published.type}','${message.published.body.replace("'","\\'").replace("\n", "<br/>")}')" value="Details" /></div>` : ``}
        </div>
    `;
}

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

function broadcast_message_detail_button_click(p_message_type, p_message_body) 
{
    //var p_capitalized_message_type = p_message_type.charAt(0).toUpperCase() + p_message_type.slice(1);
    $mmria.info_dialog_show("System Message", "", p_message_body, p_message_type);
}

function load_user_role_jurisdiction()
{

  /*            
  int skip = 0,
  int take = 25,
  string sort = "by_date_created",
  string search_key = null,
  bool descending = false
  */

	$.ajax({
    url: location.protocol + '//' + location.host + '/api/user_role_jurisdiction_view/my-roles',//&search_key=' + g_uid,
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
      role_list_html.push("<th class='th h4' colspan='7' scope='colgroup'>Role assignment list</th>");
      role_list_html.push("</tr>");
      role_list_html.push("</thead>");
      role_list_html.push("<thead class='thead'>");
      role_list_html.push("<tr class='tr'>");
      role_list_html.push("<th class='th' scope='col'>Role Name</th>");
      role_list_html.push("<th class='th' scope='col'>Case Folder Access</th>");
      role_list_html.push("<th class='th' scope='col'>Is Active</th>");
      role_list_html.push("<th class='th' scope='col'>Start Date</th>");
      role_list_html.push("<th class='th' scope='col'>End Date</th>");
      role_list_html.push("<th class='th' scope='col'>Days until<br/>Role Expires</th>");
      role_list_html.push("<th class='th' scope='col'>Role Added By</th>");
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
            //if(value.user_id == g_uid)
            //{
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
                if(value.jurisdiction_id == "/")
                {
                    role_list_html.push("<td class='td'>Top Folder</td>");
                }
                else
                {
                    role_list_html.push("<td class='td'>" + escape(value.jurisdiction_id) + "</td>");
                }
                
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
            //}
          }
            
        }
      
      role_list_html.push("</tbody>");
    role_list_html.push("</table>");
    
    document.getElementById("role_list").innerHTML = role_list_html.join("");

	});
}



function open_blank_version(p_section)
{
	var blank_window = window.open('./print-version','_blank_version',null,false);

	window.setTimeout(function()
	{
		blank_window.create_print_version(g_metadata, default_object, p_section)
	}, 1000);	
}

/*

confirm-dialog-id

confirm_dialog_show
(
    p_title, 
    p_header, 
    p_inner_html, 
    p_confirm_dialog_confirm_callback, 
    p_confirm_dialog_cancel_callback
)


http://www.erase-mm-cvsproject.org/
https://reviewtoaction.org/tools/resource-center
https://cdcpartners.sharepoint.com/sites/NCCDPHP/MMRIA


Exit Notification / Disclaimer Policy


Links with this icon  indicate that you are leaving the CDC website.


The Centers for Disease Control and Prevention (CDC) cannot attest to the accuracy of a non-federal website.
Linking to a non-federal website does not constitute an endorsement by CDC or any of its employees of the sponsors or the information and products presented on the website.
You will be subject to the destination website's privacy policy when you follow the link.
CDC is not responsible for Section 508 compliance (accessibility) on other federal or private website.

For more information on CDC's web notification policies, see Website Disclaimers.


*/

async function erase_mm_link_click()
{
    function cancel()
    {
        $mmria.confirm_external_nav_dialog_confirm_close();
    }

    function confirm()
    {
        $mmria.confirm_external_nav_dialog_confirm_close();
        window.open
        (
            "https://www.erase-mm-cvsproject.org", 
            "_blank"
        );
    }

    $mmria.confirm_external_nav_dialog_show
    (
        confirm, 
        cancel
    )
}

async function review_to_action_link_click()
{
    function cancel()
    {
        $mmria.confirm_external_nav_dialog_confirm_close();
    }

    function confirm()
    {
        $mmria.confirm_external_nav_dialog_confirm_close();
        window.open
        (
            "https://reviewtoaction.org/tools/resource-center", 
            "_blank"
        );
    }

    $mmria.confirm_external_nav_dialog_show
    (
        confirm, 
        cancel
    )
}

async function system_documentation_link_click()
{
    function cancel()
    {
        $mmria.confirm_external_nav_dialog_confirm_close();
    }

    function confirm()
    {
        $mmria.confirm_external_nav_dialog_confirm_close();
        window.open
        (
            "https://cdcpartners.sharepoint.com/sites/NCCDPHP/MMRIA", 
            "_blank"
        );
    }

    $mmria.confirm_external_nav_dialog_show
    (
        confirm, 
        cancel
    )
}