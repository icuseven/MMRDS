'use strict';

var g_metadata = null;
var g_release_version = null;
var g_release_version_specification = null;
var g_selected_version = null;
var g_version_list = null;
var g_list_one_selected_item = "";
var g_list_two_selected_item = "";
        

(function() {
	get_release_version();
})()


function get_release_version()
{
	$.ajax({
		url: location.protocol + '//' + location.host + `/api/version/release-version`
	}).done(function(response) {
		g_release_version = response;
        g_selected_version = g_release_version;
        g_list_one_selected_item = g_release_version;
        g_list_two_selected_item = g_release_version;
		get_release_version_sepecification();
	});
}


function get_release_version_sepecification()
{
	$.ajax({
		url: location.protocol + '//' + location.host + `/api/metadata/version_specification-${g_release_version}`
	}).done(function(response) {
		g_release_version_specification = response;
		load_metadata();
	});
}


function get_version_sepecification(p_version_name)
{
	$.ajax({
		url: `${location.protocol}//${location.host}/api/metadata/version_specification-${p_version_name}`
	}).done(function(response) {
		g_release_version_specification = response;
		load_metadata();
	});
}


function load_metadata()
{
	var metadata_url = location.protocol + '//' + location.host + '/api/metadata';

	$.ajax({
		url: metadata_url
	}).done(function(response) {
		g_metadata = response;
		//document.getElementById('form_content_id').innerHTML = dictionary_render(g_metadata, "").join("")  + '<br/>';
		get_available_versions()
	});
}

function get_available_versions()
{
  $.ajax
  ({
		url: location.protocol + '//' + location.host + '/api/version/list',
  })
  .done(function(response) 
  {

        g_version_list = response;

        update_list("list-one", g_list_one_selected_item);
        update_list("list-two", g_list_two_selected_item);
        /*
		let result = []

		for(let i = 0; i < g_version_list.length; i++)
		{
			let item = g_version_list[i];
			let is_selected = "";

			if(item.name == g_selected_version)
			{
				is_selected = "selected=true"
			}

			if(item._id.indexOf("_design/auth") < 0)
			{
				result.push(`<option value="${item._id}" ${is_selected}>${item.name}</option>`)
			}
		}*/

	});


}

function update_list(p_id, p_selected_version)
{
    let list_element = document.getElementById(p_id);
    let result = []

    for(let i = 0; i < g_version_list.length; i++)
    {
        let item = g_version_list[i];
        let is_selected = "";

        if(item.name == p_selected_version)
        {
            is_selected = "selected=true"
        }

        if(item._id.indexOf("_design/auth") < 0 && item.name!= null)
        {
            result.push(`<option value="${item._id}" ${is_selected}>${item.name}</option>`)
        }
    }
    list_element.innerHTML = result.join("");
}