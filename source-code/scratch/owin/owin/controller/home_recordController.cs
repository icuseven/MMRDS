using System.Collections.Generic;
using System.Web.Http;

namespace mmria.server
{
	public class home_recordController: ApiController 
	{ 
		// GET api/values 
		//public IEnumerable<master_record> Get() 
		public IEnumerable< mmria.server.model.home_record> Get() 
		{ 
			return new  mmria.server.model.home_record[] 
			{ 
				new  mmria.server.model.home_record(){ 
					id =  "e5c511cc-40ec-4730-9656-95f53582a51b",
					record_id = "VA-2011-1703",
					first_name = "Caterina",
					middle_name = "",
					last_name = "Schroeder",
					date_of_death = "3/8/2011",
					state_of_death = "VA",
					agency_case_id = "",
					is_valid_maternal_mortality_record = true
				},
				new  mmria.server.model.home_record(){ 
					id =  "42ad2325-0713-4fd0-a49e-5b03ee38e0e3",
					record_id = "TN-2011-2722",
					first_name = "Bibiana",
					middle_name = "",
					last_name = "Hendriks",
					date_of_death = "12/9/2011",
					state_of_death = "TN",
					agency_case_id = "",
					is_valid_maternal_mortality_record = false
				},
				new  mmria.server.model.home_record(){ 
					id =  "1954deef-e6bb-4ae1-af88-15abffbba7db",
					record_id = "RI-2012-9090",
					first_name = "Helen",
					middle_name = "",
					last_name = "Hendricks",
					date_of_death = "RI",
					state_of_death = "RI",
					agency_case_id = "",
					is_valid_maternal_mortality_record = true
				},
				}; 
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
		public  mmria.server.model.home_record Get(int id) 
		{ 
			return default( mmria.server.model.home_record); 
		} 

		// POST api/values 
		public void Post([FromBody] mmria.server.model.home_record value) 
		{ 
		} 

		// PUT api/values/5 
		public void Put(int id, [FromBody] mmria.server.model.home_record value) 
		{ 
		} 

		// DELETE api/values/5 
		public void Delete(System.Guid  id) 
		{ 
		} 
	} 
}

