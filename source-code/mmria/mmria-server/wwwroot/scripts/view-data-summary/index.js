'use strict';

var g_metadata = null;
var g_metadata_set = {};
var g_release_version_name = null;
var g_release_version_specification = null;
var g_selected_version_specification = null;
var g_selected_version_name = null;
var g_version_list = null;
const g_report_stat_map = new Map();
const g_report_map = new Map();
const g_path_to_stat_type = new Map();


(async function() {

	await get_release_version();
})()


async function get_release_version()
{
	let response = await $.ajax({
		url: `${location.protocol}//${location.host}/api/version/release-version`
	});
    
    
    g_release_version_name = response;
    g_selected_version_name = g_release_version_name;
	
	response = await $.ajax({
		url: `${location.protocol}//${location.host}/api/metadata/version_specification-${g_release_version_name}`
	});

    g_metadata = JSON.parse(response.metadata);
    g_release_version_specification = response;

    document.getElementById('form_content_id').innerHTML = dictionary_render(g_metadata, "").join("")  + '<br/>';

	$('.spinner-content').removeClass('spinner-active');

    window.setTimeout(get_all_report_data,0);
}

async function load_metadata(p_version_id)
{
    let result;

    result = await $.ajax
    (
        {
            url: `${location.protocol}//${location.host}/api/version/${p_version_id}/metadata`,
        }
    );

    return result;
}


async function metadata_version_filter_change(p_value)
{

    let idx = g_version_list.findIndex((x)=> {return x._id == p_value;});
    if(idx ==-1)
    {
        g_selected_version_name = g_release_version;
        g_selected_version_specification = g_release_version_name;
    }
    else
    {
        g_selected_version_name =  g_version_list[idx].name;
        g_selected_version_specification = g_version_list[idx];
    }

    g_metadata = g_metadata_set[g_selected_version_specification._id];

    document.getElementById('form_content_id').innerHTML = dictionary_render(g_metadata, "").join("")  + '<br/>';
}

function render_metadata_version_filter()
{
    let html_result = []

    html_result.push(`<option value="">(Select Version)</option>`)
    for(let i = 0; i < g_version_list.length; i++)
    {
        let item = g_version_list[i];
        let is_selected = "";

        if(item.name == g_selected_version_name)
        {
            is_selected = "selected=true"
        }
        
        if(item._id.indexOf("_design/auth") < 0 && item.name != null)
        {
          html_result.push(`<option value="${item._id}" ${is_selected}>${item.name}</option>`)
        }
    }


    return html_result.join("");

}

function search_text_change(p_value)
{
	g_filter.search_text = p_value;
}

async function get_indicator_values(p_indicator_id)
{
    const get_data_response = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/measure-indicator/${p_indicator_id}`
    });

    g_data = { total: 0, data: []};

    for(let i = 0; i < get_data_response.length; i++)
    {
        const item = get_data_response[i];
        if(Can_Pass_Filter(item))
        {
            g_data.data.push(item);
            g_data.total +=1;
        }
        else
        {
            //console.log("here");
        }
    }
    
    return g_data;
}


let total_rows = 0;
const id_list = [];
const data_list = [];

async function get_all_report_data()
{
  
//http://localhost:5984/report/_design/data_summary_view_report/_view/year_of_death?skip=10000&limit=100
/*
{"total_rows":1558,"offset":1558,"rows":[

]}
*/ 
    const result = await $.ajax
    (
        {
            url: `${location.protocol}//${location.host}/api/data-summary/0`,
        }
    );

    const total_rows = result.total_rows;
    let current_total = result.rows.length;
    let current_page = 1;

    result.rows.forEach(element => {
        if(element.value._id == null)
        {
            element.value._id = element.id;
        }
        data_list.push(element.value);
    });
    data_list

    while
    (
        data_list.length < total_rows
    )
    {
        const page_result = await get_report_data_page(current_page * 100);
        if(page_result.rows.length == 0)
        {
            break;
        }

        page_result.rows.forEach(element => {

            if(element.value._id == null)
            {
                element.value._id = element.id;
            }
        
            data_list.push(element.value);
        });
        current_page += 1;
    }

    console.log("get_all_report_data fin.");

    window.setTimeout(build_report,0);
    return result;
}

async function get_report_data_page(p_skip = 0)
{
    const result = await $.ajax
    (
        {
            url: `${location.protocol}//${location.host}/api/data-summary/${p_skip}`,
        }
    );

    return result;
}

async function build_report()
{
    g_report_stat_map.clear();
    g_report_map.clear();
    // public Dictionary<string, List<Detail>> path_to_detail { get; set; }
    data_list.forEach(item => {
        if(Can_Pass_Filter(item))
        {
            //g_report_data_set.add(item);

            const detail = item.path_to_detail;

            for(const s of Object.keys(detail))
            {
                if(!g_report_map.has(s))
                {
                    g_report_map.set(s, new Map());
                }

                if(!g_report_stat_map.has(s))
                {
                    g_report_stat_map.set(s, new Map());
                    g_report_stat_map.get(s).set("type", g_path_to_stat_type.get(s));
                    g_report_stat_map.get(s).set("count",0);
                    g_report_stat_map.get(s).set("missing",0);
                    g_report_stat_map.get(s).set("min",0);
                    g_report_stat_map.get(s).set("max",0);
                    g_report_stat_map.get(s).set("mode",0);
                    g_report_stat_map.get(s).set("median",0);
                    g_report_stat_map.get(s).set("std_dev",0);// square root of variance
                    g_report_stat_map.get(s).set("variance",0);

                }

                const detail_item = detail[s];
                for(const v of Object.keys(detail_item))
                {
                    if(!g_report_map.get(s).has(detail_item[v].value))
                    {
                        g_report_map.get(s).set(detail_item[v].value, 0);
                    }

                    const entry_value = g_report_map.get(s).get(detail_item[v].value)
                    g_report_map.get(s).set(detail_item[v].value, entry_value + detail_item[v].count);

                    const total_value = g_report_stat_map.get(s).get("count");
                    g_report_stat_map.get(s).set("count", total_value + detail_item[v].count);


                }

            }

            //console.log("here");
            
        }
        else
        {
            //console.log("here");
        }

    });

    

    for(const [k, v] of g_report_map)
    {
        g_report_stat_map.get(k).set("mean", g_report_stat_map.get(k).get("count") / v.size)
        let max = 0;
        let mode = 0;
        let mode_value = "";
        let max_value = "";
        let min = 99999999;
        let min_value = "";


        for(const [k2, v2] of v)
        {
            if(v2 < min) 
            {
                min = v2;
                min_value = k2;
            }

            if(v2 > max) 
            {
                max = v2;
                max_value = k2;
            }

            if(k2 == "(-)")
            {
                g_report_stat_map.get(k).set("missing", v2);
            }
        }

        g_report_stat_map.get(k).set("min", `${min_value} @${min}`);
        g_report_stat_map.get(k).set("max", `${max_value} @${max}`);

    }

    for(const [k, l] of g_report_map)
    {
        const mean = g_report_stat_map.get(k).get("mean"); 
        const total = g_report_stat_map.get(k).get("count"); 

        let sum = 0;

        for(const [n, v] of l)
        {
            sum += (v - mean) * (v - mean);
        }

        g_report_stat_map.get(k).set("variance", sum / total);
        g_report_stat_map.get(k).set("std_dev", Math.sqrt(sum / total));

    }

    console.log("here");
    
}



async function Can_Pass_Filter(p_item)
{
    return true;
}