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
    public record PopulateFinished(DateTime Date_Completed);

    string transfer_result = "";
    int transfer_status_number = 0;
    DateTime? date_submitted = DateTime.Now;
    DateTime? date_completed;
    int duration_in_hours = 0;
    int duration_in_minutes = 0;

    string error_message = "";
      
    IConfiguration configuration;
    ILogger logger;
    protected override void PreStart() => Console.WriteLine("Process_Message started");
    protected override void PostStop() => Console.WriteLine("Process_Message stopped");
    public PopulateCDCInstanceSupervisor()
    {
        Receive<DateTime>(message =>
        {
            mmria.common.metadata.Populate_CDC_Instance_Record result;
            if
            (
                transfer_status_number == 0 || 
                transfer_status_number == 1
            )
            {
                result = new mmria.common.metadata.Populate_CDC_Instance_Record()
                {
                    transfer_result = transfer_result,
                    transfer_status_number = transfer_status_number,
                    date_submitted = date_submitted,
                    date_completed = date_completed,
                    duration_in_hours = duration_in_hours,
                    duration_in_minutes = duration_in_minutes,
                    error_message = error_message
                };
            }
            else
            {
                var time_diff = DateTime.Now - date_submitted;
                var running_duration_in_hours = (int) time_diff.Value.TotalHours;
                var running_duration_in_minutes = (int) time_diff.Value.TotalMinutes % 60;
                result = new mmria.common.metadata.Populate_CDC_Instance_Record()
                {
                    transfer_result = transfer_result,
                    transfer_status_number = transfer_status_number,
                    date_submitted = date_submitted,
                    date_completed = date_completed,
                    duration_in_hours = running_duration_in_hours,
                    duration_in_minutes = running_duration_in_minutes,
                    error_message = error_message
                };
            }
            Sender.Tell(result);
        });

        Receive<mmria.common.metadata.Populate_CDC_Instance>(message =>
        {   
            transfer_status_number = 1;
            date_submitted = DateTime.Now;
            date_completed = null;
            duration_in_hours = 0;
            duration_in_minutes = 0;
            transfer_result = $"Transfer in progress (Submitted 09/28/2022 at 10:04:00). Please check again later for completion status.";
            error_message = "";

        });


        Receive<PopulateFinished>(message =>
        {
            transfer_status_number = 0;
            date_completed = DateTime.Now;
            var time_diff = date_completed - date_submitted;
            duration_in_hours = (int) time_diff.Value.TotalHours;
            duration_in_minutes = (int) time_diff.Value.TotalMinutes % 60;
            transfer_result = $"Transfer complete. Time to transfer: 2 hrs 14 min | Submitted 09/28/2022 at 10:04:00 | Completed 09/28/2022 at 12:18:00";
            error_message = "";
        });

    }
    protected override SupervisorStrategy SupervisorStrategy()
    {
        return new OneForOneStrategy
        (
            maxNrOfRetries: 0,
            withinTimeRange: TimeSpan.FromMinutes(1),
            localOnlyDecider: PopulateCDCFailed
        );
    }

    Directive PopulateCDCFailed(Exception ex)
    {
        transfer_status_number = 2;
        date_completed = DateTime.Now;
        var time_diff = date_completed - date_submitted;
        duration_in_hours = (int) time_diff.Value.TotalHours;
        duration_in_minutes = (int) time_diff.Value.TotalMinutes % 60;
        error_message = ex.Message;

        transfer_result = @$"Transfer could not be completed ( Time to transfer: 2 min | Submitted 09/28/2022 at 10:04:00| Failed 09/28/2022 at 10:06:00).

        Please contact your system administrator for assistance.Transfer complete. Time to transfer: 2 hrs 14 min | Submitted 09/28/2022 at 10:04:00 | Completed 09/28/2022 at 12:18:00";


        return Directive.Stop;
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
