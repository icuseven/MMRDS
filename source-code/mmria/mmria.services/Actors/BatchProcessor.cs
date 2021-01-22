using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Text;
using Akka.Actor;

namespace RecordsProcessor_Worker.Actors
{

/*

const mor_max_length = 5000;
const nat_max_length = 4000;
const fet_max_length = 6000;


function validate_length(p_array, p_max_length)
{
    let result = true;

    for(let i = 0; i < p_array.length; i++)
    {
        let item = p_array[i];
        if(item.l != p_max_length)
        {
            result = false;
            break;
        }
    }

    return result;
}

*/

    public class BatchProcessor : ReceiveActor
    {
        string _id;
        const int mor_max_length = 5001;
        const int nat_max_length = 4001;
        const int fet_max_length = 6001;

        IConfiguration configuration;
        ILogger logger;
        protected override void PreStart() => Console.WriteLine("Process_Message started");
        protected override void PostStop() => Console.WriteLine("Process_Message stopped");

        public BatchProcessor()
        {
            Receive<mmria.common.ije.NewIJESet_Message>(message =>
            {
                Console.WriteLine("Message Recieved");
                //Console.WriteLine(JsonConvert.SerializeObject(message));
                //Sender.Tell("Message Recieved");
                Process_Message(message);
            });

            Receive<mmria.common.ije.BatchItem>(message =>
            {
                Console.WriteLine("Message Recieved");
                //Console.WriteLine(JsonConvert.SerializeObject(message));
                //Sender.Tell("Message Recieved");
                Process_Message(message);
            });
        }
        public BatchProcessor(string p_id):base()
        {
            _id = p_id;
            //IConfiguration p_configuration
            //configuration = p_configuration;
            //logger = p_logger;


          

            
        }
        private void Process_Message(mmria.common.ije.NewIJESet_Message message)
        {
            Console.WriteLine($"Processing Message : {message}");

            var mor_set = message.mor.Split("\n");

            var status_builder = new System.Text.StringBuilder();

            var mor_length_is_valid = validate_length(message.mor.Split("\n"), mor_max_length);
            var nat_length_is_valid = validate_length(message.nat.Split("\n"), nat_max_length);
            var fet_length_is_valid = validate_length(message.fet.Split("\n"), fet_max_length);

            if(!mor_length_is_valid) status_builder.AppendLine("mor length is invalid.");
            if(!nat_length_is_valid) status_builder.AppendLine("nat length is invalid.");
            if(!fet_length_is_valid) status_builder.AppendLine("fet length is invalid.");


            var ReportingState = get_state_from_file_name(message.mor_file_name);
            var ImportDate = DateTime.Now;
            var record_result = new List<mmria.common.ije.BatchItem>();


            if(status_builder.Length == 0)
            {
                foreach(var row in mor_set)
                {
                    if(row.Length == mor_max_length)
                    {
                        var batch_item = Convert(row, ImportDate, message.mor_file_name, ReportingState);

                        record_result.Add(batch_item);

                        try
                        {

                            var batch_item_processor = Context.ActorOf<RecordsProcessor_Worker.Actors.BatchItemProcessor>(batch_item.CDCUniqueID);
                            batch_item_processor.Tell(message);
                        }
                        catch(Exception ex)
                        {

                        }
                    }
                }
            }

            var batch = new mmria.common.ije.Batch()
            {
                id = message.batch_id,
                Status = mmria.common.ije.Batch.StatusEnum.InProcess,
                reporting_state = ReportingState,
                ImportDate = ImportDate,
                mor_file_name = message.mor_file_name,
                nat_file_name = message.nat_file_name,
                fet_file_name = message.fet_file_name,
                StatusInfo = status_builder.ToString(),
                record_result = record_result

            };

            mmria.services.vitalsimport.Program.BatchSet[batch.id] = batch;
        }

        private void Process_Message(mmria.common.ije.BatchItem message)
        {
            var batch = mmria.services.vitalsimport.Program.BatchSet[_id];
        }

        private bool validate_length(IList<string> p_array, int p_max_length)
        {
            var result = true;

            for(var i = 0; i < p_array.Count; i++)
            {
                var item = p_array[i];
                if(item.Length > 0 && item.Length != p_max_length)
                {
                    result = false;
                    break;
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

        private string get_state_from_file_name(string p_val)
        {
            if(p_val.Length > 15)
            {
                return p_val.Substring(11, p_val.Length - 15);
            }
            else
            {
                return p_val;
            }
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
