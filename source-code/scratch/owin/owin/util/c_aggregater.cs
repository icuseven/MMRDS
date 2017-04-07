using System;
using System.Collections.Generic;

namespace mmria.server.util
{
	public class c_aggregator
	{
		string source_json;

		string temp = 

		@"
		'id': doc._id,
		'hr_date_of_death_year': doc.home_record.date_of_death.year,
		'dc_date_of_death': doc.death_certificate.certificate_identification.date_of_death,
		'date_of_review': doc.committee_review.date_of_review,
		'was_this_death_preventable': doc.committee_review.was_this_death_preventable,
		'pregnancy_relatedness': doc.committee_review.pregnancy_relatedness,
		'bc_is_of_hispanic_origin': doc.birth_fetal_death_certificate_parent.demographic_of_mother.is_of_hispanic_origin,
		'dc_is_of_hispanic_origin': doc.death_certificate.demographics.is_of_hispanic_origin,
		'age': doc.death_certificate.demographics.age,
		'pmss': doc.committee_review.pmss_mm,
		'did_obesity_contribute_to_the_death': doc.committee_review.did_obesity_contribute_to_the_death,
		'did_mental_health_conditions_contribute_to_the_death': doc.committee_review.did_mental_health_conditions_contribute_to_the_death,
		'did_substance_use_disorder_contribute_to_the_death': doc.committee_review.did_substance_use_disorder_contribute_to_the_death,
		'was_this_death_a_sucide': doc.committee_review.was_this_death_a_sucide,
		'was_this_death_a_homicide': doc.committee_review.homicide_relatedness.was_this_death_a_homicide,
		'dc_race': doc.death_certificate.race.race,
		'bc_race': doc.birth_fetal_death_certificate_parent.race.race_of_mother

";

		static HashSet<string> aggregator_set = new HashSet<string>()
		{
			"_id",
			"home_record/date_of_death/year",
			"death_certificate/certificate_identification/date_of_death",
			"committee_review/date_of_review",
			"committee_review/was_this_death_preventable",
			"committee_review/pregnancy_relatedness",
			"birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin",
			"death_certificate/demographics/is_of_hispanic_origin",
			"death_certificate/demographics/age",
			"committee_review/pmss_mm",
			"committee_review/did_obesity_contribute_to_the_death",
			"committee_review/did_mental_health_conditions_contribute_to_the_death",
			"committee_review/did_substance_use_disorder_contribute_to_the_death",
			"committee_review/was_this_death_a_sucide",
			"committee_review/homicide_relatedness/was_this_death_a_homicide",
			"death_certificate/race/race",
			"birth_fetal_death_certificate_parent/race/race_of_mother"
		};

		public c_aggregator (string p_source_json)
		{

			source_json = p_source_json;
		}



		public string execute()
		{
			string result = null;

			System.Dynamic.ExpandoObject source_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(source_json);



			foreach (string path in aggregator_set) 
			{
				get_value (source_object, path);
			}

			Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
			settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
			result = Newtonsoft.Json.JsonConvert.SerializeObject(source_object, settings);

			return result;
		}


		public dynamic get_value(System.Dynamic.ExpandoObject p_object, string p_path)
		{
			dynamic result = null;

			try
			{
				string[] path = p_path.Split('/');

				System.Text.RegularExpressions.Regex number_regex = new System.Text.RegularExpressions.Regex(@"^\d+$");

				//IDictionary<string, object> index = p_object;
				dynamic index = p_object;

				if (path[1] == "abnormal_conditions_of_newborn")
				{
					System.Console.WriteLine("break");
				}


				for (int i = 0; i < path.Length; i++)
				{
					
					if(i == 0)
					{
						index = ((IDictionary<string, object>)p_object)[path[i]];
					}
					else if (i == path.Length - 1)
					{
						if (index is IDictionary<string, object> && ((IDictionary<string, object>)index).ContainsKey(path[i]))
						{
							var val = ((IDictionary<string, object>)index)[path[i]]; 

							if(val.GetType() == typeof(string))
							{
								((IDictionary<string, object>)index)[path[i]] = "de-identified";	
							}
							else
							{
								((IDictionary<string, object>)index)[path[i]] = null;	
							}
							result = "de-identified";
						}
						else
						{
							System.Console.WriteLine("break");
						}
					}
					else if (index[path[i]] is IList<object>)
					{
						index = index[path[i]] as IList<object>;
					}
					else if (index[path[i]] is IDictionary<string, object> && !index.ContainsKey(path[i]))
					{
						System.Console.WriteLine("Index not found. This should not happen. {0}", p_path);
					}
					else if (index[path[i]] is IDictionary<string, object>)
					{
						index = index[path[i]] as IDictionary<string, object>;
					}
					else
					{
						System.Console.WriteLine("This should not happen. {0}", p_path);
					}
				}
			}
			catch (Exception ex)
			{
				System.Console.WriteLine("case_maker.set_value bad mapping {0}\n {1}", p_path, ex);
			}

			return result;

		}
	}
}

