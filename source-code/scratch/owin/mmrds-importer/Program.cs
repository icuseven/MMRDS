using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Linq;

//using System.Threading.Tasks;
//using System.Data;
//using System.Linq;

using mmria.console.data;

namespace mmria.console
{
	interface icommand
	{
		string summary_help();
		string detailed_help(string method);
	}

	class MainClass
	{

		public static void Main(string[] args)
		{
			var mmria_server = new mmria_server_api_client();

			mmria.common.metadata.app metadata = mmria_server.get_metadata();
			var case_maker = new Case_Maker();
			var case_data_list = new List<dynamic>();

			var mmrds_data = new cData(get_mdb_connection_string("mapping-file-set/Maternal_Mortality.mdb"));
			var directory_path = @"mapping-file-set";
			var main_mapping_file_name = @"MMRDS-Mapping-NO-GRIDS-test.csv";
			var mapping_data = new cData(get_csv_connection_string(directory_path));

			var grid_mapping_file_name = @"grid-mapping-merge.csv";
	
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


			var view_name_to_name_map = new Dictionary<string,string>{
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
				{"PrenatalCareRecord", true },
				{"SocialServicesRecord", true },
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
				id_list.Add(row[0].ToString());
			}

			/*
			var id_list = new string[] {
				"d4234123-2322-4f46-99a8-5b936b1ec237",
				"0e602e72-4e67-404d-9a4b-e86e6793103d",
				"0e638e2c-cdf0-4829-bf9c-f33a86a5ef35",
				"0ed43157-48a2-4592-961c-6db57c8e83c7",
				"0fa4cad4-805d-45e5-b5e7-71eb33710765",
				"0fc0b3de-c964-4b95-b110-de0636f5ce3d"};
			*/

			foreach (string global_record_id in id_list)
			{
				dynamic case_data = case_maker.create_default_object(metadata, new Dictionary<string, object>());

				json_string = Newtonsoft.Json.JsonConvert.SerializeObject(case_data);
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
							for(int column_index_i = 0; column_index_i < view_data_table.Columns.Count; column_index_i++)
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
										null,
										grid_row_index
									);
								}
							}
						}

					}


				}

				json_string = Newtonsoft.Json.JsonConvert.SerializeObject(case_data);
				System.Console.WriteLine("json\n{0}", json_string);
				case_data_list.Add(case_data);
			}

			Console.WriteLine("Hello World!");
			json_string = Newtonsoft.Json.JsonConvert.SerializeObject(case_data_list);

			System.IO.File.AppendAllText("output.json", json_string);

		}

		public static System.Data.DataTable get_view_data_table(cData p_data, string p_view_name = "MaternalMortality")
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
					sql_string.Append(string.Format(" From {1}{0} inner join {2} on {0}.GlobalRecordId = {2}.GlobalRecordId ", p_view_name, new String('(', dt.Rows.Count-1), row[0]));
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

		public static System.Data.DataTable get_view_mapping(cData p_mapping,  string p_view_name,  string p_mapping_table_name)
		{
			System.Data.DataTable result = null;
			string mapping_sql = string.Format("SELECT * FROM [{0}] Where BaseTable = '{1}' ", p_mapping_table_name, p_view_name);
			result = p_mapping.GetDataTable(mapping_sql);

			return result;
		}

		public static System.Data.DataTable get_grid_mapping(cData p_mapping, string p_view_name, string p_mapping_table_name)
		{
			System.Data.DataTable result = null;
			string mapping_sql = string.Format("SELECT * FROM [{0}] Where [Table] Like '{1}%' ", p_mapping_table_name, p_view_name);
			result = p_mapping.GetDataTable(mapping_sql);

			return result;
		}


		public static List<string> get_grid_table_name_list(cData p_mapping, string p_view_name, string p_mapping_table_name)
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

		public static void process_view
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
					string path = row["MMRIA Path"].ToString();

					string[] path_array = row["MMRIA Path"].ToString().Split('/');

					if (index != null && index.HasValue)
					{
						path = case_maker.AppendFormIndexToPath(index.Value, path);
					}

					/*
					if (metadata.children.Where(i => i.type == "form" && i.name.ToLower() == path_array[0].ToLower() && (i.cardinality == "*" || i.cardinality == "+")).Count() > 0)
					{

					}*/


					case_maker.set_value(metadata, case_data, path, grid_row[row["f#Name"].ToString()]);
					Console.WriteLine(string.Format("{0}", path));
					Console.WriteLine(string.Format("{0}, {1}, \"\"", row[0].ToString().Replace(".", ""), row["prompttext"].ToString().Replace(",", "")));

				}
			}
			
		}


		public static void process_grid
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
					string path = row["mmria_path"].ToString();

					string[] path_array = row["mmria_path"].ToString().Split('/');

					if (index != null && index.HasValue)
					{
						path = case_maker.AppendFormIndexToPath(index.Value, path);
					}

					if (grid_index != null && grid_index.HasValue)
					{
						path = case_maker.AppendGridIndexToPath(grid_index.Value, path);
					}

					case_maker.set_value(metadata, case_data, path, grid_row[row["field"].ToString()]);
					Console.WriteLine(string.Format("{0}", path));
					Console.WriteLine(string.Format("{0}, {1}, \"\"", row[0].ToString().Replace(".", ""), row["prompt"].ToString().Replace(",", "")));

				}
			}

		}

		public static string get_mdb_connection_string(string p_file_name)
		{
			// @"mapping-file-set/MMRDS-Mapping-NO-GRIDS-test.csv"
			string result = string.Format(
				@"Provider=Microsoft.Jet.OLEDB.4.0;Data Source={0};User ID=;Password=;",
				p_file_name
			);

			return result;
		}
		public static string get_csv_connection_string(string p_file_name)
		{
			// @"mapping-file-set/MMRDS-Mapping-NO-GRIDS-test.csv"
			string result = string.Format(
				@"Provider=Microsoft.Jet.OleDb.4.0; Data Source={0};Extended Properties=""Text;HDR=YES;FMT=Delimited""",
				p_file_name
			);

			return result;
		}

		public static mmria.common.metadata.app get_metadata()
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

		public static void Main2 (string[] args)
		{

			var data = new cData ("Provider=Microsoft.Jet.OLEDB.4.0;Data Source=mapping-file-set/Maternal_Mortality.mdb;User ID=;Password=;");


			var rs = data.GetDataTable ("Select * from AutopsyReport");

			foreach (System.Data.DataRow row in rs.Rows) 
			{
				//if (row[5].ToString().ToLower() == "grid")
				//{
					Console.WriteLine(row[2].ToString());
				//}
			}

			var filename = @"mapping-file-set/MMRDS-Mapping-NO-GRIDS-test.csv";
			var connString = string.Format(
				@"Provider=Microsoft.Jet.OleDb.4.0; Data Source={0};Extended Properties=""Text;HDR=YES;FMT=Delimited""",
				System.IO.Path.GetDirectoryName(filename)
			);

			var data2 = new cData(connString);
			var rs2 = data2.GetDataTable("SELECT * FROM [" + System.IO.Path.GetFileName(filename) + "]");

			//Path,BaseTable,DataTablePath,f.Name,prompttext,ft.Name,DataType,MMRIA Path,MMRIA Group Name,Comments,


			foreach (System.Data.DataRow row in rs2.Rows)
			{
				if (row[5].ToString().ToLower() == "grid")
				{

					var grid_table = data.GetDataTable(string.Format("Select * from [{0}] Where 1=0", row[0].ToString().Replace(".", "")));
					Console.WriteLine(string.Format("{0}, {1}, \"\"", row[0].ToString().Replace(".",""), row["prompttext"].ToString().Replace(",","")));
					foreach (System.Data.DataColumn c in grid_table.Columns)
					{

						if(c.ColumnName != "UniqueKey" &&
							c.ColumnName != "UniqueRowId" &&
							c.ColumnName != "GlobalRecordId" &&
							c.ColumnName != "RECSTATUS" &&
							c.ColumnName != "FKEY"
						  )
						{
							Console.WriteLine(string.Format("\"\", \"\", {0}, {1}, \"\"", c.ColumnName, c.DataType));
						}
					}
				}
			}
			/*
			using (var conn = new System.Data.OleDb.OleDbConnection(connString))
			{
				conn.Open();
				var query = "SELECT * FROM [" + System.IO.Path.GetFileName(filename) + "]";
				using (var adapter = new System.Data.OleDb.OleDbDataAdapter(query, conn))
				{
					var ds = new DataSet("CSV File");
					adapter.Fill(ds);
				}
			}*/


			Console.WriteLine ("Hello World!");
		}
	}
}
