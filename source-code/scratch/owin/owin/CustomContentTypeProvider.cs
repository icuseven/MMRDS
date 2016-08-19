using System;

namespace owin
{
	public class CustomContentTypeProvider : Microsoft.Owin.StaticFiles.ContentTypes.FileExtensionContentTypeProvider
	{
		public CustomContentTypeProvider()
		{
			Mappings.Add(".json", "application/json");
		}
	}
}

