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
				diff_minutes(try_date, current_date) <= 120 &&
				p_case.value.last_checked_out_by.toLowerCase() == g_user_name.toLowerCase()
		)
		{
			is_checked_out = true;
		}
	}

  return is_checked_out;
}

function diff_minutes(dt1, dt2) 
{
  let diff =(dt2.getTime() - dt1.getTime()) / 1000;

  diff /= 60;
  return Math.abs(Math.round(diff));
}

function get_case_set()
{
  var case_view_url = location.protocol + '//' + location.host + '/api/case_view' + case_view_request.get_query_string();
  $.ajax({
		url: case_view_url,
  }).done(function(case_view_response) {
		//console.log(case_view_response);
    const checkedOutCases = [];
		case_view_request.total_rows = case_view_response.total_rows;

    for(let i = 0; i < case_view_response.rows.length; i++)
    {
			let caseView = case_view_response.rows[i];
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


function render_case_list(p_cases)
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
						let lastUpdatedDate = el.value.date_last_updated;
						let timeLocked = el.value.date_last_checked_out;
						let lockedBy = el.value.last_checked_out_by;
						let caseStatus = ''; //TODO: Need to wire in Case Status

						return (
							`<tr class="tr">
								<td class="td" scope="col">
									${jurisdictionID && jurisdictionID || ''}
									${lastName && lastName || ''}
									${firstName && firstName || ''}
								</td>
								<td class="td" scope="col">${lastUpdatedDate && lastUpdatedDate || ''}</td>
								<td class="td" scope="col">${timeLocked && timeLocked || ''}</td>
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

	// result.push("<br/>");
	// result.push("<table>");
	// result.push("<tr  bgcolor='silver'>")
	// result.push("<th scope='col'>user name</th>");
	// result.push("<th scope='col'>check out date</th>");
	// result.push("<th scope='col'>action</th>");
	// result.push("</tr>");

	//result.push("<tr><td colspan=2 align=center><input type='button' value='save list' onclick='server_save()' /></td></tr>")

	
	// for(let i = 0; i < g_power_bi_user_list.rows.length; i++)
	// {
	// 	var item = g_power_bi_user_list.rows[i].doc;

	// 	if(i % 2)
	// 	{
	// 		result.push("<tr bgcolor='#CCCCCC'>");
	// 	}
	// 	else
	// 	{
	// 		result.push("<tr>");
	// 	}
	// 	result.push("<td>");
	// 	result.push(encodeHTML(item.name));
	// 	result.push("</td>");
	// 	result.push("<td><label title='");
	// 	if(item.alternate_email != null)
	// 	{
	// 		result.push(encodeHTML(item.alternate_email));
	// 	}
	// 	result.push("'><input size='120' type='text' value='");
	// 	if(item.alternate_email != null)
	// 	{
	// 		result.push(escape(item.alternate_email));
	// 	}
	// 	result.push("' onchange='update_item("+ i +", this.value)'/></label></td>");
	// 	result.push("<td colspan=2 align=center><input type='button' value='save' onclick='server_save("+ i +")' /></td>")
	// 	result.push("</tr>");		
		
	// }

	
	// result.push("</table>");
	// result.push("<br/>");
	
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
