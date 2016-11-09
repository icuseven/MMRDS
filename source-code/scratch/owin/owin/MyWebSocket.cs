using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace owin.websocket
{


	// http://owin.org/extensions/owin-WebSocket-Extension-v0.4.0.htm
	using WebSocketAccept = Action<IDictionary<string, object>, // options
	Func<IDictionary<string, object>, Task>>; // callback
	using WebSocketCloseAsync =
		Func<int /* closeStatus */,
	string /* closeDescription */,
	CancellationToken /* cancel */,
	Task>;
	using WebSocketReceiveAsync =
		Func<ArraySegment<byte> /* data */,
	CancellationToken /* cancel */,
	Task<Tuple<int /* messageType */,
	bool /* endOfMessage */,
	int /* count */>>>;
	using WebSocketSendAsync =
		Func<ArraySegment<byte> /* data */,
	int /* messageType */,
	bool /* endOfMessage */,
	CancellationToken /* cancel */,
	Task>;
	using WebSocketReceiveResult = Tuple<int, // type
	bool, // end of message?
	int>; // count


	public class MyWebSocket : WebSocketConnection
	{
		/*
		public MyWebSocket ()
		{
		}*/

		public override System.Threading.Tasks.Task OnMessageReceived(ArraySegment<byte> message, System.Net.WebSockets.WebSocketMessageType type)
		{
			//Handle the message from the client

			//Example of JSON serialization with the client
			//var json = Encoding.UT8.GetString(message.Array, message.Offset, message.Count);
			//Use something like Json.Net to read the json

			//Handle the message from the client

			//Example of JSON serialization with the client
			var json = System.Text.Encoding.UTF8.GetString(message.Array, message.Offset, message.Count);

			var toSend =  System.Text.Encoding.UTF8.GetBytes(json);

			//Echo the message back to the client as text
			return SendText(toSend, true);
		}


		private async Task WebSocketEcho(System.Collections.Generic.IDictionary<string, object> websocketContext)
		{
			var sendAsync = (WebSocketSendAsync)websocketContext["websocket.SendAsync"];
			var receiveAsync = (WebSocketReceiveAsync)websocketContext["websocket.ReceiveAsync"];
			var closeAsync = (WebSocketCloseAsync)websocketContext["websocket.CloseAsync"];
			var callCancelled = (CancellationToken)websocketContext["websocket.CallCancelled"];

			byte[] buffer = new byte[1024];
			WebSocketReceiveResult received = await receiveAsync(new ArraySegment<byte>(buffer), callCancelled);

			object status;
			while (!websocketContext.TryGetValue("websocket.ClientCloseStatus", out status) || (int)status == 0)
			{
				// Echo anything we receive
				await sendAsync(new ArraySegment<byte>(buffer, 0, received.Item3), received.Item1, received.Item2, callCancelled);

				received = await receiveAsync(new ArraySegment<byte>(buffer), callCancelled);
			}

			await closeAsync((int)websocketContext["websocket.ClientCloseStatus"], (string)websocketContext["websocket.ClientCloseDescription"], callCancelled);
		}

		public override void OnOpen()
		{
			//Debugger.Break();
			SendText(new byte[] { }, true);
		}

		public override void OnReceiveError (Exception error)
		{
			throw error;
		}
		//public override void OnOpen(){}
		//public override void OnClose(WebSocketCloseStatus? closeStatus, string closeStatusDescription){}
		//public override bool Authenticate(IOwinRequest request){return true;}
	}
}

