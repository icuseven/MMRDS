using System;
using System.Collections.Generic;
using System.Linq;

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
		'pmss_mm_secondary': doc.committee_review.pmss_mm_secondary,
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
			"home_record/date_of_death/month",
			"home_record/date_of_death/day",
			"committee_review/date_of_review",
			"committee_review/was_this_death_preventable",
			"committee_review/pregnancy_relatedness",
			"birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin",
			"death_certificate/demographics/is_of_hispanic_origin",
			"death_certificate/demographics/age",
			"committee_review/pmss_mm",
			"committee_review/pmss_mm_secondary",
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

			mmria.server.model.c_aggregate aggregate = null;

			System.Dynamic.ExpandoObject source_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(source_json);
			//dynamic source_object = Newtonsoft.Json.Linq.JObject.Parse(source_json);

			aggregate = new mmria.server.model.c_aggregate();

			aggregate._id = get_value(source_object, "_id");

			if
			(
				aggregate._id == "d0e08da8-d306-4a9a-a5ff-9f1d54702091" 
			)
			{
				System.Console.Write("break");
			}

			object val = null;

			try
			{
				val = get_value(source_object, "home_record/date_of_death/year");
				if(val != null)
				{
					aggregate.hr_date_of_death_year = System.Convert.ToInt64(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}



			try
			{
				val = get_value(source_object, "home_record/date_of_death/month");
				if(val != null)
				{
					aggregate.hr_date_of_death_month = System.Convert.ToInt64(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{
				val = get_value(source_object, "home_record/date_of_death/day");
				if(val != null)
				{
					aggregate.hr_date_of_death_day = System.Convert.ToInt64(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{
				val = get_value(source_object, "committee_review/date_of_review");
				if(val != null)
				{
					aggregate.date_of_review = System.Convert.ToDateTime(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}



			try
			{	
				val = get_value(source_object, "committee_review/pregnancy_relatedness");
				if(val != null)
				{
					aggregate.pregnancy_relatedness = System.Convert.ToString(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}



			try
			{
				val = get_value(source_object, "death_certificate/demographics/age");
				if(val != null)
				{
					aggregate.age = System.Convert.ToString(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{
				val = get_value(source_object, "committee_review/pmss_mm");
				if(val != null)
				{
					aggregate.pmss =System.Convert.ToString(val) ;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


			try
			{
				val = get_value(source_object, "committee_review/pmss_mm_secondary");
				if(val != null)
				{
					aggregate.pmss_mm_secondary = System.Convert.ToString(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


			try
			{
				val = get_value(source_object, "death_certificate/race/race");
				if(val != null)
				{
					aggregate.dc_race = new List<string>();

					foreach(object o in  val as List<object>)
					{
						aggregate.dc_race.Add(o.ToString());
					}
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{
				val = get_value(source_object, "birth_fetal_death_certificate_parent/race/race_of_mother");
				if(val != null)
				{
					aggregate.bc_race = new List<string>();

					foreach(object o in val as List<object>)
					{
						aggregate.bc_race.Add(o.ToString());
					}
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


			try
			{
				val = get_value(source_object, "birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin");
				if(val != null)
				{
					aggregate.bc_is_of_hispanic_origin = System.Convert.ToString(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{
				val = get_value(source_object, "death_certificate/demographics/is_of_hispanic_origin");
				if(val != null)
				{
					aggregate.dc_is_of_hispanic_origin = System.Convert.ToString(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{
				val = get_value(source_object, "committee_review/did_obesity_contribute_to_the_death");
				if(val != null)
				{
					aggregate.did_obesity_contribute_to_the_death = System.Convert.ToString(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


			try
			{
				val = get_value(source_object, "committee_review/did_mental_health_conditions_contribute_to_the_death");
				if(val != null)
				{
					aggregate.did_mental_health_conditions_contribute_to_the_death = System.Convert.ToString(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{
				val = get_value(source_object, "committee_review/did_substance_use_disorder_contribute_to_the_death");
				if(val != null)
				{
					aggregate.did_substance_use_disorder_contribute_to_the_death = System.Convert.ToString(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{
				val = get_value(source_object, "committee_review/was_this_death_preventable");
				if(val != null)
				{
					aggregate.was_this_death_preventable = System.Convert.ToString(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{
				val = get_value(source_object, "committee_review/was_this_death_a_sucide");
				if(val != null)
				{
					aggregate.was_this_death_a_sucide = System.Convert.ToString(val);
				}

			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{
				val = get_value(source_object, "committee_review/homicide_relatedness/was_this_death_a_homicide");
				if(val != null)
				{
					aggregate.was_this_death_a_homicide = System.Convert.ToString(val);
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}



			/*
			foreach (string path in aggregator_set) 
			{
				get_value (source_object, path);
			}*/

			Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
			//settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
			result = Newtonsoft.Json.JsonConvert.SerializeObject(aggregate, settings);

			return result;
		}


		public dynamic get_value(System.Dynamic.ExpandoObject p_object, string p_path, string p_data_type = "string")
		{
			dynamic result = null;

			try
			{
				string[] path = p_path.Split('/');

				System.Text.RegularExpressions.Regex number_regex = new System.Text.RegularExpressions.Regex(@"^\d+$");

				//IDictionary<string, object> index = p_object;
				dynamic index = p_object;

				/*
				if (path[1] == "abnormal_conditions_of_newborn")
				{
					System.Console.WriteLine("break");
				}*/


				for (int i = 0; i < path.Length; i++)
				{
					
					if(i == 0)
					{

						if (i == path.Length - 1 && index is IDictionary<string, object>)
						{
							
							IDictionary<string, object> dictionary_object = index as IDictionary<string, object>;

							object val = null;

							if(dictionary_object.ContainsKey(path[i]))
							{
								val = dictionary_object[path[i]]; 
							}

							if(val != null)
							{
								if(val.GetType() == typeof(System.DateTime))
								{
									System.DateTime? temp_date_time = val as System.DateTime?;
									result = temp_date_time.Value;	
								}
								else if(val.GetType() == typeof(string))
								{
									result = val.ToString();	
								}

								else if(val.GetType() == typeof(System.Collections.Generic.List<string>))
								{
									
									result = val as System.Collections.Generic.List<string>;	
								}
								else if(val.GetType() == typeof(System.Collections.Generic.List<object>))
								{

									result = val as System.Collections.Generic.List<object>;	
								}
								else
								{
									result = val;	
								}
							}
							else
							{
								result = null;	
							}
						}
						else
						{
							index = ((IDictionary<string, object>)p_object)[path[i]];
						}
					}
					else if (i == path.Length - 1)
					{
						if (index is IDictionary<string, object>)
						{

							IDictionary<string, object> dictionary_object = index as IDictionary<string, object>;

							object val = null;

							if(dictionary_object.ContainsKey(path[i]))
							{
									val = dictionary_object[path[i]]; 
							}

							if(val != null)
							{
								if(val.GetType() == typeof(System.DateTime))
								{
									System.DateTime? temp_date_time = val as System.DateTime?;
									result = temp_date_time.Value;	
								}
								else if(val.GetType() == typeof(string))
								{
									result = val.ToString();	
								}

								else if(val.GetType() == typeof(System.Collections.Generic.List<string>))
								{

									result = val as System.Collections.Generic.List<string>;	
								}
								else if(val.GetType() == typeof(System.Collections.Generic.List<object>))
								{

									result = val as System.Collections.Generic.List<object>;	
								}
								else
								{
									result = val;	
								}

							}
							else
							{
								result = null;	
							}
						}
						else
						{
							System.Console.WriteLine("break");
						}
					}
					else if(index is IDictionary<string, object>)
					{
						index = ((IDictionary<string, object>)index)[path[i]];
					
					}
					else if (index[path[i]].GetType() == typeof(IList<object>))
					{
						index = index[path[i]] as IList<object>;
					}
					else if (index[path[i]].GetType() == typeof(IDictionary<string, object>) && !index.ContainsKey(path[i]))
					{
						System.Console.WriteLine("Index not found. This should not happen. {0}", p_path);
					}
					else if (index[path[i]].GetType() == typeof(IDictionary<string, object>))
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

