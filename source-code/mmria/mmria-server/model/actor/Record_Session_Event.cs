using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using mmria.server.model.actor;

namespace mmria.server.model.actor
{


    public class Session_Event_Message
	{
        public enum Session_Event_Message_Action_Enum
        {
            failed_login,
            successful_login,
            password_changed
        }

        public Session_Event_Message
        (
            DateTime p_date_created,
            string p_user_id,
            string p_ip,
            Session_Event_Message_Action_Enum p_action_result
        )
        {
            date_created  = p_date_created;
            user_id  = p_user_id;
            ip  = p_ip;
            action_result  = p_action_result;
            
            _id = Guid.NewGuid().ToString();
        }

        public string _id {get; private set; }
        public DateTime date_created {get; private set;}
        public string user_id {get; private set;}
        public string ip {get; private set;}
        public Session_Event_Message_Action_Enum action_result {get; private set;}

    }

	
    public class Record_Session_Event : UntypedActor
    {
        //protected override void PreStart() => Console.WriteLine("Session_Event_Message started");
       //protected override void PostStop() => Console.WriteLine("Session_Event_Message stopped");

        protected override void OnReceive(object message)
        {
            
            switch (message)
            {
                case Session_Event_Message sem:


                try
                {
                    


                    var se = new mmria.common.model.couchdb.session_event();
                    se.data_type = "session-event";
                    se._id =sem._id;
                    se.date_created  = sem.date_created;
                    se.user_id  = sem.user_id;
                    se.ip  = sem.ip;

                    switch(sem.action_result)
                    {
                        case Session_Event_Message.Session_Event_Message_Action_Enum.successful_login:
                            se.action_result = mmria.common.model.couchdb.session_event.session_event_action_enum.successful_login;
                            break;
                        case Session_Event_Message.Session_Event_Message_Action_Enum.password_changed:
                            se.action_result = mmria.common.model.couchdb.session_event.session_event_action_enum.password_changed;
                            break;                            
                        case Session_Event_Message.Session_Event_Message_Action_Enum.failed_login:
                        default:
                            se.action_result = mmria.common.model.couchdb.session_event.session_event_action_enum.failed_login;
                            break;

                    }


                    Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				    settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				    var session_event_json = Newtonsoft.Json.JsonConvert.SerializeObject(se, settings);

                    var request_url = $"{Program.config_couchdb_url}/{Program.db_prefix}session/{se._id}";
                    var curl = new cURL("PUT", null, request_url, session_event_json, Program.config_timer_user_name, Program.config_timer_value);
                    curl.executeAsync ().Wait();

                    //var session_event_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_object_key_header<mmria.common.model.couchdb.session_event>>(response_from_server);

                }
				catch(Exception ex)
                {
                    Console.WriteLine($"Session_Event_Message exception: {ex}");
                }
                
                break;
            }

        }

    }
}