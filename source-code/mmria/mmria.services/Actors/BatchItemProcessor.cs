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
        static Dictionary<string,string> IJE_to_MMRIA_Path = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
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
{ "GNAME", "home_record/first_name"}

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
 result.Add("DState",row.Substring(5-1, 2).Trim());
 result.Add("DOD_YR",row.Substring(1-1, 4).Trim());
  result.Add("DOD_MO",row.Substring(237-1, 2).Trim());
 result.Add("DOD_DY",row.Substring(239-1, 2).Trim());
  result.Add("DOB_YR",row.Substring(205-1, 4).Trim());
  result.Add("DOB_MO",row.Substring(209-1, 2).Trim());
 result.Add("DOB_DY",row.Substring(211-1, 2).Trim());
 result.Add("LNAME",row.Substring(78-1, 50).Trim());
 result.Add("GNAME",row.Substring(27-1, 50).Trim());
  result.Add("SSN",row.Substring(191-1, 9).Trim());

            return result;

            /*
            2 home_record/state of death - DState
3 home_recode/date_of_death - DOD_YR, DOD_MO, DOD_DY
4 death_certificate/date_of_birth - DOB_YR, DOB_MO, DOD_DY
5 home_record/last_name - LNAME  
6 home_record/first_name - GNAME*/
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
