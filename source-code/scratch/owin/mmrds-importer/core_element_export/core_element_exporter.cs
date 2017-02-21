using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using mmria.console.data;
using System.Linq;

namespace mmria.console.export
{
	public class core_element_exporter
	{
		private string auth_token = null;
		private string user_name = null;
		private string password = null;
		private string database_path = null;
		private string database_url = null;
		private string mmria_url = null;
		private bool is_offline_mode;

		public core_element_exporter()
		{
			this.is_offline_mode = bool.Parse(System.Configuration.ConfigurationManager.AppSettings["is_offline_mode"]);

		}
		public void Execute(string[] args)
		{
			string export_directory = System.Configuration.ConfigurationManager.AppSettings["export_directory"];

			if (!System.IO.Directory.Exists(export_directory))
			{
				System.IO.Directory.CreateDirectory(export_directory);
			}


			if (args.Length > 1)
			{
				for (var i = 1; i < args.Length; i++)
				{
					string arg = args[i];
					int index = arg.IndexOf(':');
					string val = arg.Substring(index + 1, arg.Length - (index + 1)).Trim(new char[] { '\"' });

					if (arg.ToLower().StartsWith("auth_token"))
					{
						this.auth_token = val;
					}
					else if (arg.ToLower().StartsWith("user_name"))
					{
						this.user_name = val;
					}
					else if (arg.ToLower().StartsWith("password"))
					{
						this.password = val;
					}
					else if (arg.ToLower().StartsWith("database_url"))
					{
						this.database_url = val;
					}
					else if (arg.ToLower().StartsWith("database"))
					{
						this.database_path = val;
					}
					else if (arg.ToLower().StartsWith("url"))
					{
						this.mmria_url = val;
					}
				}
			}

			string core_file_name = "core_mmria_export.csv";

			if (string.IsNullOrWhiteSpace(this.database_url))
			{
				this.database_url = System.Configuration.ConfigurationManager.AppSettings["couchdb_url"];

				if (string.IsNullOrWhiteSpace(this.database_url))
				{
					System.Console.WriteLine("missing database_url");
					System.Console.WriteLine(" form database:[file path]");
					System.Console.WriteLine(" example database:http://localhost:5984");
					System.Console.WriteLine(" mmria.exe export user_name:user1 password:secret url:http://localhost:12345 database_url:http://localhost:5984");
					return;
				}
			}

			if (string.IsNullOrWhiteSpace(this.mmria_url))
			{
				this.mmria_url = System.Configuration.ConfigurationManager.AppSettings["web_site_url"];

				if (string.IsNullOrWhiteSpace(this.mmria_url))
				{
					System.Console.WriteLine("missing url");
					System.Console.WriteLine(" form url:[website_url]");
					System.Console.WriteLine(" example url:http://localhost:12345");
					System.Console.WriteLine(" mmria.exe export user_name:user1 password:secret url:http://localhost:12345");


					return;
				}

			}

			if (string.IsNullOrWhiteSpace(this.user_name))
			{
				System.Console.WriteLine("missing user_name");
				System.Console.WriteLine(" form user_name:[user_name]");
				System.Console.WriteLine(" example user_name:user1");
				System.Console.WriteLine(" mmria.exe export user_name:user1 password:secret url:http://localhost:12345");
				return;
			}

			if (string.IsNullOrWhiteSpace(this.password))
			{
				System.Console.WriteLine("missing password");
				System.Console.WriteLine(" form password:[password]");
				System.Console.WriteLine(" example password:secret");
				System.Console.WriteLine(" mmria.exe export user_name:user1 password:secret url:http://localhost:12345");
				return;
			}

			var mmria_server = new mmria_server_api_client(this.mmria_url);
			mmria_server.login(this.user_name, this.password);

			mmria.common.metadata.app metadata = mmria_server.get_metadata();
			dynamic all_cases = mmria_server.get_all_cases(this.database_url);


			/*
			foreach (KeyValuePair<string, object> kvp in all_cases)
			{
				System.Console.WriteLine(kvp.Key);
			}
			*/

			System.Collections.Generic.Dictionary<string, int> path_to_int_map = new Dictionary<string, int>();
			System.Collections.Generic.Dictionary<string, string> path_to_file_name_map = new Dictionary<string, string>();
			System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> path_to_node_map = new Dictionary<string, mmria.common.metadata.node>();
			System.Collections.Generic.Dictionary<string, string> path_to_grid_map = new Dictionary<string, string>();
			System.Collections.Generic.Dictionary<string, string> path_to_multi_form_map = new Dictionary<string, string>();
			System.Collections.Generic.Dictionary<string, string> grid_to_multi_form_map = new Dictionary<string, string>();

			System.Collections.Generic.HashSet<string> path_to_flat_map = new System.Collections.Generic.HashSet<string>();

			System.Collections.Generic.Dictionary<string, WriteCSV> path_to_csv_writer = new Dictionary<string, WriteCSV>();

			generate_path_map
			(	metadata, "", core_file_name, "",
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

			/*
			System.Collections.Generic.HashSet<string> mutiform_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
			foreach (KeyValuePair<string, string> kvp in path_to_multi_form_map)
			{
				if (!mutiform_set.Contains(kvp.Value))
				{
					mutiform_set.Add(kvp.Value);
				}
			}*/

			path_to_csv_writer.Add(core_file_name, new WriteCSV(core_file_name));

			int stream_file_count = 0;
			/*
			foreach (string file_name in path_to_file_name_map.Select(kvp => kvp.Value).Distinct())
			{
				path_to_csv_writer.Add(file_name, new WriteCSV(file_name));
				Console.WriteLine(file_name);
				stream_file_count++;
			}*/
			Console.WriteLine("stream_file_count: {0}", stream_file_count);

			create_header_row
			(
				path_to_int_map,
				path_to_flat_map,
				path_to_node_map,
				path_to_csv_writer[core_file_name].Table,
				true,
				false,
				false
			);

			dynamic all_cases_rows;
			if (this.is_offline_mode)
			{
				all_cases_rows = all_cases;
			}
			else
			{
				all_cases_rows = all_cases.rows;
			}


			foreach (System.Dynamic.ExpandoObject case_row in all_cases_rows)
			{
				IDictionary<string, object> case_doc;
				if (this.is_offline_mode)
				{
					case_doc = case_row as IDictionary<string, object>;
				}
				else
				{
					case_doc = ((IDictionary<string, object>)case_row)["doc"] as IDictionary<string, object>;
				}

				//IDictionary<string, object> case_doc = ((IDictionary<string, object>)case_row)["doc"] as IDictionary<string, object>;
				//IDictionary<string, object> case_doc = case_row as IDictionary<string, object>;
				if (case_doc["_id"].ToString().StartsWith("_design", StringComparison.InvariantCultureIgnoreCase))
				{
					continue;
				}
				System.Data.DataRow row = path_to_csv_writer[core_file_name].Table.NewRow();
				string mmria_case_id = case_doc["_id"].ToString();
				row["_id"] = mmria_case_id;

				List<string> ordered_column_list = get_core_element_list();

				foreach (string path in ordered_column_list)
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
								row[convert_path_to_field_name(path)] = val;
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
									
									row[convert_path_to_field_name(path)] = string.Join("|",temp);
								}
							}
							else
							{
								if (val != null)
								{
									row[convert_path_to_field_name(path)] = val;
								}
							}

							break;
						default:
							if (val != null)
							{
								row[convert_path_to_field_name(path)] = val;
							}
							break;

					}

				}
				path_to_csv_writer[core_file_name].Table.Rows.Add(row);

