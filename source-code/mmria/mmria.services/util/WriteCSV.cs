using System;
using System.Data;
using System.IO;
using System.Text;

namespace mmria.services.util
{
	public class WriteCSV
	{
		string file_name;

		public string File_Name { get { return file_name;}}
		string folder_name;
		DataTable table;
		public WriteCSV(string p_file_name, string p_folder_name, string p_export_directory)
		{
			//this.folder_name = System.IO.Path.Combine(System.Configuration.ConfigurationManager.AppSettings["export_directory"], p_folder_name);
			this.folder_name = System.IO.Path.Combine(p_export_directory, p_folder_name);
			this.file_name = p_file_name;
			/*
			var connection = new SqlConnection("Data Source=.\\SQLEXPRESS;AttachDbFilename=E:\\temp\\MyDatabaseData2.MDF;Integrated " +
										  "Security=True;Connect Timeout=30;User Instance=True");
			var command = new SqlCommand("select * from table_1;", connection);
			var dataAdapter = new SqlDataAdapter(command);
			*/
			table = new DataTable("temp_table");

			/*dataAdapter.Fill(table);
			if (table == null)
				System.Console.Write("temp_table is null");
				*/
		}

		public DataTable Table { get { return this.table; } }

		public void WriteToStream()
		{
			StreamWriter writer = new StreamWriter(folder_name + "/" + this.file_name);
			this.WriteToStream(writer, true, true);
		}

		private void WriteToStream(TextWriter stream, bool header, bool quoteall)
		{
			if (header)
			{
				for (int i = 0; i < table.Columns.Count; i++)
				{
					WriteItem(stream, table.Columns[i].Caption, quoteall);
					if (i < table.Columns.Count - 1)
						stream.Write(',');
					else
						stream.Write('\n');
				}
			}
			foreach (DataRow row in table.Rows)
			{
				for (int i = 0; i < table.Columns.Count; i++)
				{
					WriteItem(stream, row[i], quoteall);
					if (i < table.Columns.Count - 1)
						stream.Write(',');
					else
						stream.Write('\n');
				}
			}
			stream.Flush();
			stream.Close();
		}

		private void WriteItem(TextWriter stream, object item, bool quoteall)
		{
			if (item == null)
				return;
			string s = item.ToString();
			if (quoteall || s.IndexOfAny("\",\x0A\x0D".ToCharArray()) > -1)
				stream.Write("\"" + s.Replace("\"", "\"\"") + "\"");
			else
				stream.Write(s);
			stream.Flush();
		}
	}
}
