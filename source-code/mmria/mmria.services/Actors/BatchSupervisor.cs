using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Text;
using Akka.Actor;
using mmria.common.ije;

namespace RecordsProcessor_Worker.Actors
{
    public class BatchSupervisor : ReceiveActor
    {

        Dictionary<string, mmria.common.ije.Batch.StatusEnum> batch_id_list;
        IConfiguration configuration;
        ILogger logger;
        protected override void PreStart() => Console.WriteLine("Process_Message started");
        protected override void PostStop() => Console.WriteLine("Process_Message stopped");
        public BatchSupervisor()
        {
            //IConfiguration p_configuration
            //configuration = p_configuration;
            //logger = p_logger;
            batch_id_list = new Dictionary<string, mmria.common.ije.Batch.StatusEnum>();

            Receive<mmria.common.ije.NewIJESet_Message>(message =>
            {
                batch_id_list.Add(message.batch_id, mmria.common.ije.Batch.StatusEnum.InProcess);
                var batch_processor = Context.ActorOf<RecordsProcessor_Worker.Actors.BatchProcessor>(message.batch_id);
                batch_processor.Tell(message);
                //Console.WriteLine(JsonConvert.SerializeObject(message));
                //Sender.Tell("Message Recieved");
                
            });

            Receive<mmria.common.ije.BatchStatusMessage>(message =>
            {
                batch_id_list[message.id] = message.status;
                
            });



            
        }
       
    }
}
