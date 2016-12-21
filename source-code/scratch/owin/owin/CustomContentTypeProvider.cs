using System;

namespace mmria.server
{
	public class CustomContentTypeProvider : Microsoft.Owin.StaticFiles.ContentTypes.FileExtensionContentTypeProvider
	{
		public CustomContentTypeProvider()
		{
			Mappings.Add(".json", "application/json");
			//Mappings.Add (".wolff", "application/x-font-woff");
			//Mappings.Add (".wolff2", "application/font-woff2");
			//Mappings.Add (".ttf", "application/x-font-ttf");

		}
	}
}

