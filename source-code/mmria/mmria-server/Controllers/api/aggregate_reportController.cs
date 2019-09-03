using System;
using System.Collections.Generic;
using System.Linq;

using Microsoft.AspNetCore.Mvc;

using mmria.common;

namespace mmria.server
{

	[Route("api/[controller]")]
	public class aggregate_reportController: ControllerBase 
	{ 
		public aggregate_reportController()
		{

		}

		[HttpGet]
        public async System.Threading.Tasks.Task<IList<mmria.server.model.c_report_object>> Get()
		{

			List<mmria.server.model.c_report_object> result =  new List<mmria.server.model.c_report_object>();

			System.Console.WriteLine ("Recieved message.");

			
			try
			{
				string request_string = this.get_couch_db_url() + "/report/_all_docs?include_docs=true";

				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

				request.PreAuthenticate = false;


				if (!string.IsNullOrWhiteSpace(this.Request.Cookies["AuthSession"]))
                {
                    string auth_session_value = this.Request.Cookies["AuthSession"];
                    request.Headers.Add("Cookie", "AuthSession=" + auth_session_value);
                    request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_value);
                }


				System.Net.WebResponse response = await request.GetResponseAsync();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				string all_docs_result = reader.ReadToEnd ();

				System.Dynamic.ExpandoObject expando_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(all_docs_result, new  Newtonsoft.Json.Converters.ExpandoObjectConverter());

				IDictionary<string,object> all_docs_dictionary = expando_result as IDictionary<string,object>;
				List<object> row_list = null;

				if(all_docs_dictionary != null && all_docs_dictionary.ContainsKey("rows"))
				{
					row_list = all_docs_dictionary ["rows"] as List<object> ;
				}
				

				if(row_list != null)
				foreach (object row_item in row_list)
				{
					IDictionary<string, object> row_dictionary = row_item as IDictionary<string, object>; 

					if(row_dictionary != null && row_dictionary.ContainsKey("doc"))
					{
						KeyValuePair<bool,mmria.server.model.c_report_object> convert_result = convert(row_dictionary["doc"]  as IDictionary<string,object>);
						if(convert_result.Key)
						{
							result.Add(convert_result.Value);
						}
					}
	
				}

			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}


			//return result;
			return result;
		} 


