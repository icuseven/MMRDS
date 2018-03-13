using System;
using System.Threading;
using System.Threading.Tasks;
using Quartz;
using Quartz.Impl;
using Quartz.Logging;

namespace mmria.server.model
{
    /// <summary>
    /// This is just a simple job that says "Hello" to the world.
    /// </summary>
    /// <author>Bill Kratzer</author>
    /// <author>Marko Lahma (.NET)</author>
    public class Pulse_job : IJob
    {
        //private static readonly ILog log = LogProvider.GetLogger(typeof (HelloJob));

        /// <summary>
        /// Called by the <see cref="IScheduler" /> when a
        /// <see cref="ITrigger" /> fires that is associated with
        /// the <see cref="IJob" />.
        /// </summary>
        public virtual Task Execute(IJobExecutionContext context)
        {
            // Say Hello to the World and display the date/time
            System.Console.WriteLine($"Pulse_job! - {DateTime.Now:r}");
            return Task.CompletedTask;
        }
    }
}