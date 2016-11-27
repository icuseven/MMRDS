using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace owin
{
	public class userController: ApiController 
	{ 
		// GET api/values 
		public IEnumerable<owin.model.couchdb.alldocs_response> Get() 
		{ 
			try
			{
				string request_string = this.get_couch_db_url() + "/_users";
				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

				request.PreAuthenticate = false;


				if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
				{
					string[] auth_session_token = this.Request.Headers.GetValues("Cookie").First().Split('=');
					request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
					//request.Headers.Add(this.Request.Headers.GetValues("Cookie").First(), "");
					request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
				}

				System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				string responseFromServer = reader.ReadToEnd ();
				owin.model.couchdb.alldocs_response json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<owin.model.couchdb.alldocs_response>(responseFromServer);
			
				owin.model.couchdb.alldocs_response[] result =  new owin.model.couchdb.alldocs_response[] 
				{ 
					json_result
				}; 

				return result;

			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return null;
			//return new owin.model.couchdb.user[] { default(owin.model.couchdb.user), default(owin.model.couchdb.user) }; 
		} 

		// GET api/values/5 
		public owin.model.couchdb.user Get(string id) 
		{ 
			return default(owin.model.couchdb.user); 
		} 

		// POST api/values 
		public void Post([FromBody]owin.model.couchdb.user value) 
		{ 
		} 

		// PUT api/values/5 
		public void Put(string id, [FromBody]owin.model.couchdb.user value) 
		{ 
		} 

		// DELETE api/values/5 
		public void Delete(string id) 
		{ 
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

