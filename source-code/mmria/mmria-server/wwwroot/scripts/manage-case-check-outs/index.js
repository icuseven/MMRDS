var g_user_name = null;
var case_view_list = [];
var case_view_request = {
    total_rows: 0,
    page :1,
    skip : 0,
    take : 100,
    sort : "by_date_created",
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
};



$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';
	/*profile.on_login_call_back = function (){
				load_users();
    };*/
	//profile.initialize_profile();

	loadUser();
	get_case_set();

	// $(document).keydown(function(evt){
	// 	if (evt.keyCode==83 && (evt.ctrlKey)){
	// 		evt.preventDefault();
	// 		//metadata_save();
	// 	}
	// });

	// window.onhashchange = function(e)
	// {
	// 	if(e.isTrusted)
	// 	{
	// 		var new_url = e.newURL || window.location.href;

	// 		g_ui.url_state = url_monitor.get_url_state(new_url);
	// 	}
	// };
});

function loadUser()
{
	$.ajax({
    url: location.protocol + '//' + location.host + '/api/user/my-user',
	}).done(function(response) {
		g_user_name = response.name;
	});
}

function is_case_checked_out(p_case)
{
	let is_checked_out = false;
  // let checked_out_html = '';
  let current_date = new Date();
  
  if(p_case.value.date_last_checked_out != null && p_case.value.date_last_checked_out != "")
  {
		let try_date = null;
		let is_date = false;

		if(!(p_case.value.date_last_checked_out instanceof Date))
		{
				try_date = new Date(p_case.value.date_last_checked_out);
		}
		else
		{
			try_date = p_case.value.date_last_checked_out;
		}
		
		if
		(
				getMinuteDifference(try_date, current_date) <= 120 &&
				p_case.value.last_checked_out_by.toLowerCase() == g_user_name.toLowerCase()
		)
		{
			is_checked_out = true;
		}
	}

  return is_checked_out;
}

function getMinuteDifference(dt1, dt2) 
{
  let diff =(dt2.getTime() - dt1.getTime()) / 1000;

	diff /= 60;
  return Math.abs(Math.round(diff));
}

