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

const g_form_field_map = new Map();


const g_path_to_value_map = new Map();

var g_data_is_loaded = false;


var g_filter = {
    date_of_death: {
      year: ['all'],
      month: ['all'],
      day: ['all'],
    },
    date_range: [
      {
        from: 'all',
        to: 'all',
      },
    ],
    seleceted_record_id: null,
    field_selection: ['all'],
    case_status: ['all'],
    case_jurisdiction: ['/'],
    pregnancy_relatedness: ['all'],
    selected_form: '',
    search_text: '',
    include_blank_date_of_reviews :true,
    include_blank_date_of_deaths: true,
    display_frequencies_equal_to_zero: true,
      date_of_review: { begin: new Date(1900,0,1), end: new Date() },
      date_of_death: { begin: new Date(1900,0,1), end: new Date() }
  };

var g_case_view_request = {
    total_rows: 0,
    page: 1,
    skip: 0,
    take: 1000,
    sort: 'date_last_updated',
    search_key: null,
    descending: true,
    case_status: "all",
      field_selection: ["all"],
      pregnancy_relatedness:"all",
    get_query_string: function () {
      var result = [];
      result.push('?skip=' + (this.page - 1) * this.take);
      result.push('take=' + this.take);
      result.push('sort=' + this.sort);
      result.push('case_status=' + this.case_status);
        result.push('field_selection=' + this.field_selection);
        result.push('pregnancy_relatedness=' + this.pregnancy_relatedness);
  
        
        if(g_filter.include_blank_date_of_reviews == false)
        {
          result.push(`date_of_review_range=${ControlFormatDate(g_filter.date_of_review.begin)}T${ControlFormatDate(g_filter.date_of_review.end)}`);
        }
        else
        {
          result.push('date_of_review_range=All');
        }
  
  
        
        if(g_filter.include_blank_date_of_deaths == false)
        {
          result.push(`date_of_death_range=${ControlFormatDate(g_filter.date_of_death.begin)}T${ControlFormatDate(g_filter.date_of_death.end)}`);
        }
        else
        {
          result.push('date_of_death_range=All');
        }
  
      if (this.search_key) {
        result.push(
          'search_key=' +
          encodeURI(this.search_key) +
            ''
        );
      }
  
      result.push('descending=' + this.descending);
  
      return result.join('&');
    },
  };

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

    show_needs_apply_id(true);
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

                if(!g_path_to_value_map.has(s))
                {
                    g_path_to_value_map.set(s, new Map());
                }

                if(!g_report_stat_map.has(s))
                {
                    g_report_stat_map.set(s, new Map());
                    g_report_stat_map.get(s).set("type", g_path_to_stat_type.get(s));
                    g_report_stat_map.get(s).set("count",0);
                    g_report_stat_map.get(s).set("total",0);
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

                    /*
                    if
                    (
                        s == 'home_record/how_was_this_death_identified' && 
                        detail_item[v].value != null && detail_item[v].value.toString().length > 4
                    )
                    {
                        continue;
                    }
                    */

                    if(!g_report_map.get(s).has(detail_item[v].value))
                    {
                        g_report_map.get(s).set(detail_item[v].value, 0);
                    }

                    if(!g_path_to_value_map.get(s).has(detail_item[v].value))
                    {
                        g_path_to_value_map.get(s).set(detail_item[v].value, new Set());
                    }

                    const entry_value = g_report_map.get(s).get(detail_item[v].value);
                    const entry_count = detail_item[v].count;
                    g_report_map.get(s).set(detail_item[v].value, entry_value + entry_count);

                    const total_value = g_report_stat_map.get(s).get("count");

                    g_report_stat_map.get(s).set("count", total_value + entry_count);

                    if(entry_count > 0)
                    {
                        g_path_to_value_map.get(s).get(detail_item[v].value).add(item.record_id);
                    }


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


                const entry = g_report_stat_map.get(k).get("total");

                g_report_stat_map.get(k).set("total", entry + c1 * v2);
                
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


        g_path_to_value_map.get(k).set("min", new Set());
        g_path_to_value_map.get(k).set("max", new Set());
        g_path_to_value_map.get(k).set("missing", new Set());
       

        for(const data_item of data_list)
        {
            const compare_data_item = data_item.path_to_detail[k];
            if(compare_data_item != null)
            {
                  
                if(Array.isArray(compare_data_item))
                {
                    compare_data_item.forEach(element => {
                        if
                        (
                            element.count > 0 && 
                            element.value == min_value
                        )
                        {
                            g_path_to_value_map.get(k).get("min").add(data_item.record_id)
                        }

                        if
                        (
                            element.count > 0 && 
                            element.value == max_value
                        )
                        {
                            g_path_to_value_map.get(k).get("max").add(data_item.record_id)
                        }

                        if
                        (
                            element.count == 0 ||
                            element.value == "(-)" ||
                            element.value.trim().length == 0
                        )
                        {
                            g_path_to_value_map.get(k).get("missing").add(data_item.record_id)
                        }
                    });

                }
                else
                { 
                    if
                    (
                        compare_data_item.count > 0 && 
                        compare_data_item.value == min_value
                    )
                    {
                        g_path_to_value_map.get(k).get("min").add(data_item.record_id)
                    }

                    if
                    (
                        compare_data_item.count > 0 && 
                        compare_data_item.value == max_value
                    )
                    {
                        g_path_to_value_map.get(k).get("max").add(data_item.record_id)
                    }

                    if
                    (
                        compare_data_item.count == 0 ||
                        compare_data_item.value == "(-)" ||
                        compare_data_item.value.trim().length == 0
                    )
                    {
                        g_path_to_value_map.get(k).get("missing").add(data_item.record_id)
                    }
                }
                
            }
            
        }


        
        
        function stat_n_sort(a, b) 
        {
            var a_is_missing = false;
            var b_is_missing = false;

            if
            (
                a[0] == "(-)" ||
                a[0].trim().length == 0
            )
            a_is_missing = true;


            if
            (
                b[0] == "(-)" ||
                b[0].trim().length == 0
            )
            b_is_missing = true;

            if(a_is_missing && b_is_missing)
                return 0;

            if(a_is_missing && !b_is_missing)
                return -1;

            if(!a_is_missing && b_is_missing)
                return 1;
    
            return parseFloat(a[0]) -parseFloat(b[0]);
            
          }


        if(type == "STAT_N")
        {
            const count = g_report_stat_map.get(k).get("count") - g_report_stat_map.get(k).get("missing");
            const mid_count = count / 2;

            let median = "";
            var mapAsc = new Map([...g_report_map.get(k).entries()].sort(stat_n_sort));
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

                if
                (
                    k3 == "(-)" || 
                    k3.trim().length == 0
                )
                {
                    continue;
                }
                else if(sum + v3 >= mid_count)
                {

                    mid_1_entry = parseFloat(k3);
                    
                    
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
        if(g_report_stat_map.get(k).get("type") != "STAT_N") continue;

        g_report_stat_map.get(k).set("mean", g_report_stat_map.get(k).get("total") / (g_report_stat_map.get(k).get("count") - g_report_stat_map.get(k).get("missing")))
        
        const mean = g_report_stat_map.get(k).get("mean"); 
        //const total = g_report_stat_map.get(k).get("count"); 

        let observation_number = 0;
        let sum = 0;

        for(const [n, v] of l)
        {
            if
            (
                n== "(-)" ||
                n.trim().length == 0
            )
            continue;
            const value = parseFloat(n);

            observation_number += v;

            for(var sum_count = 0; sum_count < v; sum_count++)
                sum += (value - mean) * (value - mean);
        }

        g_report_stat_map.get(k).set("variance", sum / observation_number);
        g_report_stat_map.get(k).set("std_dev", Math.sqrt(sum / observation_number));

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
                        if(el2 != null)
                        el2.innerHTML = render_link
                            (
                                k,
                                n,
                                parseInt(el2.innerHTML) + v2
                            );
                    }
                    else
                    {
                        if(Array.isArray(n))
                        {
                            n.forEach(element => {
                                const el2 = document.getElementById(`${k}-${element}`);
                                if(el2 != null)
                                el2.innerHTML = render_link
                                (
                                    k,
                                    n,
                                    v2
                                );
                                
                            });
                        }
                        else
                        {
                            const el2 = document.getElementById(`${k}-${n}`);
                            if(el2 != null)
                                el2.innerHTML = render_link
                                (
                                    k,
                                    n,
                                    v2
                                );
                        }
                        //const el2 = document.getElementById(`${k}-${n}`);
                        //el2.innerHTML = v2;
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
                /*
                el.innterHTML = render_link
                (
                    k,
                    "n",
                    current_stat.get("missing")
                );
                */

                el = document.getElementById(`${k}-min`);
                let date = new Date(current_stat.get("min").split(' @')[0]);

                //el.innerHTML = formatDate(date);
                el.innerHTML = render_link(k, "min",  formatDate(date));

                

                el = document.getElementById(`${k}-max`);
                date = new Date(current_stat.get("max").split(' @')[0]);

                //el.innerHTML = formatDate(date);
                el.innerHTML = render_link(k, "min",  formatDate(date));
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
                /*
                el.innterHTML = render_link
                (
                    k,
                    "missing",
                    current_stat.get("missing")
                );
                */

                el = document.getElementById(`${k}-min`);
                el.innerHTML = render_link(k, "min", current_stat.get("min").split(' @')[0]);

                el = document.getElementById(`${k}-max`);
                el.innerHTML = render_link(k, "max", current_stat.get("max").split(' @')[0]);

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

    show_needs_apply_id(true);
}

function search_pregnancy_relatedness_onchange(p_value)
{
    if(g_filter.pregnancy_relatedness != p_value)
    {
        g_filter.pregnancy_relatedness = p_value;

        show_needs_apply_id(true);
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

    if(g_filter.include_blank_date_of_reviews == false)
    {
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
    }

    if(g_filter.include_blank_date_of_deaths == false)
    {
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
    }
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


async function on_show_case_list_click
(
    p_path,
    p_value
)
{
    if(g_release_version_specification == null)
    {

        response = await $.ajax({
            url: `${location.protocol}//${location.host}/api/metadata/version_specification-${g_release_version}`
        });

        g_release_version_specification = response;
    }
	

    const result = []
    render_search_result2(result, "/" + p_path);
    const result2 = []




    result2.push(`<ol>`);
    for(const record_id of g_path_to_value_map.get(p_path).get(p_value))
    {
        result2.push(`<li>${record_id}</li>`)
    }
    result2.push(`</ol>`)

    await data_dictionary_dialog_show
    (
        `${selected_dictionary_info.form_name} - ${selected_dictionary_info.field_name}`,
        result.join(""),
        `<b>${p_path} - ${p_value}</b>`,
        result2.join("")
    );
}

async function data_dictionary_dialog_show(p_title, p_inner_html, p_sub_title, p_detail_html)
{

    let element = document.getElementById("dictionary-lookup-id");
    if(element == null)
    {
        element = document.createElement("dialog");
        element.classList.add('p-0');
        element.classList.add('set-radius');
        element.setAttribute("id", "dictionary-lookup-id");
        element.setAttribute("role", "dialog");

        document.firstElementChild.appendChild(element);
    }

    element.style.maxWidth = "1024px";
    element.style.transform = "translateY(0%)";
    element.style.maxHeight = "600px";
    element.style.overflow = "hidden";

    let html = [];
    html.push(`
        <div aria-modal="true" class="ui-dialog-titlebar modal-header bg-primary ui-widget-header ui-helper-clearfix">
            <span id="ui-id-1" class="ui-dialog-title" style="font-family: 'Open-Sans';">${p_title.length > 100 ? p_title.slice(0,97) + "..." : p_title}</span>
            <button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close" title="×" onclick="$mmria.data_dictionary_dialog_click()"><span class="ui-button-icon ui-icon ui-icon-closethick"></span><span class="ui-button-icon-space"> </span>×</button>
        </div>
        <div id="mmria_dialog5" style="overflow-y: scroll;width: 1000; height: 500px;" class="ui-dialog-content ui-widget-content">
            <div class="modal-body">
                <table class="table table--standard rounded-0 mb-3" style="font-size: 14px"  >
                            
                <tr class="tr bg-gray-l1 font-weight-bold">
                    <th class="th" width="140" scope="col">MMRIA Form</th>
                    <th class="th" width="140" scope="col">Export File Name</th>
                    <th class="th" width="120" scope="col">Export Field</th>
                    <th class="th" width="180" scope="col">Prompt</th>
                    <th class="th" width="380" scope="col">Description</th>
                    <th class="th" width="260" scope="col">Path</th>
                    <th class="th" width="110" scope="col">Data Type</th>
                </tr>
                
                ${p_inner_html}
                </table>
                ${p_sub_title}<br/><br/>
                ${p_detail_html}
            </div>

        </div>
        <div>
        <footer class="modal-footer">
            <button id="data_dictionary_dialog_close_button" class="btn btn-primary mr-1" onclick="$mmria.data_dictionary_dialog_click()" style="font-family: 'Open-Sans';">Close</button>
        </footer>
        </div>
    `);

    element.innerHTML = html.join("");

    mmria_pre_modal("dictionary-lookup-id");
    
    window.setTimeout(()=> { const data_dictionary_dialog_close_button = document.getElementById("data_dictionary_dialog_close_button"); data_dictionary_dialog_close_button.focus(); }, 0);
    element.showModal();
}
 
function data_dictionary_dialog_click()
{
    mmria_post_modal();
    let el = document.getElementById("dictionary-lookup-id");
    el.close();
}

function render_link
(
    p_path,
    p_value,
    p_count
)
{
    return `
        <a href="javascript:on_show_case_list_click('${p_path}','${p_value}','${p_count}')">${p_count}</a>
    `;

    
}

function render_search_result2(p_result, p_path)
{
	selected_dictionary_info = {};
	render_search_result_item2(p_result, g_metadata, "", null, p_path.toLowerCase(), false);
}


//let last_form = null;
let selected_dictionary_info = {};

function render_search_result_item2(p_result, p_metadata, p_path, p_selected_form, p_search_text, p_is_abstractor_committee)
{

    if(p_metadata.mirror_reference != null && p_metadata.mirror_reference != "")
    {
        return;
    }
	switch(p_metadata.type.toLowerCase())
	{
		case "form":			
			if(p_selected_form== null || p_selected_form=="")
			{
				for(let i = 0; i < p_metadata.children.length; i++)
				{
					let item = p_metadata.children[i];

					render_search_result_item2(p_result, item, p_path + "/" + item.name.toLowerCase(), p_selected_form, p_search_text, p_is_abstractor_committee);
				}
			}
			else
			{
				if(p_metadata.name.toLowerCase() == p_selected_form.toLowerCase())
				{
					for(let i = 0; i < p_metadata.children.length; i++)
					{
						let item = p_metadata.children[i];

						render_search_result_item2(p_result, item, p_path + "/" + item.name.toLowerCase(), p_selected_form, p_search_text, p_is_abstractor_committee);
					}
				}
			}
			break;

		case "app":
			let form_filter = "(any form)";
			let el = document.getElementById("form_filter");

			if(el)
			{
				form_filter = el.value;
			}

			for(let i = 0; i < p_metadata.children.length; i++)
			{
				let item = p_metadata.children[i];

				if(form_filter.toLowerCase() == "(any form)")
				{
					render_search_result_item2(p_result, item, p_path + "/" + item.name.toLowerCase(), p_selected_form, p_search_text, p_is_abstractor_committee);
				}
				else if(item.type.toLowerCase() == "form")
				{
					render_search_result_item2(p_result, item, p_path + "/" + item.name.toLowerCase(), p_selected_form, p_search_text, p_is_abstractor_committee);
				}
				
			}
			break;

		case "group":
		case "grid":
			for(let i = 0; i < p_metadata.children.length; i++)
			{
				let item = p_metadata.children[i];
				render_search_result_item2(p_result, item, p_path + "/" + item.name.toLowerCase(), p_selected_form, p_search_text, p_is_abstractor_committee);
			}
			break;

        case "chart":
        case "label":
        case "button":
            break;

		default:
			let file_name = "";
			let field_name = "";
			let file_field_item = g_release_version_specification.path_to_csv_all[p_path];

			if(file_field_item)
			{
				file_name = file_field_item.file_name;
				field_name = file_field_item.field_name;
			}

			if(p_path != p_search_text)
			{
                return;
			}

			let form_name = "(none)";
			let path_array = p_path.split('/');
			let description = "";
			let list_values = [];
			let data_type = p_metadata.type.toLowerCase();

			if
			(
				p_metadata.data_type != null &&
				p_metadata.data_type != ""
			)
			{
				data_type = p_metadata.data_type
			}

			if(path_array.length > 2)
			{
				form_name = path_array[1];
				form_name = convert_form_name(form_name);
			}


            selected_dictionary_info.form_name = form_name;
            selected_dictionary_info.field_name = p_metadata.prompt;

			if(p_metadata.description != null)
			{
				description = p_metadata.description;
			}


			if(p_metadata.type.toLowerCase() == "list")
			{
				let value_list = p_metadata.values;

				if(p_metadata.path_reference && p_metadata.path_reference != "")
				{
					value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));
			
					if(value_list == null)	
					{
						value_list = p_metadata.values;
					}
				}




				list_values.push(`
					<tr class="tr">
						<td class="td" width="140"></td>
						<td class="td p-0" colspan="5">
							<table class="table table--standard rounded-0 m-0">
								<thead class="thead">
									<tr class="tr bg-gray-l2">
										<th class="th" colspan="5" width="1080" scope="colgroup">List Values</th>
									</tr>
								</thead>
								<thead class="thead">
									<tr class="tr bg-gray-l2">
										<th class="th" width="140" scope="col">Value</th>
										<th class="th" width="680" scope="col">Display</th>
										<th class="th" width="260" scope="col">Description</th>
									</tr>
								</thead>
								<tbody class="tbody">	
				`);
                    
					for(let i= 0; i < value_list.length; i++)
					{
						list_values.push(`
									<tr class="tr">
										<td class="td" width="140">${value_list[i].value}</td>
										<td class="td" width="680">${value_list[i].display}</td>
										<td class="td" width="260">${value_list[i].description}</td>
									</tr>
						`);
					}
				
				list_values.push(`
								</tbody>
							</table>
						</td>
						<td class="td" colspan="2"></td>
					</tr>
				`);
			}

			// Remove fields who do not have a form_name or if it doesn't exist
			// if (!form_name || form_name == '(none)' || form_name == '(blank)') {
			// if (!form_name || form_name.includes('none') || form_name.includes('blank')) {
			if (
				!form_name ||
				 form_name.indexOf('none') !== -1 ||
				 form_name == '(none)' ||
				 form_name.indexOf('blank') !== -1 ||
				 form_name == '(blank)'
			) 
            {
				return;
			}


			p_result.push(`
				<tr class="tr">
					<td class="td" width="140">${form_name}</td>
					<td class="td" width="140">${file_name}</td>
					<td class="td" width="120">${field_name}</td>
					<td class="td" width="180">${p_metadata.prompt}</td>
					<td class="td" width="380">${description}</td>
					<td class="td" width="260">${p_path}</td>
					<td class="td" width="110">${(data_type.toLowerCase() == "textarea" || data_type.toLowerCase() == "jurisdiction")? "string": data_type}</td>
				</tr>
				
			`);

			break;

	}
}


function convert_form_name(p_value)
{
	let lookup = {
		'(none)': '(none)',
		'home_record': 'Home Record',
		'death_certificate': 'Death Certificate',
		'birth_fetal_death_certificate_parent': 'Birth/Fetal Death Certificate - Parent Section',
		'birth_certificate_infant_fetal_section': 'Birth/Fetal Death Certificate - Infant/Fetal Section',
		'autopsy_report': 'Autopsy Report',
		'prenatal': 'Prenatal Care Record',
		'er_visit_and_hospital_medical_records': 'ER Visits & Hospitalizations',
		'other_medical_office_visits': 'Other Medical Office Visits',
		'medical_transport': 'Medical Transport',
		'social_and_environmental_profile': 'Social & Environment Profile',
		'mental_health_profile': 'Mental Health Profile',
		'informant_interviews': 'Informant Interviews',
		'case_narrative': 'Case Narrative',
		'committee_review': 'Committee Decisions',
        'cvs':'Community Vital Signs'
	}

	return lookup[p_value.toLowerCase()];
}
