public class _03787BE62E53DBA5CE6F69EA96515700
{
	public _03787BE62E53DBA5CE6F69EA96515700(){}
		public string committee_recommendations { get; set; }
		public string prevention { get; set; }
		public string impact_level { get; set; }
}

public class _65D125FC8B7F77F97A3B80D4C65928B0
{
	public _65D125FC8B7F77F97A3B80D4C65928B0(){}
		public string description { get; set; }
		public string @class { get; set; }
		public string category { get; set; }
		public string committee_recommendations { get; set; }
		public string recommendation_level { get; set; }
		public string prevention { get; set; }
		public string impact_level { get; set; }
}

public class _9454814D91C4C5F2C88BCCE5E93B074F
{
	public _9454814D91C4C5F2C88BCCE5E93B074F(){}
		public string type { get; set; }
		public string cause_descriptive { get; set; }
		public string comments { get; set; }
}

public class _62AEF5C4D8129ED98ECA69F7779FCBFC
{

	public _62AEF5C4D8129ED98ECA69F7779FCBFC(){}
		public string date_of_review { get; set; }
		public string pregnancy_relatedness { get; set; }
		public string estimate_degree_relevant_information_available { get; set; }
		public string does_committee_agree_with_cod_on_death_certificate { get; set; }
		public string pmss_mm { get; set; }
		public string pmss_mm_secondary { get; set; }
public List<_9454814D91C4C5F2C88BCCE5E93B074F> committee_determination_of_causes_of_death{ get;set;}
		public string did_obesity_contribute_to_the_death { get; set; }
		public string did_discrimination_contribute_to_the_death { get; set; }
		public string did_mental_health_conditions_contribute_to_the_death { get; set; }
		public string did_substance_use_disorder_contribute_to_the_death { get; set; }
		public string was_this_death_a_sucide { get; set; }
		public string was_this_death_a_homicide { get; set; }
		public string means_of_fatal_injury { get; set; }
		public string specify_other_means_fatal_injury { get; set; }
		public string if_homicide_relationship_of_perpetrator { get; set; }
		public string specify_other_relationship { get; set; }
		public string was_this_death_preventable { get; set; }
		public string chance_to_alter_outcome { get; set; }
public List<_65D125FC8B7F77F97A3B80D4C65928B0> critical_factors_worksheet{ get;set;}
		public string cr_add_recs { get; set; }
		public string notes_about_key_circumstances_surrounding_death { get; set; }
public List<_03787BE62E53DBA5CE6F69EA96515700> recommendations_of_committee{ get;set;}
}

public class _A35F564798944667E91C53B3A3DA359D
{

	public _A35F564798944667E91C53B3A3DA359D(){}
		public string case_opening_overview { get; set; }
}

