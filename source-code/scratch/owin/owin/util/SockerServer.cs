using System;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;

//https://github.com/jjrdk/websocket-sharp#websocket-server


// reasearch
// https://github.com/lstern/websocket-sharp/blob/master/Example/Program.cs


namespace mmria.util
{
	public class WebSocketServer : WebSocketBehavior
	{
		//public WebSocketServer(): base() {}
		//public WebSocketServer(string p_value): base(p_value) {}

		protected override Task OnMessage (MessageEventArgs e)
		{
			/*
			byte [] bytes = new byte[e.Data.Length];
			e.Data.Position = 0;
			e.Data.Read(bytes, 0, (int)e.Data.Length);
			System.IO.BinaryWriter w = new System.IO.BinaryWriter(e.Data);
			w.Write(bytes);
			w.Flush();
			w.Close();
			*/


			var msg = (e.Data.ToString() == "BALUS") ?
				"I've been balused already..."
				: e.Text.ReadToEnd();

			return Send (msg);
		}
		/*
		protected override void OnError( ErrorEventArgs e)
		{
		}

		protected override void OnClose(CloseEventArgs e) 
		{
			//Console.WriteLine ("Laputa says: " + e.Data);
		}*/

	}

	public class Chat : WebSocketBehavior
	{
		private string _suffix;

		public Chat ()
			: this (null)
		{
		}

		public Chat (string suffix)
		{
			_suffix = suffix ?? String.Empty;
		}

		protected override Task OnMessage (MessageEventArgs e)
		{
			return Sessions.Broadcast (e.Data + _suffix);
		}
	}

}

