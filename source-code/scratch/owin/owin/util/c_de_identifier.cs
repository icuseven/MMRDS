using System;
using System.Collections.Generic;

namespace mmria.server.util
{
	public class c_de_identifier
	{
		string source_json;
		static HashSet<string> de_identified_set = new HashSet<string>(){
				"home_record/first_name",
				"home_record/last_name",
				"home_record/middle_name",

"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_name",

"birth_fetal_death_certificate_parent/demographic_of_father/first_name",
"birth_fetal_death_certificate_parent/demographic_of_father/middle_name",
"birth_fetal_death_certificate_parent/demographic_of_father/last_name",

"birth_fetal_death_certificate_parent/record_identification/first_name",
"birth_fetal_death_certificate_parent/record_identification/middle_name",
"birth_fetal_death_certificate_parent/record_identification/last_name",
"birth_fetal_death_certificate_parent/record_identification/maiden_name",

"birth_certificate_infant_fetal_section/record_identification/first_name",
"birth_certificate_infant_fetal_section/record_identification/middle_name",
"birth_certificate_infant_fetal_section/record_identification/last_name",

"er_visit_and_hospital_medical_records/maternal_record_identification/first_name",
"er_visit_and_hospital_medical_records/maternal_record_identification/middle_name",
"er_visit_and_hospital_medical_records/maternal_record_identification/last_name",
"er_visit_and_hospital_medical_records/maternal_record_identification/maiden_name",

"er_visit_and_hospital_medical_records/name_and_location_facility/facility_name",

"informant_interviews/informant_name",


"home_record/date_of_death/day",
"death_certificate/demographics/date_of_birth/day",
"death_certificate/injury_associated_information/date_of_injury/day",
"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/day",
"birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/day",
"birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/day",
"birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/day",
"birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/day",
"birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/day",
"birth_fetal_death_certificate_parent/prenatal_care/date_of_1st_prenatal_visit/day",
"autopsy_report/reporter_characteristics/date_of_autopsy/day",
"prenatal/intendedenes/date_birth_control_was_discontinued/day",
"prenatal/current_pregnancy/date_of_last_normal_menses/day",
"prenatal/current_pregnancy/estimated_date_of_confinement/day",
"prenatal/current_pregnancy/date_of_1st_prenatal_visit/day",
"prenatal/current_pregnancy/date_of_1st_ultrasound/day",
"prenatal/current_pregnancy/date_of_last_prenatal_visit/day",
"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/day",
"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/day",
"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/day",
"er_visit_and_hospital_medical_records/onset_of_labor/date_of_rupture/day",
"er_visit_and_hospital_medical_records/onset_of_labor/date_of_onset_of_labor/day",
"other_medical_office_visits/visit/date_of_medical_office_visit/day",
"informant_interviews/date_of_interview/day",


"death_certificate/place_of_last_residence/street",
"death_certificate/address_of_injury/street",
"death_certificate/address_of_death/street",
"birth_fetal_death_certificate_parent/facility_of_delivery_location/street",
"birth_fetal_death_certificate_parent/location_of_residence/street",
"prenatal/location_of_primary_prenatal_care_facility/street",
"er_visit_and_hospital_medical_records/name_and_location_facility/street"











		};

		public c_de_identifier (string p_source_json)
		{

			source_json = p_source_json;
		}



		public string execute()
		{
			string result = null;

			System.Dynamic.ExpandoObject source_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(source_json);



			foreach (string path in de_identified_set) 
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

				/*
				if (path[1] == "abnormal_conditions_of_newborn")
				{
					System.Console.WriteLine("break");
				}*/


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

