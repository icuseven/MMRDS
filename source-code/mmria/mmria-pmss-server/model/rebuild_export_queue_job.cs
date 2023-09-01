using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Web;
using Quartz;
using Quartz.Impl;
using Microsoft.Extensions.Configuration;

namespace mmria.pmss.server.model;

public sealed class rebuild_queue_job : IJob
{

    mmria.common.couchdb.OverridableConfiguration configuration;
    mmria.common.couchdb.DBConfigurationDetail db_config = null;

    string host_prefix;

    public rebuild_queue_job
    (
        mmria.common.couchdb.OverridableConfiguration  _configuration,
        string _host_prefix
    )
    {
        configuration = _configuration;
        host_prefix = _host_prefix;
        db_config = configuration.GetDBConfig(host_prefix);


        
    }

    public Task Execute(IJobExecutionContext context)
    {
        //Common.Logging.ILog log = Common.Logging.LogManager.GetCurrentClassLogger();
        //log.Debug("IJob.Execute");

        JobKey jobKey = context.JobDetail.Key;
/*

        try 
        {
            Program.PauseSchedule (); 
        }
        catch (Exception ex) 
        {
            System.Console.WriteLine ($"rebuild_queue_job. error pausing schedule\n{ex}");
        }
*/
        try 
        {
            string export_directory = configuration.GetString("export_directory", host_prefix);

            if (System.IO.Directory.Exists (export_directory))
            {
                RecursiveDirectoryDelete(new System.IO.DirectoryInfo(export_directory));
            }

            System.IO.Directory.CreateDirectory(export_directory);


        }
        catch (Exception ex) 
        {
            System.Console.WriteLine ($"rebuild_queue_job. error deleting directory queue\n{ex}");
        }


        if (url_endpoint_exists (db_config.url + $"/{db_config.prefix}export_queue", db_config.user_name, db_config.user_value)) 
        {
            var delete_queue_curl = new cURL ("DELETE", null, db_config.url + $"/{db_config.prefix}export_queue", null, db_config.user_name, db_config.user_value);
            System.Console.WriteLine (delete_queue_curl.execute ());
        }


        try 
        {
            System.Console.WriteLine ("Creating export_queue db.");
            var export_queue_curl = new cURL ("PUT", null, db_config.url + $"/{db_config.prefix}export_queue", null, db_config.user_name, db_config.user_value);
            System.Console.WriteLine (export_queue_curl.execute ());
            new cURL ("PUT", null, db_config.url + $"/{db_config.prefix}export_queue/_security", "{\"admins\":{\"names\":[],\"roles\":[\"abstractor\"]},\"members\":{\"names\":[],\"roles\":[\"abstractor\"]}}", db_config.user_name, db_config.user_value).execute ();

        }
        catch (Exception ex) 
        {
            System.Console.WriteLine ($"rebuild_queue_job. error creating queue\n{ex}");
        }


/*
        try 
        {
            Program.ResumeSchedule (); 
        }
        catch (Exception ex) 
        {
            System.Console.WriteLine ($"rebuild_queue_job. error resuming schedule\n{ex}");
        }
*/
        return Task.CompletedTask;
    }

    private static bool url_endpoint_exists (string p_target_server, string p_user_name, string p_user_value, string p_method = "HEAD")
    {
        bool result = false;

        var curl = new cURL (p_method, null, p_target_server, null, p_user_name, p_user_value);
        try 
        {
            curl.execute ();
            /*
            HTTP/1.1 200 OK
            Cache-Control: must-revalidate
            Content-Type: application/json
            Date: Mon, 12 Aug 2013 01:27:41 GMT
            Server: CouchDB (Erlang/OTP)*/
            result = true;
        } 
        catch (Exception) 
        {
            // do nothing for now
        }


        return result;
    }

    private static void RecursiveDirectoryDelete(System.IO.DirectoryInfo baseDir)
    {
        if (!baseDir.Exists)
            return;

        foreach (var dir in baseDir.EnumerateDirectories())
        {
            RecursiveDirectoryDelete(dir);
        }
        baseDir.Delete(true);
    }
}

