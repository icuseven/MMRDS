using System;
using System.Collections.Generic;

namespace mmria.server.util
{
	public class c_de_identifier
	{
		public enum de_identifier_type_enum
		{
			normal,
			cdc
		}
		de_identifier_type_enum de_identifier_type;
		string case_item_json;
		static HashSet<string> de_identified_set = new HashSet<string>(){
			"home_record/first_name",
			"home_record/last_name",
			"home_record/middle_name",
			"home_record/date_of_death/day",
			"home_record/date_of_death/month",
			"home_record/agency_case_id",
			"death_certificate/certificate_identification/time_of_death",
			"death_certificate/certificate_identification/local_file_number",
			"death_certificate/certificate_identification/state_file_number",
			"death_certificate/place_of_last_residence/street",
			"death_certificate/place_of_last_residence/city",
			"death_certificate/place_of_last_residence/zip_code",
			"death_certificate/place_of_last_residence/county",
			"death_certificate/place_of_last_residence/latitude",
			"death_certificate/place_of_last_residence/longitude",
			"death_certificate/place_of_last_residence/geocode_quality_indicator",
			"death_certificate/place_of_last_residence/county_urban_status",
			"death_certificate/place_of_last_residence/fips",
			"death_certificate/demographics/date_of_birth/day",
			"death_certificate/demographics/date_of_birth/month",
			"death_certificate/demographics/city_of_birth",
			"death_certificate/injury_associated_information/date_of_injury/day",
			"death_certificate/injury_associated_information/date_of_injury/month",
			"death_certificate/injury_associated_information/time_of_injury",
			"death_certificate/injury_associated_information/place_of_injury",
			"death_certificate/address_of_injury/street",
			"death_certificate/address_of_injury/city",
			"death_certificate/address_of_injury/zip_code",
			"death_certificate/address_of_injury/county",
			"death_certificate/address_of_injury/latitude",
			"death_certificate/address_of_injury/longitude",
			"death_certificate/address_of_death/place_of_death",
			"death_certificate/address_of_death/street",
			"death_certificate/address_of_death/city",
			"death_certificate/address_of_death/zip_code",
			"death_certificate/address_of_death/county",
			"death_certificate/address_of_death/latitude",
			"death_certificate/address_of_death/longitude",
			"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/day",
			"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/month",
			"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_npi_number",
			"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_name",
			"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/attendant_npi",
			"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/transferred_from_where",
			"birth_fetal_death_certificate_parent/facility_of_delivery_location/street",
			"birth_fetal_death_certificate_parent/facility_of_delivery_location/city",
			"birth_fetal_death_certificate_parent/facility_of_delivery_location/zip_code",
			"birth_fetal_death_certificate_parent/facility_of_delivery_location/county",
			"birth_fetal_death_certificate_parent/facility_of_delivery_location/latitude",
			"birth_fetal_death_certificate_parent/facility_of_delivery_location/longitude",
			"birth_fetal_death_certificate_parent/demographic_of_father/first_name",
			"birth_fetal_death_certificate_parent/demographic_of_father/middle_name",
			"birth_fetal_death_certificate_parent/demographic_of_father/last_name",
			"birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/day",
			"birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/month",
			"birth_fetal_death_certificate_parent/demographic_of_father/city_of_birth",
			"birth_fetal_death_certificate_parent/record_identification/first_name",
			"birth_fetal_death_certificate_parent/record_identification/middle_name",
			"birth_fetal_death_certificate_parent/record_identification/last_name",
			"birth_fetal_death_certificate_parent/record_identification/maiden_name",
			"birth_fetal_death_certificate_parent/record_identification/medical_record_number",
			"birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/day",
			"birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/month",
			"birth_fetal_death_certificate_parent/demographic_of_mother/city_of_birth",
			"birth_fetal_death_certificate_parent/location_of_residence/street",
			"birth_fetal_death_certificate_parent/location_of_residence/city",
			"birth_fetal_death_certificate_parent/location_of_residence/zip_code",
			"birth_fetal_death_certificate_parent/location_of_residence/county",
			"birth_fetal_death_certificate_parent/location_of_residence/latitude",
			"birth_fetal_death_certificate_parent/location_of_residence/longitude",
			"birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/day",
			"birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/month",
			"birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/day",
			"birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/month",
			"birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/day",
			"birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/month",
			"birth_fetal_death_certificate_parent/prenatal_care/date_of_1st_prenatal_visit/day",
			"birth_fetal_death_certificate_parent/prenatal_care/date_of_1st_prenatal_visit/month",
			"birth_certificate_infant_fetal_section/record_identification/first_name",
			"birth_certificate_infant_fetal_section/record_identification/middle_name",
			"birth_certificate_infant_fetal_section/record_identification/last_name",
			"birth_certificate_infant_fetal_section/record_identification/state_file_number",
			"birth_certificate_infant_fetal_section/record_identification/local_file_number",
			"birth_certificate_infant_fetal_section/record_identification/newborn_medical_record_number",
			"birth_certificate_infant_fetal_section/record_identification/time_of_delivery",
			"birth_certificate_infant_fetal_section/biometrics_and_demographics/facility_city_state",
			"autopsy_report/reporter_characteristics/date_of_autopsy/day",
			"autopsy_report/reporter_characteristics/date_of_autopsy/month",
			"autopsy_report/reporter_characteristics/jurisdiction",
			"prenatal/prenatal_care_record_no",
			"prenatal/location_of_primary_prenatal_care_facility/street",
			"prenatal/location_of_primary_prenatal_care_facility/city",
			"prenatal/location_of_primary_prenatal_care_facility/zip_code",
			"prenatal/location_of_primary_prenatal_care_facility/county",
			"prenatal/location_of_primary_prenatal_care_facility/latitude",
			"prenatal/location_of_primary_prenatal_care_facility/longitude",
			"prenatal/prior_surgical_procedures_before_pregnancy/date",
			"prenatal/pregnancy_history/details_grid/date_ended",
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
			"prenatal/current_pregnancy/intended_birthing_facility",
			"prenatal/routine_monitoring/date_and_time",
			"prenatal/other_lab_tests/date_and_time",
			"prenatal/diagnostic_procedures/date",
			"prenatal/problems_identified_grid/date_1st_noted",
			"prenatal/medications_and_drugs_during_pregnancy/date",
			"prenatal/pre_delivery_hospitalizations_details/date",
			"prenatal/medical_referrals/date",
			"prenatal/other_sources_of_prenatal_care/begin_date",
			"prenatal/other_sources_of_prenatal_care/end_date",
			"er_visit_and_hospital_medical_records/maternal_record_identification/first_name",
			"er_visit_and_hospital_medical_records/maternal_record_identification/middle_name",
			"er_visit_and_hospital_medical_records/maternal_record_identification/last_name",
			"er_visit_and_hospital_medical_records/maternal_record_identification/maiden_name",
			"er_visit_and_hospital_medical_records/maternal_record_identification/medical_record_no",
			"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/day",
			"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/month",
			"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/time_of_arrival",
			"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/day",
			"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/month",
			"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/time_of_admission",
			"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/from_where","er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/to_where",
			"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/day",
			"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/month",
			"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/time_of_discharge",
			"er_visit_and_hospital_medical_records/name_and_location_facility/facility_name",
			"er_visit_and_hospital_medical_records/name_and_location_facility/facility_npi_no",
			"er_visit_and_hospital_medical_records/name_and_location_facility/street",
			"er_visit_and_hospital_medical_records/name_and_location_facility/city",
			"er_visit_and_hospital_medical_records/name_and_location_facility/zip",
			"er_visit_and_hospital_medical_records/name_and_location_facility/zip_code",
			"er_visit_and_hospital_medical_records/name_and_location_facility/county",
			"er_visit_and_hospital_medical_records/name_and_location_facility/latitude",
			"er_visit_and_hospital_medical_records/name_and_location_facility/longitude",
			"er_visit_and_hospital_medical_records/internal_transfers/date_and_time",
			"er_visit_and_hospital_medical_records/physical_exam_and_evaluations/date_and_time",
			"er_visit_and_hospital_medical_records/psychological_exam_and_assesments/date_and_time",
			"er_visit_and_hospital_medical_records/labratory_tests/date_and_time",
			"er_visit_and_hospital_medical_records/pathology/date_and_time",
			"er_visit_and_hospital_medical_records/onset_of_labor/date_of_onset_of_labor/day",
			"er_visit_and_hospital_medical_records/onset_of_labor/date_of_onset_of_labor/month",
			"er_visit_and_hospital_medical_records/onset_of_labor/time_of_onset_of_labor",
			"er_visit_and_hospital_medical_records/onset_of_labor/date_of_rupture/day",
			"er_visit_and_hospital_medical_records/onset_of_labor/date_of_rupture/month",
			"er_visit_and_hospital_medical_records/onset_of_labor/date_of_rupture/time_of_rupture",
			"er_visit_and_hospital_medical_records/vital_signs/date_and_time",
			"er_visit_and_hospital_medical_records/birth_attendant/npi",
			"er_visit_and_hospital_medical_records/anesthesia/date_time",
			"er_visit_and_hospital_medical_records/list_of_medications/date_and_time",
			"er_visit_and_hospital_medical_records/surgical_procedures/date_and_time",
			"er_visit_and_hospital_medical_records/blood_product_grid/date_and_time",
			"er_visit_and_hospital_medical_records/diagnostic_imaging_grid/date_and_time",
			"er_visit_and_hospital_medical_records/referrals_and_consultations/date",
			"other_medical_office_visits/visit/date_of_medical_office_visit/day",
			"other_medical_office_visits/visit/date_of_medical_office_visit/month",
			"other_medical_office_visits/visit/date_of_medical_office_visit/arrival_time",
			"other_medical_office_visits/visit/medical_record_no",
			"other_medical_office_visits/location_of_medical_care_facility/street",
			"other_medical_office_visits/location_of_medical_care_facility/city",
			"other_medical_office_visits/location_of_medical_care_facility/zip_code",
			"other_medical_office_visits/location_of_medical_care_facility/county",
			"other_medical_office_visits/location_of_medical_care_facility/latitude",
			"other_medical_office_visits/location_of_medical_care_facility/longitude",
			"other_medical_office_visits/vital_signs/date_and_time",
			"other_medical_office_visits/laboratory_tests/date_and_time",
			"other_medical_office_visits/diagnostic_imaging_and_other_technology/date_and_time",
			"other_medical_office_visits/referrals_and_consultations/date",
			"other_medical_office_visits/medications/date_and_time",
			"informant_interviews/informant_name",
			"informant_interviews/date_of_interview/day",
			"informant_interviews/date_of_interview/month",
			"medical_transport/date_of_transport/month",
			"medical_transport/date_of_transport/day",
			"medical_transport/transport_vital_signs/date_and_time",
			"medical_transport/destination_information/place_of_destination",
		"medical_transport/timing_of_transport/call_received",
		"medical_transport/timing_of_transport/depart_for_patient_origin",
		 "medical_transport/timing_of_transport/arrive_at_patient_origin",
		 "medical_transport/timing_of_transport/patient_contact",
		 "medical_transport/timing_of_transport/depart_for_referring_facility",
		 "medical_transport/timing_of_transport/arrive_at_referring_facility",	
			 "social_and_environmental_profile/social_and_medical_referrals/date",
			"social_and_environmental_profile/sources_of_social_services_information_for_this_record/source_name",
			"mental_health_profile/were_there_documented_mental_health_conditions/date_of_screening"
					
		



		};

