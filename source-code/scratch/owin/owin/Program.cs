using System;
using Microsoft.Owin;
using Owin;

using System.Web.Http;

namespace owin
{
	class MainClass
	{
		// http://www.asp.net/aspnet/samples/owin-katana

		//http://localhost:12345
		//http://localhost:12345/api/values
		//http://localhost:12345/api/geocode?street_address=123 main street&city=los angeles&state=ca&zip=90007
		//http://localhost:12345/api/session?userid=mmrds&password=mmrds
		static void Main(string[] args)
		{

			//data_access da = new data_access ();
			//da.login ("mmrds","mmrds");

			var url = "http://localhost:12345";
			Microsoft.Owin.Hosting.WebApp.Start(url);            
			Console.WriteLine("Listening at " + url);

				//http://odetocode.com/blogs/scott/archive/2014/02/10/building-a-simple-file-server-with-owin-and-katana.aspx
			Console.ReadLine();
		}
	}

	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			#if DEBUG
			app.UseErrorPage();
			#endif
			//app.UseWelcomePage("/");

			// Configure Web API for self-host. 
			HttpConfiguration config = new HttpConfiguration(); 
			config.Routes.MapHttpRoute( 
				name: "DefaultApi", 
				routeTemplate: "api/{controller}/{id}", 
				defaults: new { id = RouteParameter.Optional } 
			); 


			config.Formatters.Clear();
			config.Formatters.Add(new  System.Net.Http.Formatting.JsonMediaTypeFormatter());
			config.Formatters.JsonFormatter.SerializerSettings =
				new Newtonsoft.Json.JsonSerializerSettings
			{
				ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
			};/**/

			app.UseWebApi(config); 

			var root = "/vagrant/source-code/scratch/owin/owin/psk/app";
			var fileSystem = new Microsoft.Owin.FileSystems.PhysicalFileSystem(root);
			var options = new Microsoft.Owin.StaticFiles.FileServerOptions()
			{
				EnableDirectoryBrowsing = true,
				EnableDefaultFiles = true,
				DefaultFilesOptions = { DefaultFileNames = {"index.html"}},
				FileSystem = fileSystem,
				StaticFileOptions = { ContentTypeProvider = new Microsoft.Owin.StaticFiles.ContentTypes.FileExtensionContentTypeProvider() }
			};
			app.UseFileServer (options);
		}
	}
}
