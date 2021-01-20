using System;
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
            Receive<mmria.common.ije.NewIJESet_Message>(message =>
            {
                Console.WriteLine("Message Recieved");
                //Console.WriteLine(JsonConvert.SerializeObject(message));
                Sender.Tell("Message Recieved");
                Process_Message(message);
            });
        }

        private void Process_Message(mmria.common.ije.NewIJESet_Message message)
        {
            var mor_set = message.mor.Split("\n");

            var batch = new mmria.common.ije.Batch()
            {
                id = message.batch_id,
                Status = mmria.common.ije.Batch.StatusEnum.Init,
                ImportDate = DateTime.Now
            };

            foreach(var row in mor_set)
            {

            }
        }

    }
}
