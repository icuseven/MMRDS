using System;
using Owin;
using Microsoft.Owin;
using System.Threading.Tasks;

namespace mmria
{
	public class RequestSizeLimitingMiddleware : OwinMiddleware
	{
		public RequestSizeLimitingMiddleware(OwinMiddleware next, long 
			maxRequestSizeInBytes)
			: base(next)
		{
			this.MaxRequestSizeInBytes = maxRequestSizeInBytes;
		}
		public long MaxRequestSizeInBytes { get; private set; }
		public override async Task Invoke(IOwinContext context)
		{
			IOwinRequest request = context.Request;
			if (request != null)
			{
				string[] values = null;
				if (request.Headers.TryGetValue("Content-Length", out values))
				{
					if (Convert.ToInt64(values[0]) > MaxRequestSizeInBytes)
					{
						throw new InvalidOperationException(string.Format("Request size exceeds the allowed maximum size of {0} bytes", MaxRequestSizeInBytes));
					}

				}
			}

			await Next.Invoke(context);
		}
	}
}

