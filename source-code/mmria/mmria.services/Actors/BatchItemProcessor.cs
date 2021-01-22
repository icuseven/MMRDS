using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Akka.Actor;

namespace RecordsProcessor_Worker.Actors
{
    public class BatchItemProcessor : ReceiveActor
    {
        protected override void PreStart() => Console.WriteLine("Process_Message started");
        protected override void PostStop() => Console.WriteLine("Process_Message stopped");

        public BatchItemProcessor()
        {
            Receive<mmria.common.ije.NewIJESet_Message>(message =>
            {
                Console.WriteLine("Message Recieved");
                //Console.WriteLine(JsonConvert.SerializeObject(message));
                Sender.Tell("Message Recieved");
                Process_Message(message);
            });
        }

        private void Process_Message(mmria.common.ije.NewIJESet_Message message)
        {
            var mor_set = message.mor.Split("\n");

            var batch = new mmria.common.ije.Batch()
            {
                id = message.batch_id,
                Status = mmria.common.ije.Batch.StatusEnum.Init,
                ImportDate = DateTime.Now
            };

            foreach(var row in mor_set)
            {

            }
        }

        struct Result_Struct
        {
            public System.Dynamic.ExpandoObject[] docs;
        }

        struct Selector_Struc
        {
            //public System.Dynamic.ExpandoObject selector;
            public System.Collections.Generic.Dictionary<string,System.Collections.Generic.Dictionary<string,string>> selector;
            public string[] fields;

            public int limit;
        }

        private async Task<Result_Struct> get_matching_cases_for(string p_selector, string p_find_value)
        {

            Result_Struct result = new Result_Struct();

            try
            {

            	var selector_struc = new Selector_Struc();
				selector_struc.selector = new System.Collections.Generic.Dictionary<string,System.Collections.Generic.Dictionary<string,string>>(StringComparer.OrdinalIgnoreCase);
				selector_struc.limit = 10000;
				selector_struc.selector.Add(p_selector, new System.Collections.Generic.Dictionary<string,string>(StringComparer.OrdinalIgnoreCase));
				selector_struc.selector[p_selector].Add("$eq", p_find_value);

            	Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				string selector_struc_string = Newtonsoft.Json.JsonConvert.SerializeObject (selector_struc, settings);

				System.Console.WriteLine(selector_struc_string);

/*
				string find_url = $"{db_server_url}/{db_name}/_find";

				var case_curl = new mmria.server.cURL("POST", null, find_url, selector_struc_string, config_timer_user_name, config_timer_value);
				string responseFromServer = await case_curl.executeAsync();
				
				result = Newtonsoft.Json.JsonConvert.DeserializeObject<Result_Struct>(responseFromServer);
*/
				System.Console.WriteLine($"case_response.docs.length {result.docs.Length}");
            }
            catch(Exception ex)
            {

            }

            return result;
        }

    }
}
