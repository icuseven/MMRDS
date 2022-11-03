using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace mmria.services.populate_cdc_instance;

public sealed class PopulateCDCInstance : ReceiveActor
{

    public record class Status(string Name, string Description);


    IConfiguration configuration;
    ILogger logger;

    protected override void PreStart() => Console.WriteLine("Process_Message started");
    protected override void PostStop() => Console.WriteLine("Process_Message stopped");
    public PopulateCDCInstance()
    {
        Become(Waiting);
    }

    void Processing()
    {
        Receive<mmria.common.metadata.Populate_CDC_Instance>(message =>
        {
            // discard message;
        });
    }

    void Waiting()
    {
        Receive<mmria.common.metadata.Populate_CDC_Instance>(message =>
        {
            Become(Processing);
            Process_Message(message);
        });
    }


    private async Task Process_Message(mmria.common.metadata.Populate_CDC_Instance message)
    {
        try
        {
            throw new Exception("Exception thrown");
        }
        catch(Exception ex)
        {
            Sender.Tell(new Status("Error", ex.Message));
        }

    }

}
