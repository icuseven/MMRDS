using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Serilog;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Quartz;
using Quartz.Impl;
using Akka.Actor;
using Akka.Quartz.Actor;
using Akka;

namespace mmria.services
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
 
 
        public void ConfigureServices(IServiceCollection services)
        {
            var actorSystem = ActorSystem.Create("mmria-actor-system");
            services.AddSingleton(typeof(ActorSystem), (serviceProvider) => actorSystem);

            ISchedulerFactory schedFact = new StdSchedulerFactory();
            Quartz.IScheduler sched = schedFact.GetScheduler().Result;

            // compute a time that is on the next round minute
            DateTimeOffset runTime = DateBuilder.EvenMinuteDate(DateTimeOffset.UtcNow);

            // define the job and tie it to our HelloJob class
            IJobDetail job = JobBuilder.Create<mmria.services.model.Pulse_job>()
            .WithIdentity("job1", "group1")
            .Build();

            // Trigger the job to run on the next round minute
            ITrigger trigger = TriggerBuilder.Create()
            .WithIdentity("trigger1", "group1")
            .StartAt(runTime.AddMinutes(3))
            .WithCronSchedule(Configuration["mmria_settings:config_cron_schedule"])
            .Build();

            sched.ScheduleJob(job, trigger);

            //if (Program.is_schedule_enabled)
            {
                sched.Start();
            }
            
            Log.Information("mmria_settings:is_schedule_enabled: {0}", Configuration["mmria_settings:is_schedule_enabled"]);
            Log.Information("mmria_settings:is_db_check_enabled: {0}", Configuration["mmria_settings:is_db_check_enabled"]);
     


            /*
            Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.quartz.Check_DB_Install>(), "Check_DB_Install");
            Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.quartz.Rebuild_Export_Queue>(), "Rebuild_Export_Queue");
            Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.quartz.Process_Export_Queue>(), "Process_Export_Queue");
            Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.quartz.Process_Migrate_Data>(), "Process_Migrate_Data");
            Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.Synchronize_Case>(), "case_sync_actor");
            */
            //Program.actorSystem.ActorOf(Props.Create<mmria.services.model.actor.quartz.Process_Migrate_Data>(), "Process_Migrate_Data");

            var quartzSupervisor = actorSystem.ActorOf(Props.Create<mmria.services.model.actor.quartzSupervisor>(), "QuartzSupervisor");

            //System.Threading.Thread.Sleep(1000);

            quartzSupervisor.Tell("init");
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("Hello World!");
                });
            });
        }
    }
}