				/*
				// flat grid - start
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
								foreach (string node in grid_field_set)
								{
									try
									{
										dynamic val = grid_item_row[path_to_node_map[node].name];
										if (val != null)
										{
											if (path_to_node_map[node].type.ToLower() == "number" && !string.IsNullOrWhiteSpace(val.ToString()))
											{
												grid_row[path_to_int_map[node].ToString("X")] = val;
											}
											else
											{
												grid_row[path_to_int_map[node].ToString("X")] = val;
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
				// flat grid - end
				*/

				/*
				// multiform - start
				foreach (KeyValuePair<string, string> kvp in path_to_multi_form_map)
				{
					HashSet<string> form_field_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

					foreach (KeyValuePair<string, mmria.common.metadata.node> ptgm in path_to_node_map.Where(x => x.Key.StartsWith(kvp.Key) && x.Key != kvp.Key))
					{
						form_field_set.Add(ptgm.Key);
					}


					foreach (KeyValuePair<string, string> ptgm in path_to_grid_map)
					{
						form_field_set.RemoveWhere( x=> x.StartsWith(ptgm.Key, StringComparison.InvariantCultureIgnoreCase));

					}



					create_header_row
					(
						path_to_int_map,
						form_field_set,
						path_to_node_map,
						path_to_csv_writer[kvp.Value].Table,
						true,
						true,
						false
					);

					dynamic form_raw_data = get_value(case_doc as IDictionary<string, object>, kvp.Key);
					List<object> form_object_data = form_raw_data as List<object>;

					if (form_object_data != null)
					for (int i = 0; i < form_object_data.Count; i++)
					{
						//IDictionary<string, object> form_item_row = form_object_data[i] as IDictionary<string, object>;

						System.Data.DataRow form_row = path_to_csv_writer[kvp.Value].Table.NewRow();
						form_row["_id"] = mmria_case_id;
						form_row["_record_index"] = i;

						foreach (string path in form_field_set)
						{
							if (
								path_to_node_map[path].type.ToLower() == "app" ||
								path_to_node_map[path].type.ToLower() == "form" ||
								path_to_node_map[path].type.ToLower() == "group"||
								path_to_node_map[path].type.ToLower() == "grid"

							  )
							{
								continue;
							}

							System.Console.WriteLine("path {0}", path);

							string[] temp_path = path.Split('/');
							List<string> form_path_list = new List<string>();
							for (int temp_path_index = 0; temp_path_index < temp_path.Length; temp_path_index++)
							{
								form_path_list.Add(temp_path[temp_path_index]);
								if (temp_path_index == 0)
								{
									form_path_list.Add(i.ToString());
								}

							}

							if (path == "er_visit_and_hospital_medical_records/vital_signs/temperature")
							{
								System.Console.Write("pause");
							}

							dynamic val = get_value(case_doc as IDictionary<string, object>, string.Join("/",form_path_list));

							switch (path_to_node_map[path].type.ToLower())
							{

								case "number":
									if (val != null && (!string.IsNullOrWhiteSpace(val.ToString())))
									{
										form_row[convert_path_to_field_name(path)] = val;
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

											form_row[convert_path_to_field_name(path)] = string.Join("|", temp);
										}
									}
									else
									{
										if (val != null)
										{
											form_row[convert_path_to_field_name(path)] = val;
										}
									}

									break;
								default:
									if (val != null)
									{
										form_row[convert_path_to_field_name(path)] = val;
									}
									break;

							}

						}

							HashSet<string> multifom_grid_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

							foreach (KeyValuePair<string, string> gtmfm in grid_to_multi_form_map)
							{
								if (gtmfm.Value == kvp.Key)
								{
									multifom_grid_set.Add(gtmfm.Key);
								}
							}

							process_multiform_grid
							(
								case_doc,
								mmria_case_id,
								i,
								path_to_int_map,
								path_to_node_map,
								path_to_grid_map,
								path_to_csv_writer,
								multifom_grid_set
						);


						path_to_csv_writer[kvp.Value].Table.Rows.Add(form_row);
					}
				}

				// multiform - end
				*/

			}


			Dictionary<string, string> int_to_path_map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
			foreach (KeyValuePair<string, int> ptn in path_to_int_map)
			{
				//int_to_path_map.Add(ptn.Value.ToString("X"), ptn.Key);
				string key = convert_path_to_field_name(ptn.Key);
				if (int_to_path_map.ContainsKey(key))
				{
					int_to_path_map.Add("_" + ptn.Value.ToString("X"), ptn.Key);
				}
				else
				{
					int_to_path_map.Add(key, ptn.Key);
				}
					


			}

			WriteCSV mapping_document = new WriteCSV("core_field_mapping.csv");
			System.Data.DataColumn column = null;

			column = new System.Data.DataColumn("file_name", typeof(string));
			mapping_document.Table.Columns.Add(column);

			column = new System.Data.DataColumn("mmria_path", typeof(string));
			mapping_document.Table.Columns.Add(column);

			column = new System.Data.DataColumn("column_name", typeof(string));
			mapping_document.Table.Columns.Add(column);


			foreach (KeyValuePair<string, WriteCSV> kvp in path_to_csv_writer)
			{
				

				foreach (System.Data.DataColumn table_column in kvp.Value.Table.Columns)
				{
					System.Data.DataRow mapping_row = mapping_document.Table.NewRow();
					mapping_row["file_name"] = kvp.Key;

					if (int_to_path_map.ContainsKey(table_column.ColumnName))
					{
						mapping_row["mmria_path"] = int_to_path_map[table_column.ColumnName];
					}
					else
					{
						switch (table_column.ColumnName)
						{
							case "_record_index":
							case "_parent_index":
							default:
								mapping_row["mmria_path"] = table_column.ColumnName;
								break;
						}
					}

					mapping_row["column_name"] = table_column.ColumnName;


					mapping_document.Table.Rows.Add(mapping_row);
				}



				kvp.Value.WriteToStream();
			}

			mapping_document.WriteToStream();

			Console.WriteLine("Export Finished.");
		}



		private void process_multiform_grid
		(
		 	IDictionary<string, object> case_doc,
			string mmria_case_id,
			int parent_record_index,
			Dictionary<string, int> path_to_int_map,
			Dictionary<string, mmria.common.metadata.node> path_to_node_map,
			Dictionary<string, string> path_to_grid_map,
			Dictionary<string, WriteCSV> path_to_csv_writer,
			HashSet<string> flat_grid_set
		)
		{



			// flat grid - start
			foreach (KeyValuePair<string, string> ptn in path_to_grid_map)
			{
				string path = ptn.Key;
				if (flat_grid_set.Contains(path))
				{
					string grid_name = path_to_grid_map[path];

					HashSet<string> grid_field_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

					foreach (KeyValuePair<string, mmria.common.metadata.node> ptgm in path_to_node_map.Where(x => x.Key.StartsWith(path) && x.Key != path))
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
						true
					);

					string[] temp_path = path.Split('/');
					List<string> form_path_list = new List<string>();
					for (int temp_path_index = 0; temp_path_index < temp_path.Length; temp_path_index++)
					{
						form_path_list.Add(temp_path[temp_path_index]);
						if (temp_path_index == 0)
						{
							form_path_list.Add(parent_record_index.ToString());
						}

					}

					dynamic raw_data = get_value(case_doc as IDictionary<string, object>, string.Join("/", path));
					List<object> object_data = raw_data as List<object>;

					if (object_data != null)
						for (int i = 0; i < object_data.Count; i++)
						{
							IDictionary<string, object> grid_item_row = object_data[i] as IDictionary<string, object>;

							System.Data.DataRow grid_row = path_to_csv_writer[grid_name].Table.NewRow();
							grid_row["_id"] = mmria_case_id;
							grid_row["_record_index"] = i;
							grid_row["_parent_record_index"] = parent_record_index;
							foreach (KeyValuePair<string, string> kvp in path_to_grid_map.Where(k => k.Value == grid_name))
							{
								foreach (string node in grid_field_set)
								{
									try
									{
										dynamic val = grid_item_row[path_to_node_map[node].name];
										if (val != null)
										{
											if (path_to_node_map[node].type.ToLower() == "number" && !string.IsNullOrWhiteSpace(val.ToString()))
											{
												if (path_to_csv_writer[grid_name].Table.Columns.Contains(convert_path_to_field_name(node)))
												{
													grid_row[convert_path_to_field_name(node)] = val;
												}
												else
												{
													grid_row[path_to_int_map[node].ToString("X")] = val;
												}
											}
											else
											{
												if (path_to_csv_writer[grid_name].Table.Columns.Contains(convert_path_to_field_name(node)))
												{
													grid_row[convert_path_to_field_name(node)] = val;
												}
												else
												{
													grid_row[path_to_int_map[node].ToString("X")] = val;
												}
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

		private string convert_path_to_field_name(string p_path)
		{
			//		/birth_certificate_infant_fetal_section / causes_of_death
			// /birth_certificate_infant_fetal_section
			bool is_added_item = false;
			int form_prefix = 0;
			int field_prefix = 0;

			System.Text.StringBuilder result = new System.Text.StringBuilder();
			string[] temp = p_path.Split('/');

			for (int i = 0; i < temp.Length; i++)
			{
				string[] temp2 = temp[i].Split('_');
				for (int j = 0; j < temp2.Length; j++)
				{
					if (i == 0 && form_prefix < 3 && i != temp.Length - 1)
					{
						if (!string.IsNullOrWhiteSpace(temp2[j]))
						{
							result.Append(temp2[j][0]);
							is_added_item = true;
						}
						form_prefix++;
					}
					else if (i == temp.Length - 1)
					{
						if (j == 0 && result.Length != 0 && j < temp2.Length - 1)
						{
							result.Append("_");
							if (!string.IsNullOrWhiteSpace(temp2[j]))
							{
								result.Append(temp2[j][0]);
								is_added_item = true;
							}
						}
						else if (j < temp2.Length - 1)
						{
							if (!string.IsNullOrWhiteSpace(temp2[j]))
							{
								result.Append(temp2[j][0]);
								is_added_item = true;
							}
						}
						else
						{
							result.Append("_");
							if (temp2[j].Length > 5)
							{
								result.Append(temp2[j].Substring(0, 5));
							}
							else
							{
								result.Append(temp2[j]);
							}
							return result.ToString();
						}



					}
					else if (!string.IsNullOrWhiteSpace(temp2[j]))
					{
						result.Append(temp2[j][0]);
						is_added_item = true;
					}
				}
			}

			return result.ToString();
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

			List<string> ordered_column_list = get_core_element_list();

			for (int i = 0; i < ordered_column_list.Count; i++)
			{
				string path = ordered_column_list[i];

				if (!p_path_to_csv_set.Contains(path))
				{
					continue;
				}
				   

				if (!p_path_to_int_map.ContainsKey(path))
				{
					continue;
				}

				switch (p_path_to_node_map[path].type.ToLower())
				{
					case "app":
					case "form":
					case "group":
					case "grid":

											continue;
					case "number":
						//column = new System.Data.DataColumn(p_path_to_int_map[path].ToString("X"), typeof(double));
						column = new System.Data.DataColumn(convert_path_to_field_name(path), typeof(double));

						break;
					default:
						//column = new System.Data.DataColumn(p_path_to_int_map[path].ToString("X"), typeof(string));
						column = new System.Data.DataColumn(convert_path_to_field_name(path), typeof(string));
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

		private List<string> get_core_element_list()
		{
			return new List<string> {
					"date_created",
					"created_by",
					"date_last_updated",
					"last_updated_by",
					"home_record/record_id",
					"birth_fetal_death_certificate_parent/demographic_of_mother/age",
					"death_certificate/demographics/age",
					"birth_fetal_death_certificate_parent/race/race_of_mother",
					"death_certificate/race/race",
					"birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin",
					"death_certificate/demographics/is_of_hispanic_origin",
					"birth_fetal_death_certificate_parent/demographic_of_mother/mother_married",
					"death_certificate/demographics/marital_status",
					"birth_fetal_death_certificate_parent/demographic_of_mother/education_level",
					"death_certificate/demographics/education_level",
					"birth_fetal_death_certificate_parent/demographic_of_mother/country_of_birth",
					"death_certificate/demographics/country_of_birth",
					"birth_fetal_death_certificate_parent/location_of_residence/city",
					"death_certificate/place_of_last_residence/city",
					"birth_fetal_death_certificate_parent/location_of_residence/county",
					"death_certificate/place_of_last_residence/county",
					"birth_fetal_death_certificate_parent/location_of_residence/state",
					"death_certificate/place_of_last_residence/state",
					"birth_fetal_death_certificate_parent/location_of_residence/zip_code",
					"death_certificate/place_of_last_residence/zip_code",
					"birth_fetal_death_certificate_parent/location_of_residence/longitude",
					"death_certificate/place_of_last_residence/longitude",
					"birth_fetal_death_certificate_parent/location_of_residence/latitude",
					"death_certificate/place_of_last_residence/latitude",
					"birth_fetal_death_certificate_parent/prenatal_care/principal_source_of_payment_for_this_delivery",
					"prenatal/primary_prenatal_care_facility/principal_source_of_payment",
					"birth_fetal_death_certificate_parent/prenatal_care/was_wic_used",
					"prenatal/primary_prenatal_care_facility/is_use_wic",
					"birth_fetal_death_certificate_parent/prenatal_care/trimester_of_1st_prenatal_care_visit",
					"prenatal/current_pregnancy/trimester_of_first_pnc_visit",
					"birth_fetal_death_certificate_parent/prenatal_care/number_of_visits",
					"social_and_environmental_profile/health_care_access/barriers_to_health_care_access",
					"social_and_environmental_profile/communications/barriers_to_communications",
					"social_and_environmental_profile/health_care_system/reasons_for_missed_appointments",
					"birth_fetal_death_certificate_parent/maternal_biometrics/height_feet",
					"birth_fetal_death_certificate_parent/maternal_biometrics/height_inches",
					"prenatal/current_pregnancy/height/feet",
					"prenatal/current_pregnancy/height/inches",
					"birth_fetal_death_certificate_parent/maternal_biometrics/pre_pregnancy_weight",
					"prenatal/current_pregnancy/pre_pregnancy_weight",
					"birth_fetal_death_certificate_parent/maternal_biometrics/bmi",
					"prenatal/current_pregnancy/bmi",
					"prenatal/infertility_treatment/was_pregnancy_result_of_infertility_treatment",
					"birth_fetal_death_certificate_parent/pregnancy_history/number_of_previous_live_births",
					"birth_fetal_death_certificate_parent/pregnancy_history/other_outcomes",
					"birth_fetal_death_certificate_parent/risk_factors/risk_factors_in_this_pregnancy",
					"birth_fetal_death_certificate_parent/risk_factors/number_of_c_sections",
					"birth_fetal_death_certificate_parent/infections_present_or_treated_during_pregnancy",
					"birth_fetal_death_certificate_parent/cigarette_smoking/prior_3_months",
					"birth_fetal_death_certificate_parent/cigarette_smoking/prior_3_months_type",
					"prenatal/pregnancy_history/gravida",
					"prenatal/pregnancy_history/para",
					"prenatal/pregnancy_history/abortions",
					"prenatal/had_pre_existing_conditions",
					"social_and_environmental_profile/documented_substance_use",
					"social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress",
					"birth_fetal_death_certificate_parent/maternal_biometrics/weight_gain",
					"birth_fetal_death_certificate_parent/cigarette_smoking/trimester_1st",
					"birth_fetal_death_certificate_parent/cigarette_smoking/trimester_1st_type",
					"birth_fetal_death_certificate_parent/cigarette_smoking/trimester_2nd",
					"birth_fetal_death_certificate_parent/cigarette_smoking/trimester_2nd_type",
					"birth_fetal_death_certificate_parent/cigarette_smoking/trimester_3rd",
					"birth_fetal_death_certificate_parent/cigarette_smoking/trimester_3rd_type",
					"birth_fetal_death_certificate_parent/prenatal_care/plurality",
					"prenatal/were_there_problems_identified",
					"prenatal/were_medical_referrals_to_others",
					"prenatal/were_there_pre_delivery_hospitalizations",
					"prenatal/evidence_of_substance_use",
					"prenatal/highest_blood_pressure/systolic",
					"prenatal/highest_blood_pressure/diastolic",
					"prenatal/current_pregnancy/weight_gain",
					"prenatal/lowest_hematocrit",
					"prenatal/current_pregnancy/estimated_date_of_confinement/day",
					"prenatal/current_pregnancy/estimated_date_of_confinement/month",
					"prenatal/current_pregnancy/estimated_date_of_confinement/year",
					"prenatal/were_there_adverse_reactions",
					"birth_fetal_death_certificate_parent/onset_of_labor",
					"birth_fetal_death_certificate_parent/obstetric_procedures",
					"birth_fetal_death_certificate_parent/maternal_morbidity",
					"birth_fetal_death_certificate_parent/characteristics_of_labor_and_delivery",
					"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/type_of_place",
					"birth_fetal_death_certificate_parent/facility_of_delivery_location/city",
					"birth_fetal_death_certificate_parent/facility_of_delivery_location/state",
					"birth_fetal_death_certificate_parent/facility_of_delivery_location/county",
					"birth_fetal_death_certificate_parent/facility_of_delivery_location/zip_code",
					"birth_fetal_death_certificate_parent/facility_of_delivery_location/longitude",
					"birth_fetal_death_certificate_parent/facility_of_delivery_location/latitude",
					"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/maternal_level_of_care",
					"birth_fetal_death_certificate_parent/location_of_residence/estimated_distance_from_residence",
					"birth_fetal_death_certificate_parent/facility_of_delivery_demographics/was_mother_transferred",
					"death_certificate/death_information/pregnancy_status",
					"birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother",
					"death_certificate/death_information/death_occured_in_hospital",
					"death_certificate/death_information/death_outside_of_hospital",
					"death_certificate/death_information/manner_of_death",
					"death_certificate/address_of_death/city",
					"death_certificate/address_of_death/county",
					"death_certificate/address_of_death/state",
					"death_certificate/address_of_death/zip_code",
					"death_certificate/address_of_death/longitude",
					"death_certificate/address_of_death/latitude",
					"death_certificate/death_information/was_autopsy_performed",
					"autopsy_report/was_drug_toxicology_positive",
					"autopsy_report/completeness_of_autopsy_information",
					"home_record/how_was_this_death_identified",
					"committee_review/pregnancy_relatedness",
					"committee_review/was_this_death_preventable",
					"committee_review/chance_to_alter_outcome",
					"committee_review/pmss_mm",
					"committee_review/pmss_mm_secondary",
					"committee_review/did_obesity_contribute_to_the_death",
					"committee_review/did_mental_health_conditions_contribute_to_the_death",
					"committee_review/did_substance_use_disorder_contribute_to_the_death",
					"committee_review/was_this_death_a_sucide",
					"committee_review/homicide_relatedness/was_this_death_a_homicide",
					"committee_review/means_of_fatal_injury",
					"committee_review/homicide_relatedness/if_homicide_relationship_of_perpetrator"

			};
		}



	}
}
