var g_release_version = null;
var g_data = null;
var g_couchdb_url = null;
var g_metadata = null;

var g_list_lookup = {};

const g_filter = {
    reporting_state: sanitize_encodeHTML(window.location.host.split("-")[0]),
    pregnancy_relatedness: [
        1,
        0,
        2,
        99
    ],
    date_of_review: { begin: new Date(1900,01,01), end: new Date() },
    date_of_death: { begin: new Date(1900,01,01), end: new Date() }
}


const g_ui = { 
	user_summary_list:[],
	user_list:[],
	data:null,
	url_state: {
    selected_form_name: null,
    selected_id: null,
    selected_child_id: null,
    path_array : []

  }
};


const g_nav_map = new Map();
g_nav_map.set(0,"Overview");
g_nav_map.set(1,"Primary Underlying Cause of Death");
g_nav_map.set(2,"Pregnancy Relatedness");
g_nav_map.set(3,"Preventability");
g_nav_map.set(4,"Timing of Death");
g_nav_map.set(5,"OMB race recode");
g_nav_map.set(6,"Race");
g_nav_map.set(7,"Race/Ethniciy");
g_nav_map.set(8,"Age");
g_nav_map.set(9,"Education");
g_nav_map.set(10,"Committee Determinations");
g_nav_map.set(11,"Emotional Stress");
g_nav_map.set(12,"Living Arrangements");

const relatedness_map = new Map();
relatedness_map.set(9999, "(blank)");
relatedness_map.set(1, "Pregnancy-Related");
relatedness_map.set(0, "Pregnancy-Associated, but NOT -Related");
relatedness_map.set(2, "Pregnancy-Associated but Unable to Determine Pregnancy-Relatedness");
relatedness_map.set(99, "Not Pregnancy-Related or -Associated (i.e. False Positive)");


function sanitize_encodeHTML(s) 
{
	let result = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    return result;
}


$(async function ()
{
  'use strict';
	document.getElementById('report_output_id').innerHTML = "";
	await get_release_version();

    if (window.onhashchange) 
    {
      window.onhashchange({ isTrusted: true, newURL: window.location.href });
    } 
    else 
    {
      window.onhashchange = window_on_hash_change;
      window.onhashchange({ isTrusted: true, newURL: window.location.href });
    }
});


async function window_on_hash_change(e) 
{
    if (e.isTrusted) 
    {
        const url = e.newURL || window.location.href;

        let index = -1;

        const url_array = url.split('#');

        if(url_array.length > 1)
        {
            index = parseInt(url_array[1]);
        }

        await render();

        
    }

}

async function get_release_version()
{
    const get_release_version_response = await $.ajax
    ({

        url: location.protocol + '//' + location.host + '/api/version/release-version',
    });
      
    g_release_version = get_release_version_response;

    const g_metadata_response = await $.ajax
    (
        {
            url: location.protocol + '//' + location.host + `/api/version/${g_release_version}/metadata`
        }
    );

    g_metadata = g_metadata_response;

    render();
}


function review_begin_date_change(p_value)
{
    const arr = p_value.split("-");

    g_filter.date_of_review.begin = new Date(arr[0], arr[1] - 1, arr[2]);
}
function review_end_date_change(p_value)
{
    const arr = p_value.split("-");
    
    g_filter.date_of_review.end = new Date(arr[0], arr[1] - 1, arr[2]);
}
function death_begin_date_change(p_value)
{
    const arr = p_value.split("-");
    g_filter.date_of_death.begin = new Date(arr[0], arr[1] - 1, arr[2]);
}
function death_end_date_change(p_value)
{
    const arr = p_value.split("-");
    g_filter.date_of_death.end = new Date(arr[0], arr[1] - 1, arr[2]);
}


