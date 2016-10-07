using System;
using Owin.WebSocket;

namespace owin
{
	public class MyWebSocket : WebSocketConnection
	{
		public MyWebSocket ()
		{
		}

		public override async System.Threading.Tasks.Task OnMessageReceived(ArraySegment<byte> message, System.Net.WebSockets.WebSocketMessageType type)
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
			await SendText(toSend, true);
		}

		//public override void OnOpen(){}
		//public override void OnClose(WebSocketCloseStatus? closeStatus, string closeStatusDescription){}
		//public override bool Authenticate(IOwinRequest request){return true;}
	}
}

