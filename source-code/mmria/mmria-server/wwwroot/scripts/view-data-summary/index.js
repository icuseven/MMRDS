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

var g_data_is_loaded = false;

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

    //console.log("get_all_report_data fin.");

    g_data_is_loaded = true;

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

        const type = g_report_stat_map.get(k).get("type");
        let max = 0;
        let mode = 0;
        let mode_value = "";
        let max_value = "";
        let min = 99999999;
        let min_value = "";

        if(type == "STAT_D")
        {
            max = Date.parse("1900-01-01");
            min =  Date.parse("3000-01-01");
        }


        for(const [k2, v2] of v)
        {
            if
            (
                k2 == "(-)" ||
                k2.trim().length == 0
            )
            {

                g_report_stat_map.get(k).set("missing", v2 + g_report_stat_map.get(k).get("missing"));
                

            }
            else if(type == "STAT_N")
            {
                const c1 = parseFloat(k2)
                if(c1 < min) 
                {
                    min = c1;
                    min_value = k2;
                }

                if(c1 > max) 
                {
                    max = c1;
                    max_value = k2;
                }

                if(v2 > mode)
                {
                    mode = v2;
                    mode_value = k2;
                }
            }
            else if(type == "STAT_D")
            {
                const c1 = Date.parse(k2);
                if(c1 < min) 
                {
                    min = c1;
                    min_value = k2;
                }

                if(c1 > max) 
                {
                    max = c1;
                    max_value = k2;
                }

                if(v2 > mode)
                {
                    mode = v2;
                    mode_value = k2;
                }
            }

            
        }

        g_report_stat_map.get(k).set("min", `${min_value} @${min}`);
        g_report_stat_map.get(k).set("max", `${max_value} @${max}`);
        g_report_stat_map.get(k).set("mode", `${mode_value} @${mode}`);

        if(type == "STAT_N")
        {
            const count = g_report_stat_map.get(k).get("count") - g_report_stat_map.get(k).get("missing");
            const mid_count = count / 2;

            let median = "";
            var mapAsc = new Map([...g_report_map.get(k).entries()].sort());
            const array = [];
            let sum = 0;
            let mid_1_entry;
            let mid_2_entry;
            let need_mid_2 = false;
            for(const [k3, v3] of mapAsc)
            {
                if(need_mid_2)
                {
                    mid_2_entry = parseFloat(k2)
                    median = (mid_1_entry + mid_2_entry) / 2;
                    break;
                }
                if(sum + v3 >= mid_count)
                {
                    if
                    (
                        k3 == "(-)" || 
                        k3.trim().length == 0
                    )
                    {
                        continue;
                        mid_1_entry = "(-)";
                    }
                    else
                    {
                        mid_1_entry = parseFloat(k3);
                    }
                    
                    if(count % 2 == 0)
                    {
                        if((sum + v3) - mid_count >=0)
                        {
                            median = mid_1_entry;
                        }
                        else
                        {
                            need_mid_2 = true;
                            continue;
                        }
                    }
                    else
                    {
                        median = mid_1_entry;
                    }
                    //console.log("here");
                    break;
                }

                sum += v3;
                array.push(k3);
            }

 

            g_report_stat_map.get(k).set("median", median);
            
        }

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

    for(const [k, v] of g_report_map)
    {

        const current_stat = g_report_stat_map.get(k);
        const type = current_stat.get("type");

        if(type == "FREQ")
        {
            const el = document.getElementById(`${k}-count`);
            if(el != null)
            {
                el.innerHTML = current_stat.get("count");

                for(const [n, v2] of v)
                {
                    if(n == "(-)")
                    {
                        const el2 = document.getElementById(`${k}-9999`);
                        el2.innerHTML = parseInt(el2.innerHTML) + v2;
                    }
                    else
                    {
                        const el2 = document.getElementById(`${k}-${n}`);
                        el2.innerHTML = v2;
                    }
                }
            }
        }
        else if(type == "STAT_D")
        {
            let el = document.getElementById(`${k}-count`);

            if(el != null)
            {
                el.innerHTML = current_stat.get("count");

                el = document.getElementById(`${k}-missing`);
                el.innerHTML = current_stat.get("missing");

                el = document.getElementById(`${k}-min`);
                let date = new Date(current_stat.get("min").split(' @')[0]);

                el.innerHTML = formatDate(date);

                

                el = document.getElementById(`${k}-max`);
                date = new Date(current_stat.get("max").split(' @')[0]);

                el.innerHTML = formatDate(date);
            }
        }
        else if(type == "STAT_N")
        {
            let el = document.getElementById(`${k}-count`);

            if(el != null)
            {
                el.innerHTML = current_stat.get("count");

                el = document.getElementById(`${k}-missing`);
                el.innerHTML = current_stat.get("missing");

                el = document.getElementById(`${k}-min`);
                el.innerHTML = current_stat.get("min").split(' @')[0];

                el = document.getElementById(`${k}-max`);
                el.innerHTML = current_stat.get("max").split(' @')[0];

                el = document.getElementById(`${k}-mean`);
                el.innerHTML = current_stat.get("mean").toFixed(2);

                el = document.getElementById(`${k}-std_dev`);
                el.innerHTML = current_stat.get("std_dev").toFixed(2);

                el = document.getElementById(`${k}-median`);
                el.innerHTML = toFixed_2(current_stat.get("median"));

                el = document.getElementById(`${k}-mode`);
                el.innerHTML = current_stat.get("mode").split(' @')[0];
            }
        }

        
    }
    
}



