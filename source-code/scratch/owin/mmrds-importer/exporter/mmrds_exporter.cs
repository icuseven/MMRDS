using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using mmria.console.data;

namespace mmria.console.export
{
	public class mmrds_exporter
	{
		private string auth_token = null;


		public mmrds_exporter()
		{
			

		}
		public void Execute(string[] args)
		{
			var mmria_server = new mmria_server_api_client();

			/*
			if (args.Length > 1 && args[1].ToLower().StartsWith("auth_token"))
			{
				this.auth_token = args[1].Split(':')[1];
			}
			else
			{
				var session_list = mmria_server.login("", "");
				foreach(var session in session_list)
				if (session.ok)
				{
					this.auth_token = session.auth_session;
					System.Console.WriteLine("session.auth_session\n{0}", session.auth_session);
				}
				else
				{
					System.Console.WriteLine("unable to login\n{0}", session);
					return;
				}
			}*/

			mmria.common.metadata.app metadata = mmria_server.get_metadata();
			System.Collections.Generic.Dictionary<string, int> path_to_int_map = new Dictionary<string, int>();
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> path_to_node_map = new Dictionary<string, mmria.common.metadata.node>();
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> path_to_grid_map = new Dictionary<string, mmria.common.metadata.node>();
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> path_to_multi_form_map = new Dictionary<string, mmria.common.metadata.node>();

			System.Collections.Generic.HashSet<string> path_to_flat_map = new System.Collections.Generic.HashSet<string>();

			generate_path_map(metadata, "", path_to_int_map, path_to_node_map, path_to_grid_map, path_to_multi_form_map, path_to_flat_map);

			Console.WriteLine("Hello World!");


		}


		private void generate_path_map
		(
			
			mmria.common.metadata.app p_metadata, string p_path,
			System.Collections.Generic.Dictionary<string, int> p_path_to_int_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_node_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_grid_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_multi_form_map,
			System.Collections.Generic.HashSet<string> p_path_to_flat_map
			
		)
		{
			p_path_to_int_map.Add(p_path, p_path_to_int_map.Count);



			if (p_metadata.children != null)
			{
				IList<mmria.common.metadata.node> children = p_metadata.children as IList<mmria.common.metadata.node>;

				for (var i = 0; i < children.Count; i++)
				{
					var child = children[i];

					generate_path_map(child, p_path + "/" + child.name, p_path_to_int_map,  p_path_to_node_map, p_path_to_grid_map, p_path_to_multi_form_map, p_path_to_flat_map);
				}
			}
		}

		private void generate_path_map
		(
			mmria.common.metadata.node p_metadata, string p_path,
			System.Collections.Generic.Dictionary<string, int> p_path_to_int_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_node_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_grid_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_multi_form_map,
			System.Collections.Generic.HashSet<string> p_path_to_flat_map
		)
		{
			bool is_flat_map = true;

			p_path_to_int_map.Add(p_path, p_path_to_int_map.Count);
			p_path_to_node_map.Add(p_path, p_metadata);
			if (p_metadata.type == "grid")
			{
				p_path_to_grid_map.Add(p_path, p_metadata);
				is_flat_map = false;
			}

			if (p_metadata.type == "form" && (p_metadata.cardinality == "*" || p_metadata.cardinality == "+"))
			{
				p_path_to_multi_form_map.Add(p_path, p_metadata);
				is_flat_map = false;
			}

			if (is_flat_map)
			{
				p_path_to_flat_map.Add(p_path);
			}

			if (p_metadata.children != null)
			{
				IList<mmria.common.metadata.node> children = p_metadata.children as IList<mmria.common.metadata.node>;

				for (var i = 0; i < children.Count; i++)
				{
					var child = children[i];

					generate_path_map(child, p_path + "/" + child.name, p_path_to_int_map, p_path_to_node_map, p_path_to_grid_map, p_path_to_multi_form_map, p_path_to_flat_map);
				}
			}
		}


		public string get_csv_connection_string(string p_file_name)
		{
			// @"mapping-file-set/MMRDS-Mapping-NO-GRIDS-test.csv"
			string result = string.Format(
				@"Provider=Microsoft.Jet.OleDb.4.0; Data Source={0};Extended Properties=""Text;HDR=YES;FMT=Delimited""",
				p_file_name
			);

			return result;
		}

		public mmria.common.metadata.app get_metadata()
		{
			mmria.common.metadata.app result = null;

			string URL = "http://test.mmria.org/api/metadata";
			//string urlParameters = "?api_key=123";
			string urlParameters = "";

			HttpClient client = new HttpClient();
			client.BaseAddress = new Uri(URL);

			// Add an Accept header for JSON format.
			client.DefaultRequestHeaders.Accept.Add(
			new MediaTypeWithQualityHeaderValue("application/json"));

			// List data response.
			HttpResponseMessage response = client.GetAsync(urlParameters).Result;  // Blocking call!
			if (response.IsSuccessStatusCode)
			{
				// Parse the response body. Blocking!
				result = response.Content.ReadAsAsync<mmria.common.metadata.app>().Result;
			}
			else
			{
				Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
			}

			return result;
		}


	}
}
