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
			System.Collections.Generic.Dictionary<string, string> path_to_grid_map = new Dictionary<string, string>();
			System.Collections.Generic.Dictionary<string, string> path_to_multi_form_map = new Dictionary<string, string>();
			System.Collections.Generic.Dictionary<string, string> grid_to_multi_form_map = new Dictionary<string, string>();

			System.Collections.Generic.HashSet<string> path_to_flat_map = new System.Collections.Generic.HashSet<string>();

			System.Collections.Generic.Dictionary<string, WriteCSV> path_to_csv_writer = new Dictionary<string, WriteCSV>();

			generate_path_map
			(	metadata, "", "mmria_case_export.csv", "",
				path_to_int_map,
			 	path_to_file_name_map,
			 	path_to_node_map,
			 	path_to_grid_map, 
				path_to_multi_form_map,
				 false,
			 	grid_to_multi_form_map,
				 false,
			 	path_to_flat_map
			);

			System.Collections.Generic.HashSet<string> flat_grid_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
			System.Collections.Generic.HashSet<string> mutiform_grid_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

			foreach (KeyValuePair<string, string> kvp in path_to_grid_map)
			{
				if (grid_to_multi_form_map.ContainsKey(kvp.Key))
				{
					mutiform_grid_set.Add(kvp.Value);
				}


			}

			foreach (KeyValuePair<string, string> kvp in path_to_grid_map)
			{
				if (
					!mutiform_grid_set.Contains(kvp.Value) &&
					!flat_grid_set.Contains(kvp.Value)
				)
				{
					flat_grid_set.Add(kvp.Value);
				}

			}



			int stream_file_count = 0;
			foreach (string file_name in path_to_file_name_map.Select(kvp => kvp.Value).Distinct())
			{
				path_to_csv_writer.Add(file_name, new WriteCSV(file_name));
				Console.WriteLine(file_name);
				stream_file_count++;
			}
			Console.WriteLine("stream_file_count: {0}", stream_file_count);

			create_header_row
			(
				path_to_int_map,
				path_to_flat_map,
				path_to_node_map,
				path_to_csv_writer["mmria_case_export.csv"].Table,
				true,
				false,
				false
			);

			foreach (System.Dynamic.ExpandoObject case_row in all_cases.rows)
			{
				IDictionary<string, object> case_doc = ((IDictionary<string, object>)case_row)["doc"] as IDictionary<string, object>;
				if (case_doc["_id"].ToString().StartsWith("_design"))
				{
					continue;
				}
				System.Data.DataRow row = path_to_csv_writer["mmria_case_export.csv"].Table.NewRow();
				string mmria_case_id = case_doc["_id"].ToString();
				row["_id"] = mmria_case_id;

				foreach (string path in path_to_flat_map)
				{
					if (
						path_to_node_map[path].type.ToLower() == "app" ||
						path_to_node_map[path].type.ToLower() == "form" ||
						path_to_node_map[path].type.ToLower() == "group"

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

				}
				path_to_csv_writer["mmria_case_export.csv"].Table.Rows.Add(row);
				//break;

				foreach(KeyValuePair<string, mmria.common.metadata.node> ptn in path_to_node_map.Where(x => x.Value.type.ToLower() == "grid"))
				{
					string path = ptn.Key;


					if (flat_grid_set.Contains(path_to_grid_map[path]))
					{
						string grid_name = path_to_grid_map[path];


						HashSet<string> grid_field_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

						foreach (KeyValuePair<string,mmria.common.metadata.node> ptgm in path_to_node_map.Where( x=> x.Key.StartsWith(path) && x.Key != path))
						{
							grid_field_set.Add(ptgm.Key);
						}

						create_header_row
						(
							path_to_int_map,
							grid_field_set,
							path_to_node_map,
							path_to_csv_writer[grid_name].Table,
							true,
							true,
							false
						);



						dynamic raw_data = get_value(case_doc as IDictionary<string, object>, path);
						List<object> object_data = raw_data as List<object>;

						if(object_data != null)
						for (int i = 0; i < object_data.Count; i++)
						{
							IDictionary<string, object> grid_item_row = object_data[i] as IDictionary<string, object>;

							System.Data.DataRow grid_row = path_to_csv_writer[grid_name].Table.NewRow();
							grid_row["_id"] = mmria_case_id;
							grid_row["_record_index"] = i;
							foreach (KeyValuePair<string, string> kvp in path_to_grid_map.Where(k => k.Value == grid_name))
							{
								foreach (mmria.common.metadata.node node in path_to_node_map[kvp.Key].children)
								{
									try
									{
										dynamic val = grid_item_row[node.name];
										if (val != null)
										{
											if (node.type.ToLower() == "number" && !string.IsNullOrWhiteSpace(val.ToString()))
											{
													row[path_to_int_map[path].ToString("X")] = val;
											}
											else
											{
												row[path_to_int_map[path].ToString("X")] = val;
											}
										}
									}
									catch (Exception ex)
									{

									}
								}
							}
							path_to_csv_writer[grid_name].Table.Rows.Add(grid_row);
						}
					}

				}


			}

			foreach (KeyValuePair<string, WriteCSV> kvp in path_to_csv_writer)
			{
				kvp.Value.WriteToStream();
			}
			Console.WriteLine("Export Finished.");
		}



		private void create_header_row
		(
			System.Collections.Generic.Dictionary<string, int> p_path_to_int_map,
			System.Collections.Generic.HashSet<string> p_path_to_csv_set,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_node_map,
			System.Data.DataTable p_Table,
			bool p_add_id,
			bool p_add_record_index,
			bool p_add_parent_record_index
		)
		{
			if (p_Table.Columns.Count > 0)
			{
				return;
			}

			System.Data.DataColumn column = null;
			// create header row
			if (p_add_id)
			{
				column = new System.Data.DataColumn("_id", typeof(string));
				p_Table.Columns.Add(column);
			}

			if (p_add_record_index)
			{
				column = new System.Data.DataColumn("_record_index", typeof(long));
				p_Table.Columns.Add(column);
			}

			if (p_add_parent_record_index)
			{
				column = new System.Data.DataColumn("_parent_record_index", typeof(long));
				p_Table.Columns.Add(column);
			}

			foreach (string path in p_path_to_csv_set)
			{
				switch (p_path_to_node_map[path].type.ToLower())
				{
					case "app":
					case "form":
					case "group":
					case "grid":

											continue;
					case "number":
						column = new System.Data.DataColumn(p_path_to_int_map[path].ToString("X"), typeof(double));
						break;
					default:
						column = new System.Data.DataColumn(p_path_to_int_map[path].ToString("X"), typeof(string));
						break;

				}
				p_Table.Columns.Add(column);
			}
		}


		private void generate_path_map
		(
			
			mmria.common.metadata.app p_metadata, string p_path,
			string p_file_name,
			string p_form_path,
			System.Collections.Generic.Dictionary<string, int> p_path_to_int_map,
			System.Collections.Generic.Dictionary<string, string> p_path_to_file_name_map,
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_node_map,
			System.Collections.Generic.Dictionary<string, string> p_path_to_grid_map,
			System.Collections.Generic.Dictionary<string, string> p_path_to_multi_form_map,
			bool p_is_multiform_context,
			System.Collections.Generic.Dictionary<string, string> p_multi_form_to_grid_map,
			bool p_is_grid_context,
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

					generate_path_map(child, child.name, p_file_name, p_form_path, p_path_to_int_map,  p_path_to_file_name_map, p_path_to_node_map, p_path_to_grid_map, p_path_to_multi_form_map, false, p_multi_form_to_grid_map, false, p_path_to_flat_map);
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
			System.Collections.Generic.Dictionary<string, string> p_path_to_grid_map,
			System.Collections.Generic.Dictionary<string, string> p_path_to_multi_form_map,
			bool p_is_multiform_context,
			System.Collections.Generic.Dictionary<string, string> p_multi_form_to_grid_map,
			bool p_is_grid_context,
			System.Collections.Generic.HashSet<string> p_path_to_flat_map
		)
		{

			/*
			if (p_path == "death_certificate/causes_of_death")
			{
				System.Console.Write("break");
			}*/

			bool is_flat_map = true;
			bool is_grid = false;
			bool is_multiform = false;

			string file_name = p_file_name;
			string form_path = p_form_path;

			p_path_to_int_map.Add(p_path, p_path_to_int_map.Count);
			p_path_to_node_map.Add(p_path, p_metadata);



			if (p_metadata.type.ToLower() == "grid")
			{
				is_flat_map = false;
				is_grid = true;
				/*
				if (p_is_multiform_context)
				{
				}
				else
				{*/

				file_name = this.convert_path_to_file_name(p_path);

				p_path_to_grid_map.Add(p_path, file_name);

				if (p_is_multiform_context)
				{
					p_multi_form_to_grid_map.Add(p_path, form_path);
				}
				//}

			}
			else
			{
				is_grid = p_is_grid_context;
			}

			if (p_metadata.type.ToLower() == "form" && (p_metadata.cardinality == "*" || p_metadata.cardinality == "+"))
			{

				is_flat_map = false;
				file_name = this.convert_path_to_file_name(p_path);
				form_path = p_path;
				is_multiform = true;
				p_path_to_multi_form_map.Add(p_path, file_name);
			}
			else
			{
				is_multiform = p_is_multiform_context;
			}

			if (is_flat_map && !(is_multiform || is_grid || p_is_grid_context || p_is_multiform_context))
			{
				p_path_to_flat_map.Add(p_path);
			}

			p_path_to_file_name_map.Add(p_path, file_name);

			if (p_metadata.children != null)
			{
				IList<mmria.common.metadata.node> children = p_metadata.children as IList<mmria.common.metadata.node>;

				for (var i = 0; i < children.Count; i++)
				{
					var child = children[i];

					generate_path_map(child, p_path + "/" + child.name, file_name, form_path, p_path_to_int_map, p_path_to_file_name_map, p_path_to_node_map, p_path_to_grid_map, p_path_to_multi_form_map, is_multiform, p_multi_form_to_grid_map, is_grid, p_path_to_flat_map);
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
				if (p_path == "home_record/date_of_death/is_estimated")
				{
					System.Console.WriteLine("break");
				}*/


				for (int i = 0; i < path.Length; i++)
				{
					if (i == path.Length - 1)
					{
						if (index is IDictionary<string, object>)
						{
							result = ((IDictionary<string, object>)index)[path[i]];
						}
						else
						{
							result = index;
						}

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
