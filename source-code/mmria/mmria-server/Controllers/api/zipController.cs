using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using System.Dynamic;
using System.IO;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Authorization;


namespace mmria.server
{
	[Authorize(Roles  = "abstractor")]
	[Route("api/[controller]")]
	public class zipController: ControllerBase
	{
		public IConfiguration Configuration { get; }
		public zipController (IConfiguration configuration)
        {
            Configuration = configuration;
        }

        

		[HttpGet("{id}")]
        public async System.Threading.Tasks.Task<FileStreamResult> Get (string id)
		{
			HttpResponseMessage result = new HttpResponseMessage (System.Net.HttpStatusCode.NoContent);
			FileStream stream = null;
			string file_name = null;

			var get_item_curl = new cURL ("GET", null, Program.config_couchdb_url + "/export_queue/" + id, null, Program.config_timer_user_name, Program.config_timer_value);
			string responseFromServer = await get_item_curl.executeAsync ();
			export_queue_item export_queue_item = Newtonsoft.Json.JsonConvert.DeserializeObject<export_queue_item> (responseFromServer);

			file_name = export_queue_item.file_name;

			var path = System.IO.Path.Combine (Configuration["mmria_settings:export_directory"], export_queue_item.file_name);
			result = new HttpResponseMessage (System.Net.HttpStatusCode.OK);
			stream = new FileStream (path, FileMode.Open, FileAccess.Read);
			result.Content = new StreamContent (stream);
			result.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue ("application/octet-stream");

			export_queue_item.status = "Downloaded";

			Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
			settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
			string object_string = Newtonsoft.Json.JsonConvert.SerializeObject (export_queue_item, settings); 
			var set_item_curl = new cURL ("PUT", null, Program.config_couchdb_url + "/export_queue/" + export_queue_item._id, object_string, Program.config_timer_user_name, Program.config_timer_value);
			responseFromServer = await set_item_curl.executeAsync ();
			

			
		    return File(stream, "application/octet-stream", file_name);
		}

	}

/*
	class FileResult : IHttpActionResult
	{
	    private readonly string _filePath;
	    private readonly string _contentType;
	
	    public FileResult(string filePath, string contentType = null)
	    {
	        if (filePath == null) throw new ArgumentNullException("filePath");
	
	        _filePath = filePath;
	        _contentType = contentType;
	    }
	
	    public Task<HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
	    {
			var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
	        {
	            Content = new StreamContent(File.OpenRead(_filePath))
	        };
	
	        var contentType = _contentType ?? System.Web.Http.MimeMapping.GetMimeMapping(Path.GetExtension(_filePath));
			response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(contentType);
	
	        return Task.FromResult(response);
	    }
	}*/
}

