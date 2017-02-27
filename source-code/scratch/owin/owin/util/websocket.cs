using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Owin;

namespace mmria.WebSockets
{	
	//https://github.com/bryceg/Owin.WebSocket
		//http://owin.org/spec/extensions/owin-WebSocket-Extension-v0.3.0.htm

	//http://stackoverflow.com/questions/30836647/owin-websockets-understanding-iowincontext-and-websocketaccept

	using WebSocketAccept =
		Action
		<
		IDictionary<string, object>, // WebSocket Accept parameters
	Func // WebSocketFunc callback
	<
	IDictionary<string, object>, // WebSocket environment
	Task // Complete
	>
	>;


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
			WebSocketAccept accept = context.Get<WebSocketAccept>("websocket.Accept");
			if (accept == null)
			{
				// Not a websocket request
				return next();
			}

			accept(null, WebSocketEcho);

			return Task.FromResult<object>(null);
		}


		private async Task WebSocketEcho(IDictionary<string, object> websocketContext)
		{
			var sendAsync = (WebSocketSendAsync)websocketContext["websocket.SendAsync"];
			var receiveAsync = (WebSocketReceiveAsync)websocketContext["websocket.ReceiveAsync"];
			var closeAsync = (WebSocketCloseAsync)websocketContext["websocket.CloseAsync"];
			var callCancelled = (CancellationToken)websocketContext["websocket.CallCancelled"];

			byte[] buffer = new byte[1024];
			WebSocketReceiveAsync received = await receiveAsync(new ArraySegment<byte>(buffer), callCancelled);

			object status;
			while (!websocketContext.TryGetValue("websocket.ClientCloseStatus", out status) || (int)status == 0)
			{
				// Echo anything we receive
				await sendAsync(new ArraySegment<byte>(buffer, 0, received.Item3), received.Item1, received.Item2, callCancelled);

				received = await receiveAsync(new ArraySegment<byte>(buffer), callCancelled);
			}

			await closeAsync((int)websocketContext["websocket.ClientCloseStatus"], (string)websocketContext["websocket.ClientCloseDescription"], callCancelled);
		}
	}
}