		static HashSet<string> cdc_de_identified_set = new HashSet<string>(){
			"home_record/first_name",
"home_record/middle_name",
"home_record/last_name",
"home_record/agency_case_id",
"death_certificate/certificate_identification/local_file_number",
"death_certificate/certificate_identification/state_file_number",
"death_certificate/place_of_last_residence/zip_code",
"death_certificate/place_of_last_residence/county",
"death_certificate/demographics/city_of_birth",
"death_certificate/injury_associated_information/place_of_injury",
"death_certificate/address_of_injury/zip_code",
"death_certificate/address_of_injury/county",
"death_certificate/address_of_injury/latitude",
"death_certificate/address_of_injury/longitude",
"death_certificate/address_of_death/place_of_death",
"death_certificate/address_of_death/zip_code",
"death_certificate/address_of_death/county",
"death_certificate/address_of_death/latitude",
"death_certificate/address_of_death/longitude",
"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_npi_number",
"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_name",
"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/attendant_npi",
"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/transferred_from_where",
"birth_fetal_death_certificate_parent/facility_of_delivery_location/zip_code",
"birth_fetal_death_certificate_parent/facility_of_delivery_location/county",
"birth_fetal_death_certificate_parent/demographic_of_father/city_of_birth",
"birth_fetal_death_certificate_parent/record_identification/medical_record_number",
"birth_fetal_death_certificate_parent/demographic_of_mother/city_of_birth",
"birth_fetal_death_certificate_parent/location_of_residence/zip_code",
"birth_fetal_death_certificate_parent/location_of_residence/county",
"birth_certificate_infant_fetal_section/record_identification/first_name",
"birth_certificate_infant_fetal_section/record_identification/middle_name",
"birth_certificate_infant_fetal_section/record_identification/last_name",
"birth_certificate_infant_fetal_section/record_identification/state_file_number",
"birth_certificate_infant_fetal_section/record_identification/local_file_number",
"birth_certificate_infant_fetal_section/record_identification/newborn_medical_record_number.",
"birth_certificate_infant_fetal_section/biometrics_and_demographics/facility_city_state",
"autopsy_report/reporter_characteristics/jurisdiction",
"autopsy_report/reporter_characteristics/date_of_autopsy/month",
"autopsy_report/reporter_characteristics/date_of_autopsy/day",
"prenatal/prenatal_care_record_no",
"prenatal/location_of_primary_prenatal_care_facility/zip_code",
"prenatal/location_of_primary_prenatal_care_facility/county",
"prenatal/location_of_primary_prenatal_care_facility/latitude",
"prenatal/location_of_primary_prenatal_care_facility/longitude",
"prenatal/prior_surgical_procedures_before_pregnancy/date",
"prenatal/pregnancy_history/details_grid/date_ended",
"prenatal/current_pregnancy/intended_birthing_facility",
"prenatal/routine_monitoring/date_and_time",
"prenatal/other_lab_tests/date_and_time",
"prenatal/diagnostic_procedures/date",
"prenatal/problems_identified_grid/date_1st_noted",
"prenatal/medications_and_drugs_during_pregnancy/date",
"prenatal/pre_delivery_hospitalizations_details/date",
"prenatal/medical_referrals/date",
"prenatal/other_sources_of_prenatal_care/begin_date",
"prenatal/other_sources_of_prenatal_care/end_date",
"prenatal/other_sources_of_prenatal_care/city",
"er_visit_and_hospital_medical_records/maternal_record_identification/medical_record_no",
"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/from_where",
"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/to_where",
"er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/time_of_discharge",
"er_visit_and_hospital_medical_records/name_and_location_facility/facility_name",
"er_visit_and_hospital_medical_records/name_and_location_facility/facility_npi_no",
"er_visit_and_hospital_medical_records/name_and_location_facility/zip_code",
"er_visit_and_hospital_medical_records/name_and_location_facility/county",
"er_visit_and_hospital_medical_records/name_and_location_facility/latitude",
"er_visit_and_hospital_medical_records/name_and_location_facility/longitude",
"er_visit_and_hospital_medical_records/internal_transfers/date_and_time",
"er_visit_and_hospital_medical_records/physical_exam_and_evaluations/date_and_time",
"er_visit_and_hospital_medical_records/psychological_exam_and_assesments/date_and_time",
"er_visit_and_hospital_medical_records/labratory_tests/date_and_time",
"er_visit_and_hospital_medical_records/pathology/date_and_time",
"er_visit_and_hospital_medical_records/vital_signs/date_and_time",
"er_visit_and_hospital_medical_records/birth_attendant/npi",
"er_visit_and_hospital_medical_records/anesthesia/date_time",
"er_visit_and_hospital_medical_records/list_of_medications/date_and_time",
"er_visit_and_hospital_medical_records/surgical_procedures/date_and_time",
"er_visit_and_hospital_medical_records/blood_product_grid/date_and_time",
"er_visit_and_hospital_medical_records/diagnostic_imaging_grid/date_and_time",
"other_medical_office_visits/visit/medical_record_no",
"other_medical_office_visits/location_of_medical_care_facility/street",
"other_medical_office_visits/location_of_medical_care_facility/city",
"other_medical_office_visits/location_of_medical_care_facility/zip_code",
"other_medical_office_visits/location_of_medical_care_facility/county",
"other_medical_office_visits/location_of_medical_care_facility/latitude",
"other_medical_office_visits/location_of_medical_care_facility/longitude",
"other_medical_office_visits/vital_signs/date_and_time",
"other_medical_office_visits/laboratory_tests/date_and_time",
"other_medical_office_visits/diagnostic_imaging_and_other_technology/date_and_time",
"other_medical_office_visits/medications/date_and_time",
"medical_transport/date_of_transport/month",
"medical_transport/date_of_transport/day",
"medical_transport/transport_vital_signs/date_and_time",
"medical_transport/destination_information/place_of_destination",
"medical_transport/timing_of_transport/call_received",
"medical_transport/timing_of_transport/patient_contact",
"social_and_environmental_profile/sources_of_social_services_information_for_this_record/source_name",
"informant_interviews/informant_name"


		};