function  pregnancy_relatedness_all_change(p_control)
{
    const element_id_list = [
        "Pregnancy-Relatedness-1",
        "Pregnancy-Relatedness-0",
        "Pregnancy-Relatedness-2",
        "Pregnancy-Relatedness-99"
    ];

    if(p_control.checked)
    {
        if(g_filter.pregnancy_relatedness.indexOf(1) < 0)
        {
            g_filter.pregnancy_relatedness.push(1);
        }

        if(g_filter.pregnancy_relatedness.indexOf(0) < 0)
        {
            g_filter.pregnancy_relatedness.push(0);
        }

        if(g_filter.pregnancy_relatedness.indexOf(2) < 0)
        {
            g_filter.pregnancy_relatedness.push(2);
        }


        if(g_filter.pregnancy_relatedness.indexOf(99) < 0)
        {
            g_filter.pregnancy_relatedness.push(99);
        }

        for(let i = 0; i < element_id_list.length; i++)
        {
            const elem = document.getElementById(element_id_list[i]);
            elem.checked = true;
        }
    }
    else
    {
        if(g_filter.pregnancy_relatedness.indexOf(1) < 0)
        {
            g_filter.pregnancy_relatedness.splice(g_filter.pregnancy_relatedness.indexOf(1), 1);
        }

        if(g_filter.pregnancy_relatedness.indexOf(0) < 0)
        {
            g_filter.pregnancy_relatedness.splice(g_filter.pregnancy_relatedness.indexOf(0), 1);
        }

        if(g_filter.pregnancy_relatedness.indexOf(2) < 0)
        {
            g_filter.pregnancy_relatedness.splice(g_filter.pregnancy_relatedness.indexOf(2), 1);
        }


        if(g_filter.pregnancy_relatedness.indexOf(99) < 0)
        {
            g_filter.pregnancy_relatedness.splice(g_filter.pregnancy_relatedness.indexOf(99), 1);
        }

        for(let i = 0; i < element_id_list.length; i++)
        {
            const elem = document.getElementById(element_id_list[i]);
            elem.checked = false;
        }
    }

}

function  pregnancy_relatedness_1_change(p_control)
{
    if(p_control.checked)
    {
        if(g_filter.pregnancy_relatedness.indexOf(1) < 0)
        {
            g_filter.pregnancy_relatedness.push(1);
        }

    }
    else
    {
        if(g_filter.pregnancy_relatedness.indexOf(1) > -1)
        {
            g_filter.pregnancy_relatedness.splice(g_filter.pregnancy_relatedness.indexOf(1), 1);
        }
    }
}

function  pregnancy_relatedness_0_change(p_control)
{
    if(p_control.checked)
    {
        if(g_filter.pregnancy_relatedness.indexOf(0) < 0)
        {
            g_filter.pregnancy_relatedness.push(0);
        }

    }
    else
    {
        if(g_filter.pregnancy_relatedness.indexOf(0) > -1)
        {
            g_filter.pregnancy_relatedness.splice(g_filter.pregnancy_relatedness.indexOf(0), 1);
        }
    }
}

function  pregnancy_relatedness_2_change(p_control)
{
    if(p_control.checked)
    {
        if(g_filter.pregnancy_relatedness.indexOf(2) < 0)
        {
            g_filter.pregnancy_relatedness.push(2);
        }

    }
    else
    {
        if(g_filter.pregnancy_relatedness.indexOf(2) > -1)
        {
            g_filter.pregnancy_relatedness.splice(g_filter.pregnancy_relatedness.indexOf(2), 1);
        }
    }
}

function  pregnancy_relatedness_99_change(p_control)
{
    if(p_control.checked)
    {
        if(g_filter.pregnancy_relatedness.indexOf(99) < 0)
        {
            g_filter.pregnancy_relatedness.push(99);
        }

    }
    else
    {
        if(g_filter.pregnancy_relatedness.indexOf(99) > -1)
        {
            g_filter.pregnancy_relatedness.splice(g_filter.pregnancy_relatedness.indexOf(99), 1);
        }
    }
}
