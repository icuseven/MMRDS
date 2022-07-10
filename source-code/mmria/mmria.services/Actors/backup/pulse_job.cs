using System;
using System.Threading;
using System.Threading.Tasks;
using Akka.Actor;
using Quartz;
using Quartz.Impl;
using Quartz.Logging;

namespace mmria.services.vitalsimport;

/// <summary>
/// This is just a simple job that says "Hello" to the world.
/// </summary>
/// <author>Bill Kratzer</author>
/// <author>Marko Lahma (.NET)</author>
public class Pulse_job : IJob
{


    //private ActorSystem _actorSystem;

    /*public Pulse_job(ActorSystem actorSystem)
    {
        _actorSystem = actorSystem;
    }*/
    //private static readonly ILog log = LogProvider.GetLogger(typeof (HelloJob));

    //private static readonly ActorSystem actorSystem = LogProvider.GetLogger(typeof (ActorSystem));;
    /// <summary>
    /// Called by the <see cref="IScheduler" /> when a
    /// <see cref="ITrigger" /> fires that is associated with
    /// the <see cref="IJob" />.
    /// </summary>
    public virtual Task Execute(IJobExecutionContext context)
    {
        System.Console.WriteLine($"Quartz_Pulse - {DateTime.Now:r}");


        var quartzSupervisor = Program.ActorSystem.ActorSelection("akka://mmria-actor-system/user/QuartzSupervisor");
        //var quartzSupervisor = _actorSystem.ActorSelection("akka://mmria-actor-system/user/QuartzSupervisor");
        quartzSupervisor.Tell("pulse");

        return Task.CompletedTask;
    }
}
