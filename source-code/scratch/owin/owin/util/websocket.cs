using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Owin;

namespace mmria.WebSockets
{	
	//https://github.com/bryceg/Owin.WebSocket
		//http://owin.org/spec/extensions/owin-WebSocket-Extension-v0.3.0.htm

	//http://stackoverflow.com/questions/30836647/owin-websockets-understanding-iowincontext-and-websocketaccept

	 using WebSocketFunc =
		 Func<
			IDictionary<string, object>, // WebSocket Environment
		 	Task // Complete
		 >;

	 using WebSocketSendAsync =
		 Func<
		 	ArraySegment<byte> /* data */,
			int /* messageType */,
			bool /* endOfMessage */,
			System.Threading.CancellationToken /* cancel */,
			Task
		 >;

	using WebSocketReceiveAsync =
		Func<
			ArraySegment<byte> /* data */,
			System.Threading.CancellationToken /* cancel */,
			Task<Tuple<
				int /* messageType */,
				bool /* endOfMessage */,
				int? /* count */,
				int? /* closeStatus */,
				string /* closeStatusDescription */
				>
			>
		 >;

	 using WebSocketReceiveTuple =
		Tuple<
			int /* messageType */,
			bool /* endOfMessage */,
			int? /* count */,
			int? /* closeStatus */,
			string /* closeStatusDescription */
		>;

	using WebSocketCloseAsync =
		Func<
			int /* closeStatus */,
			string /* closeDescription */,
			System.Threading.CancellationToken /* cancel */,
			Task
		>;

	public class websocket
	{
		public void Configuration(IAppBuilder app)
		{
			app.Use(UpgradeToWebSockets);
			app.UseWelcomePage();
		}

		// Run once per request
		private Task UpgradeToWebSockets(Microsoft.Owin.IOwinContext context, Func<Task> next)
		{
			WebSocketReceiveAsync accept = context.Get<WebSocketReceiveAsync>("websocket.Accept");
			if (accept == null)
			{
				// Not a websocket request
				return next();
			}

			accept(null, WebSocketSendAsync);

			return Task.FromResult<object>(null);
		}
	}
}



