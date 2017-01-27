using System;
using System.Data;
using System.IO;
using System.Text;

namespace mmria.console
{
	public class WriteCSV
	{
		public WriteCSV(string file_name)
		{
			var writer = new StreamWriter(file_name);

			/*
			var connection = new SqlConnection("Data Source=.\\SQLEXPRESS;AttachDbFilename=E:\\temp\\MyDatabaseData2.MDF;Integrated " +
										  "Security=True;Connect Timeout=30;User Instance=True");
			var command = new SqlCommand("select * from table_1;", connection);
			var dataAdapter = new SqlDataAdapter(command);
			*/
			var table = new DataTable("temp_table");
			//dataAdapter.Fill(table);
			if (table == null)
				System.Console.Write("temp_table is null");
			WriteCSV.WriteToStream(writer, table, true, true);

		}

		public static void WriteToStream(TextWriter stream, DataTable table, bool header, bool quoteall)
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

		private static void WriteItem(TextWriter stream, object item, bool quoteall)
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
