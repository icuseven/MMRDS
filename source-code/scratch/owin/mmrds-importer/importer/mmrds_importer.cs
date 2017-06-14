using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using mmria.console.data;

namespace mmria.console.import
{
	public class mmrds_importer
	{
		private string auth_token = null;
		private string user_name = null;
		private string password = null;
		private string database_path = null;
		private string mmria_url = null;
		private bool is_offline_mode = false;

		//import user_name:user1 password:password database_file_path:mapping-file-set/Maternal_Mortality.mdb url:http://localhost:12345

		public mmrds_importer()
		{
			

		}
		public void Execute(string[] args)
		{
			string import_directory = System.Configuration.ConfigurationManager.AppSettings["import_directory"];
			this.is_offline_mode = bool.Parse(System.Configuration.ConfigurationManager.AppSettings["is_offline_mode"]);

			if (!System.IO.Directory.Exists(import_directory))
			{
				System.IO.Directory.CreateDirectory(import_directory);
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
					else if (arg.ToLower().StartsWith("database_file_path"))
					{
						
						this.database_path = val;
					}
					else if (arg.ToLower().StartsWith("url"))
					{
						this.mmria_url = val;
					}
				}
			}

			if (string.IsNullOrWhiteSpace(this.database_path))
			{
				System.Console.WriteLine("missing database_path");
				System.Console.WriteLine(" form database:[file path]");
				System.Console.WriteLine(" example 1 database_file_path:c:\\temp\\maternal_mortality.mdb");
				System.Console.WriteLine(" example 2 database_file_path:\"c:\\temp folder\\maternal_mortality.mdb\"");
				System.Console.WriteLine(" example 3 database_file_path:mapping-file-set\\maternal_mortality.mdb\"");
				System.Console.WriteLine(" mmria.exe import user_name:user1 password:secret url:http://localhost:12345 database_file_path:\"c:\\temp folder\\maternal_mortality.mdb\"");

				return;
			}

			if (string.IsNullOrWhiteSpace(this.mmria_url))
			{
				this.mmria_url = System.Configuration.ConfigurationManager.AppSettings["web_site_url"];


				if (string.IsNullOrWhiteSpace(this.mmria_url))
				{
					System.Console.WriteLine("missing url");
					System.Console.WriteLine(" form url:[website_url]");
					System.Console.WriteLine(" example url:http://localhost:12345");

					return;
				}
			}

			if (string.IsNullOrWhiteSpace(this.user_name))
			{
				System.Console.WriteLine("missing user_name");
				System.Console.WriteLine(" form user_name:[user_name]");
				System.Console.WriteLine(" example user_name:user1");
				return;
			}

			if (string.IsNullOrWhiteSpace(this.password))
			{
				System.Console.WriteLine("missing password");
				System.Console.WriteLine(" form password:[password]");
				System.Console.WriteLine(" example password:secret");
				return;
			}

			var mmria_server = new mmria_server_api_client(this.mmria_url);
			mmria_server.login(this.user_name, this.password);

			mmria.common.metadata.app metadata = mmria_server.get_metadata();

			var mmrds_data = new cData(get_mdb_connection_string(this.database_path));

			var directory_path = @"mapping-file-set";
			var main_mapping_file_name = @"MMRDS-Mapping-NO-GRIDS-test.csv";
			var mapping_data = new cData(get_csv_connection_string(directory_path));

			var grid_mapping_file_name = @"grid-mapping-merge.csv";


			var lookup_mapping_file_name = @"MMRDS-Mapping-NO-GRIDS-lookup-values.csv";
			var lookup_mapping_table = get_look_up_mappings(mapping_data, lookup_mapping_file_name);

		
			System.Collections.Generic.Dictionary<string, Dictionary<string, string>> lookup_value1 = new Dictionary<string, Dictionary<string, string>>(StringComparer.OrdinalIgnoreCase);
			System.Collections.Generic.Dictionary<string, Dictionary<string, string>> lookup_value2 = new Dictionary<string, Dictionary<string, string>>(StringComparer.OrdinalIgnoreCase);


			var case_maker = new Case_Maker(import_directory, lookup_value1, lookup_value2);

