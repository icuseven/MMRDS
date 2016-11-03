using System;
using System.Web.Http;
using System.Linq;

namespace owin
{
	public class queueController: ApiController 
	{
		public queueController ()
		{
		}

		public owin.data.api.Set_Queue_Response Post(owin.data.api.Set_Queue_Request set_queue_request)
		{ 
			owin.data.api.Set_Queue_Response result = new owin.data.api.Set_Queue_Response();

			owin.data.api.Queue_Item queue_item = new owin.data.api.Queue_Item ();
			queue_item.queue_id = System.Guid.NewGuid ().ToString ();
			queue_item.case_list = set_queue_request.case_list;

			string queue_url = this.get_couch_db_url() + "/queue/"  + queue_item.queue_id;

			string object_string = Newtonsoft.Json.JsonConvert.SerializeObject(queue_item);

			System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(queue_url));
			request.Method = "PUT";
			request.ContentType = "application/json";
			request.ContentLength = object_string.Length;
			request.PreAuthenticate = false;

			if(!string.IsNullOrWhiteSpace(set_queue_request.security_token))
			{
				request.Headers.Add("Cookie", "AuthSession=" + set_queue_request.security_token);
				request.Headers.Add("X-CouchDB-WWW-Authenticate", set_queue_request.security_token);
			}
			else if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
			{
				string[] auth_session_token = this.Request.Headers.GetValues("Cookie").First().Split('=');
				request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
				request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
			}

			owin.couchdb.document_put_response put_response = null;

			using (System.IO.StreamWriter streamWriter = new System.IO.StreamWriter(request.GetRequestStream()))
			{
				try
				{
					streamWriter.Write(object_string);
					streamWriter.Flush();
					streamWriter.Close();


					System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
					System.IO.Stream dataStream = response.GetResponseStream ();
					System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
					string responseFromServer = reader.ReadToEnd ();

					put_response = Newtonsoft.Json.JsonConvert.DeserializeObject<owin.couchdb.document_put_response>(responseFromServer);
				}
				catch(Exception ex)
				{
					Console.WriteLine (ex);
					result.Ok = false;
					result.message = ex.ToString ();
				}
			}

			//if(put_response.


			return result;
		}

		private string get_couch_db_url()
		{
			string result = null;

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_container_based"])) 
			{
				result = System.Environment.GetEnvironmentVariable ("couchdb_url");
			} 
			else
			{
				result = System.Configuration.ConfigurationManager.AppSettings ["couchdb_url"];
			}

			return result;
		}
	}
}

