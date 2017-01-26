using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using mmria.console.data;
using System.Linq;

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


			if (args.Length > 1 && args[1].ToLower().StartsWith("auth_token"))
			{
				this.auth_token = args[1].Split(':')[1];
			}
			else
			{
				/*
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
				}*/
			}

			mmria.common.metadata.app metadata = mmria_server.get_metadata();
			System.Dynamic.ExpandoObject all_cases = get_all_cases();


			System.Collections.Generic.Dictionary<string, int> path_to_int_map = new Dictionary<string, int>();
			System.Collections.Generic.Dictionary<string, string> path_to_file_name_map = new Dictionary<string, string>();
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> path_to_node_map = new Dictionary<string, mmria.common.metadata.node>();
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> path_to_grid_map = new Dictionary<string, mmria.common.metadata.node>();
			System.Collections.Generic.Dictionary<string, string> multi_form_to_grid_map = new Dictionary<string, string>();
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> grid_path_to_multi_form_map = new Dictionary<string, mmria.common.metadata.node>();

			System.Collections.Generic.HashSet<string> path_to_flat_map = new System.Collections.Generic.HashSet<string>();

			generate_path_map(metadata, "", "mmria_case_export.csv", "", path_to_int_map, path_to_file_name_map, path_to_node_map, path_to_grid_map, grid_path_to_multi_form_map, multi_form_to_grid_map, path_to_flat_map);

			Console.WriteLine("Hello World!");

			int stream_file_count = 0;
			foreach (string file_name in path_to_file_name_map.Select(kvp => kvp.Value).Distinct())
			{
				Console.WriteLine(file_name);
				stream_file_count++;
			}
			Console.WriteLine("stream_file_count: {0}", stream_file_count);


		}


		private void generate_path_map
		(
			
			mmria.common.metadata.app p_metadata, string p_path,
			string p_file_name,
			string p_form_path,
			System.Collections.Generic.Dictionary<string, int> p_path_to_int_map,
			System.Collections.Generic.Dictionary<string, string> p_path_to_file_name_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_node_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_grid_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_multi_form_map,
			System.Collections.Generic.Dictionary<string, string> p_multi_form_to_grid_map,
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

					generate_path_map(child, p_path + "/" + child.name, p_file_name, p_form_path, p_path_to_int_map,  p_path_to_file_name_map, p_path_to_node_map, p_path_to_grid_map, p_path_to_multi_form_map, p_multi_form_to_grid_map, p_path_to_flat_map);
				}
			}
		}

		private void generate_path_map
		(
			mmria.common.metadata.node p_metadata, 
			string p_path,
			string p_file_name,
			string p_form_path,
			System.Collections.Generic.Dictionary<string, int> p_path_to_int_map,
			System.Collections.Generic.Dictionary<string, string> p_path_to_file_name_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_node_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_grid_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_multi_form_map,
			System.Collections.Generic.Dictionary<string, string> p_multi_form_to_grid_map,
			System.Collections.Generic.HashSet<string> p_path_to_flat_map
		)
		{
			bool is_flat_map = true;
			string file_name = p_file_name;
			string form_path = p_form_path;

			p_path_to_int_map.Add(p_path, p_path_to_int_map.Count);
			p_path_to_node_map.Add(p_path, p_metadata);
			p_path_to_file_name_map.Add(p_path, p_file_name);

			if (p_metadata.type == "grid")
			{
				p_path_to_grid_map.Add(p_path, p_metadata);
				is_flat_map = false;
				file_name = p_path;
				p_multi_form_to_grid_map.Add(p_path, form_path);
			}

			if (p_metadata.type == "form" && (p_metadata.cardinality == "*" || p_metadata.cardinality == "+"))
			{
				p_path_to_multi_form_map.Add(p_path, p_metadata);
				is_flat_map = false;
				file_name = p_path;
				form_path = p_path;
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

					generate_path_map(child, p_path + "/" + child.name, file_name, form_path, p_path_to_int_map, p_path_to_file_name_map, p_path_to_node_map, p_path_to_grid_map, p_path_to_multi_form_map, p_multi_form_to_grid_map, p_path_to_flat_map);
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

		public dynamic get_value(IDictionary<string, object> p_object, string p_path)
		{
			dynamic result = null;

			try
			{
				string[] path = p_path.Split('/');

				System.Text.RegularExpressions.Regex number_regex = new System.Text.RegularExpressions.Regex(@"^\d+$");

				//IDictionary<string, object> index = p_object;
				dynamic index = p_object;

				if (path[1] == "abnormal_conditions_of_newborn")
				{
					System.Console.WriteLine("break");
				}


				for (int i = 0; i < path.Length; i++)
				{
					if (i == path.Length - 1)
					{
						result = index[path[i]];
					}
					else if (number_regex.IsMatch(path[i]))
					{
						IList<object> temp_list = index as IList<object>;
						if (!(temp_list.Count > int.Parse(path[i])))
						{

						}
						index = index[int.Parse(path[i])] as IDictionary<string, object>;
					}
					else if (index[path[i]] is IList<object>)
					{
						index = index[path[i]] as IList<object>;
					}
					else if (index[path[i]] is IDictionary<string, object> && !index.ContainsKey(path[i]))
					{
						System.Console.WriteLine("Index not found. This should not happen. {0}", p_path);
					}
					else if (index[path[i]] is IDictionary<string, object>)
					{
						index = index[path[i]] as IDictionary<string, object>;
					}
					else
					{
						System.Console.WriteLine("This should not happen. {0}", p_path);
					}
				}
			}
			catch (Exception ex)
			{
				System.Console.WriteLine("case_maker.set_value bad mapping {0}\n {1}", p_path, ex);
			}

			return result;

		}


		public System.Dynamic.ExpandoObject get_all_cases()
		{
			/*
			var credential = new System.Net.NetworkCredential
			{
				UserName = "user1",
				Password = "password"
			};

			var httpClientHandler = new System.Net.Http.HttpClientHandler
			{
				Credentials = credential,
				PreAuthenticate = false
			};*/

			System.Dynamic.ExpandoObject result = null;
			//string URL = "http://user1:password@db1.mmria.org/mmrds/_all_docs";
			string URL = "http://db1.mmria.org/mmrds/_all_docs";
			string urlParameters = "?include_docs=true";
			//HttpClient client = new HttpClient(httpClientHandler, true);
			HttpClient client = new HttpClient();
			client.BaseAddress = new Uri(URL);

			var byteArray = System.Text.Encoding.ASCII.GetBytes("user1:password");
			client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));


			// Add an Accept header for JSON format.
			client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

			// List data response.
			HttpResponseMessage response = client.GetAsync(urlParameters).Result;  // Blocking call!
			if (response.IsSuccessStatusCode)
			{
				// Parse the response body. Blocking!
				result = response.Content.ReadAsAsync<System.Dynamic.ExpandoObject>().Result;
			}
			else
			{
				Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
			}

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