			foreach (System.Data.DataRow row in lookup_mapping_table.Rows)
			{
				//mmria_path value1  value2 mmria_value
				//string mmria_path = row["mmria_path"].ToString().Trim();
				string mmria_path = row["source_path"].ToString().Trim() + "|" + row["mmria_path"].ToString().Trim();
				string value1 = null;
				string value2 = null;
				string mmria_value = null;

				if (
					//row["mmria_path"].ToString().Trim() == "home_record/state_of_death_record" ||
					//row["source_path"].ToString().Trim() == "MaternalMortality1.MM_MBC" ||
					row["mmria_path"].ToString ().IndexOf("pmss_mm") > -1
				) 
				{
					System.Console.Write ("break");

				}

				if (row["value1"] != DBNull.Value)
				{
					value1 = row["value1"].ToString().Trim();
				}

				if (row["value2"] != DBNull.Value)
				{
					value2 = row["value2"].ToString().Trim();
				}

				if (row["mmria_value"] != DBNull.Value)
				{
					if (row["mmria_value"].ToString() == "(blank)")
					{
						mmria_value = "";
					}
					else
					{
						mmria_value = row["mmria_value"].ToString().Trim();
					}
				}

				if (value1 == null && mmria_value != null && mmria_value == "")
				{
					value1 = "";
				}


				if (value2 == null && mmria_value != null && mmria_value == "")
				{
					value2 = "";
				}

				if (!lookup_value1.ContainsKey(mmria_path))
				{
					lookup_value1[mmria_path] = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
				}

				if (!lookup_value2.ContainsKey(mmria_path))
				{
					lookup_value2[mmria_path] = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
				}

				if (mmria_value != null && value1 != null && !lookup_value1[mmria_path].ContainsKey(value1))
				{
					lookup_value1[mmria_path].Add(value1, mmria_value);
				}
				else if (mmria_value != null && value1 != null && mmria_value != "" && value1 != "")
				{
					case_maker.add_bad_mapping(string.Format("duplicate lookup: {0} - {1}", mmria_path, value1));
				}

				if (mmria_value != null && value2 != null && !lookup_value2[mmria_path].ContainsKey(value2))
				{
					lookup_value2[mmria_path].Add(value2, mmria_value);
				}
				else if (mmria_value != null && value2 != null && mmria_value != "" && value2 != "")
				{
					case_maker.add_bad_mapping(string.Format("duplicate lookup: {0} - {1}", mmria_path, value2));
				}
			}


			var case_data_list = new List<dynamic>();


			var view_name_list = new string[] {
			"MaternalMortality",
			"DeathCertificate",
			"MaternalBirthCertificate",
			"ChildBirthCertificate",
			"AutopsyReport",
			"PrenatalCareRecord",
			"SocialServicesRecord",
			"Hospitalization",
			"OfficeVisits",
			"CommitteeReview",
			"Interviews"
			};


			var view_name_to_name_map = new Dictionary<string, string>{
				{"MaternalMortality", "home_record" },
				{"DeathCertificate", "death_certificate" },
				{"MaternalBirthCertificate", "birth_fetal_death_certificate_parent" },
				{"ChildBirthCertificate", "birth_certificate_infant_fetal_section" },
				{"AutopsyReport", "autopsy_report" },
				{"PrenatalCareRecord", "prenatal" },
				{"SocialServicesRecord", "social_and_environmental_profile" },
				{"Hospitalization", "er_visit_and_hospital_medical_records" },
				{"OfficeVisits", "other_medical_office_visits" },
				{"CommitteeReview", "committe_review" },
				{"Interviews", "informant_interviews" }
			};

			var view_name_cardinality_map = new Dictionary<string, bool>{
				{"MaternalMortality", false },
				{"DeathCertificate", false },
				{"MaternalBirthCertificate", false },
				{"ChildBirthCertificate", true },
				{"AutopsyReport", false },
				{"PrenatalCareRecord", false },
				{"SocialServicesRecord", false },
				{"Hospitalization", true },
				{"OfficeVisits", true },
				{"CommitteeReview", false },
				{"Interviews", true }
			};

			var id_record_set = mmrds_data.GetDataTable("Select Distinct GlobalRecordId From MaternalMortality");
			string json_string = null;
			List<string> id_list = new List<string>();

