var g_data = null;
var g_couchdb_url = null;
var g_uid = null;
var g_pwd = null;


var g_ui = { 
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

$(function ()
{//http://www.w3schools.com/html/html_layout.asp
  'use strict';
	document.getElementById('report_output_id').innerHTML = "";
	load_data(g_uid, $mmria.getCookie("pwd"));
});

function load_values()
{
	$.ajax({
			url: location.protocol + '//' + location.host + '/api/values',
	}).done(function(response) {
			g_couchdb_url = response.couchdb_url;
			load_data(g_uid, $mmria.getCookie("pwd"))
	});

}

function load_data(p_uid, p_pwd)
{
	var url =  location.protocol + '//' + location.host + '/api/aggregate_report?' + p_uid

//	var prefix = 'http://' + p_uid + ":" + p_pwd + '@';
    //var url = prefix + g_couchdb_url.replace('http://','') + '/mmrds/_design/aggregate_report/_view/all';

	$.ajax({
			url: url
	}).done(function(response) {
			
			g_data = response;

			//document.getElementById('generate_report_button').disabled = false;
			//process_rows();
			//document.getElementById('navigation_id').innerHTML = navigation_render(g_user_list, 0, g_ui).join("");

			//document.getElementById('form_content_id').innerHTML = aggregate_report_render(g_ui, "", g_ui).join("");

	});
}

function generate_report_click()
{

  let valid_response_regx = /^(All|\d+)$/;


  let year_of_death_index = year_options.indexOf(document.getElementById('year_of_death').value);
  let month_of_case_review_index = month_options.indexOf(document.getElementById('month_of_case_review').value);
  let year_of_case_review_index = year_options.indexOf(document.getElementById('year_of_case_review').value);


  if
  (
    !
    (
      year_of_death_index > -1 &&
      month_of_case_review_index > -1 &&
      year_of_case_review_index > -1 &&
      valid_response_regx.test(year_options[year_of_death_index]) &&
      valid_response_regx.test(month_options[month_of_case_review_index]) &&
      valid_response_regx.test(year_options[year_of_case_review_index])
    )
  )
  {
    alert("invalid parameters");
    return;
  }


  let year_of_death = year_options[year_of_death_index];
  let month_of_case_review = month_options[month_of_case_review_index];
  let year_of_case_review = year_options[year_of_case_review_index];


	var filter = {
		year_of_death: year_of_death,
		month_of_case_review: month_of_case_review,
		year_of_case_review: year_of_case_review
	};

	if(g_data)
	{
		var data = process_rows(filter);

		//console.log(data);
    var post_html_callback = [];
		var render_result = [];
    render_result.push("<h2>Year of Death: ");
    render_result.push(filter.year_of_death);
    render_result.push("</h2>");
    render_result.push("<h2>Year and Month of Case Review: ");
    render_result.push(filter.year_of_case_review);
    render_result.push("&nbsp;");
    render_result.push(filter.month_of_case_review);
    render_result.push("</h2>");

		Array.prototype.push.apply(render_result, render_total_number_of_cases_by_pregnancy_relatedness(data, post_html_callback));
		Array.prototype.push.apply(render_result, render_total_number_of_pregnancy_related_deaths_by_ethnicity(data));
		Array.prototype.push.apply(render_result, render_total_number_of_pregnancy_associated_by_ethnicity(data));

		document.getElementById('report_output_id').innerHTML = render_result.join("");
	}
	else
	{
		document.getElementById('report_output_id').innerHTML = "";
	}

  if(post_html_callback.length > 0)
  {
    try
    {
      eval(post_html_callback.join(""));

    }
    catch(ex)
    {
      console.log(ex);
    }
  }
}


function process_rows(p_filter)
{
	var result = {
  "_id": "summary_row",
  "year_of_death": 0,
  "month_of_case_review": 0,
  "year_of_case_review": 0,
  "total_number_of_cases_by_pregnancy_relatedness": {
    "pregnancy_related": 0,
    "pregnancy_associated_but_not_related": 0,
    "not_pregnancy_related_or_associated": 0,
    "unable_to_determine": 0,
    "blank": 0
  },
  "total_number_of_pregnancy_related_deaths_by_ethnicity": {
    "blank": 0,
    "hispanic": 0,
    "non_hispanic_black": 0,
    "non_hispanic_white": 0,
    "american_indian_alaska_native": 0,
    "native_hawaiian": 0,
    "guamanian_or_chamorro": 0,
    "samoan": 0,
    "other_pacific_islander": 0,
    "asian_indian": 0,
    "filipino": 0,
    "korean": 0,
    "other_asian": 0,
    "chinese": 0,
    "japanese": 0,
    "vietnamese": 0,
    "other": 0
  },
  "total_number_of_pregnancy_associated_by_ethnicity": {
    "blank": 0,
    "hispanic": 0,
    "non_hispanic_black": 0,
    "non_hispanic_white": 0,
    "american_indian_alaska_native": 0,
    "native_hawaiian": 0,
    "guamanian_or_chamorro": 0,
    "samoan": 0,
    "other_pacific_islander": 0,
    "asian_indian": 0,
    "filipino": 0,
    "korean": 0,
    "other_asian": 0,
    "chinese": 0,
    "japanese": 0,
    "vietnamese": 0,
    "other": 0
  },
  "total_number_of_pregnancy_related_deaths_by_age": {
    "age_less_than_20": 0,
    "age_20_to_24": 0,
    "age_25_to_29": 0,
    "age_30_to_34": 0,
    "age_35_to_44": 0,
    "age_45_and_above": 0,
    "blank": 0
  },
  "total_number_of_pregnancy_associated_deaths_by_age": {
    "age_less_than_20": 0,
    "age_20_to_24": 0,
    "age_25_to_29": 0,
    "age_30_to_34": 0,
    "age_35_to_44": 0,
    "age_45_and_above": 0,
    "blank": 0
  },
  "total_number_pregnancy_related_at_time_of_death": {
    "pregnant_at_the_time_of_death": 0,
    "pregnant_within_42_days_of_death": 0,
    "pregnant_within_43_to_365_days_of_death": 0,
    "blank": 0
  },
  "total_number_pregnancy_associated_at_time_of_death": {
    "pregnant_at_the_time_of_death": 0,
    "pregnant_within_42_days_of_death": 0,
    "pregnant_within_43_to_365_days_of_death": 0,
    "blank": 0
  }
};

	
	for(var i = 0; i < g_data.length; i++)
	{
		var current_row = g_data[i];
		if
		(
			(p_filter.year_of_death == "All" || parseInt(p_filter.year_of_death) == current_row.year_of_death) &&
			(p_filter.month_of_case_review == "All" || parseInt(p_filter.month_of_case_review) == current_row.month_of_case_review) &&
			(p_filter.year_of_case_review == "All" || parseInt(p_filter.year_of_case_review) == current_row.year_of_case_review)
		)
		{
			accumulate_render_total_number_of_cases_by_pregnancy_relatedness(result, current_row);
			accumulate_render_total_number_of_pregnancy_related_deaths_by_ethnicity(result, current_row);
			accumulate_render_total_number_of_pregnancy_associated_by_ethnicity(result, current_row);
		}
	}
	 

	

	return result;
}

function accumulate_render_total_number_of_pregnancy_associated_by_ethnicity(p_data, p_current_row)
{
	p_data.total_number_of_pregnancy_associated_by_ethnicity.blank += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.blank;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.hispanic += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.hispanic;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.non_hispanic_black += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.non_hispanic_black;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.non_hispanic_white += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.non_hispanic_white;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.american_indian_alaska_native += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.american_indian_alaska_native;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.native_hawaiian += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.native_hawaiian;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.guamanian_or_chamorro += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.guamanian_or_chamorro;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.samoan += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.samoan;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.other_pacific_islander += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.other_pacific_islander;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.asian_indian += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.asian_indian;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.filipino += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.filipino;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.korean += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.korean;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.other_asian += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.other_asian;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.chinese += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.chinese;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.japanese += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.japanese;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.vietnamese += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.vietnamese;
    p_data.total_number_of_pregnancy_associated_by_ethnicity.other += p_current_row.total_number_of_pregnancy_associated_by_ethnicity.other;


    p_data.total_number_of_pregnancy_related_deaths_by_age.age_less_than_20 += p_current_row.total_number_of_pregnancy_related_deaths_by_age.age_less_than_20;
    p_data.total_number_of_pregnancy_related_deaths_by_age.age_20_to_24 += p_current_row.total_number_of_pregnancy_related_deaths_by_age.age_20_to_24;
    p_data.total_number_of_pregnancy_related_deaths_by_age.age_25_to_29 += p_current_row.total_number_of_pregnancy_related_deaths_by_age.age_25_to_29;
    p_data.total_number_of_pregnancy_related_deaths_by_age.age_30_to_34 += p_current_row.total_number_of_pregnancy_related_deaths_by_age.age_30_to_34;
    p_data.total_number_of_pregnancy_related_deaths_by_age.age_35_to_44 += p_current_row.total_number_of_pregnancy_related_deaths_by_age.age_35_to_44;
    p_data.total_number_of_pregnancy_related_deaths_by_age.age_45_and_above += p_current_row.total_number_of_pregnancy_related_deaths_by_age.age_45_and_above;
    p_data.total_number_of_pregnancy_related_deaths_by_age.blank += p_current_row.total_number_of_pregnancy_related_deaths_by_age.blank;
  
	p_data.total_number_of_pregnancy_associated_deaths_by_age.age_less_than_20 += p_current_row.total_number_of_pregnancy_associated_deaths_by_age.age_less_than_20;
    p_data.total_number_of_pregnancy_associated_deaths_by_age.age_20_to_24 += p_current_row.total_number_of_pregnancy_associated_deaths_by_age.age_20_to_24;
    p_data.total_number_of_pregnancy_associated_deaths_by_age.age_25_to_29 += p_current_row.total_number_of_pregnancy_associated_deaths_by_age.age_25_to_29;
    p_data.total_number_of_pregnancy_associated_deaths_by_age.age_30_to_34 += p_current_row.total_number_of_pregnancy_associated_deaths_by_age.age_30_to_34;
    p_data.total_number_of_pregnancy_associated_deaths_by_age.age_35_to_44 += p_current_row.total_number_of_pregnancy_associated_deaths_by_age.age_35_to_44;
    p_data.total_number_of_pregnancy_associated_deaths_by_age.age_45_and_above += p_current_row.total_number_of_pregnancy_associated_deaths_by_age.age_45_and_above;
    p_data.total_number_of_pregnancy_associated_deaths_by_age.blank += p_current_row.total_number_of_pregnancy_associated_deaths_by_age.blank;


	p_data.total_number_pregnancy_related_at_time_of_death.pregnant_at_the_time_of_death += p_current_row.total_number_pregnancy_related_at_time_of_death.pregnant_at_the_time_of_death;
	p_data.total_number_pregnancy_related_at_time_of_death.pregnant_within_42_days_of_death += p_current_row.total_number_pregnancy_related_at_time_of_death.pregnant_within_42_days_of_death;
	p_data.total_number_pregnancy_related_at_time_of_death.pregnant_within_43_to_365_days_of_death += p_current_row.total_number_pregnancy_related_at_time_of_death.pregnant_within_43_to_365_days_of_death;
	p_data.total_number_pregnancy_related_at_time_of_death.blank += p_current_row.total_number_pregnancy_related_at_time_of_death.blank;

	p_data.total_number_pregnancy_associated_at_time_of_death.pregnant_at_the_time_of_death += p_current_row.total_number_pregnancy_associated_at_time_of_death.pregnant_at_the_time_of_death;
	p_data.total_number_pregnancy_associated_at_time_of_death.pregnant_within_42_days_of_death += p_current_row.total_number_pregnancy_associated_at_time_of_death.pregnant_within_42_days_of_death;
	p_data.total_number_pregnancy_associated_at_time_of_death.pregnant_within_43_to_365_days_of_death += p_current_row.total_number_pregnancy_associated_at_time_of_death.pregnant_within_43_to_365_days_of_death;
	p_data.total_number_pregnancy_associated_at_time_of_death.blank += p_current_row.total_number_pregnancy_associated_at_time_of_death.blank;

}


function accumulate_render_total_number_of_pregnancy_related_deaths_by_ethnicity(p_data, p_current_row)
{
	p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.blank += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.blank;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.hispanic += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.hispanic;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.non_hispanic_black += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.non_hispanic_black;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.non_hispanic_white += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.non_hispanic_white;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.american_indian_alaska_native += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.american_indian_alaska_native;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.native_hawaiian += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.native_hawaiian;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.guamanian_or_chamorro += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.guamanian_or_chamorro;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.samoan += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.samoan;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.other_pacific_islander += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.other_pacific_islander;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.asian_indian += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.asian_indian;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.filipino += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.filipino;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.korean += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.korean;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.other_asian += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.other_asian;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.chinese += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.chinese;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.japanese += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.japanese;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.vietnamese += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.vietnamese;
    p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.other += p_current_row.total_number_of_pregnancy_related_deaths_by_ethnicity.other;
}

function accumulate_render_total_number_of_cases_by_pregnancy_relatedness(p_data, p_current_row)
{
	p_data.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related += p_current_row.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related;
	p_data.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related += p_current_row.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related;
	p_data.total_number_of_cases_by_pregnancy_relatedness.not_pregnancy_related_or_associated += p_current_row.total_number_of_cases_by_pregnancy_relatedness.not_pregnancy_related_or_associated
	p_data.total_number_of_cases_by_pregnancy_relatedness.unable_to_determine += p_current_row.total_number_of_cases_by_pregnancy_relatedness.unable_to_determine;
	p_data.total_number_of_cases_by_pregnancy_relatedness.blank += p_current_row.total_number_of_cases_by_pregnancy_relatedness.blank;
}

function render_total_number_of_cases_by_pregnancy_relatedness(p_data, p_post_html_callback)
{
	var result = [];
  result.push("<div id='total_number_of_cases_by_pregnancy_relatedness'></div>");
	result.push("<p><b>Total Number of Cases by Pregnancy-Relatedness</b><br/><ul>");
	result.push("<li>Pregnancy-Related: ");result.push(p_data.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related);
	result.push("</li><li>Pregnancy Associated But NOT Related: ");result.push(p_data.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related);
	result.push("</li><li>Not Pregnancy-Related or Associated (i.e. False Positive): ");result.push(p_data.total_number_of_cases_by_pregnancy_relatedness.not_pregnancy_related_or_associated);
	result.push("</li><li>Pregnancy-Associated but Unable to Determine Pregnancy-Relatedness: ");result.push(p_data.total_number_of_cases_by_pregnancy_relatedness.unable_to_determine);
	result.push("</li><li>Blank: ");result.push(p_data.total_number_of_cases_by_pregnancy_relatedness.blank);
	result.push("</li></ul></p>");




p_post_html_callback.push("var chart = c3.generate({");
p_post_html_callback.push(" bindto: '#total_number_of_cases_by_pregnancy_relatedness',");
p_post_html_callback.push("    data: {");
p_post_html_callback.push("        columns: [");
p_post_html_callback.push("            ['Pregnancy-Related',  ");p_post_html_callback.push(p_data.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related);p_post_html_callback.push("],");
p_post_html_callback.push("            ['Pregnancy Associated But NOT Related',  ");p_post_html_callback.push(p_data.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related);p_post_html_callback.push("],");
//p_post_html_callback.push("            ['Not Pregnancy-Related or Associated (i.e. False Positive)',  ");p_post_html_callback.push(p_data.total_number_of_cases_by_pregnancy_relatedness.not_pregnancy_related_or_associated);p_post_html_callback.push("],");
//p_post_html_callback.push("            ['Unable to Determine if Pregnancy-Related or Associated',  ");p_post_html_callback.push(p_data.total_number_of_cases_by_pregnancy_relatedness.unable_to_determine);p_post_html_callback.push("],");
//p_post_html_callback.push("            ['blank', ");p_post_html_callback.push(p_data.total_number_of_cases_by_pregnancy_relatedness.blank);p_post_html_callback.push("]");
p_post_html_callback.push("        ],");
p_post_html_callback.push("        type: 'pie'");
p_post_html_callback.push("    },");

p_post_html_callback.push("    pie: {");
p_post_html_callback.push("    }");
p_post_html_callback.push("});");




	return result;
}

function render_total_number_of_pregnancy_related_deaths_by_ethnicity(p_data)
{
	var result = [];
	result.push("<p><b>Number of Pregnancy-Related Deaths by Race-Ethnicity</b><br/><ul>");
    result.push("<li>Hispanic: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.hispanic);
    result.push("</li><li>Non-Hispanic Black: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.non_hispanic_black);
    result.push("</li><li>Non-Hispanic White: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.non_hispanic_white);
    result.push("</li><li>American Indian/Alaska Native: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.american_indian_alaska_native);
    result.push("</li><li>Native Hawaiian: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.native_hawaiian);
    result.push("</li><li>Guamanian or Chamorro: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.guamanian_or_chamorro);
    result.push("</li><li>Samoan: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.samoan);
    result.push("</li><li>Other Pacific Islander: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.other_pacific_islander);
    result.push("</li><li>Asian Indian: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.asian_indian);
    result.push("</li><li>Filipino: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.filipino);
    result.push("</li><li>Korean: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.korean);
    result.push("</li><li>Other Asian: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.other_asian);
    result.push("</li><li>Chinese: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.chinese);
    result.push("</li><li>Japanese: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.japanese);
    result.push("</li><li>Vietnamese: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.vietnamese);
    result.push("</li><li>Other: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.other);
	result.push("</li><li>Blank: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_ethnicity.blank);
	result.push("</li></ul></p>");
	return result;
}


function render_total_number_of_pregnancy_associated_by_ethnicity(p_data)
{
	var result = [];
	result.push("<p><b>Number of Pregnancy Associated but NOT Related Deaths by Race-Ethnicity</b><br/><ul>");
    result.push("<li>Hispanic: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.hispanic);
    result.push("</li><li>Non-Hispanic Black: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.non_hispanic_black);
    result.push("</li><li>Non-Hispanic White: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.non_hispanic_white);
    result.push("</li><li>American Indian/Alaska Native: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.american_indian_alaska_native);
    result.push("</li><li>Native Hawaiian: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.native_hawaiian);
    result.push("</li><li>Guamanian or Chamorro: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.guamanian_or_chamorro);
    result.push("</li><li>Samoan: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.samoan);
    result.push("</li><li>Other Pacific Islander: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.other_pacific_islander);
    result.push("</li><li>Asian Indian: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.asian_indian);
    result.push("</li><li>Filipino: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.filipino);
    result.push("</li><li>Korean: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.korean);
    result.push("</li><li>Other Asian: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.other_asian);
    result.push("</li><li>Chinese: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.chinese);
    result.push("</li><li>Japanese: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.japanese);
    result.push("</li><li>Vietnamese: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.vietnamese);
    result.push("</li><li>Other: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.other);
	result.push("</li><li>Blank: ");result.push(p_data.total_number_of_pregnancy_associated_by_ethnicity.blank);
	result.push("</li></ul></p>");


	result.push("<p><b>Number of Pregnancy-Related Deaths by Age at Death</b><br/><ul>");
  	result.push("</li><li>Age less than 20: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_age.age_less_than_20);
    result.push("</li><li>Age 20 to 24: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_age.age_20_to_24);
    result.push("</li><li>Age 25 to 29: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_age.age_25_to_29);
    result.push("</li><li>Age 30 to 34: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_age.age_30_to_34);
    result.push("</li><li>Age 35 to 44: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_age.age_35_to_44);
    result.push("</li><li>Age 45 and above: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_age.age_45_and_above);
    result.push("</li><li>Blank: ");result.push(p_data.total_number_of_pregnancy_related_deaths_by_age.blank);
  	result.push("</li></ul></p>");

  	result.push("<p><b>Number of Pregnancy Associated but NOT Related Deaths by Age at Death</b><br/><ul>");
	result.push("</li><li>Age less than 20: ");result.push(p_data.total_number_of_pregnancy_associated_deaths_by_age.age_less_than_20);
    result.push("</li><li>Age 20 to 24: ");result.push(p_data.total_number_of_pregnancy_associated_deaths_by_age.age_20_to_24);
    result.push("</li><li>Age 25 to 29: ");result.push(p_data.total_number_of_pregnancy_associated_deaths_by_age.age_25_to_29);
    result.push("</li><li>Age 30 to 34: ");result.push(p_data.total_number_of_pregnancy_associated_deaths_by_age.age_30_to_34);
    result.push("</li><li>Age 35 to 44: ");result.push(p_data.total_number_of_pregnancy_associated_deaths_by_age.age_35_to_44);
    result.push("</li><li>Age 45 and above: ");result.push(p_data.total_number_of_pregnancy_associated_deaths_by_age.age_45_and_above);
    result.push("</li><li>Blank: ");result.push(p_data.total_number_of_pregnancy_associated_deaths_by_age.blank);
	result.push("</li></ul></p>");

	result.push("<p><b>Number of Pregnancy-Related Deaths by Timing of Death in Relation to Pregnancy</b><br/><ul>");
	result.push("</li><li>Pregnant at the time of death: ");result.push(p_data.total_number_pregnancy_related_at_time_of_death.pregnant_at_the_time_of_death);
	result.push("</li><li>Pregnant within 42 days of death: ");result.push(p_data.total_number_pregnancy_related_at_time_of_death.pregnant_within_42_days_of_death);
	result.push("</li><li>Pregnant within 43 to 365 days of death: ");result.push(p_data.total_number_pregnancy_related_at_time_of_death.pregnant_within_43_to_365_days_of_death);
	result.push("</li><li>Blank: ");result.push(p_data.total_number_pregnancy_related_at_time_of_death.blank);
	result.push("</li></ul></p>");


	result.push("<p><b>Number of Pregnancy-Associated but NOT Related Deaths by Timing of Death in Relation to Pregnancy</b><br/><ul>");
	result.push("</li><li>Pregnant at the time of death: ");result.push(p_data.total_number_pregnancy_associated_at_time_of_death.pregnant_at_the_time_of_death);
	result.push("</li><li>Pregnant within 42 days of death: ");result.push(p_data.total_number_pregnancy_associated_at_time_of_death.pregnant_within_42_days_of_death);
	result.push("</li><li>Pregnant within 43 to 365 days of death: ");result.push(p_data.total_number_pregnancy_associated_at_time_of_death.pregnant_within_43_to_365_days_of_death);
	result.push("</li><li>Blank: ");result.push(p_data.total_number_pregnancy_associated_at_time_of_death.blank);
	result.push("</li></ul></p>");


	return result;
}


function create_summary_row(p_row)
{
	var result = {};

	for(var i in p_row)
	{
		if(!p_row.hasOwnProperty(i)) continue;

		if(i!= "id")
		{
			result[i] = {};
		}
	}

	return result;
}

function create_detail_row(p_summary, p_row)
{
	var result = {};

	for(var i in p_row)
	{
		if(!p_row.hasOwnProperty(i)) continue;

		if(i!= "id")
		{
			if(p_summary[i] == null)
			{
				p_summary[i] = {};
			}
			

			if(p_summary[i][p_row[i]])
			{
				
				if((i == "date_of_review" || i == "dc_date_of_death") && p_row[i])
				{
					var val = new Date(p_row[i]);
					var key = [];
					key.push(val.getFullYear());
					key.push(pad(val.getMonth()+1,2));
					key.push(pad(val.getDate(),2));

					var whole_key = key.join("-");
					if(p_summary[i][whole_key])
					{
						p_summary[i][whole_key]++;
					}
					else
					{
						p_summary[i][whole_key] = 1;
					}
				}
				else
				{
					p_summary[i][p_row[i]]++;
				}
				
			}
			else
			{
				if((i == "date_of_review" || i == "dc_date_of_death") && p_row[i])
				{
					var val = new Date(p_row[i]);
					var key = [];
					key.push(val.getFullYear());
					key.push(pad(val.getMonth()+1,2));
					key.push(pad(val.getDate(),2));

					var whole_key = key.join("-");
					
					p_summary[i][whole_key] = 1;
				}
				else
				{
					p_summary[i][p_row[i]] = 1;
				}
			}
		}
	}

	return result;
}

function pad(n, width) 
{
  z = '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
// death_certificate/Race/race
//birth_fetal_death_certificate_parent/race_of_mother

var summary_row = {
'id': [],
'hr_date_of_death_year': [],
'dc_date_of_death': [],
'date_of_review':  [],
'was_this_death_preventable':  [],
'pregnancy_relatedness':  [],
'bc_is_of_hispanic_origin':  [],
'dc_is_of_hispanic_origin':  [],
'age':  [],
'pmss':  [],
'did_obesity_contribute_to_the_death': [],
'did_mental_health_conditions_contribute_to_the_death': [],
'did_substance_use_disorder_contribute_to_the_death': [],
'was_this_death_a_sucide': [],
'was_this_death_a_homicide': [],
'bc_race':[],
'dc_race':[]
};

var total_row = 
{
Pregnancy_Relatedness : [],
Pregnancy_Related_Deaths_by_Race_Ethnicity : [],
Pregnancy_Related_Deaths_by_Timing_of_Death_in_Relation_to_Pregnancy : [],
Pregnancy_Related_Deaths_Determined_to_be_Preventable : [],
Pregnancy_Related_Deaths_by_Age_at_Death : [],
Pregnancy_Related_Deaths_Where_Obesity_Contributed_to_the_Death : [],
Pregnancy_Associated_but_NOT_Related_Deaths_by_Race_Ethnicity : [],
Pregnancy_Associated_Deaths_by_Timing_of_Death_in_Relation_to_Pregnancy : [],
Pregnancy_Associated_but_NOT_Related_Deaths_Determined_to_be_Preventable : [],
Pregnancy_Associated_but_NOT_Related_Deaths_by_Age_at_Death : []
}

/*
Pregnancy Relatedness
Pregnancy Related Deaths by Race-Ethnicity
Pregnancy Related Deaths by Timing of Death in Relation to Pregnancy
Pregnancy Related Deaths Determined to be Preventable
Pregnancy Related Deaths by Age at Death
Pregnancy Related Deaths Where Obesity Contributed to the Death

Pregnancy Associated but NOT Related Deaths by Race-Ethnicity
Pregnancy-Associated Deaths by Timing of Death in Relation to Pregnancy
Pregnancy Associated but NOT Related Deaths Determined to be Preventable
Pregnancy Associated but NOT Related Deaths by Age at Death
*/

/*
var row = {
'id': doc._id,
'hr_date_of_death_year': doc.home_record.date_of_death.year,
'dc_date_of_death':doc.death_certificate.certificate_identification.date_of_death,
'date_of_review': doc.committee_review.date_of_review,
'was_this_death_preventable': doc.committee_review.was_this_death_preventable,
'pregnancy_relatedness': doc.committee_review.pregnancy_relatedness,
'bc_is_of_hispanic_origin': doc.birth_fetal_death_certificate_parent.demographic_of_mother.is_of_hispanic_origin,
'dc_is_of_hispanic_origin': doc.death_certificate.demographics.is_of_hispanic_origin,
'age':doc.death_certificate.demographics.age,
'pmss': doc.committee_review.pmss_mm,
'did_obesity_contribute_to_the_death':doc.committee_review.did_obesity_contribute_to_the_death,
'did_mental_health_conditions_contribute_to_the_death':doc.committee_review.did_mental_health_conditions_contribute_to_the_death,
'did_substance_use_disorder_contribute_to_the_death':doc.committee_review.did_substance_use_disorder_contribute_to_the_death,
'was_this_death_a_sucide':doc.committee_review.was_this_death_a_sucide,
'was_this_death_a_homicide':doc.committee_review.homicide_relatedness.was_this_death_a_homicide 
};
*/