function convertToReadableTime(millis) {
  var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function get_case_set()
{
	var case_view_url = location.protocol + '//' + location.host + '/api/case_view' + case_view_request.get_query_string();
	var p_time = null;

  $.ajax({
		url: case_view_url,
  }).done(function(case_view_response) {
		//console.log(case_view_response);
    const checkedOutCases = [];
		case_view_request.total_rows = case_view_response.total_rows;

    for(let i = 0; i < case_view_response.rows.length; i++)
    {
			let caseView = case_view_response.rows[i];
			let caseLastUpdated = caseView.value.date_last_checked_out;
			// let isCheckedOut = caseView.value.last_checked_out_by;

			if (is_case_checked_out(caseView))
			{
				checkedOutCases.push(caseView);
			}

			// let case_view = case_view_response.rows[i];

			// if(is_case_checked_out(case_view))
			// {
			// 	case_view_list.push(case_view);
			// }
		}
    
    document.getElementById('output').innerHTML = render_case_list(checkedOutCases).join('');
  });
}


function render_case_list(p_cases, p_time)
{
	const result = [];

	if (p_cases.length === 0)
	{
		result.push(
			`<p>No cases currently checked out</p>`
		);
	}
	else
	{
		result.push(
			`<table class="table">
				<thead class="thead">
					<tr class="tr">
						<th class="th h4 bg-secondary" colspan="6" scope="col">Current checked out cases</th>
					</tr>
				</thead>
				<thead class="thead">
					<tr class="tr">
						<th class="th" scope="col">Case Title</th>
						<th class="th" scope="col">Last Updated</th>
						<th class="th" scope="col">Time Locked</th>
						<th class="th" scope="col">Locked By</th>
						<th class="th" scope="col">Case Status</th>
						<th class="th" scope="col">Actions</th>
					</tr>
				</thead>
				<tbody class="tbody">
					<!-- START loop through checked out cases -->
					${p_cases.map((el, i) => {
						let jurisdictionID = el.value.jurisdiction_id;
						let firstName = el.value.first_name;
						let lastName = el.value.last_name;
						let recordID = el.value.record_id;
						let agencyCaseID = el.value.agency_case_id;

						let lastUpdatedDate = el.value.date_last_updated;
						let lastCheckedOutDate = el.value.date_last_updated;
						lastUpdatedDate = lastUpdatedDate.split('T')[0];
						lastUpdatedDate = lastUpdatedDate.split('-');
						//convert ISO format to MM/DD/YYYY
						lastUpdatedDate = `${lastUpdatedDate[1]}/${lastUpdatedDate[2]}/${lastUpdatedDate[0]}`;

						let timeLocked = Math.abs(new Date(lastCheckedOutDate) - new Date());
						debugger
						timeLocked = convertToReadableTime(timeLocked);
						debugger

						let lockedBy = el.value.last_checked_out_by;
						let caseStatus = ''; //TODO: Need to wire in Case Status

						return (
							`<tr class="tr">
								<td class="td" scope="col">
									${jurisdictionID && `${jurisdictionID}: ` || ''}
									${lastName && lastName || ''}, ${firstName && firstName || ''}
									${recordID && ` - (${recordID})`}
									${agencyCaseID && ` ac_id: ${agencyCaseID}`}
								</td>
								<td class="td" scope="col">${lastUpdatedDate && lastUpdatedDate || ''}</td>
								<td class="td" scope="col">${timeLocked && `${timeLocked} minutes` || ''}</td>
								<td class="td" scope="col">${lockedBy && lockedBy || ''}</td>
								<td class="td" scope="col">${caseStatus && caseStatus || ''}</td>
								<td class="td" scope="col"><button class="anti-btn link" onclick="save_and_finish_click()">Release</button></td>
							</tr>`
						)
					})}
				</tbody>
			</table>`
		);
	}
	
	return result;

}































// function update_item(p_index, p_value)
// {
// 	g_power_bi_user_list.rows[p_index].doc.alternate_email = p_value;


// }

// function server_save(p_index)
// {
// 	return;
// 	let user = g_power_bi_user_list.rows[p_index].doc;

// 	$.ajax({
// 				url: location.protocol + '//' + location.host + '/api/user',
// 				contentType: 'application/json; charset=utf-8',
// 				dataType: 'json',
// 				data: JSON.stringify(user),
// 				type: "POST"
// 		}).done(function(response) 
// 		{

// 			let response_obj = eval(response);
// 			if(response_obj.ok)
// 			{
// 				user._rev = user.rev; 

// 				render();
// 			}
// 		});
		
// }


// function render()
// {
// 	document.getElementById('output').innerHTML = render_case_list().join("");
// }

// function encodeHTML(s) 
// {
// 	let result = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
//     return result;
// }

// function initCaseRease() {
// 	const currentCase = 
// }





// function get_specific_case(p_id)
// {
//   var case_url = location.protocol + '//' + location.host + '/api/case?case_id=' + p_id;

//   $.ajax({
//     url: case_url,
//   }).done(function(case_response) 
//   {
//     if(case_response)
//     {
//       var local_data = get_local_case(p_id);

//       if(local_data)
//       {
//           if(local_data._rev && local_data._rev == case_response._rev)
//           {
//               g_data = local_data;
//               g_data_is_checked_out = is_case_checked_out(g_data);
//           }
//           else
//           {
//             /*
//             console.log( "get_specific_case potential conflict:",  local_data._id, local_data._rev, case_response._rev);
//             var date_difference = local_data.date_last_updated.diff(case_response.date_last_updated);
//             if(date_difference.days > 3)
//             {*/

//               local_data = case_response;
//             /*}
//             else
//             {
//               local_data._rev = case_response._rev;
//             }*/
            
//             set_local_case(local_data);
//             g_data = local_data;
//             g_data_is_checked_out = is_case_checked_out(g_data);
//           }

//           if(g_autosave_interval != null && g_data_is_checked_out == false)
//           {
//             window.clearInterval(g_autosave_interval);
//             g_autosave_interval = null;
//           }

//           g_render();
//       }
//       else
//       {
//         g_data = case_response;
//         g_data_is_checked_out = is_case_checked_out(g_data);

//         if(g_autosave_interval != null && g_data_is_checked_out == false)
//         {
//           window.clearInterval(g_autosave_interval);
//           g_autosave_interval = null;
//         }
//       }
//       g_render();
//     }
//     else
//     {
//       g_render();
//     }
//   })
//   .fail(function(jqXHR, textStatus, errorThrown) {
//     console.log( "get_specific_case:",  textStatus, errorThrown);
//     g_data = get_local_case(p_id);
//     g_data_is_checked_out = is_case_checked_out(g_data);
//   });
// }

// function save_case(p_data, p_call_back)
// {

//   if(p_data.host_state == null || p_data.host_state == "")
//   {
//     p_data.host_state = window.location.host.split("-")[0];
//   }

//   $.ajax({
//     url: location.protocol + '//' + location.host + '/api/case',
//     contentType: 'application/json; charset=utf-8',
//     dataType: 'json',
//     data: JSON.stringify(p_data),
//     type: "POST"
//   }).done(function(case_response) {

//     console.log("save_case: success");

//     g_change_stack = [];

//     if(g_data && g_data._id == case_response.id)
//     {
//       g_data._rev = case_response.rev;
//       g_data_is_checked_out = is_case_checked_out(g_data);
//       set_local_case(g_data);
//       //console.log('set_value save finished');
//     }
    
//     if(p_call_back)
//     {
//       p_call_back();
//     }
//   })
//   .fail
//   (
//     function(xhr, err) 
//     { 
//       console.log("server save_case: failed", err); 
//       if(xhr.status == 401)
//       {
//         let redirect_url = location.protocol + '//' + location.host;
//         window.location = redirect_url;
//       }
  
//     }
//   );
// }

// function save_and_finish_click()
// {
//   g_data.date_last_updated = new Date();
//   g_data.date_last_checked_out = null;
//   g_data.last_checked_out_by = null;
	
// 	save_case(g_data, create_save_message);
	
//   // g_render()
//   // window.clearInterval(g_autosave_interval);
//   // g_autosave_interval = null;
// }

// function get_metadata_value_node_by_mmria_path(p_metadata, p_search_path, p_path)
// {
// 		let result = null;
		
//     switch(p_metadata.type.toLowerCase())
//     {
//         case "app":
//         case "form":
//         case "group":
//         case "grid":
//             for(let i = 0; i < p_metadata.children.length; i++)
//             {
//                 let child = p_metadata.children[i];
//                 result = get_metadata_value_node_by_mmria_path(child, p_search_path, p_path + "/" + child.name);
//                 if(result != null)
//                 {
//                     break;
//                 }
//             }
//             break;
//         default:
//             if(p_search_path == p_path)
//             {
//                 result = p_metadata;
//             }
//             break;
// 		}
		
//     return result;
// }

// if (g_data.home_record.case_status && !isNullOrUndefined(g_data.home_record.case_status.overall_case_status))
// {
// 		let current_value = g_data.home_record.case_status.overall_case_status;
// 		let look_up = get_metadata_value_node_by_mmria_path(g_metadata, "/home_record/case_status/overall_case_status", "");
// 		let label = current_value;
// 		for (let i = 0; i < look_up.values.length; i++)
// 		{
// 				let item = look_up.values[i];
// 				if (item.value == current_value)
// 				{
// 						label = item.display;
// 						break;
// 				}
// 		}

// 		p_result.push(`<p class='construct__info mb-0'>Case Status: <span>${label}</span></p>`);
// }