		private KeyValuePair<bool,mmria.server.model.c_report_object> convert (IDictionary<string, object> p_item)
		{
			
 			mmria.server.model.c_report_object  temp = new mmria.server.model.c_report_object ();
			bool is_complete_conversion = true;

			temp._id = p_item ["_id"].ToString ();
		
			int val = 0;


			try
			{

				if (p_item.ContainsKey("year_of_death") &&  p_item ["year_of_death"] != null && int.TryParse (p_item ["year_of_death"].ToString (), out val)) 
				{
					temp.year_of_death = val;
				}
				if (p_item.ContainsKey("year_of_case_review") &&  p_item ["year_of_case_review"] != null && int.TryParse (p_item ["year_of_case_review"].ToString (), out val))
				{
					temp.year_of_case_review = val; 
				}
				if (p_item.ContainsKey("month_of_case_review") &&  p_item ["month_of_case_review"] != null && int.TryParse (p_item ["month_of_case_review"].ToString (), out val)) 
				{
					temp.month_of_case_review = val; 
				}


				IDictionary<string, object> current_dictionary = p_item ["total_number_of_cases_by_pregnancy_relatedness"] as IDictionary<string, object>;

				if(current_dictionary != null)
				{
					temp.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related = int.Parse (current_dictionary ["pregnancy_related"].ToString ());
					temp.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related = int.Parse (current_dictionary ["pregnancy_associated_but_not_related"].ToString ());
					temp.total_number_of_cases_by_pregnancy_relatedness.not_pregnancy_related_or_associated = int.Parse (current_dictionary ["not_pregnancy_related_or_associated"].ToString ());
					temp.total_number_of_cases_by_pregnancy_relatedness.unable_to_determine = int.Parse (current_dictionary ["unable_to_determine"].ToString ());
					temp.total_number_of_cases_by_pregnancy_relatedness.blank = int.Parse (current_dictionary ["blank"].ToString ());
				}
				current_dictionary = p_item ["total_number_of_pregnancy_related_deaths_by_ethnicity"] as IDictionary<string, object>;
			
				if(current_dictionary != null)
				{
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.blank = int.Parse (current_dictionary ["blank"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.hispanic = int.Parse (current_dictionary ["hispanic"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.non_hispanic_black = int.Parse (current_dictionary ["non_hispanic_black"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.non_hispanic_white = int.Parse (current_dictionary ["non_hispanic_white"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.american_indian_alaska_native = int.Parse (current_dictionary ["american_indian_alaska_native"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.native_hawaiian = int.Parse (current_dictionary ["native_hawaiian"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.guamanian_or_chamorro = int.Parse (current_dictionary ["guamanian_or_chamorro"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.samoan = int.Parse (current_dictionary ["samoan"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.other_pacific_islander = int.Parse (current_dictionary ["other_pacific_islander"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.asian_indian = int.Parse (current_dictionary ["asian_indian"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.filipino = int.Parse (current_dictionary ["filipino"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.korean = int.Parse (current_dictionary ["korean"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.other_asian = int.Parse (current_dictionary ["other_asian"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.chinese = int.Parse (current_dictionary ["chinese"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.japanese = int.Parse (current_dictionary ["japanese"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.vietnamese = int.Parse (current_dictionary ["vietnamese"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_ethnicity.other = int.Parse (current_dictionary ["other"].ToString ());
				}

				current_dictionary = p_item ["total_number_of_pregnancy_associated_by_ethnicity"] as IDictionary<string, object>;

				if(current_dictionary != null)
				{		
					temp.total_number_of_pregnancy_associated_by_ethnicity.blank = int.Parse (current_dictionary ["blank"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.hispanic = int.Parse (current_dictionary ["hispanic"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.non_hispanic_black = int.Parse (current_dictionary ["non_hispanic_black"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.non_hispanic_white = int.Parse (current_dictionary ["non_hispanic_white"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.american_indian_alaska_native = int.Parse (current_dictionary ["american_indian_alaska_native"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.native_hawaiian = int.Parse (current_dictionary ["native_hawaiian"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.guamanian_or_chamorro = int.Parse (current_dictionary ["guamanian_or_chamorro"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.samoan = int.Parse (current_dictionary ["samoan"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.other_pacific_islander = int.Parse (current_dictionary ["other_pacific_islander"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.asian_indian = int.Parse (current_dictionary ["asian_indian"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.filipino = int.Parse (current_dictionary ["filipino"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.korean = int.Parse (current_dictionary ["korean"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.other_asian = int.Parse (current_dictionary ["other_asian"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.chinese = int.Parse (current_dictionary ["chinese"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.japanese = int.Parse (current_dictionary ["japanese"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.vietnamese = int.Parse (current_dictionary ["vietnamese"].ToString ());
					temp.total_number_of_pregnancy_associated_by_ethnicity.other = int.Parse (current_dictionary ["other"].ToString ());
				}

				current_dictionary = p_item ["total_number_of_pregnancy_related_deaths_by_age"] as IDictionary<string, object>;

				if(current_dictionary != null)
				{
					temp.total_number_of_pregnancy_related_deaths_by_age.age_less_than_20 = int.Parse (current_dictionary ["age_less_than_20"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_age.age_20_to_24 = int.Parse (current_dictionary ["age_20_to_24"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_age.age_25_to_29 = int.Parse (current_dictionary ["age_25_to_29"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_age.age_30_to_34 = int.Parse (current_dictionary ["age_30_to_34"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_age.age_35_to_44 = int.Parse (current_dictionary ["age_35_to_44"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_age.age_45_and_above = int.Parse (current_dictionary ["age_45_and_above"].ToString ());
					temp.total_number_of_pregnancy_related_deaths_by_age.blank = int.Parse (current_dictionary ["blank"].ToString ());
				}

				current_dictionary = p_item ["total_number_of_pregnancy_associated_deaths_by_age"] as IDictionary<string, object>;

				if(current_dictionary != null)
				{
					temp.total_number_of_pregnancy_associated_deaths_by_age.age_less_than_20 = int.Parse (current_dictionary ["age_less_than_20"].ToString ());
					temp.total_number_of_pregnancy_associated_deaths_by_age.age_20_to_24 = int.Parse (current_dictionary ["age_20_to_24"].ToString ());
					temp.total_number_of_pregnancy_associated_deaths_by_age.age_25_to_29 = int.Parse (current_dictionary ["age_25_to_29"].ToString ());
					temp.total_number_of_pregnancy_associated_deaths_by_age.age_30_to_34 = int.Parse (current_dictionary ["age_30_to_34"].ToString ());
					temp.total_number_of_pregnancy_associated_deaths_by_age.age_35_to_44 = int.Parse (current_dictionary ["age_35_to_44"].ToString ());
					temp.total_number_of_pregnancy_associated_deaths_by_age.age_45_and_above = int.Parse (current_dictionary ["age_45_and_above"].ToString ());
					temp.total_number_of_pregnancy_associated_deaths_by_age.blank = int.Parse (current_dictionary ["blank"].ToString ());
				}


				current_dictionary = p_item ["total_number_pregnancy_related_at_time_of_death"] as IDictionary<string, object>;

				if(current_dictionary != null)
				{
					temp.total_number_pregnancy_related_at_time_of_death.pregnant_at_the_time_of_death = int.Parse (current_dictionary ["pregnant_at_the_time_of_death"].ToString ());
					temp.total_number_pregnancy_related_at_time_of_death.pregnant_within_42_days_of_death = int.Parse (current_dictionary ["pregnant_within_42_days_of_death"].ToString ());
					temp.total_number_pregnancy_related_at_time_of_death.pregnant_within_43_to_365_days_of_death = int.Parse (current_dictionary ["pregnant_within_43_to_365_days_of_death"].ToString ());
					temp.total_number_pregnancy_related_at_time_of_death.blank = int.Parse (current_dictionary ["blank"].ToString ());
				}

				current_dictionary = p_item ["total_number_pregnancy_associated_at_time_of_death"] as IDictionary<string, object>;

				if(current_dictionary != null)
				{
					temp.total_number_pregnancy_associated_at_time_of_death.pregnant_at_the_time_of_death = int.Parse (current_dictionary ["pregnant_at_the_time_of_death"].ToString ());
					temp.total_number_pregnancy_associated_at_time_of_death.pregnant_within_42_days_of_death = int.Parse (current_dictionary ["pregnant_within_42_days_of_death"].ToString ());
					temp.total_number_pregnancy_associated_at_time_of_death.pregnant_within_43_to_365_days_of_death = int.Parse (current_dictionary ["pregnant_within_43_to_365_days_of_death"].ToString ());
					temp.total_number_pregnancy_associated_at_time_of_death.blank = int.Parse (current_dictionary ["blank"].ToString ());
				}
			}
			catch (Exception ex)
			{
				System.Console.WriteLine(ex);
				is_complete_conversion = false;
			}

			
			return new KeyValuePair<bool,mmria.server.model.c_report_object>(is_complete_conversion, temp);
		}



		private string get_couch_db_url()
		{
            string result = Program.config_couchdb_url;

			return result;
		}
	} 
}

