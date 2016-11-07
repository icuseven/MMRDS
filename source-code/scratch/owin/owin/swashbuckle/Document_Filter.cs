using System;
using Swashbuckle.Swagger;
using System.Web.Http.Description;
using System.Linq;

namespace owin.swashbuckle
{
	public class Document_Filter: IDocumentFilter
	{
		public void Apply(SwaggerDocument swaggerDoc, SchemaRegistry schemaRegistry, IApiExplorer apiExplorer)
		{
			foreach (PathItem path in swaggerDoc.paths.Where( p => p.Key != "/api/importAPI").Select( kvp=> kvp.Value ))
			{
				
				path.delete = null;
				path.get = null; // leaving GET in
				path.head = null;
				path.options = null;
				path.patch = null;
				path.post = null;
				path.put = null;
			}
		}
	}
}

