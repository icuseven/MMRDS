using System;
using System.Threading;
using System.Threading.Tasks;
using Akka.Actor;
using Quartz;
using Quartz.Impl;
using Quartz.Logging;

namespace mmria.pmss.server.model;

public sealed class Pulse_job : IJob
{

    public Task Execute(IJobExecutionContext context)
    {
        //System.Console.WriteLine($"Quartz_Pulse - {DateTime.Now:r}");

        var quartzSupervisor = Program.actorSystem.ActorSelection("akka://mmria-actor-system/user/QuartzSupervisor");
        quartzSupervisor.Tell("pulse");

        return Task.CompletedTask;
    }
}