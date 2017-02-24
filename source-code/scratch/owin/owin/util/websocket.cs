using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace mmria.WebSockets
{	
	//https://github.com/bryceg/Owin.WebSocket
		//http://owin.org/spec/extensions/owin-WebSocket-Extension-v0.3.0.htm
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
}



