using System;
using Microsoft.Owin;
using Owin;

using System.Web.Http;

namespace owin
{
	class MainClass
	{

		static void Main(string[] args)
		{
			using (Microsoft.Owin.Hosting.WebApp.Start<Startup>("http://localhost:12345"))
			{
				Console.ReadLine();
			}
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
