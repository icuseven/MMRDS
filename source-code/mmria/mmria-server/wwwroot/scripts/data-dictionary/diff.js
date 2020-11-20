'use strict';

var g_metadata = null;
var g_release_version = null;
var g_release_version_specification = null;
var g_selected_version = null;
var g_version_list = null;
var g_list_one_selected_item = "";
var g_list_two_selected_item = "";
var g_is_inline = 0;
var g_view_type_is_dirty = false;
var g_view1_is_dirty = true;
var g_view2_is_dirty = true;

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
        
        let h2_element = document.getElementById("list-one-h2");
        h2_element.innerText = g_list_one_selected_item;

        h2_element = document.getElementById("list-two-h2");
        h2_element.innerText = g_list_one_selected_item;
	});


}

function set_is_inline(p_value)
{
    if(p_value != g_is_inline)
    {
        g_view_type_is_dirty = true;
    }

    if(p_value== 1)
    {
        g_is_inline = 1;
    }
    else
    {
        g_is_inline = 0;
    }
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


function source_list_changed(p_control)
{
    let h2_element = document.getElementById(p_control.id + "-h2");
    h2_element.innerText = p_control.selectedOptions[0].innerText;

    if(p_control.id == "list-one")
    {
        if(g_list_one_selected_item != p_control.selectedOptions[0].innerText)
        {
            g_view1_is_dirty = true;
        }
        
        g_list_one_selected_item = p_control.selectedOptions[0].innerText;
    }
    else if(p_control.id == "list-two")
    {
        if(g_list_two_selected_item != p_control.selectedOptions[0].innerText)
        {
            g_view2_is_dirty = true;
        }
        g_list_two_selected_item = p_control.selectedOptions[0].innerText;
    }
}

function compare_versions_click()
{
    if(! (g_view_type_is_dirty || g_view1_is_dirty || g_view2_is_dirty)) return;

    let v1 = null;
    let v2 = null;

    if(g_view1_is_dirty || g_view2_is_dirty)
    for(let i = 0; i < g_version_list.length; i++)
    {
        let item = g_version_list[i];
        let is_selected = "";

        if(item.name == g_list_one_selected_item)
        {
            v1 = item;
        }

        if(item.name == g_list_two_selected_item)
        {
            v2 = item;
        }
    }

    if
    (
        v1 != null &&
        v2 != null &&
        v1.name != v2.name
    )
    {
        //e1.value = JSON.stringify(v1, null, '\t');
        //e2.value = JSON.stringify(v2, null, '\t');

        //e1.value = v1.metadata;
        //e2.value = v2.metadata;
        if(g_view1_is_dirty)
        {
            let e1 = document.getElementById("baseText");
            e1.value = JSON.stringify(JSON.parse(v1.metadata), null, '\t');
        }

        if(g_view2_is_dirty)
        {
            let e2 = document.getElementById("newText");
            e2.value = JSON.stringify(JSON.parse(v2.metadata), null, '\t');
        }

        diffUsingJS(g_is_inline);

        g_view_type_is_dirty = false;
        g_view1_is_dirty = false;
        g_view2_is_dirty = false;

    }
}