			foreach (System.Data.DataRow row in id_record_set.Rows)
			{
				/*
				if 
				(
					row[0].ToString() != "d0e08da8-d306-4a9a-a5ff-9f1d54702091" &&
					row[0].ToString() != "244da20f-41cc-4300-ad94-618004a51917" &&
					row[0].ToString() != "e98ce2be-4446-439a-bb63-d9b4e690e3c3" &&
					row[0].ToString() != "b5003bc5-1ab3-4ba2-8aea-9f3717c9682a"
				)
				{
					continue;
				}
				*/

				id_list.Add(row[0].ToString());
			}

			foreach (string global_record_id in id_list)
			{
				dynamic case_data = case_maker.create_default_object(metadata, new Dictionary<string, object>());

				json_string = Newtonsoft.Json.JsonConvert.SerializeObject(case_data, new Newtonsoft.Json.JsonSerializerSettings () {
					Formatting = Newtonsoft.Json.Formatting.Indented,
					DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat,
					DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc
				});
				System.Console.WriteLine("json\n{0}", json_string);

				foreach (string view_name in view_name_list)
				{
					System.Data.DataRow[] view_record_data = null;
					System.Data.DataRow[] grid_record_data = null;
					System.Data.DataTable view_data_table = get_view_data_table(mmrds_data, view_name);

					var mapping_view_table = get_view_mapping(mapping_data, view_name, main_mapping_file_name);

					var grid_table_name_list = get_grid_table_name_list(mapping_data, view_name, grid_mapping_file_name);

					if (view_name == "MaternalMortality")
					{
						view_record_data = view_data_table.Select(string.Format("MaternalMortality.GlobalRecordId='{0}'", global_record_id));

						IDictionary<string, object> updater = case_data as IDictionary<string, object>;
						updater["_id"] = global_record_id;
						updater["date_created"] = view_record_data[0]["FirstSaveTime"] != DBNull.Value ? ((DateTime)view_record_data[0]["FirstSaveTime"]).ToString("s") + "Z" : null;
						updater["created_by"] = view_record_data[0]["FirstSaveLogonName"];
						updater["date_last_updated"] = view_record_data[0]["LastSaveTime"] != DBNull.Value ? ((DateTime)view_record_data[0]["LastSaveTime"]).ToString("s") + "Z" : null;
						updater["last_updated_by"] = view_record_data[0]["LastSaveLogonName"];
					}
					else
					{
						view_record_data = view_data_table.Select(string.Format("FKEY='{0}'", global_record_id));

					}


					if (view_record_data.Length > 1)
					{
						System.Console.WriteLine("multi rows: {0}\t{1}", view_name, view_record_data.Length);
					}
					//mmria.common.metadata.node form_metadata = metadata.children.Where(c => c.type == "form" && c.name == view_name_to_name_map[view_name]).First();
					if (view_name_cardinality_map[view_name] == true)
					{

						for (int i = 0; i < view_record_data.Length; i++)
						{
							System.Data.DataRow row = view_record_data[i];

							process_view
							(
								metadata,
								case_maker,
								case_data,
								row,
								mapping_view_table,
								i
							);

							int column_index = -1;
							for (int column_index_i = 0; column_index_i < view_data_table.Columns.Count; column_index_i++)
							{
								if (view_data_table.Columns[column_index_i].ColumnName.ToLower() == (view_name + ".globalrecordid").ToLower())
								{
									column_index = column_index_i;
								}
							}

							foreach (string grid_name in grid_table_name_list)
							{
								System.Data.DataTable grid_data = mmrds_data.GetDataTable(string.Format("Select * From [{0}] Where FKey='{1}'", grid_name, row[column_index]));
								var grid_mapping = get_grid_mapping(mapping_data, grid_name, grid_mapping_file_name);

								if (grid_data.Rows.Count > 0)
								{

								}

								for (int grid_row_index = 0; grid_row_index < grid_data.Rows.Count; grid_row_index++)
								{
									System.Data.DataRow grid_row = grid_data.Rows[grid_row_index];

									process_grid
									(
										metadata,
										case_maker,
										case_data,
										grid_row,
										grid_mapping,
										i,
										grid_row_index
									);
								}
							}
						}
					}
					else
					{
						foreach (System.Data.DataRow row in view_record_data)
						{
							process_view
							(
								metadata,
								case_maker,
								case_data,
								row,
								mapping_view_table
							);


							int column_index = -1;
							for (int column_index_i = 0; column_index_i < view_data_table.Columns.Count; column_index_i++)
							{
								if (view_data_table.Columns[column_index_i].ColumnName.ToLower() == (view_name + ".globalrecordid").ToLower())
								{
									column_index = column_index_i;
								}
							}

							foreach (string grid_name in grid_table_name_list)
							{
								System.Data.DataTable grid_data = null;
								int check_index = grid_name.IndexOf("/");
								if (check_index > 0)
								{
									grid_data = mmrds_data.GetDataTable(string.Format("Select * From [{0}] Where FKey='{1}'", grid_name.Substring(0, check_index), row[column_index]));
								}
								else
								{
									grid_data = mmrds_data.GetDataTable(string.Format("Select * From [{0}] Where FKey='{1}'", grid_name, row[column_index]));	
								}

								var grid_mapping = get_grid_mapping(mapping_data, grid_name, grid_mapping_file_name);

								if (grid_data.Rows.Count > 0)
								{

								}

								if (check_index > 0)
								{
									int grid_row_index = int.Parse(grid_name.Substring(check_index + 1, grid_name.Length - (check_index + 1)));
									if (grid_data.Rows.Count > grid_row_index)
									{
										process_grid
											(
												metadata,
												case_maker,
												case_data,
												grid_data.Rows[grid_row_index],
												grid_mapping,
												null,
												null
											);
									}
								}
								else
								{
									for (int grid_row_index = 0; grid_row_index < grid_data.Rows.Count; grid_row_index++)
									{
										System.Data.DataRow grid_row = grid_data.Rows[grid_row_index];

										process_grid
										(
											metadata,
											case_maker,
											case_data,
											grid_row,
											grid_mapping,
											null,
											grid_row_index
										);
									}
								}
							}
						}

					}


				}




				/*
				if (case_data_list.Count == 0)
				{
					var result = mmria_server.set_case(json_string);
				}
				*/
				try
				{
					// check if doc exists
					string document_url = System.Configuration.ConfigurationManager.AppSettings["couchdb_url"] + "/mmrds/" + global_record_id;
					var document_curl = new cURL("GET", null, document_url, null, this.user_name, this.password);
					string document_json = null;

					document_json = document_curl.execute();
					var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(document_json);
					IDictionary<string, object> updater = case_data as IDictionary<string, object>;
					IDictionary<string, object> result_dictionary = result as IDictionary<string, object>;
					if (result_dictionary.ContainsKey ("_rev")) 
					{
						updater ["_rev"] = result_dictionary ["_rev"];


						json_string = Newtonsoft.Json.JsonConvert.SerializeObject (case_data, new Newtonsoft.Json.JsonSerializerSettings () {
							Formatting = Newtonsoft.Json.Formatting.Indented,
							DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat,
							DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc
						});
						System.Console.WriteLine ("json\n{0}", json_string);
					}

					var update_curl = new cURL ("PUT", null, document_url, json_string, this.user_name, this.password);
					try 
					{
						string de_id_result = update_curl.execute ();
						System.Console.WriteLine ("update id");
						System.Console.WriteLine (de_id_result);

					}
					catch (Exception ex) 
					{
						System.Console.WriteLine ("sync de_id");
						System.Console.WriteLine (ex);
					}

				}
				catch (Exception ex)
				{
					System.Console.WriteLine("Get case");
					System.Console.WriteLine(ex);

					json_string = Newtonsoft.Json.JsonConvert.SerializeObject(case_data, new Newtonsoft.Json.JsonSerializerSettings () {
						Formatting = Newtonsoft.Json.Formatting.Indented,
						DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat,
						DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc
					});

					string document_url = System.Configuration.ConfigurationManager.AppSettings["couchdb_url"] + "/mmrds/" + global_record_id;
					var update_curl = new cURL("PUT", null, document_url, json_string, this.user_name, this.password);
					try
					{
						string de_id_result = update_curl.execute();
						System.Console.WriteLine("update id");
						System.Console.WriteLine(de_id_result);

					}
					catch (Exception ex2)
					{
						System.Console.WriteLine("sync de_id");
						System.Console.WriteLine(ex2);
					}
					System.Console.WriteLine("json\n{0}", json_string);

				}



				//return;
				System.IO.File.WriteAllText(import_directory + "/" + global_record_id + ".json", json_string);

				//break;
				case_data_list.Add(case_data);
			}
			case_maker.flush_bad_mapping();

