using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
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
/*
			System.Console.WriteLine(case_data["_id"]);
			System.Console.WriteLine(case_data["home_record"]);
			System.Console.WriteLine(case_data["home_record"]["case_progress_report"]);
*/

			var mmrds_data = new cData(get_mdb_connection_string("mapping-file-set/Maternal_Mortality.mdb"));
			var directory_path = @"mapping-file-set";
			//var main_mapping_file_name = @"mapping-file-set/MMRDS-Mapping-NO-GRIDS-test.csv";
				var main_mapping_file_name = @"MMRDS-Mapping-NO-GRIDS-test.csv";
			var mapping_data = new cData(get_csv_connection_string(directory_path));

			var grid_mapping_file_name = @"grid-mapping-merge.csv";
			//var grid_mapping_data = new cData(get_csv_connection_string(System.IO.Path.GetDirectoryName(grid_mapping_file_name)));



			var id_list = new string[] {
				"d4234123-2322-4f46-99a8-5b936b1ec237",
				"0e602e72-4e67-404d-9a4b-e86e6793103d",
				"0e638e2c-cdf0-4829-bf9c-f33a86a5ef35",
				"0ed43157-48a2-4592-961c-6db57c8e83c7",
				"0fa4cad4-805d-45e5-b5e7-71eb33710765",
				"0fc0b3de-c964-4b95-b110-de0636f5ce3d"};

			var rs = mmrds_data.GetDataTable(string.Format("Select * from MaternalMortality Where GlobalRecordId in ('{0}')", string.Join("','", id_list)));

			foreach (System.Data.DataRow row in rs.Rows)
			{
				//if (row[5].ToString().ToLower() == "grid")
				//{
				Console.WriteLine(row[2].ToString());
				//}
			}


			var rs2 = mapping_data.GetDataTable("SELECT * FROM [" + main_mapping_file_name + "]");
			var rs3 = mapping_data.GetDataTable("SELECT * FROM [" + @"grid-mapping-merge.csv" + "]");
			//Path,BaseTable,DataTablePath,f.Name,prompttext,ft.Name,DataType,MMRIA Path,MMRIA Group Name,Comments,



				foreach (string global_record_id in id_list)
				{
					dynamic case_data = case_maker.create_default_object(metadata, new Dictionary<string, object>());

					foreach (System.Data.DataRow row in rs2.Rows)
					{
					if (row["MMRIA Path"] != DBNull.Value && !string.IsNullOrWhiteSpace(row["MMRIA Path"].ToString()) && row[5].ToString().ToLower() != "grid")
						{
							var grid_table = mmrds_data.GetDataTable(string.Format("Select {0} from [{1}] b inner join [{2}] p on b.GlobalRecordId = p.GlobalRecordId Where b.FKEY='{3}'", row["f#name"].ToString(), row["BaseTable"].ToString(), row["DataTablePath"].ToString(), global_record_id));
							if (grid_table.Rows.Count == 1)
							{
							
							case_maker.set_value(case_data, row["MMRIA Path"].ToString(), grid_table.Rows[0][0]);
							Console.WriteLine(string.Format("{0}", row["MMRIA Path"].ToString().Replace(",", "")));
							Console.WriteLine(string.Format("{0}, {1}, \"\"", row[0].ToString().Replace(".", ""), row["prompttext"].ToString().Replace(",", "")));
							foreach (System.Data.DataColumn c in grid_table.Columns)
							{

								if (c.ColumnName != "UniqueKey" &&
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
				}
				case_data_list.Add(case_data);
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


			Console.WriteLine("Hello World!");
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
