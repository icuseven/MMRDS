using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Dynamic;
using mmria.common.model;

namespace mmria.server
{
	public class caseController: ApiController 
	{ 


		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public System.Dynamic.ExpandoObject Get(string case_id = null) 
		{ 
			try
			{
                string request_string = Program.config_couchdb_url + "/mmrds/_all_docs?include_docs=true";

                if (!string.IsNullOrWhiteSpace (case_id)) 
                {
                    request_string = Program.config_couchdb_url + "/mmrds/" + case_id;
                } 

				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

				request.PreAuthenticate = false;


				if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
				{
					string[] cookie_set = this.Request.Headers.GetValues("Cookie").First().Split(';');
					for(int i = 0; i < cookie_set.Length; i++)
					{
						string[] auth_session_token = cookie_set[i].Split('=');
						if(auth_session_token[0].Trim() == "AuthSession")
						{
							request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
							request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
							break;
						}
					}
				}

				System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				string responseFromServer = reader.ReadToEnd ();

                var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

                return result;



				/*
		< HTTP/1.1 200 OK
		< Set-Cookie: AuthSession=YW5uYTo0QUIzOTdFQjrC4ipN-D-53hw1sJepVzcVxnriEw;
		< Version=1; Path=/; HttpOnly
		> ...
		<
		{"ok":true}*/



			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return null;
		} 




		// POST api/values 
		[Route]
		public mmria.common.model.couchdb.document_put_response Post() 
		{ 
			//bool valid_login = false;
			//mmria.common.data.api.Set_Queue_Request queue_request = null;
			System.Dynamic.ExpandoObject  queue_request = null;
			string auth_session_token = null;

			string object_string = null;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{

				System.IO.Stream dataStream0 = this.Request.Content.ReadAsStreamAsync().Result;
				// Open the stream using a StreamReader for easy access.
				//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
				System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);
				// Read the content.
				string temp = reader0.ReadToEnd ();

				queue_request = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(temp);

				//mmria.server.util.LuceneSearchIndexer.RunIndex(new List<mmria.common.model.home_record> { mmria.common.model.home_record.convert(queue_request)});
				//System.Dynamic.ExpandoObject json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(result, new  Newtonsoft.Json.Converters.ExpandoObjectConverter());



				//string metadata = DecodeUrlString(temp);
			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);
			}

