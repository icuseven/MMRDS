using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using mmria.server.model.actor;

namespace mmria.server.model.actor
{

	public class Session_Message
	{

        public Session_Message 
        (
        string p_id,
        string p_rev,
        DateTime p_date_created,
        DateTime p_date_last_updated,

        DateTime? p_date_expired,

        bool p_is_active,
        string p_user_id,
        string p_ip,
        string p_session_event_id,
        System.Collections.Generic.Dictionary<string,string> p_data
        )
        {
            
            _id = p_id;
            _rev = p_rev;
            date_created = p_date_created;
            date_last_updated = p_date_last_updated;

            date_expired = p_date_expired;

            is_active = p_is_active;
            user_id = p_user_id;
            ip = p_ip;
            session_event_id = p_session_event_id;
            data = p_data;
            
        }
        /*
	    public Session_Message (string p_document_id, string p_document_json, string p_method = "PUT")
        {
            
            document_id = p_document_id;
            document_json = p_document_json;
            method = p_method;

            data = new System.Collections.Generic.Dictionary<string,string>(StringComparer.InvariantCultureIgnoreCase);
        } */

        public string _id {get; private set;}
        public string _rev {get; private set;}
		public string data_type { get; private set; } = "session";
        public DateTime date_created {get; private set;}
        public DateTime date_last_updated {get; private set;}

        public DateTime? date_expired {get; private set;}

        public bool is_active {get; private set;}
        public string user_id {get; private set;}
        public string ip {get; private set;}
        public string session_event_id {get; private set;}

        public System.Collections.Generic.Dictionary<string,string> data { get; private set; }

    }

    public class Post_Session : UntypedActor
    {
        //protected override void PreStart() => Console.WriteLine("Post_Session started");
        //protected override void PostStop() => Console.WriteLine("Post_Session stopped");

        protected override void OnReceive(object message)
        {
            
            switch (message)
            {
                case Session_Message session_message:

                try
                {
                    mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();
                    string request_string = Program.config_couchdb_url + $"/session/{session_message._id}";

                    try 
                    {
                        var check_document_curl = new cURL ("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                        string check_document_json = check_document_curl.execute();
                        var check_document_expando_object = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.session> (check_document_json);

                        if(!session_message.user_id.Equals(check_document_expando_object.user_id, StringComparison.OrdinalIgnoreCase))
                        {
                            Console.Write($"unauthorized PUT {session_message._id} by: {session_message.user_id}");
                            return;//result;
                        }
                    } 
                    catch (Exception ex) 
                    {
                        // do nothing for now document doesn't exsist.
                        System.Console.WriteLine ($"err caseController.Post\n{ex}");
                    }

                    Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
                    settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                    var object_string = Newtonsoft.Json.JsonConvert.SerializeObject(session_message, settings);

                    cURL document_curl = new cURL ("PUT", null, request_string, object_string, Program.config_timer_user_name, Program.config_timer_value);

                    try
                    {
                        string responseFromServer = document_curl.execute();
                        result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
                    }
                    catch(Exception ex)
                    {
                        Console.WriteLine(ex);
                    }
                }
                catch(Exception ex)
                {
                    Console.WriteLine (ex);
                } 

                Context.Stop(this.Self);
                
                break;
            }

        }

    }
}