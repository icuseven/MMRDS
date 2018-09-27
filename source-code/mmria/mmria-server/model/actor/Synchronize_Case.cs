using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using mmria.server.model.actor;

namespace mmria.server.model.actor
{

	public class Sync_Document_Message
	{
	    public Sync_Document_Message (string p_document_json, string p_document_id, string p_method = "PUT")
        {
            document_json = p_document_json;
            document_id = p_document_id;
            method = p_method;
        }
		public string document_json { get; private set; }
		public string document_id { get; private set;}
		public string method { get; private set;}
    }

    public class Synchronize_Case : UntypedActor
    {
        protected override void PreStart() => Console.WriteLine("Synchronize_Case started");
        protected override void PostStop() => Console.WriteLine("Synchronize_Case stopped");

        protected override void OnReceive(object message)
        {
            
            switch (message)
            {
                case Sync_Document_Message sync_document_message:


				var sync_document = new mmria.server.util.c_sync_document (sync_document_message.document_id, sync_document_message.document_json, sync_document_message.method);

                try
                {
                    sync_document.executeAsync().Wait();
                }
				catch(Exception ex)
                {
                    Console.WriteLine($"Synchronize_Case exception: {ex}");
                }
                
                break;
            }

        }

    }
}