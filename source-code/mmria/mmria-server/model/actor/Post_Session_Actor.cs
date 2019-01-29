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

        public Session_Message ()
        {
            
            data = new System.Collections.Generic.Dictionary<string,string>(StringComparer.InvariantCultureIgnoreCase);
        }
        /*
	    public Session_Message (string p_document_id, string p_document_json, string p_method = "PUT")
        {
            
            document_id = p_document_id;
            document_json = p_document_json;
            method = p_method;

            data = new System.Collections.Generic.Dictionary<string,string>(StringComparer.InvariantCultureIgnoreCase);
        } */

        public string _id {get; set;}
        public string _rev {get; set;}
		public string data_type { get; set; } = "session";
        public DateTime date_created {get; set;}
        public DateTime date_last_updated {get; set;}

        public DateTime? date_expired {get; set;}

        public bool is_active {get; set;}
        public string user_id {get; set;}
        public string ip {get; set;}
        public string session_event_id {get; set;}

        public System.Collections.Generic.Dictionary<string,string> data { get; set; }

    }

    public class Post_Session : UntypedActor
    {
        protected override void PreStart() => Console.WriteLine("Synchronize_Case started");
        protected override void PostStop() => Console.WriteLine("Synchronize_Case stopped");

        protected override void OnReceive(object message)
        {
            
            switch (message)
            {
                case Session_Message session_message:

                try
                {
                    mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();
                    string request_string = Program.config_couchdb_url + $"/session/{Post_Request._id}";

                    try 
                    {
                        var check_document_curl = new cURL ("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_password);
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

                    cURL document_curl = new cURL ("PUT", null, request_string, object_string, Program.config_timer_user_name, Program.config_timer_password);

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

                
                break;
            }

        }

    }
}