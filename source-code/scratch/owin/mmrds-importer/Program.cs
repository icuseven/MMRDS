using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Data;
using System.Linq;

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

			mmria.common.metadata.app metadata = MainClass.get_metadata();

			var mmrds_data = new cData(get_mdb_connection_string("mapping-file-set/Maternal_Mortality.mdb"));
			var directory_path = @"mapping-file-set";
			//var main_mapping_file_name = @"mapping-file-set/MMRDS-Mapping-NO-GRIDS-test.csv";
				var main_mapping_file_name = @"MMRDS-Mapping-NO-GRIDS-test.csv";
			var mapping_data = new cData(get_csv_connection_string(directory_path));

			var grid_mapping_file_name = @"grid-mapping-merge.csv";
			//var grid_mapping_data = new cData(get_csv_connection_string(System.IO.Path.GetDirectoryName(grid_mapping_file_name)));

			var rs = mmrds_data.GetDataTable("Select * from AutopsyReport");

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


			foreach (System.Data.DataRow row in rs2.Rows)
			{
				if (row[5].ToString().ToLower() == "grid")
				{

					var grid_table = mmrds_data.GetDataTable(string.Format("Select * from [{0}] Where 1=0", row[0].ToString().Replace(".", "")));
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
