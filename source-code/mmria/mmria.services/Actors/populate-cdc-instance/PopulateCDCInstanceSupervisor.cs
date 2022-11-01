using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Linq;
using System.Text;
using Akka.Actor;
using mmria.common.ije;

namespace mmria.services.populate_cdc_instance;

public sealed class PopulateCDCInstanceSupervisor : ReceiveActor
{

    string transfer_result = "";
    int transfer_status_number = 0;
    DateTime? date_submitted = DateTime.Now;
    DateTime? date_completed;
    int duration_in_hours = 0;
    int duration_in_minutes = 0;
      
    Dictionary<string, mmria.common.ije.Batch.StatusEnum> batch_id_list;
    IConfiguration configuration;
    ILogger logger;
    protected override void PreStart() => Console.WriteLine("Process_Message started");
    protected override void PostStop() => Console.WriteLine("Process_Message stopped");
    public PopulateCDCInstanceSupervisor()
    {
        //IConfiguration p_configuration
        //configuration = p_configuration;
        //logger = p_logger;
        batch_id_list = new Dictionary<string, mmria.common.ije.Batch.StatusEnum>();

        var alldocs = GetBatchSet();
        foreach(var row in alldocs.rows)
        {
            batch_id_list.Add(row.id, row.doc.Status);
        }

        Receive<DateTime>(message =>
        {
            var result = new mmria.common.metadata.Populate_CDC_Instance_Record()
            {
                transfer_result = transfer_result,
                transfer_status_number = transfer_status_number,
                date_submitted = date_submitted,
                date_completed = date_completed,
                duration_in_hours = duration_in_hours,
                duration_in_minutes = duration_in_minutes
            };
            Sender.Tell(result);
        });

        Receive<mmria.common.ije.BatchStatusMessage>(message =>
        {
            batch_id_list[message.id] = message.status;
            
        });


        Receive<mmria.common.ije.BatchRemoveDataMessage>(message =>
        {
            if(batch_id_list.ContainsKey(message.id))
            {
                if
                (
                    batch_id_list[message.id] == mmria.common.ije.Batch.StatusEnum.Finished ||
                    batch_id_list[message.id] == mmria.common.ije.Batch.StatusEnum.BatchRejected
                )
                {
                    var batch_processor = Context.ActorOf<RecordsProcessor_Worker.Actors.BatchProcessor>(message.id);
                    batch_processor.Tell(message);
                }
            }
            
        });


        
    }

    private mmria.common.model.couchdb.alldocs_response<mmria.common.ije.Batch> GetBatchSet()
    {
        var result = new mmria.common.model.couchdb.alldocs_response<mmria.common.ije.Batch>();

        string url = $"{mmria.services.vitalsimport.Program.couchdb_url}/vital_import/_all_docs?include_docs=true";
        var document_curl = new mmria.getset.cURL ("GET", null, url, null, mmria.services.vitalsimport.Program.timer_user_name, mmria.services.vitalsimport.Program.timer_value);
        try
        {
            var responseFromServer = document_curl.execute();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.alldocs_response<mmria.common.ije.Batch>>(responseFromServer);
            
        }
        catch(Exception ex)
        {
            //Console.Write("auth_session_token: {0}", auth_session_token);
            Console.WriteLine(ex);
        }

        return result;
    }



}
