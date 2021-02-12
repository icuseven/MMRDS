using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Akka.Actor;

namespace RecordsProcessor_Worker.Actors
{
    public class BatchItemProcessor : ReceiveActor
    {
        static int CurrentCount = 0;
        Dictionary<string, mmria.common.metadata.value_node[]> lookup;
        static Dictionary<string, string> IJE_to_MMRIA_Path = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            #region MOR Mappings
	        { "DState","home_record/state" }, 
            //3 home_record/date_of_death - DOD_YR, DOD_MO, DOD_DY
            { "DOD_YR", "home_record/date_of_death/year"},
            { "DOD_MO", "home_record/date_of_death/month"},
            { "DOD_DY", "home_record/date_of_death/day"},

            //4 death_certificate/date_of_birth - DOB_YR, DOB_MO, DOD_DY
            { "DOB_YR", "death_certificate/demographics/date_of_birth/year"},
            { "DOB_MO", "death_certificate/demographics/date_of_birth/month"},
            { "DOB_DY", "death_certificate/demographics/date_of_birth/day"},
            //5 home_record/last_name - LNAME  
            { "LNAME", "home_record/last_name"}, 
            //6 home_record/first_name - GNAME*/}
            { "GNAME", "home_record/first_name" },

            //Rest of Mor mappings
            //{"DOD_YR","home_record/date_of_death/Year"},
            //{"DSTATE","home_record/state_of_death_record"},
            { "FILENO","death_certificate/certificate_identification/state_file_number"},
            { "AUXNO","death_certificate/certificate_identification/local_file_number"},
            //{"GNAME","home_record/first_name"},
            //{"LNAME","home_record/last_name"},
            { "AGE","death_certificate/demographics/age"},
            //{"DOB_YR","death_certificate/demographics/date_of_birth/year"},
            //{"DOB_MO","death_certificate/demographics/date_of_birth/month"},
            //{"DOB_DY","death_certificate/demographics/date_of_birth/day"},
            { "BPLACE_CNT","death_certificate/demographics/country_of_birth"},
            { "BPLACE_ST","death_certificate/demographics/state_of_birth"},
            { "STATEC","death_certificate/place_of_last_residence/state"},
            { "COUNTRYC","death_certificate/place_of_last_residence/country_of_last_residence"},
            { "MARITAL","death_certificate/demographics/marital_status"},

            { "DPLACE","death_certificate/death_information/death_occured_in_hospital"},
            { "DPLACE_Outside_of_hospital","death_certificate/death_information/death_outside_of_hospital"},

            { "TOD","death_certificate/certificate_identification/time_of_death"},
            { "DEDUC","death_certificate/demographics/education_level"},

            { "DETHNIC_is_of_hispanic_origin","death_certificate/demographics/is_of_hispanic_origin"},
            //{ "DETHNIC1","death_certificate/demographics/is_of_hispanic_origin"},
            //{ "DETHNIC2","death_certificate/demographics/is_of_hispanic_origin"},
            //{ "DETHNIC3","death_certificate/demographics/is_of_hispanic_origin"},
            //{ "DETHNIC4","death_certificate/demographics/is_of_hispanic_origin"},

            //TODO: James I need the new MMRIA fields for these
            { "DETHNIC5","death_certificate/demographics/is_of_hispanic_origin_other_specify"},

            { "RACE","death_certificate/race/race"},

            //{ "RACE1","death_certificate/race/race"},
            //{ "RACE2","death_certificate/race/race"},
            //{ "RACE3","death_certificate/race/race"},
            //{ "RACE4","death_certificate/race/race"},
            //{ "RACE5","death_certificate/race/race"},
            //{ "RACE6","death_certificate/race/race"},
            //{ "RACE7","death_certificate/race/race"},
            //{ "RACE8","death_certificate/race/race"},
            //{ "RACE9","death_certificate/race/race"},
            //{ "RACE10","death_certificate/race/race"},
            //{ "RACE11","death_certificate/race/race"},
            //{ "RACE12","death_certificate/race/race"},
            //{ "RACE13","death_certificate/race/race"},
            //{ "RACE14","death_certificate/race/race"},
            //{ "RACE15","death_certificate/race/race"},

            { "RACE_Principal_Tribe","death_certificate/race/principle_tribe"},

            //{ "RACE16","death_certificate/race/principle_tribe"},
            //{ "RACE17","death_certificate/race/principle_tribe"},

            { "RACE_other_asian","death_certificate/race/other_asian"},

            //{ "RACE18","death_certificate/race/other_asian"},
            //{ "RACE19","death_certificate/race/other_asian"},

            { "RACE_other_pacific_islander","death_certificate/race/other_pacific_islander"},

            //{ "RACE20","death_certificate/race/other_pacific_islander"},
            //{ "RACE21","death_certificate/race/other_pacific_islander"},

            { "RACE_other_race","death_certificate/race/other_race"},

            //{ "RACE22","death_certificate/race/other_race"},
            //{ "RACE23","death_certificate/race/other_race"},

            { "OCCUP","death_certificate/demographics/primary_occupation"},
            { "INDUST","death_certificate/demographics/occupation_business_industry"},
            { "MANNER","death_certificate/death_information/manner_of_death"},

            { "MAN_UC","death_certificate/vitals_import_group/man_uc"},
            { "ACME_UC","death_certificate/vitals_import_group/acme_uc"},
            { "EAC","death_certificate/vitals_import_group/eac"},
            { "RAC","death_certificate/vitals_import_group/rac"},

            { "AUTOP","death_certificate/death_information/was_autopsy_performed"},
            { "AUTOPF","death_certificate/death_information/was_autopsy_used_for_death_coding"},
            { "TOBAC","death_certificate/death_information/did_tobacco_contribute_to_death"},
            { "PREG","death_certificate/death_information/pregnancy_status"},
            { "DOI_MO","death_certificate/injury_associated_information/date_of_injury/month"},
            { "DOI_DY","death_certificate/injury_associated_information/date_of_injury/day"},
            { "DOI_YR","death_certificate/injury_associated_information/date_of_injury/year"},
            { "TOI_HR","death_certificate/injury_associated_information/time_of_injury"},
            { "WORKINJ","death_certificate/injury_associated_information/was_injury_at_work"},

            { "ARMEDF","death_certificate/demographics/ever_in_us_armed_forces"},
            { "DINSTI","death_certificate/address_of_death/place_of_death"},

            { "ADDRESS_OF_DEATH_street","death_certificate/address_of_death/street"},

            { "CITYTEXT_D","death_certificate/address_of_death/city"},
            { "STATETEXT_D","death_certificate/address_of_death/state"},
            { "ZIP9_D","death_certificate/address_of_death/zip_code"},
            { "COUNTYTEXT_D","death_certificate/address_of_death/county"},

            { "PLACE_OF_LAST_RESIDENCE_street","death_certificate/place_of_last_residence/street"},

            { "UNITNUM_R","death_certificate/place_of_last_residence/apartment"},
            { "CITYTEXT_R","death_certificate/place_of_last_residence/city"},
            { "ZIP9_R","death_certificate/place_of_last_residence/zip_code"},
            { "COUNTYTEXT_R","death_certificate/place_of_last_residence/county"},
            { "DMIDDLE","home_record/middle_name"},
            { "POILITRL","death_certificate/injury_associated_information/place_of_injury"},

            { "TRANSPRT","death_certificate/injury_associated_information/transportation_related_injury"},
            { "TRANSPRT_other_specify","death_certificate/injury_associated_information/transport_related_other_specify"},

            { "COUNTYTEXT_I","death_certificate/address_of_injury/county"},
            { "CITYTEXT_I","death_certificate/address_of_injury/city"},

            { "COD1A","death_certificate/vitals_import_group/cod1a"},
            { "INTERVAL1A","death_certificate/vitals_import_group/interval1a"},
            { "COD1B","death_certificate/vitals_import_group/cod1b"},
            { "INTERVAL1B","death_certificate/vitals_import_group/interval1b"},
            { "COD1C","death_certificate/vitals_import_group/cod1c"},
            { "INTERVAL1C","death_certificate/vitals_import_group/interval1c"},
            { "COD1D","death_certificate/vitals_import_group/cod1d"},
            { "INTERVAL1D","death_certificate/vitals_import_group/interfval1d"},
            { "OTHERCONDITION","death_certificate/vitals_import_group/othercondition"},

            { "DBPLACECITY","death_certificate/demographics/city_of_birth"},
            { "STINJURY","death_certificate/address_of_injury/state"},

            { "VRO_STATUS","home_record/automated_vitals_group/vro_status"},
            { "BC_DET_MATCH","home_record/automated_vitals_group/bc_det_match"},
            { "FDC_DET_MATCH","home_record/automated_vitals_group/fdc_det_match"},
            { "BC_PROB_MATCH","home_record/automated_vitals_group/bc_prob_match"},
            { "FDC_PROB_MATCH","home_record/automated_vitals_group/fdc_prob_match"},
            { "ICD10_MATCH","home_record/automated_vitals_group/icd10_match"},
            { "PREGCB_MATCH","home_record/automated_vitals_group/pregcb_match"},
            { "LITERALCOD_MATCH","home_record/automated_vitals_group/literalcod_match"},
        #endregion
        };

