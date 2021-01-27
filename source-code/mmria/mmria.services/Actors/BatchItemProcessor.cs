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
        static Dictionary<string, string> IJE_to_MMRIA_Path = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "DState","home_record/state" }, 
                //3 home_recode/date_of_death - DOD_YR, DOD_MO, DOD_DY
                { "DOD_YR", "home_recode/date_of_death/year"},
                { "DOD_MO", "home_recode/date_of_death/month"},
                { "DOD_DY", "home_recode/date_of_death/day"},

                //4 death_certificate/date_of_birth - DOB_YR, DOB_MO, DOD_DY
                { "DOB_YR", "death_certificate/date_of_birth/year"},
                { "DOB_MO", "death_certificate/date_of_birth/month"},
                { "DOB_DY", "death_certificate/date_of_birth/day"},
                //5 home_record/last_name - LNAME  
                { "LNAME", "home_record/last_name"}, 
                //6 home_record/first_name - GNAME*/}
                { "GNAME", "home_record/first_name" },

                //Rest of Mor mappings
                //{"DOD_YR","home_record/date_of_death/Year"},
                //{"DSTATE","/home_record/state_of_death_record"},
                {"FILENO","death_certificate/certificate_identification/state_file_number"},
                {"AUXNO","death_certificate/certificate_identification/local_file_number"},
                //{"GNAME","home_record/first_name"},
                //{"LNAME","home_record/last_name"},
                {"AGE ","death_certificate/demographics/age"},
                //{"DOB_YR","death_certificate/demographics/date_of_birth/year"},
                //{"DOB_MO","death_certificate/demographics/date_of_birth/month"},
                //{"DOB_DY","death_certificate/demographics/date_of_birth/day"},
                {"BPLACE_CNT","death_certificate/demographics/country_of_birth"},
                {"BPLACE_ST","death_certificate/demographics/state_of_birth"},
                {"STATEC","death_certificate/place_of_last_residence/state"},
                {"COUNTRYC","death_certificate/place_of_last_residence/country_of_last_residence"},
                {"MARITAL","death_certificate/demographics/marital_status"},
                {"DPLACE","death_certificate/death_information/death_occured_in_hospital"},
                {"DOD_MO","home_record/date_of_death/month"},
                {"DOD_DY","home_record/date_of_death/day"},
                { "TOD","death_certificate/certificate_identification/time_of_death"},
                { "DEDUC","death_certificate/demographics/education_level"},
                { "DETHNIC1","/death_certificate/demographics/is_of_hispanic_origin"},
                { "DETHNIC2","/death_certificate/demographics/is_of_hispanic_origin"},
                { "DETHNIC3","/death_certificate/demographics/is_of_hispanic_origin"},
                { "DETHNIC4","/death_certificate/demographics/is_of_hispanic_origin"},

                //TODO: James I need the new MMRIA fields for these
                { "DETHNIC5","Map to new MMRIA field for Other Hispanic, Specify. Add MMRIA path when available"},

                { "RACE1","death_certificate/race/race "},
                { "RACE2","death_certificate/race/race"},
                { "RACE3","death_certificate/race/race"},
                { "RACE4","death_certificate/race/race"},
                { "RACE5","death_certificate/race/race"},
                { "RACE6","death_certificate/race/race"},
                { "RACE7","death_certificate/race/race"},
                { "RACE8","death_certificate/race/race"},
                { "RACE9","death_certificate/race/race"},
                { "RACE10","death_certificate/race/race"},
                { "RACE11","death_certificate/race/race"},
                { "RACE12","death_certificate/race/race"},
                { "RACE13","death_certificate/race/race"},
                { "RACE14","death_certificate/race/race"},
                { "RACE15","death_certificate/race/race"},

                { "RACE16","/death_certificate/race/principle_tribe"},
                { "RACE17","/death_certificate/race/principle_tribe"},

                { "RACE18","/death_certificate/race/other_asian"},
                { "RACE19","/death_certificate/race/other_asian"},

                { "RACE20","/death_certificate/race/other_pacific_islander"},
                { "RACE21","/death_certificate/race/other_pacific_islander"},

                { "RACE22","/death_certificate/race/other_race"},
                { "RACE23","/death_certificate/race/other_race"},

                {"OCCUP","/death_certificate/demographics/primary_occupation"},
                {"INDUST","/death_certificate/demographics/occupation_business_industry"},
                { "MANNER","death_certificate/death_information/manner_of_death"},

                //TODO: James I need the new MMRIA fields for these
                { "MAN_UC","Map to new MMRIA read-only field for Manual Underlying Cause Add MMRIA path when available"},
                { "ACME_UC","Map to new MMRIA read-only field for ACME Underlying Cause. Add MMRIA path when available"},
                { "EAC","Map to new MMRIA read-only field for Entity - axis Codes. Add MMRIA path when available"},
                { "RAC","Map to new MMRIA read-only field for  - axis Codes Add MMRIA path when available"},

                { "AUTOP","death_certificate/death_information/was_autopsy_performed"},
                { "AUTOPF","/death_certificate/death_information/was_autopsy_used_for_death_coding"},
                { "TOBAC","death_certificate/death_information/did_tobacco_contribute_to_death"},
                { "PREG","death_certificate/death_information/pregnancy_status"},
                { "DOI_MO","death_certificate/injury_associated_information/date_of_injury/month"},
                { "DOI_DY","death_certificate/injury_associated_information/date_of_injury/day"},
                { "DOI_YR","death_certificate/injury_associated_information/date_of_injury/year"},
                { "TOI_HR","death_certificate/injury_associated_information/time_of_injury"},
                { "WORKINJ","death_certificate/injury_associated_information/was_injury_at_work"},
                //I think its safe to delete this one
                { "BLANK",""},

                { "ARMEDF","death_certificate/demographics/ever_in_us_armed_forces"},
                { "DINSTI","death_certificate/address_of_death/place_of_death"},
                { "STNUM_D","death_certificate/address_of_death/street"},
                { "PREDIR_D","death_certificate/address_of_death/street"},
                { "STNAME_D","death_certificate/address_of_death/street"},
                { "STDESIG_D","death_certificate/address_of_death/street"},
                {"POSTDIR_D","death_certificate/address_of_death/street"},
                { "CITYTEXT_D","death_certificate/address_of_death/city"},
                { "STATETEXT_D","death_certificate/address_of_death/state"},
                { "ZIP9_D","death_certificate/address_of_death/zip_code"},
                { "COUNTYTEXT_D","death_certificate/address_of_death/county"},
                { "STNUM_R","death_certificate/place_of_last_residence/street"},
                { "PREDIR_R","death_certificate/place_of_last_residence/street"},
                { "STNAME_R","death_certificate/place_of_last_residence/street"},
                { "STDESIG_R","death_certificate/place_of_last_residence/street"},
                { "POSTDIR_R","death_certificate/place_of_last_residence/street"},
                { "UNITNUM_R","death_certificate/place_of_last_residence/apartment"},
                { "CITYTEXT_R","death_certificate/place_of_last_residence/city"},
                { "ZIP9_R","death_certificate/place_of_last_residence/zip_code"},
                { "COUNTYTEXT_R","death_certificate/place_of_last_residence/county"},
                { "DMIDDLE","home_record/middle_name"},
                { "POILITRL","death_certificate/injury_associated_information/place_of_injury"},
                {"TRANSPRT","death_certificate/injury_associated_information/transportation_related_injury"},
                { "COUNTYTEXT_I","death_certificate/address_of_injury/county"},
                { "CITYTEXT_I","death_certificate/address_of_injury/city"},

                //TODO: James I need the new MMRIA fields for these
                { "COD1A","New MMRIA fields; add paths when available"},
                { "INTERVAL1A","New MMRIA fields; add paths when available"},
                { "COD1B","New MMRIA fields; add paths when available"},
                { "INTERVAL1B","New MMRIA fields; add paths when available"},
                { "COD1C","New MMRIA fields; add paths when available"},
                { "INTERVAL1C","New MMRIA fields; add paths when available"},
                { "COD1D","New MMRIA fields; add paths when available"},
                { "INTERVAL1D","New MMRIA fields; add paths when available"},
                { "OTHERCONDITION","New MMRIA fields; add paths when available"},

                { "DBPLACECITY","death_certificate/demographics/city_of_birth"},
                { "STINJURY","death_certificate/address_of_injury/state"},

                { "VRO_STATUS","TBD"},
                { "BC_DET_MATCH","TBD"},
                { "FDC_DET_MATCH","TBD"},
                { "BC_PROB_MATCH","TBD"},
                { "FDC_PROB_MATCH","TBD"},
                { "ICD10_MATCH","TBD"},
                { "PREGCB_MATCH","TBD"},
                { "LITERALCOD_MATCH","TBD"},


        };
        protected override void PreStart() => Console.WriteLine("Process_Message started");
        protected override void PostStop() => Console.WriteLine("Process_Message stopped");
            private string config_timer_user_name = null;
            private string config_timer_value = null;

            private string config_couchdb_url = null;
            private string db_prefix = "";

            private System.Dynamic.ExpandoObject case_expando_object = null;


        public BatchItemProcessor()
        {
            Receive<mmria.common.ije.StartBatchItemMessage>(message =>
            {
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
            
            var mor_field_set = mor_get_header(message.mor);


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

            var lookup = get_look_up(metadata);

            var is_case_already_present = false;            

            var case_view_response = GetCaseView(config_couchdb_url, db_prefix, mor_field_set["LNAME"]);
            string mmria_id = null;

            var gs = new migrate.C_Get_Set_Value(new System.Text.StringBuilder());


            if(case_view_response.total_rows > 0)
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


                
                foreach(var kvp in case_view_response.rows)
                {
                    

                    if
                    (
                        kvp.value.host_state.Equals(message.host_state, StringComparison.OrdinalIgnoreCase)  &&
                        kvp.value.last_name.Equals(mor_field_set["LNAME"], StringComparison.OrdinalIgnoreCase)  &&
                        kvp.value.first_name.Equals(mor_field_set["GNAME"], StringComparison.OrdinalIgnoreCase) &&
                        kvp.value.date_of_death_year == dod_yr &&
                        kvp.value.date_of_death_month == dod_mo
                        
                    )
                    {
                        var case_expando_object = GetCaseById(kvp.key);
                        if(case_expando_object != null)
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
                                    host_state_result.result.Equals(message.host_state, StringComparison.OrdinalIgnoreCase)  &&
                                    LNAME_result.result.Equals(mor_field_set["LNAME"], StringComparison.OrdinalIgnoreCase)  &&
                                    GNAME_result.result.Equals(mor_field_set["GNAME"], StringComparison.OrdinalIgnoreCase) &&
                                    DOD_YR_result.result == dod_yr &&
                                    DOD_MO_result.result == dod_mo &&
                                    DOD_DY_result.result == dod_dy &&
                                    DOB_YR_result.result == dob_yr &&
                                    DOB_MO_result.result == dob_mo &&
                                    DOB_DY_result.result == dob_dy
                                    
                                )
                                {
                                        is_case_already_present = true;
                                        break;
                                }
                            }

                        }
                    }
                }
                
            }


            if(is_case_already_present)
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

                gs.set_value("_id", mmria_id, new_case); 
                gs.set_value("date_created", current_date_iso_string, new_case); 
                gs.set_value("created_by", "vitals-import", new_case); 
                gs.set_value("date_last_updated", current_date_iso_string, new_case); 
                gs.set_value("last_updated_by", "vitals-import", new_case); 
                gs.set_value("version", metadata.version, new_case); 
                gs.set_value("host_state", message.host_state, new_case); 

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
                gs.set_value(IJE_to_MMRIA_Path["DPLACE"], mor_field_set["DPLACE"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["TOD"], mor_field_set["TOD"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["DEDUC"], mor_field_set["DEDUC"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["DETHNIC1"], mor_field_set["DETHNIC1"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["DETHNIC2"], mor_field_set["DETHNIC2"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["DETHNIC3"], mor_field_set["DETHNIC3"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["DETHNIC4"], mor_field_set["DETHNIC4"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["DETHNIC5"], mor_field_set["DETHNIC5"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["RACE1"], mor_field_set["RACE1"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE2"], mor_field_set["RACE2"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE3"], mor_field_set["RACE3"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE4"], mor_field_set["RACE4"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE5"], mor_field_set["RACE5"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE6"], mor_field_set["RACE6"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE7"], mor_field_set["RACE7"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE8"], mor_field_set["RACE8"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE9"], mor_field_set["RACE9"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE10"], mor_field_set["RACE10"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE11"], mor_field_set["RACE11"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE12"], mor_field_set["RACE12"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE13"], mor_field_set["RACE13"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE14"], mor_field_set["RACE14"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE15"], mor_field_set["RACE15"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE16"], mor_field_set["RACE16"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE17"], mor_field_set["RACE17"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE18"], mor_field_set["RACE18"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE19"], mor_field_set["RACE19"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE20"], mor_field_set["RACE20"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE21"], mor_field_set["RACE21"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE22"], mor_field_set["RACE22"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["RACE23"], mor_field_set["RACE23"], new_case);

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
                gs.set_value(IJE_to_MMRIA_Path["BLANK"], mor_field_set["BLANK"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["ARMEDF"], mor_field_set["ARMEDF"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["DINSTI"], mor_field_set["DINSTI"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["STNUM_D"], mor_field_set["STNUM_D"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["PREDIR_D"], mor_field_set["PREDIR_D"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["STNAME_D"], mor_field_set["STNAME_D"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["STDESIG_D"], mor_field_set["STDESIG_D"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["POSTDIR_D"], mor_field_set["POSTDIR_D"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["CITYTEXT_D"], mor_field_set["CITYTEXT_D"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["STATETEXT_D"], mor_field_set["STATETEXT_D"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["ZIP9_D"], mor_field_set["ZIP9_D"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["COUNTYTEXT_D"], mor_field_set["COUNTYTEXT_D"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["STNUM_R"], mor_field_set["STNUM_R"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["PREDIR_R"], mor_field_set["PREDIR_R"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["STNAME_R"], mor_field_set["STNAME_R"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["STDESIG_R"], mor_field_set["STDESIG_R"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["POSTDIR_R"], mor_field_set["POSTDIR_R"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["UNITNUM_R"], mor_field_set["UNITNUM_R"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["CITYTEXT_R"], mor_field_set["CITYTEXT_R"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["ZIP9_R"], mor_field_set["ZIP9_R"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["COUNTYTEXT_R"], mor_field_set["COUNTYTEXT_R"], new_case);

                gs.set_value(IJE_to_MMRIA_Path["DMIDDLE"], mor_field_set["DMIDDLE"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["POILITRL"], mor_field_set["POILITRL"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["TRANSPRT"], mor_field_set["TRANSPRT"], new_case);
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
                gs.set_value(IJE_to_MMRIA_Path["STINJURY"], mor_field_set["STINJURY"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["VRO_STATUS"], mor_field_set["VRO_STATUS"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["BC_DET_MATCH"], mor_field_set["BC_DET_MATCH"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["FDC_DET_MATCH"], mor_field_set["FDC_DET_MATCH"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["BC_PROB_MATCH"], mor_field_set["BC_PROB_MATCH"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["FDC_PROB_MATCH"], mor_field_set["FDC_PROB_MATCH"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["ICD10_MATCH"], mor_field_set["ICD10_MATCH"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["PREGCB_MATCH"], mor_field_set["PREGCB_MATCH"], new_case);
                gs.set_value(IJE_to_MMRIA_Path["LITERALCOD_MATCH"], mor_field_set["LITERALCOD_MATCH"], new_case);



                var case_dictionary = new_case as IDictionary<string,object>;

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
            
                    mmria_id = mmria_id,
                    StatusDetail = "Added new case"
                };

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
3 home_recode/date_of_death - DOD_YR, DOD_MO, DOD_DY
4 death_certificate/date_of_birth - DOB_YR, DOB_MO, DOD_BY
5 home_record/last_name - LNAME  
6 home_record/first_name - GNAME

*/


        }

        struct Result_Struct
        {
            public System.Dynamic.ExpandoObject[] docs;
        }

        struct Selector_Struc
        {
            //public System.Dynamic.ExpandoObject selector;
            public System.Collections.Generic.Dictionary<string,System.Collections.Generic.Dictionary<string,string>> selector;
            public string[] fields;

            public int limit;
        }

        private async Task<Result_Struct> get_matching_cases_for(string p_selector, string p_find_value)
        {

            Result_Struct result = new Result_Struct();

            try
            {

            	var selector_struc = new Selector_Struc();
				selector_struc.selector = new System.Collections.Generic.Dictionary<string,System.Collections.Generic.Dictionary<string,string>>(StringComparer.OrdinalIgnoreCase);
				selector_struc.limit = 10000;
				selector_struc.selector.Add(p_selector, new System.Collections.Generic.Dictionary<string,string>(StringComparer.OrdinalIgnoreCase));
				selector_struc.selector[p_selector].Add("$eq", p_find_value);

            	Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				string selector_struc_string = Newtonsoft.Json.JsonConvert.SerializeObject (selector_struc, settings);

				System.Console.WriteLine(selector_struc_string);

/*
				string find_url = $"{db_server_url}/{db_name}/_find";

				var case_curl = new mmria.server.cURL("POST", null, find_url, selector_struc_string, config_timer_user_name, config_timer_value);
				string responseFromServer = await case_curl.executeAsync();
				
				result = Newtonsoft.Json.JsonConvert.DeserializeObject<Result_Struct>(responseFromServer);
*/
				System.Console.WriteLine($"case_response.docs.length {result.docs.Length}");
            }
            catch(Exception ex)
            {

            }

            return result;
        }

        private Dictionary<string,mmria.common.metadata.value_node[]> get_look_up(mmria.common.metadata.app p_metadata)
        {
			var result = new Dictionary<string,mmria.common.metadata.value_node[]>(StringComparer.OrdinalIgnoreCase);

			foreach(var node in p_metadata.lookup)
			{
				result.Add("lookup/" + node.name, node.values);
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

         private Dictionary<string,string> mor_get_header(string row)
        {
                var result = new Dictionary<string,string>(StringComparer.OrdinalIgnoreCase);
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
            result.Add("TRANSPRT", TRANSPRT_Rule(row.Substring(2408, 30).Trim()));
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
3 home_recode/date_of_death - DOD_YR, DOD_MO, DOD_DY
4 death_certificate/date_of_birth - DOB_YR, DOB_MO, DOD_DY
5 home_record/last_name - LNAME  
6 home_record/first_name - GNAME*/
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
            string sort_view = sort.ToLower ();
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
                System.Text.StringBuilder request_builder = new System.Text.StringBuilder ();
                request_builder.Append ($"{config_couchdb_url}/{db_prefix}mmrds/_design/sortable/_view/{sort_view}?");

                if (skip > -1) 
                {
                    request_builder.Append ($"skip={skip}");
                } 
                else 
                {

                    request_builder.Append ("skip=0");
                }

                if (take > -1) 
                {
                    request_builder.Append ($"&limit={take}");
                }

                if (descending) 
                {
                    request_builder.Append ("&descending=true");
                }


                string request_string = request_builder.ToString();
                var case_view_curl = new mmria.server.cURL("GET", null, request_string, null, mmria.services.vitalsimport.Program.timer_user_name, mmria.services.vitalsimport.Program.timer_value);
                string responseFromServer = case_view_curl.execute();

                mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

                
                string key_compare = search_key.ToLower ().Trim (new char [] { '"' });

                mmria.common.model.couchdb.case_view_response result = new mmria.common.model.couchdb.case_view_response();
                result.offset = case_view_response.offset;
                result.total_rows = case_view_response.total_rows;

                foreach(mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
                {
                    bool add_item = false;

                    if(is_matching_search_text(cvi.value.last_name, key_compare))
                    {
                        add_item = true;
                    }

                    if(add_item)
                    {
                        result.rows.Add (cvi);
                    }
                
                }


                result.total_rows = result.rows.Count;
                result.rows =  result.rows.Skip (skip).Take (take).ToList ();

                return result;
                
            }
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			}


            return null;
        }

        public System.Dynamic.ExpandoObject GetCaseById(string case_id) 
		{ 
			try
			{
                string request_string = $"{config_couchdb_url}/{db_prefix}mmrds/_all_docs?include_docs=true";

                if (!string.IsNullOrWhiteSpace (case_id)) 
                {
                    request_string = $"{config_couchdb_url}/{db_prefix}mmrds/{case_id}";
					var case_curl = new mmria.server.cURL("GET", null, request_string, null, config_timer_user_name, config_timer_value);
					string responseFromServer = case_curl.execute();

					var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

					return result;

                } 

			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);
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
                    p_val2.IndexOf (p_val1, StringComparison.OrdinalIgnoreCase) > -1 ||
                    p_val1.IndexOf (p_val2, StringComparison.OrdinalIgnoreCase) > -1
                )
            )
            {
                result = true;
            }

            return result;
        }

    }
}
