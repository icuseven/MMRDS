using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;

namespace mmria.util
{
	public class MiddlewareUrlRewriter : OwinMiddleware
	{
	    //private static readonly PathString ContentVersioningUrlSegments = PathString.FromUriComponent("/content/v");
		private static readonly PathString ContentVersioningUrlSegments = PathString.FromUriComponent("/api/zip");
	
	    public MiddlewareUrlRewriter(OwinMiddleware next)
	        : base(next)
	    {
	    }
	
	    public override async Task Invoke(IOwinContext context)
	    {
	        PathString remainingPath;
	        if (context.Request.Path.StartsWithSegments(ContentVersioningUrlSegments, out remainingPath) && remainingPath.HasValue && remainingPath.Value.Length > 1)
	        {
	            //context.Request.Path = new PathString("/Content" + remainingPath.Value.Substring(remainingPath.Value.IndexOf('/', 1)));


				context.Request.Path = new PathString("/api/" + remainingPath.Value.Substring(remainingPath.Value.IndexOf('/', 1)));
	        }
	
	        await Next.Invoke(context);
	    }
	}
}

