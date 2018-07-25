using System;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;

namespace mmria.server.model.actor.quartz
{
    public class Process_Migrate_Data : UntypedActor
    {
        protected override void PreStart() => Console.WriteLine("Process_Migrate_Data started");
        protected override void PostStop() => Console.WriteLine("Process_Migrate_Data stopped");

        protected override void OnReceive(object message)
        {
               
            Console.WriteLine($"Process_Migrate_Data {System.DateTime.Now}");


			string url = Program.config_couchdb_url + "/mmrds/_all_docs?include_docs=true";

			var case_curl = new cURL("GET", null, url, null, Program.config_timer_user_name, Program.config_timer_password);
			string responseFromServer = case_curl.execute();

			/*
{"total_rows":7,"offset":0,"rows":[
{"id":"010d8406-55d0-416f-9000-55c068b4ec54","key":"010d8406-55d0-416f-9000-55c068b4ec54","value":{"rev":"1-c6855378e0dc9920bc13669c3de428b9"},"doc":{
	}			
			*/


			//result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.couchdb.c_change_result>(res);


        }

    }
}