			Console.WriteLine("Hello World!");

			System.IO.File.WriteAllText(import_directory + "/output.json", json_string);

		}

		public System.Data.DataTable get_view_data_table(cData p_data, string p_view_name = "MaternalMortality")
		{
			System.Data.DataTable result = null;

			System.Text.StringBuilder sql_string = new System.Text.StringBuilder();
			System.Text.StringBuilder column_string = new System.Text.StringBuilder();

			System.Data.DataTable dt = p_data.GetDataTable(string.Format("Select v.Name & p.PageId From metapages p inner join metaviews v on p.ViewId = v.ViewId  Where v.Name = '{0}'", p_view_name));

			column_string.Append("Select ");
			column_string.Append(p_view_name);
			column_string.Append(".*,");
			for (var i = 0; i < dt.Rows.Count; i++)
			{
				System.Data.DataRow row = dt.Rows[i];

				column_string.Append(row[0]);
				column_string.Append(".*,");

				if (i == 0)
				{
					sql_string.Append(string.Format(" From {1}{0} inner join {2} on {0}.GlobalRecordId = {2}.GlobalRecordId ", p_view_name, new String('(', dt.Rows.Count - 1), row[0]));
				}
				else
				{
					sql_string.Append(string.Format(") inner join {1} on {0}.GlobalRecordId = {1}.GlobalRecordId ", p_view_name, row[0]));
				}
			}
			column_string.Length = column_string.Length - 1;
			result = p_data.GetDataTable(column_string.ToString() + sql_string.ToString());

			return result;
		}

