using System;
using Swashbuckle.Application;
using Swashbuckle.Swagger;
using System.Collections.Concurrent;
using System.Web;


namespace owin
{
	public class CachingSwaggerProvider : ISwaggerProvider
	{
		private static ConcurrentDictionary<string, SwaggerDocument> _cache =
			new ConcurrentDictionary<string, SwaggerDocument>();

		private readonly ISwaggerProvider _swaggerProvider;

		public CachingSwaggerProvider(ISwaggerProvider swaggerProvider)
		{
			_swaggerProvider = swaggerProvider;
		}

		public SwaggerDocument GetSwagger(string rootUrl, string apiVersion)
		{
			//HttpContext httpContext = HttpContext.Current;
			//string name = httpContext.User.Identity.Name;
			string name = "user1";
			var cacheKey = string.Format("{0}_{1}_{2}", rootUrl, apiVersion, name);
			return _cache.GetOrAdd(cacheKey, (key) => _swaggerProvider.GetSwagger(rootUrl, apiVersion));
		}
	}
}

