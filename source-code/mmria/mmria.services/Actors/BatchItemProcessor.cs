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
        protected override void PreStart() => Console.WriteLine("Process_Message started");
        protected override void PostStop() => Console.WriteLine("Process_Message stopped");

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

            var config_timer_user_name = mmria.services.vitalsimport.Program.timer_user_name;
            var config_timer_value = mmria.services.vitalsimport.Program.timer_value;

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
 result.Add("DState",row.Substring(5-1, 2));
 result.Add("DOD_YR",row.Substring(1-1, 4));
  result.Add("DOD_MO",row.Substring(237-1, 2));
 result.Add("DOD_DY",row.Substring(239-1, 2));
  result.Add("DOB_YR",row.Substring(205-1, 4));
  result.Add("DOB_MO",row.Substring(209-1, 2));
 result.Add("DOB_DY",row.Substring(211-1, 2));
 result.Add("LNAME",row.Substring(78-1, 50));
 result.Add("GNAME",row.Substring(27-1, 50));
  result.Add("SSN",row.Substring(191-1, 9));

            return result;

            /*
            2 home_record/state of death - DState
3 home_recode/date_of_death - DOD_YR, DOD_MO, DOD_DY
4 death_certificate/date_of_birth - DOB_YR, DOB_MO, DOD_DY
5 home_record/last_name - LNAME  
6 home_record/first_name - GNAME*/
        }

    }
}
