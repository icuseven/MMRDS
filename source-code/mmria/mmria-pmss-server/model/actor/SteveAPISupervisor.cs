using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Linq;
using System.Text;
using Akka.Actor;
using mmria.common.steve;

namespace mmria.server;

public sealed class SteveAPISupervisor : ReceiveActor
{
    IConfiguration configuration;
    ILogger logger;

    protected override void PreStart() => Console.WriteLine("Process_Message started");
    protected override void PostStop() => Console.WriteLine("Process_Message stopped");
    public SteveAPISupervisor()
    {
        Receive<DownloadRequest>(message =>
        {
            //var processor = Context.ActorSelection("akka://mmria-actor-system/user/populate-cdc-instance-supervisor/child*");

            var processor = Context.ActorOf<SteveAPI_Instance>();
            
            processor.Tell(message);

            Sender.Tell(System.DateTime.Now);
        });

    }

}
