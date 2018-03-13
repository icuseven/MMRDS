using System;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using Akka.Quartz.Actor;
using Akka.Quartz.Actor.Commands;
using Akka.Quartz.Actor.Events;
using Akka.Quartz.Actor.Exceptions;
using Quartz;
using Quartz.Impl;
using IScheduler = Quartz.IScheduler;

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
        //private IActorRef quartzActor = Context.ActorOf(Props.Create<QuartzActor>(), "QuartzActor");
        private IActorRef quartzWriter = Context.ActorOf(Props.Create<QuartzWriter>(), "QuartzWriter");

        private string cron_schedule = null;
		private string couch_db_url = null;
        private string user_name = null;
        private string password = null;
        private string export_directory = null;

        protected override void OnReceive(object message)
        {

            switch (message)
            {
                case ScheduleInfoMessage scheduleInfo:


                    cron_schedule = scheduleInfo.cron_schedule;
                    couch_db_url = scheduleInfo.couch_db_url;
                    user_name = scheduleInfo.user_name;
                    password = scheduleInfo.password;
                    export_directory = scheduleInfo.export_directory;
                        /*
                    quartzActor.Tell
                    (
                        new CreateJob(quartzWriter, "Hello", TriggerBuilder.Create().WithCronSchedule(cron_schedule).Build())
                    ); */
                    break;

            }
            
        }
    }

    public class QuartzWriter : UntypedActor
    {
        protected override void PreStart() => Console.WriteLine("QuartzWriter started");
        protected override void PostStop() => Console.WriteLine("QuartzWriter stopped");

        protected override void OnReceive(object message)
        {
                Console.WriteLine($"QuartzWriter Baby {System.DateTime.Now}");

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

        public static string GetHash(string file_path)
        {
            string result;
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            System.Security.Cryptography.MD5 md5Hasher = System.Security.Cryptography.MD5.Create();

            using (System.IO.FileStream fs = new System.IO.FileStream(file_path, System.IO.FileMode.Open,
                              System.IO.FileAccess.Read, System.IO.FileShare.ReadWrite))
            {
                foreach (Byte b in md5Hasher.ComputeHash(fs))
                    sb.Append(b.ToString("X2").ToLowerInvariant());
            }

            result = sb.ToString();

            return result;
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