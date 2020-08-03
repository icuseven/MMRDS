using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using mmria.common.model;
using System.Net.Http;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
	[Route("api/[controller]")]
	public class substance_mappingController: ControllerBase
	{ 
		[Authorize(Roles  = "form_designer")]
		//[Route("{id}")]
		[HttpPost]
		public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post
        (
			
            //mmria.common.metadata.Add_Attachement add_attachement
        ) 
		{ 
			string document_content;
			mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();

			try
			{
				System.IO.Stream dataStream0 = this.Request.Body;
				//dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
				System.IO.StreamReader reader0 = new System.IO.StreamReader (dataStream0);

				document_content = await reader0.ReadToEndAsync ();

				System.Dynamic.ExpandoObject substance_mapping = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(document_content);

				IDictionary<string, object> result_dictionary = substance_mapping as IDictionary<string, object>;
				if 
				(
					result_dictionary.ContainsKey ("_id") &&
					result_dictionary["_id"].ToString() == "substance-mapping"
				) 
				{
					string url = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/substance-mapping";
					//System.Console.WriteLine ("json\n{0}", object_string);
			
					cURL put_document_curl = new cURL ("PUT", null, url, document_content, Program.config_timer_user_name, Program.config_timer_value);

					bool save_document = false;


					try
					{
						string responseFromServer = await put_document_curl.executeAsync();
						result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);

				
					}
					catch(Exception ex)
					{
						Console.WriteLine(ex);
					}
				}

				if (!result.ok) 
				{

				}
				
			}
			catch(Exception ex) 
			{
				Console.WriteLine (ex);
			}
				
			return result;
		} 

		public static string Base64Decode(string base64EncodedData) 
		{
			var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
			return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
		}
 
	} 
}