		public c_de_identifier (string p_case_item_json, de_identifier_type_enum p_de_identifier_type = de_identifier_type_enum.normal)
		{
			this.de_identifier_type = p_de_identifier_type;
			this.case_item_json = p_case_item_json;
		}



		public string execute()
		{
			string result = null;

			System.Dynamic.ExpandoObject case_item_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(case_item_json);


			IDictionary<string, object> expando_object = case_item_object as IDictionary<string, object>;
			expando_object.Remove("_rev");

			if (this.de_identifier_type == de_identifier_type_enum.cdc)
			{
				foreach (string path in cdc_de_identified_set) 
				{
					set_de_identified_value (case_item_object, path);
				}
			}
			else
			{
				foreach (string path in de_identified_set) 
				{
						set_de_identified_value (case_item_object, path);
				}

			}

			Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
			settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
			result = Newtonsoft.Json.JsonConvert.SerializeObject(case_item_object, settings);

			return result;
		}


		public void set_de_identified_value (dynamic p_object, string p_path)
		{

/*
			if (p_path == "er_visit_and_hospital_medical_records/maternal_record_identification/first_name")
			{
				//System.Console.Write("break");
			}*/

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
									//System.Console.WriteLine ("This should not happen. {0}", p_path);
								}
								else if (val is IList<object>)
								{
									//System.Console.WriteLine ("This should not happen. {0}", p_path);
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
						//System.Console.WriteLine ("This should not happen. {0}", p_path);
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
						//System.Console.WriteLine ("This should not happen. {0}", p_path);
					}
				}
			}
			catch (Exception ex)
			{
				//System.Console.WriteLine ("set_de_identified_value. {0}", ex);
			}
				
		}
	}
}