		public System.Data.DataTable get_view_mapping(cData p_mapping, string p_view_name, string p_mapping_table_name)
		{
			System.Data.DataTable result = null;
			string mapping_sql = string.Format("SELECT * FROM [{0}] Where BaseTable = '{1}' ", p_mapping_table_name, p_view_name);
			result = p_mapping.GetDataTable(mapping_sql);

			return result;
		}

		public System.Data.DataTable get_look_up_mappings(cData p_mapping, string p_mapping_table_name)
		{
			mmria.console.util.csv_Data csv_data = new util.csv_Data();
			System.Data.DataTable result = csv_data.get_datatable(@"mapping-file-set/MMRDS-Mapping-NO-GRIDS-lookup-values.csv");
			string mapping_sql = string.Format("SELECT [mmria_path], [value1], [value2], [mmria_value], [path] as [source_path] FROM [{0}] Where [mmria_path] is not null ", p_mapping_table_name);
			result.Columns ["path"].ColumnName = "source_path";
			//result = p_mapping.GetDataTable(mapping_sql);
			result.Select("[mmria_path] is not null ");

			return result;
		}

		public System.Data.DataTable get_grid_mapping(cData p_mapping, string p_view_name, string p_mapping_table_name)
		{
			System.Data.DataTable result = null;
			string mapping_sql = string.Format("SELECT * FROM [{0}] Where [Table] Like '{1}%' ", p_mapping_table_name, p_view_name);
			result = p_mapping.GetDataTable(mapping_sql);

			return result;
		}


		public List<string> get_grid_table_name_list(cData p_mapping, string p_view_name, string p_mapping_table_name)
		{
			List<string> result = new List<string>();
			System.Data.DataTable dt = null;
			string mapping_sql = string.Format("SELECT Distinct [Table] FROM [{0}] Where [Table] Like '{1}%' ", p_mapping_table_name, p_view_name);
			dt = p_mapping.GetDataTable(mapping_sql);

			foreach (System.Data.DataRow row in dt.Rows)
			{
				result.Add(row[0].ToString());
			}

			return result;
		}

