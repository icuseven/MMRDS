using System.Collections.Generic;
using System.Web.Http;

namespace owin
{
	public class metadataController: ApiController 
	{ 

		public string Get() 
		{ 
			System.Console.WriteLine ("Recieved message.");

			return "done";
		} 
		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public string Get(string value) 
		{ 
			System.Console.WriteLine ("Recieved message\n { value }");

			return "done";
		} 

		private void PutDocument(string postUrl, string document)
		{
			byte[] data = new System.Text.ASCIIEncoding().GetBytes(document);

			System.Net.WebRequest request = System.Net.WebRequest.Create("request_string");
			request.UseDefaultCredentials = true;
			request.Credentials = new System.Net.NetworkCredential("_username", "_password");
			request.Method = "PUT";
			request.ContentType = "text/json";
			request.ContentLength = data.Length;

			using (System.IO.StreamWriter streamWriter = new System.IO.StreamWriter(request.GetRequestStream()))
			{
				try
				{
					streamWriter.Write(document);
					streamWriter.Flush();
					streamWriter.Close();

					System.Net.HttpWebResponse httpResponse = (System.Net.HttpWebResponse)request.GetResponse();
					using (System.IO.StreamReader streamReader = new System.IO.StreamReader(httpResponse.GetResponseStream()))
					{
						string result = streamReader.ReadToEnd();
						streamReader.Close();
					}
				}
				catch (System.Exception e)
				{
					//_logger.Error("Exception thrown when contacting service.", e);
					//_logger.ErrorFormat("Error posting document to {0}", postUrl);
				}
			}
		}


		// GET api/values/5 
		public home_record Get(int id) 
		{ 
			return default(home_record); 
		} 

		// POST api/values 
		//[Route("api/metadata")]
		[HttpPost]
		public string Post([FromBody] string value) 
		{ 
			System.Console.WriteLine ($"Recieved message.");
			System.Console.WriteLine (value);


			string request_string = this.Request.Content.ReadAsStringAsync().Result;
			System.Console.WriteLine(DecodeUrlString(request_string));


			//UnescapeDataString

			/*
			System.IO.Stream dataStream = await this.Request.Content.ReadAsStreamAsync().Result;
			// Open the stream using a StreamReader for easy access.
			System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
			// Read the content.
			string request_string = reader.ReadToEnd ();
			System.Console.WriteLine (request_string);*/
			return "{ result: 'done' }";
		} 


		//private void async process(System.Net.Http.)
		// PUT api/values/5 
		public void Put(int id, [FromBody]home_record value) 
		{ 
		} 

		// DELETE api/values/5 
		public void Delete(System.Guid  id) 
		{ 
		} 

		private static string DecodeUrlString(string url) {
			string newUrl;
			while ((newUrl = System.Uri.UnescapeDataString(url)) != url)
				url = newUrl;
			return newUrl;
		}
	} 
}

