var g_data = null;
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
	getCaseSet();

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

function getCaseSet()
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

			if (isCaseCheckedOut(caseView))
			{
				checkedOutCases.push(caseView);
			}

			// let case_view = case_view_response.rows[i];

			// if(is_case_checked_out(case_view))
			// {
			// 	case_view_list.push(case_view);
			// }
		}
    
    document.getElementById('output').innerHTML = renderCheckedOutCases(checkedOutCases).join('');
  });
}

function isCaseCheckedOut(p_case)
{
	let is_checked_out = false;
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
				getMinuteDifference(try_date, current_date) <= 120
				// p_case.value.last_checked_out_by.toLowerCase() == g_user_name.toLowerCase() //commented out but leaving for reference as Im not exactly sure what this is doing
		)
		{
			is_checked_out = true;
		}
	}

  return is_checked_out;
}

function renderCheckedOutCases(p_cases, p_time)
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
						<th class="th" scope="col"></th>
					</tr>
				</thead>
				<tbody class="tbody">
					<!-- START loop through checked out cases -->
					${p_cases.map((el, i) => {
						let caseID = el.id;
						let jurisdictionID = el.value.jurisdiction_id;
						let firstName = el.value.first_name;
						let lastName = el.value.last_name;
						let recordID = el.value.record_id;
						let agencyCaseID = el.value.agency_case_id;

						let lastUpdatedDate = el.value.date_last_updated;
						// lastUpdatedDate = lastUpdatedDate.split('T')[0];
						// lastUpdatedDate = lastUpdatedDate.split('-');
						lastUpdatedDate = new Date(lastUpdatedDate);
						//convert ISO format to MM/DD/YYYY
						lastUpdatedDate = lastUpdatedDate.toLocaleDateString('en-US');
						
						let lastCheckedOutDate = el.value.date_last_updated;
						let timeLocked = Math.abs(new Date(lastCheckedOutDate) - new Date());
						timeLocked = convertToReadableTime(timeLocked);

						let lockedBy = el.value.last_checked_out_by;
						let caseStatus = ''; //TODO: Need to wire in Case Status

						return (
							`<tr class="tr" data-id="${caseID}">
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
								<td class="td text-center" scope="col"><button class="anti-btn link" onclick="handleCaseRelease('${caseID}')">Release</button></td>
							</tr>`
						)
					})}
				</tbody>
			</table>`
		);
	}
	
	return result;
}

function handleCaseRelease(p_id) {
	$.ajax({
		url: location.protocol + '//' + location.host + '/api/case?case_id=' + p_id //call the API and get current case
  }).done((response) => {
		g_data = response; //set to local var
		g_data.date_last_updated = new Date(); //set 'date_last_updated' prop
		g_data.date_last_checked_out = null; //set 'date_last_checked_out' prop
		g_data.last_checked_out_by = null; //set 'last_checked_out_by' prop

		//save and release case with a callback to rerender the table
		saveCaseAndRelease(g_data, getCaseSet);
	});

}

function saveCaseAndRelease(p_data, p_call_back) {
	$.ajax({
    url: location.protocol + '//' + location.host + '/api/case',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: JSON.stringify(p_data),
    type: "POST"
  }).done(function(response) {
		console.log("save_case: success");

		if(p_call_back)
    {
      p_call_back();
    }
	}).fail(function(xhr, err) { 
		console.log("server save_case: failed", err);

		if(xhr.status == 401)
		{
			let redirect_url = location.protocol + '//' + location.host;
			window.location = redirect_url;
		}
	});
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