			//if(queue_request.case_list.Length == 1)
			try
			{
				//dynamic case_item = queue_request.case_list[0];

				Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
				settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				object_string = Newtonsoft.Json.JsonConvert.SerializeObject(queue_request, settings);

				var byName = (IDictionary<string,object>)queue_request;
				var temp_id = byName["_id"]; 
				string id_val = null;

				if(temp_id is DateTime)
				{
					id_val = string.Concat(((DateTime)temp_id).ToString("s"), "Z");
				}
				else
				{
					id_val = temp_id.ToString();
				}


				string metadata_url = Program.config_couchdb_url + "/mmrds/"  + id_val;

				System.Net.WebRequest request = System.Net.WebRequest.Create(new System.Uri(metadata_url));
				request.Method = "PUT";
				request.ContentType = "application/json";
				request.ContentLength = object_string.Length;
				request.PreAuthenticate = false;

				//System.Text.StringBuilder headerBuilder = new System.Text.StringBuilder();

				var check_document_curl = new cURL ("GET", null, metadata_url, null, null, null);

                if (this.Request.Headers.Contains ("Cookie") && this.Request.Headers.GetValues ("Cookie").Count () > 0) 
                {
                    string [] cookie_set = this.Request.Headers.GetValues ("Cookie").First ().Split (';');
                    for (int i = 0; i < cookie_set.Length; i++) 
                    {
                        string [] auth_session_token_array = cookie_set [i].Split ('=');
                        if (auth_session_token_array [0].Trim () == "AuthSession") 
                        {
                            request.Headers.Add ("Cookie", "AuthSession=" + auth_session_token_array [1]);
                            request.Headers.Add ("X-CouchDB-WWW-Authenticate", auth_session_token_array [1]);
							check_document_curl.AddHeader ("Cookie", "AuthSession=" + auth_session_token_array [1]);
							check_document_curl.AddHeader ("X-CouchDB-WWW-Authenticate", auth_session_token_array [1]);
                            break;
                        }
                    }
                }



				// check if doc exists

				try 
				{
					string document_json = null;
					document_json = check_document_curl.execute ();
					var check_docuement_curl_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (document_json);
					IDictionary<string, object> updater = queue_request as IDictionary<string, object>;
					IDictionary<string, object> result_dictionary = check_docuement_curl_result as IDictionary<string, object>;
					if (result_dictionary.ContainsKey ("_rev")) 
					{
						updater ["_rev"] = result_dictionary ["_rev"];
						object_string = Newtonsoft.Json.JsonConvert.SerializeObject (queue_request, settings);
						//System.Console.WriteLine ("json\n{0}", object_string);
					}

				} 
				catch (Exception ex) 
				{
					// do nothing for now document doesn't exsist.
				}


                /*
				if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
				{
					string[] cookie_set = this.Request.Headers.GetValues("Cookie").First().Split(';');
					for(int i = 0; i < cookie_set.Length; i++)
					{
						string[] auth_session_token_item = cookie_set[i].Split('=');
						if(auth_session_token_item[0].Trim() == "AuthSession")
						{
							
							auth_session_token = auth_session_token_item[1];
							request.Headers.Add("Cookie", "AuthSession=" + auth_session_token);
							request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token);

							headerBuilder.Append("content-type application/json|");
							headerBuilder.Append("Cookie  AuthSession=");
							headerBuilder.Append(auth_session_token);
							headerBuilder.Append("|X-CouchDB-WWW-Authenticate ");
							headerBuilder.Append(auth_session_token);

							break;
						}
					}
				}*/

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

						result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);

					}
					catch(Exception ex)
					{
						Console.Write("auth_session_token: {0}", auth_session_token);
						Console.WriteLine (ex);
					}
				}

				if (!result.ok) 
				{

				}

			}
			catch(Exception ex) 
			{
				Console.Write("auth_session_token: {0}", auth_session_token);
				Console.WriteLine (ex);
			}

			return result;

		} 



        /*
DELETE /recipes/FishStew?rev=1-9c65296036141e575d32ba9c034dd3ee HTTP/1.1
Accept: application/json
Host: localhost:5984
or

DELETE /recipes/FishStew HTTP/1.1
Accept: application/json
If-Match: 1-9c65296036141e575d32ba9c034dd3ee
Host: localhost:5984


HTTP/1.1 200 OK
Cache-Control: must-revalidate
Content-Length: 71
Content-Type: application/json
Date: Wed, 14 Aug 2013 12:23:13 GMT
ETag: "2-056f5f44046ecafc08a2bc2b9c229e20"
Server: CouchDB (Erlang/OTP)

{
    "id": "FishStew",
    "ok": true,
    "rev": "2-056f5f44046ecafc08a2bc2b9c229e20"
}


        */
        public System.Dynamic.ExpandoObject Delete(string case_id = null, string rev = null) 
        { 
            try
            {
                string request_string = null;

                if (!string.IsNullOrWhiteSpace (case_id) && !string.IsNullOrWhiteSpace (rev)) 
                {
                    request_string = Program.config_couchdb_url + "/mmrds/" + case_id + "?rev=" + rev;
                }
                else 
                {
                    return null;
                }

                var delete_report_curl = new cURL ("DELETE", null, request_string, null);
				var check_document_curl = new cURL ("GET", null, Program.config_couchdb_url + "/mmrds/" + case_id, null, null, null);

                if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
                {
                    string[] cookie_set = this.Request.Headers.GetValues("Cookie").First().Split(';');
                    for(int i = 0; i < cookie_set.Length; i++)
                    {
                        string[] auth_session_token = cookie_set[i].Split('=');
                        if(auth_session_token[0].Trim() == "AuthSession")
                        {
                            delete_report_curl.AddHeader("Cookie", "AuthSession=" + auth_session_token[1]);
                            delete_report_curl.AddHeader("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
							check_document_curl.AddHeader ("Cookie", "AuthSession=" + auth_session_token [1]);
							check_document_curl.AddHeader ("X-CouchDB-WWW-Authenticate", auth_session_token [1]);
                            break;
                        }
                    }
                }


								// check if doc exists

				try 
				{
					string document_json = null;
					document_json = check_document_curl.execute ();
					var check_docuement_curl_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (document_json);
					IDictionary<string, object> result_dictionary = check_docuement_curl_result as IDictionary<string, object>;
					if (result_dictionary.ContainsKey ("_rev")) 
					{
						request_string = Program.config_couchdb_url + "/mmrds/" + case_id + "?rev=" + result_dictionary ["_rev"];
						//System.Console.WriteLine ("json\n{0}", object_string);
					}

				} 
				catch (Exception ex) 
				{
					// do nothing for now document doesn't exsist.
				}




                string responseFromServer = delete_report_curl.execute ();;

                var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

                return result;







            }
            catch(Exception ex)
            {
                Console.WriteLine (ex);

            } 

            return null;
        } 


	} 
}

