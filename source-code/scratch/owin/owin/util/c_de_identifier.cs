using System;
using System.Collections.Generic;

namespace mmria.server.util
{
	public class c_de_identifier
	{
		string case_item_json;
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
"home_record/date_of_death/month",
"death_certificate/demographics/date_of_birth/day",
"death_certificate/demographics/date_of_birth/month",
"death_certificate/injury_associated_information/date_of_injury/day",
"death_certificate/injury_associated_information/date_of_injury/month",
"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/day",
"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/month",
"birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/day",
"birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/month",
"birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/day",
"birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/month",
"birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/day",
"birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/month",
"birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/day",
"birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/month",
"birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/day",
"birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/month",
"birth_fetal_death_certificate_parent/prenatal_care/date_of_1st_prenatal_visit/day",
"birth_fetal_death_certificate_parent/prenatal_care/date_of_1st_prenatal_visit/month",
"autopsy_report/reporter_characteristics/date_of_autopsy/day",
"autopsy_report/reporter_characteristics/date_of_autopsy/month",
"prenatal/intendedenes/date_birth_control_was_discontinued/day",
"prenatal/intendedenes/date_birth_control_was_discontinued/month",
"prenatal/current_pregnancy/date_of_last_normal_menses/day",
"prenatal/current_pregnancy/date_of_last_normal_menses/month",
"prenatal/current_pregnancy/estimated_date_of_confinement/day",
"prenatal/current_pregnancy/estimated_date_of_confinement/month",
"prenatal/current_pregnancy/date_of_1st_prenatal_visit/day",
"prenatal/current_pregnancy/date_of_1st_prenatal_visit/month",
"prenatal/current_pregnancy/date_of_1st_ultrasound/day",
"prenatal/current_pregnancy/date_of_1st_ultrasound/month",
"prenatal/current_pregnancy/date_of_last_prenatal_visit/day",
"prenatal/current_pregnancy/date_of_last_prenatal_visit/month",
"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/day",
"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/month",
"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/day",
"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/month",
"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/day",
"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/month",
"er_visit_and_hospital_medical_records/onset_of_labor/date_of_rupture/day",
"er_visit_and_hospital_medical_records/onset_of_labor/date_of_rupture/month",
"er_visit_and_hospital_medical_records/onset_of_labor/date_of_onset_of_labor/day",
"er_visit_and_hospital_medical_records/onset_of_labor/date_of_onset_of_labor/month",
"other_medical_office_visits/visit/date_of_medical_office_visit/day",
"other_medical_office_visits/visit/date_of_medical_office_visit/month",
"informant_interviews/date_of_interview/day",
"informant_interviews/date_of_interview/month",
"death_certificate/place_of_last_residence/street",
"death_certificate/place_of_last_residence/city",
"death_certificate/place_of_last_residence/zip",
"death_certificate/address_of_injury/street",
"death_certificate/address_of_injury/city",
"death_certificate/address_of_injury/zip",
"death_certificate/address_of_death/street",
"death_certificate/address_of_death/city",
"death_certificate/address_of_death/zip",
"birth_fetal_death_certificate_parent/facility_of_delivery_location/street",
"birth_fetal_death_certificate_parent/facility_of_delivery_location/city",
"birth_fetal_death_certificate_parent/facility_of_delivery_location/zip",
"birth_fetal_death_certificate_parent/location_of_residence/street",
"birth_fetal_death_certificate_parent/location_of_residence/city",
"birth_fetal_death_certificate_parent/location_of_residence/zip",
"prenatal/location_of_primary_prenatal_care_facility/street",
"prenatal/location_of_primary_prenatal_care_facility/city",
"prenatal/location_of_primary_prenatal_care_facility/zip",
"er_visit_and_hospital_medical_records/name_and_location_facility/street",
"er_visit_and_hospital_medical_records/name_and_location_facility/city",
"er_visit_and_hospital_medical_records/name_and_location_facility/zip"




		};

		public c_de_identifier (string p_case_item_json)
		{

			case_item_json = p_case_item_json;
		}



		public string execute()
		{
			string result = null;

			System.Dynamic.ExpandoObject case_item_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(case_item_json);


			IDictionary<string, object> expando_object = case_item_object as IDictionary<string, object>;
			expando_object.Remove("_rev");





			foreach (string path in de_identified_set) 
			{
				set_de_identified_value (case_item_object, path);
			}

			Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
			settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
			result = Newtonsoft.Json.JsonConvert.SerializeObject(case_item_object, settings);

			return result;
		}


		public void set_de_identified_value (dynamic p_object, string p_path)
		{


			if (p_path == "er_visit_and_hospital_medical_records/maternal_record_identification/first_name")
			{
				System.Console.Write("break");
			}

			try
			{
				///"death_certificate/place_of_last_residence/street",

				List<string> path_list = new List<string>(p_path.Split ('/'));

				if (path_list.Count == 1)
				{	
					if (p_object is IDictionary<string, object>)
					{
						
						IDictionary<string, object> dictionary_object = p_object as IDictionary<string, object>;

						object val = null;

						if (dictionary_object.ContainsKey (path_list [0]))
						{
							val = dictionary_object [path_list [0]]; 

							if (val != null)
							{
								// set the de-identified value
								if (val is IDictionary<string, object>)
								{
									System.Console.WriteLine ("This should not happen. {0}", p_path);
								}
								else if (val is IList<object>)
								{
									System.Console.WriteLine ("This should not happen. {0}", p_path);
								}
								else if (val is string)
								{
									dictionary_object [path_list [0]] = "de-identified";
								}
								else if (val is System.DateTime)
								{
									dictionary_object [path_list [0]] = DateTime.MinValue;
								}
								else
								{
									dictionary_object [path_list [0]] = null;
								}
							}
						}
				
					}
					else if (p_object is IList<object>)
					{
						IList<object> Items = p_object as IList<object>;

						foreach(object item in Items)
						{
							set_de_identified_value (item, path_list [0]);

						}
					}	
					else
					{
						System.Console.WriteLine ("This should not happen. {0}", p_path);
					}
					
				}
				else
				{
					List<string> new_path = new List<string>();
	
					for(int i = 1; i < path_list.Count; i++)
					{
						new_path.Add(path_list[i]);
					}
					// call set_de_identified_value with next item in path
					///"death_certificate/place_of_last_residence/street",
					//er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/day

					if (p_object is IDictionary<string, object>)
					{
						IDictionary<string, object> dictionary_object = p_object as IDictionary<string, object>;

						dynamic val = null;
	
						if (dictionary_object.ContainsKey (path_list [0]))
						{
							val = dictionary_object [path_list [0]]; 
						}
	
						if (val != null)
						{
	
							set_de_identified_value (val, string.Join("/", new_path));
						}
	
					}
					else if (p_object is IList<object>)
					{
						
						IList<object> Items = p_object as IList<object>;

						foreach(object item in Items)
						{
							set_de_identified_value (item, string.Join("/", path_list));

						}
					}
					else
					{
						System.Console.WriteLine ("This should not happen. {0}", p_path);
					}
				}
			}
			catch (Exception ex)
			{
				System.Console.WriteLine ("set_de_identified_value. {0}", ex);
			}
				
		}
	}
}

