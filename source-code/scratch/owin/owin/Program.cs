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
		//http://localhost:12345/api/session?userid=user1&password=password
		//http://localhost:12345/api/session
		static void Main(string[] args)
		{

			//data_access da = new data_access ();
			//da.login ("mmrds","mmrds");
			#if (CONTAINERBASED && DEBUG)
				System.Environment.SetEnvironmentVariable("geocode_api_key","7c39ae93786d4aa3adb806cb66de51b8");
				System.Environment.SetEnvironmentVariable("couchdb_url", "http://localhost:5984");
				System.Environment.SetEnvironmentVariable("web_site_url", "http://localhost:12345");
				System.Environment.SetEnvironmentVariable("file_root_folder", "/vagrant/source-code/scratch/owin/owin/psk/app");
			#endif


			#if CONTAINERBASED
				string url = System.Environment.GetEnvironmentVariable("web_site_url");
			#else
				string url = System.Configuration.ConfigurationManager.AppSettings["web_site_url"];
			#endif
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


			#if CONTAINERBASED
				string root = System.Environment.GetEnvironmentVariable("file_root_folder");
			#else
				string root = System.Configuration.ConfigurationManager.AppSettings["file_root_folder"];
			#endif

			var fileSystem = new Microsoft.Owin.FileSystems.PhysicalFileSystem(root);
			var options = new Microsoft.Owin.StaticFiles.FileServerOptions()
			{
				EnableDirectoryBrowsing = true,
				EnableDefaultFiles = true,
				DefaultFilesOptions = { DefaultFileNames = {"index.html"}},
				FileSystem = fileSystem,
				StaticFileOptions = { ContentTypeProvider = new CustomContentTypeProvider() 
				}
			};
			app.UseFileServer (options);
		}
	}
}
