using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Text;
using Akka.Actor;
using mmria.common.ije;

namespace mmria.services.backup;

public class BackupSupervisor : ReceiveActor
{

    public class PerformBackupMessage
    {
        public PerformBackupMessage(){}

        public string type  { get; set; }
        public DateTime DateStarted {get; set; }
    }

    IConfiguration configuration;
    ILogger logger;
    protected override void PreStart() => Console.WriteLine("Process_Message started");
    protected override void PostStop() => Console.WriteLine("Process_Message stopped");
    public BackupSupervisor()
    {
        //IConfiguration p_configuration
        //configuration = p_configuration;
        //logger = p_logger;


        Receive<PerformBackupMessage>(message =>
        {   

            switch(message.type.ToLower())
            {

                case "hot":
                    var backup_processor = Context.ActorOf<mmria.services.backup.BackupProcessor>();
                    backup_processor.Tell(message);
                    break;

                case "cold":
                    var hot_backup_processor = Context.ActorOf<mmria.services.backup.BackupHotProcessor>();
                    hot_backup_processor.Tell(message);
                    break;
            }

            //Console.WriteLine(JsonConvert.SerializeObject(message));
            //Sender.Tell("Message Recieved");
            
        });

    }




    
}