		public void process_view
		(
			mmria.common.metadata.app metadata,
			Case_Maker case_maker,
			IDictionary<string, object> case_data,
			System.Data.DataRow grid_row,
			System.Data.DataTable mapping_view_table,
			int? index = null
		)
		{
			//var view_data_table = get_view_data_table(mmrds_data, "DeathCertificate");

			//var mapping_view_table = get_view_mapping(mmrds_data, "DeathCertificate", mapping_data, main_mapping_file_name);

			//grid_table = view_data_table.Select(string.Format("FKEY='{0}'", global_record_id));

			foreach (System.Data.DataRow row in mapping_view_table.Rows)
			{
				if (row["MMRIA Path"] != DBNull.Value && !string.IsNullOrWhiteSpace(row["MMRIA Path"].ToString()) && row[5].ToString().ToLower() != "grid")
				{
					//List<string> path = row["MMRIA Path"].ToString();
					string path = row["MMRIA Path"].ToString().Trim();

					string[] path_array = row["MMRIA Path"].ToString().Trim().Split('/');

					if (index != null && index.HasValue)
					{
						path = case_maker.AppendFormIndexToPath(index.Value, path);
					}


					if (path == "home_record/case_progress_report/death_certificate")
					{
						System.Console.Write("break\n");
					}

					if (row["DataType"].ToString().ToLower() == "boolean")
					{
						case_maker.set_value(metadata, case_data, path, grid_row[row["f#Name"].ToString().Trim()], row[0].ToString().Trim(), row["prompttext"].ToString().Trim(), row[0].ToString().Trim());
					}
					else
					{
						case_maker.set_value(metadata, case_data, path, grid_row[row["f#Name"].ToString().Trim()], row[0].ToString().Trim(), null, row[0].ToString().Trim());
					}
					Console.WriteLine(string.Format("{0}", path));
					Console.WriteLine(string.Format("{0}, {1}, \"\"", row[0].ToString().Replace(".", ""), row["prompttext"].ToString().Trim().Replace(",", "")));

				}
			}

		}


		public void process_grid
		(
			mmria.common.metadata.app metadata,
			Case_Maker case_maker,
			IDictionary<string, object> case_data,
			System.Data.DataRow grid_row,
			System.Data.DataTable mapping_view_table,
			int? index = null,
			int? grid_index = null
		)
		{
			foreach (System.Data.DataRow row in mapping_view_table.Rows)
			{
				if (row["mmria_path"] != DBNull.Value && !string.IsNullOrWhiteSpace(row["mmria_path"].ToString()))
				{
					string path = row["mmria_path"].ToString().Trim();

					if (path == "committee_review/pmss_mm")
					{
						System.Console.Write("break");
					}

					string[] path_array = row["mmria_path"].ToString().Trim().Split('/');

					if (index != null && index.HasValue)
					{
						path = case_maker.AppendFormIndexToPath(index.Value, path);
					}

					if (grid_index != null && grid_index.HasValue)
					{
						path = case_maker.AppendGridIndexToPath(grid_index.Value, path);
					}

					int check_index = row[0].ToString().IndexOf("/");
					if (check_index > -1)
					{
						string table_name = row[0].ToString().Trim().Substring(0, check_index);
						case_maker.set_value(metadata, case_data, path, grid_row[row["field"].ToString().Trim()], table_name + "." + row[2].ToString().Trim(), null, row[0].ToString().Trim());
					}
					else
					{
						case_maker.set_value(metadata, case_data, path, grid_row[row["field"].ToString().Trim()], row[0].ToString().Trim() + "." + row[2].ToString().Trim(), null, row[0].ToString().Trim());
					}
					Console.WriteLine(string.Format("{0}", path));
					Console.WriteLine(string.Format("{0}, {1}, \"\"", row[0].ToString().Replace(".", ""), row["prompt"].ToString().Replace(",", "")));

				}
			}

		}

		public string get_mdb_connection_string(string p_file_name)
		{
			// @"mapping-file-set/MMRDS-Mapping-NO-GRIDS-test.csv"
			string result = string.Format(
				@"Provider=Microsoft.Jet.OLEDB.4.0;Data Source={0};User ID=;Password=;",
				p_file_name
			);

			return result;
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