async function Can_Pass_Filter(p_item)
{
    return true;
}


function formatDate(dateObj)
{

    let result = dateObj;

    if(dateObj instanceof Date)
    {
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        result = month.toString().padStart(2,"0") + "/" + day.toString().padStart(2,"0") + "/" + year;
    }
    else
    {
        console.log("here");
    }

    return result;
}

function search_case_status_onchange(p_value)
{
    if(g_filter.case_status != p_value)
    {
        g_filter.case_status = p_value;

    }
}

function search_pregnancy_relatedness_onchange(p_value)
{
    if(g_filter.pregnancy_relatedness != p_value)
    {
        g_filter.pregnancy_relatedness = p_value;
    }
}

function Can_Pass_Filter(p_value)
{

    let pregnancy_relatedness = true;
    let date_of_review_begin = true;
    let date_of_review_end = true;
    let date_of_death_begin = true;
    let date_of_death_end = true;
    let case_status = true;
    /*
    {
        "case_id": "0190e93e-a359-441e-b27d-43f83d946de4",
        "host_state": "test",
        "means_of_fatal_injury": 3,
        "year_of_death": 2009,
        "month_of_death": 9,
        "day_of_death": 22,
        "case_review_year": 2011,
        "case_review_month": 9,
        "case_review_day": 30,
        "pregnancy_related": 2,
        "indicator_id": "mPregRelated",
        "field_id": "MPregRel3",
        "value": 1,
        "jurisdiction_id": "/"
    }*/


    date_of_review_begin = is_greater_than_date
    (
        p_value.year_of_case_review,
        p_value.month_of_case_review,
        p_value.day_of_case_review,
        g_filter.date_of_review.begin
    )

    date_of_review_end = is_less_than_date
    (
        p_value.year_of_case_review,
        p_value.month_of_case_review,
        p_value.day_of_case_review,
        g_filter.date_of_review.end
    )

    date_of_death_begin = is_greater_than_date
    (
        p_value.year_of_death,
        p_value.month_of_death,
        p_value.day_of_death,
        g_filter.date_of_death.begin
    )

    date_of_death_end = is_less_than_date
    (
        p_value.year_of_death,
        p_value.month_of_death,
        p_value.day_of_death,
        g_filter.date_of_death.end
    )
/*
    g_filter.pregnancy_relatedness
    g_filter.date_of_review.begin
    g_filter.date_of_review.end
    g_filter.date_of_death.begin
    g_filter.date_of_death.end
    */

    if
    (
        g_filter.pregnancy_relatedness == "all"
    )
    {
        pregnancy_relatedness = true;
    }
    else
    {
        pregnancy_relatedness = g_filter.pregnancy_relatedness == p_value.pregnancy_relatedness;
    }

    if
    (
        g_filter.case_status == "all"
    )
    {
        case_status = true;
    }
    else
    {
        case_status = g_filter.case_status == p_value.case_status;
    }

    return pregnancy_relatedness && 
        case_status &&
        date_of_review_begin && 
        date_of_review_end && 
        date_of_death_begin && 
        date_of_death_end;

}

function is_greater_than_date
(
    p_year,
    p_month,
    p_day,
    p_date
)
{
    let is_year = true;
    let is_month = true;
    let is_day = true;

    let year = 9999;
    let month = 9999;
    let day = 9999;

    if
    (
        p_year != null 
    )
    {
        year = p_year;
    }

    if
    (
        p_month != null
    )
    {
        month = p_month;
    }

    if
    (
        p_day != null
    )
    {
        day = p_day;
    }

    const filter_year = p_date.getFullYear();
    const filter_month = p_date.getMonth() + 1;
    const filter_day = p_date.getDate();

    if(year == 9999) return true;

    if(year != 9999)
    {
        if(year > filter_year)
        {
            return true;
        }
        is_year = year == filter_year;
    }

    if(is_year && month != 9999)
    {
        if(month > filter_month)
        {
            return true;
        }
        
        is_month = month == filter_month;
    }

    if(is_year && is_month && day != 9999)
    {
        is_day = day >= filter_day;
    }

    return is_year && is_month && is_day;
}

function is_less_than_date
(
    p_year,
    p_month,
    p_day,
    p_date
)
{
    let is_year = true;
    let is_month = true;
    let is_day = true;

    let year = 9999;
    let month = 9999;
    let day = 9999;

    if
    (
        p_year != null 
    )
    {
        year = p_year;
    }

    if
    (
        p_month != null
    )
    {
        month = p_month;
    }

    if
    (
        p_day != null
    )
    {
        day = p_day;
    }

    const filter_year = p_date.getFullYear();
    const filter_month = p_date.getMonth() + 1;
    const filter_day = p_date.getDate();


    if(year == 9999) return true;

    if(year != 9999)
    {
        if(year < filter_year)
        {
            return true;
        }

        is_year = year == filter_year;
    }

    if(is_year && month != 9999)
    {
        if(month < filter_month)
        {
            return true;
        }

        is_month = month == filter_month;
    }

    if(is_year && is_month && day != 9999)
    {
        is_day = day <= filter_day;
    }

    return is_year && is_month && is_day;
}

function toFixed_2(p_value)
{
    let result = p_value;
    if
    (
        p_value != "" &&
        ! isNaN(p_value)
    )
    {
        result = p_value.toFixed(2);
    }

    return result;
}