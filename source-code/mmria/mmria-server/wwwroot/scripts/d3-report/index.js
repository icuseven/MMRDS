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
    date_of_review: { begin: new Date(), end: new Date() },
    date_of_death: { begin: new Date(), end: new Date() }
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


var year_options = [
'All',
2020,
2019,
2018,
2017,
2016,
2015,
2014,
2013,
2012,
2011,
2010,
2009,
2008,
2007,
2006,
2005,
2004,
2003,
2002,
2001,
2000,
1999
];

var month_options = [
'All',
01,
02,
03,
04,
05,
06,
07,
08,
09,
10,
11,
12
];

function sanitize_encodeHTML(s) 
{
	let result = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    return result;
}

$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';
	document.getElementById('report_output_id').innerHTML = "";
	get_release_version();

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
        /*
        switch(index)
        {
            case 1:
                const post_html = [];
                document.getElementById('output').innerHTML = await render1(post_html);
                eval(post_html.join(""));
                break;
            case -1:
            default:
                document.getElementById('output').innerHTML = render0();
        }*/
        
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


    set_list_lookup(g_list_lookup, g_metadata, "");

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

function set_list_lookup(p_list_lookup, p_metadata, p_path)
{

    switch(p_metadata.type.toLowerCase())
    {
        case "app":
        case "form":
        case "group":
        case "grid":
            for(let i = 0; i < p_metadata.children.length; i++)
            {
                let child = p_metadata.children[i];
                set_list_lookup(p_list_lookup, child, p_path + "/" + child.name);

            }

            break;
        default:
            if(p_metadata.type.toLowerCase() == "list")
            {
                let data_value_list = p_metadata.values;

                if(p_metadata.path_reference && p_metadata.path_reference != "")
                {
                    data_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));
            
                    if(data_value_list == null)	
                    {
                        data_value_list = p_metadata.values;
                    }
                }
    
                p_list_lookup[p_path] = {};
                for(let i = 0; i < data_value_list.length; i++)
                {
                    let item = data_value_list[i];
                    p_list_lookup[p_path][item.value] = item.display;
                }
            }
            break;

    }
}

function convert_dictionary_path_to_lookup_object(p_path)
{

	//g_data.prenatal.routine_monitoring.systolic_bp
	var result = null;
	var temp_result = []
	var temp = "g_metadata." + p_path.replace(new RegExp('/','gm'),".").replace(new RegExp('\\.(\\d+)\\.','gm'),"[$1].").replace(new RegExp('\\.(\\d+)$','g'),"[$1]");
	var index = temp.lastIndexOf('.');
	temp_result.push(temp.substr(0, index));
	temp_result.push(temp.substr(index + 1, temp.length - (index + 1)));

	var lookup_list = eval(temp_result[0]);

	for(var i = 0; i < lookup_list.length; i++)
	{
		if(lookup_list[i].name == temp_result[1])
		{
			result = lookup_list[i].values;
			break;
		}
	}


	return result;
}