public class _3324B59308063F372636E2BE07764C8B
{
	public _3324B59308063F372636E2BE07764C8B(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _18CD53D47CBDE2540A9EF3EC5B51E0BA
{
	public _18CD53D47CBDE2540A9EF3EC5B51E0BA(){}
public _3324B59308063F372636E2BE07764C8B date_of_interview{ get;set;}
		public string interview_type { get; set; }
		public string other_interview_type { get; set; }
		public string age_group { get; set; }
		public string relationship_to_deceased { get; set; }
		public string other_relationship { get; set; }
		public string interview_narrative { get; set; }
		public string reviewer_note { get; set; }
}

public class _C03B8001285602379CED67187C028FDD
{
	public _C03B8001285602379CED67187C028FDD(){}
		public string date_of_screening { get; set; }
		public string gestational_weeks { get; set; }
		public string gestational_days { get; set; }
		public string days_postpartum { get; set; }
		public string screening_tool { get; set; }
		public string other_screening_tool { get; set; }
		public string referral_for_treatment { get; set; }
		public string findings { get; set; }
		public string comments { get; set; }
}

public class _39DB9B13455B28F2E49AD74B4CF2D85A
{
	public _39DB9B13455B28F2E49AD74B4CF2D85A(){}
		public string condition { get; set; }
		public string duration_of_condition { get; set; }
		public string treatments { get; set; }
		public string duration_of_tx { get; set; }
		public string treatment_changed_during_pregnancy { get; set; }
		public string dosage_changed_during_pregnancy { get; set; }
		public string if_yes_mental_health_provider_consultation_during_this_pregnancy { get; set; }
		public string did_patient_adhere_to_treatment { get; set; }
		public string comments { get; set; }
}

public class _06AA314F235917500C48AB5E3CD1C034
{

	public _06AA314F235917500C48AB5E3CD1C034(){}
		public string were_there_documented_preexisting_mental_health_conditions { get; set; }
public List<_39DB9B13455B28F2E49AD74B4CF2D85A> documented_preexisting_mental_health_conditions{ get;set;}
public List<_C03B8001285602379CED67187C028FDD> were_there_documented_mental_health_conditions{ get;set;}
		public List<string> mental_health_conditions_prior_to_the_most_recent_pregnancy { get; set; }
		public string other_prior_to_pregnancy { get; set; }
		public List<string> mental_health_conditions_during_the_most_recent_pregnancy { get; set; }
		public string other_during_pregnancy { get; set; }
		public List<string> mental_health_conditions_after_the_most_recent_pregnancy { get; set; }
		public string other_after_pregnancy { get; set; }
		public string reviewer_note { get; set; }
}

public class _7304BC460354BFEEA44959EE266F14DC
{
	public _7304BC460354BFEEA44959EE266F14DC(){}
		public string street { get; set; }
		public string apartment { get; set; }
		public string city { get; set; }
		public string state { get; set; }
		public string country_of_last_residence { get; set; }
		public string zip_code { get; set; }
		public string county { get; set; }
		public string feature_matching_geography_type { get; set; }
		public string latitude { get; set; }
		public string longitude { get; set; }
		public string naaccr_gis_coordinate_quality_code { get; set; }
		public string naaccr_gis_coordinate_quality_type { get; set; }
		public string naaccr_census_tract_certainty_code { get; set; }
		public string naaccr_census_tract_certainty_type { get; set; }
		public string state_county_fips { get; set; }
		public string census_state_fips { get; set; }
		public string census_county_fips { get; set; }
		public string census_tract_fips { get; set; }
		public string urban_status { get; set; }
		public string census_met_div_fips { get; set; }
		public string census_cbsa_fips { get; set; }
		public string census_cbsa_micro { get; set; }
		public string estimated_distance { get; set; }
}

public class _016DDBD8BE4E0CA726E60B2A0B7C6F20
{
	public _016DDBD8BE4E0CA726E60B2A0B7C6F20(){}
		public string place_of_destination { get; set; }
		public string destination_type { get; set; }
		public string place_of_origin_other { get; set; }
public _7304BC460354BFEEA44959EE266F14DC address{ get;set;}
		public string trauma_level_of_care { get; set; }
		public string other_trauma_level_of_care { get; set; }
		public string maternal_level_of_care { get; set; }
		public string other_maternal_level_of_care { get; set; }
		public string comments { get; set; }
}

public class _9E38EAE350ADD1FBBA07FB7CC906C6B1
{
	public _9E38EAE350ADD1FBBA07FB7CC906C6B1(){}
		public string date_and_time { get; set; }
		public string gestational_weeks { get; set; }
		public string gestational_days { get; set; }
		public string systolic_bp { get; set; }
		public string diastolic_bp { get; set; }
		public string heart_rate { get; set; }
		public string oxygen_saturation { get; set; }
		public string blood_sugar { get; set; }
		public string comments { get; set; }
}

public class _C253C7CC2A0397535E3968F4A3E8EBBC
{
	public _C253C7CC2A0397535E3968F4A3E8EBBC(){}
		public string street { get; set; }
		public string apartment { get; set; }
		public string city { get; set; }
		public string state { get; set; }
		public string country { get; set; }
		public string zip_code { get; set; }
		public string county { get; set; }
		public string feature_matching_geography_type { get; set; }
		public string latitude { get; set; }
		public string longitude { get; set; }
		public string naaccr_gis_coordinate_quality_code { get; set; }
		public string naaccr_gis_coordinate_quality_type { get; set; }
		public string naaccr_census_tract_certainty_code { get; set; }
		public string naaccr_census_tract_certainty_type { get; set; }
		public string state_county_fips { get; set; }
		public string census_state_fips { get; set; }
		public string census_county_fips { get; set; }
		public string census_tract_fips { get; set; }
		public string urban_status { get; set; }
		public string census_met_div_fips { get; set; }
		public string census_cbsa_fips { get; set; }
		public string census_cbsa_micro { get; set; }
}

public class _296A49A114016CF9781A8EAD842554D7
{
	public _296A49A114016CF9781A8EAD842554D7(){}
		public string place_of_origin { get; set; }
		public string place_of_origin_other { get; set; }
public _C253C7CC2A0397535E3968F4A3E8EBBC address{ get;set;}
		public string trauma_level_of_care { get; set; }
		public string other_trauma_level_of_care { get; set; }
		public string maternal_level_of_care { get; set; }
		public string other_maternal_level_of_care { get; set; }
		public string comments { get; set; }
}

public class _D9426331BDEDF9BD2CEAE93CFEC64630
{
	public _D9426331BDEDF9BD2CEAE93CFEC64630(){}
		public string call_received { get; set; }
		public string depart_for_patient_origin { get; set; }
		public string arrive_at_patient_origin { get; set; }
		public string patient_contact { get; set; }
		public string depart_for_referring_facility { get; set; }
		public string arrive_at_referring_facility { get; set; }
}

public class _14A430A7CEAC8A1A9E5DDC9741D8AA8B
{
	public _14A430A7CEAC8A1A9E5DDC9741D8AA8B(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
		public string days_postpartum { get; set; }
}

public class _9206DAB82DFEDA2BC11D83175919BA02
{
	public _9206DAB82DFEDA2BC11D83175919BA02(){}
public _14A430A7CEAC8A1A9E5DDC9741D8AA8B date_of_transport{ get;set;}
		public string reason_for_transport { get; set; }
		public string maternal_conditions { get; set; }
		public string who_managed_the_transport { get; set; }
		public string other_transport_manager { get; set; }
		public string transport_vehicle { get; set; }
		public string other_transport_vehicle { get; set; }
public _D9426331BDEDF9BD2CEAE93CFEC64630 timing_of_transport{ get;set;}
public _296A49A114016CF9781A8EAD842554D7 origin_information{ get;set;}
		public string procedures_before_transport { get; set; }
		public string procedures_during_transport { get; set; }
public List<_9E38EAE350ADD1FBBA07FB7CC906C6B1> transport_vital_signs{ get;set;}
		public string mental_status_of_patient_during_transport { get; set; }
		public string documented_pertinent_oral_statements_made_by_patient_and_other_on_scene { get; set; }
public _016DDBD8BE4E0CA726E60B2A0B7C6F20 destination_information{ get;set;}
		public string reviewer_note { get; set; }
}

public class _68170408B3167DC59913CD9A2CA1357B
{
	public _68170408B3167DC59913CD9A2CA1357B(){}
		public string abnormal_findings { get; set; }
		public string recommendations_and_action_plans { get; set; }
}

public class _E4CA2E16DDEE982A85D4D22DCC31E70F
{
	public _E4CA2E16DDEE982A85D4D22DCC31E70F(){}
		public string date_and_time { get; set; }
		public string medication_name { get; set; }
		public string dose_frequeny_duration { get; set; }
		public string adverse_reaction { get; set; }
		public string comments { get; set; }
}

public class _C1EFC5F4AC8542D8630ED4C880B9EDD8
{
	public _C1EFC5F4AC8542D8630ED4C880B9EDD8(){}
		public string date { get; set; }
		public string speciality { get; set; }
		public string reason { get; set; }
		public string recommendations { get; set; }
}

public class _0BC6600AA8457AB07561633DC8DBF6C3
{
	public _0BC6600AA8457AB07561633DC8DBF6C3(){}
		public string body_system { get; set; }
		public string finding { get; set; }
		public string comment { get; set; }
}

public class _8558B3DB502E84E098AC581E499D032A
{
	public _8558B3DB502E84E098AC581E499D032A(){}
		public string date_and_time { get; set; }
		public string procedure { get; set; }
		public string target_procedure { get; set; }
		public string finding { get; set; }
}

public class _06921F604DB46ECCAB769043FEC60E87
{
	public _06921F604DB46ECCAB769043FEC60E87(){}
		public string date_and_time { get; set; }
		public string specimen { get; set; }
		public string test_name { get; set; }
		public string result { get; set; }
		public string diagnostic_level { get; set; }
		public string comments { get; set; }
}

public class _8E6189F67C4CB139080D5867B1DA8617
{
	public _8E6189F67C4CB139080D5867B1DA8617(){}
		public string date_and_time { get; set; }
		public string temperature { get; set; }
		public string pulse { get; set; }
		public string respiration { get; set; }
		public string bp_systolic { get; set; }
		public string bp_diastolic { get; set; }
		public string oxygen_saturation { get; set; }
		public string comments { get; set; }
}

public class _B5CBB37577260A8F84CFD2C24F0461AE
{
	public _B5CBB37577260A8F84CFD2C24F0461AE(){}
		public string finding { get; set; }
		public string comments { get; set; }
}

public class _C269EDFA69E501F5A86850D3AD13ADE2
{
	public _C269EDFA69E501F5A86850D3AD13ADE2(){}
		public string finding { get; set; }
		public string comments { get; set; }
}

public class _1345442838A1AC070037B7F85CA7E067
{
	public _1345442838A1AC070037B7F85CA7E067(){}
		public string finding { get; set; }
		public string comments { get; set; }
}

public class _98BB954A3934D72B967DE0372E7B381C
{
	public _98BB954A3934D72B967DE0372E7B381C(){}
		public string street { get; set; }
		public string apartment { get; set; }
		public string city { get; set; }
		public string state { get; set; }
		public string zip_code { get; set; }
		public string county { get; set; }
		public string feature_matching_geography_type { get; set; }
		public string latitude { get; set; }
		public string longitude { get; set; }
		public string naaccr_gis_coordinate_quality_code { get; set; }
		public string naaccr_gis_coordinate_quality_type { get; set; }
		public string naaccr_census_tract_certainty_code { get; set; }
		public string naaccr_census_tract_certainty_type { get; set; }
		public string state_county_fips { get; set; }
		public string census_state_fips { get; set; }
		public string census_county_fips { get; set; }
		public string census_tract_fips { get; set; }
		public string urban_status { get; set; }
		public string census_met_div_fips { get; set; }
		public string census_cbsa_fips { get; set; }
		public string census_cbsa_micro { get; set; }
}

public class _32D77F04277335567F6CCC5A74D707E3
{
	public _32D77F04277335567F6CCC5A74D707E3(){}
		public string place_type { get; set; }
		public string specify_other_place_type { get; set; }
		public string provider_type { get; set; }
		public string specify_other_provider_type { get; set; }
		public string payment_source { get; set; }
		public string other_payment_source { get; set; }
		public string pregnancy_status { get; set; }
		public string was_this_provider_her_primary_prenatal_care_provider { get; set; }
}

public class _432D0EB265A4EA9F9676E09A2A3DCBC3
{
	public _432D0EB265A4EA9F9676E09A2A3DCBC3(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
		public string arrival_time { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
		public string days_postpartum { get; set; }
}

public class _A5A3B6D489A0736D012BE52DE281A8BD
{
	public _A5A3B6D489A0736D012BE52DE281A8BD(){}
public _432D0EB265A4EA9F9676E09A2A3DCBC3 date_of_medical_office_visit{ get;set;}
		public string visit_type { get; set; }
		public string visit_type_other_specify { get; set; }
		public string medical_record_no { get; set; }
		public string reason_for_visit_or_chief_complaint { get; set; }
}

public class _CAE881A4974F08BB4F9D46B90FEF51D4
{
	public _CAE881A4974F08BB4F9D46B90FEF51D4(){}
public _A5A3B6D489A0736D012BE52DE281A8BD visit{ get;set;}
public _32D77F04277335567F6CCC5A74D707E3 medical_care_facility{ get;set;}
public _98BB954A3934D72B967DE0372E7B381C location_of_medical_care_facility{ get;set;}
public List<_1345442838A1AC070037B7F85CA7E067> relevant_medical_history{ get;set;}
public List<_C269EDFA69E501F5A86850D3AD13ADE2> relevant_family_history{ get;set;}
public List<_B5CBB37577260A8F84CFD2C24F0461AE> relevant_social_history{ get;set;}
public List<_8E6189F67C4CB139080D5867B1DA8617> vital_signs{ get;set;}
public List<_06921F604DB46ECCAB769043FEC60E87> laboratory_tests{ get;set;}
public List<_8558B3DB502E84E098AC581E499D032A> diagnostic_imaging_and_other_technology{ get;set;}
public List<_0BC6600AA8457AB07561633DC8DBF6C3> physical_exam{ get;set;}
public List<_C1EFC5F4AC8542D8630ED4C880B9EDD8> referrals_and_consultations{ get;set;}
public List<_E4CA2E16DDEE982A85D4D22DCC31E70F> medications{ get;set;}
public List<_68170408B3167DC59913CD9A2CA1357B> new_grid{ get;set;}
		public string reviewer_note { get; set; }
}

public class _ABB6583CF8BFB479D6A720B3F297116E
{
	public _ABB6583CF8BFB479D6A720B3F297116E(){}
		public string date { get; set; }
		public string specialist_type { get; set; }
		public string reason { get; set; }
		public string recommendations { get; set; }
}

public class _E6866482E638B68311DFC377B9C1683A
{
	public _E6866482E638B68311DFC377B9C1683A(){}
		public string date_and_time { get; set; }
		public string procedure { get; set; }
		public string target { get; set; }
		public string finding { get; set; }
}

public class _A5A4696A044B1F5146F3E8EDF1D941F9
{
	public _A5A4696A044B1F5146F3E8EDF1D941F9(){}
		public string date_and_time { get; set; }
		public string product { get; set; }
		public string number_of_units { get; set; }
		public string reaction_complications { get; set; }
}

public class _2019412E9EF12669F55BF8489F89661B
{
	public _2019412E9EF12669F55BF8489F89661B(){}
		public string date_and_time { get; set; }
		public string hospital_unit { get; set; }
		public string procedure { get; set; }
		public string performed_by { get; set; }
		public string outcome { get; set; }
}

public class _8E65FBD98EC828A01C337F1DE556F4E6
{
	public _8E65FBD98EC828A01C337F1DE556F4E6(){}
		public string date_and_time { get; set; }
		public string medication { get; set; }
		public string dose_frequency_duration { get; set; }
		public string adverse_reaction { get; set; }
		public string comments { get; set; }
}

public class _FEBD3534BC1A1F4B92B9CA881C05005E
{
	public _FEBD3534BC1A1F4B92B9CA881C05005E(){}
		public string date_time { get; set; }
		public string method { get; set; }
		public string complications { get; set; }
}

public class _9E3EACC3763707183F4DC8A0F2BC27D7
{
	public _9E3EACC3763707183F4DC8A0F2BC27D7(){}
		public string title { get; set; }
		public string specify_other { get; set; }
		public string npi { get; set; }
}

public class _503A2DD428104660DFA832A84C662EEB
{
	public _503A2DD428104660DFA832A84C662EEB(){}
		public string systolic_bp { get; set; }
		public string diastolic_bp { get; set; }
}

public class _8D7B5CF7224A7CD146C1B4CB60C3007D
{
	public _8D7B5CF7224A7CD146C1B4CB60C3007D(){}
		public string date_and_time { get; set; }
		public string temperature { get; set; }
		public string pulse { get; set; }
		public string respiration { get; set; }
		public string bp_systolic { get; set; }
		public string bp_diastolic { get; set; }
		public string oxygen_saturation { get; set; }
		public string comments { get; set; }
}

public class _6381ED26A687768AE7B6BBD94A0BA396
{
	public _6381ED26A687768AE7B6BBD94A0BA396(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
		public string time_of_rupture { get; set; }
}

public class _EA59C8E228397D9BF03803728F7ED2A3
{
	public _EA59C8E228397D9BF03803728F7ED2A3(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
		public string time_of_onset_of_labor { get; set; }
		public string duration_of_labor_prior_to_arrival { get; set; }
}

public class _B74C0D0C7B1923DEEFA36A850701F77E
{
	public _B74C0D0C7B1923DEEFA36A850701F77E(){}
public _EA59C8E228397D9BF03803728F7ED2A3 date_of_onset_of_labor{ get;set;}
public _6381ED26A687768AE7B6BBD94A0BA396 date_of_rupture{ get;set;}
		public string final_delivery_route { get; set; }
		public string onset_of_labor_was { get; set; }
		public string is_artificial { get; set; }
		public string is_spontaneous { get; set; }
		public string multiple_gestation { get; set; }
		public string pregnancy_outcome { get; set; }
		public string pregnancy_outcome_other_specify { get; set; }
}

public class _86F90F08838CF04EE360A249116DAFAA
{
	public _86F90F08838CF04EE360A249116DAFAA(){}
		public string date_and_time { get; set; }
		public string specimen { get; set; }
		public string exam_type { get; set; }
		public string findings { get; set; }
}

public class _C1688CD204DA4B73362401B17E90B9F0
{
	public _C1688CD204DA4B73362401B17E90B9F0(){}
		public string date_and_time { get; set; }
		public string specimen { get; set; }
		public string test_name { get; set; }
		public string result { get; set; }
		public string diagnostic_level { get; set; }
		public string comments { get; set; }
}

public class _0882CD00F617A7535223091DA16842BB
{
	public _0882CD00F617A7535223091DA16842BB(){}
		public string date_and_time { get; set; }
		public string exam_assessments { get; set; }
		public string findings { get; set; }
		public string performed_by { get; set; }
}

public class _6728FFF0F95C284D75C57D93ECD96EBB
{
	public _6728FFF0F95C284D75C57D93ECD96EBB(){}
		public string date_and_time { get; set; }
		public string exam_evaluation { get; set; }
		public string body_system { get; set; }
		public string findings { get; set; }
		public string performed_by { get; set; }
}

public class _F4EEC96036D1425284F51CC9BD1BDD14
{
	public _F4EEC96036D1425284F51CC9BD1BDD14(){}
		public string feet { get; set; }
		public string inches { get; set; }
		public string bmi { get; set; }
}

public class _4E6929B36D562AFE2732E8D38E813499
{
	public _4E6929B36D562AFE2732E8D38E813499(){}
public _F4EEC96036D1425284F51CC9BD1BDD14 height{ get;set;}
		public string admission_weight { get; set; }
}

public class _9132A2F6CA994FEE04B15402054C7474
{
	public _9132A2F6CA994FEE04B15402054C7474(){}
		public string date_and_time { get; set; }
		public string from_unit { get; set; }
		public string to_unit { get; set; }
		public string comments { get; set; }
}

public class _556EB19EBE4E888F2496647D61C50B5D
{
	public _556EB19EBE4E888F2496647D61C50B5D(){}
		public string value { get; set; }
		public string unit { get; set; }
}

public class _694C70F9FE970FCF099E9F6F1097BD3A
{
	public _694C70F9FE970FCF099E9F6F1097BD3A(){}
		public string facility_name { get; set; }
		public string type_of_facility { get; set; }
		public string type_of_facility_other_specify { get; set; }
		public string facility_npi_no { get; set; }
		public string maternal_level_of_care { get; set; }
		public string other_maternal_level_of_care { get; set; }
		public string street { get; set; }
		public string apartment { get; set; }
		public string city { get; set; }
		public string state { get; set; }
		public string zip_code { get; set; }
		public string county { get; set; }
		public string feature_matching_geography_type { get; set; }
		public string latitude { get; set; }
		public string longitude { get; set; }
		public string naaccr_gis_coordinate_quality_code { get; set; }
		public string naaccr_gis_coordinate_quality_type { get; set; }
		public string naaccr_census_tract_certainty_code { get; set; }
		public string naaccr_census_tract_certainty_type { get; set; }
		public string state_county_fips { get; set; }
		public string census_state_fips { get; set; }
		public string census_county_fips { get; set; }
		public string census_tract_fips { get; set; }
		public string urban_status { get; set; }
		public string census_met_div_fips { get; set; }
		public string census_cbsa_fips { get; set; }
		public string census_cbsa_micro { get; set; }
		public string mode_of_transportation_to_facility { get; set; }
		public string mode_of_transportation_to_facility_other { get; set; }
		public string origin_of_travel { get; set; }
		public string origin_of_travel_other { get; set; }
public _556EB19EBE4E888F2496647D61C50B5D travel_time_to_hospital{ get;set;}
}

public class _B40821148E2FC7A3B24644E46499217A
{
	public _B40821148E2FC7A3B24644E46499217A(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
		public string time_of_discharge { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
		public string days_postpartum { get; set; }
}

public class _AC9ED4D4E4037C26C9051F03B2BAD54E
{
	public _AC9ED4D4E4037C26C9051F03B2BAD54E(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
		public string time_of_admission { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
		public string days_postpartum { get; set; }
}

public class _C8C8E31D7D69C21EF76FA585C4D158E3
{
	public _C8C8E31D7D69C21EF76FA585C4D158E3(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
		public string time_of_arrival { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
		public string days_postpartum { get; set; }
}

public class _52E32FFA383E16324279014838607851
{
	public _52E32FFA383E16324279014838607851(){}
public _C8C8E31D7D69C21EF76FA585C4D158E3 date_of_arrival{ get;set;}
public _AC9ED4D4E4037C26C9051F03B2BAD54E date_of_hospital_admission{ get;set;}
		public string admission_condition { get; set; }
		public string admission_status { get; set; }
		public string admission_status_other { get; set; }
		public string admission_reason { get; set; }
		public string admission_reason_other { get; set; }
		public string principle_source_of_payment { get; set; }
		public string principle_source_of_payment_other_specify { get; set; }
		public string was_recieved_from_another_hospital { get; set; }
		public string from_where { get; set; }
		public string was_transferred_to_another_hospital { get; set; }
		public string to_where { get; set; }
public _B40821148E2FC7A3B24644E46499217A date_of_hospital_discharge{ get;set;}
		public string discharge_pregnancy_status { get; set; }
		public string deceased_at_discharge { get; set; }
}

public class _022BC412269BEF5AB3D35F5F824B83E5
{
	public _022BC412269BEF5AB3D35F5F824B83E5(){}
		public string medical_record_no { get; set; }
}

public class _0CE40C4018C47CA22AC1A0003DC34FB7
{
	public _0CE40C4018C47CA22AC1A0003DC34FB7(){}
public _022BC412269BEF5AB3D35F5F824B83E5 maternal_record_identification{ get;set;}
public _52E32FFA383E16324279014838607851 basic_admission_and_discharge_information{ get;set;}
public _694C70F9FE970FCF099E9F6F1097BD3A name_and_location_facility{ get;set;}
public List<_9132A2F6CA994FEE04B15402054C7474> internal_transfers{ get;set;}
public _4E6929B36D562AFE2732E8D38E813499 maternal_biometrics{ get;set;}
public List<_6728FFF0F95C284D75C57D93ECD96EBB> physical_exam_and_evaluations{ get;set;}
public List<_0882CD00F617A7535223091DA16842BB> psychological_exam_and_assesments{ get;set;}
public List<_C1688CD204DA4B73362401B17E90B9F0> labratory_tests{ get;set;}
public List<_86F90F08838CF04EE360A249116DAFAA> pathology{ get;set;}
public _B74C0D0C7B1923DEEFA36A850701F77E onset_of_labor{ get;set;}
public List<_8D7B5CF7224A7CD146C1B4CB60C3007D> vital_signs{ get;set;}
public _503A2DD428104660DFA832A84C662EEB highest_bp{ get;set;}
public List<_9E3EACC3763707183F4DC8A0F2BC27D7> birth_attendant{ get;set;}
		public string were_there_complications_of_anesthesia { get; set; }
public List<_FEBD3534BC1A1F4B92B9CA881C05005E> anesthesia{ get;set;}
		public string any_adverse_reactions { get; set; }
public List<_8E65FBD98EC828A01C337F1DE556F4E6> list_of_medications{ get;set;}
		public string any_surgical_procedures { get; set; }
public List<_2019412E9EF12669F55BF8489F89661B> surgical_procedures{ get;set;}
		public string any_blood_transfusions { get; set; }
		public string patient_blood_type { get; set; }
public List<_A5A4696A044B1F5146F3E8EDF1D941F9> blood_product_grid{ get;set;}
public List<_E6866482E638B68311DFC377B9C1683A> diagnostic_imaging_grid{ get;set;}
public List<_ABB6583CF8BFB479D6A720B3F297116E> referrals_and_consultations{ get;set;}
		public string reviewer_note { get; set; }
}

public class _E564335670B1446923BCA2B6D0E5147F
{
	public _E564335670B1446923BCA2B6D0E5147F(){}
		public string place { get; set; }
		public string provider_type { get; set; }
		public string city { get; set; }
		public string state { get; set; }
		public string begin_date { get; set; }
		public string end_date { get; set; }
		public string pregrid_comments { get; set; }
}

public class _09BC93A66151FE9672FFEB3841E02A0D
{
	public _09BC93A66151FE9672FFEB3841E02A0D(){}
		public string date { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
		public string type_of_specialist { get; set; }
		public string reason { get; set; }
		public string was_appointment_kept { get; set; }
}

public class _D2DAC659661D88CEB6D93A2091F71CAD
{
	public _D2DAC659661D88CEB6D93A2091F71CAD(){}
		public string date { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
		public string facility { get; set; }
		public string duration { get; set; }
		public string reason { get; set; }
		public string comments { get; set; }
}

public class _011C3E72A57DE3AB66351169D6F6D5EA
{
	public _011C3E72A57DE3AB66351169D6F6D5EA(){}
		public string date { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
		public string medication { get; set; }
		public string dose_frequency_duration { get; set; }
		public string reason { get; set; }
		public string is_adverse_reaction { get; set; }
}

public class _5180AC492C8C104F8787060407249334
{
	public _5180AC492C8C104F8787060407249334(){}
		public string date_1st_noted { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
		public string problem { get; set; }
		public string comments { get; set; }
}

public class _84561DBF6AEC5892A65DF8E2D85470D7
{
	public _84561DBF6AEC5892A65DF8E2D85470D7(){}
		public string date { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
		public string procedure { get; set; }
		public string comments { get; set; }
}

public class _524E042339910523A01145C2724B9350
{
	public _524E042339910523A01145C2724B9350(){}
		public string date_and_time { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
		public string test_or_procedure { get; set; }
		public string results { get; set; }
		public string comments { get; set; }
}

public class _7D05294A3D621B59A07C395DD05AC6ED
{
	public _7D05294A3D621B59A07C395DD05AC6ED(){}
		public string systolic { get; set; }
		public string diastolic { get; set; }
}

public class _B2FC9E3D5D8BAE58DD3E9BB9CF1B46D5
{
	public _B2FC9E3D5D8BAE58DD3E9BB9CF1B46D5(){}
		public string date_and_time { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
		public string systolic_bp { get; set; }
		public string diastolic { get; set; }
		public string heart_rate { get; set; }
		public string oxygen_saturation { get; set; }
		public string urine_protein { get; set; }
		public string urine_ketones { get; set; }
		public string urine_glucose { get; set; }
		public string blood_hematocrit { get; set; }
		public string weight { get; set; }
		public string comments { get; set; }
}

public class _DBD80EB2135F84E1BD3FE6A7640B4C65
{
	public _DBD80EB2135F84E1BD3FE6A7640B4C65(){}
		public string feet { get; set; }
		public string inches { get; set; }
}

public class _863F482DC827D58387CF8EA02878C4A9
{
	public _863F482DC827D58387CF8EA02878C4A9(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
		public string gestational_age_at_last_prenatal_visit { get; set; }
		public string gestational_age_at_last_prenatal_visit_days { get; set; }
}

public class _E4A6FED46D116B4778FC2131B5A5D739
{
	public _E4A6FED46D116B4778FC2131B5A5D739(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
		public string gestational_age_at_first_ultrasound { get; set; }
		public string gestational_age_at_first_ultrasound_days { get; set; }
}

public class _DB29CBF2CD768EBBCD0FB7C970B2E585
{
	public _DB29CBF2CD768EBBCD0FB7C970B2E585(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
		public string gestational_age_weeks { get; set; }
		public string gestational_age_days { get; set; }
}

public class _BC6376F2085FB073004A29BE96A7676E
{
	public _BC6376F2085FB073004A29BE96A7676E(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
		public string estimate_based_on { get; set; }
		public string estimate_based_on_ultrasound { get; set; }
		public string estimate_based_on_lmp { get; set; }
}

public class _EF34E70882D335F28D703380EF23BA00
{
	public _EF34E70882D335F28D703380EF23BA00(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _17F17143D948AABBCF8F029D68346E4B
{
	public _17F17143D948AABBCF8F029D68346E4B(){}
public _EF34E70882D335F28D703380EF23BA00 date_of_last_normal_menses{ get;set;}
public _BC6376F2085FB073004A29BE96A7676E estimated_date_of_confinement{ get;set;}
public _DB29CBF2CD768EBBCD0FB7C970B2E585 date_of_1st_prenatal_visit{ get;set;}
public _E4A6FED46D116B4778FC2131B5A5D739 date_of_1st_ultrasound{ get;set;}
public _863F482DC827D58387CF8EA02878C4A9 date_of_last_prenatal_visit{ get;set;}
public _DBD80EB2135F84E1BD3FE6A7640B4C65 height{ get;set;}
		public string pre_pregnancy_weight { get; set; }
		public string bmi { get; set; }
		public string weight_at_1st_visit { get; set; }
		public string weight_at_last_visit { get; set; }
		public string weight_gain { get; set; }
		public string total_number_of_visits { get; set; }
		public string trimester_of_first_pnc_visit { get; set; }
		public string number_of_fetuses { get; set; }
		public string was_home_delivery_planned { get; set; }
		public string attended_prenatal_visits_alone { get; set; }
		public string intended_birthing_facility { get; set; }
}

public class _E08949C3EA32F7E6C01990BF3094115F
{
	public _E08949C3EA32F7E6C01990BF3094115F(){}
		public string was_pregnancy_result_of_infertility_treatment { get; set; }
		public string fertility_enhanding_drugs { get; set; }
		public string assisted_reproductive_technology { get; set; }
		public string art_type { get; set; }
		public string specify_other_art_type { get; set; }
		public string cycle_number { get; set; }
		public string embryos_transferred { get; set; }
		public string embryos_growing { get; set; }
}

public class _5AE0C5476B5EBCB6169B575B3C9A7054
{
	public _5AE0C5476B5EBCB6169B575B3C9A7054(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _3B50369398258E8F818A54026A4083D0
{
	public _3B50369398258E8F818A54026A4083D0(){}
public _5AE0C5476B5EBCB6169B575B3C9A7054 date_birth_control_was_discontinued{ get;set;}
		public string was_pregnancy_planned { get; set; }
		public string pi_wp_plann_sp { get; set; }
		public string was_patient_using_birth_control { get; set; }
		public string was_patient_using_birth_control_other_specify { get; set; }
}

public class _806E4DA069E6081A570C043C83F92FB9
{
	public _806E4DA069E6081A570C043C83F92FB9(){}
		public string date_ended { get; set; }
		public string outcome { get; set; }
		public string gestational_age { get; set; }
		public string birth_weight_uom { get; set; }
		public string birth_weight { get; set; }
		public string birth_weight_oz { get; set; }
		public string method_of_delivery { get; set; }
		public string complications { get; set; }
		public string is_now_living { get; set; }
}

public class _CB4A0311CE874081BDBCB946D4CE3D0E
{
	public _CB4A0311CE874081BDBCB946D4CE3D0E(){}
		public string gravida { get; set; }
		public string para { get; set; }
		public string abortions { get; set; }
public List<_806E4DA069E6081A570C043C83F92FB9> details_grid{ get;set;}
}

public class _DB12CCDCFE9F36C81A924DA8DAA1F817
{
	public _DB12CCDCFE9F36C81A924DA8DAA1F817(){}
		public string substance { get; set; }
		public string substance_other { get; set; }
		public string screening { get; set; }
		public string couseling_education { get; set; }
		public string comments { get; set; }
}

public class _A42F5E1D0CC492390B78D665C2162B38
{
	public _A42F5E1D0CC492390B78D665C2162B38(){}
		public string relation { get; set; }
		public string condition { get; set; }
		public string is_living { get; set; }
		public string age_at_death { get; set; }
		public string comments { get; set; }
}

public class _99F6F090455B774931675928588796B4
{
	public _99F6F090455B774931675928588796B4(){}
		public string condition { get; set; }
		public string other { get; set; }
		public string duration { get; set; }
		public string comments { get; set; }
}

public class _0BEE61C35D43336B78C52D609B939CFF
{
	public _0BEE61C35D43336B78C52D609B939CFF(){}
		public string date { get; set; }
		public string procedure { get; set; }
		public string comments { get; set; }
}

public class _3707ED9DADC50A2734DB4FBA5596CC6F
{
	public _3707ED9DADC50A2734DB4FBA5596CC6F(){}
		public string street { get; set; }
		public string apartment { get; set; }
		public string city { get; set; }
		public string state { get; set; }
		public string zip_code { get; set; }
		public string county { get; set; }
		public string feature_matching_geography_type { get; set; }
		public string latitude { get; set; }
		public string longitude { get; set; }
		public string naaccr_gis_coordinate_quality_code { get; set; }
		public string naaccr_gis_coordinate_quality_type { get; set; }
		public string naaccr_census_tract_certainty_code { get; set; }
		public string naaccr_census_tract_certainty_type { get; set; }
		public string state_county_fips { get; set; }
		public string census_state_fips { get; set; }
		public string census_county_fips { get; set; }
		public string census_tract_fips { get; set; }
		public string urban_status { get; set; }
		public string census_met_div_fips { get; set; }
		public string census_cbsa_fips { get; set; }
		public string census_cbsa_micro { get; set; }
}

public class _F345FC0E715533656FD350796788C303
{
	public _F345FC0E715533656FD350796788C303(){}
		public string place_type { get; set; }
		public string other_place_type { get; set; }
		public string primary_provider_type { get; set; }
		public string specify_other_provider_type { get; set; }
		public string principal_source_of_payment { get; set; }
		public string other_payment_source { get; set; }
		public string is_use_wic { get; set; }
}

public class _02DBD2E611DEC822A826C2F0B1D1DE0F
{

	public _02DBD2E611DEC822A826C2F0B1D1DE0F(){}
		public string prenatal_care_record_no { get; set; }
		public string number_of_pnc_sources { get; set; }
public _F345FC0E715533656FD350796788C303 primary_prenatal_care_facility{ get;set;}
public _3707ED9DADC50A2734DB4FBA5596CC6F location_of_primary_prenatal_care_facility{ get;set;}
public List<_0BEE61C35D43336B78C52D609B939CFF> prior_surgical_procedures_before_pregnancy{ get;set;}
		public string had_pre_existing_conditions { get; set; }
public List<_99F6F090455B774931675928588796B4> pre_existing_conditons_grid{ get;set;}
		public string were_there_documented_mental_health_conditions { get; set; }
public List<_A42F5E1D0CC492390B78D665C2162B38> family_medical_history{ get;set;}
		public string evidence_of_substance_use { get; set; }
public List<_DB12CCDCFE9F36C81A924DA8DAA1F817> substance_use_grid{ get;set;}
public _CB4A0311CE874081BDBCB946D4CE3D0E pregnancy_history{ get;set;}
public _3B50369398258E8F818A54026A4083D0 intendedenes{ get;set;}
public _E08949C3EA32F7E6C01990BF3094115F infertility_treatment{ get;set;}
public _17F17143D948AABBCF8F029D68346E4B current_pregnancy{ get;set;}
public List<_B2FC9E3D5D8BAE58DD3E9BB9CF1B46D5> routine_monitoring{ get;set;}
public _7D05294A3D621B59A07C395DD05AC6ED highest_blood_pressure{ get;set;}
		public string lowest_hematocrit { get; set; }
public List<_524E042339910523A01145C2724B9350> other_lab_tests{ get;set;}
public List<_84561DBF6AEC5892A65DF8E2D85470D7> diagnostic_procedures{ get;set;}
		public string were_there_problems_identified { get; set; }
public List<_5180AC492C8C104F8787060407249334> problems_identified_grid{ get;set;}
		public string were_there_adverse_reactions { get; set; }
public List<_011C3E72A57DE3AB66351169D6F6D5EA> medications_and_drugs_during_pregnancy{ get;set;}
		public string were_there_pre_delivery_hospitalizations { get; set; }
public List<_D2DAC659661D88CEB6D93A2091F71CAD> pre_delivery_hospitalizations_details{ get;set;}
		public string were_medical_referrals_to_others { get; set; }
public List<_09BC93A66151FE9672FFEB3841E02A0D> medical_referrals{ get;set;}
public List<_E564335670B1446923BCA2B6D0E5147F> other_sources_of_prenatal_care{ get;set;}
		public string reviewer_note { get; set; }
}

public class _2D2652A51B7645E75AABEEA44B2748C6
{
	public _2D2652A51B7645E75AABEEA44B2748C6(){}
		public string type { get; set; }
		public string cause { get; set; }
		public string icd_code { get; set; }
		public string comment { get; set; }
}

public class _5964DC7BA40CF36668B104232BD8921E
{
	public _5964DC7BA40CF36668B104232BD8921E(){}
		public string substance { get; set; }
		public string substance_other { get; set; }
		public string concentration { get; set; }
		public string unit_of_measure { get; set; }
		public string level { get; set; }
		public string comment { get; set; }
}

public class _CF4B7B66A1DC8C0EBA59772A9B821F57
{
	public _CF4B7B66A1DC8C0EBA59772A9B821F57(){}
		public string finding { get; set; }
		public string comment { get; set; }
}

public class _D816D73B417F4C6B7AC740C90F0B9CE4
{
	public _D816D73B417F4C6B7AC740C90F0B9CE4(){}
		public string finding { get; set; }
		public string comment { get; set; }
}

public class _83E78247F38C6BD2EE189D9AB6041AF2
{
	public _83E78247F38C6BD2EE189D9AB6041AF2(){}
public List<_D816D73B417F4C6B7AC740C90F0B9CE4> gross_findings{ get;set;}
public List<_CF4B7B66A1DC8C0EBA59772A9B821F57> microscopic_findings{ get;set;}
}

public class _27CF95EB08CABBF46F4FF4422CE2FC55
{
	public _27CF95EB08CABBF46F4FF4422CE2FC55(){}
		public string fetal_weight_uom { get; set; }
		public string fetal_weight { get; set; }
		public string fetal_weight_ounce_value { get; set; }
		public string fetal_length_uom { get; set; }
		public string fetal_length { get; set; }
		public string gestational_age_estimate { get; set; }
}

public class _25D210E54E314A74A67BCE675C71E0E8
{
	public _25D210E54E314A74A67BCE675C71E0E8(){}
		public string feet { get; set; }
		public string inches { get; set; }
}

public class _4170BDAD1CE2C52F88B99BD6A5470A93
{
	public _4170BDAD1CE2C52F88B99BD6A5470A93(){}
public _25D210E54E314A74A67BCE675C71E0E8 height{ get;set;}
		public string weight { get; set; }
		public string bmi { get; set; }
}

public class _25978EF7952E5F9AC1D8095C00D28D01
{
	public _25978EF7952E5F9AC1D8095C00D28D01(){}
public _4170BDAD1CE2C52F88B99BD6A5470A93 mother{ get;set;}
public _27CF95EB08CABBF46F4FF4422CE2FC55 fetus{ get;set;}
}

public class _2D7D94EA0A596F15ED7BFB8F26D8FE51
{
	public _2D7D94EA0A596F15ED7BFB8F26D8FE51(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _772E74492326508617EAE8C9A1363875
{
	public _772E74492326508617EAE8C9A1363875(){}
		public string reporter_type { get; set; }
		public string other_specify { get; set; }
public _2D7D94EA0A596F15ED7BFB8F26D8FE51 date_of_autopsy{ get;set;}
		public string jurisdiction { get; set; }
}

public class _B01FDEA65CCD8F2AE7E63858F58F93D2
{

	public _B01FDEA65CCD8F2AE7E63858F58F93D2(){}
		public string was_there_an_autopsy_referral { get; set; }
		public string type_of_autopsy_or_examination { get; set; }
		public string is_autopsy_or_exam_report_available { get; set; }
		public string was_toxicology_performed { get; set; }
		public string is_toxicology_report_available { get; set; }
		public string completeness_of_autopsy_information { get; set; }
public _772E74492326508617EAE8C9A1363875 reporter_characteristics{ get;set;}
public _25978EF7952E5F9AC1D8095C00D28D01 biometrics{ get;set;}
public _83E78247F38C6BD2EE189D9AB6041AF2 relevant_maternal_death_findings{ get;set;}
		public string was_drug_toxicology_positive { get; set; }
public List<_5964DC7BA40CF36668B104232BD8921E> toxicology{ get;set;}
		public string icd_code_version { get; set; }
public List<_2D2652A51B7645E75AABEEA44B2748C6> causes_of_death{ get;set;}
		public string reviewer_note { get; set; }
}

public class _E756520306FD338C0B0860593DC8DA3A
{
	public _E756520306FD338C0B0860593DC8DA3A(){}
		public string substance { get; set; }
		public string substance_other { get; set; }
		public string timing_of_substance_use { get; set; }
}

public class _6E27E4FBB87969E701428AE88CA84C81
{
	public _6E27E4FBB87969E701428AE88CA84C81(){}
		public string date { get; set; }
		public string element { get; set; }
		public string element_other { get; set; }
		public string source_name { get; set; }
		public string comments { get; set; }
}

public class _432CE1B3BC36EF9DE32E8468D8534AE8
{
	public _432CE1B3BC36EF9DE32E8468D8534AE8(){}
		public string date { get; set; }
		public string referred_to { get; set; }
		public string specialty { get; set; }
		public string reason { get; set; }
		public string compiled { get; set; }
		public string reason_for_non_compliance { get; set; }
		public string comments { get; set; }
}

public class _50B879B8B59D6A57B6EB05567DDBCA33
{
	public _50B879B8B59D6A57B6EB05567DDBCA33(){}
		public string no_prenatal_care { get; set; }
		public List<string> reasons_for_missed_appointments { get; set; }
		public string specify_other_reason { get; set; }
		public string comments { get; set; }
}

public class _96AA3E194F6BC537FB5F434DFD615757
{
	public _96AA3E194F6BC537FB5F434DFD615757(){}
		public List<string> evidence_of_social_or_emotional_stress { get; set; }
		public string specify_other_evidence_stress { get; set; }
		public string explain_further { get; set; }
}

public class _E8C0CF44AF3545233757E6289E24D81E
{
	public _E8C0CF44AF3545233757E6289E24D81E(){}
		public List<string> barriers_to_communications { get; set; }
		public string barriers_to_communications_other_specify { get; set; }
		public string comments { get; set; }
}

public class _BF3869379E680EFF0AFD228F6721E321
{
	public _BF3869379E680EFF0AFD228F6721E321(){}
		public List<string> barriers_to_health_care_access { get; set; }
		public string barriers_to_health_care_access_other_specify { get; set; }
		public string comments { get; set; }
}

public class _89F006213C97FCDC5E5ADF202F4F432A
{
	public _89F006213C97FCDC5E5ADF202F4F432A(){}
		public string date_of_arrest { get; set; }
		public string arest_reason { get; set; }
		public string occurrence { get; set; }
		public string comments { get; set; }
}

public class _A8642BB74354C5376FC865B44333C728
{
	public _A8642BB74354C5376FC865B44333C728(){}
		public string date { get; set; }
		public string duration { get; set; }
		public string reason { get; set; }
		public string occurrence { get; set; }
		public string comments { get; set; }
}

public class _3B2F8F0C651E92A4C85C4EE2E36AAFCD
{
	public _3B2F8F0C651E92A4C85C4EE2E36AAFCD(){}
		public string relationship { get; set; }
		public string gender { get; set; }
		public string age { get; set; }
		public string comments { get; set; }
}

public class _EB9A042F77D74AD816926B7E549ED2B0
{
	public _EB9A042F77D74AD816926B7E549ED2B0(){}
		public string sep_genid_is_nonfemale { get; set; }
		public List<string> sep_genid_source { get; set; }
		public string sep_genid_source_othersp { get; set; }
		public string sep_genid_source_terms { get; set; }
}

public class _C86F3E109F5ED04A5C51E2F5FBD01ACD
{
	public _C86F3E109F5ED04A5C51E2F5FBD01ACD(){}
		public string source_of_income { get; set; }
		public string source_of_income_other_specify { get; set; }
		public string employment_status { get; set; }
		public string employment_status_other_specify { get; set; }
		public string occupation { get; set; }
		public string religious_preference { get; set; }
		public string country_of_birth { get; set; }
		public string immigration_status { get; set; }
		public string time_in_the_us { get; set; }
		public string time_in_the_us_units { get; set; }
		public string current_living_arrangements { get; set; }
		public List<string> homelessness { get; set; }
		public List<string> unstable_housing { get; set; }
		public string sep_m_occupation_code_1 { get; set; }
		public string sep_m_occupation_code_2 { get; set; }
		public string sep_m_occupation_code_3 { get; set; }
		public string sep_m_industry_code_1 { get; set; }
		public string sep_m_industry_code_2 { get; set; }
		public string sep_m_industry_code_3 { get; set; }
}

public class _F495787DD96BB2B871443F9596F9C77F
{

	public _F495787DD96BB2B871443F9596F9C77F(){}
public _C86F3E109F5ED04A5C51E2F5FBD01ACD socio_economic_characteristics{ get;set;}
public _EB9A042F77D74AD816926B7E549ED2B0 gender_identity{ get;set;}
public List<_3B2F8F0C651E92A4C85C4EE2E36AAFCD> members_of_household{ get;set;}
		public List<string> previous_or_current_incarcerations { get; set; }
public List<_A8642BB74354C5376FC865B44333C728> details_of_incarcerations{ get;set;}
		public List<string> was_decedent_ever_arrested { get; set; }
public List<_89F006213C97FCDC5E5ADF202F4F432A> details_of_arrests{ get;set;}
public _BF3869379E680EFF0AFD228F6721E321 health_care_access{ get;set;}
public _E8C0CF44AF3545233757E6289E24D81E communications{ get;set;}
public _96AA3E194F6BC537FB5F434DFD615757 social_or_emotional_stress{ get;set;}
public _50B879B8B59D6A57B6EB05567DDBCA33 health_care_system{ get;set;}
		public string had_military_service { get; set; }
		public string was_there_bereavement_support { get; set; }
public List<_432CE1B3BC36EF9DE32E8468D8534AE8> social_and_medical_referrals{ get;set;}
public List<_6E27E4FBB87969E701428AE88CA84C81> sources_of_social_services_information_for_this_record{ get;set;}
		public string documented_substance_use { get; set; }
public List<_E756520306FD338C0B0860593DC8DA3A> if_yes_specify_substances{ get;set;}
		public string reviewer_note { get; set; }
}

public class _5FC61AE6AD6DF115AA29045A66A14983
{
	public _5FC61AE6AD6DF115AA29045A66A14983(){}
		public string cvs_api_request_url { get; set; }
		public string cvs_api_request_date_time { get; set; }
		public string cvs_api_request_c_geoid { get; set; }
		public string cvs_api_request_t_geoid { get; set; }
		public string cvs_api_request_year { get; set; }
		public string cvs_api_request_result_message { get; set; }
		public string cvs_mdrate_county { get; set; }
		public string cvs_pctnoins_fem_county { get; set; }
		public string cvs_pctnoins_fem_tract { get; set; }
		public string cvs_pctnovehicle_county { get; set; }
		public string cvs_pctnovehicle_tract { get; set; }
		public string cvs_pctmove_county { get; set; }
		public string cvs_pctmove_tract { get; set; }
		public string cvs_pctsphh_county { get; set; }
		public string cvs_pctsphh_tract { get; set; }
		public string cvs_pctovercrowdhh_county { get; set; }
		public string cvs_pctovercrowdhh_tract { get; set; }
		public string cvs_pctowner_occ_county { get; set; }
		public string cvs_pctowner_occ_tract { get; set; }
		public string cvs_pct_less_well_county { get; set; }
		public string cvs_pct_less_well_tract { get; set; }
		public string cvs_ndi_raw_county { get; set; }
		public string cvs_ndi_raw_tract { get; set; }
		public string cvs_pctpov_county { get; set; }
		public string cvs_pctpov_tract { get; set; }
		public string cvs_ice_income_all_county { get; set; }
		public string cvs_ice_income_all_tract { get; set; }
		public string cvs_medhhinc_county { get; set; }
		public string cvs_medhhinc_tract { get; set; }
		public string cvs_pctobese_county { get; set; }
		public string cvs_fi_county { get; set; }
		public string cvs_cnmrate_county { get; set; }
		public string cvs_obgynrate_county { get; set; }
		public string cvs_rtteenbirth_county { get; set; }
		public string cvs_rtstd_county { get; set; }
		public string cvs_rtmhpract_county { get; set; }
		public string cvs_rtdrugodmortality_county { get; set; }
		public string cvs_rtopioidprescript_county { get; set; }
		public string cvs_soccap_county { get; set; }
		public string cvs_rtsocassoc_county { get; set; }
		public string cvs_pcthouse_distress_county { get; set; }
		public string cvs_rtviolentcr_icpsr_county { get; set; }
		public string cvs_isolation_county { get; set; }
}

public class _72F1A850D966375FA159121C7C8B09A1
{

	public _72F1A850D966375FA159121C7C8B09A1(){}
		public string cvs_used { get; set; }
		public string cvs_used_how { get; set; }
		public string cvs_used_other_sp { get; set; }
		public string reviewer_note { get; set; }
public List<_5FC61AE6AD6DF115AA29045A66A14983> cvs_grid{ get;set;}
}

public class _180D7E8BAC8D3315D498840F354A7694
{
	public _180D7E8BAC8D3315D498840F354A7694(){}
		public string summary_text { get; set; }
		public string cod18a1 { get; set; }
		public string cod18a2 { get; set; }
		public string cod18a3 { get; set; }
		public string cod18a4 { get; set; }
		public string cod18a5 { get; set; }
		public string cod18a6 { get; set; }
		public string cod18a7 { get; set; }
		public string cod18a8 { get; set; }
		public string cod18a9 { get; set; }
		public string cod18a10 { get; set; }
		public string cod18a11 { get; set; }
		public string cod18a12 { get; set; }
		public string cod18a13 { get; set; }
		public string cod18a14 { get; set; }
		public string cod18b1 { get; set; }
		public string cod18b2 { get; set; }
		public string cod18b3 { get; set; }
		public string cod18b4 { get; set; }
		public string cod18b5 { get; set; }
		public string cod18b6 { get; set; }
		public string cod18b7 { get; set; }
		public string cod18b8 { get; set; }
		public string cod18b9 { get; set; }
		public string cod18b10 { get; set; }
		public string cod18b11 { get; set; }
		public string cod18b12 { get; set; }
		public string cod18b13 { get; set; }
		public string cod18b14 { get; set; }
		public string icod { get; set; }
		public string ocod1 { get; set; }
		public string ocod2 { get; set; }
		public string ocod3 { get; set; }
		public string ocod4 { get; set; }
		public string ocod5 { get; set; }
		public string ocod6 { get; set; }
		public string ocod7 { get; set; }
}

public class _D254CBE21CC45929794503CA76F3D904
{
	public _D254CBE21CC45929794503CA76F3D904(){}
		public string type { get; set; }
		public string @class { get; set; }
		public string complication_subclass { get; set; }
		public string other_specify { get; set; }
		public string icd_code { get; set; }
}

public class _EE7E3E53FEF286D9C356E5E2EFC17F2C
{
	public _EE7E3E53FEF286D9C356E5E2EFC17F2C(){}
		public string was_delivery_with_forceps_attempted_but_unsuccessful { get; set; }
		public string was_delivery_with_vacuum_extration_attempted_but_unsuccessful { get; set; }
		public string fetal_delivery { get; set; }
		public string other_presentation { get; set; }
		public string final_route_and_method_of_delivery { get; set; }
		public string if_cesarean_was_trial_of_labor_attempted { get; set; }
}

public class _65228517D188454210BA20A6234601CB
{
	public _65228517D188454210BA20A6234601CB(){}
		public string minute_5 { get; set; }
		public string minute_10 { get; set; }
}

public class _564D05D8DE1347EFFC8CACE64166DFB3
{
	public _564D05D8DE1347EFFC8CACE64166DFB3(){}
		public string unit_of_measurement { get; set; }
		public string grams_or_pounds { get; set; }
		public string ounces { get; set; }
}

public class _B2BBB7831DD41F0BF6176ACD23ADB38C
{
	public _B2BBB7831DD41F0BF6176ACD23ADB38C(){}
public _564D05D8DE1347EFFC8CACE64166DFB3 birth_weight{ get;set;}
		public string gender { get; set; }
public _65228517D188454210BA20A6234601CB apgar_scores{ get;set;}
		public string is_infant_living_at_time_of_report { get; set; }
		public string is_infant_being_breastfed_at_discharge { get; set; }
		public string was_infant_transferred_within_24_hours { get; set; }
		public string facility_city_state { get; set; }
}

public class _036EC801621DF61F061A328B5607A96A
{
	public _036EC801621DF61F061A328B5607A96A(){}
		public string state_file_number { get; set; }
		public string local_file_number { get; set; }
		public string newborn_medical_record_number { get; set; }
		public string date_of_delivery { get; set; }
		public string time_of_delivery { get; set; }
}

public class _580C23C24054AB0BE30540A0BDCD16A0
{
	public _580C23C24054AB0BE30540A0BDCD16A0(){}
		public string record_type { get; set; }
		public string is_multiple_gestation { get; set; }
		public string birth_order { get; set; }
public _036EC801621DF61F061A328B5607A96A record_identification{ get;set;}
public _B2BBB7831DD41F0BF6176ACD23ADB38C biometrics_and_demographics{ get;set;}
public _EE7E3E53FEF286D9C356E5E2EFC17F2C method_of_delivery{ get;set;}
		public List<string> abnormal_conditions_of_newborn { get; set; }
		public List<string> congenital_anomalies { get; set; }
		public string icd_version { get; set; }
public List<_D254CBE21CC45929794503CA76F3D904> causes_of_death{ get;set;}
		public string reviewer_note { get; set; }
public _180D7E8BAC8D3315D498840F354A7694 vitals_import_group{ get;set;}
}

public class _729048DC80F0E6748B09405ACE96B47A
{
	public _729048DC80F0E6748B09405ACE96B47A(){}
		public List<string> risk_factors_in_this_pregnancy { get; set; }
		public string number_of_c_sections { get; set; }
}

public class _138CDA950E0762377AF4F350FAC6446E
{
	public _138CDA950E0762377AF4F350FAC6446E(){}
		public string prior_3_months { get; set; }
		public string prior_3_months_type { get; set; }
		public string trimester_1st { get; set; }
		public string trimester_1st_type { get; set; }
		public string trimester_2nd { get; set; }
		public string trimester_2nd_type { get; set; }
		public string trimester_3rd { get; set; }
		public string trimester_3rd_type { get; set; }
		public string none_or_not_specified { get; set; }
}

public class _FF5F1AAE5D8E4D6B59BD2F0DE60CDC4F
{
	public _FF5F1AAE5D8E4D6B59BD2F0DE60CDC4F(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _7047641B2EDBD576995FFE43AB716526
{
	public _7047641B2EDBD576995FFE43AB716526(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _BF73700031E60AB353EA4F6CE845BDB4
{
	public _BF73700031E60AB353EA4F6CE845BDB4(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _F99ABFF90FBA0ED894B160D3B34256AD
{
	public _F99ABFF90FBA0ED894B160D3B34256AD(){}
public _BF73700031E60AB353EA4F6CE845BDB4 date_of_last_normal_menses{ get;set;}
public _7047641B2EDBD576995FFE43AB716526 date_of_1st_prenatal_visit{ get;set;}
public _FF5F1AAE5D8E4D6B59BD2F0DE60CDC4F date_of_last_prenatal_visit{ get;set;}
		public string calculated_gestation { get; set; }
		public string calculated_gestation_days { get; set; }
		public string obsteric_estimate_of_gestation { get; set; }
		public string plurality { get; set; }
		public string specify_if_greater_than_3 { get; set; }
		public string was_wic_used { get; set; }
		public string principal_source_of_payment_for_this_delivery { get; set; }
		public string specify_other_payor { get; set; }
		public string trimester_of_1st_prenatal_care_visit { get; set; }
		public string number_of_visits { get; set; }
}

public class _9695E0E82516F4F139F21CEF9F275B1B
{
	public _9695E0E82516F4F139F21CEF9F275B1B(){}
		public string height_feet { get; set; }
		public string height_inches { get; set; }
		public string pre_pregnancy_weight { get; set; }
		public string weight_at_delivery { get; set; }
		public string weight_gain { get; set; }
		public string bmi { get; set; }
}

public class _99B9ACB24E94944545611B1E9E9C6415
{
	public _99B9ACB24E94944545611B1E9E9C6415(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _EE580ACBE00EC5F8FC589EDA2D706CE3
{
	public _EE580ACBE00EC5F8FC589EDA2D706CE3(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _5572D24F3E250810200ACE846413E414
{
	public _5572D24F3E250810200ACE846413E414(){}
public _EE580ACBE00EC5F8FC589EDA2D706CE3 date_of_last_live_birth{ get;set;}
		public string live_birth_interval { get; set; }
		public string number_of_previous_live_births { get; set; }
		public string now_living { get; set; }
		public string now_dead { get; set; }
		public string other_outcomes { get; set; }
public _99B9ACB24E94944545611B1E9E9C6415 date_of_last_other_outcome{ get;set;}
		public string pregnancy_interval { get; set; }
}

public class _A6F09668892BE9993511ADC113345A8B
{
	public _A6F09668892BE9993511ADC113345A8B(){}
		public List<string> race_of_mother { get; set; }
		public string other_race { get; set; }
		public string other_asian { get; set; }
		public string other_pacific_islander { get; set; }
		public string principle_tribe { get; set; }
		public string omb_race_recode { get; set; }
}

public class _6F8603F4EEF2CB125B9224B073EBAF80
{
	public _6F8603F4EEF2CB125B9224B073EBAF80(){}
		public string street { get; set; }
		public string apartment { get; set; }
		public string city { get; set; }
		public string state { get; set; }
		public string zip_code { get; set; }
		public string county { get; set; }
		public string feature_matching_geography_type { get; set; }
		public string latitude { get; set; }
		public string longitude { get; set; }
		public string naaccr_gis_coordinate_quality_code { get; set; }
		public string naaccr_gis_coordinate_quality_type { get; set; }
		public string naaccr_census_tract_certainty_code { get; set; }
		public string naaccr_census_tract_certainty_type { get; set; }
		public string state_county_fips { get; set; }
		public string census_state_fips { get; set; }
		public string census_county_fips { get; set; }
		public string census_tract_fips { get; set; }
		public string urban_status { get; set; }
		public string census_met_div_fips { get; set; }
		public string census_cbsa_fips { get; set; }
		public string census_cbsa_micro { get; set; }
		public string estimated_distance_from_residence { get; set; }
}

public class _7F7317DE738C9AD7FCEF25EFC45B48EF
{
	public _7F7317DE738C9AD7FCEF25EFC45B48EF(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _2F6924AE0E06FCE968631ECF2E8FD06A
{
	public _2F6924AE0E06FCE968631ECF2E8FD06A(){}
public _7F7317DE738C9AD7FCEF25EFC45B48EF date_of_birth{ get;set;}
		public string age { get; set; }
		public string mother_married { get; set; }
		public string If_mother_not_married_has_paternity_acknowledgement_been_signed_in_the_hospital { get; set; }
		public string city_of_birth { get; set; }
		public string state_of_birth { get; set; }
		public string country_of_birth { get; set; }
		public string primary_occupation { get; set; }
		public string occupation_business_industry { get; set; }
		public string ever_in_us_armed_forces { get; set; }
		public string is_of_hispanic_origin { get; set; }
		public string is_of_hispanic_origin_other_specify { get; set; }
		public string education_level { get; set; }
		public string bcdcp_m_industry_code_1 { get; set; }
		public string bcdcp_m_industry_code_2 { get; set; }
		public string bcdcp_m_industry_code_3 { get; set; }
		public string bcdcp_m_occupation_code_1 { get; set; }
		public string bcdcp_m_occupation_code_2 { get; set; }
		public string bcdcp_m_occupation_code_3 { get; set; }
}

public class _92AF48F0C3E500B292CF57F4A5A0FFC7
{
	public _92AF48F0C3E500B292CF57F4A5A0FFC7(){}
		public string first_name { get; set; }
		public string middle_name { get; set; }
		public string last_name { get; set; }
		public string maiden_name { get; set; }
		public string medical_record_number { get; set; }
}

public class _D06302063800C30E582D8D21EB802481
{
	public _D06302063800C30E582D8D21EB802481(){}
		public List<string> race_of_father { get; set; }
		public string other_race { get; set; }
		public string other_asian { get; set; }
		public string other_pacific_islander { get; set; }
		public string principle_tribe { get; set; }
		public string omb_race_recode { get; set; }
}

public class _69209A9AA276ABCD41A7FAD0F3E7F1F4
{
	public _69209A9AA276ABCD41A7FAD0F3E7F1F4(){}
		public string month { get; set; }
		public string year { get; set; }
}

public class _C8EB8776C7C93B639B2CC9A7E8F29017
{
	public _C8EB8776C7C93B639B2CC9A7E8F29017(){}
public _69209A9AA276ABCD41A7FAD0F3E7F1F4 date_of_birth{ get;set;}
		public string age { get; set; }
		public string education_level { get; set; }
		public string city_of_birth { get; set; }
		public string state_of_birth { get; set; }
		public string father_country_of_birth { get; set; }
		public string primary_occupation { get; set; }
		public string occupation_business_industry { get; set; }
		public string is_father_of_hispanic_origin { get; set; }
		public string is_father_of_hispanic_origin_other_specify { get; set; }
public _D06302063800C30E582D8D21EB802481 race{ get;set;}
		public string bcdcp_f_industry_code_1 { get; set; }
		public string bcdcp_f_industry_code_2 { get; set; }
		public string bcdcp_f_industry_code_3 { get; set; }
		public string bcdcp_f_occupation_code_1 { get; set; }
		public string bcdcp_f_occupation_code_2 { get; set; }
		public string bcdcp_f_occupation_code_3 { get; set; }
}

public class _19AA41C28005BECF3173B505FC11D868
{
	public _19AA41C28005BECF3173B505FC11D868(){}
		public string street { get; set; }
		public string apartment { get; set; }
		public string city { get; set; }
		public string state { get; set; }
		public string zip_code { get; set; }
		public string county { get; set; }
		public string latitude { get; set; }
		public string longitude { get; set; }
		public string feature_matching_geography_type { get; set; }
		public string naaccr_gis_coordinate_quality_code { get; set; }
		public string naaccr_gis_coordinate_quality_type { get; set; }
		public string naaccr_census_tract_certainty_code { get; set; }
		public string naaccr_census_tract_certainty_type { get; set; }
		public string urban_status { get; set; }
		public string state_county_fips { get; set; }
		public string census_state_fips { get; set; }
		public string census_county_fips { get; set; }
		public string census_tract_fips { get; set; }
		public string census_met_div_fips { get; set; }
		public string census_cbsa_fips { get; set; }
		public string census_cbsa_micro { get; set; }
}

public class _074CF5662C2CC629E97364D0748249E3
{
	public _074CF5662C2CC629E97364D0748249E3(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _A307CA5839D318B971B8B5A4CD130A43
{
	public _A307CA5839D318B971B8B5A4CD130A43(){}
public _074CF5662C2CC629E97364D0748249E3 date_of_delivery{ get;set;}
		public string type_of_place { get; set; }
		public string was_home_delivery_planned { get; set; }
		public string maternal_level_of_care { get; set; }
		public string other_maternal_level_of_care { get; set; }
		public string facility_npi_number { get; set; }
		public string facility_name { get; set; }
		public string attendant_type { get; set; }
		public string other_attendant_type { get; set; }
		public string attendant_npi { get; set; }
		public string was_mother_transferred { get; set; }
		public string transferred_from_where { get; set; }
}

public class _1757340A93C7CC802C810229D906E417
{

	public _1757340A93C7CC802C810229D906E417(){}
public _A307CA5839D318B971B8B5A4CD130A43 facility_of_delivery_demographics{ get;set;}
public _19AA41C28005BECF3173B505FC11D868 facility_of_delivery_location{ get;set;}
public _C8EB8776C7C93B639B2CC9A7E8F29017 demographic_of_father{ get;set;}
public _92AF48F0C3E500B292CF57F4A5A0FFC7 record_identification{ get;set;}
public _2F6924AE0E06FCE968631ECF2E8FD06A demographic_of_mother{ get;set;}
public _6F8603F4EEF2CB125B9224B073EBAF80 location_of_residence{ get;set;}
public _A6F09668892BE9993511ADC113345A8B race{ get;set;}
public _5572D24F3E250810200ACE846413E414 pregnancy_history{ get;set;}
public _9695E0E82516F4F139F21CEF9F275B1B maternal_biometrics{ get;set;}
public _F99ABFF90FBA0ED894B160D3B34256AD prenatal_care{ get;set;}
public _138CDA950E0762377AF4F350FAC6446E cigarette_smoking{ get;set;}
public _729048DC80F0E6748B09405ACE96B47A risk_factors{ get;set;}
		public List<string> infections_present_or_treated_during_pregnancy { get; set; }
		public string specify_other_infection { get; set; }
		public List<string> onset_of_labor { get; set; }
		public List<string> obstetric_procedures { get; set; }
		public List<string> characteristics_of_labor_and_delivery { get; set; }
		public List<string> maternal_morbidity { get; set; }
		public string length_between_child_birth_and_death_of_mother { get; set; }
		public string reviewer_note { get; set; }
}

public class _F01C82803721A4C8A0DB077B9E1138E4
{
	public _F01C82803721A4C8A0DB077B9E1138E4(){}
		public string vital_summary_text { get; set; }
		public string cod1a { get; set; }
		public string interval1a { get; set; }
		public string cod1b { get; set; }
		public string interval1b { get; set; }
		public string cod1c { get; set; }
		public string interval1c { get; set; }
		public string cod1d { get; set; }
		public string interfval1d { get; set; }
		public string othercondition { get; set; }
		public string man_uc { get; set; }
		public string acme_uc { get; set; }
		public string eac { get; set; }
		public string rac { get; set; }
}

public class _194FE6F9039297ED012FE605A81755D2
{
	public _194FE6F9039297ED012FE605A81755D2(){}
		public string cause_type { get; set; }
		public string cause_descriptive { get; set; }
		public string icd_code { get; set; }
		public string interval { get; set; }
		public string interval_unit { get; set; }
}

public class _F8873E911BE747DC2E249ACC7FC0ECC9
{
	public _F8873E911BE747DC2E249ACC7FC0ECC9(){}
		public string place_of_death { get; set; }
		public string street { get; set; }
		public string apartment { get; set; }
		public string city { get; set; }
		public string state { get; set; }
		public string zip_code { get; set; }
		public string county { get; set; }
		public string feature_matching_geography_type { get; set; }
		public string latitude { get; set; }
		public string longitude { get; set; }
		public string naaccr_gis_coordinate_quality_code { get; set; }
		public string naaccr_gis_coordinate_quality_type { get; set; }
		public string naaccr_census_tract_certainty_code { get; set; }
		public string naaccr_census_tract_certainty_type { get; set; }
		public string state_county_fips { get; set; }
		public string census_state_fips { get; set; }
		public string census_county_fips { get; set; }
		public string census_tract_fips { get; set; }
		public string urban_status { get; set; }
		public string census_met_div_fips { get; set; }
		public string census_cbsa_fips { get; set; }
		public string census_cbsa_micro { get; set; }
		public string estimated_death_distance_from_residence { get; set; }
}

public class _079B7F4BEB356992B2DD1A9449392DE8
{
	public _079B7F4BEB356992B2DD1A9449392DE8(){}
		public string death_occured_in_hospital { get; set; }
		public string death_outside_of_hospital { get; set; }
		public string other_death_outside_of_hospital { get; set; }
		public string manner_of_death { get; set; }
		public string was_autopsy_performed { get; set; }
		public string was_autopsy_used_for_death_coding { get; set; }
		public string pregnancy_status { get; set; }
		public string did_tobacco_contribute_to_death { get; set; }
}

public class _C4B6CBD761F83E9017FA96D0C02BB6BE
{
	public _C4B6CBD761F83E9017FA96D0C02BB6BE(){}
		public string street { get; set; }
		public string apartment { get; set; }
		public string city { get; set; }
		public string state { get; set; }
		public string zip_code { get; set; }
		public string county { get; set; }
		public string feature_matching_geography_type { get; set; }
		public string latitude { get; set; }
		public string longitude { get; set; }
		public string naaccr_gis_coordinate_quality_code { get; set; }
		public string naaccr_gis_coordinate_quality_type { get; set; }
		public string naaccr_census_tract_certainty_code { get; set; }
		public string naaccr_census_tract_certainty_type { get; set; }
		public string state_county_fips { get; set; }
		public string census_state_fips { get; set; }
		public string census_county_fips { get; set; }
		public string census_tract_fips { get; set; }
		public string urban_status { get; set; }
		public string census_met_div_fips { get; set; }
		public string census_cbsa_fips { get; set; }
		public string census_cbsa_micro { get; set; }
}

public class _B29F65CCE15C783D65EDB21A820303C6
{
	public _B29F65CCE15C783D65EDB21A820303C6(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _E238EE0EC013BC544EA03FABE426DF45
{
	public _E238EE0EC013BC544EA03FABE426DF45(){}
public _B29F65CCE15C783D65EDB21A820303C6 date_of_injury{ get;set;}
		public string time_of_injury { get; set; }
		public string place_of_injury { get; set; }
		public string was_injury_at_work { get; set; }
		public string transportation_related_injury { get; set; }
		public string transport_related_other_specify { get; set; }
		public string were_seat_belts_in_use { get; set; }
}

public class _4DFB05F38E9F2A6773B8FFF545D24AA2
{
	public _4DFB05F38E9F2A6773B8FFF545D24AA2(){}
		public List<string> race { get; set; }
		public string other_race { get; set; }
		public string other_asian { get; set; }
		public string other_pacific_islander { get; set; }
		public string principle_tribe { get; set; }
		public string omb_race_recode { get; set; }
}

public class _F9220E33675619A7A5453C904567BE59
{
	public _F9220E33675619A7A5453C904567BE59(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _72A993E1B915072396CD06F798020CEF
{
	public _72A993E1B915072396CD06F798020CEF(){}
public _F9220E33675619A7A5453C904567BE59 date_of_birth{ get;set;}
		public string age { get; set; }
		public string age_on_death_certificate { get; set; }
		public string marital_status { get; set; }
		public string city_of_birth { get; set; }
		public string state_of_birth { get; set; }
		public string country_of_birth { get; set; }
		public string primary_occupation { get; set; }
		public string occupation_business_industry { get; set; }
		public string ever_in_us_armed_forces { get; set; }
		public string is_of_hispanic_origin { get; set; }
		public string is_of_hispanic_origin_other_specify { get; set; }
		public string education_level { get; set; }
		public string dc_m_industry_code_1 { get; set; }
		public string dc_m_industry_code_2 { get; set; }
		public string dc_m_industry_code_3 { get; set; }
		public string dc_m_occupation_code_1 { get; set; }
		public string dc_m_occupation_code_2 { get; set; }
		public string dc_m_occupation_code_3 { get; set; }
}

public class _4D33674516ACCD60111807435908AEDC
{
	public _4D33674516ACCD60111807435908AEDC(){}
		public string street { get; set; }
		public string apartment { get; set; }
		public string city { get; set; }
		public string state { get; set; }
		public string country_of_last_residence { get; set; }
		public string zip_code { get; set; }
		public string county { get; set; }
		public string feature_matching_geography_type { get; set; }
		public string latitude { get; set; }
		public string longitude { get; set; }
		public string naaccr_gis_coordinate_quality_code { get; set; }
		public string naaccr_gis_coordinate_quality_type { get; set; }
		public string naaccr_census_tract_certainty_code { get; set; }
		public string naaccr_census_tract_certainty_type { get; set; }
		public string state_county_fips { get; set; }
		public string census_state_fips { get; set; }
		public string census_county_fips { get; set; }
		public string census_tract_fips { get; set; }
		public string urban_status { get; set; }
		public string census_met_div_fips { get; set; }
		public string census_cbsa_fips { get; set; }
		public string census_cbsa_micro { get; set; }
}

public class _E2EB1399F547FAAA8FA9D40A84DF9DDC
{
	public _E2EB1399F547FAAA8FA9D40A84DF9DDC(){}
		public string time_of_death { get; set; }
		public string local_file_number { get; set; }
		public string state_file_number { get; set; }
}

public class _172DA69DB9FF602A0978A04E9D3E470F
{

	public _172DA69DB9FF602A0978A04E9D3E470F(){}
public _E2EB1399F547FAAA8FA9D40A84DF9DDC certificate_identification{ get;set;}
public _4D33674516ACCD60111807435908AEDC place_of_last_residence{ get;set;}
public _72A993E1B915072396CD06F798020CEF demographics{ get;set;}
		public string citizen_of_what_country { get; set; }
public _4DFB05F38E9F2A6773B8FFF545D24AA2 race{ get;set;}
public _E238EE0EC013BC544EA03FABE426DF45 injury_associated_information{ get;set;}
public _C4B6CBD761F83E9017FA96D0C02BB6BE address_of_injury{ get;set;}
public _079B7F4BEB356992B2DD1A9449392DE8 death_information{ get;set;}
public _F8873E911BE747DC2E249ACC7FC0ECC9 address_of_death{ get;set;}
public List<_194FE6F9039297ED012FE605A81755D2> causes_of_death{ get;set;}
		public string reviewer_note { get; set; }
public _F01C82803721A4C8A0DB077B9E1138E4 vitals_import_group{ get;set;}
}

public class _0E4A47EE2AB2DBA5C0DF22ECFE205A61
{
	public _0E4A47EE2AB2DBA5C0DF22ECFE205A61(){}
		public string vital_report { get; set; }
		public string vro_status { get; set; }
		public string import_date { get; set; }
		public string bc_det_match { get; set; }
		public string fdc_det_match { get; set; }
		public string bc_prob_match { get; set; }
		public string fdc_prob_match { get; set; }
		public string icd10_match { get; set; }
		public string pregcb_match { get; set; }
		public string literalcod_match { get; set; }
}

public class _346F75CE75CAB1576391D6018DCD93F4
{
	public _346F75CE75CAB1576391D6018DCD93F4(){}
		public string death_certificate { get; set; }
		public string autopsy_report { get; set; }
		public string birth_certificate_parent_section { get; set; }
		public string birth_certificate_infant_or_fetal_death_section { get; set; }
		public string community_vital_signs { get; set; }
		public string social_and_psychological_profile { get; set; }
		public string prenatal_care_record { get; set; }
		public string er_visits_and_hospitalizations { get; set; }
		public string other_medical_visits { get; set; }
		public string medical_transport { get; set; }
		public string mental_health_profile { get; set; }
		public string informant_interviews { get; set; }
		public string case_narrative { get; set; }
		public string committe_review_worksheet { get; set; }
}

public class _AA4A06C727F9AE4E0C243FC39E60526B
{
	public _AA4A06C727F9AE4E0C243FC39E60526B(){}
		public string abstrator_assigned_status { get; set; }
		public string number_of_days_after_end_of_pregnancey { get; set; }
		public string hr_prg_outcome { get; set; }
		public string hr_prg_outcome_othsp { get; set; }
}

public class _37634834EDCA925A2BFFD92AB1270BA1
{
	public _37634834EDCA925A2BFFD92AB1270BA1(){}
		public string overall_case_status { get; set; }
		public string abstraction_begin_date { get; set; }
		public string abstraction_complete_date { get; set; }
		public string projected_review_date { get; set; }
		public string committee_review_date { get; set; }
		public string case_locked_date { get; set; }
}

public class _DAFBAA00B2FF0706366F6EF7604B7CC5
{
	public _DAFBAA00B2FF0706366F6EF7604B7CC5(){}
		public string month { get; set; }
		public string day { get; set; }
		public string year { get; set; }
}

public class _2F66E2C85C3BE07445A8007E07961BF7
{

	public _2F66E2C85C3BE07445A8007E07961BF7(){}
		public string first_name { get; set; }
		public string middle_name { get; set; }
		public string last_name { get; set; }
public _DAFBAA00B2FF0706366F6EF7604B7CC5 date_of_death{ get;set;}
		public string state_of_death_record { get; set; }
		public string record_id { get; set; }
		public string agency_case_id { get; set; }
		public List<string> how_was_this_death_identified { get; set; }
		public string specify_other_multiple_sources { get; set; }
		public string primary_abstractor { get; set; }
		public string jurisdiction_id { get; set; }
public _37634834EDCA925A2BFFD92AB1270BA1 case_status{ get;set;}
public _AA4A06C727F9AE4E0C243FC39E60526B overall_assessment_of_timing_of_death{ get;set;}
public _346F75CE75CAB1576391D6018DCD93F4 case_progress_report{ get;set;}
public _0E4A47EE2AB2DBA5C0DF22ECFE205A61 automated_vitals_group{ get;set;}
}

public class _31525A784A20079888C887AC49E5D1B9
{
	public _31525A784A20079888C887AC49E5D1B9(){}
		public string version { get; set; }
		public string datetime { get; set; }
		public string is_forced_write { get; set; }
}

public class mmria_case
{
	public mmria_case(){}
		public string version { get; set; }
public List<_31525A784A20079888C887AC49E5D1B9> data_migration_history{ get;set;}
		public string date_created { get; set; }
		public string created_by { get; set; }
		public string date_last_updated { get; set; }
		public string last_updated_by { get; set; }
		public string date_last_checked_out { get; set; }
		public string last_checked_out_by { get; set; }
		public string host_state { get; set; }
		public string addquarter { get; set; }
		public string cmpquarter { get; set; }
public _2F66E2C85C3BE07445A8007E07961BF7 home_record{ get;set;}
public _172DA69DB9FF602A0978A04E9D3E470F death_certificate{ get;set;}
public _1757340A93C7CC802C810229D906E417 birth_fetal_death_certificate_parent{ get;set;}
public List<_580C23C24054AB0BE30540A0BDCD16A0> birth_certificate_infant_fetal_section{ get;set;}
public _72F1A850D966375FA159121C7C8B09A1 cvs{ get;set;}
public _F495787DD96BB2B871443F9596F9C77F social_and_environmental_profile{ get;set;}
public _B01FDEA65CCD8F2AE7E63858F58F93D2 autopsy_report{ get;set;}
public _02DBD2E611DEC822A826C2F0B1D1DE0F prenatal{ get;set;}
public List<_0CE40C4018C47CA22AC1A0003DC34FB7> er_visit_and_hospital_medical_records{ get;set;}
public List<_CAE881A4974F08BB4F9D46B90FEF51D4> other_medical_office_visits{ get;set;}
public List<_9206DAB82DFEDA2BC11D83175919BA02> medical_transport{ get;set;}
public _06AA314F235917500C48AB5E3CD1C034 mental_health_profile{ get;set;}
public List<_18CD53D47CBDE2540A9EF3EC5B51E0BA> informant_interviews{ get;set;}
public _A35F564798944667E91C53B3A3DA359D case_narrative{ get;set;}
public _62AEF5C4D8129ED98ECA69F7779FCBFC committee_review{ get;set;}
}