        //NAT and FET have different record fields
        static Dictionary<string, string> Parent_NAT_IJE_to_MMRIA_Path = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            {"IDOB_YR","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/year"},
            {"IDOB_MO","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/month"},
            {"IDOB_DY","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/day"},
            {"FNPI","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_npi_number"},
            {"MDOB_YR","birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/year"},
            {"MDOB_MO","birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/month"},
            {"MDOB_DY","birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/day"},
            {"FDOB_YR","birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/year"},
            {"FDOB_MO","birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/month"},
            {"MARN","birth_fetal_death_certificate_parent/demographic_of_mother/mother_married"},
            {"ACKN","birth_fetal_death_certificate_parent/demographic_of_mother/If_mother_not_married_has_paternity_acknowledgement_been_signed_in_the_hospital"},
            {"MEDUC","birth_fetal_death_certificate_parent/demographic_of_mother/education_level"},
            {"FEDUC","birth_fetal_death_certificate_parent/demographic_of_father/education_level"},
            {"ATTEND","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/attendant_type"},
            {"TRAN","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/was_mother_transferred"},
            {"NPREV","birth_fetal_death_certificate_parent/prenatal_care/number_of_visits"},
            {"HFT","birth_fetal_death_certificate_parent/maternal_biometrics/height_feet"},
            {"HIN","birth_fetal_death_certificate_parent/maternal_biometrics/height_inches"},
            {"PWGT","birth_fetal_death_certificate_parent/maternal_biometrics/pre_pregnancy_weight"},
            {"DWGT","birth_fetal_death_certificate_parent/maternal_biometrics/weight_at_delivery"},
            {"WIC","birth_fetal_death_certificate_parent/prenatal_care/was_wic_used"},
            {"PLBL","birth_fetal_death_certificate_parent/pregnancy_history/now_living"},
            {"PLBD","birth_fetal_death_certificate_parent/pregnancy_history/now_dead"},
            {"POPO","birth_fetal_death_certificate_parent/pregnancy_history/other_outcomes"},
            {"MLLB","birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/month"},
            {"YLLB","birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/year"},
            {"MOPO","birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/month"},
            {"YOPO","birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/year"},
            {"PAY","birth_fetal_death_certificate_parent/prenatal_care/principal_source_of_payment_for_this_delivery "},
            {"DLMP_YR","birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/year"},
            {"DLMP_MO","birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/month"},
            {"DLMP_DY","birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/day"},
            {"NPCES","birth_fetal_death_certificate_parent/risk_factors/number_of_c_sections"},
            {"OWGEST","birth_fetal_death_certificate_parent/prenatal_care/obsteric_estimate_of_gestation"},
             {"BIRTH_CO","birth_fetal_death_certificate_parent/facility_of_delivery_location/county"},
            {"BRTHCITY","birth_fetal_death_certificate_parent/facility_of_delivery_location/city"},
            {"HOSP","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_name"},
            {"MOMFNAME","birth_fetal_death_certificate_parent/record_identification/first_name"},
            {"MOMMIDDL","birth_fetal_death_certificate_parent/record_identification/middle_name"},
            {"MOMLNAME","birth_fetal_death_certificate_parent/record_identification/last_name"},
            {"MOMMAIDN","birth_fetal_death_certificate_parent/record_identification/maiden_name"},
            {"LOCATION_OF_RESIDENCE_street","birth_fetal_death_certificate_parent/location_of_residence/street"},
            {"UNUM","birth_fetal_death_certificate_parent/location_of_residence/apartment"},
            {"ZIPCODE","birth_fetal_death_certificate_parent/location_of_residence/zip_code"},
            {"COUNTYTXT","birth_fetal_death_certificate_parent/location_of_residence/county"},
            {"CITYTEXT","birth_fetal_death_certificate_parent/location_of_residence/city"},
            {"MOM_OC_T","birth_fetal_death_certificate_parent/demographic_of_mother/primary_occupation"},
            {"DAD_OC_T","birth_fetal_death_certificate_parent/demographic_of_father/primary_occupation"},
            {"MOM_IN_T","birth_fetal_death_certificate_parent/demographic_of_mother/occupation_business_industry"},
            {"DAD_IN_T","birth_fetal_death_certificate_parent/demographic_of_father/occupation_business_industry"},
            {"HOSPFROM","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/transferred_from_where"},
            {"ATTEND_OTH_TXT","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/other_attendant_type"},
            {"ATTEND_NPI","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/attendant_npi"},
            {"MOM_MED_REC_NUM","birth_fetal_death_certificate_parent/record_identification/medical_record_number"},
        };

        static Dictionary<string, string> Parent_FET_IJE_to_MMRIA_Path = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            {"FDOD_YR","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/year"},
            {"FDOD_MO","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/month"},
            {"FDOD_DY","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/day"},
            {"FNPI","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_npi_number"},
            {"MDOB_YR","birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/year"},
            {"MDOB_MO","birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/month"},
            {"MDOB_DY","birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/day"},
            {"FDOB_YR","birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/year"},
            {"FDOB_MO","birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/month"},
            {"MARN","birth_fetal_death_certificate_parent/demographic_of_mother/mother_married"},
            {"MEDUC","birth_fetal_death_certificate_parent/demographic_of_mother/education_level"},
            {"ATTEND","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/attendant_type"},
            {"TRAN","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/was_mother_transferred"},
            {"NPREV","birth_fetal_death_certificate_parent/prenatal_care/number_of_visits"},
            {"HFT","birth_fetal_death_certificate_parent/maternal_biometrics/height_feet"},
            {"HIN","birth_fetal_death_certificate_parent/maternal_biometrics/height_inches"},
            {"PWGT","birth_fetal_death_certificate_parent/maternal_biometrics/pre_pregnancy_weight"},
            {"DWGT","birth_fetal_death_certificate_parent/maternal_biometrics/weight_at_delivery"},
            {"WIC","birth_fetal_death_certificate_parent/prenatal_care/was_wic_used"},
            {"PLBL","birth_fetal_death_certificate_parent/pregnancy_history/now_living"},
            {"PLBD","birth_fetal_death_certificate_parent/pregnancy_history/now_dead"},
            {"POPO","birth_fetal_death_certificate_parent/pregnancy_history/other_outcomes"},
            {"MLLB","birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/month"},
            {"YLLB","birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/year"},
            {"MOPO","birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/month"},
            {"YOPO","birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/year"},
            {"DLMP_YR","birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/year"},
            {"DLMP_MO","birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/month"},
            {"DLMP_DY","birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/day"},
            {"NPCES","birth_fetal_death_certificate_parent/risk_factors/number_of_c_sections"},
            {"OWGEST","birth_fetal_death_certificate_parent/prenatal_care/obsteric_estimate_of_gestation"},
            {"HOSP_D","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_name"},
            {"ADDRESS_D","birth_fetal_death_certificate_parent/facility_of_delivery_location/street"},
            {"ZIPCODE_D","birth_fetal_death_certificate_parent/facility_of_delivery_location/zip_code"},
            {"CNTY_D","birth_fetal_death_certificate_parent/facility_of_delivery_location/County"},
            {"CITY_D","birth_fetal_death_certificate_parent/facility_of_delivery_location/city"},
            {"MOMFNAME","birth_fetal_death_certificate_parent/record_identification/first_name"},
            {"MOMMNAME","birth_fetal_death_certificate_parent/record_identification/middle_name"},
            {"MOMLNAME","birth_fetal_death_certificate_parent/record_identification/last_name"},
            {"MOMMAIDN","birth_fetal_death_certificate_parent/record_identification/maiden_name"},
            {"LOCATION_OF_RESIDENCE_street","birth_fetal_death_certificate_parent/location_of_residence/street"},
            {"APTNUMB","birth_fetal_death_certificate_parent/location_of_residence/apartment"},
            {"ZIPCODE","birth_fetal_death_certificate_parent/location_of_residence/zip_code"},
            {"COUNTYTXT","birth_fetal_death_certificate_parent/location_of_residence/county"},
            {"CITYTXT","birth_fetal_death_certificate_parent/location_of_residence/city"},
            {"MOM_OC_T","birth_fetal_death_certificate_parent/demographic_of_mother/primary_occupation"},
            {"DAD_OC_T","birth_fetal_death_certificate_parent/demographic_of_father/primary_occupation"},
            {"MOM_IN_T","birth_fetal_death_certificate_parent/demographic_of_mother/occupation_business_industry"},
            {"DAD_IN_T","birth_fetal_death_certificate_parent/demographic_of_father/occupation_business_industry"},
            {"FEDUC","birth_fetal_death_certificate_parent/demographic_of_father/education_level"},
            {"HOSPFROM","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/transferred_from_where"},
            {"ATTEND_NPI","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/attendant_npi"},
            {"ATTEND_OTH_TXT","birth_fetal_death_certificate_parent/facility_of_delivery_demographics/other_attendant_type"},
        };

        static Dictionary<string, string> NAT_IJE_to_MMRIA_Path = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            #region NAT Mappings

            {"DATE_OF_DELIVERY","birth_certificate_infant_fetal_section/record_identification/date_of_delivery"},
            {"FILENO","birth_certificate_infant_fetal_section/record_identification/state_file_number"},
            {"AUXNO","birth_certificate_infant_fetal_section/record_identification/local_file_number"},
            {"TB","birth_certificate_infant_fetal_section/record_identification/time_of_delivery"},
            {"METHNIC5","birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin_other_specify	"},
            {"FETHNIC5","birth_fetal_death_certificate_parent/demographic_of_father/is_father_of_hispanic_origin_other_specify"},
            {"ATTF","birth_certificate_infant_fetal_section/method_of_delivery/was_delivery_with_forceps_attempted_but_unsuccessful"},
            {"ATTV","birth_certificate_infant_fetal_section/method_of_delivery/was_delivery_with_vacuum_extration_attempted_but_unsuccessful"},
            {"PRES","birth_certificate_infant_fetal_section/method_of_delivery/fetal_delivery"},
            {"ROUT","birth_certificate_infant_fetal_section/method_of_delivery/final_route_and_method_of_delivery"},
            {"APGAR5","birth_certificate_infant_fetal_section/biometrics_and_demographics/apgar_scores/minute_5"},
            {"APGAR10","birth_certificate_infant_fetal_section/biometrics_and_demographics/apgar_scores/minute_10"},
            {"SORD","birth_certificate_infant_fetal_section/birth_order"},
            {"ITRAN","birth_certificate_infant_fetal_section/biometrics_and_demographics/was_infant_transferred_within_24_hours"},
            {"ILIV","birth_certificate_infant_fetal_section/biometrics_and_demographics/is_infant_living_at_time_of_report"},
            {"BFED","birth_certificate_infant_fetal_section/biometrics_and_demographics/is_infant_being_breastfed_at_discharge"},
            {"HOSPTO","birth_certificate_infant_fetal_section/biometrics_and_demographics/facility_city_state"},
            {"INF_MED_REC_NUM","birth_certificate_infant_fetal_section/record_identification/newborn_medical_record_number"},

            #endregion
        };

        static Dictionary<string, string> FET_IJE_to_MMRIA_Path = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            #region FET Mappings

            {"DATE_OF_DELIVERY","birth_certificate_infant_fetal_section/record_identification/date_of_delivery"},
            {"FILENO","birth_certificate_infant_fetal_section/record_identification/state_file_number"},
            {"AUXNO","birth_certificate_infant_fetal_section/record_identification/local_file_number"},
            {"TD","birth_certificate_infant_fetal_section/record_identification/time_of_delivery"},
            {"METHNIC5","birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin_other_specify"},
            {"ATTF","birth_certificate_infant_fetal_section/method_of_delivery/was_delivery_with_forceps_attempted_but_unsuccessful"},
            {"ATTV","birth_certificate_infant_fetal_section/method_of_delivery/was_delivery_with_vacuum_extration_attempted_but_unsuccessful"},
            {"PRES","birth_certificate_infant_fetal_section/method_of_delivery/fetal_delivery"},
            {"ROUT","birth_certificate_infant_fetal_section/method_of_delivery/final_route_and_method_of_delivery"},
            {"SORD","birth_certificate_infant_fetal_section/birth_order"},
            {"FETHNIC5","birth_fetal_death_certificate_parent/demographic_of_father/is_father_of_hispanic_origin_other_specify"},

	        #endregion
        };

        protected override void PreStart() => Console.WriteLine("Process_Message started");
        protected override void PostStop() => Console.WriteLine("Process_Message stopped");
        private string config_timer_user_name = null;
        private string config_timer_value = null;

        private string config_couchdb_url = null;
        private string db_prefix = "";

        static HashSet<string> ExistingRecordIds = null;

        mmria.common.couchdb.DBConfigurationDetail item_db_info;

        private System.Dynamic.ExpandoObject case_expando_object = null;

        private Dictionary<string, string> StateDisplayToValue;
        public BatchItemProcessor()
        {
            Receive<mmria.common.ije.StartBatchItemMessage>(message =>
            {
                CurrentCount++;
                Console.WriteLine("Message Recieved");
                //Console.WriteLine(JsonConvert.SerializeObject(message));
                Sender.Tell("Message Recieved");
                Process_Message(message);
            });
        }

        private void Process_Message(mmria.common.ije.StartBatchItemMessage message)
        {

            config_timer_user_name = mmria.services.vitalsimport.Program.timer_user_name;
            config_timer_value = mmria.services.vitalsimport.Program.timer_value;

            config_couchdb_url = mmria.services.vitalsimport.Program.couchdb_url;
            db_prefix = "";

            mmria.common.couchdb.ConfigurationSet db_config_set = mmria.services.vitalsimport.Program.DbConfigSet;
            item_db_info = db_config_set.detail_list[message.host_state];


            var mor_field_set = mor_get_header(message.mor);

            //get parent header set fet/nat

            var nat_field_set = nat_get_header(message.nat);

            var fet_field_set = fet_get_header(message.fet);

            /*
                            CDCUniqueID = x["SSN"],
                            ImportDate = ImportDate,
                            ImportFileName = ImportFileName,
                            ReportingState = ReportingState,

                            StateOfDeathRecord = x["DSTATE"],
                            DateOfDeath = $"{x["DOD_YR"]}-{x["DOD_MO"]}-{x["DOD_DY"]}",
                            DateOfBirth = $"{x["DOB_YR"]}-{x["DOB_MO"]}-{x["DOB_DY"]}",
                            LastName = x["LNAME"],
                            FirstName = x["GNAME"]//,


                        var batch = new mmria.common.ije.BatchItem()
                        {
                            id = message.batch_id,
                            Status = mmria.common.ije.Batch.StatusEnum.Init,
                            ImportDate = DateTime.Now
                        };
                        */



            string metadata_url = $"{mmria.services.vitalsimport.Program.couchdb_url}/metadata/version_specification-20.12.01/metadata";
            var metadata_curl = new mmria.server.cURL("GET", null, metadata_url, null, config_timer_user_name, config_timer_value);
            mmria.common.metadata.app metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.app>(metadata_curl.execute());

            lookup = get_look_up(metadata);

            StateDisplayToValue = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            foreach (var kvp in lookup["lookup/state"])
            {
                StateDisplayToValue.Add(kvp.display, kvp.value);
            }

            var is_case_already_present = false;




            var case_view_response = GetCaseView(config_couchdb_url, db_prefix, mor_field_set["LNAME"]);
            string mmria_id = null;

            var gs = new migrate.C_Get_Set_Value(new System.Text.StringBuilder());

            string record_id = null;

            if (case_view_response.total_rows > 0)
            {
                int dod_yr = -1;
                int dod_mo = -1;
                int dod_dy = -1;

                int dob_yr = -1;
                int dob_mo = -1;
                int dob_dy = -1;

                int.TryParse(mor_field_set["DOD_YR"], out dod_yr);
                int.TryParse(mor_field_set["DOD_MO"], out dod_mo);
                int.TryParse(mor_field_set["DOD_DY"], out dod_dy);

                int.TryParse(mor_field_set["DOB_YR"], out dob_yr);
                int.TryParse(mor_field_set["DOB_MO"], out dob_mo);
                int.TryParse(mor_field_set["DOB_DY"], out dob_dy);



                foreach (var kvp in case_view_response.rows)
                {


                    if
                    (
                        kvp.value.host_state.Equals(message.host_state, StringComparison.OrdinalIgnoreCase) &&
                        kvp.value.last_name.Equals(mor_field_set["LNAME"], StringComparison.OrdinalIgnoreCase) &&
                        kvp.value.first_name.Equals(mor_field_set["GNAME"], StringComparison.OrdinalIgnoreCase) &&
                        kvp.value.date_of_death_year == dod_yr &&
                        kvp.value.date_of_death_month == dod_mo

                    )
                    {
                        var case_expando_object = GetCaseById(item_db_info, kvp.id);
                        if (case_expando_object != null)
                        {

                            migrate.C_Get_Set_Value.get_value_result value_result = gs.get_value(case_expando_object, "_id");
                            mmria_id = value_result.result;


                            var DSTATE_result = gs.get_value(case_expando_object, IJE_to_MMRIA_Path["DState"]);
                            var host_state_result = gs.get_value(case_expando_object, "host_state");
                            var DOD_YR_result = gs.get_value(case_expando_object, IJE_to_MMRIA_Path["DOD_YR"]);
                            var DOD_MO_result = gs.get_value(case_expando_object, IJE_to_MMRIA_Path["DOD_MO"]);
                            var DOD_DY_result = gs.get_value(case_expando_object, IJE_to_MMRIA_Path["DOD_DY"]);
                            var DOB_YR_result = gs.get_value(case_expando_object, IJE_to_MMRIA_Path["DOB_YR"]);
                            var DOB_MO_result = gs.get_value(case_expando_object, IJE_to_MMRIA_Path["DOB_MO"]);
                            var DOB_DY_result = gs.get_value(case_expando_object, IJE_to_MMRIA_Path["DOB_DY"]);
                            var LNAME_result = gs.get_value(case_expando_object, IJE_to_MMRIA_Path["LNAME"]);
                            var GNAME_result = gs.get_value(case_expando_object, IJE_to_MMRIA_Path["GNAME"]);

                            if
                            (
                                DOD_YR_result.is_error == false &&
                                host_state_result.is_error == false &&
                                DOD_MO_result.is_error == false &&
                                DOD_DY_result.is_error == false &&
                                DOB_YR_result.is_error == false &&
                                DOB_MO_result.is_error == false &&
                                DOB_DY_result.is_error == false &&
                                LNAME_result.is_error == false &&
                                GNAME_result.is_error == false
                            )
                            {
                                if
                                (
                                    host_state_result.result.Equals(message.host_state, StringComparison.OrdinalIgnoreCase) &&
                                    LNAME_result.result.Equals(mor_field_set["LNAME"], StringComparison.OrdinalIgnoreCase) &&
                                    GNAME_result.result.Equals(mor_field_set["GNAME"], StringComparison.OrdinalIgnoreCase) &&
                                    DOD_YR_result.result!= null &&
                                    DOD_MO_result.result!= null &&
                                    DOD_DY_result.result!= null &&
                                    DOB_YR_result.result!= null &&
                                    DOB_MO_result.result!= null &&
                                    DOB_DY_result.result!= null
                                    

                                )
                                {

                                    int DOD_YR_result_Check = -1;
                                    int DOD_MO_result_Check = -1;
                                    int DOD_DY_result_Check = -1;
                                    int DOB_YR_result_Check = -1;
                                    int DOB_MO_result_Check = -1;
                                    int DOB_DY_result_Check = -1;



                                    if(
                                        int.TryParse(DOD_YR_result.result.ToString(), out DOD_YR_result_Check) &&
                                        int.TryParse(DOD_MO_result.result.ToString(), out DOD_MO_result_Check) &&
                                        int.TryParse(DOD_DY_result.result.ToString(), out DOD_DY_result_Check) &&
                                        int.TryParse(DOB_YR_result.result.ToString(), out DOB_YR_result_Check) &&
                                        int.TryParse(DOB_MO_result.result.ToString(), out DOB_MO_result_Check) &&
                                        int.TryParse(DOB_DY_result.result.ToString(), out DOB_DY_result_Check) &&
                                        DOD_YR_result_Check == dod_yr &&
                                        DOD_MO_result_Check == dod_mo &&
                                        DOD_DY_result_Check == dod_dy &&
                                        DOB_YR_result_Check == dob_yr &&
                                        DOB_MO_result_Check == dob_mo &&
                                        DOB_DY_result_Check == dob_dy 
                                    )
                                    {
                                        var record_id_result = gs.get_value(case_expando_object, "home_record/record_id");
                                        if(!record_id_result.is_error && record_id_result.result!= null)
                                        {
                                            record_id = record_id_result.result.ToString();
                                        }
                                        is_case_already_present = true;
                                        break;
                                    }
                                }
                            }

                        }
                    }
                }

            }


            if (is_case_already_present)
            {
                var result = new mmria.common.ije.BatchItem()
                {
                    Status = mmria.common.ije.BatchItem.StatusEnum.ExistingCaseSkipped,
                    CDCUniqueID = mor_field_set["SSN"],
                    ImportDate = message.ImportDate,
                    ImportFileName = message.ImportFileName,
                    ReportingState = message.host_state,

                    StateOfDeathRecord = mor_field_set["DSTATE"],
                    DateOfDeath = $"{mor_field_set["DOD_YR"]}-{mor_field_set["DOD_MO"]}-{mor_field_set["DOD_DY"]}",
                    DateOfBirth = $"{mor_field_set["DOB_YR"]}-{mor_field_set["DOB_MO"]}-{mor_field_set["DOB_DY"]}",
                    LastName = mor_field_set["LNAME"],
                    FirstName = mor_field_set["GNAME"],
                    mmria_record_id = record_id,
                    mmria_id = mmria_id,
                    StatusDetail = "matching case found in database"
                };

                Sender.Tell(result);
            }
            else
            {
                mmria_id = System.Guid.NewGuid().ToString();

                var current_status = new mmria.common.ije.BatchItem()
                {
                    Status = mmria.common.ije.BatchItem.StatusEnum.InProcess,
                    CDCUniqueID = mor_field_set["SSN"],
                    ImportDate = message.ImportDate,
                    ImportFileName = message.ImportFileName,
                    ReportingState = message.host_state,

                    StateOfDeathRecord = mor_field_set["DSTATE"],
                    DateOfDeath = $"{mor_field_set["DOD_YR"]}-{mor_field_set["DOD_MO"]}-{mor_field_set["DOD_DY"]}",
                    DateOfBirth = $"{mor_field_set["DOB_YR"]}-{mor_field_set["DOB_MO"]}-{mor_field_set["DOB_DY"]}",
                    LastName = mor_field_set["LNAME"],
                    FirstName = mor_field_set["GNAME"],

                    mmria_id = mmria_id,
                    StatusDetail = "Inprocess of creating new case"
                };

                Sender.Tell(current_status);


                var new_case = new System.Dynamic.ExpandoObject();

                mmria.services.vitalsimport.default_case.create(metadata, new_case);

                var current_date_iso_string = System.DateTime.UtcNow.ToString("o");

                #region MOR Assignments
                gs.set_value("_id", mmria_id, new_case);
                gs.set_value("date_created", current_date_iso_string, new_case);
                gs.set_value("created_by", "vitals-import", new_case);
                gs.set_value("date_last_updated", current_date_iso_string, new_case);
                gs.set_value("last_updated_by", "vitals-import", new_case);
                gs.set_value("version", metadata.version, new_case);
                gs.set_value("host_state", message.host_state, new_case);

                var VitalsImportStatusValue = "0";
                gs.set_value("home_record/case_status/overall_case_status", VitalsImportStatusValue, new_case);

                gs.set_value("home_record/automated_vitals_group/vro_status", mor_field_set["VRO_STATUS"], new_case);


                if(ExistingRecordIds == null)
                {
                    ExistingRecordIds = GetExistingRecordIds();
                }

                do
                {
                    record_id = $"{message.host_state.ToUpper()}-{mor_field_set["DOD_YR"]}-{GenerateRandomFourDigits().ToString()}";
                }
                while (ExistingRecordIds.Contains(record_id));
                ExistingRecordIds.Add(record_id);
                
                gs.set_value("home_record/record_id", record_id, new_case);

                //  Vital Report Start
                var hr_cdc_match_det_bc_values = get_metadata_value_node("home_record/automated_vitals_group/bc_det_match", metadata);
                var hr_cdc_match_det_fdc_values = get_metadata_value_node("home_record/automated_vitals_group/fdc_det_match", metadata);
                var hr_cdc_match_prob_bc_values = get_metadata_value_node("home_record/automated_vitals_group/bc_prob_match", metadata);
                var hr_cdc_match_prob_fdc_values = get_metadata_value_node("home_record/automated_vitals_group/fdc_prob_match", metadata);
                var hr_cdc_icd_values = get_metadata_value_node("home_record/automated_vitals_group/icd10_match", metadata);
                var hr_cdc_checkbox_values = get_metadata_value_node("home_record/automated_vitals_group/pregcb_match", metadata);
                var hr_cdc_literalcod_values = get_metadata_value_node("home_record/automated_vitals_group/literalcod_match", metadata);


                var hr_cdc_match_det_bc = hr_cdc_match_det_bc_values.Where(x=> x.value == mor_field_set["BC_DET_MATCH"]).Select(x=> x.display).FirstOrDefault();
                var hr_cdc_match_det_fdc = hr_cdc_match_det_fdc_values.Where(x=> x.value == mor_field_set["FDC_DET_MATCH"]).Select(x=> x.display).FirstOrDefault();
                var hr_cdc_match_prob_bc = hr_cdc_match_prob_bc_values.Where(x=> x.value == mor_field_set["BC_PROB_MATCH"]).Select(x=> x.display).FirstOrDefault();
                var hr_cdc_match_prob_fdc = hr_cdc_match_prob_fdc_values.Where(x=> x.value == mor_field_set["FDC_PROB_MATCH"]).Select(x=> x.display).FirstOrDefault();
                var hr_cdc_icd = hr_cdc_icd_values.Where(x=> x.value == mor_field_set["ICD10_MATCH"]).Select(x=> x.display).FirstOrDefault();
                var hr_cdc_checkbox = hr_cdc_checkbox_values.Where(x=> x.value == mor_field_set["PREGCB_MATCH"]).Select(x=> x.display).FirstOrDefault();
                var hr_cdc_literalcod = hr_cdc_literalcod_values.Where(x=> x.value == mor_field_set["LITERALCOD_MATCH"]).Select(x=> x.display).FirstOrDefault();


                var import_info_builder = new System.Text.StringBuilder();
                
                
                import_info_builder.AppendLine($"Vitals Import Date:  {DateTime.Now.ToString("MM/dd/yyyy")}\n");

                import_info_builder.AppendLine($"1) CDC Deterministic Linkage with Infant Birth Certificate: {hr_cdc_match_det_bc}");
                import_info_builder.AppendLine($"2) CDC Deterministic Linkage with Fetal Death Certificate: {hr_cdc_match_det_fdc}");
                import_info_builder.AppendLine($"3) CDC Probabilistic Linkage with Infant Birth Certificate: {hr_cdc_match_prob_bc}");
                import_info_builder.AppendLine($"4) CDC Probabilistic Linkage with Fetal Death Certificate: {hr_cdc_match_prob_fdc}");
                import_info_builder.AppendLine($"5) CDC Identified ICD-10 Code Indicating Pregnancy on Death Certificate: {hr_cdc_icd}");
                import_info_builder.AppendLine($"6) CDC Identified Pregnancy Checkbox Indicating Pregnancy on Death Certificate: {hr_cdc_checkbox}");
                import_info_builder.AppendLine($"7) CDC Identified Literal Cause of Death that Included Pregnancy Related Term on Death Certificate: {hr_cdc_literalcod}");
                
                gs.set_value("home_record/automated_vitals_group/vital_report", import_info_builder.ToString(), new_case);
                //  Vital Report End

                var DSTATE_result = gs.set_value(IJE_to_MMRIA_Path["DState"], mor_field_set["DState"], new_case);
                var DOD_YR_result = gs.set_value(IJE_to_MMRIA_Path["DOD_YR"], mor_field_set["DOD_YR"], new_case);
                var DOD_MO_result = gs.set_value(IJE_to_MMRIA_Path["DOD_MO"], mor_field_set["DOD_MO"], new_case);
                var DOD_DY_result = gs.set_value(IJE_to_MMRIA_Path["DOD_DY"], mor_field_set["DOD_DY"], new_case);
                var DOB_YR_result = gs.set_value(IJE_to_MMRIA_Path["DOB_YR"], mor_field_set["DOB_YR"], new_case);
                var DOB_MO_result = gs.set_value(IJE_to_MMRIA_Path["DOB_MO"], mor_field_set["DOB_MO"], new_case);
                var DOB_DY_result = gs.set_value(IJE_to_MMRIA_Path["DOB_DY"], mor_field_set["DOB_DY"], new_case);
                var LNAME_result = gs.set_value(IJE_to_MMRIA_Path["LNAME"], mor_field_set["LNAME"], new_case);
                var GNAME_result = gs.set_value(IJE_to_MMRIA_Path["GNAME"], mor_field_set["GNAME"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["FILENO"], mor_field_set["FILENO"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["AUXNO"], mor_field_set["AUXNO"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["AGE"], mor_field_set["AGE"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["BPLACE_CNT"], mor_field_set["BPLACE_CNT"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["BPLACE_ST"], mor_field_set["BPLACE_ST"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["STATEC"], mor_field_set["STATEC"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["COUNTRYC"], mor_field_set["COUNTRYC"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["MARITAL"], mor_field_set["MARITAL"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["DPLACE"], DPLACE_Rule(mor_field_set["DPLACE"]), new_case);
                gs.set_value(IJE_to_MMRIA_Path["DPLACE_Outside_of_hospital"], DPLACE_Outside_of_hospital_Rule(mor_field_set["DPLACE"]), new_case);

                gs.set_value(IJE_to_MMRIA_Path["TOD"], mor_field_set["TOD"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["DEDUC"], mor_field_set["DEDUC"], new_case);



                gs.set_value(IJE_to_MMRIA_Path["DETHNIC_is_of_hispanic_origin"], DETHNIC_Rule(mor_field_set["DETHNIC1"], mor_field_set["DETHNIC2"], mor_field_set["DETHNIC3"], mor_field_set["DETHNIC4"]), new_case);
                //gs.set_value(IJE_to_MMRIA_Path["DETHNIC1"], mor_field_set["DETHNIC1"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["DETHNIC1"], mor_field_set["DETHNIC1"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["DETHNIC2"], mor_field_set["DETHNIC2"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["DETHNIC3"], mor_field_set["DETHNIC3"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["DETHNIC4"], mor_field_set["DETHNIC4"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["DETHNIC5"], mor_field_set["DETHNIC5"], new_case);

                gs.set_multi_value(IJE_to_MMRIA_Path["RACE"],
                    RACE_Rule(mor_field_set["RACE1"], mor_field_set["RACE2"], mor_field_set["RACE3"],
                                mor_field_set["RACE4"], mor_field_set["RACE5"],
                                mor_field_set["RACE6"], mor_field_set["RACE7"], mor_field_set["RACE8"],
                                mor_field_set["RACE9"], mor_field_set["RACE10"], mor_field_set["RACE11"],
                                mor_field_set["RACE12"], mor_field_set["RACE13"], mor_field_set["RACE14"], mor_field_set["RACE15"]), new_case);

                //gs.set_value(IJE_to_MMRIA_Path["RACE1"], mor_field_set["RACE1"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE2"], mor_field_set["RACE2"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE3"], mor_field_set["RACE3"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE4"], mor_field_set["RACE4"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE5"], mor_field_set["RACE5"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE6"], mor_field_set["RACE6"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE7"], mor_field_set["RACE7"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE8"], mor_field_set["RACE8"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE9"], mor_field_set["RACE9"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE10"], mor_field_set["RACE10"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE11"], mor_field_set["RACE11"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE12"], mor_field_set["RACE12"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE13"], mor_field_set["RACE13"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE14"], mor_field_set["RACE14"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE15"], mor_field_set["RACE15"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["RACE_Principal_Tribe"], RACE_Principal_Tribe_Rule(mor_field_set["RACE16"], mor_field_set["RACE17"]), new_case);

                //gs.set_value(IJE_to_MMRIA_Path["RACE16"], mor_field_set["RACE16"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE17"], mor_field_set["RACE17"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["RACE_other_asian"], RACE_other_asian_Rule(mor_field_set["RACE18"], mor_field_set["RACE19"]), new_case);

                //gs.set_value(IJE_to_MMRIA_Path["RACE18"], mor_field_set["RACE18"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE19"], mor_field_set["RACE19"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["RACE_other_pacific_islander"], RACE_other_pacific_islander_Rule(mor_field_set["RACE20"], mor_field_set["RACE21"]), new_case);

                //gs.set_value(IJE_to_MMRIA_Path["RACE20"], mor_field_set["RACE20"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE21"], mor_field_set["RACE21"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["RACE_other_race"], RACE_other_race_Rule(mor_field_set["RACE22"], mor_field_set["RACE23"]), new_case);

                //gs.set_value(IJE_to_MMRIA_Path["RACE22"], mor_field_set["RACE22"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["RACE23"], mor_field_set["RACE23"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["OCCUP"], mor_field_set["OCCUP"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["INDUST"], mor_field_set["INDUST"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["MANNER"], mor_field_set["MANNER"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["MAN_UC"], mor_field_set["MAN_UC"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["ACME_UC"], mor_field_set["ACME_UC"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["EAC"], mor_field_set["EAC"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RAC"], mor_field_set["RAC"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["AUTOP"], mor_field_set["AUTOP"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["AUTOPF"], mor_field_set["AUTOPF"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["TOBAC"], mor_field_set["TOBAC"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["PREG"], mor_field_set["PREG"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["DOI_MO"], mor_field_set["DOI_MO"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["DOI_DY"], mor_field_set["DOI_DY"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["DOI_YR"], mor_field_set["DOI_YR"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["TOI_HR"], mor_field_set["TOI_HR"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["WORKINJ"], mor_field_set["WORKINJ"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["ARMEDF"], mor_field_set["ARMEDF"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["DINSTI"], mor_field_set["DINSTI"], new_case);


                gs.set_value(IJE_to_MMRIA_Path["ADDRESS_OF_DEATH_street"], ADDRESS_OF_DEATH_street_Rule(mor_field_set["STNUM_D"]
                                                                                                    , mor_field_set["PREDIR_D"]
                                                                                                    , mor_field_set["STNAME_D"]
                                                                                                    , mor_field_set["STDESIG_D"]
                                                                                                    , mor_field_set["POSTDIR_D"]), new_case);

                //gs.set_value(IJE_to_MMRIA_Path["STNUM_D"], mor_field_set["STNUM_D"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["PREDIR_D"], mor_field_set["PREDIR_D"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["STNAME_D"], mor_field_set["STNAME_D"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["STDESIG_D"], mor_field_set["STDESIG_D"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["POSTDIR_D"], mor_field_set["POSTDIR_D"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["CITYTEXT_D"], mor_field_set["CITYTEXT_D"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["STATETEXT_D"], STATETEXT_D_Rule(mor_field_set["STATETEXT_D"]), new_case);
                gs.set_value(IJE_to_MMRIA_Path["ZIP9_D"], mor_field_set["ZIP9_D"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["COUNTYTEXT_D"], mor_field_set["COUNTYTEXT_D"], new_case);

                Set_address_of_death_Gecocode(gs, get_geocode_info(ADDRESS_OF_DEATH_street_Rule(mor_field_set["STNUM_D"]
                                                                                                    , mor_field_set["PREDIR_D"]
                                                                                                    , mor_field_set["STNAME_D"]
                                                                                                    , mor_field_set["STDESIG_D"]
                                                                                                    , mor_field_set["POSTDIR_D"])
                                                                                                    , mor_field_set["CITYTEXT_D"]
                                                                                                    , STATETEXT_D_Rule(mor_field_set["STATETEXT_D"])
                                                                                                    , mor_field_set["ZIP9_D"]), new_case);

                gs.set_value(IJE_to_MMRIA_Path["PLACE_OF_LAST_RESIDENCE_street"], PLACE_OF_LAST_RESIDENCE_street_Rule(mor_field_set["STNUM_R"]
                                                                                    , mor_field_set["PREDIR_R"]
                                                                                    , mor_field_set["STNAME_R"]
                                                                                    , mor_field_set["STDESIG_R"]
                                                                                    , mor_field_set["POSTDIR_R"]), new_case);

                //var geocode = get_geocode_info(PLACE_OF_LAST_RESIDENCE_street_Rule(mor_field_set["STNUM_R"]
                //                                                                    , mor_field_set["PREDIR_R"]
                //                                                                    , mor_field_set["STNAME_R"]
                //                                                                    , mor_field_set["STDESIG_R"]
                //                                                                    , mor_field_set["POSTDIR_R"])
                //    , mor_field_set["CITYTEXT_R"]
                //    , mor_field_set["ZIP9_R"]
                //    , mor_field_set["COUNTYTEXT_R"]);

                //gs.set_value(IJE_to_MMRIA_Path["STNUM_R"], mor_field_set["STNUM_R"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["PREDIR_R"], mor_field_set["PREDIR_R"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["STNAME_R"], mor_field_set["STNAME_R"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["STDESIG_R"], mor_field_set["STDESIG_R"], new_case);
                //gs.set_value(IJE_to_MMRIA_Path["POSTDIR_R"], mor_field_set["POSTDIR_R"], new_case);






                gs.set_value(IJE_to_MMRIA_Path["UNITNUM_R"], mor_field_set["UNITNUM_R"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["CITYTEXT_R"], mor_field_set["CITYTEXT_R"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["ZIP9_R"], mor_field_set["ZIP9_R"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["COUNTYTEXT_R"], mor_field_set["COUNTYTEXT_R"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["DMIDDLE"], mor_field_set["DMIDDLE"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["POILITRL"], mor_field_set["POILITRL"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["TRANSPRT"], TRANSPRT_Rule(mor_field_set["TRANSPRT"]), new_case);
                gs.set_value(IJE_to_MMRIA_Path["TRANSPRT_other_specify"], TRANSPRT_other_specify_Rule(mor_field_set["TRANSPRT"]), new_case);


                gs.set_value(IJE_to_MMRIA_Path["COUNTYTEXT_I"], mor_field_set["COUNTYTEXT_I"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["CITYTEXT_I"], mor_field_set["CITYTEXT_I"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["COD1A"], mor_field_set["COD1A"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["INTERVAL1A"], mor_field_set["INTERVAL1A"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["COD1B"], mor_field_set["COD1B"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["INTERVAL1B"], mor_field_set["INTERVAL1B"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["COD1C"], mor_field_set["COD1C"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["INTERVAL1C"], mor_field_set["INTERVAL1C"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["COD1D"], mor_field_set["COD1D"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["INTERVAL1D"], mor_field_set["INTERVAL1D"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["OTHERCONDITION"], mor_field_set["OTHERCONDITION"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["DBPLACECITY"], mor_field_set["DBPLACECITY"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["STINJURY"], STINJURY_Rule(mor_field_set["STINJURY"]), new_case);
                gs.set_value(IJE_to_MMRIA_Path["VRO_STATUS"], mor_field_set["VRO_STATUS"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["BC_DET_MATCH"], mor_field_set["BC_DET_MATCH"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["FDC_DET_MATCH"], mor_field_set["FDC_DET_MATCH"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["BC_PROB_MATCH"], mor_field_set["BC_PROB_MATCH"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["FDC_PROB_MATCH"], mor_field_set["FDC_PROB_MATCH"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["ICD10_MATCH"], mor_field_set["ICD10_MATCH"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["PREGCB_MATCH"], mor_field_set["PREGCB_MATCH"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["LITERALCOD_MATCH"], mor_field_set["LITERALCOD_MATCH"], new_case);

                #endregion

                #region ParentForm Section

                if (nat_field_set != null && nat_field_set.Count > 0)
                {
                    var field_set = nat_field_set.First();

                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["IDOB_YR"], field_set["IDOB_YR"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["IDOB_MO"], field_set["IDOB_MO"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["IDOB_DY"], field_set["IDOB_DY"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MDOB_YR"], field_set["MDOB_YR"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MDOB_MO"], field_set["MDOB_MO"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MDOB_DY"], field_set["MDOB_DY"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["FDOB_YR"], field_set["FDOB_YR"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["FDOB_MO"], field_set["FDOB_MO"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MARN"], field_set["MARN"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["ACKN"], field_set["ACKN"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MEDUC"], field_set["MEDUC"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["FEDUC"], field_set["FEDUC"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["ATTEND"], field_set["ATTEND"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["TRAN"], field_set["TRAN"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["NPREV"], field_set["NPREV"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["HFT"], field_set["HFT"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["HIN"], field_set["HIN"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["PWGT"], field_set["PWGT"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["DWGT"], field_set["DWGT"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["WIC"], field_set["WIC"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["PLBL"], field_set["PLBL"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["PLBD"], field_set["PLBD"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["POPO"], field_set["POPO"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MLLB"], field_set["MLLB"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["YLLB"], field_set["YLLB"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MOPO"], field_set["MOPO"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["YOPO"], field_set["YOPO"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["PAY"], field_set["PAY"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["DLMP_YR"], field_set["DLMP_YR"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["DLMP_MO"], field_set["DLMP_MO"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["DLMP_DY"], field_set["DLMP_DY"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["NPCES"], field_set["NPCES"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["OWGEST"], field_set["OWGEST"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["BIRTH_CO"], field_set["BIRTH_CO"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["BRTHCITY"], field_set["BRTHCITY"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["HOSP"], field_set["HOSP"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MOMFNAME"], field_set["MOMFNAME"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MOMMIDDL"], field_set["MOMMIDDL"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MOMLNAME"], field_set["MOMLNAME"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MOMMAIDN"], field_set["MOMMAIDN"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["UNUM"], field_set["UNUM"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["ZIPCODE"], field_set["ZIPCODE"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["COUNTYTXT"], field_set["COUNTYTXT"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["CITYTEXT"], field_set["CITYTEXT"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MOM_OC_T"], field_set["MOM_OC_T"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["DAD_OC_T"], field_set["DAD_OC_T"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MOM_IN_T"], field_set["MOM_IN_T"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["DAD_IN_T"], field_set["DAD_IN_T"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["HOSPFROM"], field_set["HOSPFROM"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["ATTEND_OTH_TXT"], field_set["ATTEND_OTH_TXT"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["ATTEND_NPI"], field_set["ATTEND_NPI"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["MOM_MED_REC_NUM"], field_set["MOM_MED_REC_NUM"], new_case);
                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["FNPI"], field_set["FNPI"], new_case);

                    gs.set_value(Parent_NAT_IJE_to_MMRIA_Path["LOCATION_OF_RESIDENCE_street"], LOCATION_OF_RESIDENCE_street_Rule(field_set["STNUM"]
                      , field_set["PREDIR"]
                      , field_set["STNAME"]
                      , field_set["STDESIG"]
                      , field_set["POSTDIR"]), new_case);


                }
                else if (fet_field_set != null && fet_field_set.Count > 0)
                {
                    var field_set = fet_field_set.First();

                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["FDOD_YR"], field_set["FDOD_YR"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["FDOD_MO"], field_set["FDOD_MO"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["FDOD_DY"], field_set["FDOD_DY"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["FNPI"], field_set["FNPI"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MDOB_YR"], field_set["MDOB_YR"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MDOB_MO"], field_set["MDOB_MO"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MDOB_DY"], field_set["MDOB_DY"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["FDOB_YR"], field_set["FDOB_YR"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["FDOB_MO"], field_set["FDOB_MO"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MARN"], field_set["MARN"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MEDUC"], field_set["MEDUC"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["ATTEND"], field_set["ATTEND"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["TRAN"], field_set["TRAN"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["NPREV"], field_set["NPREV"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["HFT"], field_set["HFT"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["HIN"], field_set["HIN"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["PWGT"], field_set["PWGT"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["DWGT"], field_set["DWGT"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["WIC"], field_set["WIC"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["PLBL"], field_set["PLBL"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["PLBD"], field_set["PLBD"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["POPO"], field_set["POPO"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MLLB"], field_set["MLLB"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["YLLB"], field_set["YLLB"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MOPO"], field_set["MOPO"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["YOPO"], field_set["YOPO"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["DLMP_YR"], field_set["DLMP_YR"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["DLMP_MO"], field_set["DLMP_MO"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["DLMP_DY"], field_set["DLMP_DY"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["NPCES"], field_set["NPCES"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["OWGEST"], field_set["OWGEST"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["HOSP_D"], field_set["HOSP_D"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["ADDRESS_D"], field_set["ADDRESS_D"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["ZIPCODE_D"], field_set["ZIPCODE_D"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["CNTY_D"], field_set["CNTY_D"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["CITY_D"], field_set["CITY_D"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MOMFNAME"], field_set["MOMFNAME"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MOMMNAME"], field_set["MOMMNAME"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MOMLNAME"], field_set["MOMLNAME"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MOMMAIDN"], field_set["MOMMAIDN"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["APTNUMB"], field_set["APTNUMB"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["ZIPCODE"], field_set["ZIPCODE"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["COUNTYTXT"], field_set["COUNTYTXT"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["CITYTXT"], field_set["CITYTXT"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MOM_OC_T"], field_set["MOM_OC_T"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["DAD_OC_T"], field_set["DAD_OC_T"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["MOM_IN_T"], field_set["MOM_IN_T"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["DAD_IN_T"], field_set["DAD_IN_T"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["FEDUC"], field_set["FEDUC"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["HOSPFROM"], field_set["HOSPFROM"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["ATTEND_NPI"], field_set["ATTEND_NPI"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["ATTEND_OTH_TXT"], field_set["ATTEND_OTH_TXT"], new_case);
                    gs.set_value(Parent_FET_IJE_to_MMRIA_Path["LOCATION_OF_RESIDENCE_street"], FET_LOCATION_OF_RESIDENCE_street_Rule(field_set["STNUM"]
                                                                                                                        , field_set["PREDIR"]
                                                                                                                        , field_set["STNAME"]
                                                                                                                        , field_set["STDESIG"]
                                                                                                                        , field_set["POSTDIR"]), new_case);
                }

                #endregion

                #region NAT Assignments
                for (int nat_index = 0; nat_index < nat_field_set?.Count; nat_index++)
                {
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["DATE_OF_DELIVERY"], new List<(int, dynamic)>() { (nat_index, DATE_OF_DELIVERY_Rule(nat_field_set[nat_index]["IDOB_YR"], nat_field_set[nat_index]["IDOB_MO"], nat_field_set[nat_index]["IDOB_DY"])) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["HOSPTO"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["HOSPTO"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["FILENO"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["FILENO"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["AUXNO"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["AUXNO"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["TB"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["TB"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["METHNIC5"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["METHNIC5"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["FETHNIC5"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["FETHNIC5"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["ATTF"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["ATTF"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["ATTV"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["ATTV"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["PRES"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["PRES"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["ROUT"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["ROUT"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["APGAR5"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["APGAR5"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["APGAR10"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["APGAR10"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["SORD"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["SORD"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["ITRAN"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["ITRAN"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["ILIV"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["ILIV"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["BFED"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["BFED"]) });
                    gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["INF_MED_REC_NUM"], new List<(int, dynamic)>() { (nat_index, nat_field_set[nat_index]["INF_MED_REC_NUM"]) });
                }

                //foreach (var field_set in nat_field_set)
                //{
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["DATE_OF_DELIVERY"], DATE_OF_DELIVERY_Rule(field_set["IDOB_YR"], field_set["IDOB_MO"], field_set["IDOB_DY"]), new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["HOSPTO"], field_set["HOSPTO"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["FILENO"], field_set["FILENO"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["AUXNO"], field_set["AUXNO"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["TB"], field_set["TB"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["METHNIC5"], field_set["METHNIC5"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["FETHNIC5"], field_set["FETHNIC5"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["ATTF"], field_set["ATTF"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["ATTV"], field_set["ATTV"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["PRES"], field_set["PRES"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["ROUT"], field_set["ROUT"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["APGAR5"], field_set["APGAR5"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["APGAR10"], field_set["APGAR10"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["SORD"], field_set["SORD"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["ITRAN"], field_set["ITRAN"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["ILIV"], field_set["ILIV"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["BFED"], field_set["BFED"], new_case);
                //    gs.set_value(NAT_IJE_to_MMRIA_Path["INF_MED_REC_NUM"], field_set["INF_MED_REC_NUM"], new_case);


                //    //// /birth_certificate_natal/name - "John" birth_certificate_nata: [ { name:"John" },  { name:"Jane" },  ]
                //    //// "John" to "Abbot" and "Jane" to "Eddite"
                //    ///*
                //    // * var multivalue_List = new List<(int, dynamic)>();
                //    //multivalue_List.Add((0, "Abbot));
                //    //multivalue_List.Add((0, "Eddie"));
                //    // * 
                //    // * */


                //    ////var form_index_to_value = new List<(int, dynamic)>();
                //    ////form_index_to_value.Add((0, "Abbot));
                //    ////mform_index_to_valueultivalue_List.Add((0, "Eddie"));
                //    ////form_index_to_value.Add((natai_index, "Eddie"));
                //    ////gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["IDOB_YR"], multivalue_List);

                //    ////// [ 9999, 1, 3, 777 ]=> [ 9999, 2, 3, 888 ]

                //    ////var multivalue_List = new List<(int, dynamic)>();
                //    ////multivalue_List.Add((3, 888));
                //    ////multivalue_List.Add((1, 2));
                //    ////gs.set_multiform_value(new_case, NAT_IJE_to_MMRIA_Path["IDOB_YR"], multivalue_List);
                //}
                #endregion

                #region FET Assignments

                for (int fet_index = 0; fet_index < fet_field_set?.Count; fet_index++)
                {
                    gs.set_multiform_value(new_case, FET_IJE_to_MMRIA_Path["DATE_OF_DELIVERY"], new List<(int, dynamic)>() { (fet_index, FET_DATE_OF_DELIVERY_Rule(fet_field_set[fet_index]["IDOB_YR"], fet_field_set[fet_index]["IDOB_MO"], fet_field_set[fet_index]["IDOB_DY"])) });
                    gs.set_multiform_value(new_case, FET_IJE_to_MMRIA_Path["FILENO"], new List<(int, dynamic)>() { (fet_index, fet_field_set[fet_index]["FILENO"]) });
                    gs.set_multiform_value(new_case, FET_IJE_to_MMRIA_Path["AUXNO"], new List<(int, dynamic)>() { (fet_index, fet_field_set[fet_index]["AUXNO"]) });
                    gs.set_multiform_value(new_case, FET_IJE_to_MMRIA_Path["TD"], new List<(int, dynamic)>() { (fet_index, fet_field_set[fet_index]["TD"]) });
                    gs.set_multiform_value(new_case, FET_IJE_to_MMRIA_Path["METHNIC5"], new List<(int, dynamic)>() { (fet_index, fet_field_set[fet_index]["METHNIC5"]) });
                    gs.set_multiform_value(new_case, FET_IJE_to_MMRIA_Path["ATTF"], new List<(int, dynamic)>() { (fet_index, fet_field_set[fet_index]["ATTF"]) });
                    gs.set_multiform_value(new_case, FET_IJE_to_MMRIA_Path["ATTV"], new List<(int, dynamic)>() { (fet_index, fet_field_set[fet_index]["ATTV"]) });
                    gs.set_multiform_value(new_case, FET_IJE_to_MMRIA_Path["PRES"], new List<(int, dynamic)>() { (fet_index, fet_field_set[fet_index]["PRES"]) });
                    gs.set_multiform_value(new_case, FET_IJE_to_MMRIA_Path["ROUT"], new List<(int, dynamic)>() { (fet_index, fet_field_set[fet_index]["ROUT"]) });
                    gs.set_multiform_value(new_case, FET_IJE_to_MMRIA_Path["SORD"], new List<(int, dynamic)>() { (fet_index, fet_field_set[fet_index]["SORD"]) });
                    gs.set_multiform_value(new_case, FET_IJE_to_MMRIA_Path["FETHNIC5"], new List<(int, dynamic)>() { (fet_index, fet_field_set[fet_index]["FETHNIC5"]) });
                }

                //foreach (var field_set in fet_field_set)
                //{
                //    gs.set_value(FET_IJE_to_MMRIA_Path["DATE_OF_DELIVERY"], FET_DATE_OF_DELIVERY_Rule(field_set["IDOB_YR"], field_set["IDOB_MO"], field_set["IDOB_DY"]), new_case);
                //    gs.set_value(FET_IJE_to_MMRIA_Path["FILENO"], field_set["FILENO"], new_case);
                //    gs.set_value(FET_IJE_to_MMRIA_Path["AUXNO"], field_set["AUXNO"], new_case);
                //    gs.set_value(FET_IJE_to_MMRIA_Path["TD"], field_set["TD"], new_case);
                //    gs.set_value(FET_IJE_to_MMRIA_Path["METHNIC5"], field_set["METHNIC5"], new_case);
                //    gs.set_value(FET_IJE_to_MMRIA_Path["ATTF"], field_set["ATTF"], new_case);
                //    gs.set_value(FET_IJE_to_MMRIA_Path["ATTV"], field_set["ATTV"], new_case);
                //    gs.set_value(FET_IJE_to_MMRIA_Path["PRES"], field_set["PRES"], new_case);
                //    gs.set_value(FET_IJE_to_MMRIA_Path["ROUT"], field_set["ROUT"], new_case);
                //    gs.set_value(FET_IJE_to_MMRIA_Path["SORD"], field_set["SORD"], new_case);
                //    gs.set_value(FET_IJE_to_MMRIA_Path["FETHNIC5"], field_set["FETHNIC5"], new_case);
                //}
                #endregion

                var case_dictionary = new_case as IDictionary<string, object>;

                var finished = new mmria.common.ije.BatchItem()
                {
                    Status = mmria.common.ije.BatchItem.StatusEnum.NewCaseAdded,
                    CDCUniqueID = mor_field_set["SSN"],
                    ImportDate = message.ImportDate,
                    ImportFileName = message.ImportFileName,
                    ReportingState = message.host_state,

                    StateOfDeathRecord = mor_field_set["DSTATE"],
                    DateOfDeath = $"{mor_field_set["DOD_YR"]}-{mor_field_set["DOD_MO"]}-{mor_field_set["DOD_DY"]}",
                    DateOfBirth = $"{mor_field_set["DOB_YR"]}-{mor_field_set["DOB_MO"]}-{mor_field_set["DOB_DY"]}",
                    LastName = mor_field_set["LNAME"],
                    FirstName = mor_field_set["GNAME"],
                    
                    mmria_record_id = record_id,
                    mmria_id = mmria_id,
                    StatusDetail = "Added new case"
                };


                var _dbConfigSet = mmria.services.vitalsimport.Program.DbConfigSet;
                var db_info = _dbConfigSet.detail_list[message.host_state];
                string request_string = $"{db_info.url}/{db_info.prefix}mmrds/{mmria_id}";

                Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings();
                settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                var object_string = Newtonsoft.Json.JsonConvert.SerializeObject(new_case, settings);

                var document_curl = new mmria.server.cURL("PUT", null, request_string, object_string, db_info.user_name, db_info.user_value);

                var document_put_response = new mmria.common.model.couchdb.document_put_response();
                try
                {
                    var responseFromServer = document_curl.execute();
                    document_put_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
                }
                catch (Exception ex)
                {
                    finished = new mmria.common.ije.BatchItem()
                    {
                        Status = mmria.common.ije.BatchItem.StatusEnum.ImportFailed,
                        CDCUniqueID = mor_field_set["SSN"],
                        ImportDate = message.ImportDate,
                        ImportFileName = message.ImportFileName,
                        ReportingState = message.host_state,

                        StateOfDeathRecord = mor_field_set["DSTATE"],
                        DateOfDeath = $"{mor_field_set["DOD_YR"]}-{mor_field_set["DOD_MO"]}-{mor_field_set["DOD_DY"]}",
                        DateOfBirth = $"{mor_field_set["DOB_YR"]}-{mor_field_set["DOB_MO"]}-{mor_field_set["DOB_DY"]}",
                        LastName = mor_field_set["LNAME"],
                        FirstName = mor_field_set["GNAME"],
                        mmria_record_id = record_id,
                        mmria_id = mmria_id,
                        StatusDetail = "Error\n" + ex.ToString()
                    };
                }

                Sender.Tell(finished);

                Context.Stop(this.Self);

            }



            //all_list_set = get_metadata_node_by_type(metadata, "list");


            /*
            fail if three records do NOT match file names record in report

            exclude any records that do NOT have - content validation failed

            1.	Date of Death
            2.	SODR
            3.	CDC generated Unique ID

            key fields - only exact matches are excluded

            1 mmria site/host/ reporting state - file-name ? or 2.	SODR
            2 home_record/state of death - DState
            3 home_record/date_of_death - DOD_YR, DOD_MO, DOD_DY
            4 death_certificate/date_of_birth - DOB_YR, DOB_MO, DOD_BY
            5 home_record/last_name - LNAME  
            6 home_record/first_name - GNAME

            */


        }

        private void Set_address_of_death_Gecocode(migrate.C_Get_Set_Value gs, Geocode_Response geocode_data, System.Dynamic.ExpandoObject new_case)
        {
            string urban_status = null;
            string state_county_fips = null;

            var outputGeocode_data = geocode_data?.OutputGeocodes?.FirstOrDefault()?.outputGeocode;
            var censusValues_data = geocode_data?.OutputGeocodes?.FirstOrDefault()?.CensusValues?.FirstOrDefault()?.CensusValue1;

            if (outputGeocode_data != null && outputGeocode_data.FeatureMatchingResultType != null)
            {
                string latitude = outputGeocode_data.Latitude;
                string longitude = outputGeocode_data.Longitude;
                string feature_matching_geography_type = outputGeocode_data.FeatureMatchingGeographyType;
                string naaccr_gis_coordinate_quality_code = outputGeocode_data.NAACCRGISCoordinateQualityCode;
                string naaccr_gis_coordinate_quality_type = outputGeocode_data.NAACCRGISCoordinateQualityType;
                string naaccr_census_tract_certainty_code = censusValues_data.NAACCRCensusTractCertaintyCode;
                string naaccr_census_tract_certainty_type = censusValues_data.NAACCRCensusTractCertaintyType;
                string census_state_fips = censusValues_data.CensusStateFips;
                string census_county_fips = censusValues_data.CensusCountyFips;
                string census_tract_fips = censusValues_data.CensusTract;
                string census_cbsa_fips = censusValues_data.CensusCbsaFips;
                string census_cbsa_micro = censusValues_data.CensusCbsaMicro;
                string census_met_div_fips = censusValues_data.CensusMetDivFips;
                // calculate urban_status

                
                if
                (
                    int.Parse(censusValues_data.NAACCRCensusTractCertaintyCode) > 0 &&
                    int.Parse(censusValues_data.NAACCRCensusTractCertaintyCode) < 7 &&
                    censusValues_data.CensusCbsaFips == ""
                )
                {
                    urban_status = "Rural";
                }
                else if
                (
                    int.Parse(censusValues_data.NAACCRCensusTractCertaintyCode) > 0 &&
                    int.Parse(censusValues_data.NAACCRCensusTractCertaintyCode) < 7 &&
                    int.Parse(censusValues_data.CensusCbsaFips) > 0
                )
                {
                    if (!string.IsNullOrEmpty(censusValues_data.CensusMetDivFips))
                    {
                        urban_status = "Metropolitan Division";
                    }
                    else if (int.Parse(censusValues_data.CensusCbsaMicro) == 0)
                    {
                        urban_status = "Metropolitan";
                    }
                    else if (int.Parse(censusValues_data.CensusCbsaMicro) == 1)
                    {
                        urban_status = "Micropolitan";
                    }
                }
                else
                {
                    urban_status = "Undetermined";
                }

                // calculate state_county_fips
                if (!String.IsNullOrEmpty(censusValues_data.CensusStateFips) && !String.IsNullOrEmpty(censusValues_data.CensusCountyFips))
                {
                    state_county_fips = censusValues_data.CensusStateFips + censusValues_data.CensusCountyFips;
                }

                gs.set_value("death_certificate/place_of_last_residence/latitude", latitude, new_case);
                gs.set_value("death_certificate/place_of_last_residence/longitude", longitude, new_case);
                gs.set_value("death_certificate/place_of_last_residence/feature_matching_geography_type", feature_matching_geography_type, new_case);
                gs.set_value("death_certificate/place_of_last_residence/naaccr_gis_coordinate_quality_code", naaccr_gis_coordinate_quality_code, new_case);
                gs.set_value("death_certificate/place_of_last_residence/naaccr_gis_coordinate_quality_type", naaccr_gis_coordinate_quality_type, new_case);
                gs.set_value("death_certificate/place_of_last_residence/naaccr_census_tract_certainty_code", naaccr_census_tract_certainty_code, new_case);
                gs.set_value("death_certificate/place_of_last_residence/naaccr_census_tract_certainty_type", naaccr_census_tract_certainty_type, new_case);
                gs.set_value("death_certificate/place_of_last_residence/census_state_fips", census_state_fips, new_case);
                gs.set_value("death_certificate/place_of_last_residence/census_county_fips", census_county_fips, new_case);
                gs.set_value("death_certificate/place_of_last_residence/census_tract_fips", census_tract_fips, new_case);
                gs.set_value("death_certificate/place_of_last_residence/census_cbsa_fips", census_cbsa_fips, new_case);
                gs.set_value("death_certificate/place_of_last_residence/census_cbsa_micro", census_cbsa_micro, new_case);
                gs.set_value("death_certificate/place_of_last_residence/census_met_div_fips", census_met_div_fips, new_case);
                gs.set_value("death_certificate/place_of_last_residence/urban_status", urban_status, new_case);
                gs.set_value("death_certificate/place_of_last_residence/state_county_fips", state_county_fips, new_case);
            }
            else
            {
                string feature_matching_geography_type = "Unmatchable";
                string latitude = "";
                string longitude = "";
                string naaccr_gis_coordinate_quality_code = "";
                string naaccr_gis_coordinate_quality_type = "";
                string naaccr_census_tract_certainty_code = "";
                string naaccr_census_tract_certainty_type = "";
                string census_state_fips = "";
                string census_county_fips = "";
                string census_tract_fips = "";
                string census_cbsa_fips = "";
                string census_cbsa_micro = "";
                string census_met_div_fips = "";
                urban_status = "";
                state_county_fips = "";
                gs.set_value("death_certificate/place_of_last_residence/feature_matching_geography_type", feature_matching_geography_type, new_case);
                gs.set_value("death_certificate/place_of_last_residence/latitude", latitude, new_case);
                gs.set_value("death_certificate/place_of_last_residence/longitude", longitude, new_case);
                gs.set_value("death_certificate/place_of_last_residence/naaccr_gis_coordinate_quality_code", naaccr_gis_coordinate_quality_code, new_case);
                gs.set_value("death_certificate/place_of_last_residence/naaccr_gis_coordinate_quality_type", naaccr_gis_coordinate_quality_type, new_case);
                gs.set_value("death_certificate/place_of_last_residence/naaccr_census_tract_certainty_code", naaccr_census_tract_certainty_code, new_case);
                gs.set_value("death_certificate/place_of_last_residence/naaccr_census_tract_certainty_type", naaccr_census_tract_certainty_type, new_case);
                gs.set_value("death_certificate/place_of_last_residence/census_state_fips", census_state_fips, new_case);
                gs.set_value("death_certificate/place_of_last_residence/census_county_fips", census_county_fips, new_case);
                gs.set_value("death_certificate/place_of_last_residence/census_tract_fips", census_tract_fips, new_case);
                gs.set_value("death_certificate/place_of_last_residence/census_cbsa_fips", census_cbsa_fips, new_case);
                gs.set_value("death_certificate/place_of_last_residence/census_cbsa_micro", census_cbsa_micro, new_case);
                gs.set_value("death_certificate/place_of_last_residence/census_met_div_fips", census_met_div_fips, new_case);
                gs.set_value("death_certificate/place_of_last_residence/urban_status", urban_status, new_case);
                gs.set_value("death_certificate/place_of_last_residence/state_county_fips", state_county_fips, new_case);

            }
        }

        private Geocode_Response get_geocode_info(string street, string city, string state, string zip)
        {
            var response = new Geocode_Response();

            if (!string.IsNullOrEmpty(state))
            {
                var check_state = state.Split("-");
                state = check_state[0];
            }

            var geoservices_baseURL = "https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress=";
            var apikey = "7c39ae93786d4aa3adb806cb66de51b8";
            var format = "json&allowTies=false&tieBreakingStrategy=revertToHierarchy&includeHeader=true&census=true&censusYear=2010&notStore=true&version=4.01";

            var requestURL = $"{geoservices_baseURL}{street}&city={city}&state={state}&zip={zip}&apikey={apikey}&format={format}";

            var document_curl = new mmria.server.cURL("GET", null, requestURL, null);

            var curl_response = document_curl.execute();
            var data = Newtonsoft.Json.JsonConvert.DeserializeObject<Geocode_Response>(curl_response);

            if (data != null 
                && data.FeatureMatchingResultType != null
                && data.OutputGeocodes != null
                && data.OutputGeocodes.Count > 0
                && data.OutputGeocodes.FirstOrDefault() != null
                && data.OutputGeocodes.FirstOrDefault().outputGeocode != null
                && data.OutputGeocodes.FirstOrDefault().outputGeocode.FeatureMatchingResultType != null
                && !(data?.FeatureMatchingResultType?.Contains("Unmatchable") == true
                    || data?.FeatureMatchingResultType?.Contains("ExceptionOccurred") == true 
                    || data?.FeatureMatchingResultType?.Contains("0") == true)
                && !(data?.OutputGeocodes?.FirstOrDefault()?.outputGeocode?.FeatureMatchingResultType?.Contains("Unmatchable") == true
                     || data?.OutputGeocodes?.FirstOrDefault()?.outputGeocode?.FeatureMatchingResultType?.Contains("ExceptionOccurred") == true))
                {
                //If the data passes checks and there was a match return it.
                response = data;
            }

            return response;
        }

        struct Result_Struct
        {
            public System.Dynamic.ExpandoObject[] docs;
        }

        struct Selector_Struc
        {
            //public System.Dynamic.ExpandoObject selector;
            public System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>> selector;
            public string[] fields;

            public int limit;
        }

        private async Task<Result_Struct> get_matching_cases_for(string p_selector, string p_find_value)
        {

            Result_Struct result = new Result_Struct();

            try
            {

                var selector_struc = new Selector_Struc();
                selector_struc.selector = new System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>>(StringComparer.OrdinalIgnoreCase);
                selector_struc.limit = 10000;
                selector_struc.selector.Add(p_selector, new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase));
                selector_struc.selector[p_selector].Add("$eq", p_find_value);

                Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings();
                settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                string selector_struc_string = Newtonsoft.Json.JsonConvert.SerializeObject(selector_struc, settings);

                System.Console.WriteLine(selector_struc_string);

                /*
                                string find_url = $"{db_server_url}/{db_name}/_find";

                                var case_curl = new mmria.server.cURL("POST", null, find_url, selector_struc_string, config_timer_user_name, config_timer_value);
                                string responseFromServer = await case_curl.executeAsync();

                                result = Newtonsoft.Json.JsonConvert.DeserializeObject<Result_Struct>(responseFromServer);
                */
                System.Console.WriteLine($"case_response.docs.length {result.docs.Length}");
            }
            catch (Exception ex)
            {

            }

            return result;
        }

        private Dictionary<string, mmria.common.metadata.value_node[]> get_look_up(mmria.common.metadata.app p_metadata)
        {
            var result = new Dictionary<string, mmria.common.metadata.value_node[]>(StringComparer.OrdinalIgnoreCase);

            foreach (var node in p_metadata.lookup)
            {
                result.Add("lookup/" + node.name, node.values);
            }
            return result;
        }


        private  mmria.common.metadata.value_node[] get_metadata_value_node(string search_path, mmria.common.metadata.app p_metadata, string path = "")
        {
            mmria.common.metadata.value_node[] result = null;

            foreach (var node in p_metadata.children)
            {
                result = get_metadata_value_node(search_path, node, node.name);
                if(result != null) break;
            }
            return result;
        }

        private mmria.common.metadata.value_node[] get_metadata_value_node(string search_path, mmria.common.metadata.node p_metadata, string path = "")
        {
            mmria.common.metadata.value_node[] result = null;
            string key = $"{path}/{p_metadata.name}";
            if(search_path.Equals(path, StringComparison.OrdinalIgnoreCase))
            {
                if(! string.IsNullOrWhiteSpace(p_metadata.path_reference))
                {
                    result = lookup[p_metadata.path_reference];
                }
                else
                {
                    result = p_metadata.values;
                }
            }
            else if(p_metadata.children!= null)
            {
                foreach (var node in p_metadata.children)
                {
                    result = get_metadata_value_node(search_path, node, $"{path}/{node.name}");
                    if(result != null) break;
                }
            }
            return result;
        }

        private mmria.common.ije.BatchItem Convert
        (
                string LineItem,
                DateTime ImportDate,
                string ImportFileName,
                string ReportingState
        )
        {
            /*
            CDCUniqueID
                ImportDate
                ImportFileName
                ReportingState
                StateOfDeathRecord
                DateOfDeath
                DateOfBirth
                LastName
                FirstName
                MMRIARecordID
                StatusDetail
                */

            var x = mor_get_header(LineItem);
            var result = new mmria.common.ije.BatchItem()
            {
                Status = mmria.common.ije.BatchItem.StatusEnum.InProcess,
                CDCUniqueID = x["SSN"],
                ImportDate = ImportDate,
                ImportFileName = ImportFileName,
                ReportingState = ReportingState,

                StateOfDeathRecord = x["DSTATE"],
                DateOfDeath = $"{x["DOD_YR"]}-{x["DOD_MO"]}-{x["DOD_DY"]}",
                DateOfBirth = $"{x["DOB_YR"]}-{x["DOB_MO"]}-{x["DOB_DY"]}",
                LastName = x["LNAME"],
                FirstName = x["GNAME"]//,
                //MMRIARecordID = x[""],
                //StatusDetail = x[""]
            };

            return result;
        }

        private Dictionary<string, string> mor_get_header(string row)
        {
            var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            /*
DState 5 2
DOD_YR 1 4, 
DOD_MO 237 2, 
DOD_DY 239 2
DOB_YR 205 4, 
DOB_MO 209 2, 
DOD_DY 239 2
LNAME 78 50
GNAME 27 50
*/
            //result.Add("DState",row.Substring(5-1, 2).Trim());
            //result.Add("DOD_YR",row.Substring(1-1, 4).Trim());
            //result.Add("DOD_MO",row.Substring(237-1, 2).Trim());
            //result.Add("DOD_DY",row.Substring(239-1, 2).Trim());
            //result.Add("DOB_YR",row.Substring(205-1, 4).Trim());
            //result.Add("DOB_MO",row.Substring(209-1, 2).Trim());
            //result.Add("DOB_DY",row.Substring(211-1, 2).Trim());
            //result.Add("LNAME",row.Substring(78-1, 50).Trim());
            //result.Add("GNAME",row.Substring(27-1, 50).Trim());
            //result.Add("SSN",row.Substring(191-1, 9).Trim());

            result.Add("DOD_YR", DOD_YR_Rule(row.Substring(0, 4).Trim()));
            result.Add("DSTATE", row.Substring(4, 2).Trim());
            result.Add("FILENO", row.Substring(6, 6).Trim());
            result.Add("AUXNO", row.Substring(13, 12).Trim());
            result.Add("GNAME", row.Substring(26, 50).Trim());
            result.Add("LNAME", row.Substring(77, 50).Trim());
            result.Add("SSN", row.Substring(190, 9).Trim());
            result.Add("AGETYPE", row.Substring(199, 1).Trim());
            result.Add("AGE", AGE_Rule(row.Substring(200, 3).Trim()));
            result.Add("DOB_YR", row.Substring(204, 4).Trim());
            result.Add("DOB_MO", DOB_MO_Rule(row.Substring(208, 2).Trim()));
            result.Add("DOB_DY", DOB_DY_Rule(row.Substring(210, 2).Trim()));
            result.Add("BPLACE_CNT", row.Substring(212, 2).Trim());
            result.Add("BPLACE_ST", BPLACE_ST_Rule(row.Substring(214, 2).Trim()));
            result.Add("CITYC", row.Substring(216, 5).Trim());
            result.Add("COUNTYC", row.Substring(221, 3).Trim());
            result.Add("STATEC", STATEC_Rule(row.Substring(224, 2).Trim()));
            result.Add("COUNTRYC", COUNTRYC_Rule(row.Substring(226, 2).Trim()));
            result.Add("MARITAL", MARITAL_Rule(row.Substring(229, 1).Trim()));
            result.Add("DPLACE", row.Substring(231, 1).Trim());
            result.Add("COD", row.Substring(232, 3).Trim());
            result.Add("DOD_MO", DOD_MO_Rule(row.Substring(236, 2).Trim()));
            result.Add("DOD_DY", DOD_DY_Rule(row.Substring(238, 2).Trim()));
            result.Add("TOD", TOD_Rule(row.Substring(240, 4).Trim()));
            result.Add("DEDUC", DEDUC_Rule(row.Substring(244, 1).Trim()));

            result.Add("DETHNIC1", row.Substring(246, 1).Trim());
            result.Add("DETHNIC2", row.Substring(247, 1).Trim());
            result.Add("DETHNIC3", row.Substring(248, 1).Trim());
            result.Add("DETHNIC4", row.Substring(249, 1).Trim());
            result.Add("DETHNIC5", row.Substring(250, 20).Trim());

            result.Add("RACE1", row.Substring(270, 1).Trim());
            result.Add("RACE2", row.Substring(271, 1).Trim());
            result.Add("RACE3", row.Substring(272, 1).Trim());
            result.Add("RACE4", row.Substring(273, 1).Trim());
            result.Add("RACE5", row.Substring(274, 1).Trim());
            result.Add("RACE6", row.Substring(275, 1).Trim());
            result.Add("RACE7", row.Substring(276, 1).Trim());
            result.Add("RACE8", row.Substring(277, 1).Trim());
            result.Add("RACE9", row.Substring(278, 1).Trim());
            result.Add("RACE10", row.Substring(279, 1).Trim());
            result.Add("RACE11", row.Substring(280, 1).Trim());
            result.Add("RACE12", row.Substring(281, 1).Trim());
            result.Add("RACE13", row.Substring(282, 1).Trim());
            result.Add("RACE14", row.Substring(283, 1).Trim());
            result.Add("RACE15", row.Substring(284, 1).Trim());
            result.Add("RACE16", row.Substring(285, 30).Trim());
            result.Add("RACE17", row.Substring(315, 30).Trim());
            result.Add("RACE18", row.Substring(345, 30).Trim());
            result.Add("RACE19", row.Substring(375, 30).Trim());
            result.Add("RACE20", row.Substring(405, 30).Trim());
            result.Add("RACE21", row.Substring(435, 30).Trim());
            result.Add("RACE22", row.Substring(465, 30).Trim());
            result.Add("RACE23", row.Substring(495, 30).Trim());

            result.Add("OCCUP", row.Substring(574, 40).Trim());
            result.Add("INDUST", row.Substring(617, 40).Trim());
            result.Add("MANNER", MANNER_Rule(row.Substring(700, 1).Trim()));
            result.Add("MAN_UC", row.Substring(704, 5).Trim());
            result.Add("ACME_UC", row.Substring(709, 5).Trim());
            result.Add("EAC", row.Substring(714, 160).Trim());
            result.Add("TRX_FLG", row.Substring(874, 1).Trim());
            result.Add("RAC", row.Substring(875, 100).Trim());
            result.Add("AUTOP", AUTOP_Rule(row.Substring(975, 1).Trim()));
            result.Add("AUTOPF", AUTOPF_Rule(row.Substring(976, 1).Trim()));
            result.Add("TOBAC", TOBAC_Rule(row.Substring(977, 1).Trim()));
            result.Add("PREG", PREG_Rule(row.Substring(978, 1).Trim()));
            result.Add("DOI_MO", DOI_MO_Rule(row.Substring(980, 2).Trim()));
            result.Add("DOI_DY", DOI_DY_Rule(row.Substring(982, 2).Trim()));
            result.Add("DOI_YR", DOI_YR_Rule(row.Substring(984, 4).Trim()));
            result.Add("TOI_HR", TOI_HR_Rule(row.Substring(988, 4).Trim()));
            result.Add("WORKINJ", WORKINJ_Rule(row.Substring(992, 1).Trim()));
            result.Add("BLANK", row.Substring(1024, 56).Trim());
            result.Add("ARMEDF", ARMEDF_Rule(row.Substring(1080, 1).Trim()));
            result.Add("DINSTI", row.Substring(1081, 30).Trim());
            result.Add("STNUM_D", row.Substring(1161, 10).Trim());
            result.Add("PREDIR_D", row.Substring(1171, 10).Trim());
            result.Add("STNAME_D", row.Substring(1181, 50).Trim());
            result.Add("STDESIG_D", row.Substring(1231, 10).Trim());
            result.Add("POSTDIR_D", row.Substring(1241, 10).Trim());
            result.Add("CITYTEXT_D", row.Substring(1251, 28).Trim());
            result.Add("STATETEXT_D", row.Substring(1279, 28).Trim());
            result.Add("ZIP9_D", ZIP9_D_Rule(row.Substring(1307, 9).Trim()));
            result.Add("COUNTYTEXT_D", row.Substring(1316, 28).Trim());
            result.Add("CITYCODE_D", row.Substring(1344, 5).Trim());
            result.Add("STNUM_R", row.Substring(1484, 10).Trim());
            result.Add("PREDIR_R", row.Substring(1494, 10).Trim());
            result.Add("STNAME_R", row.Substring(1504, 28).Trim());
            result.Add("STDESIG_R", row.Substring(1532, 10).Trim());
            result.Add("POSTDIR_R", row.Substring(1542, 10).Trim());
            result.Add("UNITNUM_R", row.Substring(1552, 7).Trim());
            result.Add("CITYTEXT_R", row.Substring(1559, 28).Trim());
            result.Add("ZIP9_R", row.Substring(1587, 9).Trim());
            result.Add("COUNTYTEXT_R", row.Substring(1596, 28).Trim());
            result.Add("COUNTRYTEXT_R", row.Substring(1652, 28).Trim());
            result.Add("DMIDDLE", row.Substring(1807, 50).Trim());
            result.Add("POILITRL", row.Substring(2108, 50).Trim());
            result.Add("TRANSPRT", row.Substring(2408, 30).Trim());
            result.Add("COUNTYTEXT_I", row.Substring(2438, 28).Trim());
            result.Add("CITYTEXT_I", row.Substring(2469, 28).Trim());
            result.Add("COD1A", row.Substring(2541, 120).Trim());
            result.Add("INTERVAL1A", row.Substring(2661, 20).Trim());
            result.Add("COD1B", row.Substring(2681, 120).Trim());
            result.Add("INTERVAL1B", row.Substring(2801, 20).Trim());
            result.Add("COD1C", row.Substring(2821, 120).Trim());
            result.Add("INTERVAL1C", row.Substring(2941, 20).Trim());
            result.Add("COD1D", row.Substring(2961, 120).Trim());
            result.Add("INTERVAL1D", row.Substring(3081, 20).Trim());
            result.Add("OTHERCONDITION", row.Substring(3101, 240).Trim());
            result.Add("DBPLACECITY", row.Substring(3396, 28).Trim());
            result.Add("STINJURY", row.Substring(4269, 28).Trim());
            result.Add("VRO_STATUS", VRO_STATUS_Rule(row.Substring(4992, 1).Trim()));
            result.Add("BC_DET_MATCH", row.Substring(4993, 1).Trim());
            result.Add("FDC_DET_MATCH", row.Substring(4994, 1).Trim());
            result.Add("BC_PROB_MATCH", row.Substring(4995, 1).Trim());
            result.Add("FDC_PROB_MATCH", row.Substring(4996, 1).Trim());
            result.Add("ICD10_MATCH", row.Substring(4997, 1).Trim());
            result.Add("PREGCB_MATCH", row.Substring(4998, 1).Trim());
            result.Add("LITERALCOD_MATCH", row.Substring(4999, 1).Trim());


            return result;

            /*
            2 home_record/state of death - DState
3 home_record/date_of_death - DOD_YR, DOD_MO, DOD_DY
4 death_certificate/date_of_birth - DOB_YR, DOB_MO, DOD_DY
5 home_record/last_name - LNAME  
6 home_record/first_name - GNAME*/
        }

        private List<Dictionary<string, string>> nat_get_header(List<string> rows)
        {
            var listResults = new List<Dictionary<string, string>>();

            foreach (var row in rows)
            {
                var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

                result.Add("IDOB_YR", row.Substring(0, 4).Trim());
                result.Add("FILENO", row.Substring(6, 6).Trim());
                result.Add("AUXNO", row.Substring(13, 12).Trim());
                result.Add("TB", row.Substring(25, 4).Trim());
                result.Add("IDOB_MO", row.Substring(30, 2).Trim());
                result.Add("IDOB_DY", row.Substring(32, 2).Trim());
                result.Add("FNPI", row.Substring(38, 12).Trim());
                result.Add("MDOB_YR", MDOB_YR_Rule(row.Substring(54, 4).Trim()));
                result.Add("MDOB_MO", MDOB_MO_Rule(row.Substring(58, 2).Trim()));
                result.Add("MDOB_DY", MDOB_DY_Rule(row.Substring(60, 2).Trim()));
                result.Add("FDOB_YR", FDOB_YR_Rule(row.Substring(80, 4).Trim()));
                result.Add("FDOB_MO", FDOB_MO_Rule(row.Substring(84, 2).Trim()));
                result.Add("MARN", MARN_Rule(row.Substring(90, 1).Trim()));
                result.Add("ACKN", ACKN_Rule(row.Substring(91, 1).Trim()));
                result.Add("MEDUC", MEDUC_Rule(row.Substring(92, 1).Trim()));
                result.Add("METHNIC5", row.Substring(98, 20).Trim());
                result.Add("FEDUC", row.Substring(421, 1).Trim());
                result.Add("FETHNIC5", row.Substring(427, 20).Trim());
                result.Add("ATTEND", ATTEND_Rule(row.Substring(750, 1).Trim()));
                result.Add("TRAN", TRAN_Rule(row.Substring(751, 1).Trim()));
                result.Add("NPREV", NPREV_Rule(row.Substring(768, 2).Trim()));
                result.Add("HFT", HFT_Rule(row.Substring(771, 1).Trim()));
                result.Add("HIN", HIN_Rule(row.Substring(772, 2).Trim()));
                result.Add("PWGT", PWGT_Rule(row.Substring(775, 3).Trim()));
                result.Add("DWGT", DWGT_Rule(row.Substring(779, 3).Trim()));
                result.Add("WIC", WIC_Rule(row.Substring(783, 1).Trim()));
                result.Add("PLBL", PLBL_Rule(row.Substring(784, 2).Trim()));
                result.Add("PLBD", PLBD_Rule(row.Substring(786, 2).Trim()));
                result.Add("POPO", POPO_Rule(row.Substring(788, 2).Trim()));
                result.Add("MLLB", MLLB_Rule(row.Substring(790, 2).Trim()));
                result.Add("YLLB", YLLB_Rule(row.Substring(792, 4).Trim()));
                result.Add("MOPO", MOPO_Rule(row.Substring(796, 2).Trim()));
                result.Add("YOPO", YOPO_Rule(row.Substring(798, 4).Trim()));
                result.Add("PAY", PAY_Rule(row.Substring(810, 1).Trim()));
                result.Add("DLMP_YR", DLMP_YR_Rule(row.Substring(811, 4).Trim()));
                result.Add("DLMP_MO", DLMP_MO_Rule(row.Substring(815, 2).Trim()));
                result.Add("DLMP_DY", DLMP_DY_Rule(row.Substring(817, 2).Trim()));
                result.Add("NPCES", NPCES_Rule(row.Substring(828, 2).Trim()));
                result.Add("ATTF", ATTF_Rule(row.Substring(853, 1).Trim()));
                result.Add("ATTV", ATTV_Rule(row.Substring(854, 1).Trim()));
                result.Add("PRES", PRES_Rule(row.Substring(855, 1).Trim()));
                result.Add("ROUT", ROUT_Rule(row.Substring(856, 1).Trim()));
                result.Add("OWGEST", OWGEST_Rule(row.Substring(869, 2).Trim()));
                result.Add("APGAR5", APGAR5_Rule(row.Substring(872, 2).Trim()));
                result.Add("APGAR10", APGAR10_Rule(row.Substring(874, 2).Trim()));
                result.Add("SORD", SORD_Rule(row.Substring(878, 2).Trim()));
                result.Add("ITRAN", ITRAN_Rule(row.Substring(908, 1).Trim()));
                result.Add("ILIV", ILIV_Rule(row.Substring(909, 1).Trim()));
                result.Add("BFED", BFED_Rule(row.Substring(910, 1).Trim()));
                result.Add("BIRTH_CO", row.Substring(1157, 25).Trim());
                result.Add("BRTHCITY", row.Substring(1182, 50).Trim());
                result.Add("HOSP", row.Substring(1232, 50).Trim());
                result.Add("MOMFNAME", row.Substring(1282, 50).Trim());
                result.Add("MOMMIDDL", row.Substring(1332, 50).Trim());
                result.Add("MOMLNAME", row.Substring(1382, 50).Trim());
                result.Add("MOMMAIDN", row.Substring(1539, 50).Trim());
                result.Add("STNUM", row.Substring(1596, 10).Trim());
                result.Add("PREDIR", row.Substring(1606, 10).Trim());
                result.Add("STNAME", row.Substring(1616, 28).Trim());
                result.Add("STDESIG", row.Substring(1644, 10).Trim());
                result.Add("POSTDIR", row.Substring(1654, 10).Trim());
                result.Add("UNUM", row.Substring(1664, 7).Trim());
                result.Add("ZIPCODE", row.Substring(1721, 9).Trim());
                result.Add("COUNTYTXT", row.Substring(1730, 28).Trim());
                result.Add("CITYTEXT", row.Substring(1758, 28).Trim());
                result.Add("MOM_OC_T", row.Substring(2021, 25).Trim());
                result.Add("DAD_OC_T", row.Substring(2049, 25).Trim());
                result.Add("MOM_IN_T", row.Substring(2077, 25).Trim());
                result.Add("DAD_IN_T", row.Substring(2105, 25).Trim());
                result.Add("HOSPFROM", row.Substring(2283, 50).Trim());
                result.Add("HOSPTO", row.Substring(2333, 50).Trim());
                result.Add("ATTEND_OTH_TXT", row.Substring(2383, 20).Trim());
                result.Add("ATTEND_NPI", row.Substring(2826, 12).Trim());
                result.Add("INF_MED_REC_NUM", row.Substring(2921, 15).Trim());
                result.Add("MOM_MED_REC_NUM", row.Substring(2936, 15).Trim());

                listResults.Add(result);
            }

            return listResults;
        }

        private List<Dictionary<string, string>> fet_get_header(List<string> rows)
        {
            var listResults = new List<Dictionary<string, string>>();

            foreach (var row in rows)
            {
                var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

                result.Add("FDOD_YR", row.Substring(0, 4).Trim());
                result.Add("FILENO", row.Substring(6, 6).Trim());
                result.Add("AUXNO", row.Substring(13, 12).Trim());
                result.Add("TD", row.Substring(25, 4).Trim());
                result.Add("FDOD_MO", row.Substring(30, 2).Trim());
                result.Add("FDOD_DY", row.Substring(32, 2).Trim());
                result.Add("FNPI", row.Substring(38, 12).Trim());
                result.Add("MDOB_YR", MDOB_YR_FET_Rule(row.Substring(54, 4).Trim()));
                result.Add("MDOB_MO", MDOB_MO_FET_Rule(row.Substring(58, 2).Trim()));
                result.Add("MDOB_DY", MDOB_DY_FET_Rule(row.Substring(60, 2).Trim()));
                result.Add("FDOB_YR", FDOB_YR_FET_Rule(row.Substring(80, 4).Trim()));
                result.Add("FDOB_MO", FDOB_MO_FET_Rule(row.Substring(84, 2).Trim()));
                result.Add("MARN", MARN_FET_Rule(row.Substring(90, 1).Trim()));
                result.Add("MEDUC", MEDUC_FET_Rule(row.Substring(92, 1).Trim()));
                result.Add("METHNIC5", row.Substring(98, 20).Trim());
                result.Add("ATTEND", ATTEND_FET_Rule(row.Substring(421, 1).Trim()));
                result.Add("TRAN", TRAN_FET_Rule(row.Substring(422, 1).Trim()));
                result.Add("NPREV", NPREV_FET_Rule(row.Substring(439, 2).Trim()));
                result.Add("HFT", HFT_FET_Rule(row.Substring(442, 1).Trim()));
                result.Add("HIN", HIN_FET_Rule(row.Substring(443, 2).Trim()));
                result.Add("PWGT", PWGT_FET_Rule(row.Substring(446, 3).Trim()));
                result.Add("DWGT", DWGT_FET_Rule(row.Substring(450, 3).Trim()));
                result.Add("WIC", WIC_FET_Rule(row.Substring(454, 1).Trim()));
                result.Add("PLBL", PLBL_FET_Rule(row.Substring(455, 2).Trim()));
                result.Add("PLBD", PLBD_FET_Rule(row.Substring(457, 2).Trim()));
                result.Add("POPO", POPO_FET_Rule(row.Substring(459, 2).Trim()));
                result.Add("MLLB", MLLB_FET_Rule(row.Substring(461, 2).Trim()));
                result.Add("YLLB", YLLB_FET_Rule(row.Substring(463, 4).Trim()));
                result.Add("MOPO", MOPO_FET_Rule(row.Substring(467, 2).Trim()));
                result.Add("YOPO", YOPO_FET_Rule(row.Substring(469, 4).Trim()));
                result.Add("DLMP_YR", DLMP_YR_FET_Rule(row.Substring(481, 4).Trim()));
                result.Add("DLMP_MO", DLMP_MO_FET_Rule(row.Substring(485, 2).Trim()));
                result.Add("DLMP_DY", DLMP_DY_FET_Rule(row.Substring(487, 2).Trim()));
                result.Add("NPCES", NPCES_FET_Rule(row.Substring(498, 2).Trim()));
                result.Add("ATTF", ATTF_FET_Rule(row.Substring(511, 1).Trim()));
                result.Add("ATTV", ATTV_FET_Rule(row.Substring(512, 1).Trim()));
                result.Add("PRES", PRES_FET_Rule(row.Substring(513, 1).Trim()));
                result.Add("ROUT", ROUT_FET_Rule(row.Substring(514, 1).Trim()));
                result.Add("OWGEST", OWGEST_FET_Rule(row.Substring(528, 2).Trim()));
                result.Add("SORD", SORD_FET_Rule(row.Substring(537, 2).Trim()));
                result.Add("HOSP_D", row.Substring(2904, 50).Trim());
                result.Add("ADDRESS_D", row.Substring(3051, 50).Trim());
                result.Add("ZIPCODE_D", row.Substring(3101, 9).Trim());
                result.Add("CNTY_D", row.Substring(3110, 28).Trim());
                result.Add("CITY_D", row.Substring(3138, 28).Trim());
                result.Add("MOMFNAME", row.Substring(3256, 50).Trim());
                result.Add("MOMMNAME", row.Substring(3306, 50).Trim());
                result.Add("MOMLNAME", row.Substring(3356, 50).Trim());
                result.Add("MOMMAIDN", row.Substring(3516, 50).Trim());
                result.Add("STNUM", row.Substring(3576, 10).Trim());
                result.Add("PREDIR", row.Substring(3586, 10).Trim());
                result.Add("STNAME", row.Substring(3596, 50).Trim());
                result.Add("STDESIG", row.Substring(3646, 10).Trim());
                result.Add("POSTDIR", row.Substring(3656, 10).Trim());
                result.Add("APTNUMB", row.Substring(3666, 7).Trim());
                result.Add("ZIPCODE", row.Substring(3723, 9).Trim());
                result.Add("COUNTYTXT", row.Substring(3732, 28).Trim());
                result.Add("CITYTXT", row.Substring(3760, 28).Trim());
                result.Add("MOM_OC_T", row.Substring(4060, 25).Trim());
                result.Add("DAD_OC_T", row.Substring(4088, 25).Trim());
                result.Add("MOM_IN_T", row.Substring(4116, 25).Trim());
                result.Add("DAD_IN_T", row.Substring(4144, 25).Trim());
                result.Add("FEDUC", FEDUC_FET_Rule(row.Substring(4288, 1).Trim()));
                result.Add("FETHNIC5", row.Substring(4294, 20).Trim());
                result.Add("HOSPFROM", row.Substring(4763, 50).Trim());
                result.Add("ATTEND_NPI", row.Substring(4863, 12).Trim());
                result.Add("ATTEND_OTH_TXT", row.Substring(4875, 20).Trim());

                listResults.Add(result);
            }

            return listResults;
        }

        #region Rules Section

        #region MOR Rules

        private string DPLACE_Rule(string value)
        {
            /*"1 --> dcdi_doi_hospi = 0 and dcdi_doo_hospi = 9999 (blank)
                2 --> dcdi_doi_hospi = 1 and dcdi_doo_hospi = 9999 (blank)
                3 --> dcdi_doi_hospi = 2 and dcdi_doo_hospi = 9999 (blank)
                4 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 2
                5 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 0
                6 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 1 
                7 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 3
                9 --> dcdi_doi_hosp = 7777 (unknown) and dcdi_doo_hospi = 7777 (unknown) "
                 */
            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "2";
                    break;
                case "4":
                    value = "9999";
                    break;
                case "5":
                    value = "9999";
                    break;
                case "6":
                    value = "9999";
                    break;
                case "7":
                    value = "9999";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string DPLACE_Outside_of_hospital_Rule(string value)
        {
            /*"1 --> dcdi_doi_hospi = 0 and dcdi_doo_hospi = 9999 (blank)
                2 --> dcdi_doi_hospi = 1 and dcdi_doo_hospi = 9999 (blank)
                3 --> dcdi_doi_hospi = 2 and dcdi_doo_hospi = 9999 (blank)
                4 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 2
                5 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 0
                6 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 1 
                7 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 3
                9 --> dcdi_doi_hosp = 7777 (unknown) and dcdi_doo_hospi = 7777 (unknown) "
                 */
            switch (value?.ToUpper())
            {
                case "1":
                    value = "9999";
                    break;
                case "2":
                    value = "9999";
                    break;
                case "3":
                    value = "9999";
                    break;
                case "4":
                    value = "2";
                    break;
                case "5":
                    value = "0";
                    break;
                case "6":
                    value = "1";
                    break;
                case "7":
                    value = "3";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }
            return value;
        }

        private string STINJURY_Rule(string value)
        {
            var result = value;

            if (StateDisplayToValue.ContainsKey(value))
            {
                result = StateDisplayToValue[value];
            }

            return result;
        }

        private string STATETEXT_D_Rule(string value)
        {
            var result = value;

            if (StateDisplayToValue.ContainsKey(value))
            {
                result = StateDisplayToValue[value];
            }

            return result;
        }

        private string PLACE_OF_LAST_RESIDENCE_street_Rule(string stnum_r, string predir_r, string stname_r, string stdesig_r, string postdir_r)
        {
            //Map to MMRIA field via Merge with other place of death street fields(STNUM_D, PREDIR_D, STNAME_D, STDESIG_D, POSTDIR_D) 1 of 5
            string determinedValue = $"{stnum_r} {predir_r} {stname_r} {stdesig_r} {postdir_r}";

            return determinedValue;
        }

        private string ADDRESS_OF_DEATH_street_Rule(string stnum_d, string predir_d, string stname_d, string stdesig_d, string postdir_d)
        {
            //Map to MMRIA field via Merge with other place of death street fields(STNUM_D, PREDIR_D, STNAME_D, STDESIG_D, POSTDIR_D) 1 of 5
            string determinedValue = $"{stnum_d} {predir_d} {stname_d} {stdesig_d} {postdir_d}";

            return determinedValue;
        }

        private string RACE_other_race_Rule(string race22, string race23)
        {
            //"Combine RACE22 and RACE23 into one field (dcr_o_race), separated by pipe delimiter. 
            //1.Transfer string verbatim from RACE22 to MMRIA field.
            //2.Transfer string verbatim from RACE23 and add to same MMRIA field.
            //3.If both RACE22 and RACE23 are empty, leave MMRIA field empty(blank)."
            string determinedValue = string.Empty;

            if (!string.IsNullOrWhiteSpace(race22) && !string.IsNullOrWhiteSpace(race23))
                determinedValue = $"{race22}|{race23}";
            else if (!string.IsNullOrWhiteSpace(race22))
                determinedValue = race22;
            else if (!string.IsNullOrWhiteSpace(race23))
                determinedValue = race23;

            return determinedValue;
        }

        private string RACE_other_pacific_islander_Rule(string race20, string race21)
        {
            //"Combine RACE20 and RACE21 into one field (dcr_op_islan), separated by pipe delimiter. 
            //1.Transfer string verbatim from RACE20 to MMRIA field.
            //2.Transfer string verbatim from RACE21 and add to same MMRIA field.
            //3.If both RACE20 and RACE21 are empty, leave MMRIA field empty(blank)."
            string determinedValue = string.Empty;

            if (!string.IsNullOrWhiteSpace(race20) && !string.IsNullOrWhiteSpace(race21))
                determinedValue = $"{race20}|{race21}";
            else if (!string.IsNullOrWhiteSpace(race20))
                determinedValue = race20;
            else if (!string.IsNullOrWhiteSpace(race21))
                determinedValue = race21;

            return determinedValue;
        }

        private string RACE_other_asian_Rule(string race18, string race19)
        {
            //"Combine RACE18 and RACE19 into one field (dcr_o_asian), separated by pipe delimiter.
            //1.Transfer string verbatim from RACE18 to MMRIA field.
            //2.Transfer string verbatim from RACE19 and add to same MMRIA field.
            //3.If both RACE18 and RACE19 are empty, leave MMRIA field empty(blank)."
            //Defaulting to blank
            string determinedValue = string.Empty;

            if (!string.IsNullOrWhiteSpace(race18) && !string.IsNullOrWhiteSpace(race19))
                determinedValue = $"{race18}|{race19}";
            else if (!string.IsNullOrWhiteSpace(race18))
                determinedValue = race18;
            else if (!string.IsNullOrWhiteSpace(race19))
                determinedValue = race19;

            return determinedValue;

        }

        private string RACE_Principal_Tribe_Rule(string race16, string race17)
        {
            //"Combine RACE16 and RACE17 into one field (dcr_p_tribe), separated by pipe delimiter. 
            //1.Transfer string verbatim from RACE16 to MMRIA field.
            //2.Transfer string verbatim from RACE17 and add to same MMRIA field.
            //3.If both RACE16 and RACE17 are empty, leave MMRIA field empty(blank)."
            //Defaulting to blank
            string determinedValue = string.Empty;

            if (!string.IsNullOrWhiteSpace(race16) && !string.IsNullOrWhiteSpace(race17))
                determinedValue = $"{race16}|{race17}";
            else if (!string.IsNullOrWhiteSpace(race16))
                determinedValue = race16;
            else if (!string.IsNullOrWhiteSpace(race17))
                determinedValue = race17;

            return determinedValue;
        }

        private string[] RACE_Rule(string race1, string race2, string race3,
            string race4, string race5, string race6,
            string race7, string race8, string race9,
            string race10, string race11, string race12,
            string race13, string race14, string race15)
        {
            //"Use values from RACE1 through RACE15 to populate MMRIA multi-select field (dcr_race).
            //If every one of RACE1 through RACE15 is equal to ""N"", then dcr_race = 8888(Race Not Specified)"
            //"Use values from RACE1 through RACE15 to populate MMRIA multi-select field (dcr_race).
            //RACE1 = Y-- > dcr_race = 0
            //RACE2 = Y-- > dcr_race = 1
            //RACE3 = Y-- > dcr_race = 2
            //RACE4 = Y-- > dcr_race = 7
            //RACE5 = Y-- > dcr_race = 8
            //RACE6 = Y-- > dcr_race = 9
            //RACE7 = Y-- > dcr_race = 10
            //RACE8 = Y-- > dcr_race = 11
            //RACE9 = Y-- > dcr_race = 12
            //RACE10 = Y-- > dcr_race = 13
            //RACE11 = Y-- > dcr_race = 3
            //RACE12 = Y-- > dcr_race = 4
            //RACE13 = Y-- > dcr_race = 5
            //RACE14 = Y-- > dcr_race = 6
            //RACE15 = Y-- > dcr_race = 14

            //Defaulting to blank
            List<string> determinedValues = new List<string>();

            if (race1 == "N" && race2 == "N" && race3 == "N" && race4 == "N"
                && race5 == "N" && race6 == "N" && race7 == "N" && race8 == "N"
                && race9 == "N" && race10 == "N" && race11 == "N" && race12 == "N"
                && race13 == "N" && race14 == "N" && race15 == "N")
                determinedValues.Add("8888");
            else
            {
                if (race1 == "Y")
                    determinedValues.Add("0");

                if (race2 == "Y")
                    determinedValues.Add("1");

                if (race3 == "Y")
                    determinedValues.Add("2");

                if (race4 == "Y")
                    determinedValues.Add("7");

                if (race5 == "Y")
                    determinedValues.Add("8");

                if (race6 == "Y")
                    determinedValues.Add("9");

                if (race7 == "Y")
                    determinedValues.Add("10");

                if (race8 == "Y")
                    determinedValues.Add("11");

                if (race9 == "Y")
                    determinedValues.Add("12");

                if (race10 == "Y")
                    determinedValues.Add("13");

                if (race11 == "Y")
                    determinedValues.Add("3");

                if (race12 == "Y")
                    determinedValues.Add("4");

                if (race13 == "Y")
                    determinedValues.Add("5");

                if (race14 == "Y")
                    determinedValues.Add("6");

                if (race15 == "Y")
                    determinedValues.Add("14");
            }

            return determinedValues.ToArray();
        }

        private string DETHNIC_Rule(string value1, string value2, string value3, string value4)
        {
            //"Use values of DETHNIC1, DETHNIC2, DETHNIC3, DETHNIC4 to fill out MMRIA field dcd_ioh_origi.
            //If DETHNIC1 = N and DETHNIC2 = N and DETHNIC3 = N and DETHNIC 4 = N-- > dcd_ioh_origi = 0 No, Not Spanish/ Hispanic / Latino
            //If DETHNIC1 = U and DETHNIC2 = U and DETHNIC3 = U and DETHNIC4 = U-- > dcd_ioh_origi = 7777 Unknown
            //If DETHNIC1 = (empty)and DETHNIC2 = (empty)and DETHNIC3 = (empty)and DETHNIC4 = (empty)-- > dcd_ioh_origi = 9999(blank)"
            //H-- > dcd_ioh_origi = 1 Yes, Mexican, Mexican American, Chicano
            //H-- > dcd_ioh_origi = 2 Yes, Puerto Rican
            //H-- > dcd_ioh_origi = 3 Yes, Cuban
            //H-- > dcd_ioh_origi = 4 Yes, Other Spanish/ Hispanic / Latino

            //Defaulting to blank
            string determinedValue = "9999";

            if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N")
                determinedValue = "0";
            else if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U")
                determinedValue = "7777";
            else if (value1 == "H")
                determinedValue = "1";
            else if (value2 == "H")
                determinedValue = "2";
            else if (value3 == "H")
                determinedValue = "3";
            else if (value4 == "H")
                determinedValue = "4";

            return determinedValue;
        }

        private string MANNER_Rule(string value)
        {
            //"Map character to MMRIA code values as follows:
            //Blank fields -> 9999(blank)
            //N-> 0 Natural
            //A-> 2 Accident
            //S-> 3 Suicide
            //H-> 1 Homicide
            //P-> 5 Pending Investigation
            //C-> 6 Could Not Be Determined

            //Map empty rows-- > 9999(blank)"

            switch (value?.ToUpper())
            {
                case "N":
                    value = "0";
                    break;
                case "A":
                    value = "2";
                    break;
                case "S":
                    value = "3";
                    break;
                case "H":
                    value = "1";
                    break;
                case "P":
                    value = "5";
                    break;
                case "C":
                    value = "6";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string AUTOP_Rule(string value)
        {
            //"Map character to MMRIA code values as follows:
            //Blank fields -> 9999(blank)
            //Y-> 1 = Yes
            //N-> 0 = No
            //U->  7777 = Unknown
            //"

            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string AUTOPF_Rule(string value)
        {
            //"Map character to MMRIA code values as follows:
            //Blank fields -> 9999(blank)
            //Y-> 1 = Yes
            //N-> 0 = No
            //U->  7777 = Unknown
            //"

            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string TOBAC_Rule(string value)
        {
            //"Map character to MMRIA code values as follows: 
            //Blank fields -> 9999(blank)
            //Y-> 1 = Yes
            //N-> 0 = No
            //P-> 2 = Probably
            //U-> 7777 = Unknown
            //C-> 7777 = Unknown"

            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "P":
                    value = "2";
                    break;
                case "U":
                case "C":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string PREG_Rule(string value)
        {
            //"Map number to MMRIA number codes as follows:
            //Empty columns -> 9999 = (blank)
            //1-- > 0 Not pregnant within last year
            //2-- > 1 Pregnant at the time of death
            //3-- > 2 Pregnant within 42 days of death
            //4-- > 3 Pregnant within 43 to 365 days of death
            //8-- > 5 Not Applicable
            //9-- > 88 Unknown if pregnant in last year "

            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "2";
                    break;
                case "4":
                    value = "3";
                    break;
                case "8":
                    value = "5";
                    break;
                case "9":
                    value = "88";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string DOI_MO_Rule(string value)
        {
            //Transfer number verbatim to MMRIA field; Map 99 and blank -> 9999(blank)
            if (value == "99" || string.IsNullOrWhiteSpace(value))
                value = "9999";

            return value;
        }

        private string DOI_DY_Rule(string value)
        {
            //Transfer number verbatim to MMRIA field; Map 99 and blank -> 9999(blank)
            if (value == "99" || string.IsNullOrWhiteSpace(value))
                value = "9999";

            return value;
        }

        private string DOI_YR_Rule(string value)
        {
            //Transfer number verbatim to MMRIA field; Map 9999 and blank ->9999(blank)
            if (string.IsNullOrWhiteSpace(value))
                value = "9999";

            return value;
        }

        private string TOI_HR_Rule(string value)
        {
            //Transfer number verbatim to MMRIA field; Values of 9999 and blank should be mapped as blank; need to map these values to MMRIA time format
            if (value == "9999" || string.IsNullOrWhiteSpace(value))
                value = string.Empty;

            return value;
        }

        private string WORKINJ_Rule(string value)
        {
            //"Map character to MMRIA code values as follows:
            //Blank fields -> 9999(blank)
            //Y-> 1 = Yes
            //N-> 0 = No
            //U->  7777 = Unknown
            //"

            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string ARMEDF_Rule(string value)
        {
            //"Map character to MMRIA code values as follows:
            //Blank fields -> 9999(blank)
            //Y-> 1 = Yes
            //N-> 0 = No
            //U->  7777 = Unknown
            //"

            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string ZIP9_D_Rule(string value)
        {
            //Transfer string verbatim to MMRIA field; map values of 99999 to blank
            if (value == "99999")
                value = string.Empty;

            return value;
        }

        private string TRANSPRT_Rule(string value)
        {
            //"1. Map character to MMRIA code values as follows: 
            //Blank fields -> 9999(blank)
            //DR-> 0 = Driver / Operator
            //PA-> 1 = Passenger
            //PE-> 2 = Pedestrian
            //Map any other text -> 3 = Other
            //2.Map full text to MMRIA Specify Other field"

            switch (value?.ToUpper())
            {
                case "DR":
                    value = "0";
                    break;
                case "PA":
                    value = "1";
                    break;
                case "PE":
                    value = "2";
                    break;
                case "":
                    value = "9999";
                    break;
                default:
                    value = "3";
                    break;
            }

            return value;
        }

        private string TRANSPRT_other_specify_Rule(string value)
        {
            //"1. Map character to MMRIA code values as follows: 
            //Blank fields -> 9999(blank)
            //DR-> 0 = Driver / Operator
            //PA-> 1 = Passenger
            //PE-> 2 = Pedestrian
            //Map any other text -> 3 = Other
            //2.Map full text to MMRIA Specify Other field"

            switch (value?.ToUpper())
            {
                case "DR":
                    value = "";
                    break;
                case "PA":
                    value = "";
                    break;
                case "PE":
                    value = "";
                    break;
                case "":
                    value = "";
                    break;
                default:
                    //I know this looks weird, just coded it to show that the above values resolve this field to empty
                    // but other text is passed through
                    value = value;
                    break;
            }

            return value;
        }


        private string VRO_STATUS_Rule(string value)
        {
            //3-> 3 = N / A(identified via linkage or literal cause of death field)        9999-> 9999(blank)
            if (value == "9999")
                value = string.Empty;

            return value;
        }

        private string DEDUC_Rule(string value)
        {
            //Map number to MMRIA number codes as follows:
            //Empty columns -> 9999 = (blank)
            //1-> 0 = 8th Grade or Less
            //2-> 1 = 9th - 12th grade; No Diploma
            //3-> 2 = High School Graduate or GED Completed
            //4-> 3 = Some college credit, but no degree
            //5-> 4 = Associate Degree
            //6-> 5 = Bachelor's Degree
            //7-> 6 = Master's Degree
            //8-> 7 = Doctorate Degree or Professional Degree
            //9-> 7777 = Unknown

            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "2";
                    break;
                case "4":
                    value = "3";
                    break;
                case "5":
                    value = "4";
                    break;
                case "6":
                    value = "5";
                    break;
                case "7":
                    value = "6";
                    break;
                case "8":
                    value = "7";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;

        }

        private string TOD_Rule(string value)
        {
            //Transfer number verbatim to MMRIA field, format as MMRIA time.; if TOD = 9999 then this field should be left blank
            if (value == "9999")
                value = string.Empty;

            return value;
        }

        private string DOD_DY_Rule(string value)
        {
            //Transfer number verbatim to MMRIA field; if DOD_DY = 99 then this field should be mapped to 9999(blank)
            if (value == "99")
                value = "9999";

            return value;
        }

        private string DOD_MO_Rule(string value)
        {
            //Transfer number verbatim to MMRIA field; if DOD_MO = 99 then this field should be mapped to 9999(blank)
            if (value == "99")
                value = "9999";

            return value;
        }

        private string MARITAL_Rule(string value)
        {
            //Map character to MMRIA number codes as follows:
            //Blank-> 9999 = (blank)
            //M-> 0 = Married
            //A-> 1 = Married, but Separated
            //W-> 2 = Widowed
            //D-> 3 = Divorced
            //S-> 4 = Never Married
            //U->  7777 = Unknown

            switch (value?.ToUpper())
            {
                case "M":
                    value = "0";
                    break;
                case "A":
                    value = "1";
                    break;
                case "W":
                    value = "2";
                    break;
                case "D":
                    value = "3";
                    break;
                case "S":
                    value = "4";
                    break;
                case "U":
                    value = "7";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string COUNTRYC_Rule(string value)
        {
            //Map to MMRIA field Country listing 
            //Map XX to 9999(blank)
            //Map ZZ to 9999(blank)
            if (value == "XX" || value == "ZZ")
                value = "9999";

            return value;

        }

        private string STATEC_Rule(string value)
        {
            // Map to MMRIA field state listing.
            //Map XX to 9999(blank)
            if (value == "XX")
                value = "9999";

            return value;
        }

        private string BPLACE_ST_Rule(string value)
        {
            // Map to MMRIA field state listing.
            //Map XX to 9999(blank)
            if (value == "XX")
                value = "9999";

            return value;
        }

        private string DOB_DY_Rule(string value)
        {
            //Transfer number verbatim to MMRIA field; IF value='99', this field should be mapped to 9999 (blank)
            if (value == "99")
                value = "9999";

            return value;
        }

        private string DOB_MO_Rule(string value)
        {
            //Transfer number verbatim to MMRIA field; IF value='99', this field should be mapped to 9999 (blank)
            if (value == "99")
                value = "9999";

            return value;
        }

        private string AGE_Rule(string value)
        {
            //Transfer number verbatim to MMRIA field; IF AGE = 999 this field should be left blank
            if (value == "999")
                value = string.Empty;

            return value;
        }

        private string DOD_YR_Rule(string value)
        {
            //Transfer string verbatim to MMRIA field; empty fields should map to 9999(blank)
            if (string.IsNullOrWhiteSpace(value))
                value = "9999";

            return value;
        }

        #endregion

        #region NAT Rules

        private string LOCATION_OF_RESIDENCE_street_Rule(string stnum_r, string predir_r, string stname_r, string stdesig_r, string postdir_r)
        {
            //Map to MMRIA field via Merge with other place of death street fields(STNUM_D, PREDIR_D, STNAME_D, STDESIG_D, POSTDIR_D) 1 of 5
            string determinedValue = $"{stnum_r} {predir_r} {stname_r} {stdesig_r} {postdir_r}";

            return determinedValue;
        }

        private string DATE_OF_DELIVERY_Rule(string year, string month, string day)
        {
            //2.Merge 3 fields(IDOB_MO, IDOB_DY, IDOB_YR) map resulting date to MMRIA field -date_of _delivery(bcifsri_do_deliv)."
            string determinedValue = $"{year}-{month}-{day}";

            return determinedValue;
        }

        private string IDOB_YR_Merge_Rule(string value)
        {
            /*1. Transfer number verbatim to MMRIA field - date_of_delivery/year (bfdcpfodddod_year)
            2. Merge 3 fields (IDOB_MO, IDOB_DY, IDOB_YR) map resulting date to MMRIA field - date_of _delivery (bcifsri_do_deliv).*/
            return value;
        }

        private string MDOB_YR_Rule(string value)
        {
            /*If value is not 9999, transfer number verbatim to MMRIA field.

            If value = 9999, map to 9999 (blank).*/

            if (value == "9999")
                value = "9999";

            return value;
        }

        private string MDOB_MO_Rule(string value)
        {
            /*If value is in 01-12, transfer number verbatim to MMRIA field.

            If value = 99, map to 9999 (blank).*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string MDOB_DY_Rule(string value)
        {
            /*If value is in 01-31, transfer number verbatim to MMRIA field.

            If value = 99, map to 9999 (blank).*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string FDOB_YR_Rule(string value)
        {
            /*If value is not 9999, transfer number verbatim to MMRIA field.

            If value = 9999, map to 9999 (blank).*/

            if (value == "9999")
                value = "9999";

            return value;
        }

        private string FDOB_MO_Rule(string value)
        {
            /*If value is in 01-12, transfer number verbatim to MMRIA field.

            If value = 99, map to 9999 (blank).*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string MARN_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 =Yes
            N  -> 0 = No
            U  ->  7777 = Unknown
            */


            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string ACKN_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 =Yes
            N  -> 0 = No
            U  ->  7777 = Unknown
            X -> 2=Not Applicable
            */


            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                case "X":
                    value = "2";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string MEDUC_Rule(string value)
        {
            /*Map number to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            1 -> 0 = 8th Grade or Less
            2  -> 1 = 9th-12th Grade; No Diploma
            3  -> 2 = High School Grad or GED Completed 
            4  -> 3 = Some college, but no degree
            5  -> 4 = Associate Degree
            6  -> 5 = Bachelor's Degree
            7  -> 6 = Master's Degree
            8  -> 7 = Doctorate or Professional Degree
            9  -> 7777 = Unknown*/


            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "2";
                    break;
                case "4":
                    value = "3";
                    break;
                case "5":
                    value = "4";
                    break;
                case "6":
                    value = "5";
                    break;
                case "7":
                    value = "6";
                    break;
                case "8":
                    value = "7";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string FEDUC_Rule(string value)
        {
            /*Map number to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            1 -> 0 = 8th Grade or Less
            2  -> 1 = 9th-12th Grade; No Diploma
            3  -> 2 = High School Grad or GED Completed 
            4  -> 3 = Some college, but no degree
            5  -> 4 = Associate Degree
            6  -> 5 = Bachelor's Degree
            7  -> 6 = Master's Degree
            8  -> 7 = Doctorate or Professional Degree
            9  -> 7777 = Unknown*/


            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "2";
                    break;
                case "4":
                    value = "3";
                    break;
                case "5":
                    value = "4";
                    break;
                case "6":
                    value = "5";
                    break;
                case "7":
                    value = "6";
                    break;
                case "8":
                    value = "7";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string ATTEND_Rule(string value)
        {
            /*Map number to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            1 -> 0 = MD
            2 -> 1 = DO
            3 -> 2 = CNM/CM
            4 -> 3 = Other Midwife
            5 -> 4 = Other 
            9 -> 7777 = Unknown*/


            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "2";
                    break;
                case "4":
                    value = "3";
                    break;
                case "5":
                    value = "4";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string TRAN_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 =Yes
            N  -> 0 = No
            U  ->  7777 = Unknown
            */


            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string NPREV_Rule(string value)
        {
            /*If value is in 00-98, transfer number verbatim to MMRIA field. 

            If value = 99, map to 9999 (blank)*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string HFT_Rule(string value)
        {
            /*If value is in 1-8, transfer number verbatim to MMRIA field. 

            If value = 9, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "9")
                value = "";

            return value;
        }

        private string HIN_Rule(string value)
        {
            /*If value is in 00-11, transfer number verbatim to MMRIA field. 

            If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "99")
                value = "";

            return value;
        }

        private string PWGT_Rule(string value)
        {
            /*If value is in 050-400, transfer number verbatim to MMRIA field.

            If value = 999, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "999")
                value = "";

            return value;
        }

        private string DWGT_Rule(string value)
        {
            /*If value is in 050-450, transfer number verbatim to MMRIA field.  

            If value = 999, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "999")
                value = "";

            return value;
        }

        private string WIC_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 =Yes
            N  -> 0 = No
            U  ->  7777 = Unknown
            */
            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string PLBL_Rule(string value)
        {
            /*If value is in 00-30, transfer number verbatim to MMRIA field.  

            If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "99")
                value = "";

            return value;
        }

        private string PLBD_Rule(string value)
        {
            /*If value is in 00-30, transfer number verbatim to MMRIA field.  

            If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "99")
                value = "";

            return value;
        }

        private string POPO_Rule(string value)
        {
            /*If value is in 00-30, transfer number verbatim to MMRIA field.

            If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "99")
                value = "";

            return value;
        }

        private string MLLB_Rule(string value)
        {
            /*If value is in 01-12, transfer number verbatim to MMRIA field.

            If value = 88 or 99, map to 9999 (blank).*/

            if (value == "88" || value == "99")
                value = "9999";

            return value;
        }

        private string YLLB_Rule(string value)
        {
            /*If value is not 8888 or 9999, transfer number verbatim to MMRIA field.

            If value = 8888 or 9999, map to 9999 (blank).*/

            if (value == "8888" || value == "9999")
                value = "9999";

            return value;
        }

        private string MOPO_Rule(string value)
        {
            /*If value is in 01-12, transfer number verbatim to MMRIA field.

            If value = 88 or 99, map to 9999 (blank).*/

            if (value == "88" || value == "99")
                value = "9999";

            return value;
        }

        private string YOPO_Rule(string value)
        {
            /*If value is not 8888 or 9999, transfer number verbatim to MMRIA field.  

            If value = 8888 or 9999, map to 9999 (blank).*/

            if (value == "8888" || value == "9999")
                value = "9999";

            return value;
        }

        private string PAY_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            1 -> 1 = Medicaid
            2 -> 0 = Private Insurance
            3 -> 2 = Self-pay                                       
            4 -> 4=Indian Health Service                     
            5 -> 5=CHAMPUS/TRICARE                               
            6 -> 6 = Other Government (Fed, State, Local)
            8 -> 3 = Other                                          
            9 -> 7777=Unknown*/
            switch (value?.ToUpper())
            {
                case "1":
                    value = "1";
                    break;
                case "2":
                    value = "0";
                    break;
                case "3":
                    value = "2";
                    break;
                case "4":
                    value = "4";
                    break;
                case "5":
                    value = "5";
                    break;
                case "6":
                    value = "6";
                    break;
                case "8":
                    value = "3";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string DLMP_YR_Rule(string value)
        {
            /*If value is not 9999, transfer number verbatim to MMRIA field.

            If value = 9999, map to 9999 (blank).*/

            if (value == "9999")
                value = "9999";

            return value;
        }

        private string DLMP_MO_Rule(string value)
        {
            /*If value is in 01-12, transfer number verbatim to MMRIA field.

            If value = 99, map to 9999 (blank).*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string DLMP_DY_Rule(string value)
        {
            /*If value is in 01-31, transfer number verbatim to MMRIA field.

            If value = 99, map to 9999 (blank).*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string NPCES_Rule(string value)
        {
            /*If value is in 00-30, transfer number verbatim to MMRIA field.  

            If value = 99, leave the value empty/blank.*/

            if (value == "99")
                value = "";

            return value;
        }

        private string ATTF_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 =Yes
            N  -> 0 = No
            U  ->  7777 = Unknown
            */

            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string ATTV_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 =Yes
            N  -> 0 = No
            U  -> 7777 = Unknown
            */

            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string PRES_Rule(string value)
        {
            /*Map number to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            1 -> 0 = Cephalic
            2 -> 1 = Breech
            3 -> 4 = Other
            9 -> 7777 = Unknown*/


            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "4";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string ROUT_Rule(string value)
        {
            /*Map number to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            1 -> 0 = Vaginal/Spontaneous
            2 -> 1 = Vaginal/Forceps
            3  -> 2 = Vaginal/Vacuum
            4  -> 3 = Cesarean
            9  -> 7777 = Unknown*/


            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "2";
                    break;
                case "4":
                    value = "3";
                    break;
                case "9":
                    value = "7";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string OWGEST_Rule(string value)
        {
            /*If value is in 00-98, transfer number verbatim to MMRIA field.

            If value = 99, leave the value empty/blank. */

            if (value == "99")
                value = "";

            return value;
        }

        private string APGAR5_Rule(string value)
        {
            /*If value is in 00-10, transfer number verbatim to MMRIA field.  

            If value = 99, leave the value empty/blank. */

            if (value == "99")
                value = "";

            return value;
        }

        private string APGAR10_Rule(string value)
        {
            /*If value is in 00-10, transfer number verbatim to MMRIA field.  

            If value = 88 or 99, leave the value empty/blank. */

            if (value == "88" || value == "99")
                value = "";

            return value;
        }

        private string SORD_Rule(string value)
        {
            /*If value is in 01-12, transfer number verbatim to MMRIA field.  

            If value = 99, leave the MMRIA value empty/blank.*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string ITRAN_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 Yes
            N  -> 0 No
            U  -> 7777 = Unknown
            */


            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string ILIV_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 = Yes
            N  -> 0 = No
            U  -> 2 = Infant transferred, status unknown
            */


            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "2";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string BFED_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 Yes
            N  -> 0 No
            U  -> 7777 = Unknown
            */


            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        #endregion

        #region FET Rules

        private string FET_LOCATION_OF_RESIDENCE_street_Rule(string stnum_r, string predir_r, string stname_r, string stdesig_r, string postdir_r)
        {
            //Map to MMRIA field via Merge with other place of death street fields(STNUM_D, PREDIR_D, STNAME_D, STDESIG_D, POSTDIR_D) 1 of 5
            string determinedValue = $"{stnum_r} {predir_r} {stname_r} {stdesig_r} {postdir_r}";

            return determinedValue;
        }

        private string FET_DATE_OF_DELIVERY_Rule(string year, string month, string day)
        {
            //2.Merge 3 fields(IDOB_MO, IDOB_DY, IDOB_YR) map resulting date to MMRIA field -date_of _delivery(bcifsri_do_deliv)."
            string determinedValue = $"{year}-{month}-{day}";

            return determinedValue;
        }


        private string MDOB_YR_FET_Rule(string value)
        {
            /*If value is not 9999, transfer number verbatim to MMRIA field.

            If value = 9999, map to 9999 (blank).*/
            if (value == "9999")
                value = "9999";

            return value;
        }

        private string MDOB_MO_FET_Rule(string value)
        {
            /*If value is in 01-12, transfer number verbatim to MMRIA field.  

            If value = 99, map to 9999 (blank). */

            if (value == "99")
                value = "9999";

            return value;
        }

        private string MDOB_DY_FET_Rule(string value)
        {
            /*If value is in 01-31, transfer number verbatim to MMRIA field.  
             * If value = 99, map to 9999 (blank).*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string FDOB_YR_FET_Rule(string value)
        {
            /*If value is not 9999, transfer number verbatim to MMRIA field.

            If value = 9999, map to 9999 (blank).*/

            if (value == "9999")
                value = "9999";

            return value;
        }

        private string FDOB_MO_FET_Rule(string value)
        {
            /*If value is in 01-12, transfer number verbatim to MMRIA field.

            If value = 99, map to 9999 (blank).*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string MARN_FET_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 =Yes
            N  -> 0 = No
            U  ->  7777 = Unknown
            */
            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }
            return value;
        }

        private string MEDUC_FET_Rule(string value)
        {
            /*Map number to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            1 -> 0 = 8th Grade or Less
            2  -> 1 = 9th-12th Grade; No Diploma
            3  -> 2 = High School Grad or GED Completed 
            4  -> 3 = Some college, but no degree
            5  -> 4 = Associate Degree
            6  -> 5 = Bachelor's Degree
            7  -> 6 = Master's Degree
            8  -> 7 = Doctorate or Professional Degree
            9  -> 7777 = Unknown*/

            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "2";
                    break;
                case "4":
                    value = "3";
                    break;
                case "5":
                    value = "4";
                    break;
                case "6":
                    value = "5";
                    break;
                case "7":
                    value = "6";
                    break;
                case "8":
                    value = "7";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }
            return value;
        }

        private string ATTEND_FET_Rule(string value)
        {
            /*Map number to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            1 -> 0 = MD
            2 -> 1 = DO
            3 -> 2 = CNM/CM
            4 -> 3 = Other Midwife
            5 -> 4 = Other 
            9 -> 7777 = Unknown*/

            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "2";
                    break;
                case "4":
                    value = "3";
                    break;
                case "5":
                    value = "4";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string TRAN_FET_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 =Yes
            N  -> 0 = No
            U  ->  7777 = Unknown
            */
            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }
            return value;
        }

        private string NPREV_FET_Rule(string value)
        {
            /*If value is in 00-98, transfer number verbatim to MMRIA field. 

            If value = 99, map to 9999 (blank)*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string HFT_FET_Rule(string value)
        {
            /*If value is in 1-8, transfer number verbatim to MMRIA field. 

            If value = 9, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "9")
                value = "";

            return value;
        }

        private string HIN_FET_Rule(string value)
        {
            /*If value is in 00-11, transfer number verbatim to MMRIA field. 

            If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "99")
                value = "";

            return value;
        }

        private string PWGT_FET_Rule(string value)
        {
            /*If value is in 050-400, transfer number verbatim to MMRIA field.

            If value = 999, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "99")
                value = "";

            return value;
        }

        private string DWGT_FET_Rule(string value)
        {
            /*If value is in 050-450, transfer number verbatim to MMRIA field.  

            If value = 999, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "99")
                value = "";

            return value;
        }

        private string WIC_FET_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 =Yes
            N  -> 0 = No
            U  ->  7777 = Unknown
            */
            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }
            return value;
        }

        private string PLBL_FET_Rule(string value)
        {
            /*If value is in 00-30, transfer number verbatim to MMRIA field.  

            If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "99")
                value = "";

            return value;
        }

        private string PLBD_FET_Rule(string value)
        {
            /*If value is in 00-30, transfer number verbatim to MMRIA field.  

            If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string POPO_FET_Rule(string value)
        {
            /*If value is in 00-30, transfer number verbatim to MMRIA field.

            If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string MLLB_FET_Rule(string value)
        {
            /*If value is in 01-12, transfer number verbatim to MMRIA field.

            If value = 88 or 99, map to 9999 (blank).*/

            if (value == "88" || value == "99")
                value = "9999";

            return value;
        }

        private string YLLB_FET_Rule(string value)
        {
            /*If value is not 8888 or 9999, transfer number verbatim to MMRIA field.

            If value = 8888 or 9999, map to 9999 (blank).*/

            if (value == "8888" || value == "9999")
                value = "9999";

            return value;
        }

        private string MOPO_FET_Rule(string value)
        {
            /*If value is in 01-12, transfer number verbatim to MMRIA field.

            If value = 88 or 99, map to 9999 (blank).*/

            if (value == "88" || value == "99")
                value = "9999";

            return value;
        }

        private string YOPO_FET_Rule(string value)
        {
            /*If value is not 8888 or 9999, transfer number verbatim to MMRIA field.  

            If value = 8888 or 9999, map to 9999 (blank).*/

            if (value == "8888" || value == "9999")
                value = "9999";

            return value;
        }

        private string DLMP_YR_FET_Rule(string value)
        {
            /*If value is not 9999, transfer number verbatim to MMRIA field.

            If value = 9999, map to 9999 (blank).*/

            if (value == "9999")
                value = "9999";

            return value;
        }

        private string DLMP_MO_FET_Rule(string value)
        {
            /*If value is in 01-12, transfer number verbatim to MMRIA field.

            If value = 99, map to 9999 (blank).*/
            if (value == "99")
                value = "9999";

            return value;
        }

        private string DLMP_DY_FET_Rule(string value)
        {
            /*If value is in 01-31, transfer number verbatim to MMRIA field.

            If value = 99, map to 9999 (blank).*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string NPCES_FET_Rule(string value)
        {
            /*Transfer number verbatim to MMRIA field.  Map 99 to 9999 (blank)*/

            if (value == "99")
                value = "9999";

            return value;
        }

        private string ATTF_FET_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 =Yes
            N  -> 0 = No
            U  ->  7777 = Unknown
            */
            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }
            return value;
        }

        private string ATTV_FET_Rule(string value)
        {
            /*Map character to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            Y  -> 1 =Yes
            N  -> 0 = No
            U  -> 7777 = Unknown
            */
            switch (value?.ToUpper())
            {
                case "Y":
                    value = "1";
                    break;
                case "N":
                    value = "0";
                    break;
                case "U":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }
            return value;
        }

        private string PRES_FET_Rule(string value)
        {
            /*Map number to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            1 -> 0 = Cephalic
            2 -> 1 = Breech
            3 -> 4 = Other
            9 -> 7777 = Unknown*/

            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "4";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string ROUT_FET_Rule(string value)
        {
            /*Map number to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            1 -> 0 = Vaginal/Spontaneous
            2 -> 1 = Vaginal/Forceps
            3  -> 2 = Vaginal/Vacuum
            4  -> 3 = Cesarean
            9  -> 7777 = Unknown*/

            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "2";
                    break;
                case "4":
                    value = "3";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }

            return value;
        }

        private string OWGEST_FET_Rule(string value)
        {
            /*If value is in 00-98, transfer number verbatim to MMRIA field.

            If value = 99, leave the value empty/blank. */

            if (value == "99")
                value = "";

            return value;
        }

        private string SORD_FET_Rule(string value)
        {
            /*If value is in 01-12, transfer number verbatim to MMRIA field.  

            If value = 99, leave the MMRIA value empty/blank.*/

            if (value == "99")
                value = "9999";

            return value;
        }


        private string FEDUC_FET_Rule(string value)
        {
            /*Map number to MMRIA code values as follows:
            Blank fields -> 9999 (blank)
            1 -> 0 = 8th Grade or Less
            2  -> 1 = 9th-12th Grade; No Diploma
            3  -> 2 = High School Grad or GED Completed 
            4  -> 3 = Some college, but no degree
            5  -> 4 = Associate Degree
            6  -> 5 = Bachelor's Degree
            7  -> 6 = Master's Degree
            8  -> 7 = Doctorate or Professional Degree
            9  -> 7777 = Unknown*/

            switch (value?.ToUpper())
            {
                case "1":
                    value = "0";
                    break;
                case "2":
                    value = "1";
                    break;
                case "3":
                    value = "2";
                    break;
                case "4":
                    value = "3";
                    break;
                case "5":
                    value = "4";
                    break;
                case "6":
                    value = "5";
                    break;
                case "7":
                    value = "6";
                    break;
                case "8":
                    value = "7";
                    break;
                case "9":
                    value = "7777";
                    break;
                default:
                    value = "9999";
                    break;
            }
            return value;
        }


        #endregion

        #endregion

        private mmria.common.model.couchdb.case_view_response GetCaseView
        (

            string config_couchdb_url,
            string db_prefix,
            string search_key,
            int skip = 0,
            int take = int.MaxValue,
            string sort = "by_last_name",
            bool descending = false,
            string case_status = "all"
        )
        {
            string sort_view = sort.ToLower();
            switch (sort_view)
            {
                case "by_date_created":
                case "by_date_last_updated":
                case "by_last_name":
                case "by_first_name":
                case "by_middle_name":
                case "by_year_of_death":
                case "by_month_of_death":
                case "by_committee_review_date":
                case "by_created_by":
                case "by_last_updated_by":
                case "by_state_of_death":
                case "by_date_last_checked_out":
                case "by_last_checked_out_by":

                case "by_case_status":
                    break;

                default:
                    sort_view = "by_date_created";
                    break;
            }



            try
            {
                System.Text.StringBuilder request_builder = new System.Text.StringBuilder();
                request_builder.Append($"{config_couchdb_url}/{db_prefix}mmrds/_design/sortable/_view/{sort_view}?");

                if (skip > -1)
                {
                    request_builder.Append($"skip={skip}");
                }
                else
                {

                    request_builder.Append("skip=0");
                }

                if (take > -1)
                {
                    request_builder.Append($"&limit={take}");
                }

                if (descending)
                {
                    request_builder.Append("&descending=true");
                }


                string request_string = request_builder.ToString();
                var case_view_curl = new mmria.server.cURL("GET", null, request_string, null, mmria.services.vitalsimport.Program.timer_user_name, mmria.services.vitalsimport.Program.timer_value);
                string responseFromServer = case_view_curl.execute();

                mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);


                string key_compare = search_key.ToLower().Trim(new char[] { '"' });

                mmria.common.model.couchdb.case_view_response result = new mmria.common.model.couchdb.case_view_response();
                result.offset = case_view_response.offset;
                result.total_rows = case_view_response.total_rows;

                foreach (mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
                {
                    bool add_item = false;

                    if (is_matching_search_text(cvi.value.last_name, key_compare))
                    {
                        add_item = true;
                    }

                    if (add_item)
                    {
                        result.rows.Add(cvi);
                    }

                }


                result.total_rows = result.rows.Count;
                result.rows = result.rows.Skip(skip).Take(take).ToList();

                return result;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);

            }


            return null;
        }

        public System.Dynamic.ExpandoObject GetCaseById(mmria.common.couchdb.DBConfigurationDetail db_info, string case_id)
        {
            try
            {
                string request_string = $"{db_info.url}/{db_info.prefix}mmrds/_all_docs?include_docs=true";

                if (!string.IsNullOrWhiteSpace(case_id))
                {
                    request_string = $"{db_info.url}/{db_info.prefix}mmrds/{case_id}";
                    var case_curl = new mmria.server.cURL("GET", null, request_string, null, db_info.user_name, db_info.user_value);
                    string responseFromServer = case_curl.execute();

                    var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(responseFromServer);

                    return result;

                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return null;
        }

        private bool is_matching_search_text(string p_val1, string p_val2)
        {
            var result = false;

            if
            (
                !string.IsNullOrWhiteSpace(p_val1) &&
                p_val1.Length > 3 &&
                (
                    p_val2.IndexOf(p_val1, StringComparison.OrdinalIgnoreCase) > -1 ||
                    p_val1.IndexOf(p_val2, StringComparison.OrdinalIgnoreCase) > -1
                )
            )
            {
                result = true;
            }

            return result;
        }

        public HashSet<string> GetExistingRecordIds()
        {
            var result = new HashSet<string>(StringComparer.OrdinalIgnoreCase);


            try
            {
                string request_string = $"{item_db_info.url}/{item_db_info.prefix}mmrds/_design/sortable/_view/by_date_created?skip=0&take=25000";

                var case_view_curl = new mmria.server.cURL("GET", null, request_string, null, config_timer_user_name, config_timer_value);
                string responseFromServer = case_view_curl.execute();

                mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

                foreach (mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
                {
                    result.Add(cvi.value.record_id);

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return result;
        }

        private int GenerateRandomFourDigits()
        {
            int _min = 1000;
            int _max = 9999;
            Random _rdm = new Random(System.DateTime.Now.Millisecond + CurrentCount);
            return _rdm.Next(_min, _max);
        }

        public class jsonDeseralizedGeocode_response : mmria.common.model.geocode_response
        {
            public jsonDeseralizedGeocode_response(IEnumerable<mmria.common.model.OutputGeocode> outputGeocodes)
            {
                OutputGeocodes = outputGeocodes?.ToArray();
            }
        }

        public class jsonObjectArrayForGeoCode
        {

        }

        // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse); 
        public class InputAddress
        {
            public string StreetAddress { get; set; }
            public string City { get; set; }
            public string State { get; set; }
            public string Zip { get; set; }
        }

        public class OutputGeocode2
        {
            public string Latitude { get; set; }
            public string Longitude { get; set; }
            public string NAACCRGISCoordinateQualityCode { get; set; }
            public string NAACCRGISCoordinateQualityType { get; set; }
            public string MatchScore { get; set; }
            public string MatchType { get; set; }
            public string FeatureMatchingResultType { get; set; }
            public string FeatureMatchingResultCount { get; set; }
            public string FeatureMatchingGeographyType { get; set; }
            public string RegionSize { get; set; }
            public string RegionSizeUnits { get; set; }
            public string MatchedLocationType { get; set; }
            public string ExceptionOccured { get; set; }
            public string Exception { get; set; }
            public string ErrorMessage { get; set; }
        }

        public class CensusValue1
        {
            public string CensusYear { get; set; }
            public string CensusTimeTaken { get; set; }
            public string NAACCRCensusTractCertaintyCode { get; set; }
            public string NAACCRCensusTractCertaintyType { get; set; }
            public string CensusBlock { get; set; }
            public string CensusBlockGroup { get; set; }
            public string CensusTract { get; set; }
            public string CensusCountyFips { get; set; }
            public string CensusStateFips { get; set; }
            public string CensusCbsaFips { get; set; }
            public string CensusCbsaMicro { get; set; }
            public string CensusMcdFips { get; set; }
            public string CensusMetDivFips { get; set; }
            public string CensusMsaFips { get; set; }
            public string CensusPlaceFips { get; set; }
            public string ExceptionOccured { get; set; }
            public string Exception { get; set; }
            public string ErrorMessage { get; set; }
        }

        public class CensusValue
        {
            public CensusValue1 CensusValue1 { get; set; }
        }

        public class OutputGeocodes
        {
            public OutputGeocode2 outputGeocode { get; set; }
            public List<CensusValue> CensusValues { get; set; }
        }

        public class Geocode_Response
        {
            public string version { get; set; }
            public string TransactionId { get; set; }
            public string Version { get; set; }
            public string QueryStatusCodeValue { get; set; }
            public string FeatureMatchingResultType { get; set; }
            public string FeatureMatchingResultCount { get; set; }
            public string TimeTaken { get; set; }
            public string ExceptionOccured { get; set; }
            public string Exception { get; set; }
            public InputAddress InputAddress { get; set; }
            public List<OutputGeocodes> OutputGeocodes { get; set; }
        }




        //public class OutputGeocode : OutputGeocodeItem
        //{
        //    public OutputGeocode() { }

        //    public string Latitude { get; set; }
        //    public string Longitude { get; set; }
        //    public string NAACCRGISCoordinateQualityCode { get; set; }
        //    public string NAACCRGISCoordinateQualityType { get; set; }
        //    public string MatchScore { get; set; }
        //    public string MatchType { get; set; }
        //    public string FeatureMatchingResultType { get; set; }
        //    public string FeatureMatchingResultCount { get; set; }
        //    public string FeatureMatchingGeographyType { get; set; }
        //    public string RegionSize { get; set; }
        //    public string RegionSizeUnits { get; set; }
        //    public string MatchedLocationType { get; set; }
        //    public string ExceptionOccured { get; set; }
        //    public string Exception { get; set; }
        //    public string ErrorMessage { get; set; }

        //}
        //public class geocode_response
        //{
        //    public geocode_response()
        //    {
        //    }

        //    //public string version { get; set; }
        //    public string TransactionId { get; set; }
        //    public string Version { get; set; }
        //    public string QueryStatusCodeValue { get; set; }
        //    public string FeatureMatchingResultType { get; set; }
        //    public string FeatureMatchingResultCount { get; set; }
        //    public string TimeTaken { get; set; }
        //    public string ExceptionOccured { get; set; }
        //    public string Exception { get; set; }
        //    public InputAddress InputAddress { get; set; }
        //    public OutputGeocodeItem[] OutputGeocodes { get; set; }

        //}
    }
}
