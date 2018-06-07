using System;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using mmria.server.model.actor.quartz;

namespace mmria.server.model.actor
{
    public sealed class ScheduleInfoMessage
    {
        public ScheduleInfoMessage
        (
            string p_cron_schedule, 
            string p_couch_db_url,
            string p_user_name,
            string p_password,
            string p_export_directory
         )
        {
            cron_schedule = p_cron_schedule;
            couch_db_url = p_couch_db_url;
            user_name = p_user_name;
            password = p_password;
            export_directory = p_export_directory;
        }

        public string cron_schedule { get; private set; }
        public string couch_db_url { get; private set; }
        public string user_name { get; private set; }
        public string password { get; private set; }
        public string export_directory { get; private set; }
    }


    public class QuartzSupervisor : UntypedActor
    {
        //private IActorRef checkForChanges = Context.ActorOf(Props.Create<CheckForChanges>(), "CheckForChanges");

        //private ScheduleInfoMessage scheduleInfo = null;

/*
        public QuartzSupervisor(ScheduleInfoMessage p_scheduleInfo)
        {
            this.scheduleInfo = p_scheduleInfo;
        }


        public static Props Props(ScheduleInfoMessage p_scheduleInfo) => Akka.Actor.Props.Create(() => new QuartzSupervisor(p_scheduleInfo));
*/

        protected override void OnReceive(object message)
        {

            switch (message)
            {
                case "init":

                    Console.WriteLine("Quartz Supervisor initialized");
                    break;

                case "pulse":

                    mmria.server.model.actor.ScheduleInfoMessage new_scheduleInfo = new actor.ScheduleInfoMessage
						(
							Program.config_cron_schedule,
							Program.config_couchdb_url,
							Program.config_timer_user_name,
							Program.config_timer_password,
							Program.config_export_directory
						);


                    bool is_rebuild_queue = false;

                    var midnight_timespan = new TimeSpan(0, 0, 0);
                    var difference = DateTime.Now - midnight_timespan;
                    if(difference.Hour == 0 && difference.Minute == 0)
                    {
                        is_rebuild_queue = true;
                    }

                    if(is_rebuild_queue)
                    {
                        Context.ActorOf(Props.Create<Rebuild_Export_Queue>(), "Rebuild_Export_Queue").Tell(new_scheduleInfo);
                    }
                    else
                    {
                        Context.ActorOf(Props.Create<Process_Export_Queue>(), "Process_Export_Queue").Tell(new_scheduleInfo);
                        //Context.ActorOf(Props.Create<Process_DB_Synchronization_Set>(), "Process_DB_Synchronization_Set").Tell(new_scheduleInfo);
                        //Context.ActorOf(Props.Create<Synchronize_Deleted_Case_Records>(), "Synchronize_Deleted_Case_Records").Tell(new_scheduleInfo);

                    }

                    //checkForChanges.Tell("pulse");
                    

                break;
            }
            
        }
    }

    public class CheckForChanges : UntypedActor
    {
        protected override void PreStart() => Console.WriteLine("CheckForChanges started");
        protected override void PostStop() => Console.WriteLine("CheckForChanges stopped");

        protected override void OnReceive(object message)
        {
                Console.WriteLine($"CheckForChanges {System.DateTime.Now}");

            /*
            switch (message)
            {
                case WriteFile file:
                    //file-data/file-name-directory/hash-name.file
                    string new_directory = System.IO.Path.Combine(file.workingdirectory, "file-data", file.filename.Replace(file.monitoreddirectory, ""));
                    

                    Console.WriteLine($"QuartzWriter.OnRecieve {file.filename} >> {new_directory}");
                    if(!System.IO.Directory.Exists(new_directory))
                    {
                        System.IO.Directory.CreateDirectory(new_directory);
                    }

                    string new_path = System.IO.Path.Combine(new_directory, GetHash(file.filename));
                    if(!System.IO.File.Exists(new_path))
                    {
                        System.IO.File.Copy(file.filename, new_path);
                    }
                    
                    break;

                    case RecordFileMessage rfm:
                        Console.WriteLine(rfm.filename);
                        break;
            }*/

        }

    }


    



}


                        /*
                    Program.DateOfLastChange_Sequence_Call = new List<DateTime> ();
                    Program.Change_Sequence_Call_Count++;
                    Program.DateOfLastChange_Sequence_Call.Add (DateTime.Now);


                    //StdSchedulerFactory sf = new StdSchedulerFactory ();
                    //Program.sched = sf.GetScheduler ();
                    DateTimeOffset startTime = DateBuilder.NextGivenSecondDate (null, 15);

                    IJobDetail check_for_changes_job = JobBuilder.Create<mmria.server.model.check_for_changes_job> ()
                                                                        .WithIdentity ("check_for_changes_job", "group1")
                                                                        .Build ();

                    string cron_schedule = Program.config_cron_schedule;


                    Program.check_for_changes_job_trigger = (ITrigger)TriggerBuilder.Create ()
                                    .WithIdentity ("check_for_changes_job_trigger", "group1")
                                    .StartAt (startTime)
                                    .WithCronSchedule (cron_schedule)
                                    .Build ();


                    DateTimeOffset? check_for_changes_job_ft = sched.ScheduleJob (check_for_changes_job, Program.check_for_changes_job_trigger);



                    IJobDetail rebuild_queue_job = JobBuilder.Create<mmria.server.model.rebuild_queue_job> ()
                                                                    .WithIdentity ("rebuild_queue_job", "group2")
                                                                    .Build ();

                    string rebuild_queue_job_cron_schedule = "0 0 0 * * ?";// at midnight every 24 hours


                    Program.rebuild_queue_job_trigger = (ITrigger)TriggerBuilder.Create ()
                                    .WithIdentity ("rebuild_queue_job_trigger", "group2")
                                    .StartAt (startTime)
                                    .WithCronSchedule (rebuild_queue_job_cron_schedule)
                                    .Build ();


                    DateTimeOffset? rebuild_queue_job_ft = sched.ScheduleJob (rebuild_queue_job, Program.rebuild_queue_job_trigger);
                     */