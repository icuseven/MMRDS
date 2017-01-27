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
		private string user_name = null;
		private string password = null;

		public mmrds_exporter()
		{
			

		}
		public void Execute(string[] args)
		{
			var mmria_server = new mmria_server_api_client();


			if (args.Length > 1)
			{
				for (var i = 1; i < args.Length; i++)
				{
					string arg = args[i];
					if (arg.ToLower().StartsWith("auth_token"))
					{
						this.auth_token = arg.Split(':')[1];
					}
					else if (arg.ToLower().StartsWith("user_name"))
					{
						this.user_name = arg.Split(':')[1];
					}
					else if (arg.ToLower().StartsWith("password"))
					{
						this.password = arg.Split(':')[1];
					}
				}
			}
			/*else
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
			dynamic all_cases = get_all_cases(this.user_name, this.password);



			foreach (KeyValuePair<string, object> kvp in all_cases)
			{
				System.Console.WriteLine(kvp.Key);
			}


			System.Collections.Generic.Dictionary<string, int> path_to_int_map = new Dictionary<string, int>();
			System.Collections.Generic.Dictionary<string, string> path_to_file_name_map = new Dictionary<string, string>();
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> path_to_node_map = new Dictionary<string, mmria.common.metadata.node>();
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> path_to_grid_map = new Dictionary<string, mmria.common.metadata.node>();
			System.Collections.Generic.Dictionary<string, string> multi_form_to_grid_map = new Dictionary<string, string>();
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> grid_path_to_multi_form_map = new Dictionary<string, mmria.common.metadata.node>();

			System.Collections.Generic.HashSet<string> path_to_flat_map = new System.Collections.Generic.HashSet<string>();

			System.Collections.Generic.Dictionary<string, WriteCSV> path_to_csv_writer = new Dictionary<string, WriteCSV>();

			generate_path_map(metadata, "", "mmria_case_export", "", path_to_int_map, path_to_file_name_map, path_to_node_map, path_to_grid_map, grid_path_to_multi_form_map, multi_form_to_grid_map, path_to_flat_map);



			int stream_file_count = 0;
			foreach (string file_name in path_to_file_name_map.Select(kvp => kvp.Value).Distinct())
			{
				path_to_csv_writer.Add(file_name, new WriteCSV(file_name));
				Console.WriteLine(file_name);
				stream_file_count++;
			}
			Console.WriteLine("stream_file_count: {0}", stream_file_count);

			// create header row
			System.Data.DataColumn column = new System.Data.DataColumn("id", typeof(string));
			path_to_csv_writer["mmria_case_export.csv"].Table.Columns.Add(column);

			foreach (string path in path_to_flat_map)
			{
				if (
					path_to_node_map[path].type.ToLower() == "app" ||
					path_to_node_map[path].type.ToLower() == "form" ||
					path_to_node_map[path].type.ToLower() == "group" ||
					path_to_node_map[path].type.ToLower() == "grid"

				  )
				{
					continue;
				}


				switch (path_to_node_map[path].type.ToLower())
				{
					case "number":
						column = new System.Data.DataColumn(path_to_int_map[path].ToString("X"), typeof(double));
						break;
					default:
						column = new System.Data.DataColumn(path_to_int_map[path].ToString("X"), typeof(string));
						break;

				}
				path_to_csv_writer["mmria_case_export.csv"].Table.Columns.Add(column);
			}


			foreach (System.Dynamic.ExpandoObject case_row in all_cases.rows)
			{
				IDictionary<string, object> case_doc = ((IDictionary<string, object>)case_row)["doc"] as IDictionary<string, object>;
				if (case_doc["_id"].ToString().StartsWith("_design"))
				{
					continue;
				}
				System.Data.DataRow row = path_to_csv_writer["mmria_case_export.csv"].Table.NewRow();
				row["id"] = case_doc["_id"];

				int max = 0;
				foreach (string path in path_to_flat_map)
				{
					if(
						path_to_node_map[path].type.ToLower() == "app" ||
						path_to_node_map[path].type.ToLower() == "form" ||
						path_to_node_map[path].type.ToLower() == "group" ||
						path_to_node_map[path].type.ToLower() == "grid"

					  )
					{
						continue;
					}

					
					System.Console.WriteLine("path {0}", path);

					dynamic val = get_value(case_doc as IDictionary<string, object>, path);
					/*
					if (path_to_int_map[path].ToString("X") == "41")
					{
						System.Console.Write("pause");
					}
					*/

					switch (path_to_node_map[path].type.ToLower())
					{

						case "number":
							if (val != null && (!string.IsNullOrWhiteSpace(val.ToString())))
							{
								row[path_to_int_map[path].ToString("X")] = val;
							}
							break;
						case "list":

							if
								(path_to_node_map[path].is_multiselect != null &&
							   path_to_node_map[path].is_multiselect == true 

							  )
							{
								
								IList<object> temp = val as IList<object>;
								if (temp != null && temp.Count > 0)
								{
									
									row[path_to_int_map[path].ToString("X")] = string.Join("|",temp);
								}
							}
							else
							{
								if (val != null)
								{
									row[path_to_int_map[path].ToString("X")] = val;
								}
							}

							break;
						default:
							if (val != null)
							{
								row[path_to_int_map[path].ToString("X")] = val;
							}
							break;

					}

					/*
					System.Console.WriteLine(val);
					max += 1;
					if (max > 5)
					{
						break;
					}*/
				}
				path_to_csv_writer["mmria_case_export.csv"].Table.Rows.Add(row);
				//break;
			}

			path_to_csv_writer["mmria_case_export.csv"].WriteToStream();
			Console.WriteLine("Export Finished.");
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

					generate_path_map(child, child.name, p_file_name, p_form_path, p_path_to_int_map,  p_path_to_file_name_map, p_path_to_node_map, p_path_to_grid_map, p_path_to_multi_form_map, p_multi_form_to_grid_map, p_path_to_flat_map);
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
			p_path_to_file_name_map.Add(p_path, convert_path_to_file_name(p_file_name));

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

		private string convert_path_to_file_name(string p_path)
		{
			//		/birth_certificate_infant_fetal_section / causes_of_death
			// /birth_certificate_infant_fetal_section
			bool is_added_item = false;

			System.Text.StringBuilder result = new System.Text.StringBuilder();
			string[] temp = p_path.Split('/');
			for (int i = 0; i < temp.Length - 1; i++)
			{
				string[] temp2 = temp[i].Split('_');
				for (int j = 0; j < temp2.Length; j++)
				{
					if (!string.IsNullOrWhiteSpace(temp2[j]))
					{
						result.Append(temp2[j][0]);
						is_added_item = true;
					}
				}
			}

			if (is_added_item)
			{
				result.Append("_");
			}
			result.Append(temp[temp.Length - 1]);
			result.Append(".csv");
			return result.ToString();
		}


		private void process_case_row
		(
			System.Collections.Generic.Dictionary<string, string> p_path_to_file_name_map,
			System.Collections.Generic.Dictionary<string, WriteCSV> p_path_to_csv_writer, 
			System.Dynamic.ExpandoObject case_row, string p_path)
		{
			foreach (KeyValuePair<string, object> kvp in case_row)
			{
				if (kvp.Value is IList<object>)
				{
				}
				else if (kvp.Value is IDictionary<string, object>)
				{

				}
				else
				{
					//string val = this.get_value(
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
			/*
			foreach (KeyValuePair<string, object> kvp in p_object)
			{
				System.Console.WriteLine(kvp.Key);
			}*/

			try
			{
				string[] path = p_path.Split('/');

				System.Text.RegularExpressions.Regex number_regex = new System.Text.RegularExpressions.Regex(@"^\d+$");

				//IDictionary<string, object> index = p_object;
				dynamic index = p_object;

				/*
				if (path[1] == "abnormal_conditions_of_newborn")
				{
					System.Console.WriteLine("break");
				}*/


				for (int i = 0; i < path.Length; i++)
				{
					if (i == path.Length - 1)
					{
						result = ((IDictionary <string, object>)index)[path[i]];
					}
					else if (number_regex.IsMatch(path[i]))
					{
						IList<object> temp_list = index as IList<object>;
						if (!(temp_list.Count > int.Parse(path[i])))
						{

						}
						index = index[int.Parse(path[i])] as IDictionary<string, object>;
					}
					else if (((IDictionary<string, object>)index)[path[i]] is IList<object>)
					{
						index = ((IDictionary<string, object>)index)[path[i]] as IList<object>;
					}
					else if (((IDictionary<string, object>)index)[path[i]]is IDictionary<string, object>)
					{
						index = ((IDictionary<string, object>)index)[path[i]] as IDictionary<string, object>;
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


		public dynamic get_all_cases(string p_user_name, string p_password)
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
				PreAuthenticate = false,
				Proxy = new WebProxy("http://127.0.0.1:8888"),
                UseProxy = true,
			};

			HttpClient client = new HttpClient(httpClientHandler);
			*/

			System.Dynamic.ExpandoObject result = null;
			string URL = "http://db1.mmria.org/mmrds/_all_docs";
			string urlParameters = "?include_docs=true";

			HttpClient client = new HttpClient();
			client.BaseAddress = new Uri(URL);

			var byteArray = System.Text.Encoding.ASCII.GetBytes(string.Format("{0}:{1}", p_user_name, p_password));
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
