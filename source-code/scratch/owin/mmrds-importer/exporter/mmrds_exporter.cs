using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using mmria.console.data;

namespace mmria.console.import
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

				//var case_request = mmria.common.model.couchdb.

				//return;
				case_data_list.Add(case_data);
			}
			case_maker.flush_bad_mapping();

			Console.WriteLine("Hello World!");
			json_string = Newtonsoft.Json.JsonConvert.SerializeObject(case_data_list);

			System.IO.File.WriteAllText("output.json", json_string);

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
