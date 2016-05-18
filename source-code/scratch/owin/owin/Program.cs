using System;
using Microsoft.Owin;
using Owin;

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
		}
	}
}
