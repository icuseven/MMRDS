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

		static void Main(string[] args)
		{
			var url = "http://localhost:12345";
			//var root = args.Length > 0 ? args[0] : ".";
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

			//using (Microsoft.Owin.Hosting.WebApp.Start<Startup>(url))
			//{
			Microsoft.Owin.Hosting.WebApp.Start(url, builder => builder.UseFileServer(options));            
				Console.WriteLine("Listening at " + url);

				//http://odetocode.com/blogs/scott/archive/2014/02/10/building-a-simple-file-server-with-owin-and-katana.aspx




				Console.ReadLine();
			//}
		}


	}

	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			#if DEBUG
			app.UseErrorPage();
			#endif
			app.UseWelcomePage("/");


			// Configure Web API for self-host. 
			HttpConfiguration config = new HttpConfiguration(); 
			config.Routes.MapHttpRoute( 
				name: "DefaultApi", 
				routeTemplate: "api/{controller}/{id}", 
				defaults: new { id = RouteParameter.Optional } 
			); 

			app.UseWebApi(config); 

		}
	}
}
